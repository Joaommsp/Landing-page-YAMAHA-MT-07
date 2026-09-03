import PropTypes from "prop-types";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { COLORS } from "../../../data/catalog";
import { formatBRL } from "../../../lib/currency";
import { EASE_EDITORIAL } from "../../../lib/motion";

/* Passo 1 — cor. A imagem da moto troca em crossfade e a cor escolhida fica
   marcada; preço e imagem vêm do catálogo, nunca do componente. */

/* Crossfade curto com deslocamento lateral: a troca se lê como movimento da
   mesma moto, não como uma foto sumindo e outra chegando. */
const FADE = { duration: 0.35, ease: EASE_EDITORIAL };
const SHIFT = 12;

const SWATCH_CLASS =
  "flex cursor-pointer items-center gap-3.5 border border-transparent bg-ink-2 px-4 py-3.5 text-left " +
  "text-paper transition-[background-color,border-color,transform] duration-300 ease-editorial " +
  "hover:bg-ink-3 hover:translate-x-[3px] aria-pressed:border-cyan aria-pressed:bg-ink-3";

function surchargeLabel(surcharge) {
  return surcharge > 0 ? `+ ${formatBRL(surcharge)}` : "Sem custo";
}

function ColorStep({ colorId, onSelect }) {
  const prefersReducedMotion = useReducedMotion();
  const selected = COLORS.find((color) => color.id === colorId);

  return (
    <div className="grid items-center gap-7 pt-6 md:grid-cols-[minmax(0,1fr)_220px]">
      <div className="relative grid min-h-[260px] place-items-center">
        <span
          aria-hidden="true"
          className="absolute bottom-6 h-3.5 w-[62%] rounded-[50%] bg-ink blur-md"
        />

        {/* Sem cor resolvida o palco não some: fica o aviso, e o painel mantém
            a altura reservada. */}
        {!selected && (
          <p className="label-mono text-khaki">Cor indisponível no catálogo</p>
        )}

        {selected &&
          (prefersReducedMotion ? (
            <img
              alt={`Yamaha MT-07 ${selected.name}`}
              className="max-h-[280px] object-contain"
              src={selected.image}
            />
          ) : (
            <AnimatePresence initial={false}>
              <motion.img
                alt={`Yamaha MT-07 ${selected.name}`}
                animate={{ opacity: 1, x: 0 }}
                className="absolute max-h-[280px] object-contain"
                exit={{ opacity: 0, x: -SHIFT }}
                initial={{ opacity: 0, x: SHIFT }}
                key={selected.id}
                src={selected.image}
                transition={FADE}
              />
            </AnimatePresence>
          ))}
      </div>

      <div
        aria-label="Cores disponíveis"
        className="flex flex-col gap-0.5"
        role="group"
      >
        {COLORS.map((color) => (
          <button
            aria-pressed={color.id === colorId}
            className={SWATCH_CLASS}
            key={color.id}
            onClick={() => onSelect(color.id)}
            type="button"
          >
            {/* O hex é dado de produto, do catálogo — não decisão de tema. */}
            <span
              aria-hidden="true"
              className="h-[22px] w-[22px] shrink-0 border border-paper/25"
              style={{ backgroundColor: color.hex }}
            />
            <span>
              <span className="block text-body-sm">{color.name}</span>
              <span className="label-mono mt-0.5 block text-paper-dim">
                {surchargeLabel(color.surcharge)}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

ColorStep.propTypes = {
  colorId: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};

export default ColorStep;
