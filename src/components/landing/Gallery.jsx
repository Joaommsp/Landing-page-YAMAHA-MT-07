import PropTypes from "prop-types";
import { useReducedMotion } from "motion/react";

import Reveal from "../ui/Reveal";
import { GALLERY, SECTION_IDS } from "../../data/catalog";

/* Numeração da galeria: dado derivado da posição no catálogo, para a legenda
   ter um índice sem inventar rótulo que não existe no dado. */
function figureIndex(index) {
  return String(index + 1).padStart(2, "0");
}

/* Teto da inclinação: acima de 6 graus por eixo o card vira brinquedo e a
   legenda fica torta de ler. */
const MAX_TILT = 6;

function Gallery({ id = SECTION_IDS.gallery }) {
  const prefersReducedMotion = useReducedMotion();

  const handleTilt = (event) => {
    if (prefersReducedMotion) return;

    /* Em toque não há cursor a seguir: o efeito não existe, em vez de reagir
       ao último ponto tocado. A consulta fica aqui, e não no corpo do
       componente, para a primeira pintura não depender de `matchMedia`. */
    const media = window.matchMedia?.("(hover: hover)");
    if (media && !media.matches) return;

    const card = event.currentTarget;
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;

    card.style.transform = `rotateY(${((x - 0.5) * 2 * MAX_TILT).toFixed(
      2
    )}deg) rotateX(${((0.5 - y) * 2 * MAX_TILT).toFixed(2)}deg)`;
    card.style.setProperty("--tilt-glare-x", `${(x * 100).toFixed(1)}%`);
    card.style.setProperty("--tilt-glare-y", `${(y * 100).toFixed(1)}%`);
  };

  const resetTilt = (event) => {
    event.currentTarget.style.transform = "";
  };

  return (
    <section className=" bg-ink py-10 md:py-14" id={id}>
      <Reveal className="page-shell page-gutter flex flex-wrap items-end gap-6 pb-6">
        <h2 className="display-tight text-section">
          Conforto
          <br />e postura
        </h2>
        <p className="max-w-[40ch] text-sm font-light text-paper-dim md:ml-auto">
          Suspensão traseira com ajuste de retorno e nove posições de
          pré-carga. Banco largo e triângulo de pilotagem ereto, para rodar o
          dia inteiro.
        </p>
      </Reveal>

      {/* Trilho horizontal: a rolagem fica contida aqui, com encaixe da
          próxima imagem no início. Focável para navegar pelo teclado. */}
      <div
        aria-label="Galeria de fotos da Yamaha MT-07"
        className="tilt-scene page-gutter flex snap-x snap-mandatory gap-0.5 overflow-x-auto pb-0.5 [scroll-padding-inline:clamp(20px,4vw,72px)]"
        role="region"
        tabIndex={0}
      >
        {GALLERY.map((item, index) => (
          <figure
            className="tilt group relative m-0 w-[min(78vw,420px)] flex-none snap-start overflow-hidden bg-ink-3"
            key={item.id}
            onMouseLeave={resetTilt}
            onMouseMove={handleTilt}
          >
            {/* Proporção fixa: falha de carregamento não encolhe o trilho. */}
            <img
              alt={item.alt}
              loading="lazy"
              className="aspect-[42/29] w-full object-cover grayscale-[.3] transition duration-700 ease-editorial group-hover:scale-105 group-hover:grayscale-0"
              src={item.image}
            />
            <span aria-hidden="true" className="tilt-glare" />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink to-transparent px-4 pb-3.5 pt-8 text-caption font-light text-paper-dim">
              <span className="label-mono mb-1 block text-cyan">
                {figureIndex(index)}
              </span>
              {item.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

Gallery.propTypes = {
  id: PropTypes.string,
};

export default Gallery;
