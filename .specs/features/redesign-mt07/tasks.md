# Redesenho MT-07 — Tasks

## Execution Protocol (MANDATORY -- do not skip)

Implement these tasks with the `tlc-spec-driven` skill: **activate it by name and follow its Execute flow and Critical Rules.** Do not search for skill files by filesystem path.

**If the skill cannot be activated, STOP and tell the user - do not proceed without it.**

---

**Design**: `.specs/features/redesign-mt07/design.md`
**Status**: In Progress

---

## Test Coverage Matrix

> Gerada do codebase e da spec. Guidelines encontradas: nenhuma (`AGENTS.md`, `CONTRIBUTING.md`, config de cobertura — ausentes). Defaults fortes aplicados. O repo não tem nenhum teste hoje; a suíte nasce nesta feature.

| Code Layer | Required Test Type | Coverage Expectation | Location Pattern | Run Command |
| ---------- | ------------------ | -------------------- | ---------------- | ----------- |
| Lógica pura (`src/lib/*`, `src/data/*`) | unit | Todos os ramos; 1:1 com as ACs da spec; todo edge case listado tem teste | `src/lib/__tests__/*.test.js`, `src/data/__tests__/*.test.js` | `npm test -- --run` |
| Hook de estado (`src/hooks/*`) | unit | Toda transição de estado e todo cálculo derivado; edge cases de limite (primeiro/último passo, zero opcionais, todos os opcionais) | `src/hooks/__tests__/*.test.jsx` | `npm test -- --run` |
| Componente com interação/estado (`Header`, `Hero`, `Stepper`, `steps/*`, `Configurator`, `Home`) | unit | Caminho feliz + cada edge case listado + cada estado de erro descrito na AC | `src/components/**/__tests__/*.test.jsx` | `npm test -- --run` |
| Componente de apresentação sem estado (`Button`, `Reveal`, `SpecSheet`, `Gallery`, `Footer`) | none | — (build gate) | — | build gate |
| Config / build (`vite.config.js`, `package.json`, `src/styles/index.css`) | none | — (build gate) | — | build gate |

## Gate Check Commands

| Gate Level | When to Use | Command |
| ---------- | ----------- | ------- |
| Quick | Depois de tasks só com teste unitário | `npm test -- --run` |
| Full | Depois de tasks que integram vários componentes | `npm test -- --run` |
| Build | Fim de fase ou task de config/apresentação | `npm run lint && npm test -- --run && npm run build` |

**Baseline de lint (medido em T1, antes de qualquer código novo):** `npm run lint` reporta 8 erros `no-unused-vars` em três arquivos legados — `src/Pages/Home/styles.js`, `src/components/Checkout/index.jsx`, `src/components/Footer/index.jsx`. Esses arquivos são removidos nas fases 2–4. Até lá, o gate Build exige **zero erro novo** em relação a esse baseline; a partir de T23 exige lint totalmente limpo, como manda o Success Criteria da spec.

---

## Execution Plan

### Phase 1: Fundação

```
T1 → T2 → T3 → T4 → T5 → T6 → T7 → T7b
```

### Phase 2: Landing

```
T8 → T9 → T10 → T11 → T12 → T13 → T14
```

### Phase 3: Configurador

```
T15 → T16 → T17 → T18 → T19 → T20 → T21
```

### Phase 4: Integração e limpeza

```
T22 → T23 → T24 → T25
```

---

## Task Breakdown

### T1: Instalar Tailwind v4 e declarar os tokens do tema ✅

**What**: Instalar `tailwindcss` + `@tailwindcss/vite` e escrever o tema com os oito tokens de cor, as três famílias tipográficas e o easing padrão.
**Where**: `src/styles/index.css`
**Depends on**: None
**Reuses**: Paleta e tipografia do mockup aprovado
**Requirement**: MT07-01

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] `@import "tailwindcss"` e bloco `@theme` com `--color-ink`, `--color-ink-2`, `--color-ink-3`, `--color-line`, `--color-khaki`, `--color-paper`, `--color-paper-dim`, `--color-cyan`
- [x] Fontes Archivo, Barlow e IBM Plex Mono declaradas como `--font-display`, `--font-body`, `--font-mono` e carregadas via Google Fonts no `index.html`
- [x] `#2bd4cf` aparece uma única vez no projeto, neste arquivo
- [x] Gate check passa: `npm run build` verde; lint sem erro novo sobre o baseline

