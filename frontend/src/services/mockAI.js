const MOCK_RESPONSES = {
  summarize:
    "Grand Theft Auto VI is one of the most highly anticipated open-world games from Rockstar Games. Set in the fictional state of Leonida, including the neon-filled streets of Vice City, the game follows Lucia and her partner as they become involved in a dangerous criminal adventure. Players can explore a massive world filled with cities, beaches, highways, businesses, and countless activities while experiencing a story focused on crime, relationships, ambition, and survival.",

  rewrite:
    "Grand Theft Auto VI is Rockstar Games' next major open-world action-adventure title, taking players back to the iconic Vice City in a modern and expanded setting. The story centers around Lucia and her partner as they find themselves caught in a world of crime, money, danger, and unexpected opportunities. With a huge map, detailed environments, memorable characters, and a wide variety of activities to explore, GTA VI aims to deliver an immersive experience that feels bigger and more alive than previous games in the series.",
};

const wait = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export function createMockAIStream(operation, signal) {
  const text =
    MOCK_RESPONSES[operation] ?? MOCK_RESPONSES.summarize;

  const chunks = text.split(" ");

  return new ReadableStream({
    async start(controller) {
      for (let index = 0; index < chunks.length; index += 1) {
        if (signal?.aborted) {
          controller.close();
          return;
        }

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