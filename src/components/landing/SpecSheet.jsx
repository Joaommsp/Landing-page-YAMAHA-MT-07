import PropTypes from "prop-types";

import Reveal from "../ui/Reveal";
import CountUp from "../ui/CountUp";
import { SECTION_IDS, SPECS } from "../../data/catalog";
import ArtImage from "../../assets/images/gellery/galleryimg03.jpg";

/* Stagger da entrada das linhas: a ficha se lê de cima para baixo, e o
   atraso acompanha essa leitura. */
const ROW_STAGGER = 0.11;

/* A barra é a tradução visual do `ratio` do catálogo — nenhum comprimento é
   escolhido no componente. Ela nasce com a largura certa, sem depender de
   animação: sem JS a proporção continua correta. */
function barWidth(ratio) {
  return `${Math.round(ratio * 100)}%`;
}

function SpecSheet({ id = SECTION_IDS.specSheet }) {
  return (
    <section className="page-shell grid bg-ink md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]" id={id}>
      <div className="page-gutter py-10 md:py-14">
        <Reveal>
          <p className="label-mono text-cyan">Engenharia</p>
          <h2 className="display-tight mt-3.5 text-section">
            Da pista
            <br />
            para <span className="text-cyan">a rua</span>
          </h2>
          <p className="mt-5 max-w-[52ch] font-light text-paper-dim">
            Mesma arquitetura dos motores YZR-M1 da MotoGP: o bicilíndrico
            Crossplane de 689 cc entrega aceleração cheia desde baixo, com
            resposta imediata no acelerador.
          </p>
        </Reveal>

        <div className="mt-9">
          {SPECS.map((spec, index) => (
            <Reveal
              className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 gap-y-3 border-b border-line py-4"
              delay={index * ROW_STAGGER}
              key={spec.id}
            >
              <span className="label-mono text-paper-dim">{spec.name}</span>
              <span className="data-figure text-2xl">
                <CountUp value={spec.value} />
                <span className="ml-1.5 font-mono text-xs text-khaki">
                  {spec.unit}
                </span>
              </span>
              <span
                aria-hidden="true"
                className="col-span-2 block h-0.5 overflow-hidden bg-ink-3"
              >
                <span
                  className="block h-full bg-cyan"
                  style={{ width: barWidth(spec.ratio) }}
                />
              </span>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Proporção fixa no bloco da imagem: se a foto não carregar, a coluna
          mantém a altura e nada ao redor se desloca. */}
      <div className="streak-scene relative aspect-[4/3] overflow-hidden bg-ink-2 md:aspect-auto md:min-h-[320px]">
        {/* Rastros de velocidade: decoração atrás da foto, sem informação. */}
        <span aria-hidden="true" className="streak" />
        <span aria-hidden="true" className="streak" />
        <span aria-hidden="true" className="streak" />
        <span aria-hidden="true" className="streak" />
        <img
          alt="Yamaha MT-07 vista de perfil"
          className="h-full w-full object-cover object-[62%_center] brightness-90 grayscale-[.2]"
          src={ArtImage}
        />
      </div>
    </section>
  );
}

SpecSheet.propTypes = {
  id: PropTypes.string,
};

export default SpecSheet;