**Tests**: none
**Gate**: build

**Commit**: `build(styles): add tailwind v4 and design tokens`

---

### T2: Configurar Vitest com Testing Library ✅

**What**: Adicionar o ambiente de teste (jsdom, setup com `@testing-library/jest-dom`) e o script `test` no `package.json`.
**Where**: `vite.config.js`
**Depends on**: T1
**Reuses**: Config Vite existente
**Requirement**: MT07-11

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] `npm test -- --run` executa e sai com código 0
- [x] `environment: "jsdom"` e `setupFiles` apontando para `src/setupTests.js`
- [x] Gate check passa: build verde, suíte verde, lint sem erro novo sobre o baseline

**Tests**: none
**Gate**: build

**Commit**: `build(test): add vitest and testing library setup`

---

### T3: Criar o catálogo de produto ✅

**What**: Centralizar preço base, entrega, cores, opcionais, ficha técnica e galeria num módulo de dados, com teste garantindo a forma e os valores.
**Where**: `src/data/catalog.js`
**Depends on**: T2
**Reuses**: Imagens em `src/assets/images`
**Requirement**: MT07-06

**Done when**:

- [x] `BASE_PRICE === 48500` e `DELIVERY_PRICE === 2000`
- [x] `COLORS` com id, nome, hex, `surcharge` e imagem para as três cores do mockup
- [x] `OPTIONS` com id, nome, preço e descrição para os quatro opcionais e o kit
- [x] `SPECS` com valor, unidade e `ratio` entre 0 e 1 para as quatro especificações
- [x] Gate check passa: `npm test -- --run`
- [x] Test count: 6 testes passam

**Tests**: unit
**Gate**: quick

**Commit**: `feat(data): add product catalog with prices and specs`

---

### T4: Criar o formatador de moeda ✅

**What**: Funções `formatBRL` e `formatParcel` em BRL completo, sem notação abreviada.
**Where**: `src/lib/currency.js`
**Depends on**: T3
**Reuses**: `Intl.NumberFormat("pt-BR")`
**Requirement**: MT07-09

**Done when**:

- [x] `formatBRL(48500)` retorna `R$ 48.500,00`
- [x] `formatParcel(48500, 24)` retorna o valor da parcela em BRL completo
- [x] `formatBRL(0)` retorna `R$ 0,00` e `formatBRL(1000000)` não usa notação compacta
- [x] Gate check passa: `npm test -- --run`
- [x] Test count: 5 testes passam

**Tests**: unit
**Gate**: quick

**Commit**: `feat(lib): add brl currency formatter`

---

### T5: Criar as máscaras de campo ✅

**What**: `maskCPF`, `maskPhone`, `maskCEP` e `maskCard`, preservando só dígitos e reaplicando o formato.
**Where**: `src/lib/masks.js`
**Depends on**: T4
**Reuses**: NONE
**Requirement**: MT07-08

**Done when**:

- [x] `maskCPF("12345678909")` retorna `123.456.789-09`
- [x] `maskPhone` cobre 10 e 11 dígitos
- [x] `maskCEP("30140071")` retorna `30140-071`
- [x] `maskCard("4429881200431197")` retorna grupos de quatro separados por espaço
- [x] Valor já formatado colado é normalizado para os mesmos dígitos (edge case da spec)
- [x] Gate check passa: `npm test -- --run`
- [x] Test count: 9 testes passam

**Tests**: unit
**Gate**: quick

**Commit**: `feat(lib): add brazilian input masks`

---

### T6: Criar os validadores de formulário ✅

**What**: `validateRequired`, `validateEmail`, `validateCPF` (dígitos verificadores) e `validateStep`, devolvendo as mensagens exatas da spec.
**Where**: `src/lib/validation.js`
**Depends on**: T5
**Reuses**: `src/lib/masks.js` para normalizar dígitos
**Requirement**: MT07-08

**Done when**:

