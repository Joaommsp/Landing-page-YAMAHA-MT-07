import PropTypes from "prop-types";

/* Botão único da interface. Toda cor vem de token do tema (`src/styles/index.css`);
   nenhum literal hexadecimal entra aqui. */

const BASE =
  "relative inline-flex items-center justify-center gap-3 font-mono text-xs uppercase tracking-[0.16em] " +
  "px-6 py-4 cursor-pointer border transition-colors duration-300 ease-editorial " +
  "focus-visible:outline-2 focus-visible:outline-offset-[3px] " +
  "disabled:cursor-not-allowed disabled:opacity-60";

/* O contorno de foco do tema é ciano; sobre o botão sólido (também ciano) ele
   sumiria, então a variante sólida troca o contorno para o tom de papel. */
const VARIANTS = {
  solid:
    "bg-cyan text-ink border-cyan hover:bg-cyan-soft hover:border-cyan-soft focus-visible:outline-paper",
  ghost:
    "bg-transparent text-paper border-line hover:bg-ink-3 hover:border-khaki focus-visible:outline-cyan",
};

function Button({
  variant = "solid",
  href,
  type = "button",
  className = "",
  children,
  ...rest
}) {
  const classes = `${BASE} ${VARIANTS[variant] ?? VARIANTS.solid} ${className}`.trim();

  /* Mesma aparência para ação e navegação, sem duplicar a folha de estilo:
     com `href` o botão vira âncora e mantém a semântica de link. */
  if (href) {
    return (
      <a className={classes} href={href} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} type={type} {...rest}>
      {children}
    </button>
  );
}

Button.propTypes = {
  variant: PropTypes.oneOf(Object.keys(VARIANTS)),
  href: PropTypes.string,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  className: PropTypes.string,
  children: PropTypes.node,
};

export default Button;
