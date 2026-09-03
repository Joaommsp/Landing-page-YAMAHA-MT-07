import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import Configurator from "../Configurator";
import {
  BASE_PRICE,
  COLORS,
  INSTALLMENTS,
  OPTIONS,
  STEPS,
} from "../../../data/catalog";
import { formatBRL } from "../../../lib/currency";

const PAID_COLOR = COLORS.find((color) => color.surcharge > 0);
const OPTION = OPTIONS.find((option) => !option.featured);

const PERSONAL = {
  Nome: "João",
  Sobrenome: "Melo",
  CPF: "52998224725",
  "E-mail": "joao@exemplo.com",
  Telefone: "31998765432",
};

const PAYMENT = {
  "Nome no cartão": "Joao Melo",
  "Número do cartão": "4429881200431197",
  Validade: "1229",
  CVV: "123",
};

const DELIVERY = {
  CEP: "30140071",
  Rua: "Rua da Bahia",
  Número: "1200",
  Bairro: "Centro",
  Cidade: "Belo Horizonte",
  Estado: "MG",
};

function renderConfigurator(props = {}) {
  const onClose = vi.fn();
  const view = render(
    <Configurator isOpen onClose={onClose} {...props} />
  );
  return { onClose, view };
}

/* O painel troca com animação de saída: o conteúdo do passo seguinte só
   existe depois dela, então toda espera aqui é `findBy`, não `getBy`. */
async function fillStep(user, values) {
  for (const [label, value] of Object.entries(values)) {
    await user.type(await screen.findByLabelText(label), value);
  }
}

async function goNext(user) {
  await user.click(screen.getByRole("button", { name: "Próximo" }));
}

async function advanceToPayment(user) {
  await goNext(user);
  await goNext(user);
  await fillStep(user, PERSONAL);
  await goNext(user);
  await fillStep(user, DELIVERY);
  await goNext(user);
}

describe("Configurator", () => {
  it("não desenha nada enquanto está fechado", () => {
    renderConfigurator({ isOpen: false });

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("abre no primeiro passo, com o painel de cor", () => {
    renderConfigurator();

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByText(`Passo 1 de ${STEPS.length} — ${STEPS[0].label}`)
    ).toBeInTheDocument();
    expect(screen.getByRole("group", { name: /cores disponíveis/i })).toBeInTheDocument();
  });

  it("exibe no painel o passo selecionado no indicador", async () => {
    const user = userEvent.setup();
    renderConfigurator();

    await goNext(user);
    expect(
      await screen.findByRole("group", { name: /^opcionais$/i })
    ).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: /passo 1: cor/i }));
    expect(
      await screen.findByRole("group", { name: /cores disponíveis/i })
    ).toBeInTheDocument();
  });

  it("desabilita a navegação nas pontas do fluxo", async () => {
    const user = userEvent.setup();
    renderConfigurator();

    expect(screen.getByRole("button", { name: "Anterior" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Próximo" })).toBeEnabled();

    await advanceToPayment(user);
    await screen.findByRole("region", { name: /resumo do pedido/i });

    expect(screen.getByRole("button", { name: "Próximo" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Anterior" })).toBeEnabled();
  });

  it("reflete no cabeçalho o preço e a parcela do hook", async () => {
    const user = userEvent.setup();
    renderConfigurator();

    expect(screen.getByText(formatBRL(BASE_PRICE))).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: new RegExp(PAID_COLOR.name, "i") })
    );
    await goNext(user);
    await user.click(
      await screen.findByRole("button", { name: new RegExp(OPTION.name, "i") })
    );

    const subtotal = BASE_PRICE + PAID_COLOR.surcharge + OPTION.price;
    expect(screen.getByText(formatBRL(subtotal))).toBeInTheDocument();
    expect(
      screen.getByText(`ou ${INSTALLMENTS}x de ${formatBRL(subtotal / INSTALLMENTS)}`)
    ).toBeInTheDocument();
  });

  it("segura o avanço e avisa quando o passo tem campo inválido", async () => {
    const user = userEvent.setup();
    renderConfigurator();

    await goNext(user);
    await goNext(user);
    await goNext(user);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /revise os campos marcados/i
    );
    expect(
      screen.getByText(`Passo 3 de ${STEPS.length} — ${STEPS[2].label}`)
    ).toBeInTheDocument();
  });

  it("preserva cor e opcionais ao fechar e reabrir", async () => {
    const user = userEvent.setup();
    const { view } = renderConfigurator();

    await user.click(
      screen.getByRole("button", { name: new RegExp(PAID_COLOR.name, "i") })
    );
    await goNext(user);
    await user.click(
      await screen.findByRole("button", { name: new RegExp(OPTION.name, "i") })
    );

    view.rerender(<Configurator isOpen={false} onClose={vi.fn()} />);
    view.rerender(<Configurator isOpen onClose={vi.fn()} />);

    expect(
      screen.getByRole("button", { name: new RegExp(OPTION.name, "i") })
    ).toHaveAttribute("aria-pressed", "true");

    await user.click(screen.getByRole("tab", { name: /passo 1: cor/i }));
    expect(
      await screen.findByRole("button", { name: new RegExp(PAID_COLOR.name, "i") })
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("tranca a navegação enquanto o pedido está sendo enviado", async () => {
    const user = userEvent.setup();
    renderConfigurator();

    await advanceToPayment(user);
    await fillStep(user, PAYMENT);
    await user.click(screen.getByRole("button", { name: /finalizar compra/i }));

    expect(screen.getByRole("button", { name: "Anterior" })).toBeDisabled();
    screen
      .getAllByRole("tab")
      .filter((tab) => tab.getAttribute("aria-selected") === "false")
      .forEach((tab) => expect(tab).toBeDisabled());
    expect(
      screen.getByRole("button", { name: /fechar configurador/i })
    ).toBeEnabled();
  });

  it("fecha pelo botão e pela tecla Escape", async () => {
    const user = userEvent.setup();
    const { onClose } = renderConfigurator();

    await user.click(screen.getByRole("button", { name: /fechar configurador/i }));
    expect(onClose).toHaveBeenCalledTimes(1);

    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
