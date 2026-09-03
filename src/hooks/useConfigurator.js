import { useMemo, useReducer } from "react";

import {
  BASE_PRICE,
  COLORS,
  DEFAULT_COLOR_ID,
  DELIVERY_PRICE,
  FIRST_STEP,
  INSTALLMENTS,
  LAST_STEP,
  OPTIONS,
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
const SECTIONS = Object.values(SECTION_BY_STEP);

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
  confirmed: false,
};

/* Função pura: o total é derivado do estado, nunca guardado nele. */
export function computeTotal(state) {
  const color = COLORS.find((item) => item.id === state.colorId);
  const optionsTotal = OPTIONS.filter((option) =>
    state.optionIds.includes(option.id)
  ).reduce((sum, option) => sum + option.price, 0);

  return BASE_PRICE + DELIVERY_PRICE + (color?.surcharge ?? 0) + optionsTotal;
}

function clampStep(step) {
  return Math.min(Math.max(step, FIRST_STEP), LAST_STEP);
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
      if (target > state.furthestStep) return state;
      return { ...state, step: target, errors: {} };
    }

    case "next": {
      const errors = errorsOfStep(state, state.step);
      if (Object.keys(errors).length > 0) return { ...state, errors };

      const step = clampStep(state.step + 1);
      return {
        ...state,
        step,
        furthestStep: Math.max(state.furthestStep, step),
        errors: {},
      };
    }

    case "previous":
      return { ...state, step: clampStep(state.step - 1), errors: {} };

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
      // Só as seções de formulário aceitam campo: assim um nome errado não
      // sobrescreve outra parte do estado em silêncio.
      if (!SECTIONS.includes(action.section)) return state;

      const section = { ...state[action.section], [action.name]: action.value };
      const errors = { ...state.errors };
      delete errors[action.name];
      // Editar depois de confirmar reabre o pedido: a confirmação era do
      // conjunto anterior de dados.
      return { ...state, [action.section]: section, errors, confirmed: false };
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
        return { ...state, errors, step: firstInvalid[0], confirmed: false };
      }

      return { ...state, errors: {}, confirmed: true };
    }

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
      setField: (section, name, value) =>
        dispatch({ type: "setField", section, name, value }),
      submit: () => dispatch({ type: "submit" }),
    }),
    []
  );

  const { colorId, optionIds } = state;

  // O total depende só de cor e opcionais; digitar num formulário não recalcula.
  const total = useMemo(
    () => computeTotal({ colorId, optionIds }),
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
    total,
    parcel: total / INSTALLMENTS,
    actions,
  };
}
