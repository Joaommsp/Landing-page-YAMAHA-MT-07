import { CPF_DIGITS, onlyDigits } from "./masks";
import { STEP_IDS } from "../data/catalog";

/* Mensagens de erro em fonte única: a spec fixa o texto exibido ao usuário. */
export const MESSAGES = {
  required: "Campo obrigatório",
  email: "Informe um e-mail válido",
  cpf: "CPF inválido",
};

/* Módulo do cálculo mod-11 do CPF. Coincide numericamente com a quantidade de
   dígitos, mas é outra coisa: separado para que mexer num não quebre o outro. */
const CPF_CHECK_MODULUS = 11;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
/* Teto do e-mail pela RFC 5321: cortar antes disso trancaria endereço legítimo
   e truncaria valor colado. */
const EMAIL_MAX_LENGTH = 254;

/* Regras de campo por passo: rótulo, tipo de validação e teto de caracteres —
   o mesmo teto alimenta o contador exibido no formulário. */
export const STEP_FIELDS = {
  [STEP_IDS.PERSONAL]: [
    { name: "firstName", label: "Nome", type: "text", maxLength: 40 },
    { name: "lastName", label: "Sobrenome", type: "text", maxLength: 60 },
    { name: "cpf", label: "CPF", type: "cpf", maxLength: 14 },
    { name: "email", label: "E-mail", type: "email", maxLength: EMAIL_MAX_LENGTH },
    { name: "phone", label: "Telefone", type: "phone", maxLength: 15 },
  ],
  [STEP_IDS.DELIVERY]: [
    { name: "cep", label: "CEP", type: "cep", maxLength: 9 },
    { name: "street", label: "Rua", type: "text", maxLength: 80 },
    { name: "number", label: "Número", type: "text", maxLength: 10 },
    { name: "neighborhood", label: "Bairro", type: "text", maxLength: 60 },
    { name: "city", label: "Cidade", type: "text", maxLength: 60 },
    { name: "state", label: "Estado", type: "text", maxLength: 2 },
  ],
  [STEP_IDS.PAYMENT]: [
    { name: "cardHolder", label: "Nome no cartão", type: "text", maxLength: 40 },
    { name: "cardNumber", label: "Número do cartão", type: "card", maxLength: 19 },
    { name: "cardExpiration", label: "Validade", type: "text", maxLength: 5 },
    { name: "cardCvv", label: "CVV", type: "text", maxLength: 4 },
  ],
};

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

export function validateField(field, value) {
  const required = validateRequired(value);
  if (required) return required;

  if (field.type === "email") return validateEmail(value);
  if (field.type === "cpf") return validateCPF(value);

  return "";
}

export function validateStep(stepId, values = {}) {
  const fields = STEP_FIELDS[stepId] ?? [];

  return fields.reduce((errors, field) => {
    const message = validateField(field, values[field.name]);
    if (message) errors[field.name] = message;
    return errors;
  }, {});
}
