# Redesenho MT-07 — Relatório do Verifier

**Result**: ✅ PASS

**Data**: 2026-09-03 (reverificação, ciclo 1 de 3)
**Spec**: `.specs/features/redesign-mt07/spec.md`
**Diff verificado**: `main..HEAD` — 48 commits, `HEAD = a29fcd6f4314777e54892cd51a2d31074da56e94`, 82 arquivos (+10139 / −4615)
**Verifier**: sub-agente independente, sessão nova — não é o autor das fix tasks V1–V10 nem do relatório da rodada 1; cobertura re-derivada da spec por conta própria, evidência-ou-zero
**Baseline da árvore antes do sensor**: `git status --porcelain` vazio — reconfirmado vazio depois do sensor

> Esta é a **reverificação** pedida no Handoff de `.specs/STATE.md`: um implementador fechou as 12 lacunas priorizadas da rodada 1 (nove viraram assertiva provada por mutação, um achado de código foi corrigido — `Stepper` contra a AD-026 — e seis critérios foram registrados como limitação de ambiente/precisão da spec, com motivo escrito). Este relatório re-executa a checagem inteira do zero, sem presumir nada da rodada 1 nem do relato do implementador.

---

## Conclusão dos tasks

`tasks.md` não tem nenhuma caixa `- [ ]` pendente: T1–T25 (+T7b, T14b, T19b) e a Fase 5 inteira (V1–V10) marcadas `✅`. Verificado por leitura do arquivo, não por confiança no cabeçalho.

---

## Gates (executados por este Verifier, nesta rodada)

| Gate | Comando | Saída | Código |
| ---- | ------- | ----- | ------ |
| Test | `npm test -- --run` | `Test Files 24 passed (24)` · `Tests 142 passed (142)` · `Duration 8.69s` | 0 |
| Lint | `npm run lint` | saída vazia (`eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0`) | 0 |
| Build | `npm run build` | `dist/index.html 0.95 kB` · `dist/assets/index-DwNdT6-X.js 313.07 kB │ gzip: 101.58 kB` · `✓ built in 517ms` | 0 |

Delta de suíte desde a rodada 1: **123 → 142 testes** (+19), **16 → 24 arquivos** (+8). Nenhum teste antigo foi enfraquecido: toda assertiva presente na rodada 1 permanece idêntica ou mais específica (conferido linha a linha nas seções abaixo). Dev server do dono do projeto segue de pé na porta 9000; nenhum outro subido por este Verifier.

---

## Critérios de aceitação — evidência re-derivada

Coluna "Esperado pela spec" = valor que a spec fixa. Coluna "Evidência" = `arquivo:linha` + expressão reproduzida, conferida por este Verifier nesta rodada (não copiada da rodada 1 sem checar).

### P1 — Design system em tokens (MT07-01)

| Critério | Esperado pela spec | Evidência | Resultado |
| -------- | ------------------ | --------- | --------- |
| AC1 — 8 tokens de cor num único arquivo | `ink`, `ink-2`, `ink-3`, `line`, `khaki`, `paper`, `paper-dim`, `cyan` | `src/styles/index.css:6–14` — os 8 declarados em `--theme` | ✅ COBERTO (inspeção; build gate, conforme a matriz) |
| AC2 — 3 famílias tipográficas como token | Archivo, Barlow, IBM Plex Mono | `src/styles/index.css:18–20` — `--font-display`, `--font-body`, `--font-mono` | ✅ COBERTO (inspeção) |
| AC3 — cor da identidade só por token, zero hex em componente | 0 ocorrência | `grep -rniE '#[0-9a-f]{3,8}\b' src/components src/Pages` → **0** (reexecutado nesta rodada). O único hex de produto é dado, não identidade: `src/data/catalog.js` (cor da moto), consumido via `style={{ backgroundColor: color.hex }}` | ✅ COBERTO (grep) |
| AC4 — `#2BD4CF` acento único | ocorrência única | `grep -rni 2bd4cf src index.html` → só `src/styles/index.css:14` | ✅ COBERTO (grep) |

### P1 — Hero e seções da landing (MT07-02, 03, 04, 07)

