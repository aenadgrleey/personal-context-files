# personal-context-files

Rtango rules and markdown-based content for my personal Pi agent workflows.

This repository is aligned with my Pi setup: Pi runs with the Codex adapter from
`personal-pi-extensions`, uses Codex-style editing/shell tools, and keeps native
Codex `web.run` disabled in favor of the separate Pi web/documentation tools.

## Entry point

Read this README first for bootstrap/import guidance.

## What this repo provides

- rtango skill rules and collections (`.rtango/spec.yaml`)
- reusable skills in `skills/`
- curated collections in `collections/`
- agent prompt templates in `agents/`
- Pi checks in `checks.yaml`
- rtango skill and collection inventory (this file)

TypeScript extensions and tooling live in `personal-pi-extensions/`.

## Tool alignment

The agent templates in `agents/` are written for this personal Pi + Codex adapter setup.

- Code reading, repository search, builds, and tests: `exec_command`
- Interactive process stdin/polling: `write_stdin`
- File edits: `apply_patch`
- Local image inspection and generation: `view_image`, `image_generation`
- Web and docs lookup: `websearch`, `web_fetch`, `codesearch`, `context7`

Do not assume Pi's built-in `read`, `bash`, `edit`, or `write` tools are available to these
templates, and do not use Codex adapter native `web.run` here; it is intentionally disabled in
my setup.

## Checks

This repo uses Pi's root-level `checks.yaml` convention. The current check validates YAML with
`yamllint` and the repo-local `.yamllint` config:

```bash
bash scripts/check-yaml.sh
```

Install the CLI locally with Homebrew when setting up a new machine:

```bash
brew install yamllint
```

## Skills

### `rtango`

Explains how to use rtango to initialize, inspect, sync, and maintain agent setup across repos.

### `commit`

Creates agent-oriented git commit messages with human-focused subjects, agent-focused bodies,
ticket refs in the title, and a model `Co-authored-by:` trailer.

### `spec-driven-development`

Creates specs before coding. Use when starting a new project, feature, or significant change
and no specification exists yet.

### `pi-extension-development`

This skill provides best practices and resources for creating extensions for the pi coding agent.

### `pi-android-sandbox`

Setup pi sandbox for android (kmp) project.

### `android-mvi-boilerplate`

Generate Android MVI boilerplate for a new feature by first matching sibling feature patterns,
and only then falling back to concrete templates.

### `compose-slot-api`

Guides Jetpack Compose UI work with a strict slot-API approach: scoped slots for typed local DSLs
and plain slots only by explicit request.

### `github-pr`

Creates a reviewer-focused GitHub pull request from the current branch using `gh`.

### `gitlab-mr`

Creates a reviewer-focused GitLab merge request from the current branch using `glab`.

### `yeet`

User-callable handoff wrapper that commits current changes and then opens the matching PR or MR.

## Collections

These collection manifests live in `collections/`.

### `general-agents`

Curated upstream general-purpose agent skills (`collections/general-agents.yaml`).

### `general-engineering`

Curated upstream engineering workflow skills (`collections/general-engineering.yaml`).

### `dev-team`

Personal Pi + Codex adapter dev team (`collections/dev-team.yaml`):
scout, planner, worker, reviewer, and summarizer agent templates plus commit/PR/MR handoff skills.

### `grepai`

Lean official GrepAI skills for repo initialization plus daily local semantic code search:
ignore-pattern setup, search, tracing, watch daemon, GOB local file storage, and troubleshooting
(`collections/grepai.yaml`). Installation, embedding provider setup, MCP/editor setup, and heavier
storage backends are intentionally excluded.

### `github`

Repo-local GitHub collaboration skills: commit writing, GitHub PR creation, and the user-callable
`yeet` wrapper (`collections/github.yaml`).

### `gitlab`

Repo-local GitLab collaboration skills: commit writing, GitLab MR creation, and the user-callable
`yeet` wrapper (`collections/gitlab.yaml`).

## Repo-local agents

See [`AGENTS.md`](./AGENTS.md) for the current agent directory pointer.
These agents are repo-local examples and references, not reusable exports.
Do not copy them into another repository or modify the target repo by treating them as upstream assets.

## Harness limits

- If the target agent cannot modify files, use this only as a recommendation.
- If the target harness does not support rtango, do not try to install it.
- If the target harness is not pi, do not import pi extensions, checks, or chains.
- If a path or command does not exist in the target repo, report the missing capability instead of inventing a workaround.

## Bootstrapping another repo

### Required first step

Before importing anything, inspect the target repository:

1. the stack
2. the product/domain
3. existing repo conventions
4. whether rtango is already present
5. which exports from this repo are actually relevant

### Recommended workflow

1. Create or update the target repo's rtango config.
2. If `.rtango/` is absent, run `rtango init` before adding anything to the spec so the built-in rtango guidance is available.
3. If rtango is already initialized, update the existing spec instead of re-running `rtango init`.
4. Keep the config minimal and aligned with the target stack.
5. Import only the reusable assets that match the repo, and do not drop rtango guidance from the final setup.
6. Prefer `kind: collection` for grouped imports and pin the GitHub ref when practical; use individual skill rules only when a whole collection would be overkill.
7. Run `rtango status` then `rtango sync`.
8. Install only the missing Pi package assets via `pi install`.
9. Leave a short summary of what was enabled, skipped, and why.

### What not to do

- Do not copy repo-local agents into the target repo.
- Do not pull in pi checks or chains outside pi.
- Do not assume Android skills belong in a non-Android repo.
- Do not overwrite existing repo rules without checking local files first.
- Do not claim a setup succeeded if the target harness cannot support it.

## Repo structure

```
personal-context-files/
├── skills/                  ← skill definitions (.md files)
├── collections/             ← rtango collection manifests (.yaml)
├── agents/                  ← agent prompt templates (*.agent.md)
├── checks.yaml              ← Pi checks for this repo
├── .yamllint                ← yamllint configuration
├── scripts/check-yaml.sh    ← YAML validation script used by checks.yaml
├── .rtango/spec.yaml        ← rtango configuration
├── AGENTS.md                ← agent directory
└── README.md                ← this file (skills + collections inventory + bootstrap guide)
```
