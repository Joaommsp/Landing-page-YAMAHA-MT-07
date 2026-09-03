import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import Header from "../Header";

const MAIN_NAV = "Navegação principal";
const MENU_NAV = "Navegação do menu";

function renderHeader(onOpenConfigurator = vi.fn()) {
  render(<Header onOpenConfigurator={onOpenConfigurator} />);
  return { onOpenConfigurator };
}

describe("Header", () => {
  it("exibe a navegação por âncora da página", () => {
    renderHeader();

    const nav = screen.getByRole("navigation", { name: MAIN_NAV });
    const links = within(nav).getAllByRole("link");

    expect(links.length).toBeGreaterThan(0);
    links.forEach((link) => {
      expect(link.getAttribute("href")).toMatch(/^#/);
    });
  });

  it("começa com o menu fechado", () => {
    renderHeader();

    expect(screen.getByRole("button", { name: "Abrir menu" })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
    expect(screen.queryByRole("navigation", { name: MENU_NAV })).toBeNull();
  });

  it("abre e fecha o menu por estado do React", async () => {
    const user = userEvent.setup();
    renderHeader();

    await user.click(screen.getByRole("button", { name: "Abrir menu" }));

    const toggle = screen.getByRole("button", { name: "Fechar menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    const menu = screen.getByRole("navigation", { name: MENU_NAV });
    expect(within(menu).getAllByRole("link").length).toBeGreaterThan(0);

    await user.click(toggle);

    expect(screen.getByRole("button", { name: "Abrir menu" })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
    expect(screen.queryByRole("navigation", { name: MENU_NAV })).toBeNull();
  });

  it("aciona o configurador pelo botão do cabeçalho", async () => {
    const user = userEvent.setup();
    const { onOpenConfigurator } = renderHeader();

    await user.click(screen.getByRole("button", { name: /montar a minha/i }));

    expect(onOpenConfigurator).toHaveBeenCalledTimes(1);
  });
});