- [x] E-mail sem domínio devolve `Informe um e-mail válido`
- [x] CPF com menos de 11 dígitos ou dígito verificador errado devolve `CPF inválido`
- [x] Campo obrigatório vazio devolve mensagem de erro
- [x] `validateStep` devolve objeto vazio quando todos os campos são válidos
- [x] Gate check passa: `npm test -- --run`
- [x] Test count: 10 testes passam

**Tests**: unit
**Gate**: quick

**Commit**: `feat(lib): add form validators with brazilian rules`

---

### T7: Criar o hook de estado do configurador ✅

**What**: `useConfigurator` com `useReducer` cobrindo passo, cor, opcionais, formulários e o total derivado.
**Where**: `src/hooks/useConfigurator.js`
**Depends on**: T6
**Reuses**: `src/data/catalog.js`, `src/lib/validation.js`
**Requirement**: MT07-05

**Done when**:

- [x] Total inicial é `BASE_PRICE + DELIVERY_PRICE` sem opcional marcado
- [x] Marcar e desmarcar opcional soma e subtrai exatamente o preço do catálogo
- [x] `previous` no passo 1 mantém o passo 1; `next` no passo 5 mantém o passo 5
- [x] Selecionar cor com `surcharge` soma o acréscimo ao total
- [x] Voltar do passo 5 ao 1 preserva cor e opcionais
- [x] `next` com campo inválido no passo atual não avança
- [x] Gate check passa: `npm test -- --run`
- [x] Test count: 12 testes passam

**Tests**: unit
**Gate**: quick

**Commit**: `feat(hooks): add configurator state machine`

---

### T7b: Separar subtotal de total e fechar as lacunas de validação ✅

**What**: Aplicar as decisões AD-008 a AD-013 sobre a fundação: subtotal da moto separado do total do pedido, submissão assíncrona por `status`, validação de telefone, CEP, cartão e validade, `STEP_FIELDS` no catálogo, elo `maskByType` e `formatBRL` devolvendo `—` sem dado.
**Where**: `src/data/catalog.js`, `src/lib/{currency,masks,validation}.js`, `src/hooks/useConfigurator.js`
**Depends on**: T7
**Reuses**: Módulos da fase 1
**Requirement**: MT07-05, MT07-06, MT07-08, MT07-09

**Done when**:

- [x] Hook expõe `subtotal` (base + cor + opcionais), `total` (subtotal + entrega) e `parcel` (subtotal ÷ 24)
- [x] `status` idle → submitting → confirmed; editar campo volta a idle
- [x] `Telefone incompleto`, `CEP incompleto`, `Número do cartão incompleto` e `Validade inválida` implementadas
- [x] `STEP_FIELDS` e `FIELD_TYPES` vivem em `data/catalog.js`; `validation.js` só com funções puras
- [x] `maskByType` e `maskExpiration` disponíveis para T18–T20
- [x] `formatBRL` de valor não finito devolve `—`
- [x] Edge case do `spec.md` corrigido e AD-008 a AD-013 registradas no `STATE.md`
- [x] Gate check passa: `npm test -- --run`
- [x] Test count: 51 testes passam na suíte (era 42)

**Tests**: unit
**Gate**: quick

**Commit**: `fix(configurator): split subtotal from total and close validation gaps`

---

### T8: Criar o botão da interface

**What**: Componente `Button` com variantes sólida e fantasma, foco visível e estado desabilitado.
**Where**: `src/components/ui/Button.jsx`
**Depends on**: None (fase 1 concluída)
**Reuses**: Tokens de `src/styles/index.css`
**Requirement**: MT07-01

**Done when**:

- [ ] Variantes `solid` e `ghost` sem literal hexadecimal no arquivo
- [ ] `:focus-visible` com contorno visível
- [ ] Gate check passa: `npm run lint && npm test -- --run && npm run build`

**Tests**: none
**Gate**: build

**Commit**: `feat(ui): add button component`

---

### T9: Criar o wrapper de revelação

**What**: Componente `Reveal` com `whileInView`, respeitando movimento reduzido e mantendo o conteúdo legível sem JS.
**Where**: `src/components/ui/Reveal.jsx`
**Depends on**: T8
**Reuses**: `motion/react`
**Requirement**: MT07-10

**Done when**:

