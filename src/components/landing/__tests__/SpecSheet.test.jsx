import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import SpecSheet from "../SpecSheet";
import { SPECS } from "../../../data/catalog";

/* AC MT07-02.3 — a barra de cada linha é proporcional ao valor da
   especificação, e a proporção é o `ratio` do catálogo (AD-015, AD-030). O
   comprimento não é escolhido no componente: mudar o `ratio` do catálogo tem
   de mudar a barra, e nada mais tem de mudá-la. */

/* A barra é o único elemento da ficha com largura inline; os wrappers do
   `Reveal` carregam opacidade e deslocamento, não largura. */
function barWidths(root) {
  return Array.from(root.querySelectorAll("[style]"))
    .filter((node) => node.style.width !== "")
    .map((node) => node.style.width);
}

const expectedWidth = (ratio) => `${Math.round(ratio * 100)}%`;

describe("SpecSheet", () => {
  it("exibe uma linha por especificação do catálogo", () => {
    render(<SpecSheet />);

    SPECS.forEach((spec) => {
      expect(screen.getByText(spec.name)).toBeInTheDocument();
      expect(screen.getByText(spec.value)).toBeInTheDocument();
    });
  });

  it("desenha a barra de cada linha com a largura do ratio do catálogo", () => {
    const { container } = render(<SpecSheet />);

    expect(barWidths(container)).toEqual(SPECS.map((spec) => expectedWidth(spec.ratio)));
  });

  it("não repete a mesma largura em especificações de ratio diferente", () => {
    const { container } = render(<SpecSheet />);

    const widths = barWidths(container);
    const ratios = new Set(SPECS.map((spec) => spec.ratio));

    /* Guarda contra barra de comprimento fixo: tantas larguras distintas
       quantos `ratio` distintos o catálogo tem. */
    expect(new Set(widths).size).toBe(ratios.size);
    expect(widths).toHaveLength(SPECS.length);
  });
});
