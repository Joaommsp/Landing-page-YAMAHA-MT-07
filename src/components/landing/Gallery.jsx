import PropTypes from "prop-types";

import Reveal from "../ui/Reveal";
import { GALLERY } from "../../data/catalog";

/* Numeração da galeria: dado derivado da posição no catálogo, para a legenda
   ter um índice sem inventar rótulo que não existe no dado. */
function figureIndex(index) {
  return String(index + 1).padStart(2, "0");
}

function Gallery({ id = "galeria" }) {
  return (
    <section className="bg-ink py-10 md:py-14" id={id}>
      <Reveal className="flex flex-wrap items-end gap-6 px-5 pb-6 md:px-11">
        <h2 className="display-tight text-[clamp(24px,3.4vw,44px)]">
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
        className="flex snap-x snap-mandatory gap-0.5 overflow-x-auto px-0.5 pb-0.5"
        role="region"
        tabIndex={0}
      >
        {GALLERY.map((item, index) => (
          <figure
            className="group relative m-0 w-[min(78vw,420px)] flex-none snap-start overflow-hidden bg-ink-3"
            key={item.id}
          >
            {/* Proporção fixa: falha de carregamento não encolhe o trilho. */}
            <img
              alt={item.alt}
              className="aspect-[42/29] w-full object-cover grayscale-[.3] transition duration-700 ease-editorial group-hover:scale-105 group-hover:grayscale-0"
              src={item.image}
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink to-transparent px-4 pb-3.5 pt-8 text-[13px] font-light text-paper-dim">
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
