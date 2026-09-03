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
  STEPS,
} from "../data/catalog";
import { validateStep } from "../lib/validation";

const [, , PERSONAL_STEP, DELIVERY_STEP, PAYMENT_STEP] = STEPS.map(
  (step) => step.id
);

/* Cada passo com formulário guarda seus valores na própria seção do estado;
   os passos de cor e opcionais não têm campo e por isso não aparecem aqui. */
const SECTION_BY_STEP = {
  [PERSONAL_STEP]: "personal",
  [DELIVERY_STEP]: "delivery",
  [PAYMENT_STEP]: "payment",
};

export const initialState = {
  step: FIRST_STEP,
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
    case "goTo":
      return { ...state, step: clampStep(action.step), errors: {} };

    case "next": {
      const errors = errorsOfStep(state, state.step);
      if (Object.keys(errors).length > 0) return { ...state, errors };
      return { ...state, step: clampStep(state.step + 1), errors: {} };
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
      const section = { ...state[action.section], [action.name]: action.value };
      const errors = { ...state.errors };
      delete errors[action.name];
      return { ...state, [action.section]: section, errors };
    }

    case "submit": {
      const errors = errorsOfStep(state, PAYMENT_STEP);
      const valid = Object.keys(errors).length === 0;
      return { ...state, errors, confirmed: valid };
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

  const total = useMemo(() => computeTotal(state), [state]);
  const color = useMemo(
    () => COLORS.find((item) => item.id === state.colorId),
    [state.colorId]
  );
  const options = useMemo(
    () => OPTIONS.filter((option) => state.optionIds.includes(option.id)),
    [state.optionIds]
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
