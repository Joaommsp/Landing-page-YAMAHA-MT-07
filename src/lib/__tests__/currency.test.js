import { formatBRL, formatParcel, NO_DATA } from "../currency";
import { BASE_PRICE, INSTALLMENTS } from "../../data/catalog";

describe("formatBRL", () => {
  it("formata o preço base em BRL completo", () => {
    expect(formatBRL(BASE_PRICE)).toBe("R$ 48.500,00");
  });

  it("distingue zero real de ausência de dado", () => {
    expect(formatBRL(0)).toBe("R$ 0,00");
    expect(formatBRL(undefined)).toBe(NO_DATA);
    expect(formatBRL(null)).toBe(NO_DATA);
    expect(formatBRL(Number.NaN)).toBe(NO_DATA);
  });

  it("não abrevia valores altos nem usa notação compacta", () => {
    const formatted = formatBRL(1000000);
    expect(formatted).toBe("R$ 1.000.000,00");
    expect(formatted).not.toMatch(/mil|mi|bi|k/i);
  });
});

describe("formatParcel", () => {
  it("divide o total pelo número de parcelas e formata em BRL completo", () => {
    expect(formatParcel(48500, 24)).toBe("R$ 2.020,83");
  });

  it("usa o parcelamento do catálogo quando o número de parcelas não é informado", () => {
    expect(formatParcel(BASE_PRICE)).toBe(formatParcel(BASE_PRICE, INSTALLMENTS));
  });
});