- [ ] Deslocamento máximo de 24px e `viewport={{ once: true }}`
- [ ] Sob `prefers-reduced-motion` o conteúdo aparece em estado final
- [ ] Gate check passa: `npm run lint && npm test -- --run && npm run build`

**Tests**: none
**Gate**: build

**Commit**: `feat(ui): add reveal motion wrapper`

---

### T10: Redesenhar o cabeçalho

**What**: `Header` com navegação por âncora e menu mobile controlado por estado do React.
**Where**: `src/components/layout/Header.jsx`
**Depends on**: T9
**Reuses**: `src/components/ui/Button.jsx`
**Requirement**: MT07-11

**Done when**:

- [ ] Menu abre e fecha por estado, sem `document.querySelector` nem `classList.toggle`
- [ ] Botão do menu com `aria-expanded` refletindo o estado
- [ ] Gate check passa: `npm test -- --run`
- [ ] Test count: 4 testes passam

**Tests**: unit
**Gate**: quick

**Commit**: `feat(layout): redesign header with react-controlled menu`

---

### T11: Redesenhar o hero

**What**: `Hero` com nome, subtítulo, três números de desempenho, preço inicial e botão que abre o configurador.
**Where**: `src/components/landing/Hero.jsx`
**Depends on**: T10
**Reuses**: `src/data/catalog.js`, `src/lib/currency.js`, `Button`
**Requirement**: MT07-02

**Done when**:

- [ ] Nome, subtítulo, os três números e o preço em BRL completo estão no DOM na carga
- [ ] Acionar o botão principal dispara `onOpenConfigurator`
- [ ] Gate check passa: `npm test -- --run`
- [ ] Test count: 5 testes passam

**Tests**: unit
**Gate**: quick

**Commit**: `feat(landing): redesign hero section`

---

### T12: Redesenhar a ficha técnica

**What**: `SpecSheet` renderizando as especificações do catálogo com barra proporcional ao `ratio`.
**Where**: `src/components/landing/SpecSheet.jsx`
**Depends on**: T11
**Reuses**: `src/data/catalog.js`, `Reveal`
**Requirement**: MT07-03

**Done when**:

- [ ] Uma linha por item de `SPECS`, com nome, valor, unidade e barra
- [ ] Largura da barra derivada do `ratio` do catálogo, não de valor fixo no componente
- [ ] Gate check passa: `npm run lint && npm test -- --run && npm run build`

**Tests**: none
**Gate**: build

**Commit**: `feat(landing): redesign spec sheet with proportional bars`

---

### T13: Redesenhar a galeria

**What**: `Gallery` em trilho horizontal com scroll snap e legenda técnica por imagem.
**Where**: `src/components/landing/Gallery.jsx`
**Depends on**: T12
**Reuses**: `src/data/catalog.js`
**Requirement**: MT07-04

**Done when**:

- [ ] Trilho com `snap-x`/`snap-start` e rolagem horizontal contida no próprio container
- [ ] Cada figura com `aspect-ratio` fixo e `alt` descritivo
- [ ] Gate check passa: `npm run lint && npm test -- --run && npm run build`

**Tests**: none
**Gate**: build

**Commit**: `feat(landing): redesign gallery as snap track`

---

### T14: Redesenhar o rodapé

**What**: `Footer` com colunas de links, redes e o crédito de autoria.
**Where**: `src/components/layout/Footer.jsx`
**Depends on**: T13
**Reuses**: Tokens do tema
**Requirement**: MT07-12

**Done when**:

- [ ] Crédito de autoria e aviso de uso não comercial presentes
- [ ] Links de rede com `rel="noreferrer"` quando abrem em nova aba
- [ ] Gate check passa: `npm run lint && npm test -- --run && npm run build`

**Tests**: none
**Gate**: build

**Commit**: `feat(layout): redesign footer`

---

### T15: Criar o indicador de passos

**What**: `Stepper` único, com `role="tablist"`, substituindo os cinco blocos duplicados do pop-up antigo.
**Where**: `src/components/configurator/Stepper.jsx`
**Depends on**: None (fase 2 concluída)
**Reuses**: `src/data/catalog.js` (rótulos dos passos)
**Requirement**: MT07-05

**Done when**:

