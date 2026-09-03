import Reveal from "../ui/Reveal";
import { SECTION_IDS, sectionHref } from "../../data/catalog";
import AuthorLogo from "../../assets/images/rakuzan-logo.png";

/* Colunas do rodapé: âncoras da própria página e os perfis reais do autor.
   Nada de link morto (`href="#"`) como na versão anterior. */
const FOOTER_COLUMNS = [
  {
    title: "A moto",
    links: [
      { href: sectionHref(SECTION_IDS.hero), label: "Início" },
      { href: sectionHref(SECTION_IDS.specSheet), label: "Ficha técnica" },
      { href: sectionHref(SECTION_IDS.gallery), label: "Galeria" },
    ],
  },
  {
    title: "Autoria",
    links: [
      {
        href: "https://www.linkedin.com/in/joaomarcosmsp/",
        label: "LinkedIn",
        external: true,
      },
      {
        href: "https://github.com/Joaommsp",
        label: "GitHub",
        external: true,
      },
    ],
  },
];

const LINK_CLASS =
  "text-sm font-light text-paper-dim transition-colors duration-300 hover:text-paper";

/* Link externo abre em outra aba e não vaza o referenciador. */
const EXTERNAL_PROPS = { target: "_blank", rel: "noreferrer" };

function Footer() {
  return (
    <footer className="border-t border-line bg-ink">
      <div className="page-shell page-gutter py-10">
        <Reveal className="flex flex-wrap gap-10 border-b border-line pb-9">
          <div className="max-w-[34ch]">
            <img className="h-8 w-auto" src={AuthorLogo} alt="Rakuzan" />
            <p className="mt-4 text-sm font-light text-paper-dim">
              Página de vitrine da Yamaha MT-07, refeita como estudo de
              interface e de fluxo de compra.
            </p>
          </div>

          <nav
            aria-label="Navegação do rodapé"
            className="flex flex-wrap gap-10 md:ml-auto md:gap-16"
          >
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title}>
                <p className="label-mono text-khaki">{column.title}</p>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <a
                        className={LINK_CLASS}
                        href={link.href}
                        {...(link.external ? EXTERNAL_PROPS : null)}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </Reveal>

        <p className="label-mono mt-7 text-paper-dim">
          Desenvolvido por <strong className="text-paper">João Marcos</strong> ·
          Projeto sem fim comercial: todos os direitos pertencem à marca
          oficial.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
