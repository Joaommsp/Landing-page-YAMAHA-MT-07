import { INSTALLMENTS } from "../data/catalog";

/* Moeda sempre em BRL por extenso: nada de `notation: "compact"` nem de
   abreviação (mil/Mi/Bi) em nenhum ponto da interface. */
const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/* O Intl separa "R$" do número com espaço estreito não separável; a interface
   e os testes trabalham com espaço comum. */
const NARROW_SPACES = /[\u00a0\u202f]/g;

export function formatBRL(value) {
  const amount = Number.isFinite(value) ? value : 0;
  return brl.format(amount).replace(NARROW_SPACES, " ");
}

export function formatParcel(total, installments = INSTALLMENTS) {
  if (!installments) return formatBRL(0);
  return formatBRL(total / installments);
}
