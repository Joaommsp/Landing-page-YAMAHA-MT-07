import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import Configurator from "../Configurator";
import { STEPS } from "../../../data/catalog";
import { animatedNodes } from "../../../test/motionMarks";

/* AC MT07-10.4 no painel do configurador: sem animação a troca de passo não
   tem saída a esperar, e o painel novo está no DOM na mesma hora. Arquivo
   separado porque o mock de `motion/react` vale para o arquivo inteiro. */
vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useReducedMotion: () => true };
});

describe("Configurator com movimento reduzido", () => {
  it("troca o painel sem animação de transição", async () => {
    const user = userEvent.setup();
    render(<Configurator isOpen onClose={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Próximo" }));

    /* `getBy`, não `findBy`: não há painel saindo de cena para esperar. */
    expect(
      screen.getByText(`Passo 2 de ${STEPS.length} — ${STEPS[1].label}`)
    ).toBeInTheDocument();
    expect(animatedNodes(screen.getByRole("tabpanel"))).toHaveLength(0);
  });
});
