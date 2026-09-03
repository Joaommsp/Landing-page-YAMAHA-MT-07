import { useRef } from "react";
import PropTypes from "prop-types";

import {
  CONFIGURATOR_PANEL_ID,
  STEPS,
  STEP_IDS,
  stepTabId,
} from "../../data/catalog";

/* Indicador único dos cinco passos. O pop-up antigo repetia o mesmo bloco de
   marcação uma vez por passo; aqui a lista vem do catálogo e o bloco existe
   uma vez só. */

/* Iconografia do trilho: desenho de cada passo, não valor de regra de negócio.
   Fica junto do componente que desenha, indexado pelo id do passo. */
const STEP_ICONS = {
  [STEP_IDS.COLOR]: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 4a8 8 0 000 16" />
    </>
  ),
  [STEP_IDS.OPTIONS]: <path d="M12 5v14M5 12h14" />,
  [STEP_IDS.PERSONAL]: (
    <>
      <circle cx="12" cy="9" r="3.4" />
      <path d="M5.5 19a6.5 6.5 0 0113 0" />
    </>
  ),
  [STEP_IDS.DELIVERY]: (
    <>
      <path d="M4 11l8-6 8 6v8H4z" />
      <path d="M10 19v-5h4v5" />
    </>
  ),
  [STEP_IDS.PAYMENT]: <path d="M5 12.5l4.5 4.5L19 7.5" />,
};

const TAB_CLASS =
  "relative grid h-9 w-9 cursor-pointer place-items-center border-0 bg-transparent " +
  "text-khaki-dim transition-colors duration-300 hover:text-paper " +
  "disabled:cursor-not-allowed disabled:text-khaki-dim/50 disabled:hover:text-khaki-dim/50 " +
  "aria-selected:text-cyan";

/* A marca do passo atual é a barra ciano na borda do trilho — o mesmo traço do
   mockup, que sobrevive ao modo de alto contraste por ser elemento, não cor. */
const MARK_CLASS =
  "absolute inset-y-1.5 left-0 w-0.5 bg-cyan md:-left-px";

function Stepper({
  current,
  furthest = current,
  locked = false,
  onSelect,
}) {
  const tabsRef = useRef([]);

  /* Passo destravado é o que o fluxo já validou: adiante disso o hook recusa o
     salto, então o trilho não oferece o que seria recusado. `locked` fecha o
     trilho inteiro enquanto o pedido está em envio — menos o passo atual, para
     o foco não sumir de dentro do diálogo. */
  const isUnlocked = (step) =>
    step.id === current || (!locked && step.id <= furthest);

  const focusStep = (step) => {
    const index = STEPS.findIndex((item) => item.id === step.id);
    onSelect(step.id);
    tabsRef.current[index]?.focus();
  };

  /* Teclado do `tablist`: setas andam entre os passos destravados, Home e End
     vão às pontas. Sem isso o `role="tab"` prometeria o que não entrega. */
  const handleKeyDown = (event) => {
    const unlocked = STEPS.filter(isUnlocked);
    if (unlocked.length === 0) return;

    const position = unlocked.findIndex((step) => step.id === current);
    const moves = {
      ArrowDown: position + 1,
      ArrowRight: position + 1,
      ArrowUp: position - 1,
      ArrowLeft: position - 1,
      Home: 0,
      End: unlocked.length - 1,
    };

    const target = moves[event.key];
    if (target === undefined) return;
    if (target < 0 || target >= unlocked.length) return;

    event.preventDefault();
    focusStep(unlocked[target]);
  };

  return (
    <div
      aria-label="Etapas da compra"
      /* Sem `aria-orientation`: o trilho é horizontal até `md` e coluna
         depois, e o teclado atende os dois eixos. Fixar o valor anunciaria
         uma orientação que a tela não tem. */
      className="flex shrink-0 items-center gap-1 border-b border-line bg-ink-2 px-3 py-2 md:flex-col md:border-b-0 md:border-r md:px-2 md:py-4"
      onKeyDown={handleKeyDown}
      role="tablist"
    >
      {STEPS.map((step, index) => {
        const selected = step.id === current;

        return (
          <button
            aria-controls={CONFIGURATOR_PANEL_ID}
            aria-selected={selected}
            className={TAB_CLASS}
            disabled={!isUnlocked(step)}
            id={stepTabId(step.id)}
            key={step.id}
            onClick={() => onSelect(step.id)}
            ref={(node) => {
              tabsRef.current[index] = node;
            }}
            role="tab"
            /* Foco itinerante: o trilho inteiro é uma parada de tabulação. */
            tabIndex={selected ? 0 : -1}
            type="button"
          >
            {selected && <span aria-hidden="true" className={MARK_CLASS} />}
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              viewBox="0 0 24 24"
            >
              {STEP_ICONS[step.id]}
            </svg>
            <span className="sr-only">{`Passo ${index + 1}: ${step.label}`}</span>
          </button>
        );
      })}
    </div>
  );
}

Stepper.propTypes = {
  current: PropTypes.number.isRequired,
  furthest: PropTypes.number,
  locked: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
};

export default Stepper;
