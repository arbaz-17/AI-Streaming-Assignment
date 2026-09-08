function GenerationControls({
  status,
  onStop,
  onRetry,
}) {
  const canStop = status === "starting" || status === "streaming";

  const canRetry =
    status === "complete" ||
    status === "stopped" ||
    status === "error";

  return (
    <section className="generation-controls">
      <button
        type="button"
        onClick={onStop}
        disabled={!canStop}
        className="control-button stop-button"
      >
        Stop
      </button>

      <button
        type="button"
        onClick={onRetry}
        disabled={!canRetry}
        className="control-button retry-button"
      >
        Retry
      </button>
    </section>
  );
}

export default GenerationControls;