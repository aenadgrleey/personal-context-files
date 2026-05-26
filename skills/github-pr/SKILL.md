---
name: github-pr
description: Creates a reviewer-focused GitHub pull request from the current branch using `gh`. Use only when the user explicitly asks to open/create a GitHub PR or invokes `/skill:github-pr`.
---

# GitHub PR

## Quick start
- Use only on explicit user request.
- Create a PR from the current branch with `gh pr create`.
- Optimize the title and body for reviewer comprehension.
- Summarize the most important changes and references, not every touched file.

## Workflow
1. Inspect branch state:
   - `git status --short`
   - `git branch --show-current`
2. Detect the base branch from repo defaults or `gh` output.
3. Collect review context:
   - `git diff --stat <base>...HEAD`
   - `git diff --name-only <base>...HEAD`
   - `git log --oneline <base>..HEAD`
4. Identify:
   - the main reviewer-visible outcome
   - the 2-5 most important changes
   - checks/tests run
   - relevant ticket refs, issues, specs, or docs
5. Draft a concise PR title:
   - outcome-first
   - include real ticket refs only when relevant
6. Draft the PR body in this shape:

```md
## Summary
- main outcome
- why this change exists
- where reviewers should look first

## Key changes
- area/file group 1: important behavior or design change
- area/file group 2: important implementation detail
- area/file group 3: risk, migration, or compatibility note

## Verification
- checks/tests run

## References
- ticket / issue / spec / docs
```

7. Create the PR with `gh pr create`.
8. Return the PR URL plus the final title/body to the user.

## Rules
- Do not invent tickets, links, or verification.
- Group changes by review area instead of narrating the raw diff.
- Mention only the highest-signal implementation details.
- If the base branch is unclear, ask before creating the PR.
- If there are uncommitted changes, stop and ask whether the user wanted `yeet` instead.
