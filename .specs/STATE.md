# Project State

## Decisions

| ID | Decisão | Contexto | Data |
| -- | ------- | -------- | ---- |
| AD-001 | Tailwind CSS v4 substitui styled-components e bootstrap | Tokens num só arquivo (`@theme`); bootstrap não tinha componente em uso e só carregava o bundle JS | 2026-09-02 |
| AD-002 | Framer Motion (`motion/react`) substitui GSAP | Motion declarativo no React; o GSAP era usado por seletor de classe dentro de `useEffect` | 2026-09-02 |
| AD-003 | Icon Blue `#2BD4CF` é o acento único; verde ácido sai | Direção "editorial de performance" aprovada no mockup; verde chapado carregava a página inteira | 2026-09-02 |
| AD-004 | Interface em PT-BR fixo, sem i18n | Decisão do dono do projeto na aprovação do mockup | 2026-09-02 |
| AD-005 | Estado do configurador em `useReducer` (`useConfigurator`) | Os 10 `useState` do pop-up antigo são uma máquina de estado só; total vira função pura testável | 2026-09-02 |
| AD-006 | Vitest + Testing Library como suíte de teste | Runner nativo do Vite, que o projeto já usa | 2026-09-02 |
| AD-007 | Sem persistência: estado só em memória | Não há backend; `localStorage` seria estado sem dono | 2026-09-02 |

## Handoff

**Feature**: redesign-mt07
**Fase**: Tasks aprovadas — Execute não iniciado
**Branch**: (a criar) `feat/redesign-2026`
**Próximo passo**: T1
