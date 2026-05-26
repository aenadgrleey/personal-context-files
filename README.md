# personal-ai-tools

Source of reusable agent setup for this repo.

This README is the main entry point for both humans and agents.

## Start here

- [`rtango-manifest.md`](./rtango-manifest.md) — exported reusable skills and collections
- [`pi-manifest.md`](./pi-manifest.md) — pi coding agent setup only
- [`.rtango/spec.yaml`](./.rtango/spec.yaml) — this repo's rtango config
- [`.pi/`](./.pi) — this repo's pi-specific config, chains, checks, and agents

## Agent workflow notes

- When importing prompts, skills, or collections from `personal-ai-tools`, read this README first.
- Use [`rtango-manifest.md`](./rtango-manifest.md) to see the current exported skills and collections.
- Do not rely on the local `skills/` tree alone when deciding what to sync.

## What this repo provides

- reusable skills and workflows
- curated rtango collections in `collections/` and import guidance
- pi extensions, checks, chains, and agent helpers
- shared interaction components plus a Telegram remote-interaction extension for pi
- Telegram config via `.pi/telegram.local.json` or `~/.pi/agent/telegram.local.json`, with `/telegram-config`, `/telegram-status`, `/telegram-toggle`, `/telegram-test`, `/telegram-attach`, and `/telegram-detach`, plus Telegram-side session control commands (`/new_session`, `/clear`, `/skills`, `/status`, `/refresh`, `/context`, `/detach`, `/help`, and published `/skill_<name>` aliases), a live working indicator that updates each turn with the latest tool call, project/global scope selection, single-session Telegram ownership, and automatic ownership transfer on local session switches after an explicit attach
- repo-specific conventions for agent work

## Bootstrapping another repo from this one

### Required first step

Before importing anything, inspect the target repository and determine:

1. the stack
2. the product/domain
3. existing repo conventions
4. whether rtango is already present
5. which exports from this repo are actually relevant

### Setup model

Keep responsibilities separate:

- use `rtango` for skills and instructions
- make sure rtango guidance is available for target agents: at minimum run `rtango init` first so the built-in rtango guidance is present; also include the `rtango` skill in the synced setup when that repo should have an explicit rtango skill available to agents
- use `pi install` for Pi package assets like extensions, chains, and checks
- before installing Pi package assets, inspect the current Pi setup and confirm the capability is not already provided by an existing global/package install
- include `.pi/checks.yaml` in the setup plan from the start when the target repo uses Pi
- keep local Pi preferences/secrets such as `.pi/codex-swap.local.json`, `.pi/telegram.local.json`, and `~/.pi/agent/telegram.local.json` as local setup, not exported rtango content

### Recommended workflow

1. Create or update the target repo's rtango config.
2. If `.rtango/` is absent, run `rtango init` before adding anything to the spec so the built-in rtango guidance is available.
3. If rtango is already initialized, update the existing spec instead of re-running `rtango init`.
4. Keep the config minimal and aligned with the target stack.
5. Import only the reusable assets that match the repo, and do not drop rtango guidance from the final setup.
6. Prefer `kind: collection` for grouped imports and pin the GitHub ref when practical; use individual skill rules only when a whole collection would be overkill.
7. Run `rtango status`.
8. Run `rtango sync`.
9. If the target repo uses Pi, first inspect the current Pi setup (for example `~/.pi/agent/settings.json` plus the installed Pi packages/extensions) to see what is already available globally or from an existing install.
10. Install only the missing Pi package assets via `pi install`, ensure `.pi/checks.yaml` is present as part of the setup, and then restore any local-only Pi preferences separately.
11. Leave a short summary of what was enabled, skipped, and why.

### Useful exports to consider

- default baseline: `general-agents`, `general-engineering`
- Android: `android-mvi-boilerplate`, `compose-slot-api`
- pi work: `pi-extension-development`, `pi-android-sandbox`
- GitHub flow: `github` collection or `github-pr` plus `yeet`
- GitLab flow: `gitlab` collection or `gitlab-mr` plus `yeet`

### What not to do

- Do not copy repo-local agents from this repository into the target repo.
- Do not pull in pi checks or chains outside pi.
- Do not manually copy Pi package assets when package install is the intended path.
- Do not install duplicate Pi packages/extensions when the needed capability is already present globally or from an existing install.
- Do not forget `.pi/checks.yaml` when setting up a Pi repo.
- Do not assume Android skills belong in a non-Android repo.
- Do not overwrite existing repo rules without checking local files first.
- Do not claim a setup succeeded if the target harness cannot support it.

### Expected output

When finished, report:

- detected stack/product
- rtango assets enabled
- assets skipped
- any missing harness support

## Harness rules

- If you are not using rtango yet, treat `rtango-manifest.md` as guidance only.
- If you are not running inside pi coding agent, do not try to install pi extensions, checks, or chains.
- If a capability is missing, skip that section and say so explicitly.
