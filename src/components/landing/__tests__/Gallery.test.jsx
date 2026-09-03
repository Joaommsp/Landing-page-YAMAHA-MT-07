import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Gallery from "../Gallery";
import { GALLERY_CHAPTERS, chapterSpecs } from "../../../data/catalog";

/* AC MT07-02.4 — a seção apresenta capítulos empilhados, cada um com foto,
   argumento e os números daquele detalhe (AD-033: o trilho horizontal com snap
   deu lugar aos capítulos alternados).

   O que se trava aqui é o conteúdo: todo capítulo do catálogo aparece com sua
   foto, seu rótulo, seu título, seu texto e seus dados, e nenhum número é
   escrito no componente — todos chegam resolvidos do catálogo. A alternância
   de lado é desenho e depende de layout, que o jsdom não calcula; está
   registrada como limitação de ambiente em `validation.md`. */

function chapterOf(chapter) {
  return screen.getByAltText(chapter.alt).closest("article");
}

describe("Gallery", () => {
  it("apresenta cada capítulo do catálogo com a foto do dado", () => {
    render(<Gallery />);

    expect(screen.getAllByRole("article")).toHaveLength(
      GALLERY_CHAPTERS.length
    );

    GALLERY_CHAPTERS.forEach((chapter) => {
      expect(screen.getByAltText(chapter.alt)).toBeInTheDocument();
    });
  });

  it("escreve o rótulo, o título e o argumento de cada capítulo", () => {
    render(<Gallery />);

    GALLERY_CHAPTERS.forEach((chapter, index) => {
      const article = within(chapterOf(chapter));
      const position = String(index + 1).padStart(2, "0");

      expect(
        article.getByText(`${position} · ${chapter.eyebrow}`)
      ).toBeInTheDocument();
      expect(article.getByText(chapter.text)).toBeInTheDocument();
      expect(
        article.getByRole("heading", {
          name: new RegExp(chapter.title.join("\\s*"), "i"),
        })
      ).toBeInTheDocument();
    });
  });

  it("mostra os números que o capítulo declara, com o valor do catálogo", () => {
    render(<Gallery />);

    GALLERY_CHAPTERS.forEach((chapter) => {
      const article = within(chapterOf(chapter));

      chapterSpecs(chapter).forEach((spec) => {
        expect(article.getByText(spec.name)).toBeInTheDocument();
        expect(article.getByText(spec.value)).toBeInTheDocument();
        expect(article.getByText(spec.unitShort)).toBeInTheDocument();
      });
    });
  });

  /* Capítulo sem número não pode renderizar a lista vazia: seria um divisor
     solto sob o texto, sem nada embaixo. */
  it("não desenha lista de números no capítulo que não tem nenhum", () => {
    render(<Gallery />);

    const withoutSpecs = GALLERY_CHAPTERS.filter(
      (chapter) => chapterSpecs(chapter).length === 0
    );
    expect(withoutSpecs.length).toBeGreaterThan(0);

    withoutSpecs.forEach((chapter) => {
      expect(chapterOf(chapter).querySelector("dl")).toBeNull();
    });
  });
});
