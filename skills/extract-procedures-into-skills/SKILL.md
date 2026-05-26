---
name: extract-procedures-into-skills
description: Distills durable procedures from a completed multi-tool task into a new or patched skill. Use when a task involved several tool calls, repeated steps, or a reusable workflow worth preserving.
---

# Extract Procedures Into Skills

## When to Use
Use after a complex task if the work revealed a repeatable workflow, decision point, or failure lesson worth reusing.

## Procedure
1. Identify steps that are repeated, easy to get wrong, or useful beyond this task.
2. Compare the workflow against existing skills.
3. Patch a related skill if one already covers the same procedure.
4. Create a new skill only if nothing existing fits.
5. Keep the skill focused on the reusable workflow, not on session-specific state.

## Pitfalls
- Don’t encode one-off details from the current task.
- Don’t create a duplicate skill when a related one already exists.
- Don’t use a vague trigger; make the use case obvious.

## Verification
- The skill has a clear trigger.
- It can be applied in a future task without the original context.
- It stays compact and actionable.
