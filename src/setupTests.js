import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

/* O jsdom não implementa IntersectionObserver, e o `whileInView` do Reveal
   depende dele. O dublê registra o alvo como já visível, que é o estado em que
   o conteúdo tem de estar para o teste ler o texto da seção. */
class IntersectionObserverStub {
  constructor(callback) {
    this.callback = callback;
  }

  observe(target) {
    this.callback([{ target, isIntersecting: true, intersectionRatio: 1 }], this);
  }

  unobserve() {}

  disconnect() {}

  takeRecords() {
    return [];
  }
}

globalThis.IntersectionObserver = IntersectionObserverStub;

afterEach(() => {
  cleanup();
});
