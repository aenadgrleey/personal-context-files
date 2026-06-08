---
name: subagent-orchestration
description: Use this skill when a coding task may benefit from Pi subagents for reconnaissance, planning, implementation, review, testing, or summarization. It teaches the parent agent to delegate bounded work and synthesize results instead of duplicating subagent work.
---

# Subagent Orchestration

## When to Use
Use subagents when the task is non-trivial and one or more parts are:

- read-heavy or spread across many files;
- likely to pollute the parent context with search output, logs, or exploratory notes;
- independently verifiable;
- improved by fresh context, adversarial review, or role separation;
- safely parallelizable because the work streams are independent.

Avoid subagents when the work is a tiny one-file edit, a simple local inspection, sensitive/secret handling, or write-heavy work where parallel agents may conflict.

## Core Rule
The parent is the orchestrator and synthesizer, not a competing scout.

Delegate only bounded work. Give every subagent an objective, scope, constraints, expected output, and validation criteria. Wait for the result, judge whether it completed the contract, and either act on it, rerun a narrower task, or explicitly switch strategy.

For normal coding-agent work, the parent may still do small direct tasks when delegation overhead is larger than the work. For an explicitly requested **pure orchestration** mode, the parent must delegate all reading, searching, command execution, editing, testing, and validation to subagents, keeping only decomposition, todo tracking, result evaluation, and user communication in the parent context.

## Agent Registry Discipline
Before relying on role names, inspect or know the available subagents for the current harness. Use the exact runtime identifier required by the tool, which may be the file stem rather than the display name.

Maintain a small mental registry:

- **Researcher / Scout / Explore**: read-only discovery, pattern extraction, dependency mapping.
- **Planner**: phased implementation plan from gathered context.
- **Worker / SWE**: bounded implementation, file edits, terminal commands, tests.
- **Reviewer**: read-only validation, spec compliance, regressions, edge cases.
- **Summarizer**: compresses long findings or logs.

Do not use a reviewer for initial research. Do not ask a worker to rediscover the whole codebase if a researcher already produced structured findings.

## Standard Workflow
1. Decide whether delegation is worth the overhead.
2. Choose the smallest useful role:
   - **Scout / Explore**: read-only codebase reconnaissance; returns relevant files, current flow, risks, and where to edit.
   - **Planner**: turns context into a phased implementation plan.
   - **Worker**: makes bounded edits after the plan and scope are clear.
   - **Reviewer**: fresh-context review for correctness, edge cases, compatibility, and simplicity.
   - **Summarizer**: compresses findings, logs, or long discussions.
3. Prompt the subagent with an explicit contract.
4. Do not do the same reconnaissance in parallel in the parent unless you announce a strategy switch.
5. Validate the subagent result:
   - Treat “shallow discovery”, “tool failures”, “turn limit”, or “recommended next commands” as partial or failed results.
   - If the result is partial, rerun a narrower subagent task or tell the user you are switching to manual work.
6. Before editing, the parent must still read the exact target file regions and make minimal, verified edits.
7. For meaningful implementation risk, run a review loop: writer subagent or parent edit, fresh reviewer, parent synthesis, then validation.

## RUG Loop: Repeat Until Good
For larger tasks, use a manager-style loop:

1. **Decompose** the request into independently completable tasks.
2. **Track progress** with a todo list when available; mark items complete only after validation passes.
3. **Research** first for non-trivial tasks: find relevant files, existing patterns, dependencies, and risks.
4. **Implement** with one or more bounded worker tasks. Prefer one file or one logical concern per worker task.
5. **Validate** each worker result with a separate fresh reviewer; never rely only on the worker's self-assessment.
6. **Repair** failures by launching a new worker prompt containing the original task plus the validation report.
7. **Integrate** with a final reviewer pass when multiple tasks or files changed.
8. **Report** only after all tracked tasks are done or after clearly explaining why the loop must stop.

Use this loop strictly when the user requests pure orchestration or the task has meaningful risk. Use a lighter version for ordinary tasks.

