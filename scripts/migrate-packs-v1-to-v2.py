#!/usr/bin/env python3
"""
Migrate v1 pack markdown files to v2 JSON schema (assessment-item-spec.md §1).

v1 format: Markdown with frontmatter-like header + markdown tables per item
v2 format: JSON with schema_version 2.0, structured items with all required fields

Usage: python3 migrate-packs-v1-to-v2.py --dry-run  # preview
       python3 migrate-packs-v1-to-v2.py            # execute
"""

import json
import re
import pathlib
import sys
from dataclasses import dataclass, asdict
from typing import List, Optional, Dict, Any
from datetime import datetime

PACKS_DIR = pathlib.Path(__file__).parent.parent / "packs"
OUTPUT_DIR = PACKS_DIR / "v2"

# Domain mapping from v1 domain names to v2 domain enum
DOMAIN_MAP = {
    "vocab": "vocabulary",
    "grammar": "grammar",
    "reading": "reading",
    "listening": "listening",
    "pronunciation": "pronunciation",
    "writing": "writing",
    "speaking": "speaking",
}

def clean_markdown(text: str) -> str:
    """Remove markdown bold/italic markers from text."""
    text = re.sub(r'\*\*(.*?)\*\*', r'\1', text)
    text = re.sub(r'\*(.*?)\*', r'\1', text)
    return text.strip()

@dataclass
class V1Item:
    item_id: str
    domain: str
    level: str
    stem: str
    options: List[str]
    key: str
    br_pt_form: Optional[str] = None
    distractor_notes: List[str] = None

@dataclass
class V1Pack:
    pack_id: str
    lesson: str
    items: List[V1Item]
    reuse_basis: str
    items_count: int
    time_cap: int
    split: str
    interleaved: bool

def clean_markdown(text: str) -> str:
    """Remove markdown bold/italic markers from text."""
    text = re.sub(r'\*\*(.*?)\*\*', r'\1', text)
    text = re.sub(r'\*(.*?)\*', r'\1', text)
    return text.strip()

