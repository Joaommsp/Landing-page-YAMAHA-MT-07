# Landing Page Yamaha MT-07

Página de vitrine da Yamaha MT-07, com configurador de compra em cinco passos:
cor, opcionais, dados pessoais, entrega e pagamento. Projeto de portfólio, sem
fim comercial — não há backend nem gateway de pagamento: o pedido é simulado do
início ao fim.

<img src="./src/assets/images/yamahaLogo.png" alt="Yamaha">

## Stack

| Camada | O que é usado |
| ------ | ------------- |
| Interface | React 18 |
| Build | Vite 5 |
| Estilo | Tailwind CSS v4, com os tokens do tema em `src/styles/index.css` |
| Motion | Motion (Framer Motion), `motion/react` |
| Tipos de prop | prop-types |
| Testes | Vitest + Testing Library + jsdom |
| Lint | ESLint |

## Como rodar

```
git clone https://github.com/Joaommsp/purchase-page-YAMAHA-MT-07.git
cd purchase-page-YAMAHA-MT-07
```

```
npm i          # instala as dependências
npm run dev    # sobe o servidor de desenvolvimento
npm test       # roda a suíte (Vitest); use `npm test -- --run` para uma passada só
npm run build  # gera o pacote de produção
npm run lint   # análise estática
```

## O que mudou no redesenho

O projeto nasceu em 2024 e foi refeito de ponta a ponta em 2026, com a direção
visual "editorial de performance":

- **Estilo**: `styled-components` e `bootstrap` deram lugar ao Tailwind CSS v4.
  Cor, tipografia, escala e ordem de empilhamento vivem num único bloco
  `@theme`; nenhum componente declara hexadecimal. O acento passou a ser o ciano
  `#2BD4CF`, no lugar do verde que carregava a página inteira.
- **Motion**: GSAP com seletor de classe dentro de `useEffect` saiu; entrou
  Motion, declarativo. `MotionConfig reducedMotion="user"` na raiz garante que
  quem pede movimento reduzido no sistema receba todo conteúdo em estado final.
- **Configurador**: os cinco blocos de indicador de passo duplicados viraram um
  componente só, e os dez `useState` soltos viraram uma máquina de estado em
  `useReducer` (`useConfigurator`), com preço, subtotal e parcela derivados de
  função pura.
- **Formulários**: campos controlados, máscaras brasileiras (CPF, telefone, CEP,
  cartão) e validadores próprios — incluindo dígitos verificadores de CPF e
  recusa de cartão vencido. O menu passou a abrir e fechar por estado do React,
  sem `classList.toggle`.
- **Testes**: o projeto não tinha nenhum. A suíte nasceu com o redesenho, sobre
  os critérios de aceite da especificação em `.specs/features/redesign-mt07/`.
- **Dependências**: `bootstrap`, `gsap`, `styled-components`, `react-spinners`,
  `react-imask` e `react-router-dom` saíram do `package.json`.

## Capturas

As imagens abaixo são do **desenho antigo**, anterior ao redesenho de 2026, e
ficam aqui como registro do ponto de partida. As capturas da versão nova ainda
serão geradas.

### Antes — desktop

![Versão antiga em desktop](./MacBook%20Pro-1719152539497.jpeg)
![Versão antiga em desktop](./MacBook%20Pro-1719152555239.jpeg)

### Antes — mobile

![Versão antiga em mobile](./iPhone%2012%20Pro-1719152939398.jpeg)
![Versão antiga em mobile](./iPhone%2012%20Pro-1719152589875.jpeg)

## Deploy

<div align="left">
  <a href="https://purchase-page-yamaha-mt-07.vercel.app/"><img src="https://skillicons.dev/icons?i=vercel" height="40" alt="Vercel"  /></a>
</div>

## Crédito

Desenvolvido por **João Marcos** — [LinkedIn](https://www.linkedin.com/in/joaomarcosmsp/)
· [GitHub](https://github.com/Joaommsp).

Projeto sem fim comercial, feito como estudo de interface e de fluxo de compra.
Marca, nome e imagens da Yamaha MT-07 pertencem aos seus detentores.
