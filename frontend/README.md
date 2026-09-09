# Frontend

The `frontend` folder contains the React/Vite client for the AI Streaming Text Assistant Assignment.

It is responsible for the user interface, generation controls, streaming lifecycle, and consumption of both Mock and Real AI responses.

## Architecture

```text
UI Components
      ↓
App.jsx
      ↓
useAIStreaming
      ↓
Services
 ┌────┴─────┐
Mock       Real
 │           │
 │        Express API
 │           │
 └────┬──────┘
      ↓
Stream Consumer
      ↓
Incremental Response UI
```

## Folder & File Documentation

| Area | Purpose | Documentation |
|---|---|---|
| `components/` | Presentational React components for forms, provider actions, responses, status, and controls. | [Components README](./src/components/README.md) |
| `hooks/` | Custom React hook containing the AI generation lifecycle, cancellation, retry, and stale-generation protection. | [Hooks README](./src/hooks/README.md) |
| `services/` | Streaming providers, stream consumption, TextDecoder handling, and SSE parsing. | [Services README](./src/services/README.md) |
| `App.jsx` | Root page-level component that composes the UI and connects it to the streaming hook. | [App README](./src/README.md) |
| `styles/` | Application layout and component styling. | — |

## Key Responsibilities

- Render the AI Streaming Text Assistant interface.
- Support **Mock AI** browser-side streaming.
- Support **Real AI** streaming through the backend/OpenRouter path.
- Render responses incrementally.
- Provide generation states: `idle`, `starting`, `streaming`, `complete`, `stopped`, and `error`.
- Support Stop through `AbortController`.
- Support Retry and protect against stale asynchronous generations.