- [ ] Cinco passos renderizados a partir de uma lista, sem repetição de bloco
- [ ] `aria-selected` verdadeiro apenas no passo atual
- [ ] Acionar um passo chama `onSelect` com o índice daquele passo
- [ ] Gate check passa: `npm test -- --run`
- [ ] Test count: 5 testes passam

**Tests**: unit
**Gate**: quick

**Commit**: `feat(configurator): add single stepper component`

---

### T16: Criar o passo de cor

**What**: `ColorStep` com troca de imagem em crossfade e marcação da cor selecionada.
**Where**: `src/components/configurator/steps/ColorStep.jsx`
**Depends on**: T15
**Reuses**: `src/data/catalog.js`
**Requirement**: MT07-05

**Done when**:

- [ ] Selecionar cor troca a imagem exibida e marca `aria-pressed` naquela cor
- [ ] Cor com acréscimo exibe o valor em BRL completo
- [ ] Gate check passa: `npm test -- --run`
- [ ] Test count: 4 testes passam

**Tests**: unit
**Gate**: quick

**Commit**: `feat(configurator): add color step`

---

### T17: Criar o passo de opcionais

**What**: `OptionsStep` com marcação de opcionais e o kit de personalização.
**Where**: `src/components/configurator/steps/OptionsStep.jsx`
**Depends on**: T16
**Reuses**: `src/data/catalog.js`, `src/lib/currency.js`
**Requirement**: MT07-06

**Done when**:

- [ ] Marcar e desmarcar um opcional chama `onToggle` com o id correspondente
- [ ] Cada opcional exibe preço em BRL completo
- [ ] Opcional marcado tem estado visual e `aria-pressed` verdadeiro
- [ ] Gate check passa: `npm test -- --run`
- [ ] Test count: 5 testes passam

**Tests**: unit
**Gate**: quick

**Commit**: `feat(configurator): add options step`

---

### T18: Criar o passo de dados pessoais

**What**: `PersonalStep` com campos controlados, máscaras, contador de caracteres e erro por campo.
**Where**: `src/components/configurator/steps/PersonalStep.jsx`
**Depends on**: T17
**Reuses**: `src/lib/masks.js`, `src/lib/validation.js`
**Requirement**: MT07-08

**Done when**:

- [ ] Sair de campo obrigatório vazio exibe a mensagem de erro naquele campo
- [ ] E-mail inválido exibe `Informe um e-mail válido`
- [ ] CPF inválido exibe `CPF inválido`
- [ ] Campo com limite exibe contador de caracteres
- [ ] Rótulos sem ícone decorativo
- [ ] Gate check passa: `npm test -- --run`
- [ ] Test count: 7 testes passam

**Tests**: unit
**Gate**: quick

**Commit**: `feat(configurator): add personal data step`

---

### T19: Criar o passo de entrega

**What**: `DeliveryStep` com CEP mascarado e campos de endereço controlados.
**Where**: `src/components/configurator/steps/DeliveryStep.jsx`
**Depends on**: T18
**Reuses**: `src/lib/masks.js`, `src/lib/validation.js`
**Requirement**: MT07-08

**Done when**:

- [ ] CEP recebe máscara `00000-000` ao digitar
- [ ] Campo obrigatório vazio exibe erro ao sair do campo
- [ ] Gate check passa: `npm test -- --run`
- [ ] Test count: 4 testes passam

**Tests**: unit
**Gate**: quick

**Commit**: `feat(configurator): add delivery step`

---

### T20: Criar o passo de pagamento

**What**: `PaymentStep` com resumo do pedido e cartão espelhando o formulário.
**Where**: `src/components/configurator/steps/PaymentStep.jsx`
**Depends on**: T19
**Reuses**: `src/lib/currency.js`, `src/lib/masks.js`
**Requirement**: MT07-09

**Done when**:

- [ ] Resumo lista moto com a cor escolhida, entrega e cada opcional selecionado com preço
- [ ] Digitar o número do cartão reflete os dígitos agrupados de quatro em quatro no cartão exibido
- [ ] Digitar o titular reflete o nome em caixa alta no cartão exibido
- [ ] Finalizar com formulário válido exibe carregamento e depois a confirmação
- [ ] Finalizar com campo inválido mantém o passo e aponta o erro
- [ ] Gate check passa: `npm test -- --run`
- [ ] Test count: 8 testes passam