## Prompt Contract Template
Use a compact, bounded prompt like this:

```text
Goal: <one concrete outcome>.

Context:
- Repo: <path or package>.
- User goal: <brief restatement>.
- Known decisions/constraints: <bullets>.

Scope:
- Read only: <paths/globs>, or
- Edit only: <paths/globs>.
- Do not inspect or edit unrelated areas unless required; explain if you must expand scope.

Questions to answer / tasks:
1. <specific question or task>
2. <specific question or task>

Output format:
- Current flow summary: max <N> bullets.
- Proposed changes or findings grouped by file.
- Risks / edge cases.
- Validation commands or checks.

Constraints:
- <read-only / no raw logs / no broad refactors / preserve compatibility / etc.>
```

## Read-Only Scout Prompt (one file, one question)

For narrow recon of a single file, the parent can use a tight scout template that constrains the agent to one file, one question, and forbids code suggestions. This is the lowest-cost, fastest scout shape.

```text
Goal: <one concrete fact you need>

Read ONLY this one file: <exact path>

Question: <one specific question, 1-3 lines of expected output>

Output: <exact format, e.g. "6 lines: name = #HEX">

Constraints:
- max_turns 3
- Do not read any other file
- Do not suggest code or next steps
- If info is missing, say so and stop
```

The "Read ONLY this one file" and "If info is missing, say so and stop" lines are the actual cost levers — they keep the tool-call count at 1 and prevent repo-wide crawls.

## Worker Prompt Template
When delegating implementation, include the original request and make the scope non-ambiguous:

```text
CONTEXT: The user asked: "<original request>"

YOUR TASK: <specific decomposed implementation task>

INPUT FINDINGS:
- <researcher findings, relevant paths, existing patterns, decisions>

SCOPE:
- Files to modify: <list>
- Files to create: <list>
- Files to not touch: <list>

REQUIREMENTS:
- <requirement 1>
- <requirement 2>

SPECIFIED TECHNOLOGIES / APPROACHES:
- The user specified: <libraries, languages, frameworks, approach>
- You MUST use these exactly. Do NOT substitute alternatives or rewrite in another stack.

ACCEPTANCE CRITERIA:
- [ ] <criterion 1>
- [ ] <criterion 2>

CONSTRAINTS:
- Do NOT modify unrelated files.
- Do NOT broaden scope without explaining why.
- Do NOT return partial work as complete.

WHEN DONE, REPORT:
1. Files created/modified.
2. Summary of changes.
3. Tests/checks run and results.
4. Any issues or concerns.
5. Confirmation for each acceptance criterion.
```

## Reviewer Prompt Template
After implementation, validate with a separate subagent:

```text
A previous agent was asked to: <task description>

Acceptance criteria:
- <criterion 1>
- <criterion 2>

User-specified technologies / approaches:
- <specs that must be obeyed>

Validate by:
1. Reading the files that were supposedly changed.
2. Checking each acceptance criterion against the actual implementation.
3. Checking specification compliance. If the user required X and the implementation used Y instead, fail validation even if Y works.
4. Looking for bugs, missing edge cases, regressions, security issues, and unnecessary complexity.
5. Running relevant tests or type checks if allowed.

Report:
- Specification compliance: pass/fail with evidence.
- Changed-file summary.
- Failed items with concise evidence.
- Bugs, missing functionality, or risks.
- Overall verdict: PASS or FAIL.
```

## Specification Adherence
User-specified technologies, languages, frameworks, libraries, and approaches are hard constraints. Every worker and reviewer prompt should echo them explicitly and forbid substitutions.

Common failure pattern: a subagent replaces the requested tool or stack with its own preference. Prevent this in the worker prompt and make the reviewer fail the work if substitution occurred.

## Effort Sizing
- Quick lookup: `max_turns` about 3-5.
- Bounded file reconnaissance: about 8-12.
- Architecture review: more turns only with a narrow scope.
- Worker implementation: use only after the plan and editable files are clear.
- For read-only scouts, use the smallest available model that can reliably answer the question. Larger models do not improve single-file lookups; they only add latency and cost.

