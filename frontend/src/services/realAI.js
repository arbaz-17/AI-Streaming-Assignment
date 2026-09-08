const API_URL = "http://localhost:3000/api/generate";

export async function createRealAIStream({ text, operation }) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      operation,
    }),
  });

  if (!response.ok) {
    let message = "Failed to generate AI response.";

    try {
      const data = await response.json();

      if (data?.error) {
        message = data.error;
      }
    } catch {
      // Response was not JSON.
    }

    throw new Error(message);
  }

  if (!response.body) {
    throw new Error("The server returned no response body.");
  }

  return response.body;
}