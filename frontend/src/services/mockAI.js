const MOCK_RESPONSES = {
  summarize:
    "React is a JavaScript library for building user interfaces. It uses reusable components and state to create interactive applications.",

  rewrite:
    "React is a JavaScript library that helps developers build interactive user interfaces through reusable components and state-driven rendering.",
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function createMockAIStream(operation) {
  const text =
    MOCK_RESPONSES[operation] ?? MOCK_RESPONSES.summarize;

  const chunks = text.split(" ");

  return new ReadableStream({
    async start(controller) {
      for (let index = 0; index < chunks.length; index += 1) {
        const chunk = `${chunks[index]}${
          index < chunks.length - 1 ? " " : ""
        }`;

        controller.enqueue(
          new TextEncoder().encode(chunk)
        );

        await wait(120);
      }

      controller.close();
    },
  });
}