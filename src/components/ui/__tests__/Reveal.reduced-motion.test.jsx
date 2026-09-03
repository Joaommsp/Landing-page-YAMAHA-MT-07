import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Reveal from "../Reveal";
import { animatedNodes } from "../../../test/motionMarks";

/* AC MT07-10.4 — com `prefers-reduced-motion: reduce` o conteúdo chega em
   estado final, sem animação. O mock é do módulo e vale para o arquivo inteiro,
   então o ramo reduzido de cada componente mora num arquivo próprio, ao lado
   dele: o teste animado precisa do comportamento oposto. */
vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useReducedMotion: () => true };
});

describe("Reveal com movimento reduzido", () => {
  it("entrega a seção em estado final, sem animação de entrada", () => {
    const { container } = render(
      <Reveal as="section">Da pista para a rua</Reveal>
    );

    const section = screen.getByText("Da pista para a rua");

    expect(section.tagName).toBe("SECTION");
    expect(section).not.toHaveAttribute("style");
    expect(animatedNodes(container)).toHaveLength(0);
  });
});
