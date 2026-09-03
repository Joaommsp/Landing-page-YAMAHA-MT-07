import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Gallery from "../Gallery";
import { GALLERY } from "../../../data/catalog";

/* AC MT07-02.4 — arrastar o trilho alinha a imagem seguinte ao início dele.
   O jsdom não tem layout nem rolagem, então o encaixe em si não é observável
   aqui: o que se trava é o contrato que o navegador executa — eixo e
   obrigatoriedade do snap no trilho, ponto de encaixe no início de CADA item e
   a rolagem contida no próprio trilho. Registrado como limitação de ambiente
   em `validation.md`. */

const TRACK_NAME = /galeria de fotos/i;

function track() {
  return screen.getByRole("region", { name: TRACK_NAME });
}

describe("Gallery", () => {
  it("põe cada foto do catálogo no trilho, com o texto alternativo do dado", () => {
    render(<Gallery />);

    GALLERY.forEach((item) => {
      expect(within(track()).getByAltText(item.alt)).toBeInTheDocument();
    });
  });

  it("declara o snap horizontal obrigatório no trilho, com rolagem contida nele", () => {
    render(<Gallery />);

    expect(track()).toHaveClass("snap-x", "snap-mandatory", "overflow-x-auto");
    /* Trilho focável: quem navega por teclado precisa alcançar a rolagem. */
    expect(track()).toHaveAttribute("tabindex", "0");
  });

  it("marca o início de cada foto como ponto de encaixe", () => {
    render(<Gallery />);

    const figures = Array.from(track().querySelectorAll("figure"));

    expect(figures).toHaveLength(GALLERY.length);
    figures.forEach((figure) => {
      expect(figure).toHaveClass("snap-start", "flex-none");
    });
  });
});
