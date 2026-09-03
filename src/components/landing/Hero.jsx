import PropTypes from "prop-types";

import Button from "../ui/Button";
import CountUp from "../ui/CountUp";
import {
  BASE_PRICE,
  MODEL_YEAR,
  SECTION_IDS,
  SPECS,
  sectionHref,
} from "../../data/catalog";
import { formatBRL } from "../../lib/currency";
import HeroImage from "../../assets/images/banner-mt07.jpg";

/* Os três números que vendem a moto na primeira dobra. Vêm da ficha técnica
   do catálogo: o hero escolhe quais mostrar, não os redeclara. */
const HERO_SPEC_IDS = ["displacement", "power", "torque"];

const HERO_SPECS = HERO_SPEC_IDS.map((id) => {
  const spec = SPECS.find((item) => item.id === id);
  /* Perder um número em silêncio é pior que quebrar: a primeira dobra promete
     os três. */
  if (!spec) throw new Error(`Especificação "${id}" ausente no catálogo`);
  return spec;
});

function Hero({
  id = SECTION_IDS.hero,
  specSheetHref = sectionHref(SECTION_IDS.specSheet),
  onOpenConfigurator,
}) {
  return (
    <section
      className="relative grid min-h-[560px] grid-rows-[1fr_auto] overflow-hidden"
      id={id}
    >
      {/* A foto preenche o bloco em posição absoluta: se não carregar, o hero
          mantém a altura e nada abaixo se desloca. */}
      <div className="absolute inset-0 z-0">
        <img
          alt="Yamaha MT-07 estacionada em uma garagem"
          className="kenburns h-full w-full object-cover brightness-[.6] contrast-[1.08] grayscale-[.35]"
          src={HeroImage}
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-transparent" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" />
      </div>

      <div className="page-shell page-gutter relative z-10 grid w-full items-end gap-8 pb-7 pt-10 md:grid-cols-[minmax(0,1fr)_auto]">
        <div>
          <p className="label-mono flex items-center gap-3 text-cyan">
            <span aria-hidden="true" className="h-px w-9 bg-cyan" />
            {`Hyper Naked · ${MODEL_YEAR}`}
          </p>

          <h1 className="mt-3">
            <span className="line block">
              <span className="display-wide block text-hero">MT-07</span>
            </span>{" "}
            <span className="line mt-1.5 block">
              <span className="display-narrow block text-sub text-khaki">
                Master of torque
              </span>
            </span>
          </h1>

          <p className="mt-5 max-w-[38ch] text-body-sm font-light text-paper-dim">
            Motor CP2 de 689 cc, chassi compacto e resposta imediata. A Hyper
            Naked mais vendida da Yamaha, com mais de 160 mil unidades rodando
            pelo mundo.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Button glow onClick={onOpenConfigurator}>
              Montar a minha
            </Button>
            <Button href={specSheetHref} variant="ghost">
              Ficha técnica
            </Button>
          </div>
        </div>

        <ul
          aria-label="Números de desempenho"
          className="flex gap-7 border-t border-line pt-4 md:min-w-[170px] md:flex-col md:gap-5 md:border-l md:border-t-0 md:pl-6 md:pt-0"
        >
          {HERO_SPECS.map((spec) => (
            <li key={spec.id}>
              <p className="data-figure text-figure">
                <CountUp value={spec.value} />
                <span className="ml-1 font-mono text-sm text-khaki">
                  {spec.unitShort}
                </span>
              </p>
              <p className="label-mono mt-1.5 text-paper-dim">{spec.name}</p>
            </li>
          ))}
        </ul>
      </div>

      <p className="label-mono page-shell page-gutter relative z-10 flex w-full items-center gap-3.5 border-t border-line py-3.5 text-paper-dim">
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-cyan" />
        Role para a ficha completa
        <span className="ml-auto text-khaki">
          A partir de <strong className="font-medium">{formatBRL(BASE_PRICE)}</strong>
        </span>
      </p>
    </section>
  );
}

Hero.propTypes = {
  id: PropTypes.string,
  specSheetHref: PropTypes.string,
  onOpenConfigurator: PropTypes.func.isRequired,
};

export default Hero;
