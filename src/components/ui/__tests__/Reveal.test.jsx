import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Reveal from "../Reveal";

/* AC MT07-10.1 — a seção é revelada a partir de um deslocamento de NO MÁXIMO
   24px. O teto é da spec: movimento que sublinha a leitura, não que a
   atrapalha. Sem assertiva, subir o deslocamento para 96px passava batido. */

const MAX_OFFSET_PX = 24;

/* O estado inicial do motion chega como estilo inline: é dele que sai o
   deslocamento de entrada realmente aplicado ao elemento. */
function entryOffset(element) {
  const match = element.style.transform.match(/translateY\((-?[\d.]+)px\)/);
  return match ? Number(match[1]) : 0;
}

describe("Reveal", () => {
  it("entra de baixo, com deslocamento de no máximo 24px", () => {
    render(<Reveal>Conforto e postura</Reveal>);

    const section = screen.getByText("Conforto e postura");

    expect(entryOffset(section)).toBeGreaterThan(0);
    expect(entryOffset(section)).toBeLessThanOrEqual(MAX_OFFSET_PX);
  });

  it("desenha a tag pedida em `as`, com a classe de quem chama", () => {
    render(
      <Reveal as="footer" className="border-t">
        Rodapé
      </Reveal>
    );

    const footer = screen.getByText("Rodapé");

    expect(footer.tagName).toBe("FOOTER");
    expect(footer).toHaveClass("border-t");
  });
});
