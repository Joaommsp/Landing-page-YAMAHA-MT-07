import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import SpecSheet from "../SpecSheet";
import { SPECS } from "../../../data/catalog";

/* AC MT07-02.3 — a barra de cada linha é proporcional ao valor da
   especificação, e a proporção é o `ratio` do catálogo (AD-015, AD-030). O
   comprimento não é escolhido no componente: mudar o `ratio` do catálogo tem
   de mudar a barra, e nada mais tem de mudá-la. */

/* A barra é a única filha da trilha (o `span` decorativo de cada linha), então
   a busca é escopada nela — e não numa varredura de tudo que tem estilo inline,
   que dependeria de o `Reveal` nunca animar largura. */
function barWidths(root) {
  return Array.from(
    root.querySelectorAll('[aria-hidden="true"] > [style]')
  ).map((node) => node.style.width);
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
});
