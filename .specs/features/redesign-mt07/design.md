# Redesenho MT-07 — Design

**Spec**: `.specs/features/redesign-mt07/spec.md`

## Decisões de stack

| Camada | Antes | Depois | Motivo |
| ------ | ----- | ------ | ------ |
| Estilo | styled-components + bootstrap | Tailwind CSS v4 (`@theme`) | Tokens em um arquivo, sem 8 `styles.js` repetindo hex; bootstrap não tinha nenhum componente em uso |
| Motion | GSAP + ScrollTrigger via seletor de classe | Framer Motion (`motion/react`) | Declarativo dentro do React; dispensa `useEffect` + `gsap.utils.toArray(".classe")` |
| Estado do configurador | 10 `useState` soltos no pop-up | `useReducer` em `useConfigurator` | Passo, cor, opcionais e formulários são uma máquina de estado só |
| Testes | nenhum | Vitest + Testing Library + jsdom | Runner nativo do Vite, já usado no projeto |
| Formulários | inputs não controlados, sem validação | campos controlados + validadores puros | Requisito MT07-08 |

## Arquitetura de pastas

```
src/
├── styles/
│   └── index.css              # @import tailwindcss + @theme (tokens MT07-01)
├── data/
│   └── catalog.js             # preço base, cores, opcionais, ficha técnica, galeria
├── lib/
│   ├── currency.js            # formatBRL, formatParcel
│   ├── masks.js               # maskCPF, maskPhone, maskCEP, maskCard
│   └── validation.js          # validateEmail, validateCPF, validateRequired, validateStep
├── hooks/
│   └── useConfigurator.js     # useReducer: passo, cor, opcionais, formulários, total
├── components/
│   ├── layout/{Header,Footer}
│   ├── landing/{Hero,SpecSheet,Gallery}
│   ├── configurator/
│   │   ├── Configurator.jsx   # shell: modal, navegação, resumo do passo
│   │   ├── Stepper.jsx        # indicador único dos 5 passos (mata a duplicação 5x)
│   │   └── steps/{ColorStep,OptionsStep,PersonalStep,DeliveryStep,PaymentStep}.jsx
│   └── ui/{Button,Field,Reveal}.jsx
└── Pages/Home/index.jsx
```

## Fluxo de dados do configurador

```
useConfigurator (useReducer)
        │
        ├── state.step ──────────► Stepper (aria-selected) + Configurator (painel visível)
        ├── state.colorId ───────► ColorStep (imagem + seleção) ─┐
        ├── state.optionIds ─────► OptionsStep (marcados) ───────┤
        ├── state.personal ──────► PersonalStep ─────────────────┤
        ├── state.delivery ──────► DeliveryStep ─────────────────┤
        └── derived.total ◄───────────────────────────────────────┘
                └── PaymentStep (resumo + cartão)
```

`derived.total` = `BASE_PRICE` + soma dos opcionais selecionados + acréscimo da cor + `DELIVERY_PRICE`. Calculado por função pura `computeTotal(state)` em `useConfigurator.js`, testável sem render.

## Contratos principais

```js
// data/catalog.js
export const BASE_PRICE = 48500;
export const DELIVERY_PRICE = 2000;
export const COLORS = [{ id, name, hex, surcharge, image }];
export const OPTIONS = [{ id, name, price, description }];
export const SPECS = [{ id, name, value, unit, ratio }];

// hooks/useConfigurator.js
{ state, total, parcel, actions: { goTo, next, previous, selectColor, toggleOption, setField, submit } }
```

## Regras de motion (MT07-10)

| Onde | Efeito | Valores |
| ---- | ------ | ------- |
| Seção entrando | `Reveal` com `whileInView` | y 24 → 0, 0.7s, once |
| Troca de passo | `AnimatePresence` no painel | y 10 → 0, 0.5s |
| Troca de cor | crossfade na imagem | opacity + x 12px, 0.35s |
| Barras da ficha | `scaleX` de 0 ao ratio | 1.1s, stagger 0.11s |
| `prefers-reduced-motion` | `MotionConfig reducedMotion="user"` | tudo em estado final |

## Acessibilidade

- Stepper com `role="tablist"` / `role="tab"` e `aria-selected`; painéis com `role="tabpanel"`.
- Foco visível por token (`outline` cyan) em todo elemento interativo.
- Toda imagem com `alt` descritivo; imagens decorativas com `alt=""`.
- Blocos de imagem com `aspect-ratio` fixo, para falha de carregamento não deslocar o layout (edge case MT07-07).
