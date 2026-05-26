# personal-context-files

Rtango rules and markdown-based content for agent workflows.

## Entry point

Read this README first for bootstrap/import guidance.

## What this repo provides

- rtango skill rules and collections (`.rtango/spec.yaml`)
- reusable skills in `skills/`
- curated collections in `collections/`
- agent prompt templates in `.pi/agents/`
- rtango skill and collection inventory (`rtango-manifest.md`)

TypeScript extensions and tooling live in `personal-pi-extensions/`.

## Useful exports

- default baseline: `general-agents`, `general-engineering`
- Android: `android-mvi-boilerplate`, `compose-slot-api`
- pi work: `pi-extension-development`, `pi-android-sandbox`
- GitHub flow: `github` collection or `github-pr` plus `yeet`
- GitLab flow: `gitlab` collection or `gitlab-mr` plus `yeet`

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
8. Install only the missing Pi package assets via `pi install`, ensure `.pi/checks.yaml` is present.
9. Leave a short summary of what was enabled, skipped, and why.

### What not to do

- Do not copy repo-local agents into the target repo.
- Do not pull in pi checks or chains outside pi.
- Do not assume Android skills belong in a non-Android repo.
- Do not overwrite existing repo rules without checking local files first.
- Do not claim a setup succeeded if the target harness cannot support it.

## Harness rules

- If you are not using rtango yet, treat `rtango-manifest.md` as guidance only.
- If the target harness does not support rtango, do not try to install it.
- If a capability is missing, skip that section and say so explicitly.

## Repo structure

```
personal-context-files/
├── skills/                  ← skill definitions (.md files)
├── collections/             ← rtango collection manifests (.yaml)
├── .pi/agents/              ← agent prompt templates (.md)
├── .rtango/spec.yaml        ← rtango configuration
├── rtango-manifest.md       ← exported skills and collections
├── AGENTS.md                ← agent directory
└── README.md                ← this file
```