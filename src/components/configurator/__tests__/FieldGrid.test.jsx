import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import FieldGrid from "../FieldGrid";
import { STEP_FIELDS, STEP_IDS } from "../../../data/catalog";
import { MESSAGES } from "../../../lib/validation";

const PERSONAL_FIELDS = STEP_FIELDS[STEP_IDS.PERSONAL];
const DELIVERY_FIELDS = STEP_FIELDS[STEP_IDS.DELIVERY];

function renderGrid(props = {}) {
  const onChange = vi.fn();
  const view = render(
    <FieldGrid onChange={onChange} stepId={STEP_IDS.PERSONAL} {...props} />
  );
  return { onChange, view };
}

describe("FieldGrid", () => {
  it("desenha os campos que o catálogo define para o passo", () => {
    renderGrid();

    PERSONAL_FIELDS.forEach((field) => {
      expect(screen.getByLabelText(field.label)).toBeInTheDocument();
    });
  });

  it("aplica a máscara do tipo do campo ao digitar", async () => {
    const user = userEvent.setup();
    const { onChange } = renderGrid();

    await user.type(screen.getByLabelText("CPF"), "1");

    expect(onChange).toHaveBeenCalledWith("cpf", "1");
  });

  it("mostra o erro do validador ao sair do campo vazio", async () => {
    const user = userEvent.setup();
    renderGrid();

    await user.click(screen.getByLabelText("Nome"));
    await user.tab();

    expect(screen.getByText(MESSAGES.required)).toBeInTheDocument();
  });

  /* O erro nasce no blur e vive na instância. Trocar de passo tem de zerá-lo:
     sem isso, o erro de um passo reaparece no seguinte se a montagem for
     reusada — hoje só não acontece porque o painel é desmontado na transição. */
  it("descarta o erro de saída de campo ao trocar de passo", async () => {
    const user = userEvent.setup();
    const { view } = renderGrid();

    await user.click(screen.getByLabelText("Nome"));
    await user.tab();
    expect(screen.getByText(MESSAGES.required)).toBeInTheDocument();

    view.rerender(
      <FieldGrid onChange={vi.fn()} stepId={STEP_IDS.DELIVERY} />
    );
    expect(screen.getByLabelText(DELIVERY_FIELDS[0].label)).toBeInTheDocument();

    /* Voltar ao passo original é o que revela se o erro foi descartado: sem o
       descarte, o campo reaparece já marcado por um blur de antes. */
    view.rerender(
      <FieldGrid onChange={vi.fn()} stepId={STEP_IDS.PERSONAL} />
    );

    expect(screen.getByLabelText("Nome")).toBeInTheDocument();
    expect(screen.queryByText(MESSAGES.required)).not.toBeInTheDocument();
  });
});
