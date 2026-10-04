"""
Content Loader - Loads lessons, packs, and listening corpus from content repository.

Implements M1.2, M1.3, M1.4 from BACKLOG.
"""

import hashlib
import json
import re
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional, Set, Tuple

from pydantic import BaseModel, Field

from its_platform.config import get_settings

settings = get_settings()


class LessonMetadata(BaseModel):
    """Parsed lesson metadata from markdown frontmatter."""

    lesson_id: str
    module_id: str
    cefr_level: str
    title: str
    description: Optional[str] = None
    skill_domains: List[str] = Field(default_factory=list)
    prerequisites: List[str] = Field(default_factory=list)
    estimated_duration_min: int = 15
    reuse_basis: str = "cite_only"
    source_references: List[str] = Field(default_factory=list)
    content_hash: str


class PackMetadata(BaseModel):
    """Parsed pack metadata from markdown frontmatter."""

    pack_id: str
    lesson_id: str
    version: str
    schema_version: str
    item_count: int = 0
    skill_domains: List[str] = Field(default_factory=list)
    reuse_basis: str = "cite_only"
    content_hash: str


class ListeningDialogue(BaseModel):
    """Listening dialogue metadata."""

    dialogue_id: str
    title: str
    cefr_level: str
    duration_seconds: int
    speakers: List[str]
    status: str = "shipped"
    slots: List[Dict[str, Any]] = Field(default_factory=list)


