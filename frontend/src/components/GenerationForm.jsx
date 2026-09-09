function GenerationForm({
  input,
  operation,
  onInputChange,
  onOperationChange,
  onLoadSample,
  disabled,
}) {
  return (
    <section className="generation-form">
      <div className="form-group">
        <div className="input-header">
          <label htmlFor="input-text">Enter your text</label>

          <button
            type="button"
            onClick={onLoadSample}
            disabled={disabled}
            className="load-sample-button"
          >
            Load Sample
          </button>
        </div>

        <textarea
          id="input-text"
          value={input}
          onChange={(event) => onInputChange(event.target.value)}
          placeholder="Paste your text here..."
          disabled={disabled}
          rows={10}
        />
      </div>

      <div className="form-group operation-group">
        <label htmlFor="operation">Operation</label>

        <select
          id="operation"
          value={operation}
          onChange={(event) => onOperationChange(event.target.value)}
          disabled={disabled}
        >
          <option value="summarize">Summarize</option>
          <option value="rewrite">Rewrite</option>
        </select>
      </div>
    </section>
  );
}

export default GenerationForm;