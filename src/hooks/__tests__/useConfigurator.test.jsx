import { act, renderHook } from "@testing-library/react";

import {
  useConfigurator,
  SUBMIT_STATUS,
  SUBMIT_DELAY_MS,
} from "../useConfigurator";
import {
  BASE_PRICE,
  DELIVERY_PRICE,
  INSTALLMENTS,
  COLORS,
  OPTIONS,
  STEPS,
  STEP_IDS,
  FIRST_STEP,
  LAST_STEP,
} from "../../data/catalog";
import { MESSAGES } from "../../lib/validation";

const START_TOTAL = BASE_PRICE + DELIVERY_PRICE;

/* Roda o corpo com relógio controlado: a confirmação do pedido é assíncrona. */
const withFakeTimers = (run) => {
  vi.useFakeTimers();
  try {
    run();
  } finally {
    vi.useRealTimers();
  }
};
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

/* Digita no passo em que o configurador está: a seção é resolvida pelo hook. */
const fill = (result, values) => {
  Object.entries(values).forEach(([name, value]) => {
    act(() => result.current.actions.setField(name, value));
  });
};

const VALUES_BY_STEP = {
  [STEP_IDS.PERSONAL]: validPersonal,
  [STEP_IDS.DELIVERY]: validDelivery,
};

/* Chega ao passo pedido pelo caminho real: em cada passo com formulário,
   preenche e só então avança — saltar adiante é justamente o que não se pode.
   O passo de destino não é preenchido: quem testa decide o que colocar nele. */
const advanceTo = (result, step) => {
  for (let attempt = 0; attempt <= STEPS.length; attempt += 1) {
    if (result.current.state.step === step) return;
    const values = VALUES_BY_STEP[result.current.state.step];
    if (values) fill(result, values);
    act(() => result.current.actions.next());
  }
};

