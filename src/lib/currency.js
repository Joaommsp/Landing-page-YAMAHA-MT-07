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

/* Sem dado não é zero: valor ausente vira travessão, para a interface nunca
   afirmar "R$ 0,00" onde na verdade não há informação. */
export const NO_DATA = "—";

export function formatBRL(value) {
  if (!Number.isFinite(value)) return NO_DATA;
  return brl.format(value).replace(NARROW_SPACES, " ");
}

export function formatParcel(total, installments = INSTALLMENTS) {
  // Divisão sem parcela vira Infinity e cai no travessão, não em "R$ 0,00".
  return formatBRL(total / installments);
}
