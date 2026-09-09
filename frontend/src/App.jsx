import { useState } from "react";

import Header from "./components/Header";
import GenerationForm from "./components/GenerationForm";
import ProviderButtons from "./components/ProviderButtons";
import ResponsePanel from "./components/ResponsePanel";
import StreamingStatus from "./components/StreamingStatus";
import GenerationControls from "./components/GenerationControls";

import { useAIStreaming } from "./hooks/useAIStreaming";
import { SAMPLE_TEXT } from "./constants/sampleText";

import "./styles/layout.css";
import "./styles/components.css";

function App() {
  const [input, setInput] = useState("");
  const [operation, setOperation] = useState("summarize");

  const {
    output,
    status,
    error,
    isGenerating,
    handleGenerate,
    handleStop,
    handleRetry,
  } = useAIStreaming({
    input,
    operation,
  });

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
              onLoadSample={() => setInput(SAMPLE_TEXT)}
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