**Tests**: unit
**Gate**: quick

**Commit**: `feat(configurator): add payment step`

---

### T21: Montar o shell do configurador

**What**: `Configurator` reunindo stepper, painéis, navegação e preço, com transição entre passos.
**Where**: `src/components/configurator/Configurator.jsx`
**Depends on**: T20
**Reuses**: `src/hooks/useConfigurator.js`, `Stepper`, `steps/*`
**Requirement**: MT07-05

**Done when**:

- [ ] Painel exibido corresponde ao passo selecionado no stepper
- [ ] Botão "anterior" desabilitado no passo 1; "próximo" desabilitado no passo 5
- [ ] Preço e parcela do cabeçalho refletem o total do hook
- [ ] Fechar e reabrir preserva cor e opcionais escolhidos
- [ ] Gate check passa: `npm test -- --run`
- [ ] Test count: 8 testes passam

**Tests**: unit
**Gate**: full

**Commit**: `feat(configurator): assemble configurator shell`

---

### T22: Compor a página

**What**: `Home` montando cabeçalho, hero, ficha, galeria, rodapé e o configurador em modal.
**Where**: `src/Pages/Home/index.jsx`
**Depends on**: None (fase 3 concluída)
**Reuses**: Todos os componentes das fases 2 e 3
**Requirement**: MT07-02

**Done when**:

- [ ] Acionar o botão do hero abre o configurador no passo 1
- [ ] Fechar o configurador devolve o foco ao botão que o abriu
- [ ] Âncora do cabeçalho aponta para a seção correspondente
- [ ] Gate check passa: `npm test -- --run`
- [ ] Test count: 5 testes passam

**Tests**: unit
**Gate**: full

**Commit**: `feat(home): compose redesigned landing page`

---

### T23: Remover as dependências mortas

**What**: Desinstalar `bootstrap`, `react-spinners`, `styled-components`, `gsap` e `react-imask` e apagar os `styles.js` e componentes antigos que ficaram órfãos.
**Where**: `package.json`
**Depends on**: T22
**Reuses**: NONE
**Requirement**: MT07-11

**Done when**:

- [ ] Nenhuma das cinco dependências consta em `package.json` (`react-imask` fica órfão quando o Checkout legado sai)
- [ ] `grep -r "styled-components\|gsap\|bootstrap\|react-imask" src` não retorna nada
- [ ] Nenhum arquivo `styles.js` resta em `src`
- [ ] Gate check passa: `npm run lint && npm test -- --run && npm run build`

**Tests**: none
**Gate**: build

**Commit**: `refactor(deps): drop styled-components, gsap, bootstrap and react-spinners`

---

### T24: Ajustar a raiz da aplicação

**What**: `main.jsx` com `MotionConfig reducedMotion="user"` e importação do tema, sem o bundle do bootstrap.
**Where**: `src/main.jsx`
**Depends on**: T23
**Reuses**: `src/styles/index.css`
**Requirement**: MT07-10

**Done when**:

- [ ] `MotionConfig reducedMotion="user"` envolvendo a árvore
- [ ] Tema importado uma única vez, na raiz
- [ ] Gate check passa: `npm run lint && npm test -- --run && npm run build`

**Tests**: none
**Gate**: build

**Commit**: `refactor(app): wire motion config and theme at the root`

---

### T25: Atualizar o README

**What**: Reescrever o README com a stack nova, como rodar os testes e as capturas do redesenho.
**Where**: `README.md`
**Depends on**: T24
**Reuses**: NONE
**Requirement**: MT07-11

**Done when**:

- [ ] Stack descrita corresponde ao `package.json` final
- [ ] Comando de teste documentado
- [ ] Gate check passa: `npm run lint && npm test -- --run && npm run build`

**Tests**: none
**Gate**: build

**Commit**: `docs(readme): update stack and test instructions`

---

## Phase Execution Map

```
Phase 1 → Phase 2 → Phase 3 → Phase 4

Phase 1:  T1 → T2 → T3 → T4 → T5 → T6 → T7 → T7b
Phase 2:  T8 → T9 → T10 → T11 → T12 → T13 → T14
Phase 3:  T15 → T16 → T17 → T18 → T19 → T20 → T21
Phase 4:  T22 → T23 → T24 → T25
```

