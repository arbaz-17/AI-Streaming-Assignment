import express from "express";

import { createOpenRouterStream } from "../providers/openrouter.js";

const router = express.Router();

router.post("/generate", async (req, res) => {
  try {
    const { text, operation } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({
        error: "Text is required.",
      });
    }

    if (!["summarize", "rewrite"].includes(operation)) {
      return res.status(400).json({
        error: "Invalid operation.",
      });
    }

    const stream = await createOpenRouterStream({
      text,
      operation,
    });

    res.status(200);
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    for await (const chunk of stream) {
      res.write(chunk);
    }

    res.end();
  } catch (error) {
    console.error("Generation error:", error);

    if (!res.headersSent) {
      return res.status(500).json({
        error: "Failed to generate AI response.",
      });
    }

    res.end();
  }
});

export default router;