class ContentLoader:
    """Loads and parses content from the content repository."""

    def __init__(self, content_root: Optional[Path] = None):
        self.content_root = content_root or Path(settings.CONTENT_REPO_PATH).resolve()
        self.lessons_dir = self.content_root / "lessons"
        self.packs_dir = self.content_root / "packs"
        self.corpus_path = self.content_root / "corpus" / "listening-corpus.md"
        self.specs_dir = self.content_root / "specs"

    def _compute_hash(self, content: str) -> str:
        """Compute SHA256 hash of content."""
        return hashlib.sha256(content.encode("utf-8")).hexdigest()

    def _parse_frontmatter(self, content: str) -> Tuple[Dict[str, Any], str]:
        """Parse YAML frontmatter from markdown content."""
        frontmatter = {}
        body = content

        if content.startswith("---"):
            parts = content.split("---", 2)
            if len(parts) >= 3:
                import yaml

                frontmatter = yaml.safe_load(parts[1]) or {}
                body = parts[2]

        return frontmatter, body.strip()

    def _extract_lesson_id_from_filename(self, filepath: Path) -> str:
        """Extract lesson ID from filename."""
        # Pattern: les_a1_greetings.md -> les_a1_greetings
        # Pattern: lesson-15min-workplace-greetings.md -> les_a2_greetings_intro (from content)
        stem = filepath.stem
        if stem.startswith("lesson-"):
            # Legacy format - would need mapping
            return stem
        return stem

    def load_lesson(self, filepath: Path) -> LessonMetadata:
        """Load and parse a single lesson file."""
        content = filepath.read_text(encoding="utf-8")
        content_hash = self._compute_hash(content)
        frontmatter, _ = self._parse_frontmatter(content)

        lesson_id = self._extract_lesson_id_from_filename(filepath)

        # Extract CEFR level from path (lessons/a1/..., lessons/b2/...)
        cefr_match = re.search(r"lessons/(a1|a2|b1|b2|remediation)/", str(filepath))
        cefr_level = cefr_match.group(1).upper() if cefr_match else "A1"

        # Extract module ID from path or frontmatter
        module_id = frontmatter.get("module_id", f"mod_{cefr_level.lower()}_general")

        return LessonMetadata(
            lesson_id=lesson_id,
            module_id=module_id,
            cefr_level=cefr_level,
            title=frontmatter.get("title", lesson_id),
            description=frontmatter.get("description"),
            skill_domains=frontmatter.get("skill_domains", []),
            prerequisites=frontmatter.get("prerequisites", []),
            estimated_duration_min=frontmatter.get("estimated_duration_min", 15),
            reuse_basis=frontmatter.get("reuse_basis", "cite_only"),
            source_references=frontmatter.get("source_references", []),
            content_hash=content_hash,
        )

    def load_all_lessons(self) -> List[LessonMetadata]:
        """Load all lesson files from content repository."""
        lessons = []
        if not self.lessons_dir.exists():
            return lessons

        for lesson_file in self.lessons_dir.rglob("*.md"):
            if lesson_file.name.startswith("."):
                continue
            try:
                lesson = self.load_lesson(lesson_file)
                lessons.append(lesson)
            except Exception as e:
                print(f"Warning: Failed to load lesson {lesson_file}: {e}")

        return lessons

    def _extract_pack_id_from_filename(self, filepath: Path) -> Tuple[str, str]:
        """Extract pack ID and version from filename."""
        # pack_les_a1_greetings_v1.md -> (pack_les_a1_greetings, v1)
        # pack-les-a2-email-basics.md -> (pack_les_a2_email_basics, v1) (legacy)
        stem = filepath.stem

        if stem.startswith("pack_les_"):
            # Canonical: pack_les_{lesson}_v{version}
            match = re.match(r"(pack_les_.+)_v(\d+)$", stem)
            if match:
                return match.group(1), f"v{match.group(2)}"
        elif stem.startswith("pack-les-"):
            # Legacy: pack-les-{lesson}-{type}.md
            # Convert to canonical format
            canonical = stem.replace("pack-les-", "pack_les_").replace("-", "_")
            return canonical, "v1"

        return stem, "v1"

    def load_pack(self, filepath: Path) -> PackMetadata:
        """Load and parse a single pack file."""
        content = filepath.read_text(encoding="utf-8")
        content_hash = self._compute_hash(content)
        frontmatter, body = self._parse_frontmatter(content)

        pack_id, version = self._extract_pack_id_from_filename(filepath)

        # Count items in pack (### ITEM blocks)
        item_count = len(re.findall(r"^### ITEM\s+", body, re.MULTILINE))

        # Determine lesson_id from pack_id
        lesson_match = re.match(r"pack_les_(.+)_v\d+", pack_id)
        if lesson_match:
            lesson_id = f"les_{lesson_match.group(1)}"
        else:
            # Legacy format
            lesson_id = pack_id.replace("pack_", "les_").replace("_v1", "")

        return PackMetadata(
            pack_id=pack_id,
            lesson_id=lesson_id,
            version=version,
            schema_version=frontmatter.get("schema_version", "canonical"),
            item_count=item_count,
            skill_domains=frontmatter.get("skill_domains", []),
            reuse_basis=frontmatter.get("reuse_basis", "cite_only"),
            content_hash=content_hash,
        )

    def load_all_packs(self) -> List[PackMetadata]:
        """Load all pack files from content repository."""
        packs = []
        if not self.packs_dir.exists():
            return packs

        for pack_file in self.packs_dir.rglob("*.md"):
            if pack_file.name.startswith("."):
                continue
            try:
                pack = self.load_pack(pack_file)
                packs.append(pack)
            except Exception as e:
                print(f"Warning: Failed to load pack {pack_file}: {e}")

        return packs

    def load_listening_corpus(self) -> List[ListeningDialogue]:
        """Load listening corpus from markdown file."""
        dialogues = []
        if not self.corpus_path.exists():
            return dialogues

        content = self.corpus_path.read_text(encoding="utf-8")

        # Parse dialogues using regex for ## Dialogue: {id} sections
        dialogue_pattern = r"^## Dialogue:\s+(\S+)\s*\n(.*?)(?=^## Dialogue:|\Z)"
        matches = re.findall(dialogue_pattern, content, re.MULTILINE | re.DOTALL)

        for dialogue_id, dialogue_content in matches:
            # Extract metadata from dialogue content
            frontmatter, _ = self._parse_frontmatter(dialogue_content)

            # Count slots (### SLOT blocks)
            slots = []
            slot_pattern = r"^### SLOT\s+(\S+)\s*\n(.*?)(?=^### SLOT|\Z)"
            slot_matches = re.findall(slot_pattern, dialogue_content, re.MULTILINE | re.DOTALL)
            for slot_id, slot_content in slot_matches:
                slot_fm, _ = self._parse_frontmatter(slot_content)
                slots.append({"slot_id": slot_id, **slot_fm})

            dialogues.append(
                ListeningDialogue(
                    dialogue_id=dialogue_id,
                    title=frontmatter.get("title", dialogue_id),
                    cefr_level=frontmatter.get("cefr_level", "A1"),
                    duration_seconds=frontmatter.get("duration_seconds", 60),
                    speakers=frontmatter.get("speakers", ["v_a", "v_b"]),
                    status=frontmatter.get("status", "shipped"),
                    slots=slots,
                )
            )

        return dialogues

    def validate_content_integrity(self) -> Dict[str, Any]:
        """Run content integrity validation - mirrors verify-integrity.py checks."""
        lessons = self.load_all_lessons()
        packs = self.load_all_packs()
        dialogues = self.load_listening_corpus()

        lesson_ids = {l.lesson_id for l in lessons}
        pack_lesson_ids = {p.lesson_id for p in packs}

        return {
            "lessons": {
                "total": len(lessons),
                "by_cefr": self._count_by_cefr(lessons),
                "unique_ids": len(lesson_ids),
            },
            "packs": {
                "total": len(packs),
                "unique_lesson_coverage": len(pack_lesson_ids),
                "lessons_without_packs": sorted(lesson_ids - pack_lesson_ids),
            },
            "listening": {
                "dialogues": len(dialogues),
                "total_slots": sum(len(d.slots) for d in dialogues),
                "by_cefr": self._count_by_cefr_listening(dialogues),
            },
            "validation": {
                "all_lessons_have_packs": len(lesson_ids - pack_lesson_ids) == 0,
                "no_duplicate_lesson_ids": len(lessons) == len(lesson_ids),
                "no_duplicate_pack_ids": len(packs) == len({p.pack_id for p in packs}),
            },
        }

    def _count_by_cefr(self, lessons: List[LessonMetadata]) -> Dict[str, int]:
        counts = {}
        for l in lessons:
            counts[l.cefr_level] = counts.get(l.cefr_level, 0) + 1
        return counts

    def _count_by_cefr_listening(self, dialogues: List[ListeningDialogue]) -> Dict[str, int]:
        counts = {}
        for d in dialogues:
            counts[d.cefr_level] = counts.get(d.cefr_level, 0) + 1
        return counts