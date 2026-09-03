import { FIELD_TYPES } from "../data/catalog";

/* Máscaras de entrada brasileiras. Toda função aceita valor cru ou já
   formatado: guarda apenas os dígitos e reaplica o formato, para que colar um
   valor pronto dê o mesmo resultado que digitá-lo. */

export const CPF_DIGITS = 11;
export const CEP_DIGITS = 8;
export const CARD_DIGITS = 16;
export const PHONE_MIN_DIGITS = 10;
export const EXPIRATION_DIGITS = 4;
export const CVV_MAX_DIGITS = 4;

const PHONE_MAX_DIGITS = 11;
const PHONE_AREA_DIGITS = 2;
const CARD_GROUP_SIZE = 4;
const PHONE_MOBILE_PREFIX = 5;
const PHONE_LANDLINE_PREFIX = 4;
const CARD_GROUP_PATTERN = new RegExp(`(\\d{${CARD_GROUP_SIZE}})(?=\\d)`, "g");

export function onlyDigits(value) {
  return String(value ?? "").replace(/\D/g, "");
}

export function maskCPF(value) {
  const digits = onlyDigits(value).slice(0, CPF_DIGITS);

  return digits
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
}

export function maskPhone(value) {
  const digits = onlyDigits(value).slice(0, PHONE_MAX_DIGITS);
  if (!digits) return "";
  if (digits.length <= PHONE_AREA_DIGITS) return `(${digits}`;

  const prefixSize =
    digits.length > PHONE_MIN_DIGITS
      ? PHONE_MOBILE_PREFIX
      : PHONE_LANDLINE_PREFIX;
  const area = digits.slice(0, PHONE_AREA_DIGITS);
  const prefix = digits.slice(PHONE_AREA_DIGITS, PHONE_AREA_DIGITS + prefixSize);
  const suffix = digits.slice(PHONE_AREA_DIGITS + prefixSize);

  return suffix ? `(${area}) ${prefix}-${suffix}` : `(${area}) ${prefix}`;
}

export function maskCEP(value) {
  const digits = onlyDigits(value).slice(0, CEP_DIGITS);
  return digits.replace(/^(\d{5})(\d)/, "$1-$2");
}

export function maskCard(value) {
  const digits = onlyDigits(value).slice(0, CARD_DIGITS);
  return digits.replace(CARD_GROUP_PATTERN, "$1 ");
}

export function maskExpiration(value) {
  const digits = onlyDigits(value).slice(0, EXPIRATION_DIGITS);
  return digits.replace(/^(\d{2})(\d)/, "$1/$2");
}

/* O CVV não tem separador, mas tem máscara: sem ela é o único campo numérico
   onde a letra entra na caixa e só cai no `blur`. */
export function maskCVV(value) {
  return onlyDigits(value).slice(0, CVV_MAX_DIGITS);
}

const MASK_BY_TYPE = {
  [FIELD_TYPES.CPF]: maskCPF,
  [FIELD_TYPES.PHONE]: maskPhone,
  [FIELD_TYPES.CEP]: maskCEP,
  [FIELD_TYPES.CARD]: maskCard,
  [FIELD_TYPES.EXPIRATION]: maskExpiration,
  [FIELD_TYPES.CVV]: maskCVV,
};

/* Elo único entre o tipo do campo e sua máscara: o formulário não repete o
   mesmo switch em cada passo. Tipo sem máscara passa o texto adiante. */
export function maskByType(type, value) {
  const mask = MASK_BY_TYPE[type];
  return mask ? mask(value) : String(value ?? "");
}
