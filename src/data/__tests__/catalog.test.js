import {
  BASE_PRICE,
  DELIVERY_PRICE,
  INSTALLMENTS,
  COLORS,
  OPTIONS,
  SPECS,
  GALLERY_CHAPTERS,
  chapterSpecs,
  STEPS,
  STEP_IDS,
  STEP_FIELDS,
  FIELD_TYPES,
  stepPosition,
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
  it("traz os capítulos com foto, texto e números resolvidos do catálogo", () => {
    expect(GALLERY_CHAPTERS.length).toBeGreaterThanOrEqual(3);

    GALLERY_CHAPTERS.forEach((chapter) => {
      expect(chapter.id).toBeTruthy();
      expect(chapter.image).toBeTruthy();
      expect(chapter.alt).toBeTruthy();
      expect(chapter.eyebrow).toBeTruthy();
      expect(chapter.title).toHaveLength(2);
      expect(chapter.text).toBeTruthy();
    });

    expect(new Set(GALLERY_CHAPTERS.map((c) => c.id)).size).toBe(
      GALLERY_CHAPTERS.length
    );
  });

  /* O capítulo guarda o id da especificação, nunca o valor: é isso que impede a
     seção de afirmar um número diferente do da ficha técnica. */
  it("resolve os números do capítulo pelos ids declarados", () => {
    const withSpecs = GALLERY_CHAPTERS.find((c) => c.specIds.length > 0);

    expect(withSpecs).toBeDefined();
    expect(chapterSpecs(withSpecs).map((spec) => spec.id)).toEqual(
      withSpecs.specIds
    );
    expect(chapterSpecs({ specIds: ["nao-existe"] })).toEqual([]);
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
    expect(STEPS.map((step) => step.id)).toEqual([
      STEP_IDS.COLOR,
      STEP_IDS.OPTIONS,
      STEP_IDS.PERSONAL,
      STEP_IDS.DELIVERY,
      STEP_IDS.PAYMENT,
    ]);
  });
});

/* AD-026 e AD-032 — quem navega o fluxo (hook, trilho e shell) pergunta a
   posição ao catálogo, dono da ordem. A conta não pode ser aritmética no id:
   hoje os ids são 1 a 5, contíguos, e as duas coincidem por acidente. */
describe("catálogo de produto — posição do passo", () => {
  it("devolve a posição na lista, não o número do id", () => {
    STEPS.forEach((step, index) => {
      expect(stepPosition(step.id)).toBe(index);
    });
  });

  it("conta passo fora da lista como o primeiro, o único destino sempre liberado", () => {
    expect(stepPosition(999)).toBe(0);
    expect(stepPosition(undefined)).toBe(0);
  });
});

describe("catálogo de produto — campos dos passos", () => {
  it("descreve os campos dos três passos de formulário com rótulo, tipo e teto", () => {
    const steps = [STEP_IDS.PERSONAL, STEP_IDS.DELIVERY, STEP_IDS.PAYMENT];
    const known = Object.values(FIELD_TYPES);

    steps.forEach((step) => {
      expect(STEP_FIELDS[step].length).toBeGreaterThan(0);

      STEP_FIELDS[step].forEach((field) => {
        expect(field.name).toBeTruthy();
        expect(field.label).toBeTruthy();
        expect(known).toContain(field.type);
        expect(field.maxLength).toBeGreaterThan(0);
      });
    });

    expect(STEP_FIELDS[STEP_IDS.COLOR]).toBeUndefined();
    expect(STEP_FIELDS[STEP_IDS.OPTIONS]).toBeUndefined();

    // Teto de e-mail curto tranca endereço legítimo e trunca valor colado.
    const email = STEP_FIELDS[STEP_IDS.PERSONAL].find(
      (field) => field.name === "email"
    );
    expect(email.maxLength).toBe(254);
  });
});
