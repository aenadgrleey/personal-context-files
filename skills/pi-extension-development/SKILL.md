---
description: This skill provides best practices and resources for creating extensions for the pi coding agent.
---

# pi-extension-development

This skill provides best practices and resources for creating extensions for the pi coding agent.

## Sources
When developing pi extensions, refer to the following docs and examples:
- Main extension docs: `https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/extensions.md`
- Examples directory: `https://github.com/badlogic/pi-mono/tree/main/packages/coding-agent/examples/extensions/`
- TUI components docs: `https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/tui.md`
- Keybindings docs: `https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/keybindings.md`

## Extension Summary
Pi extensions are TypeScript modules that extend agent behavior. The docs focus on the practical rules you need to build one well:
- put extensions in `~/.pi/agent/extensions/` or `.pi/extensions/` for auto-discovery and reload
- export a default factory receiving `ExtensionAPI` (sync or async)
- use `pi.on(...)` to hook lifecycle/session/agent/model/tool/input events
- use `pi.registerTool(...)`, `pi.registerCommand(...)`, `pi.registerShortcut(...)`, and `pi.registerFlag(...)` to extend behavior
- use `ctx.ui` for confirm/notify/input/select and custom TUI widgets
- persist state with `appendEntry(...)` / returned tool `details`
- if you override built-in tools, follow the tool-definition and output-truncation rules
- for file mutation or shared resources, avoid race conditions and handle errors by throwing
- treat `ctx.reload()` as terminal (`await ctx.reload(); return;`)
- use `StringEnum` for string enum tool params when compatibility matters

Useful examples from the docs/examples:
- `summarize.ts` — conversation/session summarization
- `snake.ts` — interactive custom UI/game example
- permission-gate style tool interception (`tool_call` blocking)
- git checkpointing / stash-on-turn workflows
- path protection against dangerous writes (`.env`, `node_modules/`)
- custom tools with stateful `details`

## Best Practices
1. **Keep tool output small**: truncate large outputs to avoid overwhelming the LLM context.
2. **Throw on tool errors**: signal execution failures by throwing inside `execute`.
3. **Queue file mutations**: wrap read-modify-write flows in `withFileMutationQueue()`.
4. **Persist state explicitly**: store recoverable state in returned `details`.
5. **Use `StringEnum` for string enums**: prefer `StringEnum` from `@mariozechner/pi-ai` for better model compatibility.
6. **Make `ctx.reload()` terminal**: `await ctx.reload(); return;` is usually the safe pattern.
7. **Bundle tool guidance with the tool**: use `promptSnippet` and `promptGuidelines` on `registerTool` for tool-specific agent context instead of editing `.pi/agents/*.md` unless the guidance is global.
