import {
  maskCPF,
  maskPhone,
  maskCEP,
  maskCard,
  maskExpiration,
  maskByType,
} from "../masks";
import { FIELD_TYPES } from "../../data/catalog";

describe("maskCPF", () => {
  it("formata os onze dígitos no padrão brasileiro", () => {
    expect(maskCPF("12345678909")).toBe("123.456.789-09");
  });

  it("formata parcialmente enquanto a pessoa digita", () => {
    expect(maskCPF("123")).toBe("123");
    expect(maskCPF("123456")).toBe("123.456");
    expect(maskCPF("123456789")).toBe("123.456.789");
  });

  it("preserva só os dígitos de um valor já formatado colado e descarta o excesso", () => {
    expect(maskCPF("123.456.789-09")).toBe("123.456.789-09");
    expect(maskCPF("123.456.789-0912345")).toBe("123.456.789-09");
  });
});

describe("maskPhone", () => {
  it("formata celular de onze dígitos", () => {
    expect(maskPhone("31988887777")).toBe("(31) 98888-7777");
  });

  it("formata telefone fixo de dez dígitos", () => {
    expect(maskPhone("3133334444")).toBe("(31) 3333-4444");
  });

  it("formata parcialmente enquanto a pessoa digita", () => {
    expect(maskPhone("31")).toBe("(31");
    expect(maskPhone("31988")).toBe("(31) 988");
  });
});

describe("maskCEP", () => {
  it("formata os oito dígitos no padrão 00000-000, venham crus ou já formatados", () => {
    expect(maskCEP("30140071")).toBe("30140-071");
    expect(maskCEP("30140-071")).toBe("30140-071");
    expect(maskCEP("3 0 1 4 0 0 7 1 9")).toBe("30140-071");
  });
});

describe("maskCard", () => {
  it("agrupa o número do cartão de quatro em quatro", () => {
    expect(maskCard("4429881200431197")).toBe("4429 8812 0043 1197");
  });

  it("descarta caracteres não numéricos e dígitos além do limite do cartão", () => {
    expect(maskCard("4429-8812-0043-1197-88")).toBe("4429 8812 0043 1197");
    expect(maskCard("abc4429")).toBe("4429");
  });
});

describe("maskExpiration", () => {
  it("formata a validade como MM/AA e descarta o excesso", () => {
    expect(maskExpiration("1229")).toBe("12/29");
    expect(maskExpiration("12/29")).toBe("12/29");
    expect(maskExpiration("12")).toBe("12");
    expect(maskExpiration("122999")).toBe("12/29");
  });
});

describe("maskByType", () => {
  it("aplica a máscara do tipo do campo e deixa passar o que não tem máscara", () => {
    expect(maskByType(FIELD_TYPES.CPF, "12345678909")).toBe("123.456.789-09");
    expect(maskByType(FIELD_TYPES.PHONE, "31988887777")).toBe("(31) 98888-7777");
    expect(maskByType(FIELD_TYPES.CEP, "30140071")).toBe("30140-071");
    expect(maskByType(FIELD_TYPES.CARD, "4429881200431197")).toBe(
      "4429 8812 0043 1197"
    );
    expect(maskByType(FIELD_TYPES.EXPIRATION, "1229")).toBe("12/29");
    expect(maskByType(FIELD_TYPES.TEXT, "Avenida Afonso Pena")).toBe(
      "Avenida Afonso Pena"
    );
  });
});
