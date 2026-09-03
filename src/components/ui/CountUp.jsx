import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { animate, useInView, useReducedMotion } from "motion/react";

import { EASE_EDITORIAL } from "../../lib/motion";
import {
  decimalPlacesBR,
  formatDecimalBR,
  parseDecimalBR,
} from "../../lib/number";

/* Número que conta até o valor quando a seção entra na tela.

   Regra dura do efeito: o valor final é o estado inicial do componente. A
   contagem é enfeite por cima — se o observador não disparar, se o `motion`
   não animar ou se a preferência do sistema for por movimento reduzido, o que
   está escrito é o número certo e completo. Nada aqui nasce vazio nem em
   zero à espera de alguém. */

const DURATION = 1.2;
const VIEWPORT = { once: true, amount: 0.4 };

function CountUp({ value, className = "" }) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef(null);
  const isInView = useInView(ref, VIEWPORT);

  /* Estado inicial é o texto de origem, não uma contagem começando: é o que
     garante o número correto na primeira pintura. */
  const [shown, setShown] = useState(value);

  useEffect(() => {
    /* Valor trocado no catálogo com a contagem já feita: volta a valer o texto
       de origem antes de qualquer nova animação. */
    setShown(value);
  }, [value]);

  useEffect(() => {
    if (prefersReducedMotion || !isInView) return undefined;

    const target = parseDecimalBR(value);
    /* Valor que não é número (uma faixa, um travessão) não conta: fica como
       está, escrito. */
    if (target === null) return undefined;

    const decimals = decimalPlacesBR(value);

    const controls = animate(0, target, {
      duration: DURATION,
      ease: EASE_EDITORIAL,
      onUpdate: (current) => {
        setShown(formatDecimalBR(current, decimals) ?? value);
      },
      /* Fecha no texto de origem, não no arredondamento do último quadro. */
      onComplete: () => setShown(value),
    });

    return () => controls.stop();
  }, [isInView, prefersReducedMotion, value]);

  return (
    <span className={className} ref={ref}>
      {shown}
    </span>
  );
}

CountUp.propTypes = {
  value: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default CountUp;
