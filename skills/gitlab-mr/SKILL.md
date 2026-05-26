---
name: gitlab-mr
description: Creates a reviewer-focused GitLab merge request from the current branch using `glab`. Use only when the user explicitly asks to open/create a GitLab MR or invokes `/skill:gitlab-mr`.
---

# GitLab MR

## Quick start
- Use only on explicit user request.
- Create an MR from the current branch with `glab mr create`.
- Optimize the title and description for reviewer comprehension.
- Summarize the most important changes and references, not every touched file.

## Workflow
1. Inspect branch state:
   - `git status --short`
   - `git branch --show-current`
2. Detect the target branch from repo defaults or `glab` output.
3. Collect review context:
   - `git diff --stat <target>...HEAD`
   - `git diff --name-only <target>...HEAD`
   - `git log --oneline <target>..HEAD`
4. Identify:
   - the main reviewer-visible outcome
   - the 2-5 most important changes
   - checks/tests run
   - relevant ticket refs, issues, specs, or docs
5. Draft a concise MR title:
   - outcome-first
   - include real ticket refs only when relevant
6. Draft the MR description in this shape:

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

7. Create the MR with `glab mr create`.
8. Return the MR URL plus the final title/description to the user.

## Rules
- Do not invent tickets, links, or verification.
- Group changes by review area instead of narrating the raw diff.
- Mention only the highest-signal implementation details.
- If the target branch is unclear, ask before creating the MR.
- If there are uncommitted changes, stop and ask whether the user wanted `yeet` instead.
