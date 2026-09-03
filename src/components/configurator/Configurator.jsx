import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import Button from "../ui/Button";
import Stepper from "./Stepper";
import ColorStep from "./steps/ColorStep";
import OptionsStep from "./steps/OptionsStep";
import PersonalStep from "./steps/PersonalStep";
import DeliveryStep from "./steps/DeliveryStep";
import PaymentStep from "./steps/PaymentStep";
import {
  CONFIGURATOR_PANEL_ID,
  FIRST_STEP,
  INSTALLMENTS,
  LAST_STEP,
  STEPS,
  STEP_IDS,
  stepTabId,
} from "../../data/catalog";
import { formatBRL, formatParcel } from "../../lib/currency";
import { EASE_EDITORIAL } from "../../lib/motion";
import { SUBMIT_STATUS, useConfigurator } from "../../hooks/useConfigurator";

/* Shell do configurador: trilho de passos, cabeçalho com preço, painel do
   passo atual e navegação. O estado inteiro vive no `useConfigurator`; este
   componente só liga o hook às cinco telas.

   Fechar não perde nada — o componente segue montado e apenas deixa de
   desenhar —, por isso a saída não pede diálogo de confirmação. */

const TITLE_ID = "configurador-titulo";

const FOCUSABLE = "a[href], button, input, select, textarea, [tabindex]";

/* Parada de tabulação de verdade: o trilho de passos usa foco itinerante
   (`tabIndex={-1}` nas abas não selecionadas), e incluí-las na conta fazia o
   Shift+Tab da primeira parada real escapar do diálogo. */
function tabStops(container) {
  return Array.from(container.querySelectorAll(FOCUSABLE)).filter(
    (element) => !element.disabled && element.tabIndex >= 0
  );
}

/* Entrada do painel: sobe 10px e aparece, como o mockup pede. */
const PANEL_MOTION = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.5, ease: EASE_EDITORIAL },
};

function Configurator({ isOpen, onClose }) {
  const prefersReducedMotion = useReducedMotion();
  const dialogRef = useRef(null);
  const closeRef = useRef(null);

  const { state, color, options, motorcyclePrice, subtotal, total, actions } =
    useConfigurator();

  /* Ao abrir, o foco entra no diálogo; ao fechar, volta a quem o abriu. */
  useEffect(() => {
    if (!isOpen) return undefined;

    const previouslyFocused = document.activeElement;
    closeRef.current?.focus();

    /* A landing atrás do diálogo para de rolar e sai do fluxo de leitura — sem
       isso ela seguia navegável por leitor de tela por trás do modal. */
    const page = document.getElementById("root");
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    page?.setAttribute("inert", "");

    return () => {
      document.body.style.overflow = previousOverflow;
      page?.removeAttribute("inert");
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const current = STEPS.find((step) => step.id === state.step);
  const position = STEPS.indexOf(current) + 1;
  const progress = `${(position / STEPS.length) * 100}%`;
  const hasErrors = Object.keys(state.errors).length > 0;

  /* Pedido em envio (ou já confirmado) tranca a navegação: sair do passo e
     digitar noutro campo reabriria o pedido pelo `setField`, e o efeito do hook
     mataria o temporizador — o envio seria cancelado sem ninguém saber. Fechar
     continua liberado: é saída, não edição, e o pedido segue seu curso. */
  const busy = state.status !== SUBMIT_STATUS.idle;

  /* Foco preso: Tab circula dentro do diálogo enquanto ele está aberto. */
  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      onClose();
      return;
    }

    if (event.key !== "Tab" || !dialogRef.current) return;

    const focusables = tabStops(dialogRef.current);
    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const panelByStep = {
    [STEP_IDS.COLOR]: (
      <ColorStep colorId={state.colorId} onSelect={actions.selectColor} />
    ),
    [STEP_IDS.OPTIONS]: (
      <OptionsStep optionIds={state.optionIds} onToggle={actions.toggleOption} />
    ),
    [STEP_IDS.PERSONAL]: (
      <PersonalStep
        disabled={state.status !== SUBMIT_STATUS.idle}
        errors={state.errors}
        onChange={actions.setField}
        values={state.personal}
      />
    ),
    [STEP_IDS.DELIVERY]: (
      <DeliveryStep
        disabled={state.status !== SUBMIT_STATUS.idle}
        errors={state.errors}
        onChange={actions.setField}
        values={state.delivery}
      />
    ),
    [STEP_IDS.PAYMENT]: (
      <PaymentStep
        color={color}
        errors={state.errors}
        motorcyclePrice={motorcyclePrice}
        onChange={actions.setField}
        onSubmit={actions.submit}
        options={options}
        status={state.status}
        subtotal={subtotal}
        total={total}
        values={state.payment}
      />
    ),
  };

  const panel = panelByStep[state.step];

  return createPortal(
    <div
      className="fixed inset-0 z-[var(--z-overlay)] grid place-items-center bg-ink/85 p-3 backdrop-blur-sm md:p-6"
      onKeyDown={handleKeyDown}
    >
      <div
        aria-labelledby={TITLE_ID}
        aria-modal="true"
        className="relative z-[var(--z-modal)] grid max-h-full w-full max-w-[1080px] grid-rows-[auto_minmax(0,1fr)] overflow-hidden border border-line bg-ink md:grid-cols-[auto_minmax(0,1fr)] md:grid-rows-1"
        ref={dialogRef}
        role="dialog"
      >
        <Stepper
          current={state.step}
          furthest={state.furthestStep}
          locked={busy}
          onSelect={actions.goTo}
        />

        <div className="overflow-y-auto p-5 md:p-8">
          <div className="flex flex-wrap items-start gap-5 border-b border-line pb-4.5">
            <div>
              <p className="label-mono text-khaki">
                {`Passo ${position} de ${STEPS.length} — ${current.label}`}
              </p>
              <h3 className="display-tight mt-1.5 text-sub" id={TITLE_ID}>
                {current.title}
              </h3>
            </div>

            <div className="ml-auto text-right">
              <p className="data-figure text-figure">{formatBRL(subtotal)}</p>
              <p className="mt-1 font-mono text-caption text-paper-dim">
                {`ou ${INSTALLMENTS}x de ${formatParcel(subtotal)}`}
              </p>
            </div>

            <button
              aria-label="Fechar configurador"
              className="border border-line p-2.5 text-paper transition-colors duration-300 hover:border-khaki"
              onClick={onClose}
              ref={closeRef}
              type="button"
            >
              <svg
                aria-hidden="true"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                viewBox="0 0 24 24"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <div aria-hidden="true" className="h-0.5 bg-ink-3">
            <span
              className="block h-full bg-cyan transition-[width] duration-500 ease-editorial"
              style={{ width: progress }}
            />
          </div>

          <div
            aria-labelledby={stepTabId(state.step)}
            id={CONFIGURATOR_PANEL_ID}
            role="tabpanel"
          >
            {prefersReducedMotion ? (
              panel
            ) : (
              <AnimatePresence initial={false} mode="wait">
                <motion.div key={state.step} {...PANEL_MOTION}>
                  {panel}
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {hasErrors && (
            <p className="mt-5 font-mono text-caption text-danger" role="alert">
              Revise os campos marcados para continuar.
            </p>
          )}

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button
              disabled={busy || state.step === FIRST_STEP}
              onClick={actions.previous}
              size="sm"
              variant="ghost"
            >
              Anterior
            </Button>
            <Button
              disabled={busy || state.step === LAST_STEP}
              onClick={actions.next}
              size="sm"
            >
              Próximo
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

Configurator.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Configurator;
