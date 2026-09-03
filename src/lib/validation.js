import {
  CARD_DIGITS,
  CEP_DIGITS,
  CPF_DIGITS,
  PHONE_MIN_DIGITS,
  onlyDigits,
} from "./masks";
import { FIELD_TYPES, STEP_FIELDS } from "../data/catalog";

/* Mensagens de erro em fonte única: a spec fixa o texto exibido ao usuário. */
export const MESSAGES = {
  required: "Campo obrigatório",
  email: "Informe um e-mail válido",
  cpf: "CPF inválido",
  phone: "Telefone incompleto",
  cep: "CEP incompleto",
  card: "Número do cartão incompleto",
  expiration: "Validade inválida",
};

/* Módulo do cálculo mod-11 do CPF. Coincide numericamente com a quantidade de
   dígitos, mas é outra coisa: separado para que mexer num não quebre o outro. */
const CPF_CHECK_MODULUS = 11;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const EXPIRATION_PATTERN = /^(\d{2})\/(\d{2})$/;
const FIRST_MONTH = 1;
const LAST_MONTH = 12;

export function validateRequired(value) {
  return String(value ?? "").trim() ? "" : MESSAGES.required;
}

export function validateEmail(value) {
  return EMAIL_PATTERN.test(String(value ?? "").trim()) ? "" : MESSAGES.email;
}

export function validateCPF(value) {
  const digits = onlyDigits(value);

  if (digits.length !== CPF_DIGITS) return MESSAGES.cpf;
  // Sequências de dígito repetido passam no cálculo, mas não são CPF real.
  if (new Set(digits).size === 1) return MESSAGES.cpf;

  const checkDigit = (length) => {
    let sum = 0;
    for (let i = 0; i < length; i += 1) {
      sum += Number(digits[i]) * (length + 1 - i);
    }
    const rest = (sum * 10) % CPF_CHECK_MODULUS;
    return rest === 10 ? 0 : rest;
  };

  const firstIndex = CPF_DIGITS - 2;
  const secondIndex = CPF_DIGITS - 1;

  if (checkDigit(firstIndex) !== Number(digits[firstIndex])) return MESSAGES.cpf;
  if (checkDigit(secondIndex) !== Number(digits[secondIndex])) return MESSAGES.cpf;

  return "";
}

export function validatePhone(value) {
  return onlyDigits(value).length >= PHONE_MIN_DIGITS ? "" : MESSAGES.phone;
}

export function validateCEP(value) {
  return onlyDigits(value).length === CEP_DIGITS ? "" : MESSAGES.cep;
}

export function validateCard(value) {
  return onlyDigits(value).length === CARD_DIGITS ? "" : MESSAGES.card;
}

export function validateExpiration(value) {
  const match = EXPIRATION_PATTERN.exec(String(value ?? "").trim());
  if (!match) return MESSAGES.expiration;

  const month = Number(match[1]);
  return month >= FIRST_MONTH && month <= LAST_MONTH
    ? ""
    : MESSAGES.expiration;
}

const VALIDATOR_BY_TYPE = {
  [FIELD_TYPES.EMAIL]: validateEmail,
  [FIELD_TYPES.CPF]: validateCPF,
  [FIELD_TYPES.PHONE]: validatePhone,
  [FIELD_TYPES.CEP]: validateCEP,
  [FIELD_TYPES.CARD]: validateCard,
  [FIELD_TYPES.EXPIRATION]: validateExpiration,
};

export function validateField(field, value) {
  const required = validateRequired(value);
  if (required) return required;

  const validate = VALIDATOR_BY_TYPE[field.type];
  return validate ? validate(value) : "";
}

export function validateStep(stepId, values = {}) {
  const fields = STEP_FIELDS[stepId] ?? [];

  return fields.reduce((errors, field) => {
    const message = validateField(field, values[field.name]);
    if (message) errors[field.name] = message;
    return errors;
  }, {});
}
