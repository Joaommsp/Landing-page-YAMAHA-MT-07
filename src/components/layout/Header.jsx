import { useState } from "react";
import PropTypes from "prop-types";

import Button from "../ui/Button";
import { SECTION_IDS, sectionHref } from "../../data/catalog";
import Logo from "../../assets/images/yamahaLogo.png";

/* Navegação da página: cada item aponta para a âncora da seção
   correspondente. É a lista única — o menu mobile renderiza a mesma. */
const NAV_LINKS = [
  { href: sectionHref(SECTION_IDS.hero), label: "Início" },
  { href: sectionHref(SECTION_IDS.specSheet), label: "A moto" },
  { href: sectionHref(SECTION_IDS.gallery), label: "Galeria" },
];

const MOBILE_MENU_ID = "menu-navegacao";

const LINK_CLASS =
  "group relative inline-block pb-1 text-caption tracking-[0.04em] " +
  "text-paper-dim transition-colors duration-300 hover:text-paper";

function NavLink({ href, label, onSelect }) {
  return (
    <a className={LINK_CLASS} href={href} onClick={onSelect}>
      {label}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-cyan transition-transform duration-300 ease-editorial group-hover:scale-x-100 group-focus-visible:scale-x-100"
      />
    </a>
  );
}

NavLink.propTypes = {
  href: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onSelect: PropTypes.func,
};

function Header({ onOpenConfigurator }) {
  /* O menu é estado do React: nada de `document.querySelector` nem de
     `classList.toggle` como na versão anterior. */
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[var(--z-header)] flex items-center gap-6 border-b border-line bg-ink/90 px-5 py-4 backdrop-blur-md md:px-7">
      <a className="flex items-center" href={sectionHref(SECTION_IDS.hero)}>
        <img className="h-5 w-auto" src={Logo} alt="Yamaha" />
      </a>

      <nav aria-label="Navegação principal" className="ml-auto hidden md:block">
        <ul className="flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <NavLink href={link.href} label={link.label} />
            </li>
          ))}
        </ul>
      </nav>

      <div className="ml-auto flex items-center gap-3 md:ml-6">
        <Button onClick={onOpenConfigurator} size="sm">
          Montar a minha
        </Button>

        <button
          aria-controls={MOBILE_MENU_ID}
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          className="border border-line p-3 text-paper transition-colors duration-300 hover:border-khaki md:hidden"
          onClick={() => setIsMenuOpen((open) => !open)}
          type="button"
        >
          <svg
            aria-hidden="true"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {isMenuOpen && (
        <nav
          aria-label="Navegação do menu"
          className="absolute inset-x-0 top-full border-b border-line bg-ink px-5 py-5 md:hidden"
          id={MOBILE_MENU_ID}
        >
          <ul className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <NavLink
                  href={link.href}
                  label={link.label}
                  onSelect={() => setIsMenuOpen(false)}
                />
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

Header.propTypes = {
  onOpenConfigurator: PropTypes.func.isRequired,
};

export default Header;
