# AI Streaming Mini Exercise — Week 8 Assignment

> **Note:** The backend was not required for the original assignment. It was intentionally added to explore how AI streaming works in a real-world application, including the flow between the frontend, backend and AI provider.

## Overview

A React mini exercise focused on implementing and understanding AI-style streamed responses.

The assignment demonstrates mocked browser-side streaming as required by the assignment, along with an additional real AI streaming path using Express and OpenRouter to understand how streaming works in a real-world application.

## What Was Created

- **Mock AI Response** — Uses a browser `ReadableStream` to simulate progressively generated AI text.
- **Real AI Response** — Uses a minimal Express backend to request and forward a streamed OpenRouter response.
- **Incremental Rendering** — Streams are consumed chunk-by-chunk and rendered progressively in React.
- **Stop Generation** — Uses `AbortController` to cancel the active generation while preserving partial output.
- **Retry** — Starts a fresh generation using the selected provider.
- **Race-Condition Protection** — Uses generation IDs to prevent stale asynchronous work from updating a newer generation.
- **Streaming States** — Explicit lifecycle states provide predictable UI behavior.

## Module Responsibilities

| Module | Responsibility | Documentation |
|---|---|---|
| `frontend/src/components/` | Presentational React components for input, provider actions, response display, status, and generation controls. | [Components README](./frontend/src/components/README.md) |
| `frontend/src/hooks/` | Manages the AI generation lifecycle, cancellation, retry, stale-generation protection, and cleanup. | [Hooks README](./frontend/src/hooks/README.md) |
| `frontend/src/services/` | Creates/requests streams, consumes `ReadableStream` data, decodes chunks, and parses SSE. | [Services README](./frontend/src/services/README.md) |
| `frontend/src/App.jsx` | Root page-level component that composes the UI and connects it to the streaming hook. | [App README](./frontend/src/README.md) |
| `backend/routes/` | Validates generation requests and forwards the OpenRouter stream. | [Routes README](./backend/README.md) |
| `backend/providers/` | Contains the OpenRouter integration and AI request configuration. | [Providers README](./backend/README.md) |
| `backend/server.js` | Configures Express and supports both local execution and Vercel deployment. | [Server README](./backend/README.md) |

### Folder Documentation

- [Frontend README](./frontend/README.md)
- [Backend README](./backend/README.md)

## Week 8 Concepts Used

### AI Streamed Responses
The application demonstrates AI-style output arriving progressively instead of waiting for a complete response. Both the Mock and Real AI paths expose streamed output to the frontend.

### ReadableStream
The Mock provider creates a browser `ReadableStream`, while the Real provider receives an HTTP response body that is also consumed as a stream. This allows the same frontend streaming concepts to be applied to both paths.

### Incremental Rendering
The frontend reads each available chunk and appends the decoded content to React state. The response therefore becomes visible progressively as data arrives.

### AbortController
Each generation receives its own `AbortController`, allowing the active operation to be cancelled. The signal is passed through the generation flow and used by the Real AI request and stream handling.

### Stop Generation
The Stop control cancels the current generation while preserving whatever response has already been rendered. Intentional cancellation is represented as the `stopped` state rather than an error.

### Streaming States
Generation uses explicit lifecycle states: `idle`, `starting`, `streaming`, `complete`, `stopped`, and `error`. This keeps UI behavior predictable without relying on many conflicting boolean flags.

### SSE Parsing
The Real AI path receives OpenRouter's Server-Sent Events stream and parses complete events before extracting `choices[0].delta.content`. This prevents raw SSE metadata from being rendered as the AI response.

### Retry & Race-Condition Protection
Retry creates a new generation and a new controller rather than continuing the previous operation. Generation IDs prevent late asynchronous results from older generations from modifying the current response.

## Live Demo
[AI Streaming Exercise](https://ai-streaming-assignment-frontend.vercel.app/)
