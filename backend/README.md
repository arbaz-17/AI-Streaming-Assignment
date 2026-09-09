# Backend

The `backend` folder contains the minimal Express server used by the **Real AI** path of the AI Streaming Text Assistant.

> **Assignment note:** A backend was **not required** for the original assignment, which focused primarily on mocked AI streaming in the frontend. I added it intentionally to understand how AI streaming works in a more realistic application architecture, including server-side API-key protection, provider integration, and forwarding a streamed response from an AI provider to the browser.

## Architecture

```text
React Frontend
      ↓
POST /api/generate
      ↓
Express Backend
      ↓
OpenRouter
      ↓
Streaming SSE Response
      ↓
Express forwards stream
      ↓
React ReadableStream
```

## Folder & File Documentation

| Area | Purpose |
|---|---|
| `routes/` | Defines the API endpoint that validates requests and forwards the OpenRouter stream. |
| `providers/` | Contains the OpenRouter integration and AI request configuration. |
| `server.js` | Configures and starts the Express application locally, while exporting the app for Vercel deployment. |

## Key Responsibilities

- Expose the `POST /api/generate` endpoint.
- Validate the requested text and operation.
- Send generation requests to OpenRouter.
- Request streamed AI output using `stream: true`.
- Keep the OpenRouter API key on the server.
- Forward the provider's SSE stream to the frontend.

## Main Request Flow

```text
Client Request
    ↓
POST /api/generate
    ↓
Validate text + operation
    ↓
createOpenRouterStream()
    ↓
OpenRouter Chat Completions API
    ↓
stream: true
    ↓
SSE chunks
    ↓
res.write(chunk)
    ↓
Frontend response.body
```