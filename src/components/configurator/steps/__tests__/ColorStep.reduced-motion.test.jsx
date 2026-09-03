import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ColorStep from "../ColorStep";
import { COLORS } from "../../../../data/catalog";
import { animatedNodes } from "../../../../test/motionMarks";

/* AC MT07-10.4 na troca de cor: sem animação a foto nova entra direto e sozinha
   — o crossfade é que mantém duas em cena enquanto uma sai. Arquivo separado
   porque o mock de `motion/react` vale para o arquivo inteiro. */
vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useReducedMotion: () => true };
});

describe("ColorStep com movimento reduzido", () => {
  it("troca a foto da cor sem crossfade", () => {
    const [first, second] = COLORS;
    const { container, rerender } = render(
      <ColorStep colorId={first.id} onSelect={vi.fn()} />
    );

    expect(screen.getByAltText(`Yamaha MT-07 ${first.name}`)).toBeInTheDocument();
    expect(animatedNodes(container)).toHaveLength(0);

    rerender(<ColorStep colorId={second.id} onSelect={vi.fn()} />);

    expect(screen.getByAltText(`Yamaha MT-07 ${second.name}`)).toBeInTheDocument();
    expect(container.querySelectorAll("img")).toHaveLength(1);
    expect(animatedNodes(container)).toHaveLength(0);
  });
});