def parse_v1_pack(content: str, pack_id: str) -> Optional[V1Pack]:
    """Parse v1 markdown pack into structured data."""
    lines = content.split('\n')
    
    # Extract frontmatter-like header - skip leading non-header lines
    header = {}
    i = 0
    # Skip leading non-header lines (like title)
    while i < len(lines) and not (lines[i].startswith('**') or lines[i].strip() == '---'):
        i += 1
    
    # Extract frontmatter-like header - continue until we hit a line that's not ** or ---
    # Allow empty lines within header
    while i < len(lines):
        line = lines[i].strip()
        if line.startswith('**'):
            if ':' in line and not line.startswith('###'):
                key, val = line.split(':', 1)
                key = key.strip('* ').lower().replace(' ', '_')
                val = val.strip()
                # Remove leading ** from value if present
                if val.startswith('**'):
                    val = val[2:].lstrip()
                # Remove surrounding backticks
                val = val.strip('`')
                header[key] = val
        elif line.strip() == '---':
            # End of header
            i += 1
            break
        elif line == '':
            # Empty line within header - continue
            pass
        else:
            # Non-header line - end of header
            break
        i += 1
    
    # Fix lesson extraction - remove .md extension and backticks
    lesson = header.get('lesson', '')
    if lesson:
        lesson = lesson.strip('`')
        if lesson.endswith('.md'):
            lesson = lesson[:-3]
    
    # Parse items
    items = []
    current_item = {}
    in_item = False
    
    for line in lines[i:]:
        if line.startswith('### ITEM'):
            if in_item and current_item:
                items.append(V1Item(**current_item))
            current_item = {'item_id': '', 'domain': '', 'level': '', 'stem': '', 'options': [], 'key': '', 'br_pt_form': None, 'distractor_notes': []}
            in_item = True
            continue
        
        if not in_item:
            continue
            
        if line.startswith('**item_id:**'):
            current_item['item_id'] = line.split('**item_id:**')[1].strip().strip('`')
        elif line.startswith('**domain:**'):
            current_item['domain'] = line.split('**domain:**')[1].strip().strip('`')
        elif line.startswith('**level:**'):
            current_item['level'] = line.split('**level:**')[1].strip().strip('`')
        elif line.startswith('**stem:**'):
            current_item['stem'] = clean_markdown(line.split('**stem:**')[1].strip())
        elif line.startswith('| Slot') or line.startswith('|---'):
            continue
        elif line.startswith('| ') and '|' in line and not line.startswith('| **Key'):
            # Option row
            parts = [p.strip() for p in line.split('|')[1:-1]]
            if len(parts) >= 2:
                opt_key = parts[0].strip()
                opt_val = parts[1].strip()
                if opt_key not in ['A', 'B', 'C', 'D', 'E', 'F']:
                    continue
                current_item.setdefault('options', []).append(f"{opt_key}: {clean_markdown(opt_val)}")
        elif line.startswith('| **Key:**') or line.startswith('**Key:**'):
            if 'Key:' in line:
                current_item['key'] = line.split('Key:')[-1].strip().strip('|').strip()
            else:
                current_item['key'] = line.split('**Key:**')[-1].strip().strip('|').strip()
        elif '**br_pt_form:**' in line:
            current_item['br_pt_form'] = clean_markdown(line.split('**br_pt_form:**')[-1].strip().strip('"'))
        elif line.strip() == '---' or line.startswith('### ITEM') or (line.startswith('###') and 'ITEM' in line):
            if current_item.get('item_id'):
                items.append(V1Item(**current_item))
            current_item = {'item_id': '', 'domain': '', 'level': '', 'stem': '', 'options': [], 'key': '', 'br_pt_form': None, 'distractor_notes': []}
            in_item = True
    
    if current_item.get('item_id'):
        items.append(V1Item(**current_item))
    
    # Extract header info
    reuse_basis = header.get('reuse_basis', 'cite_only')
    lesson = header.get('lesson', '')
    if lesson and lesson.endswith('.md'):
        lesson = lesson[:-3]
    items_count_str = header.get('items', str(len(items))).strip('`* ')
    items_count = int(items_count_str) if items_count_str.isdigit() else len(items)
    time_cap = int(header.get('time_cap', '4 min').split()[0]) if 'time_cap' in header else 4
    split = header.get('split', '')
    interleaved = header.get('interleaved', 'yes').lower() == 'yes'
    
    return V1Pack(
        pack_id=pack_id,
        lesson=lesson,
        items=items,
        reuse_basis=reuse_basis,
        items_count=items_count,
        time_cap=time_cap,
        split=split,
        interleaved=interleaved
    )

def infer_item_type(domain: str, level: str) -> str:
    """Infer item type from domain and level."""
    if domain == 'pronunciation':
        return 'asr_phoneme_match'
    if domain == 'listening':
        return 'minimal_pair'
    if domain == 'grammar':
        return 'form_selection'
    if domain == 'vocabulary':
        return 'definition_match'
    if domain == 'reading':
        return 'cloze'
    return 'cloze'

def infer_distractor_types(options: List[str], key: str, domain: str) -> List[Dict]:
    """Infer distractor types based on BR-PT interference patterns."""
    distractors = []
    for opt in options:
        if ':' in opt:
            opt_text = opt.split(':', 1)[1].strip()
        else:
            opt_text = opt
        if opt_text == key:
            continue
        # Simple heuristic - in reality this needs human review
        distractor_type = "semantic_plausible"
        if domain == "grammar":
            distractor_type = "overgeneralization"
        elif domain == "vocabulary":
            distractor_type = "semantic_plausible"
        distractors.append({
            "option": opt_text,
            "type": distractor_type,
            "br_pt_form": "",
            "expected_share": 0.25
        })
    return distractors

