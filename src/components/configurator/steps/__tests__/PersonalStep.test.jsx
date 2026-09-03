import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import PersonalStep from "../PersonalStep";
import { STEP_FIELDS, STEP_IDS } from "../../../../data/catalog";
import { MESSAGES } from "../../../../lib/validation";

const FIELDS = STEP_FIELDS[STEP_IDS.PERSONAL];
const EMPTY = {};

function renderStep(props = {}) {
  const onChange = vi.fn();
  const view = render(
    <PersonalStep
      errors={EMPTY}
      onChange={onChange}
      values={EMPTY}
      {...props}
    />
  );
  return { onChange, view };
}

/* O passo é controlado: sem estado por cima dele, cada tecla substituiria a
   anterior e a máscara nunca se formaria. */
function ControlledPersonalStep() {
  const [values, setValues] = useState(EMPTY);

  return (
    <PersonalStep
      errors={EMPTY}
      onChange={(name, value) =>
        setValues((current) => ({ ...current, [name]: value }))
      }
      values={values}
    />
  );
}

describe("PersonalStep", () => {
  it("rotula todos os campos do passo, sem ícone no rótulo", () => {
    renderStep();

    FIELDS.forEach((field) => {
      const input = screen.getByLabelText(field.label);
      expect(input).toBeInTheDocument();

      const label = document.querySelector(`label[for="${input.id}"]`);
      expect(label.querySelector("svg, img")).toBeNull();
      expect(label).toHaveTextContent(field.label);
    });
  });

  it("exibe erro no campo obrigatório deixado vazio", async () => {
    const user = userEvent.setup();
    renderStep();

    await user.click(screen.getByLabelText("Nome"));
    await user.tab();

    expect(screen.getByText(MESSAGES.required)).toBeInTheDocument();
  });

  it("exibe a mensagem do validador para e-mail inválido", async () => {
    const user = userEvent.setup();
    renderStep({ values: { email: "joao@exemplo" } });

    await user.click(screen.getByLabelText("E-mail"));
    await user.tab();

    expect(screen.getByText(MESSAGES.email)).toBeInTheDocument();
  });

  it("exibe a mensagem do validador para CPF inválido", async () => {
    const user = userEvent.setup();
    renderStep({ values: { cpf: "123.456.789-00" } });

    await user.click(screen.getByLabelText("CPF"));
    await user.tab();

    expect(screen.getByText(MESSAGES.cpf)).toBeInTheDocument();
  });

  it("exibe contador de caracteres nos campos com limite", () => {
    renderStep({ values: { firstName: "João" } });

    const field = FIELDS.find((item) => item.name === "firstName");
    expect(
      screen.getByText(`4/${field.maxLength}`)
    ).toBeInTheDocument();
  });

  it("aplica a máscara brasileira ao digitar", async () => {
    const user = userEvent.setup();
    render(<ControlledPersonalStep />);

    await user.type(screen.getByLabelText("CPF"), "12345678909");
    expect(screen.getByLabelText("CPF")).toHaveValue("123.456.789-09");

    await user.type(screen.getByLabelText("Telefone"), "31998765432");
    expect(screen.getByLabelText("Telefone")).toHaveValue("(31) 99876-5432");
  });

  it("desabilita todos os campos enquanto o pedido é enviado", () => {
    renderStep({ disabled: true });

    FIELDS.forEach((field) => {
      expect(screen.getByLabelText(field.label)).toBeDisabled();
    });
  });
});
