---
name: OpenAlex journal evidence
description: How to verify journal-level links when retrieving scholarly works from OpenAlex
---
OpenAlex work records may identify a journal source without including its homepage URL. Resolve the source ID through the OpenAlex sources endpoint before presenting a journal candidate; if no homepage is available, do not invent a journal link or score.

**Why:** Journal recommendations must remain traceable to real source evidence, and article DOI links are not substitutes for original journal pages.

**How to apply:** Keep journal candidates tied to retrieved records with a verified source homepage, and return an explicit insufficient-evidence state when the source metadata cannot be verified.