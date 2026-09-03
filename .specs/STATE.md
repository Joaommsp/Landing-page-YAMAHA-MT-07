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
| AD-008 | Subtotal (moto) separado do total (moto + entrega); parcela é subtotal/24 | O cabeçalho do configurador mostra o preço do produto; a entrega é linha do resumo e não é parcelada. A spec dizia "total = preço base" e estava errada — corrigida junto | 2026-09-02 |
| AD-009 | Submissão assíncrona: `status` idle → submitting → confirmed, no hook | MT07-09 pede carregamento antes da confirmação; se o estado ficasse no PaymentStep a máquina de estado se partiria em duas | 2026-09-02 |
| AD-010 | Telefone, CEP, cartão e validade validados, com mensagens fixas | Sem isso o `type` do campo era garantia falsa: valor incompleto passava e o pedido fechava com dado quebrado | 2026-09-02 |
| AD-011 | `STEP_FIELDS` mora em `data/catalog.js`, não em `lib/validation.js` | Rótulo, ordem, tipo e teto de caracteres são catálogo de produto; `validation.js` fica só com funções puras | 2026-09-02 |
| AD-012 | `maskByType(type, value)` como elo único tipo → máscara | Evita o mesmo `switch` repetido em PersonalStep, DeliveryStep e PaymentStep | 2026-09-02 |
| AD-013 | `formatBRL` devolve `—` para valor não finito, nunca `R$ 0,00` | Regra da casa: distinguir "sem dado" de "zero real" | 2026-09-02 |
| AD-014 | `SECTION_IDS` + `sectionHref` vivem em `data/catalog.js`; cabeçalho, rodapé e as três seções da landing consomem a mesma fonte | Os ids das âncoras estavam escritos à mão em cinco arquivos: renomear um deixava link apontando para o vazio, sem erro de build (achado BLOQUEANTE dos dois revisores da fase 2) | 2026-09-03 |
| AD-015 | A barra da ficha técnica nasce com a largura do `ratio`; a animação de `scaleX` prevista no `design.md` fica de fora | Sem JS ou com ele quebrado a proporção precisa continuar correta; o stagger da entrada permanece, pelo `Reveal` de cada linha | 2026-09-03 |
| AD-016 | Tamanho do botão é prop (`size`), não `className` de quem chama | Sem `tailwind-merge` no projeto, um padding vindo por `className` perde para o do próprio componente pela ordem da folha — o override era inerte | 2026-09-03 |
| AD-017 | `validateExpiration` distingue formato de vencimento (`Validade inválida` × `Cartão vencido`) e o CVV ganha validador e tipo próprios | Validade só conferia o mês: `01/20` fechava pedido com cartão morto. E o CVV era tipo `text`, então três letras passavam. A referência de tempo entra por parâmetro para o teste não depender do relógio | 2026-09-03 |
| AD-018 | `CONFIGURATOR_PANEL_ID` e `stepTabId(stepId)` vivem em `data/catalog.js` | O `aria-controls` do stepper e o `aria-labelledby` do painel são o mesmo contrato dos dois lados; escrever o id à mão nos dois arquivos repetiria o erro que a AD-014 corrigiu nas âncoras | 2026-09-03 |
| AD-019 | `Field` (apresentação pura, em `ui/`) e `FieldGrid` (lista do catálogo, `maskByType`, validador no `blur`) servem aos três passos com formulário | Sem eles PersonalStep, DeliveryStep e PaymentStep repetiriam o mesmo encanamento três vezes — a duplicação que esta feature existe para matar. O erro do fluxo (avançar/finalizar) chega por prop e tem precedência sobre o erro de saída de campo | 2026-09-03 |

## Handoff

**Feature**: redesign-mt07
**Fase**: Execute — fase 3 (Configurador) em curso
**Branch**: `feat/redesign-2026`
**Próximo passo**: T20 (passo de pagamento)
