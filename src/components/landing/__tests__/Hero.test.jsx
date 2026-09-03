import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import Hero from "../Hero";

function renderHero(props = {}) {
  const onOpenConfigurator = vi.fn();
  render(<Hero onOpenConfigurator={onOpenConfigurator} {...props} />);
  return { onOpenConfigurator };
}

describe("Hero", () => {
  it("exibe o nome do produto e o subtítulo na carga", () => {
    renderHero();

    expect(
      screen.getByRole("heading", { name: /mt-07 master of torque/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/hyper naked · 2025/i)).toBeInTheDocument();
  });

  it("exibe os três números de desempenho com a unidade", () => {
    renderHero();

    expect(screen.getByText("689")).toBeInTheDocument();
    expect(screen.getByText("cc")).toBeInTheDocument();
    expect(screen.getByText("74,8")).toBeInTheDocument();
    expect(screen.getByText("cv")).toBeInTheDocument();
    expect(screen.getByText("6,9")).toBeInTheDocument();
    expect(screen.getByText("kgf.m")).toBeInTheDocument();
  });

  it("exibe o preço inicial em BRL completo, sem abreviação", () => {
    renderHero();

    expect(screen.getByText("R$ 48.500,00")).toBeInTheDocument();
    expect(screen.queryByText(/48,5\s*(mil|k|mi)/i)).toBeNull();
  });

  it("abre o configurador pelo botão principal", async () => {
    const user = userEvent.setup();
    const { onOpenConfigurator } = renderHero();

    await user.click(screen.getByRole("button", { name: /montar a minha/i }));

    expect(onOpenConfigurator).toHaveBeenCalledTimes(1);
  });

  it("leva à ficha técnica pelo botão secundário", () => {
    renderHero({ specSheetHref: "#ficha-tecnica" });

    expect(screen.getByRole("link", { name: /ficha técnica/i })).toHaveAttribute(
      "href",
      "#ficha-tecnica"
    );
  });
});