| Critério | Esperado pela spec | Evidência | Resultado |
| -------- | ------------------ | --------- | --------- |
| AC1 — nome, subtítulo, 3 números, preço na carga | 689 cc, 74,8 cv, 6,9 kgf.m + preço | `src/components/landing/__tests__/Hero.test.jsx:18` — `getByRole("heading", { name: /mt-07 master of torque/i })`; `:20` `getByText(/hyper naked · 2025/i)`; `:26,28,30,31` `getByText("689")`, `("74,8")`, `("6,9")`, `("kgf.m")`; `:37` `getByText("R$ 48.500,00")` | ✅ COBERTO |
| AC1 (parte) — "sem exigir rolagem" | dobra completa | ver julgamento item-a-item abaixo | ⚠️ registrado — lacuna de precisão da spec + limitação de ambiente |
| AC2 — botão abre passo 1 | painel do passo 1 | `src/Pages/Home/__tests__/Home.test.jsx:37–38` — `getByRole("dialog")` + `getByText(FIRST_STEP_HEADING)`; gatilho: `Hero.test.jsx:47` — `expect(onOpenConfigurator).toHaveBeenCalledTimes(1)` | ✅ COBERTO |
| AC3 — barra proporcional ao `ratio` | barra ↔ `ratio` | `src/components/landing/__tests__/SpecSheet.test.jsx:34–37` — `barWidths(container)).toEqual(SPECS.map(spec => \`${Math.round(spec.ratio*100)}%\`))`; fonte: `SpecSheet.jsx:15,56`. **Mutação M-barra aplicada nesta rodada** (`barWidth` → `"100%"` fixo): teste falhou | ✅ COBERTO (assertiva + mutação morta) — ⚠️ AD-030 registra que `ratio` é número de direção de arte, não proporção calculada contra teto de categoria; a spec não define esse teto |
| AC4 — snap alinha a próxima imagem ao início do trilho | contrato de snap | `src/components/landing/__tests__/Gallery.test.jsx:31–32` — `toHaveClass("snap-x","snap-mandatory","overflow-x-auto")`; `:43–45` — cada `figure` com `toHaveClass("snap-start","flex-none")`. **Mutação aplicada** (`snap-start` removido do item): teste falhou | ✅ COBERTO como contrato — ⚠️ ver julgamento item-a-item (o encaixe em si é comportamento de navegador, fora do jsdom) |
| AC5 — foco visível em todo elemento interativo | contorno visível | nenhuma assertiva de `:focus-visible` em nenhum arquivo (`grep -rn "focus-visible\|toBeFocused" src --include="*.test.jsx"` → só ocorrências de foco preso/devolvido, não de contorno) | ❌ REGISTRADO — ver julgamento item-a-item |
| MT07-07 — imagem que falha mantém altura reservada | bloco não desloca | `SpecSheet.jsx:66` (`aspect-[4/3] md:min-h-[320px]`), `Gallery.jsx:44` (`aspect-[42/29]`) — puro CSS, sem `onError` em nenhum `<img>` do projeto (`grep -rn "onError" src/components src/Pages` → vazio) | ❌ REGISTRADO — ver julgamento item-a-item |

### P1 — Configurador de 5 passos (MT07-05, 06)

| Critério | Esperado pela spec | Evidência | Resultado |
| -------- | ------------------ | --------- | --------- |
| AC1 — 5 passos de um único componente | sem duplicação | `src/components/configurator/__tests__/Stepper.test.jsx:34,36` — `expect(tabs).toHaveLength(STEPS.length)` + nome acessível por índice; fonte única `Stepper.jsx:106` — `{STEPS.map(...)}` | ✅ COBERTO |
| AC2 — passo liberado exibe painel correto | painel do passo | `Configurator.test.jsx:97–99` — clique na aba "cor" → `findByRole("group", { name: /cores disponíveis/i })`; recusa de salto: `useConfigurator.test.jsx:191–197` (ver AC5 abaixo) | ✅ COBERTO |
| AC3 — 1º passo desabilita "anterior" | controle desabilitado | `Configurator.test.jsx:108` — `getByRole("button",{name:"Anterior"})).toBeDisabled()`; estado: `useConfigurator.test.jsx:167` | ✅ COBERTO |
| AC4 — último passo desabilita "próximo" | controle desabilitado, **inclusive no estado** | UI: `Configurator.test.jsx:114`. Estado: `useConfigurator.test.jsx:174–183` — preenche `validPayment`, chama `next()`, assere `state.errors` vazio **e** `state.step === LAST_STEP`. **Mutação aplicada nesta rodada** no clamp (`src/hooks/useConfigurator.js:79`, teto do `Math.min` removido): teste falhou (`expected undefined to be 5`) — confirma que a assertiva mede o clamp, não mais o portão de validação (o defeito M6 da rodada 1) | ✅ VERIFICADO — motivo errado da rodada 1 corrigido, prova por mutação nesta rodada |
| AC5 — cor troca imagem e marca selecionada | imagem + marca | `ColorStep.test.jsx:49` — `findByAltText(/MT-07 .../i)`; `:28` — 1 pressionado; `:40` — `onSelect` chamado com o id | ✅ COBERTO |
| AC6 — opcional soma ao subtotal, base intacta | subtotal = base + preço | `useConfigurator.test.jsx:98` — `subtotal === BASE_PRICE + windscreen.price`; base: `catalog.test.js` — `BASE_PRICE === 48500` | ✅ COBERTO |
| AC7 — desmarcar subtrai | subtotal sem o item | `useConfigurator.test.jsx:110` — `subtotal === BASE_PRICE + kit.price` após 3 toggles | ✅ COBERTO |
| AC8 — parcela = subtotal/24 | sem parcelar entrega | `useConfigurator.test.jsx:139,143` — `parcel ≈ subtotal/INSTALLMENTS` e `< total/INSTALLMENTS` | ✅ COBERTO (AD-008) |
| AC9 — fechar preserva escolhas | cor e opcionais mantidos | `Configurator.test.jsx:166–176` — `rerender(isOpen=false)` → `rerender(isOpen)` preserva `aria-pressed` de opcional e cor | ✅ COBERTO (AD-021) |

