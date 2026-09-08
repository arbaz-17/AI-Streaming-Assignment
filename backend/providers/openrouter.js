const OPENROUTER_URL =
  "https://openrouter.ai/api/v1/chat/completions";

const OPENROUTER_MODEL = "openrouter/free";

export async function createOpenRouterStream({
  text,
  operation,
}) {
  const systemPrompt =
    operation === "rewrite"
      ? "Rewrite the user's text clearly while preserving its meaning."
      : "Summarize the user's text clearly and concisely.";

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      stream: true,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: text,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `OpenRouter request failed (${response.status}): ${errorText}`
    );
  }

  if (!response.body) {
    throw new Error("OpenRouter returned no response body.");
  }

  return response.body;
}