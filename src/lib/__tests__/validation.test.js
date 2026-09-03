import {
  validateRequired,
  validateEmail,
  validateCPF,
  validateStep,
  MESSAGES,
} from "../validation";
import { STEP_IDS } from "../../data/catalog";

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
