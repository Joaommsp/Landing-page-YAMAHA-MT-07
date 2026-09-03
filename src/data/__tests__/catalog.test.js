import {
  BASE_PRICE,
  DELIVERY_PRICE,
  INSTALLMENTS,
  COLORS,
  OPTIONS,
  SPECS,
  GALLERY,
  STEPS,
} from "../catalog";

describe("catálogo de produto — preços", () => {
  it("declara o preço base, o valor da entrega e o parcelamento", () => {
    expect(BASE_PRICE).toBe(48500);
    expect(DELIVERY_PRICE).toBe(2000);
    expect(INSTALLMENTS).toBe(24);
  });
});

describe("catálogo de produto — cores", () => {
  it("traz as três cores do mockup com forma completa e o acréscimo de cada uma", () => {
    expect(COLORS).toHaveLength(3);

    COLORS.forEach((color) => {
      expect(color.id).toBeTruthy();
      expect(color.name).toBeTruthy();
      expect(color.hex).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(color.image).toBeTruthy();
      expect(typeof color.surcharge).toBe("number");
    });

    const bySurcharge = Object.fromEntries(
      COLORS.map((color) => [color.name, color.surcharge])
    );
    expect(bySurcharge).toEqual({
      "Racing Blue": 0,
      "Storm Grey": 0,
      "Blood White": 900,
    });
  });
});

describe("catálogo de produto — opcionais", () => {
  it("traz os quatro opcionais e o kit, cada um com id único, preço e descrição", () => {
    expect(OPTIONS).toHaveLength(5);

    OPTIONS.forEach((option) => {
      expect(option.id).toBeTruthy();
      expect(option.name).toBeTruthy();
      expect(option.description).toBeTruthy();
      expect(option.price).toBeGreaterThan(0);
    });

    expect(new Set(OPTIONS.map((option) => option.id)).size).toBe(
      OPTIONS.length
    );

    const byName = Object.fromEntries(
      OPTIONS.map((option) => [option.name, option.price])
    );
    expect(byName).toEqual({
      "Projetor auxiliar": 1800,
      "Para-brisa esportivo": 1250,
      "Lanterna traseira LED": 740,
      "Piscas sequenciais": 620,
      "Dark Side of Japan": 2500,
    });
  });
});

describe("catálogo de produto — ficha técnica", () => {
  it("traz as quatro especificações com valor, unidade e ratio entre 0 e 1", () => {
    expect(SPECS).toHaveLength(4);

    SPECS.forEach((spec) => {
      expect(spec.id).toBeTruthy();
      expect(spec.name).toBeTruthy();
      expect(spec.value).toBeTruthy();
      expect(spec.unit).toBeTruthy();
      expect(spec.ratio).toBeGreaterThan(0);
      expect(spec.ratio).toBeLessThanOrEqual(1);
    });

    const byName = Object.fromEntries(
      SPECS.map((spec) => [spec.name, `${spec.value} ${spec.unit}`])
    );
    expect(byName["Cilindrada"]).toBe("689 cc");
    expect(byName["Potência máxima"]).toBe("74,8 cv @ 8.750 rpm");
    expect(byName["Torque máximo"]).toBe("6,9 kgf.m @ 6.500 rpm");
    expect(byName["Peso em ordem de marcha"]).toBe("184 kg");
  });
});

describe("catálogo de produto — galeria", () => {
  it("traz as imagens do acervo, cada uma com legenda e texto alternativo", () => {
    expect(GALLERY.length).toBeGreaterThanOrEqual(6);

    GALLERY.forEach((item) => {
      expect(item.id).toBeTruthy();
      expect(item.image).toBeTruthy();
      expect(item.caption).toBeTruthy();
      expect(item.alt).toBeTruthy();
    });

    expect(new Set(GALLERY.map((item) => item.id)).size).toBe(GALLERY.length);
  });
});

describe("catálogo de produto — passos do configurador", () => {
  it("declara os cinco passos na ordem do fluxo de compra", () => {
    expect(STEPS.map((step) => step.label)).toEqual([
      "Cor",
      "Opcionais",
      "Dados",
      "Entrega",
      "Pagamento",
    ]);
    expect(STEPS.map((step) => step.id)).toEqual([1, 2, 3, 4, 5]);
  });
});
