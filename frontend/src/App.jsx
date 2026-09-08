import { useState } from "react";

import Header from "./components/Header";
import GenerationForm from "./components/GenerationForm";
import ProviderButtons from "./components/ProviderButtons";
import ResponsePanel from "./components/ResponsePanel";
import StreamingStatus from "./components/StreamingStatus";
import GenerationControls from "./components/GenerationControls";

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

  const handleGenerate = (selectedProvider) => {
    if (!input.trim()) {
      setError("Please enter some text before generating a response.");
      setStatus("error");
      return;
    }

    setProvider(selectedProvider);
    setOutput("");
    setError("");

    /*
     * Actual generation will be implemented in later phases.
     *
     * For now we only establish the state transition that
     * a generation has started.
     */
    setStatus("starting");
  };

  const handleStop = () => {
    /*
     * AbortController will be implemented in Phase 6.
     */
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