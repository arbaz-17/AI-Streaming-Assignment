const STATUS_LABELS = {
  idle: "Idle",
  starting: "Starting...",
  streaming: "Streaming...",
  complete: "Complete",
  stopped: "Stopped",
  error: "Error",
};

function StreamingStatus({ status }) {
  const label = STATUS_LABELS[status] ?? "Unknown";

  return (
    <div className={`streaming-status status-${status}`}>
      <span className="status-indicator" />
      <span>
        Status: <strong>{label}</strong>
      </span>
    </div>
  );
}

export default StreamingStatus;