---
name: compose-slot-api
description: "Guides Jetpack Compose UI work with a strict slot-API approach: scoped slots for typed local DSLs and plain slots only by explicit request. Use when building, refactoring, or reviewing composables with slots, scope-based slot DSLs, root-level screen assembly from architectural state, or scope properties that expose callbacks such as OnUiEvent."
---

# Compose Slot API

## Quick start
- Use slot API as the default style for reusable Compose UI in this repo.
- Separate the fixed shell from variable content.
- Start with scoped slots (`*Scope`).
- Use plain slots only when the user explicitly asks for plain slots.
- Keep slot APIs semantic and local-DSL-oriented.
- Keep screen assembly readable in one root composition block.

## Workflow
1. Map the shell.
   - Identify fixed geometry, spacing, theme tokens, scroll behavior, and click surfaces.
   - Mark each region as semantic-composition or fully free-form.
2. Choose the slot type.
   - Typed local vocabulary plus composition control -> scoped slot.
   - Fully free-form container, explicitly requested -> plain slot.
3. Build the shell.
   - Shell owns structure, styling, ordering, and predefined renderers.
   - Variable regions become slot params, not boolean branches.
4. Route state and events at the boundary.
   - Keep `State<T>` reads near the slot that needs them.
   - Put shared dependencies like `layoutState` and `onUiEvent` on scope interfaces.
   - Create remembered scope implementations and let default atoms call `onUiEvent(...)` directly.
5. Add intent wrappers.
   - Prefer named wrappers over exposing a generic shell with product flags.

## Rules
- Scoped slot is the default.
- Plain slots are opt-in only when explicitly requested.
- `*Scope` names scoped slots.
- Default scoped atoms live on the interface; access-point objects stay empty unless specialization is needed.
- Do not thread click lambdas through every atom when a scope-level `onUiEvent` property expresses the contract better.
- Keep screen-level architectural mapping centralized.

## OnUiEvent pattern
```kotlin
internal interface ChatItemScope {
    val onUiEvent: OnUiEvent

    @Composable
    fun AddButton() {
        FloatingActionButton(onClick = { onUiEvent(UiEvent.OnAddClick) }) { /* ... */ }
    }
}
```
- Expose stable callbacks as scope properties.
- Prefer one remembered scope object per dependency set.
- Invoke slot lambdas against that scope instead of prop-drilling handlers through every child.

## Review checklist
- [ ] Shell and variable content are separated.
- [ ] Slot type matches caller responsibility.
- [ ] No placer/constrained-slot API is introduced.
- [ ] No flag explosion or generic param soup.
- [ ] Scoped atoms and defaults live on interfaces.
- [ ] `onUiEvent` and state dependencies sit at scope boundaries, not in deep prop chains.
- [ ] Root composition remains readable.

## Reference
See [REFERENCE.md](REFERENCE.md) for slot taxonomy, escalation rules, and persistent callback patterns.
