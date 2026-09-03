import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import OptionsStep from "../OptionsStep";
import { OPTIONS } from "../../../../data/catalog";
import { formatBRL } from "../../../../lib/currency";

const CATALOG_OPTIONS = OPTIONS.filter((option) => !option.featured);
const FEATURED = OPTIONS.find((option) => option.featured);
const EMPTY = [];

function renderStep(props = {}) {
  const onToggle = vi.fn();
  render(<OptionsStep optionIds={EMPTY} onToggle={onToggle} {...props} />);
  return { onToggle };
}

describe("OptionsStep", () => {
  it("lista os opcionais do catálogo com preço em BRL completo", () => {
    renderStep();

    const group = screen.getByRole("group", { name: /opcionais/i });

    CATALOG_OPTIONS.forEach((option) => {
      const item = within(group).getByRole("button", {
        name: new RegExp(option.name, "i"),
      });
      expect(item).toHaveTextContent(`+ ${formatBRL(option.price)}`);
      expect(item).toHaveTextContent(option.description);
    });
  });

  it("chama onToggle com o id ao marcar um opcional", async () => {
    const user = userEvent.setup();
    const { onToggle } = renderStep();
    const [option] = CATALOG_OPTIONS;

    await user.click(
      screen.getByRole("button", { name: new RegExp(option.name, "i") })
    );

    expect(onToggle).toHaveBeenCalledWith(option.id);
  });

  it("chama onToggle com o mesmo id ao desmarcar um opcional já marcado", async () => {
    const user = userEvent.setup();
    const [option] = CATALOG_OPTIONS;
    const { onToggle } = renderStep({ optionIds: [option.id] });

    const button = screen.getByRole("button", {
      name: new RegExp(option.name, "i"),
    });
    expect(button).toHaveAttribute("aria-pressed", "true");

    await user.click(button);
    expect(onToggle).toHaveBeenCalledWith(option.id);
  });

  it("marca com aria-pressed apenas os opcionais escolhidos", () => {
    const [first, second] = CATALOG_OPTIONS;
    renderStep({ optionIds: [second.id] });

    expect(
      screen.getByRole("button", { name: new RegExp(first.name, "i") })
    ).toHaveAttribute("aria-pressed", "false");
    expect(
      screen.getByRole("button", { name: new RegExp(second.name, "i") })
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("destaca o kit de personalização com preço e ação de adicionar ou remover", async () => {
    const user = userEvent.setup();
    const { onToggle } = renderStep();

    expect(screen.getByText(formatBRL(FEATURED.price))).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /adicionar kit/i }));
    expect(onToggle).toHaveBeenCalledWith(FEATURED.id);

    renderStep({ optionIds: [FEATURED.id] });
    expect(
      screen.getByRole("button", { name: /remover kit/i })
    ).toHaveAttribute("aria-pressed", "true");
  });
});
