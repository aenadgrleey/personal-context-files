# AGENTS.md

## Purpose
`personal-ai-tools` is a repository for my personal utilities and agent workflows:
- TypeScript utilities and extensions in `pi-extensions/`
- reusable skills in `skills/`
- chain definitions in `.pi/chains/<chain-name>.yaml` (the filename is the chain name)

This repo exists to build, document, and iterate on my personal tools and automation helpers. Pi-related assets are included where useful, but the repo is not limited to pi coding-agent work.

## Repo Inventory

### External Pi packages

The global Pi setup also includes:
- `npm:@howaboua/pi-glm-via-anthropic`
- `npm:pi-hermes-memory`
- `npm:pi-web-access`
- this repo as `../../repos/mics/personal-ai-tools`

If `~/.pi/agent/settings.json` still mentions `message-queue`, remove it; that path is stale.
Before adding Pi package assets to another repo, inspect `~/.pi/agent/settings.json` and the current installed Pi packages/extensions first so you do not duplicate capabilities already available globally.

### Skills
- `skills/android-mvi-boilerplate/SKILL.md` — generate Android MVI boilerplate by matching local feature patterns first
- `skills/compose-slot-api/SKILL.md` — guide Compose UI toward constrained/scoped slot APIs and scope-based `OnUiEvent` routing
- `skills/pi-extension-development/SKILL.md` — best practices and docs for building pi extensions
- `skills/pi-android-sandbox/SKILL.md` — Android/Java sandbox setup workflow
- `skills/commit/SKILL.md` — agent-oriented git commit message convention with ticket refs and model co-author trailers
- `skills/spec-driven-development/SKILL.md` — spec-first workflow for larger changes

### Pi Extensions
- `pi-extensions/ask/` + `pi-extensions/ask-components/` — interactive question/answer UI tool
- `pi-extensions/plan/` + `pi-extensions/plan-components/` — phased plan review/save flow
- `pi-extensions/review/` + `pi-extensions/review-components/` — keep/revise decision review flow
- `pi-extensions/interaction-components/` — shared interaction contract, hub, and local provider
- `pi-extensions/telegram/` — Telegram remote-interaction extension built on the shared interaction components, with project/global config scope, single-session ownership, session-switch ownership transfer after explicit attach, local `/telegram-test`/`/telegram-attach`/`/telegram-detach` commands, Telegram-side session control (`/new_session`, `/clear`, `/skills`, `/status`, `/refresh`, `/context`, `/detach`, `/help`, published `/skill_<name>` aliases), and a live working indicator that updates each turn with the latest tool call
- `pi-extensions/indicators.ts` — footer/status indicator customization
- `pi-extensions/model-context/index.ts` — inject the active model into the system prompt, with latest-known fallback
- `pi-extensions/notify.ts` — desktop notification helper and commands
- `pi-extensions/compact/` — compact read, edit & write display (plain absolute paths, no content/diff)
- `pi-extensions/check.ts` — auto-runs tsc + biome + eslint after agent completes work
- `pi-extensions/auto-update/index.ts` — checks for pi updates on startup and updates in the background

## Development Tooling

### Config Files
- `tsconfig.json` — strict TypeScript config (`noEmit`, `strict`, `noUncheckedIndexedAccess`)
- `biome.json` — formatter + linter (tabs, double quotes, 100 char line width)
- `eslint.config.js` — flat config with TypeScript-aware rules (deeper semantic checks)

### Scripts (bun)
- `bun run tsc` — type check only
- `bun run lint` — biome + eslint
- `bun run format` — auto-fix formatting with biome
- `bun run check` — full pipeline (tsc → biome → eslint)

Package manager is **bun**. Use `bun install`, `bun add`, `bunx` — not npm/npx.

### Agent Auto-Check
The `check.ts` extension listens to `agent_end` and automatically runs all checks
after the agent finishes a task. Results appear as:
- A status bar summary (`✓ all checks pass` or per-tool breakdown)
- A notification on failure with the first few lines of output

You can also run `/check` manually at any time.

## Working Rules
- Keep changes focused and minimal.
- Update the relevant docs/specs when behavior changes.
- Treat chain docs (`chains-spec.md`, `chain-ui-vision.md`, `.pi/chains/`) as the source of truth for chaining work.
- Treat skill `SKILL.md` files as the source of truth for their skill behavior.
- This repo uses rtango for shared agent skills/instructions. For bootstrap/import guidance from this repo, use `README.md` as the main entry point. When bootstrapping a repo that does not have `.rtango/` yet, run `rtango init` before editing the spec so the built-in rtango skill/instructions are available; do not drop rtango guidance from the final target setup if that repo should expose it to agents. After changing `.rtango/spec.yaml` or shared skill files, run `rtango status` then `rtango sync`.
- Treat `rtango init` as destructive once a repo is already initialized; do not re-run it on an existing setup unless the user explicitly wants to regenerate `.rtango/spec.yaml`.
- For importing many rules from another repo, prefer `kind: collection` in `.rtango/spec.yaml` and pin the GitHub ref; use individual skill rules only when you need a few files.
- The rtango spec also includes collections (`collections/general-agents`, `collections/general-engineering`) for curated remote skills; treat their rendered `skills/` outputs as generated and let rtango manage them.
- Keep responsibilities separate when bootstrapping another repo from `personal-ai-tools`: use rtango for skills/instructions, use `pi install` for the Pi package assets (extensions, chains, checks), include `.pi/checks.yaml` in the setup plan from the start when Pi is in use, and keep local preference/secret files like `.pi/codex-swap.local.json`, `.pi/telegram.local.json`, and `~/.pi/agent/telegram.local.json` as local setup rather than exported rtango content.
- Before installing Pi package assets into a target repo, first inspect the current Pi setup (for example `~/.pi/agent/settings.json` and the installed Pi packages/extensions) and check whether the needed capability is already provided globally or by an existing install. Avoid redundant per-project installs when the same extension/package is already available.
- Avoid editing generated, vendor, or local-secret files like `node_modules/`, `.git/`, and `.env` unless explicitly needed.
- When adding or changing extension behavior, keep the implementation and documentation aligned.
- Run `bun run check` before committing to catch type errors and lint issues.
- Pre-existing strict-mode issues in older extensions are tracked as tech debt — fix when modifying those files.
