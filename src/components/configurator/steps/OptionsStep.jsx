import PropTypes from "prop-types";

import Button from "../../ui/Button";
import { OPTIONS } from "../../../data/catalog";
import { formatBRL } from "../../../lib/currency";

/* Passo 2 — opcionais. A lista e os preços vêm do catálogo; o passo só marca,
   desmarca e mostra. O kit de personalização é o item em destaque. */

const CATALOG_OPTIONS = OPTIONS.filter((option) => !option.featured);
const FEATURED_OPTION = OPTIONS.find((option) => option.featured);

const OPTION_CLASS =
  "flex cursor-pointer flex-col gap-2.5 border border-transparent bg-ink-2 p-4.5 text-left " +
  "transition-[background-color,border-color] duration-300 hover:bg-ink-3 aria-pressed:border-cyan";

const BOX_CLASS =
  "grid h-4.5 w-4.5 shrink-0 place-items-center border border-line " +
  "transition-colors duration-300 group-aria-pressed:border-cyan group-aria-pressed:bg-cyan";

function priceLabel(price) {
  return `+ ${formatBRL(price)}`;
}

function OptionsStep({ optionIds, onToggle }) {
  const isMarked = (optionId) => optionIds.includes(optionId);

  return (
    <div className="pt-6">
      {CATALOG_OPTIONS.length === 0 ? (
        <p className="label-mono text-khaki">
          Nenhum opcional disponível para este modelo
        </p>
      ) : (
        <div
          aria-label="Opcionais"
          className="grid gap-0.5 sm:grid-cols-2 lg:grid-cols-3"
          role="group"
        >
          {CATALOG_OPTIONS.map((option) => (
            <button
              aria-pressed={isMarked(option.id)}
              className={`group ${OPTION_CLASS}`}
              key={option.id}
              onClick={() => onToggle(option.id)}
              type="button"
            >
              <span className="flex items-center justify-between gap-2.5">
                <span className="text-body-sm text-paper">{option.name}</span>
                <span aria-hidden="true" className={BOX_CLASS}>
                  <svg
                    className="h-2.5 w-2.5 text-ink opacity-0 transition-opacity duration-200 group-aria-pressed:opacity-100"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                </span>
              </span>
              <span className="font-mono text-caption text-khaki">
                {priceLabel(option.price)}
              </span>
              <span className="text-caption font-light text-paper-dim">
                {option.description}
              </span>
            </button>
          ))}
        </div>
      )}

      {FEATURED_OPTION && (
        <div className="beam mt-6 flex flex-wrap items-center gap-5 p-5">
          <div>
            <h4 className="display-tight text-xl">{FEATURED_OPTION.name}</h4>
            <p className="label-mono mt-1 text-khaki">
              {FEATURED_OPTION.description}
            </p>
          </div>

          <p className="data-figure ml-auto text-2xl">
            {formatBRL(FEATURED_OPTION.price)}
          </p>

          <Button
            aria-pressed={isMarked(FEATURED_OPTION.id)}
            onClick={() => onToggle(FEATURED_OPTION.id)}
            size="sm"
            variant={isMarked(FEATURED_OPTION.id) ? "ghost" : "solid"}
          >
            {isMarked(FEATURED_OPTION.id) ? "Remover kit" : "Adicionar kit"}
          </Button>
        </div>
      )}
    </div>
  );
}

OptionsStep.propTypes = {
  optionIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default OptionsStep;
