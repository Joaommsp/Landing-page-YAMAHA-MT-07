import PropTypes from "prop-types";

import FieldGrid from "../FieldGrid";
import { STEP_IDS } from "../../../data/catalog";

/* Passo 3 — dados pessoais. Os campos, os tipos e os tetos vêm do catálogo;
   aqui fica só a copy de apoio de cada campo. */

const HINTS = {
  cpf: "Usado apenas para a nota fiscal",
  email: "Para onde vai a confirmação do pedido",
};

function PersonalStep({ values, errors, disabled, onChange }) {
  return (
    <FieldGrid
      disabled={disabled}
      errors={errors}
      hints={HINTS}
      onChange={onChange}
      stepId={STEP_IDS.PERSONAL}
      values={values}
    />
  );
}

PersonalStep.propTypes = {
  values: PropTypes.object,
  errors: PropTypes.object,
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

export default PersonalStep;