def convert_v1_to_v2(v1_pack: V1Pack) -> Dict[str, Any]:
    """Convert V1Pack to v2 JSON schema."""
    items_v2 = []
    
    for item in v1_pack.items:
        domain_v2 = DOMAIN_MAP.get(item.domain, item.domain)
        item_type = infer_item_type(domain_v2, item.level)
        
        # Parse options
        options = []
        for opt in item.options:
            if ':' in opt:
                opt_text = opt.split(':', 1)[1].strip()
            else:
                opt_text = opt
            options.append(clean_markdown(opt_text))
        
        clean_key = item.key.strip().strip('*').strip()
        
        distractors = infer_distractor_types(options, clean_key, item.domain)
        
        item_v2 = {
            "item_id": item.item_id,
            "schema_version": "2.0",
            "skill_ids": [f"{item.domain}.{item.item_id.split('.')[-1]}"] if '.' in item.item_id else [f"{item.domain}.general"],
            "lesson_id": v1_pack.lesson or "",
            "cefr": item.level,
            "domain": domain_v2,
            "type": item_type,
            "modality": "text" if item.domain != "pronunciation" and item.domain != "listening" else "audio",
            "stem": item.stem,
            "options": options,
            "key": clean_key,
            "n_options": len(options),
            "distractors": distractors,
            "br_pt_tags": [f"{item.domain}:{item.item_id.split('.')[-1]}"],
            "calibration": {
                "status": "expert_anchored",
                "a": 1.2,
                "b": -0.5,
                "c": 0.0,
                "n_responses": 0,
                "a_se": None,
                "b_se": None,
                "anchored_by": ["migration_script"],
                "last_refit": None
            },
            "quality": {
                "infit_mnsq": None,
                "outfit_mnsq": None,
                "point_biserial": None,
                "difficulty_p": None,
                "dif_flags": [],
                "retired": False,
                "retired_reason": None
            },
            "provenance": {
                "kind": "source_derived",
                "source_file": v1_pack.pack_id.replace("pack_", "") + ".md",
                "source_locator": "migrated from v1",
                "authored": None,
                "reviewed_by": None
            },
            "assets": { "tts_required": False, "tts_refs": [], "assist_tts_refs": [] },
            "metadata": {
                "estimated_time_sec": 15,
                "p_random": 0.25,
                "authored_at": datetime.now().isoformat(),
                "review_due": "2027-03-30"
            }
        }
        items_v2.append(item_v2)
    
    pack_v2 = {
        "pack_id": v1_pack.pack_id.replace("_v1", "_v2"),
        "schema_version": "2.0",
        "lesson_id": v1_pack.lesson or "",
        "reuse_basis": v1_pack.reuse_basis,
        "items": items_v2,
        "manifest": {
            "title": v1_pack.pack_id.replace("pack_", "").replace("_v1", "").replace("_", " ").title(),
            "time_cap_minutes": v1_pack.time_cap,
            "split": v1_pack.split,
            "interleaved": v1_pack.interleaved,
            "item_count": len(items_v2)
        },
        "version": "2.0",
        "migrated_at": datetime.now().isoformat()
    }
    
    return pack_v2

def main():
    dry_run = "--dry-run" in sys.argv
    
    if not PACKS_DIR.exists():
        print(f"Packs directory not found: {PACKS_DIR}")
        return 1
    
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    v1_files = sorted(PACKS_DIR.rglob("*_v1.md"))
    print(f"Found {len(v1_files)} v1 pack files")
    
    if not v1_files:
        return 0
    
    migrated = 0
    errors = []
    
    for v1_file in v1_files:
        pack_id = v1_file.stem
        try:
            content = v1_file.read_text(encoding='utf-8')
            v1_pack = parse_v1_pack(content, pack_id)
            if not v1_pack or not v1_pack.items:
                errors.append(f"{pack_id}: No items parsed")
                continue
            
            v2_pack = convert_v1_to_v2(v1_pack)
            
            output_file = OUTPUT_DIR / f"{v1_pack.pack_id.replace('_v1', '_v2')}.json"
            
            if not dry_run:
                output_file.write_text(json.dumps(v2_pack, indent=2, ensure_ascii=False))
                print(f"  ✓ Migrated: {v1_file.name} -> {output_file.name} ({len(v2_pack['items'])} items)")
            else:
                print(f"  [dry-run] Would migrate: {v1_file.name} -> {output_file.name} ({len(v2_pack['items'])} items)")
            
            migrated += 1
            
        except Exception as e:
            errors.append(f"{pack_id}: {e}")
    
    print(f"\n{'Dry run: ' if dry_run else ''}Migration complete: {migrated}/{len(v1_files)} packs")
    if errors:
        print(f"Errors: {len(errors)}")
        for err in errors:
            print(f"  ✗ {err}")
    
    return 0 if not errors else 1

if __name__ == "__main__":
    sys.exit(main())