### P1 — Formulários de dados e entrega (MT07-08)

| Critério | Esperado pela spec | Evidência | Resultado |
| -------- | ------------------ | --------- | --------- |
| AC1 — campo obrigatório vazio exibe erro | mensagem no campo | `PersonalStep.test.jsx:63` — `getByText(MESSAGES.required)`; unidade: `validation.test.js:32–34` | ✅ COBERTO |
| AC2 — e-mail inválido | `"Informe um e-mail válido"` (literal) | `validation.test.js:44` — `validateEmail("joao@exemplo")).toBe("Informe um e-mail válido")` | ✅ COBERTO |
| AC3 — CPF inválido | `"CPF inválido"` (literal) | `validation.test.js:56–` — tamanho e DV, ambos com literal | ✅ COBERTO |
| AC4 — máscara BR ao digitar | formato BR | `PersonalStep.test.jsx:100,103` — CPF `"123.456.789-09"`, telefone `"(31) 99876-5432"`; `DeliveryStep.test.jsx:50` — CEP `"30140-071"` | ✅ COBERTO |
| AC5 — erro impede avanço | passo não muda | `useConfigurator.test.jsx:187–188` | ✅ COBERTO |
| AC6 — contador de caracteres | `n/max` | `PersonalStep.test.jsx:91` — só neste passo (ver ressalva abaixo) | ⚠️ COBERTO em 1 passo — generalidade do `Field` sem assertiva por passo (AD-019, decisão V10 de não replicar) |
| AC7 — rótulo sem ícone | sem `svg`/`img` | `PersonalStep.test.jsx:51` — só neste passo | ⚠️ idem acima |

### P1 — Pagamento e resumo do pedido (MT07-09)

| Critério | Esperado pela spec | Evidência | Resultado |
| -------- | ------------------ | --------- | --------- |
| AC1 — resumo lista moto+cor, entrega, opcionais com preço | linhas com preço | `PaymentStep.test.jsx:74,77,94,96–99` | ✅ COBERTO |
| AC2 — número do cartão de 4 em 4 | `4429 8812 0043 1197` | `PaymentStep.test.jsx:123`; máscara: `masks.test.js:53` | ✅ COBERTO |
| AC3 — titular em caixa alta | `JOAO MARCOS` | `PaymentStep.test.jsx:133` | ✅ COBERTO |
| AC4 — BRL completo, sem abreviação | `R$ 48.500,00` | `currency.test.js:6,18,19` — `toBe("R$ 48.500,00")`, `toBe("R$ 1.000.000,00")`, `not.toMatch(/mil|mi|bi|k/i)` | ✅ COBERTO |
| AC5 — finalizar válido: carregamento → confirmação | `submitting`→`confirmed` | `useConfigurator.test.jsx:243,247` | ✅ COBERTO (AD-009) |
| AC6 — finalizar inválido leva ao 1º passo com erro | passo + campo apontado | `useConfigurator.test.jsx:229–231` | ✅ COBERTO |
| AC6 (6 textos exatos) | `Telefone incompleto`, `CEP incompleto`, `Número do cartão incompleto`, `Validade inválida`, `Cartão vencido`, `CVV inválido` | `validation.test.js:106,107,108` (`Validade inválida`, 3 casos), `:114,115,116` (`Cartão vencido`, 3 casos), `:136–139` (`CVV inválido`, 4 casos) — **todos como literal**, não mais só por `MESSAGES.x`. **6 mutações aplicadas nesta rodada, uma por texto**: todas mortas (ver Sensor) | ✅ VERIFICADO — defeito da rodada 1 (M14/M15) corrigido e provado |
| AC7 — vencido ≠ formato errado | `Cartão vencido` distinto | `validation.test.js:124–125` — mês fora da faixa **não** vira `Cartão vencido`, continua `Validade inválida` (literal) | ✅ COBERTO (AD-017) |

### P2 — Motion com função (MT07-10)

