import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import Home from "../index";
import { STEPS } from "../../../data/catalog";

const OPEN_LABEL = /montar a minha/i;
const CLOSE_LABEL = /fechar configurador/i;
const FIRST_STEP_HEADING = `Passo 1 de ${STEPS.length} — ${STEPS[0].label}`;

function heroTrigger() {
  return within(screen.getByRole("main")).getByRole("button", {
    name: OPEN_LABEL,
  });
}

function headerTrigger() {
  return within(screen.getByRole("banner")).getByRole("button", {
    name: OPEN_LABEL,
  });
}

async function closeConfigurator(user) {
  await user.click(screen.getByRole("button", { name: CLOSE_LABEL }));
}

describe("Home", () => {
  it("abre o configurador no passo 1 pelo botão do hero", async () => {
    const user = userEvent.setup();
    render(<Home />);

    expect(screen.queryByRole("dialog")).toBeNull();

    await user.click(heroTrigger());

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(FIRST_STEP_HEADING)).toBeInTheDocument();
  });

  it("abre o configurador pelo botão do cabeçalho", async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.click(headerTrigger());

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(FIRST_STEP_HEADING)).toBeInTheDocument();
  });

  it("devolve o foco ao botão do hero quando o configurador fecha", async () => {
    const user = userEvent.setup();
    render(<Home />);

    const trigger = heroTrigger();
    await user.click(trigger);
    await closeConfigurator(user);

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(trigger).toHaveFocus();
  });

  it("devolve o foco ao botão do cabeçalho quando o configurador fecha", async () => {
    const user = userEvent.setup();
    render(<Home />);

    const trigger = headerTrigger();
    await user.click(trigger);
    await closeConfigurator(user);

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(trigger).toHaveFocus();
  });

  it("aponta cada âncora do cabeçalho para uma seção existente da página", () => {
    render(<Home />);

    const links = within(screen.getByRole("banner")).getAllByRole("link");
    const anchors = links
      .map((link) => link.getAttribute("href"))
      .filter((href) => href?.startsWith("#"));

    expect(anchors.length).toBeGreaterThan(0);
    anchors.forEach((href) => {
      expect(document.getElementById(href.slice(1))).not.toBeNull();
    });
  });
});
