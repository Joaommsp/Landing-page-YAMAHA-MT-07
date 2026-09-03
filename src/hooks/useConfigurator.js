import { useEffect, useMemo, useReducer } from "react";

import {
  BASE_PRICE,
  COLORS,
  DEFAULT_COLOR_ID,
  DELIVERY_PRICE,
  FIRST_STEP,
  INSTALLMENTS,
  OPTIONS,
  STEPS,
  STEP_IDS,
} from "../data/catalog";
import { validateStep } from "../lib/validation";

/* Cada passo com formulário guarda seus valores na própria seção do estado;
   os passos de cor e opcionais não têm campo e por isso não aparecem aqui. */
const SECTION_BY_STEP = {
  [STEP_IDS.PERSONAL]: "personal",
  [STEP_IDS.DELIVERY]: "delivery",
  [STEP_IDS.PAYMENT]: "payment",
};

const FORM_STEPS = Object.keys(SECTION_BY_STEP).map(Number);

export const SUBMIT_STATUS = {
  idle: "idle",
  submitting: "submitting",
  confirmed: "confirmed",
};

/* Não há backend: a confirmação simula o tempo de resposta do pedido para que
   o passo de pagamento tenha um estado de carregamento de verdade. */
export const SUBMIT_DELAY_MS = 900;

export const initialState = {
  step: FIRST_STEP,
  // Teto já liberado: só se avança validando, então saltar adiante é proibido.
  furthestStep: FIRST_STEP,
  colorId: DEFAULT_COLOR_ID,
  optionIds: [],
  personal: {},
  delivery: {},
  payment: {},
  errors: {},
  status: SUBMIT_STATUS.idle,
};

/* Preço da moto sem opcional: base mais o acréscimo da cor. É a linha da moto
   no resumo do pedido — quem exibe não recalcula. */
export function computeMotorcyclePrice(state) {
  const color = COLORS.find((item) => item.id === state.colorId);
  return BASE_PRICE + (color?.surcharge ?? 0);
}

/* Subtotal é o preço da moto montada: base, acréscimo da cor e opcionais. A
   entrega é linha do resumo, não parte do preço do produto. */
export function computeSubtotal(state) {
  const optionsTotal = OPTIONS.filter((option) =>
    state.optionIds.includes(option.id)
  ).reduce((sum, option) => sum + option.price, 0);

  return computeMotorcyclePrice(state) + optionsTotal;
}

export function computeTotal(state) {
  return computeSubtotal(state) + DELIVERY_PRICE;
}

/* Navegação por posição na lista de passos, nunca por aritmética no id: o
   catálogo promete que reordenar `STEPS` não muda o significado de ninguém, e
   `step + 1` quebraria essa promessa no primeiro id não contíguo. */
const STEP_ORDER = STEPS.map((step) => step.id);

function stepIndex(step) {
  const index = STEP_ORDER.indexOf(step);
  return index === -1 ? 0 : index;
}

function stepAt(index) {
  const bounded = Math.min(Math.max(index, 0), STEP_ORDER.length - 1);
  return STEP_ORDER[bounded];
}

function clampStep(step) {
  return stepAt(stepIndex(step));
}

function errorsOfStep(state, step) {
  const section = SECTION_BY_STEP[step];
  return section ? validateStep(step, state[section]) : {};
}

export function reducer(state, action) {
  switch (action.type) {
    case "goTo": {
      const target = clampStep(action.step);
      // Voltar é sempre livre; ir adiante, só até onde o fluxo já foi validado.
      if (stepIndex(target) > stepIndex(state.furthestStep)) return state;
      return { ...state, step: target, errors: {} };
    }

    case "next": {
      const errors = errorsOfStep(state, state.step);
      if (Object.keys(errors).length > 0) return { ...state, errors };

      const step = stepAt(stepIndex(state.step) + 1);
      const furthestStep =
        stepIndex(step) > stepIndex(state.furthestStep)
          ? step
          : state.furthestStep;

      return { ...state, step, furthestStep, errors: {} };
    }

    case "previous":
      return {
        ...state,
        step: stepAt(stepIndex(state.step) - 1),
        errors: {},
      };

    case "selectColor":
      return { ...state, colorId: action.colorId };

    case "toggleOption": {
      const marked = state.optionIds.includes(action.optionId);
      return {
        ...state,
        optionIds: marked
          ? state.optionIds.filter((id) => id !== action.optionId)
          : [...state.optionIds, action.optionId],
      };
    }

    case "setField": {
      /* A seção sai do passo atual: quem digita não repassa o nome dela, então
         não há como um literal divergente virar um no-op silencioso. Passo sem
         formulário simplesmente não tem onde guardar campo. */
      const name = SECTION_BY_STEP[state.step];
      if (!name) return state;

      const section = { ...state[name], [action.name]: action.value };
      const errors = { ...state.errors };
      delete errors[action.name];

      // Editar reabre o pedido: a confirmação era do conjunto anterior de dados.
      return { ...state, [name]: section, errors, status: SUBMIT_STATUS.idle };
    }

    case "submit": {
      // Confirmar fecha o pedido inteiro: todo passo com formulário é conferido,
      // não só o de pagamento.
      const byStep = FORM_STEPS.map((step) => [step, errorsOfStep(state, step)]);
      const errors = byStep.reduce(
        (all, [, stepErrors]) => ({ ...all, ...stepErrors }),
        {}
      );
      const firstInvalid = byStep.find(
        ([, stepErrors]) => Object.keys(stepErrors).length > 0
      );

      if (firstInvalid) {
        return {
          ...state,
          errors,
          step: firstInvalid[0],
          status: SUBMIT_STATUS.idle,
        };
      }

      return { ...state, errors: {}, status: SUBMIT_STATUS.submitting };
    }

    case "confirm":
      return { ...state, status: SUBMIT_STATUS.confirmed };

    default:
      return state;
  }
}

export function useConfigurator() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = useMemo(
    () => ({
      goTo: (step) => dispatch({ type: "goTo", step }),
      next: () => dispatch({ type: "next" }),
      previous: () => dispatch({ type: "previous" }),
      selectColor: (colorId) => dispatch({ type: "selectColor", colorId }),
      toggleOption: (optionId) => dispatch({ type: "toggleOption", optionId }),
      setField: (name, value) => dispatch({ type: "setField", name, value }),
      submit: () => dispatch({ type: "submit" }),
    }),
    []
  );

  useEffect(() => {
    if (state.status !== SUBMIT_STATUS.submitting) return undefined;

    const timer = setTimeout(
      () => dispatch({ type: "confirm" }),
      SUBMIT_DELAY_MS
    );
    return () => clearTimeout(timer);
  }, [state.status]);

  const { colorId, optionIds } = state;

  // O preço depende só de cor e opcionais; digitar num formulário não recalcula.
  const motorcyclePrice = useMemo(
    () => computeMotorcyclePrice({ colorId }),
    [colorId]
  );
  const subtotal = useMemo(
    () => computeSubtotal({ colorId, optionIds }),
    [colorId, optionIds]
  );
  const color = useMemo(
    () => COLORS.find((item) => item.id === colorId),
    [colorId]
  );
  const options = useMemo(
    () => OPTIONS.filter((option) => optionIds.includes(option.id)),
    [optionIds]
  );

  return {
    state,
    color,
    options,
    motorcyclePrice,
    subtotal,
    total: subtotal + DELIVERY_PRICE,
    // A parcela é do produto: a entrega não é parcelada.
    parcel: subtotal / INSTALLMENTS,
    actions,
  };
}