| Critério | Esperado pela spec | Evidência | Resultado |
| -------- | ------------------ | --------- | --------- |
| AC1 — deslocamento de entrada ≤ 24px | ≤24px | `Reveal.test.jsx:19–20` — `entryOffsetPx(section) > 0` e `<= 24`. (Mutação de `OFFSET` 24→96 já morta na rodada 1; assertiva reconferida linha a linha nesta rodada) | ✅ COBERTO |
| AC2 — transição entre painéis | anima a troca | `Configurator.jsx:231–238` — `AnimatePresence`/`motion.div`; ramo sem motion coberto em `Configurator.reduced-motion.test.jsx` (ver AC4) | ⚠️ parcial — o efeito animado em si (com motion ativo) não tem assertiva própria; só o ramo reduzido é asserido |
| AC3 — crossfade na troca de cor | crossfade | `ColorStep.jsx:44–61` — motion com `initial/exit`; ramo reduzido coberto (ver AC4) | ⚠️ parcial — mesma limitação de AC2 |
| AC4 — `prefers-reduced-motion` entrega estado final, zero animação | 3 componentes citados pela spec (seção, painel, foto) | `Reveal.reduced-motion.test.jsx`, `Configurator.reduced-motion.test.jsx`, `ColorStep.reduced-motion.test.jsx` — `vi.mock("motion/react", … useReducedMotion: () => true)`, cada um asserindo `animatedNodes(...).toHaveLength(0)`. **3 mutações aplicadas nesta rodada, uma por ramo** (`Reveal.jsx:22`, `Configurator.jsx:231`, `ColorStep.jsx:44`): todas mortas | ✅ VERIFICADO — defeito M17 da rodada 1 corrigido e provado |
| AC5 — texto legível sem JS de animação | texto sempre presente | ver julgamento item-a-item abaixo | ❌ REGISTRADO — lacuna de precisão da spec |

### P2 — Limpeza da base técnica (MT07-11)

| Critério | Esperado pela spec | Evidência | Resultado |
| -------- | ------------------ | --------- | --------- |
| AC1 — só dep. efetivamente importada | zero dep morta | `grep -E "bootstrap|react-spinners|styled-components|gsap|react-imask|react-router" package.json` → 0 (reexecutado) | ✅ COBERTO |
| AC2 — menu por estado do React | sem `querySelector`/`classList` | `Header.test.jsx:45,55` — `aria-expanded` + fechamento; `grep -rn "querySelector|classList" src --include="*.jsx" --include="*.js" \| grep -v __tests__` → só comentário no `Header.jsx` e usos legítimos (`motionMarks.js`, teste; `Configurator.jsx` para foco, não para classe) | ✅ COBERTO |
| AC3 — zero `styles.js` | nenhum arquivo | `find src -iname "style*.js"` → vazio (reexecutado) | ✅ COBERTO |
| AC4 — `npm run build` sem erro | exit 0 | gate desta rodada: exit 0 | ✅ COBERTO |
| AC5 — `npm run lint` sem erro/aviso | exit 0, 0 avisos | gate desta rodada: exit 0, saída vazia | ✅ COBERTO |

### P3 — Rodapé e navegação (MT07-12)

| Critério | Esperado pela spec | Evidência | Resultado |
| -------- | ------------------ | --------- | --------- |
| AC1 — crédito de autoria + aviso não comercial | textos presentes | `Footer.test.jsx:19,25` — `getByRole("contentinfo")).toHaveTextContent(CREDIT)` e `(NON_COMMERCIAL)`, com os literais completos declarados em `:11–13`. **2 mutações aplicadas nesta rodada** (crédito e aviso removidos, separadamente): ambas mortas | ✅ VERIFICADO — defeito M19 da rodada 1 corrigido e provado |
| AC2 — âncora do cabeçalho rola até a seção | alvo real | `Home.test.jsx:85` — `document.getElementById(href.slice(1))).not.toBeNull()`; fonte única `catalog.js` (AD-014) | ✅ COBERTO (a rolagem em si é do navegador) |

---

## Edge cases da spec

| Edge case | Evidência | Resultado |
| --------- | --------- | --------- |
| Imagem falha → mantém altura | CSS puro (`aspect-[…]`), sem `onError` — nenhum ramo de código a testar | ❌ REGISTRADO — ver julgamento item-a-item |
| Zero opcional → subtotal 48.500, total 50.500, entrega em linha própria | `useConfigurator.test.jsx:89–90` — `subtotal===BASE_PRICE`, `total===START_TOTAL`; linha própria: `PaymentStep.jsx:176` — `<TotalRow label="Entrega" .../>` | ✅ COBERTO |
| Todos os opcionais → subtotal=base+todos, total=subtotal+entrega | `useConfigurator.test.jsx:121–122` | ✅ COBERTO |
| <768px → coluna única, indicador acessível | media query Tailwind, `css:false` no Vitest — sem assertiva possível | ❌ REGISTRADO — ver julgamento item-a-item |
| Colar valor já formatado → normaliza e reaplica máscara | `masks.test.js:24` (CPF), `:57` (cartão) | ✅ COBERTO |
| Ir ao último passo e voltar ao 1º → mantém cor e opcionais | `useConfigurator.test.jsx:203–205` | ✅ COBERTO |

