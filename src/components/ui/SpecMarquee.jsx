import { Fragment } from "react";
import PropTypes from "prop-types";

import { MARQUEE_ITEMS } from "../../data/catalog";

/* Faixa de especificações correndo entre seções — o vocabulário de telemetria
   e de campanha de fábrica, que preenche a transição em vez de espaço vazio.

   Os termos e os números vêm do catálogo: a faixa é apresentação, não fonte de
   dado. Toda a animação (velocidade, pausa no hover, máscara das pontas) vive
   nas classes `.marquee*` da folha de estilo, com os valores do mockup
   aprovado. Sem CSS a faixa é uma lista de texto legível; sem JS, idem. */

const LABEL = "Especificações da MT-07";

/* O laço sem costura precisa de dois grupos idênticos: a animação translada a
   trilha em -50%, e é o segundo grupo que cobre o intervalo. O segundo é cópia
   visual, então sai do alcance de quem usa leitor de tela. */
function MarqueeGroup({ items, duplicate = false }) {
  return (
    <div aria-hidden={duplicate || undefined} className="marquee__group">
      {items.map((item) => (
        <Fragment key={item}>
          <span>{item}</span>
          {/* Separador decorativo: não é palavra e não se lê. */}
          <i aria-hidden="true">◆</i>
        </Fragment>
      ))}
    </div>
  );
}

MarqueeGroup.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  duplicate: PropTypes.bool,
};

function SpecMarquee({ items = MARQUEE_ITEMS, label = LABEL }) {
  /* Faixa vazia não vira moldura vazia: sem item, a seção some inteira em vez
     de deixar uma barra de 1px sem conteúdo. */
  if (items.length === 0) return null;

  return (
    <div aria-label={label} className="marquee" role="group">
      <div className="marquee__track">
        <MarqueeGroup items={items} />
        <MarqueeGroup duplicate items={items} />
      </div>
    </div>
  );
}

SpecMarquee.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string),
  label: PropTypes.string,
};

export default SpecMarquee;
