import { useRef, useState } from "react";

import Header from "./components/Header";
import GenerationForm from "./components/GenerationForm";
import ProviderButtons from "./components/ProviderButtons";
import ResponsePanel from "./components/ResponsePanel";
import StreamingStatus from "./components/StreamingStatus";
import GenerationControls from "./components/GenerationControls";

import { createMockAIStream } from "./services/mockAI";
import { createRealAIStream } from "./services/realAI";
import { consumeTextStream } from "./services/streamConsumer";

import "./styles/layout.css";
import "./styles/components.css";

const INITIAL_STATUS = "idle";

function App() {
  const [input, setInput] = useState("");
  const [operation, setOperation] = useState("summarize");

  const [output, setOutput] = useState("");
  const [status, setStatus] = useState(INITIAL_STATUS);
  const [error, setError] = useState("");

  const [provider, setProvider] = useState(null);

  const abortControllerRef = useRef(null);

  const isGenerating = status === "starting" || status === "streaming";

  const handleGenerate = async (selectedProvider) => {
    if (!input.trim()) {
      setError("Please enter some text before generating a response.");
      setStatus("error");
      return;
    }

    const controller = new AbortController();

    abortControllerRef.current = controller;

    setProvider(selectedProvider);
    setOutput("");
    setError("");
    setStatus("starting");

    try {
      let stream;
      let parseSSE = false;

      if (selectedProvider === "mock") {
        stream = createMockAIStream(operation, controller.signal);
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

      setStatus("streaming");

      await consumeTextStream({
        stream,
        parseSSE,
        signal: controller.signal,
        onChunk: (chunk) => {
          setOutput((previousOutput) => previousOutput + chunk);
        },
      });

      setStatus("complete");
    } catch (generationError) {
      console.error("Generation error:", generationError);

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
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    }
  };

  const handleStop = () => {
    const controller = abortControllerRef.current;

    if (!controller) {
      return;
    }

    controller.abort();
  };
  const handleRetry = () => {
    if (!provider) {
      return;
    }

    handleGenerate(provider);
  };

  return (
    <div className="app">
      <div className="app-container">
        <Header />

        <main className="main-layout">
          <div className="left-panel">
            <GenerationForm
              input={input}
              operation={operation}
              onInputChange={setInput}
              onOperationChange={setOperation}
              disabled={isGenerating}
            />

            <ProviderButtons
              onGenerate={handleGenerate}
              disabled={isGenerating}
            />
          </div>

          <div className="right-panel">
            <ResponsePanel output={output} error={error} />

            <div className="status-controls-wrapper">
              <StreamingStatus status={status} />

              <GenerationControls
                status={status}
                onStop={handleStop}
                onRetry={handleRetry}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
