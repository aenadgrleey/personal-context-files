# Compose Slot API Reference

## Core idea
- Shell composables own structure, spacing, theme tokens, interaction surfaces, and predefined renderers.
- Variable regions are expressed as slots.
- Prefer scoped slots for semantic composition.
- Use plain slots only for intentionally unconstrained content and only by explicit request.

## Slot types

### Scoped slot (default)
Use when a region needs semantic composition, local vocabulary, or reusable atoms.

```kotlin
internal interface ChatAvatarScope {
    @Composable
    fun Avatar(image: Image) { /* default rendering */ }

    @Composable
    fun Letters(text: String) { /* default rendering */ }
}

internal interface ChatIconsScope {
    val onUiEvent: OnUiEvent

    @Composable
    fun Muted() { /* default rendering */ }

    @Composable
    fun AddMembers() {
        FloatingActionButton(onClick = { onUiEvent(UiEvent.OnAddMembersClick) }) { /* ... */ }
    }
}
```

Rules:
- interface name = capability (`ChatIconsScope`)
- object name = usage context (`ChatItemScope`)
- default atoms live on the interface, not on the object
- when a scope needs runtime dependencies like `OnUiEvent`, provide a remembered runtime implementation in the shell
- use inheritance only for truly shared semantics

### Plain slot
Use only when the user explicitly asks for plain slots or the container is intentionally unconstrained.

```kotlin
@Composable
internal fun ContentLayout(
    heading: @Composable () -> Unit,
    leading: @Composable () -> Unit,
    content: @Composable () -> Unit,
) {
    Column {
        heading()
        Row {
            leading()
            content()
        }
    }
}
```

Do not use plain slots when:
- the region needs typed semantic atoms -> use scoped slot
- the shell should keep semantic control over how content is assembled

## Persistent callback scope pattern
When nested slot atoms need to emit screen events, expose the callback as a scope property instead of passing handlers through every child.

```kotlin
internal interface ChatPreviewScope {
    val layoutState: ChatPreviewLayoutState
    val onUiEvent: OnUiEvent

    @Composable
    fun AddMembersFab(visible: Boolean) {
        val show = visible && layoutState.currentTab != ChatPreviewTab.Media
        AnimatedVisibility(visible = show) {
            FloatingActionButton(
                onClick = { onUiEvent(UiEvent.OnAddMembersClick) },
            ) { /* ... */ }
        }
    }
}

@Composable
internal fun ChatPreviewLayout(
    onUiEvent: OnUiEvent,
    content: @Composable ChatPreviewLayoutScope.() -> Unit,
) {
    val layoutState = remember { ChatPreviewLayoutState() }
    val currentOnUiEvent = rememberUpdatedState(onUiEvent)
    val scope = remember(layoutState) {
        object : ChatPreviewLayoutScope {
            override val layoutState = layoutState
            override val onUiEvent: OnUiEvent = { event -> currentOnUiEvent.value(event) }
        }
    }

    scope.content()
}
```

Why this pattern:
- keeps the scope object stable
- always calls the latest event handler
- avoids prop-drilling `onClick` lambdas through every nested atom
- makes slot APIs read like local DSLs instead of callback plumbing

Use it when:
- many atoms in the same slot tree dispatch the same screen event channel
- stateful shell helpers (`layoutState`, pager state, scroll state) are shared across slots
- the public API should expose intent, not wiring details

## Root composition rules
- Map architectural state and actions in one root composable.
- Keep list structure and branching visible there.
- Read long-lived state near the slot boundary that needs it.
- Pass prepared values to deeper atoms where possible.

## Design signals
- Fixed geometry, variable internals -> use slots.
- Real composition choices and semantic atoms -> scoped slot.
- Free-form content by explicit request -> plain slot.
- If a value is simple, keep rendering in the shell or behind a scoped atom; do not invent a placer API.
- Product intent leaking through flags -> wrap the shell with named variants.

## Escalation smells
- flags like `showX`, `isY`, `hasZ` keep multiplying
- a slot API starts inventing callback plumbing instead of semantic atoms
- a scoped API still has only one meaningful atom after multiple uses
- wrappers multiply while behavior is effectively identical

## Do / Do not
- Do keep shells deterministic.
- Do start with scoped slots.
- Do move reusable semantic atoms into scope defaults.
- Do isolate event and state access at slot boundaries.
- Do use wrappers for product intent.
- Do not default to plain slots.
- Do not mix architectural branching with low-level atom rendering.
- Do not invent placer-style APIs.
- Do not leak generic flag soup into public composables.
