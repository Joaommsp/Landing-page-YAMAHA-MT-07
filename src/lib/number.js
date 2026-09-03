/* Número decimal em pt-BR — vírgula na casa decimal, ponto no milhar.

   A ficha técnica guarda o valor já escrito ("74,8"), que é o que se lê na
   tela. O contador precisa do mesmo número em forma de conta para chegar até
   ele, e precisa devolver cada quadro no formato de origem. Este módulo é a
   ponte entre as duas formas, num lugar só: nenhum componente troca vírgula
   por ponto na mão. Moeda não passa por aqui — é `lib/currency`. */

const CACHE = new Map();

function formatterFor(decimals) {
  if (!CACHE.has(decimals)) {
    CACHE.set(
      decimals,
      new Intl.NumberFormat("pt-BR", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
    );
  }
  return CACHE.get(decimals);
}

export function formatDecimalBR(value, decimals = 0) {
  if (!Number.isFinite(value)) return null;
  return formatterFor(decimals).format(value);
}

/* Devolve `null`, não zero, quando o texto não é número: zero é um valor, e
   afirmar zero onde não há dado seria mentir. */
export function parseDecimalBR(text) {
  if (typeof text !== "string") return null;

  const normalized = text.replace(/\./g, "").replace(",", ".").trim();
  if (normalized === "") return null;

  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

/* Quantas casas decimais o texto de origem mostra. É o que mantém o contador
   escrevendo "74,8" e não "74,80" nem "75". */
export function decimalPlacesBR(text) {
  if (typeof text !== "string") return 0;

  const fraction = text.split(",")[1];
  return fraction ? fraction.trim().length : 0;
}
