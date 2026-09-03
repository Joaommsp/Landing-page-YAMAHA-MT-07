import { act, renderHook } from "@testing-library/react";

import { useConfigurator } from "../useConfigurator";
import {
  BASE_PRICE,
  DELIVERY_PRICE,
  INSTALLMENTS,
  COLORS,
  OPTIONS,
  STEP_IDS,
  FIRST_STEP,
  LAST_STEP,
} from "../../data/catalog";
import { MESSAGES } from "../../lib/validation";

const START_TOTAL = BASE_PRICE + DELIVERY_PRICE;
const windscreen = OPTIONS.find((option) => option.id === "windscreen");
const kit = OPTIONS.find((option) => option.id === "dark-side-kit");
const paidColor = COLORS.find((color) => color.surcharge > 0);

const validPersonal = {
  firstName: "João",
  lastName: "Melo",
  cpf: "529.982.247-25",
  email: "joao@exemplo.com",
  phone: "(31) 98888-7777",
};

const validDelivery = {
  cep: "30140-071",
  street: "Avenida Afonso Pena",
  number: "1270",
  neighborhood: "Centro",
  city: "Belo Horizonte",
  state: "MG",
};

const validPayment = {
  cardHolder: "João Melo",
  cardNumber: "4429 8812 0043 1197",
  cardExpiration: "12/29",
  cardCvv: "123",
};

const fill = (result, section, values) => {
  Object.entries(values).forEach(([name, value]) => {
    act(() => result.current.actions.setField(section, name, value));
  });
};

/* Chega ao passo pedido pelo caminho real: preenche os formulários e avança um
   passo de cada vez, porque saltar adiante é justamente o que não se pode. */
const advanceTo = (result, step) => {
  fill(result, "personal", validPersonal);
  fill(result, "delivery", validDelivery);

  for (let attempt = 0; attempt < LAST_STEP; attempt += 1) {
    if (result.current.state.step >= step) break;
    act(() => result.current.actions.next());
  }
};

describe("useConfigurator — preço", () => {
  it("começa no preço base somado à entrega, sem opcional marcado", () => {
    const { result } = renderHook(() => useConfigurator());

    expect(result.current.state.optionIds).toEqual([]);
    expect(result.current.total).toBe(START_TOTAL);
  });

  it("soma exatamente o preço do catálogo ao marcar um opcional", () => {
    const { result } = renderHook(() => useConfigurator());

    act(() => result.current.actions.toggleOption(windscreen.id));

    expect(result.current.total).toBe(START_TOTAL + windscreen.price);
  });

  it("subtrai o preço do opcional ao desmarcá-lo", () => {
    const { result } = renderHook(() => useConfigurator());

    act(() => result.current.actions.toggleOption(windscreen.id));
    act(() => result.current.actions.toggleOption(kit.id));
    act(() => result.current.actions.toggleOption(windscreen.id));

    expect(result.current.state.optionIds).toEqual([kit.id]);
    expect(result.current.total).toBe(START_TOTAL + kit.price);
  });

  it("soma todos os opcionais do catálogo quando todos estão marcados", () => {
    const { result } = renderHook(() => useConfigurator());

    OPTIONS.forEach((option) => {
      act(() => result.current.actions.toggleOption(option.id));
    });

    const allOptions = OPTIONS.reduce((sum, option) => sum + option.price, 0);
    expect(result.current.total).toBe(START_TOTAL + allOptions);
  });

  it("soma o acréscimo da cor escolhida ao total", () => {
    const { result } = renderHook(() => useConfigurator());

    act(() => result.current.actions.selectColor(paidColor.id));

    expect(result.current.total).toBe(START_TOTAL + paidColor.surcharge);
  });

  it("expõe a parcela como o total dividido pelo parcelamento do catálogo", () => {
    const { result } = renderHook(() => useConfigurator());

    act(() => result.current.actions.toggleOption(kit.id));

    expect(result.current.parcel).toBeCloseTo(
      result.current.total / INSTALLMENTS,
      5
    );
  });
});

describe("useConfigurator — cor e opcionais", () => {
  it("marca no estado a cor selecionada", () => {
    const { result } = renderHook(() => useConfigurator());

    expect(result.current.state.colorId).toBe(COLORS[0].id);

    act(() => result.current.actions.selectColor(COLORS[1].id));

    expect(result.current.state.colorId).toBe(COLORS[1].id);
  });
});

describe("useConfigurator — navegação", () => {
  it("mantém o primeiro passo quando pedem o anterior", () => {
    const { result } = renderHook(() => useConfigurator());

    act(() => result.current.actions.previous());

    expect(result.current.state.step).toBe(FIRST_STEP);
  });

  it("mantém o último passo quando pedem o próximo", () => {
    const { result } = renderHook(() => useConfigurator());

    advanceTo(result, LAST_STEP);
    act(() => result.current.actions.next());

    expect(result.current.state.step).toBe(LAST_STEP);
  });

  it("não avança enquanto o passo atual tem campo obrigatório vazio, nem por salto no indicador", () => {
    const { result } = renderHook(() => useConfigurator());

    act(() => result.current.actions.next());
    act(() => result.current.actions.next());
    expect(result.current.state.step).toBe(STEP_IDS.PERSONAL);

    act(() => result.current.actions.next());
    expect(result.current.state.step).toBe(STEP_IDS.PERSONAL);
    expect(result.current.state.errors.firstName).toBe(MESSAGES.required);

    act(() => result.current.actions.goTo(STEP_IDS.PAYMENT));
    expect(result.current.state.step).toBe(STEP_IDS.PERSONAL);
  });

  it("preserva cor e opcionais ao ir até o último passo e voltar ao primeiro", () => {
    const { result } = renderHook(() => useConfigurator());

    act(() => result.current.actions.selectColor(paidColor.id));
    act(() => result.current.actions.toggleOption(kit.id));
    advanceTo(result, LAST_STEP);
    act(() => result.current.actions.goTo(FIRST_STEP));

    expect(result.current.state.step).toBe(FIRST_STEP);
    expect(result.current.state.colorId).toBe(paidColor.id);
    expect(result.current.state.optionIds).toEqual([kit.id]);
    expect(result.current.total).toBe(
      START_TOTAL + paidColor.surcharge + kit.price
    );
  });
});

describe("useConfigurator — conclusão", () => {
  it("só confirma o pedido quando todos os passos de formulário estão válidos", () => {
    const { result } = renderHook(() => useConfigurator());

    advanceTo(result, STEP_IDS.PAYMENT);
    act(() => result.current.actions.submit());

    expect(result.current.state.confirmed).toBe(false);
    expect(result.current.state.errors.cardHolder).toBe(MESSAGES.required);
    expect(result.current.state.step).toBe(STEP_IDS.PAYMENT);

    fill(result, "payment", validPayment);
    act(() => result.current.actions.submit());

    expect(result.current.state.errors).toEqual({});
    expect(result.current.state.confirmed).toBe(true);

    act(() => result.current.actions.setField("delivery", "city", ""));
    act(() => result.current.actions.submit());

    expect(result.current.state.confirmed).toBe(false);
    expect(result.current.state.step).toBe(STEP_IDS.DELIVERY);
    expect(result.current.state.errors.city).toBe(MESSAGES.required);
  });
});
