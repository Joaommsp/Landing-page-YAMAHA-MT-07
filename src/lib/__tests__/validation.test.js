import {
  validateRequired,
  validateEmail,
  validateCPF,
  validatePhone,
  validateCEP,
  validateCard,
  validateExpiration,
  validateCVV,
  validateField,
  validateStep,
  MESSAGES,
} from "../validation";
import { FIELD_TYPES, STEP_FIELDS, STEP_IDS } from "../../data/catalog";

/* Relógio fixo: a validade é medida contra uma data conhecida, não contra o
   dia em que a suíte roda. */
const NOW = new Date("2026-09-03T12:00:00Z");

const PERSONAL_STEP = STEP_IDS.PERSONAL;

const validPersonal = {
  firstName: "João",
  lastName: "Melo",
  cpf: "529.982.247-25",
  email: "joao@exemplo.com",
  phone: "(31) 98888-7777",
};

describe("validateRequired", () => {
  it("acusa erro quando o campo está vazio ou só com espaços", () => {
    expect(validateRequired("")).toBe(MESSAGES.required);
    expect(validateRequired("   ")).toBe(MESSAGES.required);
    expect(validateRequired(undefined)).toBe(MESSAGES.required);
  });

  it("não acusa erro quando o campo está preenchido", () => {
    expect(validateRequired("João")).toBe("");
  });
});

describe("validateEmail", () => {
  it("acusa 'Informe um e-mail válido' quando falta domínio ou extensão", () => {
    expect(validateEmail("joao@exemplo")).toBe("Informe um e-mail válido");
    expect(validateEmail("joao.exemplo.com")).toBe("Informe um e-mail válido");
    expect(validateEmail("@exemplo.com")).toBe("Informe um e-mail válido");
  });

  it("não acusa erro em e-mail no formato nome@dominio.tld", () => {
    expect(validateEmail("joao@exemplo.com")).toBe("");
    expect(validateEmail("joao.melo@exemplo.com.br")).toBe("");
  });
});

describe("validateCPF", () => {
  it("acusa 'CPF inválido' quando não há onze dígitos", () => {
    expect(validateCPF("1234567890")).toBe("CPF inválido");
    expect(validateCPF("123.456.789")).toBe("CPF inválido");
  });

  it("acusa 'CPF inválido' quando o dígito verificador não confere", () => {
    expect(validateCPF("529.982.247-26")).toBe("CPF inválido");
    expect(validateCPF("12345678900")).toBe("CPF inválido");
  });

  it("acusa 'CPF inválido' quando todos os dígitos são iguais", () => {
    expect(validateCPF("111.111.111-11")).toBe("CPF inválido");
    expect(validateCPF("00000000000")).toBe("CPF inválido");
  });

  it("aceita CPF válido, cru ou já mascarado", () => {
    expect(validateCPF("529.982.247-25")).toBe("");
    expect(validateCPF("52998224725")).toBe("");
    expect(validateCPF("12345678909")).toBe("");
  });
});

describe("validatePhone", () => {
  it("acusa 'Telefone incompleto' abaixo de dez dígitos", () => {
    expect(validatePhone("(31) 9888")).toBe("Telefone incompleto");
    expect(validatePhone("313333444")).toBe("Telefone incompleto");
    expect(validatePhone("(31) 3333-4444")).toBe("");
    expect(validatePhone("(31) 98888-7777")).toBe("");
  });
});

describe("validateCEP", () => {
  it("acusa 'CEP incompleto' fora dos oito dígitos", () => {
    expect(validateCEP("30140-07")).toBe("CEP incompleto");
    expect(validateCEP("30140-071")).toBe("");
  });
});

describe("validateCard", () => {
  it("acusa 'Número do cartão incompleto' abaixo de dezesseis dígitos", () => {
    expect(validateCard("4429 8812 0043")).toBe("Número do cartão incompleto");
    expect(validateCard("4429 8812 0043 1197")).toBe("");
  });
});

/* Os textos que a spec enumera (MT07-08.2, 08.3 e MT07-09.6) entram como
   literal, não por `MESSAGES.*`: assertiva contra a própria constante passa
   igual se o texto exibido ao usuário mudar. */
describe("validateExpiration", () => {
  it("acusa 'Validade inválida' fora de MM/AA ou com mês fora de 01 a 12", () => {
    expect(validateExpiration("1229", NOW)).toBe("Validade inválida");
    expect(validateExpiration("13/29", NOW)).toBe("Validade inválida");
    expect(validateExpiration("00/29", NOW)).toBe("Validade inválida");
    expect(validateExpiration("12/29", NOW)).toBe("");
    expect(validateExpiration("01/30", NOW)).toBe("");
  });

  it("acusa 'Cartão vencido' em data já passada", () => {
    expect(validateExpiration("08/26", NOW)).toBe("Cartão vencido");
    expect(validateExpiration("12/25", NOW)).toBe("Cartão vencido");
    expect(validateExpiration("01/20", NOW)).toBe("Cartão vencido");
  });

  it("aceita o próprio mês corrente, que só vence no fim dele", () => {
    expect(validateExpiration("09/26", NOW)).toBe("");
    expect(validateExpiration("10/26", NOW)).toBe("");
  });

  it("separa formato de vencimento: mês fora da faixa não vira 'Cartão vencido'", () => {
    expect(validateExpiration("13/20", NOW)).toBe("Validade inválida");
  });
});

describe("validateCVV", () => {
  it("aceita três ou quatro dígitos", () => {
    expect(validateCVV("123")).toBe("");
    expect(validateCVV("1234")).toBe("");
  });

  it("acusa 'CVV inválido' com tamanho errado ou caractere que não é dígito", () => {
    expect(validateCVV("12")).toBe("CVV inválido");
    expect(validateCVV("12345")).toBe("CVV inválido");
    expect(validateCVV("12a")).toBe("CVV inválido");
    expect(validateCVV("")).toBe("CVV inválido");
    expect(validateCVV(undefined)).toBe("CVV inválido");
  });
});

describe("validateField pelo tipo do campo", () => {
  it("liga o campo de CVV do catálogo ao validador de CVV", () => {
    const field = STEP_FIELDS[STEP_IDS.PAYMENT].find(
      (item) => item.name === "cardCvv"
    );

    expect(field.type).toBe(FIELD_TYPES.CVV);
    expect(validateField(field, "12")).toBe(MESSAGES.cvv);
    expect(validateField(field, "123")).toBe("");
  });

  it("recusa cartão vencido pelo campo de validade do catálogo", () => {
    const field = STEP_FIELDS[STEP_IDS.PAYMENT].find(
      (item) => item.name === "cardExpiration"
    );

    expect(validateField(field, "01/20")).toBe(MESSAGES.expired);
  });
});

describe("validateStep", () => {
  it("devolve objeto vazio quando todos os campos do passo são válidos", () => {
    expect(validateStep(PERSONAL_STEP, validPersonal)).toEqual({});
  });

  it("aponta pelo nome cada campo inválido do passo", () => {
    const errors = validateStep(PERSONAL_STEP, {
      ...validPersonal,
      firstName: "",
      cpf: "111.111.111-11",
      email: "joao@exemplo",
    });

    expect(errors.firstName).toBe(MESSAGES.required);
    expect(errors.cpf).toBe("CPF inválido");
    expect(errors.email).toBe("Informe um e-mail válido");
    expect(errors.lastName).toBeUndefined();
    expect(errors.phone).toBeUndefined();
  });
});
