
## UI Components

## 1. Overview

The `components` folder contains the presentational React components that make up the AI Streaming Text Assistant interface.

Each component has a focused responsibility and receives its data or event handlers through props. The components do not contain the core streaming logic; that responsibility is handled by the application layer and `useAIStreaming`.

## 2. Key Features & Responsibilities

- **Header** — Displays the application title and short description.
- **GenerationForm** — Provides the text input and operation selection (`Summarize` / `Rewrite`).
- **ProviderButtons** — Lets the user start generation with either the Mock AI or Real AI provider.
- **ResponsePanel** — Displays the streamed AI response, placeholder content, or an error message.
- **StreamingStatus** — Presents the current generation lifecycle state.
- **GenerationControls** — Provides Stop and Retry controls based on the current streaming state.

## 3. Important Components & Props

### `Header`

**Signature:** `Header()`

Displays the application heading and description. It has no external props.

### `GenerationForm`

**Signature:** `GenerationForm({ input, operation, onInputChange, onOperationChange, disabled })`

Controls the user's source text and selected operation. State is owned by the parent and updated through callback props.

### `ProviderButtons`

**Signature:** `ProviderButtons({ onGenerate, disabled })`

Provides the two generation actions. It calls `onGenerate("mock")` or `onGenerate("real")`.

### `ResponsePanel`

**Signature:** `ResponsePanel({ output, error })`

Renders the current AI output or error. Uses `aria-live="polite"` so incremental response updates can be communicated to assistive technologies.

### `StreamingStatus`

**Signature:** `StreamingStatus({ status })`

Maps the generation state to a user-friendly label such as `Idle`, `Streaming...`, `Complete`, `Stopped`, or `Error`.

### `GenerationControls`

**Signature:** `GenerationControls({ status, onStop, onRetry })`

Enables or disables Stop and Retry based on the current generation state.

## 4. Basic UI Flow

```text
GenerationForm
      │
      ├── input
      └── operation
            │
            ▼
     ProviderButtons
      │           │
      ▼           ▼
    Mock         Real
      │           │
      └─────┬─────┘
            ▼
       AI generation
            │
            ▼
      ResponsePanel
            │
            ├── StreamingStatus
            └── GenerationControls
                 ├── Stop
                 └── Retry
```

The components are intentionally presentational: they expose the interface for the generation lifecycle while the actual streaming, cancellation, retry, and race-condition logic remains outside the component layer.
