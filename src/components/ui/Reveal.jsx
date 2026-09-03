import PropTypes from "prop-types";
import { motion, useReducedMotion } from "motion/react";

/* Revelação de seção ao entrar na viewport. O deslocamento é curto de
   propósito: movimento que sublinha a leitura, não que a atrapalha. */

const OFFSET = 24;
const DURATION = 0.7;
const EASE = [0.22, 1, 0.36, 1];
const VIEWPORT = { once: true, amount: 0.2 };

function Reveal({ as = "div", delay = 0, className = "", children, ...rest }) {
  const prefersReducedMotion = useReducedMotion();

  /* Movimento reduzido: entrega o conteúdo direto no estado final, sem
     estado inicial nenhum — nada fica esperando observador para aparecer. */
  if (prefersReducedMotion) {
    const Plain = as;
    return (
      <Plain className={className} {...rest}>
        {children}
      </Plain>
    );
  }

  const Animated = motion[as] ?? motion.div;

  return (
    <Animated
      className={className}
      initial={{ opacity: 0, y: OFFSET }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: DURATION, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </Animated>
  );
}

Reveal.propTypes = {
  as: PropTypes.string,
  delay: PropTypes.number,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default Reveal;
