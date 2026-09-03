import PropTypes from "prop-types";

import FieldGrid from "../FieldGrid";
import { STEP_IDS } from "../../../data/catalog";

/* Passo 4 — endereço de entrega. Mesma grade do passo de dados: a lista de
   campos e os tetos vêm do catálogo, aqui fica só a copy de apoio. */

const HINTS = {
  cep: "Define o prazo e a transportadora",
  state: "Sigla de duas letras",
};

function DeliveryStep({ values, errors, disabled, onChange }) {
  return (
    <FieldGrid
      disabled={disabled}
      errors={errors}
      hints={HINTS}
      onChange={onChange}
      stepId={STEP_IDS.DELIVERY}
      values={values}
    />
  );
}

DeliveryStep.propTypes = {
  values: PropTypes.object,
  errors: PropTypes.object,
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

export default DeliveryStep;
