import { useEffect, useState } from "react";
import PropTypes from "prop-types";

import Field from "../ui/Field";
import { FIELD_TYPES, STEP_FIELDS } from "../../data/catalog";
import { maskByType } from "../../lib/masks";
import { validateField } from "../../lib/validation";

/* Grade de campos de um passo. Os três passos com formulário — dados, entrega
   e pagamento — usam esta grade: a lista de campos vem do catálogo, a máscara
   vem de `maskByType` e a mensagem de erro vem do validador. Nenhum passo
   repete esse encanamento. */

/* Constantes estáveis: usadas como valor padrão de prop, um literal novo a cada
   render viraria dependência instável mais adiante. */
const EMPTY_FIELDS = [];
const EMPTY_VALUES = {};

/* Tipo do campo → tipo do input e teclado do celular. É tradução de
   apresentação, não regra: a regra (máscara e validador) mora no catálogo. */
const INPUT_TYPE = {
  [FIELD_TYPES.EMAIL]: "email",
  [FIELD_TYPES.PHONE]: "tel",
};

const NUMERIC_TYPES = [
  FIELD_TYPES.CPF,
  FIELD_TYPES.PHONE,
  FIELD_TYPES.CEP,
  FIELD_TYPES.CARD,
  FIELD_TYPES.EXPIRATION,
  FIELD_TYPES.CVV,
];

function fieldId(name) {
  return `campo-${name}`;
}

function FieldGrid({
  stepId,
  values = EMPTY_VALUES,
  errors = EMPTY_VALUES,
  hints = EMPTY_VALUES,
  disabled = false,
  columns = "auto",
  onChange,
}) {
  /* Erro de saída de campo: nasce no `blur` e morre na próxima digitação. O
     erro do fluxo (avançar ou finalizar) chega por prop e tem precedência. */
  const [blurErrors, setBlurErrors] = useState(EMPTY_VALUES);

  /* Trocar de passo zera o erro de saída de campo. Hoje cada passo é uma
     instância própria (o `AnimatePresence` desmonta), mas depender disso deixa
     o erro de um passo aparecer no seguinte se a montagem passar a ser reusada. */
  useEffect(() => {
    setBlurErrors(EMPTY_VALUES);
  }, [stepId]);

  const fields = STEP_FIELDS[stepId] || EMPTY_FIELDS;

  const handleChange = (field) => (event) => {
    setBlurErrors((current) => {
      if (!current[field.name]) return current;
      const next = { ...current };
      delete next[field.name];
      return next;
    });

    onChange(field.name, maskByType(field.type, event.target.value));
  };

  const handleBlur = (field) => (event) => {
    const message = validateField(field, event.target.value);
    setBlurErrors((current) => ({ ...current, [field.name]: message }));
  };

  return (
    <div
      className={`grid gap-x-5 gap-y-5.5 pt-7 ${
        columns === "pair"
          ? "sm:grid-cols-2"
          : "sm:grid-cols-2 lg:grid-cols-3"
      }`}
    >
      {fields.map((field) => (
        <Field
          disabled={disabled}
          error={errors[field.name] ?? blurErrors[field.name] ?? ""}
          hint={hints[field.name]}
          id={fieldId(field.name)}
          inputMode={
            NUMERIC_TYPES.includes(field.type) ? "numeric" : undefined
          }
          key={field.name}
          label={field.label}
          maxLength={field.maxLength}
          onBlur={handleBlur(field)}
          onChange={handleChange(field)}
          type={INPUT_TYPE[field.type] ?? "text"}
          value={values[field.name] ?? ""}
        />
      ))}
    </div>
  );
}

FieldGrid.propTypes = {
  stepId: PropTypes.number.isRequired,
  values: PropTypes.object,
  errors: PropTypes.object,
  hints: PropTypes.object,
  disabled: PropTypes.bool,
  columns: PropTypes.oneOf(["auto", "pair"]),
  onChange: PropTypes.func.isRequired,
};

export default FieldGrid;