If the scope is broad, either increase turns or split the work into smaller subagent contracts.

## Parallelization Rules
Parallelize only independent, mostly read-only tasks, such as separate schema, API/docs, and UI-pattern investigations.

Do not parallelize:

- multiple agents editing the same file;
- a worker writing code before scout/planner results are synthesized;
- parent doing the same exploration while a scout is running;
- nested handoff assumptions unless the harness explicitly supports them.

## Parallel Launch Pattern

For independent, read-only questions, launch all subagents in a single tool block with `run_in_background: true`, then wait on all of them in a separate tool block. Wall time becomes the slowest agent instead of the sum.

```text
// Launch all 3 in one tool block with run_in_background: true
subagent({ prompt: "...", subagent_type: "scout", model: "<small read-only model>", max_turns: 3, run_in_background: true })
subagent({ prompt: "...", subagent_type: "scout", model: "<small read-only model>", max_turns: 3, run_in_background: true })
subagent({ prompt: "...", subagent_type: "scout", model: "<small read-only model>", max_turns: 3, run_in_background: true })

// Then in the next tool block, wait on all 3 in parallel
get_subagent_result({ agent_id: "<id-1>", wait: true })
get_subagent_result({ agent_id: "<id-2>", wait: true })
get_subagent_result({ agent_id: "<id-3>", wait: true })
```

Combine with a `max_turns: 3` cap so a stuck agent cannot blow the budget. A turn cap is what stops the agent; prompt discipline is what shapes its answer.

## Anti-Patterns
- **“Let me just quickly...”**: the parent duplicates delegated research instead of launching or narrowing a subagent task.
- **Monolithic delegation**: one subagent is asked to research, plan, implement, test, and review a large change.
- **Trusting self-reported completion**: the worker says it is done but no reviewer verifies actual files and criteria.
- **Role confusion**: reviewer used for research, worker used for broad exploration, researcher asked to edit.
- **Spec substitution**: the implementation swaps out the user's specified technology or approach.
- **Giving up after one failed validation**: retry with a better, narrower prompt unless the user constraints make completion impossible.
- **Multi-question agents**: one scout asked 8 unrelated questions explodes tool uses and turn count. One file, one question per scout; parallelize the rest.
- **Code suggestions in recon**: asking a scout to "also propose an implementation" turns a 1-call lookup into a full design pass. Recon only.

## Plan Mode and Handoff Notes
- Use planning/research subagents to gather context before presenting a plan.
- A plan may describe future handoffs by target role, objective, scope, expected output, and validation.
- Do not assume a plan tool should automatically execute subagents. The parent orchestrator should perform accepted handoffs with available subagent tooling.
- Avoid recursive or unbounded delegation; subagents should not create open-ended nested handoffs.

## Failure Handling
When a subagent returns a partial result, say so explicitly and choose one path:

- rerun a narrower subagent with a tighter contract;
- ask the user whether to proceed manually;
- proceed manually only after announcing the switch and keeping parent exploration minimal.

Do not silently ignore a weak subagent result and duplicate its full task in the parent.

## Sources
- OpenAI Codex: Subagents — `https://developers.openai.com/codex/concepts/subagents`
- Claude Code: Create custom subagents — `https://code.claude.com/docs/en/sub-agents`
- Claude Code SDK: Subagents — `https://code.claude.com/docs/en/agent-sdk/subagents`
- Claude Code: Dynamic workflows — `https://code.claude.com/docs/en/workflows`
- Anthropic: How we built our multi-agent research system — `https://www.anthropic.com/engineering/multi-agent-research-system`
- Anthropic: Building effective agents — `https://www.anthropic.com/research/building-effective-agents`

## Verification
- Subagent prompts include objective, scope, constraints, output format, and validation.
- Parent validates subagent output quality before acting on it.
- Parent does not duplicate delegated work without an explicit strategy switch.
- Write-heavy work is serialized or bounded to non-overlapping files.