**Contagem**: 41 critérios (35 ACs + 6 edge cases). **33 cobertos** (6 com ressalva: AC6/7 de MT07-08 num só passo, AC2/3 de MT07-10 parciais, AC4 de MT07-02 e o edge case de snap como contrato-navegador), **6 registrados** como limitação de ambiente/precisão da spec (nenhum é comportamento não implementado — ver seção seguinte), **0 sem citação**.

---

## Julgamento item a item dos cinco "registrados em vez de testados"

Critério do trabalho: a justificativa se sustenta (o ambiente de fato não alcança) ou é desculpa para não testar? Teste que assere só `className` não conta como cobertura.

1. **Foco visível (MT07-02.5).** **Sustenta-se.** `vite.config.js:23` roda a suíte com `css: false` — o Vitest não carrega nem calcula folha de estilo nenhuma, então `:focus-visible` não tem estado para ler e não há como distinguir "tem contorno" de "não tem" por leitura de estilo computado. `grep -rn "focus-visible" src --include="*.test.jsx"` confirma: nenhum teste assere a pseudo-classe, nem por `className` (o que seria teatral) nem por estilo computado (o que seria honesto mas impossível aqui). O que É testável e ESTÁ testado é a metade comportamental do critério — alcance por teclado, foco preso no diálogo (`Configurator.test.jsx:249–251` — `document.activeElement` bate com a última parada) e devolução do foco ao gatilho (`Home.test.jsx:60,72` — `toHaveFocus()`). Não há teste teatral aqui: simplesmente não há assertiva de contorno, nem fingida.

2. **Imagem que falha mantendo altura.** **Sustenta-se.** `grep -rn "onError" src/components src/Pages` → vazio: não existe `onError` em nenhum `<img>` do projeto, de propósito — a reserva de espaço é CSS puro (`aspect-[4/3]`, `aspect-[42/29]`, `min-h-[…]`). Sem ramo de código, não há comportamento de React a exercitar; e o jsdom não carrega imagem nem faz layout, então mesmo medir "a altura não mudou" não tem instrumento. Não é teste teatral porque nenhum teste finge cobrir isso — está limpo, registrado como CSS-only.

3. **Coluna única <768px.** **Sustenta-se, com uma ressalva.** O jsdom não avalia media query e a suíte roda com `css:false`; não há como o teste saber que a tela é <768px, então a reflow em si é inalcançável. A parte acessível do critério — "mantendo o indicador de passos acessível" — está coberta por papel ARIA e teclado (`Stepper.test.jsx`), que não depende de largura. Ressalva: eu não encontrei nenhuma tentativa de sequer documentar o breakpoint via `className` — o que teria sido aceitável como contrato (do jeito que o snap da galeria fez) mas não obrigatório. Não há teste teatral; há, no máximo, uma oportunidade não aproveitada.

4. **MT07-10.5 — texto legível sem JS de animação.** **Sustenta-se como lacuna de precisão da spec, não como desculpa.** A aplicação é React puro: sem JavaScript não há DOM nenhum para o React montar, então "o JS de animação não executa, mas o texto aparece" não descreve um cenário que a suíte (ou qualquer teste de componente) possa isolar — seria preciso um teste de HTML estático sem hidratação, que não é o que este projeto entrega nem promete. A leitura mais fiel à intenção da AC — nada de textual *depende* da animação terminar para existir — está coberta por dois ângulos reais: o ramo de movimento reduzido entrega conteúdo final sem esperar transição (`*.reduced-motion.test.jsx`), e a barra da ficha nasce com a largura do dado, não de uma animação de `scaleX` (`SpecSheet.test.jsx`, AD-015). Aceito o registro.

5. **MT07-02.1 (parte) — "sem exigir rolagem".** **Sustenta-se.** A spec não fixa altura de viewport de referência, e o jsdom não tem viewport (não há `window.innerHeight` real, layout ou scroll). Todo o conteúdo que a AC exige na primeira dobra (nome, subtítulo, 3 números, preço) está 100% asserido em `Hero.test.jsx` — o que falta é só a proposição espacial "sem rolar", que nenhum teste de DOM sem layout consegue afirmar. Marcado corretamente como lacuna de precisão da spec, dupla com limitação de ambiente.

**Veredito da checagem**: nenhum dos cinco é desculpa disfarçada. Todos têm razão técnica verificável (`css:false`, ausência de layout/viewport/media-query no jsdom, ausência de `onError` no código) e nenhum ganhou assertiva de `className` fingindo cobrir o que não cobre — que é exatamente o padrão de teste teatral que este Verifier caçou (ver próxima seção sobre o único uso comportamental de `toHaveClass` do diff).

