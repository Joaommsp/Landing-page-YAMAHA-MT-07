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
  expired: "Cartão vencido",
  cvv: "CVV inválido",
};

/* Módulo do cálculo mod-11 do CPF. Coincide numericamente com a quantidade de
   dígitos, mas é outra coisa: separado para que mexer num não quebre o outro. */
const CPF_CHECK_MODULUS = 11;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const EXPIRATION_PATTERN = /^(\d{2})\/(\d{2})$/;
const FIRST_MONTH = 1;
const LAST_MONTH = 12;

/* A validade vem com dois dígitos de ano; o século é o corrente, como em
   qualquer cartão físico. */
const YEAR_CENTURY = 2000;

/* Três dígitos na maioria das bandeiras, quatro na American Express — e nada
   além de dígito: o campo não tem máscara para filtrar antes. */
const CVV_PATTERN = /^\d{3,4}$/;

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

/* Formato e mês fora da faixa são "validade inválida"; data que já passou é
   outra coisa e merece outra mensagem — o usuário digitou certo, o cartão é que
   venceu. A referência de tempo entra por parâmetro para o teste não depender
   do relógio da máquina. */
export function validateExpiration(value, now = new Date()) {
  const match = EXPIRATION_PATTERN.exec(String(value ?? "").trim());
  if (!match) return MESSAGES.expiration;

  const month = Number(match[1]);
  if (month < FIRST_MONTH || month > LAST_MONTH) return MESSAGES.expiration;

  const year = YEAR_CENTURY + Number(match[2]);
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  // O cartão vale até o último dia do mês impresso: só o mês anterior vence.
  if (year < currentYear) return MESSAGES.expired;
  if (year === currentYear && month < currentMonth) return MESSAGES.expired;

  return "";
}

export function validateCVV(value) {
  return CVV_PATTERN.test(String(value ?? "").trim()) ? "" : MESSAGES.cvv;
}

const VALIDATOR_BY_TYPE = {
  [FIELD_TYPES.EMAIL]: validateEmail,
  [FIELD_TYPES.CPF]: validateCPF,
  [FIELD_TYPES.PHONE]: validatePhone,
  [FIELD_TYPES.CEP]: validateCEP,
  [FIELD_TYPES.CARD]: validateCard,
  [FIELD_TYPES.EXPIRATION]: validateExpiration,
  [FIELD_TYPES.CVV]: validateCVV,
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
