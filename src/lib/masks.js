/* Máscaras de entrada brasileiras. Toda função aceita valor cru ou já
   formatado: guarda apenas os dígitos e reaplica o formato, para que colar um
   valor pronto dê o mesmo resultado que digitá-lo. */

const CPF_DIGITS = 11;
const CEP_DIGITS = 8;
const CARD_DIGITS = 16;
const PHONE_MAX_DIGITS = 11;
const PHONE_LANDLINE_DIGITS = 10;
const PHONE_AREA_DIGITS = 2;
const CARD_GROUP_SIZE = 4;

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

  const prefixSize = digits.length > PHONE_LANDLINE_DIGITS ? 5 : 4;
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
  return digits.replace(new RegExp(`(\\d{${CARD_GROUP_SIZE}})(?=\\d)`, "g"), "$1 ");
}
