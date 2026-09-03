import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import ColorStep from "../ColorStep";
import { COLORS, DEFAULT_COLOR_ID } from "../../../../data/catalog";
import { formatBRL } from "../../../../lib/currency";

const PAID_COLOR = COLORS.find((color) => color.surcharge > 0);
const FREE_COLOR = COLORS.find((color) => color.surcharge === 0);

function renderStep(props = {}) {
  const onSelect = vi.fn();
  const view = render(
    <ColorStep colorId={DEFAULT_COLOR_ID} onSelect={onSelect} {...props} />
  );
  return { onSelect, view };
}

describe("ColorStep", () => {
  it("marca apenas a cor selecionada", () => {
    renderStep();

    const pressed = screen
      .getAllByRole("button")
      .filter((button) => button.getAttribute("aria-pressed") === "true");

    expect(pressed).toHaveLength(1);
    expect(pressed[0]).toHaveTextContent(
      COLORS.find((color) => color.id === DEFAULT_COLOR_ID).name
    );
  });

  it("chama onSelect com o id da cor acionada", async () => {
    const user = userEvent.setup();
    const { onSelect } = renderStep();

    await user.click(screen.getByRole("button", { name: new RegExp(PAID_COLOR.name, "i") }));

    expect(onSelect).toHaveBeenCalledWith(PAID_COLOR.id);
  });

  it("troca a imagem exibida quando a cor selecionada muda", async () => {
    const { view } = renderStep();

    view.rerender(<ColorStep colorId={PAID_COLOR.id} onSelect={vi.fn()} />);

    expect(
      await screen.findByAltText(new RegExp(`MT-07 ${PAID_COLOR.name}`, "i"))
    ).toBeInTheDocument();
  });

  it("exibe o acréscimo da cor em BRL completo e marca as sem custo", () => {
    renderStep();

    expect(screen.getByText(`+ ${formatBRL(PAID_COLOR.surcharge)}`)).toBeInTheDocument();
    expect(screen.getByText(`+ ${formatBRL(PAID_COLOR.surcharge)}`)).toHaveTextContent(
      /R\$/
    );
    expect(screen.getAllByText("Sem custo").length).toBe(
      COLORS.filter((color) => color.surcharge === 0).length
    );
    expect(FREE_COLOR).toBeDefined();
  });
});
