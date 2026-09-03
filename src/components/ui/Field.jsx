import PropTypes from "prop-types";

/* Campo de formulário da casa: rótulo flutuante, contador de caracteres e uma
   única linha de apoio que vira mensagem de erro quando há erro.

   O rótulo não leva ícone decorativo, e a mensagem exibida é a que o validador
   devolveu — o campo não inventa texto genérico. */

const INPUT_CLASS =
  "peer border-0 border-b border-line bg-transparent px-0 pb-2 pt-5.5 " +
  "font-body text-body-sm text-paper transition-colors duration-300 " +
  "focus:border-cyan focus:outline-none aria-[invalid=true]:border-danger " +
  "disabled:cursor-not-allowed disabled:text-paper-dim";

/* O rótulo começa deitado sobre o campo e sobe quando há foco ou conteúdo. O
   `placeholder=" "` do input é o que torna `:placeholder-shown` confiável. */
const LABEL_CLASS =
  "pointer-events-none absolute left-0 top-5 origin-left text-body-sm text-paper-dim " +
  "transition-[transform,font-size,color] duration-300 ease-editorial " +
  "peer-focus:-translate-y-5 peer-focus:text-caption peer-focus:text-cyan " +
  "peer-[:not(:placeholder-shown)]:-translate-y-5 peer-[:not(:placeholder-shown)]:text-caption " +
  "peer-[:not(:placeholder-shown)]:text-khaki";

function Field({
  id,
  label,
  value = "",
  error = "",
  hint = "",
  maxLength,
  type = "text",
  inputMode,
  disabled = false,
  onBlur,
  onChange,
}) {
  const helpId = `${id}-ajuda`;
  const message = error || hint;

  return (
    <div className="relative flex flex-col">
      <input
        aria-describedby={message ? helpId : undefined}
        aria-invalid={error ? "true" : undefined}
        className={INPUT_CLASS}
        disabled={disabled}
        id={id}
        inputMode={inputMode}
        maxLength={maxLength}
        onBlur={onBlur}
        onChange={onChange}
        placeholder=" "
        type={type}
        value={value}
      />

      <label className={LABEL_CLASS} htmlFor={id}>
        {label}
      </label>

      {/* Contador só onde existe teto: sem limite não há o que contar. */}
      {maxLength !== undefined && (
        <span className="absolute right-0 top-6 font-mono text-caption tabular-nums text-khaki-dim">
          {`${value.length}/${maxLength}`}
        </span>
      )}

      {message && (
        <span
          className={`mt-1.5 font-mono text-caption ${
            error ? "text-danger" : "text-khaki-dim"
          }`}
          id={helpId}
        >
          {message}
        </span>
      )}
    </div>
  );
}

Field.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  error: PropTypes.string,
  hint: PropTypes.string,
  maxLength: PropTypes.number,
  type: PropTypes.string,
  inputMode: PropTypes.string,
  disabled: PropTypes.bool,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
};

export default Field;