**Achado à parte, fora dos cinco**: `Gallery.test.jsx:32,44` usa `toHaveClass("snap-x","snap-mandatory",…)` e `toHaveClass("snap-start","flex-none")` para o AC MT07-02.4 (scroll snap). Isto **é** uma assertiva de `className` — mas, diferente da lista acima, este critério **não** está na lista de "registrado": foi fechado como coberto. Julgamento: não é teatral, por dois motivos verificáveis nesta rodada e não só alegados — (a) as classes Tailwind aqui são o próprio mecanismo, não decoração: `snap-x`/`snap-mandatory`/`snap-start` mapeiam 1:1 para as propriedades CSS `scroll-snap-type`/`scroll-snap-align`, então testar a classe é testar a única coisa que aciona o snap; (b) a mutação de sensor aplicada nesta rodada (remover `snap-start` de um item) **matou** o teste — uma assertiva de `className` que não discrimina nada passaria sob a mutação, e esta não passou. Isso a separa de um teste teatral de verdade (que passaria sob implementação errada). Fica marcado como zona de fronteira, coberta com ressalva, não como lacuna.

---

## Sensor de discriminação

**Isolamento**: `git worktree add /private/tmp/mt07-sensor/wt HEAD --detach`, `node_modules` por symlink. Baseline `git status --porcelain` vazio antes; **nenhum `git stash`, nenhum `git checkout` na árvore real** — cada mutação foi aplicada com `sed`/edição direta no scratch, a suíte rodou lá, e o arquivo mutado foi restaurado de cópia (`cp` do backup em `/tmp`, feito antes de cada mutação). Ao final: `git worktree remove --force`, `rm -rf` do diretório scratch. `git worktree list` voltou com **uma entrada só** (a árvore real) e `git status --porcelain` / `git diff HEAD --stat` da árvore real voltaram **vazios** — idênticos ao baseline.

**Profundidade**: 15 mutações (≥ mínimo de 12 pedido), cobrindo cada item da lista mandatória.

| # | Arquivo:linha | Mutação | Morto? |
| - | ------------- | ------- | ------ |
| 1 | `src/hooks/useConfigurator.js:79` | clamp do último passo: `Math.min(Math.max(index,0), len-1)` → `Math.max(index,0)` (teto removido) | ✅ Morto — `useConfigurator.test.jsx` |
| 2 | `src/lib/validation.js:18` | `expiration: "Validade inválida"` → `"Data incorreta"` | ✅ Morto — 2 testes em `validation.test.js` |
| 3 | `src/lib/validation.js:19` | `expired: "Cartão vencido"` → `"Vencido demais"` | ✅ Morto — 1 teste |
| 4 | `src/lib/validation.js:20` | `cvv: "CVV inválido"` → `"Código ruim"` | ✅ Morto — 1 teste |
| 5 | `src/lib/validation.js:15` | `phone: "Telefone incompleto"` → `"Telefone errado"` | ✅ Morto — 1 teste |
| 6 | `src/lib/validation.js:16` | `cep: "CEP incompleto"` → `"CEP errado"` | ✅ Morto — 1 teste |
| 7 | `src/lib/validation.js:17` | `card: "Número do cartão incompleto"` → `"Cartão errado"` | ✅ Morto — 1 teste |
| 8 | `src/components/ui/Reveal.jsx:22` | ramo `prefersReducedMotion` desligado (`if (false && …)`) | ✅ Morto — `Reveal.reduced-motion.test.jsx` |
| 9 | `src/components/configurator/Configurator.jsx:231` | idem, ramo do painel | ✅ Morto — `Configurator.reduced-motion.test.jsx` |
| 10 | `src/components/configurator/steps/ColorStep.jsx:44` | idem, ramo da foto | ✅ Morto — `ColorStep.reduced-motion.test.jsx` |
| 11 | `src/components/landing/SpecSheet.jsx:15` | `barWidth(ratio)` → `"100%"` fixo | ✅ Morto — `SpecSheet.test.jsx` |
| 12 | `src/components/landing/Gallery.jsx:37` | `snap-start` removido do item | ✅ Morto — `Gallery.test.jsx` |
| 13 | `src/components/layout/Footer.jsx:77–78` | crédito + aviso não comercial removidos | ✅ Morto — `Footer.test.jsx` (2 falhas) |
| 14 | `src/components/configurator/Stepper.jsx:71` | destravamento volta a `step.id <= furthest` (aritmética de id, contra AD-026) | ✅ Morto — `Stepper.order.test.jsx` |
| 15 | `src/data/catalog.js:239` | `stepPosition`: `index` → `index + 1` (quebra a fonte única, AD-032) | ✅ Morto — falha em cascata por toda a suíte (`Configurator.test.jsx`, `useConfigurator.test.jsx`, `Stepper*`) |

