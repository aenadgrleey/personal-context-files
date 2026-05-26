---
name: yeet
description: Commits the current branch changes and then opens a reviewer-focused PR or MR using the appropriate CLI workflow. Use only when the user explicitly says "yeet" or asks to commit and open a PR/MR.
disable-model-invocation: true
---

# Yeet

## Quick start
- User-callable only.
- Purpose: final handoff for current branch work.
- Sequence: commit first, then open a PR or MR.
- Reuse the `commit` skill plus either `github-pr` or `gitlab-mr`.

## Workflow
1. Determine the host and CLI:
   - GitHub → use `github-pr` with `gh`
   - GitLab → use `gitlab-mr` with `glab`
2. Review current changes and decide whether they belong in one commit.
3. If the diff should be split into multiple commits, stop and ask.
4. Run the `commit` workflow:
   - inspect the diff
   - draft subject + body
   - create the actual git commit
5. Immediately run the matching PR/MR workflow:
   - `github-pr` for GitHub
   - `gitlab-mr` for GitLab
6. Return:
   - commit SHA
   - PR/MR URL
   - final commit subject
   - final PR/MR title

## Rules
- Do not run automatically.
- Use only on explicit user instruction.
- Do not create a PR/MR without committing first.
- If the host is unclear, ask before creating the PR/MR.
- If the working tree is empty, stop and report that there is nothing to yeet.
