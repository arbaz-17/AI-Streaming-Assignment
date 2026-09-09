import { useCallback, useEffect, useRef, useState } from "react";

import { createMockAIStream } from "../services/mockAI";
import { createRealAIStream } from "../services/realAI";
import { consumeTextStream } from "../services/streamConsumer";

const INITIAL_STATUS = "idle";

export function useAIStreaming({ input, operation }) {
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState(INITIAL_STATUS);
  const [error, setError] = useState("");
  const [provider, setProvider] = useState(null);

  const abortControllerRef = useRef(null);
  const generationIdRef = useRef(0);

  const isGenerating =
    status === "starting" || status === "streaming";

  const handleGenerate = useCallback(
    async (selectedProvider) => {
      if (!input.trim()) {
        setError("Please enter some text before generating a response.");
        setStatus("error");
        return;
      }

      const generationId = generationIdRef.current + 1;
      generationIdRef.current = generationId;

      const controller = new AbortController();

      abortControllerRef.current = controller;

      setProvider(selectedProvider);
      setOutput("");
      setError("");
      setStatus("starting");

      const isCurrentGeneration = () =>
        generationIdRef.current === generationId;

      try {
        let stream;
        let parseSSE = false;

        if (selectedProvider === "mock") {
          stream = createMockAIStream(
            operation,
            controller.signal,
          );
        } else if (selectedProvider === "real") {
          stream = await createRealAIStream({
            text: input,
            operation,
            signal: controller.signal,
          });

          parseSSE = true;
        } else {
          throw new Error("Invalid AI provider.");
        }

        if (!isCurrentGeneration()) {
          return;
        }

        setStatus("streaming");

        await consumeTextStream({
          stream,
          parseSSE,
          signal: controller.signal,
          onChunk: (chunk) => {
            if (!isCurrentGeneration()) {
              return;
            }

            if (controller.signal.aborted) {
              return;
            }

            setOutput(
              (previousOutput) => previousOutput + chunk,
            );
          },
        });

        if (controller.signal.aborted) {
          if (isCurrentGeneration()) {
            setStatus("stopped");
          }

          return;
        }

        if (!isCurrentGeneration()) {
          return;
        }

        setStatus("complete");
      } catch (generationError) {
        console.error("Generation error:", generationError);

        if (!isCurrentGeneration()) {
          return;
        }

        if (generationError.name === "AbortError") {
          setStatus("stopped");
          return;
        }

        setError(
          generationError.message ||
            "Something went wrong while generating the response.",
        );

        setStatus("error");
      } finally {
        if (
          isCurrentGeneration() &&
          abortControllerRef.current === controller
        ) {
          abortControllerRef.current = null;
        }
      }
    },
    [input, operation],
  );

  const handleStop = useCallback(() => {
    const controller = abortControllerRef.current;

    if (!controller) {
      return;
    }

    controller.abort();
  }, []);

  const handleRetry = useCallback(() => {
    if (!provider) {
      return;
    }

    handleGenerate(provider);
  }, [provider, handleGenerate]);

  useEffect(() => {
    return () => {
      generationIdRef.current += 1;
      abortControllerRef.current?.abort();
    };
  }, []);

  return {
    output,
    status,
    error,
    provider,
    isGenerating,
    handleGenerate,
    handleStop,
    handleRetry,
  };
}