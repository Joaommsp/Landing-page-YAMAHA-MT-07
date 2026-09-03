import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import Reveal from "../ui/Reveal";
import ColorStep from "../configurator/steps/ColorStep";
import Configurator from "../configurator/Configurator";
import { COLORS, STEPS } from "../../data/catalog";

/* AC MT07-10.4 — com `prefers-reduced-motion: reduce` o conteúdo tem de chegar
   em estado final, sem animação. São três ramos em produção (`Reveal`,
   o painel do `Configurator` e a troca de cor do `ColorStep`) e todos leem o
   mesmo `useReducedMotion`. O mock é do módulo, então o arquivo é separado:
   os demais testes precisam do comportamento animado.

   O que separa um ramo do outro é a marca do motion no DOM: sob animação o
   elemento nasce com `opacity: 0` e um `transform` de deslocamento inline;
   em estado final não há estilo inline nenhum. */
vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useReducedMotion: () => true };
});

/* Marca de animação em curso: estilo inline de opacidade ou deslocamento. */
function animatedNodes(root) {
  return Array.from(root.querySelectorAll("[style]")).filter(
    (node) => node.style.opacity !== "" || node.style.transform !== ""
  );
}

describe("movimento reduzido", () => {
  it("entrega a seção do Reveal em estado final, sem animação de entrada", () => {
    const { container } = render(
      <Reveal as="section">Da pista para a rua</Reveal>
    );

    const section = screen.getByText("Da pista para a rua");

    expect(section.tagName).toBe("SECTION");
    expect(section).not.toHaveAttribute("style");
    expect(animatedNodes(container)).toHaveLength(0);
  });

  it("troca o painel do configurador sem animação de transição", async () => {
    const user = userEvent.setup();
    render(<Configurator isOpen onClose={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Próximo" }));

    /* Sem animação o painel do passo seguinte está no DOM na mesma hora:
       `getBy`, não `findBy` — não há saída de painel a esperar. */
    expect(screen.getByRole("group", { name: /^opcionais$/i })).toBeInTheDocument();
    expect(
      screen.getByText(`Passo 2 de ${STEPS.length} — ${STEPS[1].label}`)
    ).toBeInTheDocument();
    expect(animatedNodes(screen.getByRole("tabpanel"))).toHaveLength(0);
  });

  it("troca a foto da cor sem crossfade", () => {
    const [first, second] = COLORS;
    const { container, rerender } = render(
      <ColorStep colorId={first.id} onSelect={vi.fn()} />
    );

    expect(screen.getByAltText(`Yamaha MT-07 ${first.name}`)).toBeInTheDocument();
    expect(animatedNodes(container)).toHaveLength(0);

    rerender(<ColorStep colorId={second.id} onSelect={vi.fn()} />);

    /* Uma foto por vez, já a da cor nova: o crossfade mantém as duas em cena
       enquanto uma sai, e é isso que o movimento reduzido não pode fazer. */
    expect(screen.getByAltText(`Yamaha MT-07 ${second.name}`)).toBeInTheDocument();
    expect(container.querySelectorAll("img")).toHaveLength(1);
    expect(animatedNodes(container)).toHaveLength(0);
  });
});
