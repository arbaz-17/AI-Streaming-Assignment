function ProviderButtons({ onGenerate, disabled }) {
  return (
    <section className="provider-section">
      <h2>Choose AI Provider</h2>

      <div className="provider-buttons">
        <button
          type="button"
          onClick={() => onGenerate("mock")}
          disabled={disabled}
          className="provider-button"
        >
          Mock AI Response
        </button>

        <button
          type="button"
          onClick={() => onGenerate("real")}
          disabled={disabled}
          className="provider-button"
        >
          Real AI Response
        </button>
      </div>
    </section>
  );
}

export default ProviderButtons;