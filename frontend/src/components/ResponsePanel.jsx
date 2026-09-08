function ResponsePanel({ output, error }) {
  return (
    <section className="response-section">
      <div className="section-heading">
        <h2>AI Response</h2>
      </div>

      <div
        className={`response-panel ${error ? "response-panel-error" : ""}`}
        aria-live="polite"
        aria-label="AI response"
      >
        {error ? (
          <p className="error-message">{error}</p>
        ) : output ? (
          <p>{output}</p>
        ) : (
          <p className="response-placeholder">
            Your AI response will appear here...
          </p>
        )}
      </div>
    </section>
  );
}

export default ResponsePanel;