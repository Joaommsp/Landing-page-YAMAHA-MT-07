import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

/* AD-026 — o destravamento das abas é por POSIÇÃO na lista de passos, não por
   aritmética no id. Com os ids do catálogo (1 a 5, contíguos e em ordem) as
   duas contas coincidem, e nenhum teste separava uma da outra: o trilho podia
   oferecer aba que o hook recusaria.

   A lista chega invertida por mock do catálogo — o mock é do módulo, então este
   arquivo é separado do `Stepper.test.jsx`, que precisa da ordem real. */
vi.mock("../../../data/catalog", async (importOriginal) => {
  const actual = await importOriginal();
  const reversed = [...actual.STEPS].reverse();

  /* O dublê é um catálogo coerente, não só uma lista trocada: pontas e posição
     saem da MESMA ordem invertida. Um catálogo em que `stepPosition` respondesse
     pela ordem real não existe em ambiente nenhum, e o teste afirmaria algo que
     a produção nunca produz. */
  return {
    ...actual,
    STEPS: reversed,
    FIRST_STEP: reversed[0].id,
    LAST_STEP: reversed[reversed.length - 1].id,
    stepPosition: (stepId) => {
      const index = reversed.findIndex((step) => step.id === stepId);
      return index === -1 ? 0 : index;
    },
  };
});

import Stepper from "../Stepper";
import { STEPS } from "../../../data/catalog";

/* Terceiro da lista invertida: à frente dele, ids MENORES; atrás, MAIORES.
   Quem compara id destrava o lado errado do trilho. */
const FURTHEST_POSITION = 2;

describe("Stepper — ordem da lista", () => {
  it("desenha as abas na ordem da lista de passos", () => {
    render(
      <Stepper
        current={STEPS[0].id}
        furthest={STEPS[FURTHEST_POSITION].id}
        onSelect={vi.fn()}
      />
    );

    screen.getAllByRole("tab").forEach((tab, index) => {
      expect(tab).toHaveAccessibleName(
        new RegExp(`passo ${index + 1}: ${STEPS[index].label}`, "i")
      );
    });
  });

  it("destrava até a posição já validada, não até o número do id", () => {
    render(
      <Stepper
        current={STEPS[0].id}
        furthest={STEPS[FURTHEST_POSITION].id}
        onSelect={vi.fn()}
      />
    );

    screen.getAllByRole("tab").forEach((tab, index) => {
      if (index <= FURTHEST_POSITION) {
        expect(tab).toBeEnabled();
      } else {
        expect(tab).toBeDisabled();
      }
    });
  });
});
