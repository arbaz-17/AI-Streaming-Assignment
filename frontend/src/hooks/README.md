# AI Streaming Hook

## 1. Overview

`useAIStreaming` is the custom React hook responsible for managing the complete AI generation lifecycle.

It keeps the UI layer focused on rendering while centralizing streaming-related state and behavior such as provider selection, generation status, cancellation, retry, stale-generation protection, and cleanup.

## 2. Key Responsibilities

- Maintains generation state: output, status, error, and active provider.
- Starts Mock or Real AI generation based on the selected provider.
- Connects the selected provider to the shared stream consumer.
- Supports generation cancellation through `AbortController`.
- Preserves correct lifecycle states such as `starting`, `streaming`, `complete`, `stopped`, and `error`.
- Prevents stale generations from updating the current UI.
- Supports Retry by starting a new generation.
- Aborts an active generation when the component using the hook unmounts.

## 3. Important Function & State

### `useAIStreaming({ input, operation })`

**Signature:** `useAIStreaming({ input, operation })`

Accepts the current user input and selected operation, then returns the generation state and control handlers needed by the UI.

### State

- `output` — Contains the accumulated streamed AI response.
- `status` — Tracks the generation lifecycle.
- `error` — Stores the current generation error message.
- `provider` — Stores the provider used by the current/last generation.
- `isGenerating` — Derived flag used to disable form/provider controls while generation is active.

### `handleGenerate(selectedProvider)`

Starts a new generation, creates its `AbortController`, selects the Mock or Real provider, consumes its stream, and updates the response incrementally.

### `handleStop()`

Aborts the currently active generation through the stored `AbortController`.

### `handleRetry()`

Starts a fresh generation using the previously selected provider.

## 4. Request & Lifecycle Protection

### `abortControllerRef`

Stores the `AbortController` for the active generation without causing React re-renders. It is used to implement Stop and cleanup.

### `generationIdRef`

Assigns each generation a unique identity. Async results are checked against the current ID so an older generation cannot update the response, status, or error of a newer generation.

### `useEffect` cleanup

On unmount, the current generation is invalidated and its active controller is aborted to prevent abandoned streaming work.

## 5. Basic Flow

```text
User action
    ↓
handleGenerate()
    ↓
Create generation ID + AbortController
    ↓
Select provider
    ├── Mock → createMockAIStream()
    └── Real → createRealAIStream()
    ↓
consumeTextStream()
    ↓
Incrementally update output
    ↓
complete / stopped / error
```

The hook acts as the bridge between the UI components and the streaming services, keeping the generation lifecycle out of `App.jsx`.
