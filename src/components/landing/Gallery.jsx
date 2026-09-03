import PropTypes from "prop-types";

import Reveal from "../ui/Reveal";
import {
  GALLERY_CHAPTERS,
  SECTION_IDS,
  chapterSpecs,
} from "../../data/catalog";

/* Conforto e engenharia em capítulos alternados: uma foto grande por vez, com
   o argumento e os números daquele detalhe ao lado, invertendo o lado a cada
   capítulo.

   O trilho horizontal que existia aqui gastava uma faixa só de altura e deixava
   metade das fotos fora da tela — quem não arrastava nunca via. Em capítulos,
   tudo aparece com o gesto que a pessoa já está fazendo: rolar.

   A numeração é informação, não enfeite: a seção é uma sequência, e a ordem
   dos capítulos é a ordem em que a moto se explica. */
function chapterIndex(index) {
  return String(index + 1).padStart(2, "0");
}

function Chapter({ chapter, index }) {
  const specs = chapterSpecs(chapter);

  /* Capítulo par troca o lado da foto. A inversão é do desenho, não do dado:
     na largura de celular tudo empilha na ordem de leitura. */
  const flipped = index % 2 === 1;

  return (
    <Reveal
      as="article"
      className="grid bg-ink-2 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]"
    >
      {/* Proporção fixa: se a foto não carregar, o capítulo mantém a altura e
          nada abaixo se desloca. */}
      <div
        className={`relative aspect-[16/11] overflow-hidden bg-ink-3 ${
          flipped ? "md:order-2" : ""
        }`}
      >
        <img
          alt={chapter.alt}
          className="h-full w-full object-cover grayscale-[.26] transition-transform duration-1000 ease-editorial hover:scale-[1.04]"
          loading="lazy"
          src={chapter.image}
        />
      </div>

      <div className="page-gutter flex flex-col justify-center gap-3 py-9 md:py-12">
        <p className="label-mono text-cyan">
          {`${chapterIndex(index)} · ${chapter.eyebrow}`}
        </p>

        <h3 className="display-tight text-sub leading-none">
          {chapter.title[0]}
          <br />
          {chapter.title[1]}
        </h3>

        <p className="max-w-[42ch] font-light text-paper-dim">{chapter.text}</p>

        {/* Sem dado não há divisor solto: a lista só existe quando há número
            para mostrar. */}
        {specs.length > 0 && (
          <dl className="mt-1.5 flex flex-wrap gap-x-7 gap-y-3 border-t border-line pt-3">
            {specs.map((spec) => (
              <div key={spec.id}>
                <dt className="label-mono text-khaki">{spec.name}</dt>
                <dd className="data-figure mt-1 text-xl">
                  {spec.value}
                  <span className="ml-1 font-mono text-xs text-khaki">
                    {spec.unitShort}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </Reveal>
  );
}

Chapter.propTypes = {
  chapter: PropTypes.shape({
    alt: PropTypes.string.isRequired,
    eyebrow: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    title: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

function Gallery({ id = SECTION_IDS.gallery }) {
  return (
    <section className="bg-ink py-10 md:py-14" id={id}>
      <Reveal className="page-shell page-gutter flex flex-wrap items-end gap-6 pb-8">
        <h2 className="display-tight text-section">
          Conforto
          <br />e postura
        </h2>
        <p className="max-w-[40ch] text-sm font-light text-paper-dim md:ml-auto">
          Três detalhes que explicam por que a mesma moto serve ao trânsito de
          segunda e à estrada de domingo.
        </p>
      </Reveal>

      <div className="page-shell flex flex-col gap-0.5">
        {GALLERY_CHAPTERS.map((chapter, index) => (
          <Chapter chapter={chapter} index={index} key={chapter.id} />
        ))}
      </div>
    </section>
  );
}

Gallery.propTypes = {
  id: PropTypes.string,
};

export default Gallery;
