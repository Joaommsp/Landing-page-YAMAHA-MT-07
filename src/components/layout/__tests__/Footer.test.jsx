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

  it("aponta as âncoras da própria página pela fonte única do catálogo", () => {
    render(<Footer />);

    const nav = screen.getByRole("navigation", { name: /rodapé/i });

    expect(within(nav).getByRole("link", { name: /ficha técnica/i })).toHaveAttribute(
      "href",
      sectionHref(SECTION_IDS.specSheet)
    );
    expect(within(nav).getByRole("link", { name: /galeria/i })).toHaveAttribute(
      "href",
      sectionHref(SECTION_IDS.gallery)
    );
  });
});
