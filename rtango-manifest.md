# rtango manifest

This file enumerates the skills and collections published in this repository.

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

### `github`

Repo-local GitHub collaboration skills: commit writing, GitHub PR creation, and the user-callable
`yeet` wrapper (`collections/github.yaml`).

### `gitlab`

Repo-local GitLab collaboration skills: commit writing, GitLab MR creation, and the user-callable
`yeet` wrapper (`collections/gitlab.yaml`).

## Repo-local agents

See [`README.md`](./README.md) for the current agent directory pointer.
These agents are repo-local examples and references, not reusable exports.
Do not copy them into another repository or modify the target repo by treating them as upstream assets.

## Harness limits

- If the target agent cannot modify files, use this only as a recommendation.
- If the target harness does not support rtango, do not try to install it.
- If the target harness is not pi, do not import pi extensions, checks, or chains.
- If a path or command does not exist in the target repo, report the missing capability instead of inventing a workaround.

## Setup guidance

For bootstrap/import instructions, use [`README.md`](./README.md) as the entry point and source of truth.
This manifest is only the export inventory.