describe("useConfigurator — preço", () => {
  it("começa no preço da moto, com a entrega somada só no total do pedido", () => {
    const { result } = renderHook(() => useConfigurator());

    expect(result.current.state.optionIds).toEqual([]);
    expect(result.current.subtotal).toBe(BASE_PRICE);
    expect(result.current.total).toBe(START_TOTAL);
  });

  it("soma exatamente o preço do catálogo ao marcar um opcional", () => {
    const { result } = renderHook(() => useConfigurator());

    act(() => result.current.actions.toggleOption(windscreen.id));

    expect(result.current.subtotal).toBe(BASE_PRICE + windscreen.price);
    expect(result.current.total).toBe(START_TOTAL + windscreen.price);
  });

  it("subtrai o preço do opcional ao desmarcá-lo", () => {
    const { result } = renderHook(() => useConfigurator());

    act(() => result.current.actions.toggleOption(windscreen.id));
    act(() => result.current.actions.toggleOption(kit.id));
    act(() => result.current.actions.toggleOption(windscreen.id));

    expect(result.current.state.optionIds).toEqual([kit.id]);
    expect(result.current.subtotal).toBe(BASE_PRICE + kit.price);
  });

  it("soma todos os opcionais do catálogo quando todos estão marcados", () => {
    const { result } = renderHook(() => useConfigurator());

    OPTIONS.forEach((option) => {
      act(() => result.current.actions.toggleOption(option.id));
    });

    const allOptions = OPTIONS.reduce((sum, option) => sum + option.price, 0);
    expect(result.current.subtotal).toBe(BASE_PRICE + allOptions);
    expect(result.current.total).toBe(START_TOTAL + allOptions);
  });

  it("soma o acréscimo da cor escolhida ao preço da moto", () => {
    const { result } = renderHook(() => useConfigurator());

    act(() => result.current.actions.selectColor(paidColor.id));

    expect(result.current.subtotal).toBe(BASE_PRICE + paidColor.surcharge);
    expect(result.current.total).toBe(START_TOTAL + paidColor.surcharge);
  });

  it("parcela o preço da moto, não a entrega", () => {
    const { result } = renderHook(() => useConfigurator());

    act(() => result.current.actions.toggleOption(kit.id));

    expect(result.current.parcel).toBeCloseTo(
      result.current.subtotal / INSTALLMENTS,
      5
    );
    expect(result.current.parcel).toBeLessThan(
      result.current.total / INSTALLMENTS
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
  it("não confirma e leva ao primeiro passo inválido quando falta dado", () => {
    const { result } = renderHook(() => useConfigurator());

    advanceTo(result, STEP_IDS.PAYMENT);
    act(() => result.current.actions.submit());

    expect(result.current.state.status).toBe(SUBMIT_STATUS.idle);
    expect(result.current.state.step).toBe(STEP_IDS.PAYMENT);
    expect(result.current.state.errors.cardHolder).toBe(MESSAGES.required);

    fill(result, validPayment);
    /* Volta ao passo de entrega para esvaziar a cidade: digitar num passo
       exige estar nele, e é isso que o resumo do envio precisa enxergar. */
    act(() => result.current.actions.goTo(STEP_IDS.DELIVERY));
    act(() => result.current.actions.setField("city", ""));
    act(() => result.current.actions.submit());

    expect(result.current.state.status).toBe(SUBMIT_STATUS.idle);
    expect(result.current.state.step).toBe(STEP_IDS.DELIVERY);
    expect(result.current.state.errors.city).toBe(MESSAGES.required);
  });

  it("passa por carregamento antes de confirmar o pedido válido", () => {
    withFakeTimers(() => {
      const { result } = renderHook(() => useConfigurator());

      advanceTo(result, STEP_IDS.PAYMENT);
      fill(result, validPayment);
      act(() => result.current.actions.submit());

      expect(result.current.state.errors).toEqual({});
      expect(result.current.state.status).toBe(SUBMIT_STATUS.submitting);

      act(() => vi.advanceTimersByTime(SUBMIT_DELAY_MS));

      expect(result.current.state.status).toBe(SUBMIT_STATUS.confirmed);
    });
  });

  it("reabre o pedido quando um campo é editado depois de confirmado", () => {
    withFakeTimers(() => {
      const { result } = renderHook(() => useConfigurator());

      advanceTo(result, STEP_IDS.PAYMENT);
      fill(result, validPayment);
      act(() => result.current.actions.submit());
      act(() => vi.advanceTimersByTime(SUBMIT_DELAY_MS));
      expect(result.current.state.status).toBe(SUBMIT_STATUS.confirmed);

      act(() => result.current.actions.setField("cardCvv", "999"));

      expect(result.current.state.status).toBe(SUBMIT_STATUS.idle);
    });
  });
  /* A seção do campo é resolvida pelo passo atual. Nos passos de cor e
     opcionais não há formulário: digitar ali não pode inventar seção nem
     sujar outra parte do estado. */
  it("ignora campo digitado em passo sem formulário", () => {
    const { result } = renderHook(() => useConfigurator());

    act(() => result.current.actions.setField("firstName", "João"));

    expect(result.current.state.personal).toEqual({});
    expect(result.current.state.delivery).toEqual({});
    expect(result.current.state.payment).toEqual({});
  });

  /* Navegação por posição na lista, não por aritmética no id: o catálogo
     promete que reordenar `STEPS` não muda o significado de ninguém. */
  it("anda pela ordem da lista de passos, não pelo número do id", () => {
    const { result } = renderHook(() => useConfigurator());

    expect(result.current.state.step).toBe(STEPS[0].id);

    act(() => result.current.actions.next());
    expect(result.current.state.step).toBe(STEPS[1].id);

    act(() => result.current.actions.next());
    expect(result.current.state.step).toBe(STEPS[2].id);

    act(() => result.current.actions.previous());
    expect(result.current.state.step).toBe(STEPS[1].id);
  });
});
