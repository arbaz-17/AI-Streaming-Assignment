export function createSSEParser(onContent) {
  let buffer = "";

  return {
    push(chunk) {
      buffer += chunk;

      const events = buffer.split("\n\n");

      buffer = events.pop() ?? "";

      for (const event of events) {
        const lines = event.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data:")) {
            continue;
          }

          const data = line.slice(5).trim();

          if (!data || data === "[DONE]") {
            continue;
          }

          try {
            const parsed = JSON.parse(data);
            const content = parsed?.choices?.[0]?.delta?.content;

            if (content) {
              onContent(content);
            }
          } catch (error) {
            console.warn("Failed to parse SSE event:", error);
          }
        }
      }
    },

    flush() {
      buffer = "";
    },
  };
}