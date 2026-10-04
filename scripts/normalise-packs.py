#!/usr/bin/env python3
"""Restore backticks on pack YAML scalars. The authoring heredoc drops them, and
`verify-integrity.py` [9] requires `item_id:` to be machine-parseable, so this is
run after every pack write rather than relying on the shell to preserve quoting."""
import pathlib, re, sys

changed = []
for fn in sorted(pathlib.Path(__file__).parent.glob("pack-les-*.md")):
    t = orig = fn.read_text()
    for key in ("item_id", "skill", "type", "prereq_lesson"):
        t = re.sub(rf"^{key}: ([A-Za-z][\w.]*)$", rf"{key}: `\1`", t, flags=re.M)
    if t != orig:
        fn.write_text(t); changed.append(fn.name)
print("normalised:", ", ".join(changed) or "(nothing to do)")
