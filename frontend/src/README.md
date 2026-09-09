# Application Root Component

## 1. Overview

`App` is the main React component that composes the application's UI and connects the form, provider actions, response display, streaming status, and generation controls.

## 2. Key Responsibilities

- Maintains the user's input text.
- Maintains the selected operation (`summarize` / `rewrite`).
- Connects `useAIStreaming` to the UI.
- Composes all major page-level components.
- Passes streaming state and event handlers to the appropriate components.
- Controls whether input/provider controls are disabled during active generation.

## 3. Important Functions & Usage

### `App()`

**Signature:** `App()`

Root React component responsible for composing the complete AI Streaming Text Assistant interface.

### Local State

- `input` — Stores the text entered by the user.
- `operation` — Stores the selected AI operation.

### `useAIStreaming({ input, operation })`

Provides:

- `output` — Accumulated streamed response.
- `status` — Current generation lifecycle state.
- `error` — Current generation error.
- `isGenerating` — Indicates whether generation is starting or streaming.
- `handleGenerate` — Starts Mock or Real AI generation.
- `handleStop` — Stops the active generation.
- `handleRetry` — Starts a new generation using the previous provider.

## 4. Data & Event Flow

```text
User input
    ↓
App state
    ↓
useAIStreaming()
    ↓
Generation result
    ↓
App receives output/status/error
    ↓
Props passed to UI components
    ↓
Updated interface
```

Provider actions follow the same pattern:

```text
Mock / Real button
       ↓
handleGenerate()
       ↓
useAIStreaming
       ↓
Streaming services
       ↓
output + status
       ↓
App
       ↓
UI components
```

The component therefore acts as the **page-level composition layer**, while generation behavior remains encapsulated in the custom hook and service layer.
