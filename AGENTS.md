# AGENTS.md

## Purpose

`personal-context-files` provides rtango rules, skill definitions, collections, and agent
prompt templates for personal agent workflows.

TypeScript extensions and tooling live in `personal-pi-extensions/`.

## Repo Inventory

### Skills

- `skills/android-mvi-boilerplate/SKILL.md` — generate Android MVI boilerplate for a new feature
- `skills/compose-slot-api/SKILL.md` — guide Compose UI toward constrained/scoped slot APIs
- `skills/pi-extension-development/SKILL.md` — best practices and docs for building pi extensions
- `skills/pi-android-sandbox/SKILL.md` — Android/Java sandbox setup workflow
- `skills/commit/SKILL.md` — agent-oriented git commit message convention with model co-author trailer
- `skills/spec-driven-development/SKILL.md` — spec-first workflow for larger changes

### Collections

- `collections/general-agents.yaml` — curated upstream general-purpose agent skills
- `collections/general-engineering.yaml` — curated upstream engineering workflow skills
- `collections/grepai.yaml` — official creator-managed GrepAI semantic code search skills
- `collections/github.yaml` — repo-local GitHub collaboration skills
- `collections/gitlab.yaml` — repo-local GitLab collaboration skills

### Agent templates

- `.pi/agents/planner.md`
- `.pi/agents/reviewer.md`
- `.pi/agents/scout.md`
- `.pi/agents/summarizer.md`
- `.pi/agents/worker.md`

### Rtango

- `.rtango/spec.yaml` — this repo's rtango config
- `rtango-manifest.md` — exported skills and collections inventory

## Working Rules

- Keep changes focused and minimal.
- Update the relevant docs/specs when behavior changes.
- Treat skill `SKILL.md` files as the source of truth for their skill behavior.
- This repo uses rtango for shared agent skills/instructions.
- Treat `rtango init` as destructive once a repo is already initialized; do not re-run it unless explicitly wanted.
- For importing many rules from another repo, prefer `kind: collection` in `.rtango/spec.yaml` and pin the GitHub ref when practical.
- Avoid editing generated, vendor, or local-secret files unless explicitly needed.