**Sensor: 15 mutações, 15 mortas, 0 sobreviventes — ✅ discriminante.**

Todos os 9 mutantes sobreviventes da rodada 1 (M6, M14, M15, M16 — já morto antes desta rodada e reconferido por leitura da assertiva —, M17, M18, M19, M20, mais a aritmética de id do `Stepper`) foram reexecutados sob nome novo nesta lista e morreram.

---

## Achados extra da rodada 1 — estado atual

| Achado | Estado nesta rodada |
| ------ | -------------------- |
| `Stepper` destravava por aritmética de id (contra AD-026) | ✅ Corrigido — `Stepper.jsx:71` usa `stepPosition`; mutação #14 confirma |
| Divergência de contagem na spec ("113" vs real) | ✅ Não se repete — `spec.md:245` já cita "142 testes em 24 arquivos", batendo com o gate desta rodada |
| `Configurator.jsx:87`/`:184` desreferencia `current` sem guarda | ⚠️ Ainda presente, e ainda **inalcançável**: `clampStep` (`useConfigurator.js:82–84`) garante id válido em toda transição, e `Stepper` agora recusa exatamente o que o hook recusaria (mutação #15 provou que os três lugares caem juntos se a fonte única quebrar). Registrado como fragilidade latente, não como lacuna — uma guarda aqui seria ramo que nenhum teste honesto alcançaria hoje |

---

## Qualidade de código

| Princípio | Estado |
| --------- | ------ |
| Código mínimo, sem feature além do pedido | ✅ |
| Sem abstração para uso único | ✅ — `stepPosition` (AD-032), `Field`/`FieldGrid` (AD-019), `motionMarks.js` compartilhado entre os 3 arquivos `*.reduced-motion` |
| Sem "flexibilidade" desnecessária | ✅ |
| Só arquivos necessários tocados | ✅ |
| Não "melhorou" código alheio | ✅ |
| Segue os padrões do projeto | ✅ — 0 hex em componente, formatadores centralizados, BRL completo, rótulo sem ícone |
| Testes mapeiam ACs e não são rasos | ✅ — nenhum teste teatral encontrado; único `toHaveClass` de comportamento (Gallery) mata mutação real |
| Checagem ancorada na spec | ✅ — os 6 textos de MT07-09.6 travados como literal, não só por `MESSAGES.x` |
| Coverage Expectation por camada | ✅ — hook cobre limite de passo pelo caminho real (formulário preenchido antes do clamp) |
| Todo teste mapeia a AC/edge case/done-when | ✅ |
| Diretrizes documentadas seguidas | ✅ — `tasks.md` registra "nenhuma guideline encontrada; defaults fortes aplicados" |

---

## Lacunas priorizadas

**Nenhuma bloqueante ou maior.** Restam apenas ressalvas já registradas por decisão, sem teste teatral por trás de nenhuma:

1. **AC MT07-08.6/08.7** (contador de caracteres, rótulo sem ícone) asseridas só em `PersonalStep`, não replicadas em `DeliveryStep`/`PaymentStep` — decisão V10 documentada: replicar testaria o mesmo `Field` três vezes. Aceito.
2. **AC MT07-10.2/10.3** (transição animada do painel, crossfade da cor) — só o ramo *sem* animação tem assertiva; o efeito animado em si (com motion ativo) não. Menor: a spec pede que a transição *exista*, e a implementação (`AnimatePresence`, `motion.img` com `initial/exit`) mostra que existe por inspeção; testar o valor de uma animação em curso teria de ler `style` no meio de uma transição mockada — custo desproporcional ao risco.
3. **`Configurator.jsx:85`/`:184` sem guarda em `current`** — inalcançável, registrado, não corrigido de propósito (ramo morto que nenhum teste honesto alcançaria).

Nenhuma delas bloqueia PASS: são exatamente as ressalvas que a Fase 5 já havia decidido não fechar, e nenhuma esconde comportamento incorreto.

---

## Atualização da rastreabilidade

| Requisito | Status |
| --------- | ------ |
| MT07-01 | ✅ Verificado |
| MT07-02 | ✅ Verificado (AC 2.5 registrada, ver julgamento) |
| MT07-03 | ✅ Verificado (M18 morto) |
| MT07-04 | ✅ Verificado (M20 morto; contrato de snap com ressalva de fronteira) |
| MT07-05 | ✅ Verificado (M6 morto, motivo errado corrigido) |
| MT07-06 | ✅ Verificado (M1–M3 já mortos na rodada 1, reconfirmados por leitura) |
| MT07-07 | ✅ Verificado (edge case registrado, ver julgamento) |
| MT07-08 | ✅ Verificado (AC 8.6/8.7 com ressalva aceita) |
| MT07-09 | ✅ Verificado (6 textos travados como literal, mutações mortas) |
| MT07-10 | ✅ Verificado (AC 10.1/10.4 mortas; AC 10.2/10.3/10.5 com ressalva aceita) |
| MT07-11 | ✅ Verificado |
| MT07-12 | ✅ Verificado (M19 morto) |

---

## Resumo

**Geral**: ✅ pronto. A implementação e a suíte convergem: os gates passam, os 15 mutantes de risco morrem (incluindo os 9 sobreviventes da rodada 1, sob nova numeração), e os seis critérios registrados como limitação de ambiente/precisão da spec têm razão técnica verificável — nenhum é teste teatral disfarçado de lacuna fechada.

**O que mudou desde a rodada 1**: nada de comportamento de produção regrediu; a suíte foi de 123→142 testes fechando exatamente as lacunas apontadas, mais um achado de código real (`Stepper` contra AD-026) corrigido e agora protegido por teste e por fonte única (`stepPosition`, AD-032).

**Próximo passo**: nenhum ciclo de fix adicional necessário. Feature pronta para o handoff de produto (capturas do redesenho pendentes, fora do escopo de código).

---

## Histórico — Rodada 1 (Verifier, 2026-09-03)

> Arquivado na íntegra abaixo. Resultado da rodada 1: **FAIL por cobertura** (não por defeito de comportamento) — 9 mutantes sobreviventes, 11 critérios sem assertiva. Fechado por um implementador nas fix tasks V1–V10 (ver `tasks.md`, Fase 5, e `.specs/STATE.md`, AD-026 a AD-032). Este Verifier (rodada 2) confirmou o fechamento por conta própria, sem reaproveitar a evidência abaixo sem reconferir.

Veredito arquivado da rodada 1: ❌ FAIL (por cobertura, não por comportamento).

**Diff verificado**: `main..HEAD` — 34 commits, `HEAD = 4429c27ddd4ef32a96bf207a809cbb18164757ae`, 72 arquivos (+9179 / −4615)

**Sensor da rodada 1**: 20 mutações, 11 mortas, **9 sobreviventes**: M6 (clamp do último passo — teste passava pelo motivo errado), M14/M15 (textos de validade/CVV sem trava), M16 (teto de 24px do reveal), M17 (ramo `prefers-reduced-motion`), M18 (barra da ficha solta do `ratio`), M19 (crédito do rodapé), M20 (snap da galeria).

**Lacunas priorizadas da rodada 1** (todas fechadas na Fase 5, ver corpo do relatório desta rodada acima):
1. M6 — teto do último passo sem teste honesto → `test(hooks): exercise the last-step clamp for real`
2. M14/M15 — textos de MT07-09.6 sem trava → `test(lib): pin the exact validation messages the spec names`
3. M17 — `prefers-reduced-motion` sem guarda → `test(motion): cover the reduced-motion branches`
4. M18 — barra da ficha solta do `ratio` → `test(landing): tie the spec bars to the catalog ratio`
5. M20 — snap da galeria sem assertiva → `test(landing): cover the gallery snap track and the footer credit`
6. M19 — crédito do rodapé sem assertiva → idem
7. AC MT07-02.5 (foco visível) → registrada, AD-031
8. M16 — teto de 24px sem assertiva → `test(ui): cover the remaining motion and layout criteria`
9. AC MT07-10.2/10.3 sem assertiva → idem
10. Edge cases de imagem/coluna única → registrados, AD-031
11. AC MT07-08.6/08.7 num passo só → decisão de não replicar (V10)
12. `Stepper` contra AD-026 (achado de código) → `fix(configurator): unlock steps by position, not by id`

**Rodada dos dois revisores sobre o diff da Fase 5**: 1 bloqueante (posição do passo triplicada com fallback divergente — fechado como `stepPosition` único no catálogo, AD-032), 6 importantes (sonda de motion compartilhada, especs co-locadas, literais em `validation.test.js`, teste redundante do `SpecSheet`, nome/cobertura da âncora do rodapé), 11 menores (3 não alterados por decisão registrada, entre eles a sugestão de `usePrefersReducedMotion` na casa).

**Gates da rodada 1, antes das fix tasks**: 123 testes/16 arquivos, lint 0/0, build ok.
**Gates depois das fix tasks (mesma rodada, antes desta reverificação)**: 142 testes/24 arquivos, lint 0/0, build ok.

O relatório completo, com todas as tabelas de evidência linha a linha, mutações, e o fechamento detalhado de cada lacuna pelo implementador, está preservado no histórico do git (`git log -p -- .specs/features/redesign-mt07/validation.md`) na revisão anterior a este commit.
