import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import Stepper from "../Stepper";
import {
  CONFIGURATOR_PANEL_ID,
  FIRST_STEP,
  LAST_STEP,
  STEPS,
  STEP_IDS,
} from "../../../data/catalog";

function renderStepper(props = {}) {
  const onSelect = vi.fn();
  render(
    <Stepper
      current={FIRST_STEP}
      furthest={LAST_STEP}
      onSelect={onSelect}
      {...props}
    />
  );
  return { onSelect };
}

describe("Stepper", () => {
  it("renderiza os cinco passos do catálogo numa lista única", () => {
    renderStepper();

    const tablist = screen.getByRole("tablist", { name: /etapas da compra/i });
    const tabs = within(tablist).getAllByRole("tab");

    expect(tabs).toHaveLength(STEPS.length);
    STEPS.forEach((step, index) => {
      expect(tabs[index]).toHaveAccessibleName(
        new RegExp(`passo ${index + 1}: ${step.label}`, "i")
      );
    });
  });

  it("marca aria-selected apenas no passo atual", () => {
    renderStepper({ current: STEP_IDS.PERSONAL });

    const selected = screen
      .getAllByRole("tab")
      .filter((tab) => tab.getAttribute("aria-selected") === "true");

    expect(selected).toHaveLength(1);
    expect(selected[0]).toHaveAccessibleName(/dados/i);
  });

  it("chama onSelect com o id do passo acionado", async () => {
    const user = userEvent.setup();
    const { onSelect } = renderStepper();

    await user.click(screen.getByRole("tab", { name: /entrega/i }));

    expect(onSelect).toHaveBeenCalledWith(STEP_IDS.DELIVERY);
  });

  it("desabilita os passos ainda não liberados pelo fluxo", async () => {
    const user = userEvent.setup();
    const { onSelect } = renderStepper({
      current: FIRST_STEP,
      furthest: STEP_IDS.OPTIONS,
    });

    const locked = screen.getByRole("tab", { name: /pagamento/i });
    expect(locked).toBeDisabled();

    await user.click(locked);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("aponta cada passo para o painel do configurador", () => {
    renderStepper();

    screen.getAllByRole("tab").forEach((tab) => {
      expect(tab).toHaveAttribute("aria-controls", CONFIGURATOR_PANEL_ID);
    });
  });
});
