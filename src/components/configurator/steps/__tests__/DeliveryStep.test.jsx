import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import DeliveryStep from "../DeliveryStep";
import { STEP_FIELDS, STEP_IDS } from "../../../../data/catalog";
import { MESSAGES } from "../../../../lib/validation";

const FIELDS = STEP_FIELDS[STEP_IDS.DELIVERY];
const EMPTY = {};

function renderStep(props = {}) {
  const onChange = vi.fn();
  render(
    <DeliveryStep errors={EMPTY} onChange={onChange} values={EMPTY} {...props} />
  );
  return { onChange };
}

function ControlledDeliveryStep() {
  const [values, setValues] = useState(EMPTY);

  return (
    <DeliveryStep
      errors={EMPTY}
      onChange={(name, value) =>
        setValues((current) => ({ ...current, [name]: value }))
      }
      values={values}
    />
  );
}

describe("DeliveryStep", () => {
  it("rotula todos os campos de endereço do catálogo", () => {
    renderStep();

    FIELDS.forEach((field) => {
      expect(screen.getByLabelText(field.label)).toBeInTheDocument();
    });
  });

  it("aplica a máscara 00000-000 ao digitar o CEP", async () => {
    const user = userEvent.setup();
    render(<ControlledDeliveryStep />);

    await user.type(screen.getByLabelText("CEP"), "30140071");

    expect(screen.getByLabelText("CEP")).toHaveValue("30140-071");
  });

  it("exibe erro ao sair de campo obrigatório vazio", async () => {
    const user = userEvent.setup();
    renderStep();

    await user.click(screen.getByLabelText("Rua"));
    await user.tab();

    expect(screen.getByText(MESSAGES.required)).toBeInTheDocument();
  });

  it("exibe a mensagem do validador para CEP incompleto", async () => {
    const user = userEvent.setup();
    renderStep({ values: { cep: "30140" } });

    await user.click(screen.getByLabelText("CEP"));
    await user.tab();

    expect(screen.getByText(MESSAGES.cep)).toBeInTheDocument();
  });
});
