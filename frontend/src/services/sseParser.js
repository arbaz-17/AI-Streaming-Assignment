export function createSSEParser() {
  let buffer = "";

  return {
    push(chunk) {
      buffer += chunk;

      const events = buffer.split("\n\n");

      buffer = events.pop() ?? "";

      const contents = [];

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
              contents.push(content);
            }
          } catch (error) {
            console.warn("Failed to parse SSE event:", error);
          }
        }
      }

      return contents;
    },

    flush() {
      buffer = "";
    },
  };
}