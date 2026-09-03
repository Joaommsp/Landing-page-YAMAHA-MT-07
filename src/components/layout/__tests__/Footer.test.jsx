import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Footer from "../Footer";
import { SECTION_IDS, sectionHref } from "../../../data/catalog";

/* AC MT07-12.1 — o rodapé exibe o crédito de autoria e o aviso de uso não
   comercial. Os dois textos são o motivo de a seção existir e não tinham
   nenhuma assertiva. */

const CREDIT = "Desenvolvido por João Marcos";
const NON_COMMERCIAL =
  "Projeto sem fim comercial: todos os direitos pertencem à marca oficial.";

describe("Footer", () => {
  it("exibe o crédito de autoria", () => {
    render(<Footer />);

    expect(screen.getByRole("contentinfo")).toHaveTextContent(CREDIT);
  });

  it("exibe o aviso de uso não comercial", () => {
    render(<Footer />);

    expect(screen.getByRole("contentinfo")).toHaveTextContent(NON_COMMERCIAL);
  });

  /* Pega drift de id: renomear uma seção sem acertar o rodapé deixaria link
     apontando para o vazio, sem erro de build (AD-014). */
  it("aponta cada âncora do rodapé para o id atual da seção", () => {
    render(<Footer />);

    const nav = screen.getByRole("navigation", { name: /rodapé/i });
    const expected = [
      [/início/i, SECTION_IDS.hero],
      [/ficha técnica/i, SECTION_IDS.specSheet],
      [/galeria/i, SECTION_IDS.gallery],
    ];

    expected.forEach(([name, sectionId]) => {
      expect(within(nav).getByRole("link", { name })).toHaveAttribute(
        "href",
        sectionHref(sectionId)
      );
    });
  });
});