---

## Task Granularity Check

| Task | Scope | Status |
| ---- | ----- | ------ |
| T1 | 1 arquivo de tema | ✅ Granular |
| T2 | 1 config | ✅ Granular |
| T3–T7 | 1 módulo cada | ✅ Granular |
| T7b | correção transversal da fase 1 (AD-008..013) | ✅ Granular |
| T8–T14 | 1 componente cada | ✅ Granular |
| T15–T21 | 1 componente cada | ✅ Granular |
| T22–T25 | 1 arquivo cada | ✅ Granular |

## Diagram-Definition Cross-Check

| Task | Depends On (body) | Diagram Shows | Status |
| ---- | ----------------- | ------------- | ------ |
| T1 | None | — | ✅ Match |
| T2 | T1 | T1 → T2 | ✅ Match |
| T3 | T2 | T2 → T3 | ✅ Match |
| T4 | T3 | T3 → T4 | ✅ Match |
| T5 | T4 | T4 → T5 | ✅ Match |
| T6 | T5 | T5 → T6 | ✅ Match |
| T7 | T6 | T6 → T7 | ✅ Match |
| T7b | T7 | T7 → T7b | ✅ Match |
| T8 | None (fase 1 concluída) | — | ✅ Match |
| T9 | T8 | T8 → T9 | ✅ Match |
| T10 | T9 | T9 → T10 | ✅ Match |
| T11 | T10 | T10 → T11 | ✅ Match |
| T12 | T11 | T11 → T12 | ✅ Match |
| T13 | T12 | T12 → T13 | ✅ Match |
| T14 | T13 | T13 → T14 | ✅ Match |
| T15 | None (fase 2 concluída) | — | ✅ Match |
| T16 | T15 | T15 → T16 | ✅ Match |
| T17 | T16 | T16 → T17 | ✅ Match |
| T18 | T17 | T17 → T18 | ✅ Match |
| T19 | T18 | T18 → T19 | ✅ Match |
| T20 | T19 | T19 → T20 | ✅ Match |
| T21 | T20 | T20 → T21 | ✅ Match |
| T22 | None (fase 3 concluída) | — | ✅ Match |
| T23 | T22 | T22 → T23 | ✅ Match |
| T24 | T23 | T23 → T24 | ✅ Match |
| T25 | T24 | T24 → T25 | ✅ Match |

## Test Co-location Validation

| Task | Code Layer | Matrix Requires | Task Says | Status |
| ---- | ---------- | --------------- | --------- | ------ |
| T1 | Config/estilo | none | none | ✅ OK |
| T2 | Config | none | none | ✅ OK |
| T3 | Dados | unit | unit | ✅ OK |
| T4 | Lógica pura | unit | unit | ✅ OK |
| T5 | Lógica pura | unit | unit | ✅ OK |
| T6 | Lógica pura | unit | unit | ✅ OK |
| T7 | Hook de estado | unit | unit | ✅ OK |
| T7b | Dados + lógica pura + hook | unit | unit | ✅ OK |
| T8 | Apresentação | none | none | ✅ OK |
| T9 | Apresentação | none | none | ✅ OK |
| T10 | Componente com estado | unit | unit | ✅ OK |
| T11 | Componente com interação | unit | unit | ✅ OK |
| T12 | Apresentação | none | none | ✅ OK |
| T13 | Apresentação | none | none | ✅ OK |
| T14 | Apresentação | none | none | ✅ OK |
| T15 | Componente com interação | unit | unit | ✅ OK |
| T16 | Componente com interação | unit | unit | ✅ OK |
| T17 | Componente com interação | unit | unit | ✅ OK |
| T18 | Componente com estado | unit | unit | ✅ OK |
| T19 | Componente com estado | unit | unit | ✅ OK |
| T20 | Componente com estado | unit | unit | ✅ OK |
| T21 | Componente com estado | unit | unit | ✅ OK |
| T22 | Componente com estado | unit | unit | ✅ OK |
| T23 | Config | none | none | ✅ OK |
| T24 | Config | none | none | ✅ OK |
| T25 | Documentação | none | none | ✅ OK |
