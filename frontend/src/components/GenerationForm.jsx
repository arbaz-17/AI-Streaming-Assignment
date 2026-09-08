function GenerationForm({
  input,
  operation,
  onInputChange,
  onOperationChange,
  disabled,
}) {
  return (
    <section className="generation-form">
      <div className="form-group">
        <label htmlFor="input-text">Enter your text</label>

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