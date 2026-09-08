import { useState } from "react";

import Header from "./components/Header";
import GenerationForm from "./components/GenerationForm";
import ProviderButtons from "./components/ProviderButtons";
import ResponsePanel from "./components/ResponsePanel";
import StreamingStatus from "./components/StreamingStatus";
import GenerationControls from "./components/GenerationControls";

import { createMockAIStream } from "./services/mockAI";

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

  const isGenerating =
    status === "starting" || status === "streaming";

  const handleGenerate = async (selectedProvider) => {
    if (!input.trim()) {
      setError("Please enter some text before generating a response.");
      setStatus("error");
      return;
    }

    setProvider(selectedProvider);
    setOutput("");
    setError("");

    if (selectedProvider !== "mock") {
      setStatus("starting");
      return;
    }

    try {
      setStatus("starting");

      const stream = createMockAIStream(operation);

      const reader = stream.getReader();
      const decoder = new TextDecoder();

      setStatus("streaming");

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        const chunk = decoder.decode(value, {
          stream: true,
        });

        setOutput((previousOutput) => previousOutput + chunk);
      }

      setStatus("complete");
    } catch (streamError) {
      console.error("Mock streaming error:", streamError);

      setError("Something went wrong while generating the response.");
      setStatus("error");
    }
  };

  const handleStop = () => {
    setStatus("stopped");
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
          {/* Left Panel: Inputs and Triggers */}
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

          {/* Right Panel: Results and Controls */}
          <div className="right-panel">
            <ResponsePanel
              output={output}
              error={error}
            />

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