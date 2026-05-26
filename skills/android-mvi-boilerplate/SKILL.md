---
name: android-mvi-boilerplate
description: Generate Android MVI boilerplate for a new feature by first matching sibling feature patterns, and only then falling back to concrete UiState/UiEvent/UiAction/ViewModel/Screen templates. Use when creating a new screen or feature in a Kotlin Android codebase with MVI-style architecture.
---

# MVI Boilerplate Generator

Generate MVI components for a new Android feature following established local patterns.

## Arguments
- `$ARGUMENTS` — PascalCase feature name (for example: `InviteEmployee`, `SetStatus`)

## Workflow
1. Inspect 2–3 sibling features in the same module first.
2. Copy the local conventions for:
   - package structure
   - file layout
   - `UiState` shape
   - base `ViewModel` type
   - navigation/actions
   - DI registration
   - Compose screen wrapper pattern
3. If one clear pattern exists, follow it closely.
4. If no clear pattern exists, create a new minimal MVI baseline using the templates below.

Do **not** generate the same boilerplate for every screen when the project already has a feature pattern to copy.

## File Structure
```text
<feature_package>/
├── <Feature>Screen.kt
├── <Feature>ViewModel.kt
├── model/
│   ├── UiState.kt
│   ├── UiEvent.kt
│   └── UiAction.kt
└── ui/
    └── SomeComponent.kt
```

Generate only the files the local pattern actually uses. If sibling features do not use `UiAction` or `ui/`, omit them.

## Templates

### UiState.kt — flat by default
```kotlin
package <package>.model

import androidx.compose.runtime.Immutable

@Immutable
data class UiState(
    val isLoading: Boolean = false,
) {
    companion object {
        val Init = UiState()
    }
}
```

Use a sealed interface only when the screen has truly distinct states:
```kotlin
@Immutable
sealed interface UiState {
    data object Loading : UiState
    data class Ready(/* properties */) : UiState

    companion object {
        val Init: UiState = Loading
    }
}
```

### UiEvent.kt
```kotlin
package <package>.model

sealed interface UiEvent {
    data object OnBackClick : UiEvent
}
```

### UiAction.kt
```kotlin
package <package>.model

sealed interface UiAction {
    data object NavigateBack : UiAction
}
```

### ViewModel.kt
If the project already has a base MVI ViewModel, use that. Otherwise use this fallback:
```kotlin
package <package>

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import <package>.model.UiAction
import <package>.model.UiEvent
import <package>.model.UiState

class <Feature>ViewModel : ViewModel() {
    private val _uiState = MutableStateFlow(UiState.Init)
    val uiState = _uiState.asStateFlow()

    private val _uiActions = MutableSharedFlow<UiAction>()
    val uiActions = _uiActions.asSharedFlow()

    fun onUiEvent(uiEvent: UiEvent) {
        when (uiEvent) {
            UiEvent.OnBackClick -> onUiAction(UiAction.NavigateBack)
        }
    }

    private fun onUiAction(action: UiAction) {
        viewModelScope.launch {
            _uiActions.emit(action)
        }
    }
}
```

### Screen.kt
If sibling features use a custom screen base class or custom ViewModel lookup, copy that. Otherwise use this fallback:
```kotlin
package <package>

import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import kotlinx.coroutines.flow.collectLatest
import <package>.model.UiAction
import <package>.model.UiEvent
import <package>.model.UiState

@Composable
fun <Feature>Screen(
    viewModel: <Feature>ViewModel = viewModel(),
    onAction: (UiAction) -> Unit = {},
) {
    LaunchedEffect(viewModel) {
        viewModel.uiActions.collectLatest(onAction)
    }

    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    <Feature>Content(uiState = uiState, onUiEvent = viewModel::onUiEvent)
}

@Composable
private fun <Feature>Content(uiState: UiState, onUiEvent: (UiEvent) -> Unit) {
    // TODO: Implement UI
}
```

## UI components (`ui/`)
- One file per component.
- Accept `onUiEvent: (UiEvent) -> Unit` if the component talks to the ViewModel.
- Pass full `UiState` when more than two properties are needed, individual properties otherwise.

## Gotchas
- Even sealed `UiState` should expose `Init` for predictable initialization.
- No `else` branch in `onUiEvent` — handle every event explicitly.
- Screen-specific `UiAction` handling should happen before any generic fallback.
- Navigation or DI registration may be required before the feature can be opened.
- If you are creating the first feature pattern in a module, keep it simple so future screens can copy it.
