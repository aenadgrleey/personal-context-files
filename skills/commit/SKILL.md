---
name: commit
description: Creates agent-oriented git commit messages with human-focused subjects, ticket refs only when relevant, and a model `Co-authored-by:` trailer. Use when preparing commits for agent-made changes or when the user asks for commit-message help.
---

# Commit

## Quick start
- Always write both a subject and a body.
- Subject: human-oriented summary, max 72 chars including ticket refs.
- Body: agent-oriented details, wrap at 100 chars.
- If a ticket is actually relevant, include its ref in the subject; otherwise omit ticket refs entirely.
- Append `Co-authored-by:` using the provider email registry, with synthetic fallback.

## Workflows
### Draft one commit
1. Review the staged diff and identify the real outcome.
2. Extract ticket refs from the branch, prompt, or context.
3. Write a specific subject focused on the visible outcome.
4. Write a short body covering:
   - what changed
   - implementation notes or constraints
   - checks/tests run, or why validation was skipped
5. Append the model trailer using the provider registry, or synthetic fallback if unmatched.
6. Re-read and shorten any vague or overlong lines.
7. If the user asked to commit, actually create the git commit with the drafted message instead of only proposing it.

### Decide whether to split into several commits
Split when changes have different purposes or should be reviewed independently.

Prefer separate commits for:
- refactor vs behavior change
- mechanical renames/formatting vs logic changes
- tests vs implementation when each makes sense independently
- unrelated tickets
- docs/spec work not tightly coupled to code

Keep changes together when they are only understandable as one atomic change.
If one focused subject cannot describe the whole diff, split it.

## Rules
- Start the subject from the user-visible or reviewer-visible outcome.
- Avoid vague subjects like `fix stuff`, `updates`, or `misc cleanup`.
- Preserve the repo's existing ticket style when a real ticket exists; if none is obvious and no ticket
  is needed, do not invent one.
- If multiple ticket refs do not fit in the subject, keep the primary refs there and move the
  rest to the body.
- Do not paste raw diff chunks or long command output into the body.
- Include details useful for later agents: added/renamed files, edge cases, and deferred work.

## Provider registry
Use `provider-email-registry.json` in this skill directory.

Resolve the trailer email in this order:
1. Match the provider key or one of its `matchers` from the model name.
2. Use the registry email for that provider.
3. If nothing matches, use the synthetic fallback:
   `<sanitized-model-name@models.pi.local>`

This registry is a project convention for commit trailers. `matchers` means alternate strings
that should resolve to the same provider. The provider emails do not need to be real inboxes or
GitHub identities.

## Model trailer
Format:
```text
Co-authored-by: <model-display-name> <resolved-email>
```

Provider-backed example:
```text
Co-authored-by: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
```

Synthetic fallback example:
```text
Co-authored-by: some-new-model <some-new-model@models.pi.local>
```

Sanitize the synthetic fallback local part by replacing characters outside `[A-Za-z0-9._-]` with
`-`.

## Example
```text
[APP-241] Show active model in the bottom bar

- inject the latest-known model into indicator state and refresh it on model changes
- keep the previous value as a fallback when the live model is temporarily unavailable
- checks: bun run tsc, bun run lint:biome

Co-authored-by: openai-codex/gpt-5.4 <noreply@openai.com>
```
