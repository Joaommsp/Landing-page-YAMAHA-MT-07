import { useState } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import PaymentStep from "../PaymentStep";
import {
  BASE_PRICE,
  COLORS,
  DELIVERY_PRICE,
  OPTIONS,
  STEP_FIELDS,
  STEP_IDS,
} from "../../../../data/catalog";
import { formatBRL } from "../../../../lib/currency";
import { MESSAGES } from "../../../../lib/validation";
import { SUBMIT_STATUS } from "../../../../hooks/useConfigurator";

const COLOR = COLORS.find((item) => item.surcharge > 0);
const CHOSEN = OPTIONS.filter((option) => !option.featured).slice(0, 2);
const MOTORCYCLE_PRICE = BASE_PRICE + COLOR.surcharge;
const SUBTOTAL =
  MOTORCYCLE_PRICE + CHOSEN.reduce((sum, option) => sum + option.price, 0);
const TOTAL = SUBTOTAL + DELIVERY_PRICE;
const EMPTY = {};

function renderStep(props = {}) {
  const onChange = vi.fn();
  const onSubmit = vi.fn();
  render(
    <PaymentStep
      color={COLOR}
      errors={EMPTY}
      onChange={onChange}
      motorcyclePrice={MOTORCYCLE_PRICE}
      onSubmit={onSubmit}
      options={CHOSEN}
      subtotal={SUBTOTAL}
      total={TOTAL}
      values={EMPTY}
      {...props}
    />
  );
  return { onChange, onSubmit };
}

function ControlledPaymentStep() {
  const [values, setValues] = useState(EMPTY);

  return (
    <PaymentStep
      color={COLOR}
      errors={EMPTY}
      onChange={(name, value) =>
        setValues((current) => ({ ...current, [name]: value }))
      }
      motorcyclePrice={MOTORCYCLE_PRICE}
      onSubmit={vi.fn()}
      options={CHOSEN}
      subtotal={SUBTOTAL}
      total={TOTAL}
      values={values}
    />
  );
}

describe("PaymentStep", () => {
  it("lista a moto com a cor escolhida e o preço em BRL completo", () => {
    renderStep();

    const summary = screen.getByRole("region", { name: /resumo do pedido/i });

    expect(
      within(summary).getByText(`Yamaha MT-07 · ${COLOR.name}`)
    ).toBeInTheDocument();
    expect(
      within(summary).getByText(formatBRL(MOTORCYCLE_PRICE))
    ).toBeInTheDocument();
  });

  it("mostra no resumo a foto da cor escolhida, não uma imagem fixa", () => {
    renderStep();

    const summary = screen.getByRole("region", { name: /resumo do pedido/i });

    expect(summary.querySelector("img")).toHaveAttribute("src", COLOR.image);
  });

  it("lista a entrega e cada opcional selecionado com seu preço", () => {
    renderStep();

    const summary = screen.getByRole("region", { name: /resumo do pedido/i });

    expect(within(summary).getByText(/entrega em domicílio/i)).toBeInTheDocument();
    CHOSEN.forEach((option) => {
      expect(within(summary).getByText(option.name)).toBeInTheDocument();
      expect(
        within(summary).getAllByText(formatBRL(option.price)).length
      ).toBeGreaterThan(0);
    });
  });

  it("separa subtotal da moto do total do pedido", () => {
    renderStep();

    const summary = screen.getByRole("region", { name: /resumo do pedido/i });

    expect(within(summary).getByText(/subtotal da moto/i).parentElement).toHaveTextContent(
      formatBRL(SUBTOTAL)
    );
    expect(within(summary).getByText(/total do pedido/i).parentElement).toHaveTextContent(
      formatBRL(TOTAL)
    );
    expect(within(summary).queryByText(/\b(mil|mi|bi)\b/i)).toBeNull();
  });

  it("reflete o número do cartão agrupado de quatro em quatro", async () => {
    const user = userEvent.setup();
    render(<ControlledPaymentStep />);

    await user.type(screen.getByLabelText("Número do cartão"), "4429881200431197");

    expect(screen.getByText("4429 8812 0043 1197")).toBeInTheDocument();
  });

  it("reflete o nome do titular em caixa alta no cartão exibido", async () => {
    const user = userEvent.setup();
    render(<ControlledPaymentStep />);

    await user.type(screen.getByLabelText("Nome no cartão"), "joao marcos");

    expect(screen.getByLabelText("Nome no cartão")).toHaveValue("joao marcos");
    expect(screen.getByText("JOAO MARCOS")).toBeInTheDocument();
  });

  it("aciona a finalização e mostra o erro que o fluxo devolveu", async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderStep({
      errors: { cardExpiration: MESSAGES.expired },
    });

    expect(screen.getByText(MESSAGES.expired)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /finalizar compra/i }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("desabilita os controles e anuncia o carregamento enquanto envia", () => {
    renderStep({ status: SUBMIT_STATUS.submitting });

    expect(screen.getByRole("button", { name: /enviando pedido/i })).toBeDisabled();
    STEP_FIELDS[STEP_IDS.PAYMENT].forEach((field) => {
      expect(screen.getByLabelText(field.label)).toBeDisabled();
    });
    expect(screen.getByText(/enviando o pedido/i)).toBeInTheDocument();
  });

  it("exibe a confirmação do pedido ao fim do envio", () => {
    renderStep({ status: SUBMIT_STATUS.confirmed });

    const confirmation = screen.getByRole("status");

    expect(confirmation).toHaveTextContent(/pedido confirmado/i);
    expect(confirmation).toHaveTextContent(formatBRL(TOTAL));
    expect(screen.queryByRole("button", { name: /finalizar compra/i })).toBeNull();
  });
});
