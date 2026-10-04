"""
Unit tests for Content Loader.
"""

import tempfile
from pathlib import Path

import pytest

from its_platform.content.loader import ContentLoader, LessonMetadata, PackMetadata


class TestContentLoader:
    """Test content loader functionality."""

    def test_load_lesson_from_markdown(self, tmp_path: Path):
        """Test loading a lesson with frontmatter."""
        lesson_dir = tmp_path / "lessons" / "a1"
        lesson_dir.mkdir(parents=True)

        lesson_file = lesson_dir / "les_a1_greetings.md"
        lesson_file.write_text("""---
title: "Greetings and Introductions"
module_id: "mod_a1_foundation"
skill_domains: ["vocabulary", "speaking"]
prerequisites: []
estimated_duration_min: 15
reuse_basis: "cite_only"
source_references: []
---
# Greetings

Content here...
""")

        loader = ContentLoader(content_root=tmp_path)
        lesson = loader.load_lesson(lesson_file)

        assert isinstance(lesson, LessonMetadata)
        assert lesson.lesson_id == "les_a1_greetings"
        assert lesson.module_id == "mod_a1_foundation"
        assert lesson.cefr_level == "A1"
        assert lesson.title == "Greetings and Introductions"
        assert "vocabulary" in lesson.skill_domains
        assert lesson.reuse_basis == "cite_only"
        assert len(lesson.content_hash) == 64  # SHA256

    def test_load_pack_canonical(self, tmp_path: Path):
        """Test loading a canonical pack."""
        pack_dir = tmp_path / "packs" / "a1"
        pack_dir.mkdir(parents=True)

        pack_file = pack_dir / "pack_les_a1_greetings_v1.md"
        pack_file.write_text("""---
schema_version: "canonical"
skill_domains: ["vocabulary"]
reuse_basis: "cite_only"
---
### ITEM item_001
**Question:** Hello!

### ITEM item_002
**Question:** Hi there!
""")

        loader = ContentLoader(content_root=tmp_path)
        pack = loader.load_pack(pack_file)

        assert isinstance(pack, PackMetadata)
        assert pack.pack_id == "pack_les_a1_greetings"
        assert pack.lesson_id == "les_a1_greetings"
        assert pack.version == "v1"
        assert pack.schema_version == "canonical"
        assert pack.item_count == 2

    def test_load_pack_legacy(self, tmp_path: Path):
        """Test loading a legacy pack format."""
        pack_dir = tmp_path / "packs" / "a2"
        pack_dir.mkdir(parents=True)

        pack_file = pack_dir / "pack-les-a2-email-basics.md"
        pack_file.write_text("""---
schema_version: "legacy"
reuse_basis: "cite_only"
---
### ITEM item_001
**Question:** Email test
""")

        loader = ContentLoader(content_root=tmp_path)
        pack = loader.load_pack(pack_file)

        assert pack.pack_id == "pack_les_a2_email_basics"
        assert pack.schema_version == "legacy"

    def test_validate_content_integrity(self, tmp_path: Path):
        """Test content integrity validation."""
        # Create test structure
        (tmp_path / "lessons" / "a1").mkdir(parents=True)
        (tmp_path / "lessons" / "a2").mkdir(parents=True)
        (tmp_path / "packs" / "a1").mkdir(parents=True)
        (tmp_path / "packs" / "a2").mkdir(parents=True)

        # Lesson 1
        (tmp_path / "lessons" / "a1" / "les_a1_greetings.md").write_text("""---
title: "Greetings"
module_id: "mod_a1_foundation"
skill_domains: ["vocabulary"]
reuse_basis: "cite_only"
---
Content
""")

        # Lesson 2
        (tmp_path / "lessons" / "a2" / "les_a2_email.md").write_text("""---
title: "Email Basics"
module_id: "mod_a2_communication"
skill_domains: ["writing"]
reuse_basis: "cite_only"
---
Content
""")

        # Pack for lesson 1
        (tmp_path / "packs" / "a1" / "pack_les_a1_greetings_v1.md").write_text("""---
schema_version: "canonical"
reuse_basis: "cite_only"
---
### ITEM item_001
**Question:** Test
""")

        # Pack for lesson 2
        (tmp_path / "packs" / "a2" / "pack-les-a2-email-basics.md").write_text("""---
schema_version: "legacy"
reuse_basis: "cite_only"
---
### ITEM item_001
**Question:** Test
""")

        loader = ContentLoader(content_root=tmp_path)
        result = loader.validate_content_integrity()

        assert result["lessons"]["total"] == 2
        assert result["lessons"]["by_cefr"]["A1"] == 1
        assert result["lessons"]["by_cefr"]["A2"] == 1
        assert result["packs"]["total"] == 2
        assert result["validation"]["all_lessons_have_packs"] is True
        assert result["validation"]["no_duplicate_lesson_ids"] is True
        assert result["validation"]["no_duplicate_pack_ids"] is True