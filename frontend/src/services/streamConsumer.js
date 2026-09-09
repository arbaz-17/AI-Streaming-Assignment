import { createSSEParser } from "./sseParser";

export async function consumeTextStream({
  stream,
  onChunk,
  parseSSE = false,
  signal,
}) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();

  const parser = parseSSE ? createSSEParser() : null;

  try {
    while (true) {
      if (signal?.aborted) {
        throw new DOMException("The operation was aborted.", "AbortError");
      }

      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      const decodedChunk = decoder.decode(value, {
        stream: true,
      });

      if (parseSSE) {
        const contents = parser.push(decodedChunk);

        for (const content of contents) {
          if (signal?.aborted) {
            throw new DOMException("The operation was aborted.", "AbortError");
          }

          onChunk(content);
        }
      } else {
        onChunk(decodedChunk);
      }
    }

    if (parseSSE) {
      parser.flush();
    }
  } finally {
    reader.releaseLock();
  }
}
