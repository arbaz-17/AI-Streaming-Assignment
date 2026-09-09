# AI Streaming Services

## 1. Overview

The `services` folder contains the non-UI logic responsible for creating, requesting, consuming, and parsing streamed AI responses.

It supports two response sources:

- **Mock AI** — creates a browser-side `ReadableStream` with simulated incremental output.
- **Real AI** — requests a streamed response from the Express/OpenRouter backend.

The services also provide shared stream consumption and SSE parsing so the React UI does not need to know the low-level streaming details.

## 2. Key Responsibilities

- Create a simulated streamed AI response for Mock AI.
- Request the streamed Real AI response from the backend.
- Consume `ReadableStream` data incrementally.
- Decode byte chunks into text using `TextDecoder`.
- Parse Server-Sent Events (SSE) from the Real AI stream.
- Extract only generated content from OpenRouter stream events.
- Respect an `AbortSignal` during stream consumption.

## 3. Important Files & Functions

### `mockAI.js`

#### `createMockAIStream(operation, signal)`

Creates a browser-side `ReadableStream` using an operation-specific predefined response. The response is split into chunks and emitted with a short delay to simulate AI streaming.

### `realAI.js`

#### `createRealAIStream({ text, operation, signal })`

Sends a `POST` request to the configured backend `/api/generate` endpoint and returns the HTTP response body as a `ReadableStream`.

The `AbortSignal` is passed to `fetch()` so the client can cancel the request.

### `sseParser.js`

#### `createSSEParser()`

Creates an incremental SSE parser that buffers incomplete data, identifies complete `data:` events, parses their JSON payloads, and extracts `choices[0].delta.content`.

It returns parsed content rather than updating React state directly.

### `streamConsumer.js`

#### `consumeTextStream({ stream, onChunk, parseSSE, signal })`

Consumes a `ReadableStream` using `getReader()` and `reader.read()`, decodes received bytes with `TextDecoder`, optionally parses SSE data, and sends extracted text to `onChunk`.

It also checks the abort signal during consumption.

## 4. Basic Service Flow

### Mock AI

```text
Operation
   ↓
createMockAIStream()
   ↓
Predefined response
   ↓
Split into chunks
   ↓
TextEncoder
   ↓
ReadableStream
```

### Real AI

```text
Text + Operation
   ↓
createRealAIStream()
   ↓
POST /api/generate
   ↓
Express → OpenRouter
   ↓
SSE response
   ↓
ReadableStream
```

### Shared Consumption

```text
ReadableStream
      ↓
getReader()
      ↓
reader.read()
      ↓
Uint8Array
      ↓
TextDecoder
      ↓
┌──────────────────────────────┐
│ Mock: direct text            │
│ Real: SSE parser → content   │
└──────────────────────────────┘
      ↓
onChunk()
      ↓
React output state
```

## 5. How the Services Work Together

The provider services are responsible for **obtaining or creating a stream**, while `streamConsumer.js` is responsible for **consuming that stream**.

```text
mockAI.js ──────────────┐
                       │
                       ▼
                ReadableStream
                       │
realAI.js → HTTP stream┘
                       │
                       ▼
               streamConsumer.js
                       │
              ┌────────┴────────┐
              ▼                 ▼
        direct text          sseParser
              │                 │
              └────────┬────────┘
                       ▼
                   onChunk()
                       ↓
                 React UI state
```

This separation keeps provider-specific behavior out of the shared streaming consumption logic.
