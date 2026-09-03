# Redesenho MT-07 — Relatório do Verifier

**Result**: ❌ FAIL

**Data**: 2026-09-03
**Spec**: `.specs/features/redesign-mt07/spec.md`
**Diff verificado**: `main..HEAD` — 34 commits, `HEAD = 4429c27ddd4ef32a96bf207a809cbb18164757ae`, 72 arquivos (+9179 / −4615)
**Verifier**: sub-agente independente (autor ≠ verificador); cobertura re-derivada da spec, evidência-ou-zero
**Baseline da árvore antes do sensor**: `git status --porcelain` vazio — reconfirmado vazio após o sensor

> **O código de produção não apresentou defeito de comportamento.** Os três gates
> passam e todos os 11 mutantes de regra de negócio (preço, navegação de estado,
> validação, envio) morreram. O FAIL é de **cobertura de teste**: 9 mutantes
> sobreviveram, entre eles um que revela um teste que passa pelo motivo errado, e
> 11 critérios de aceitação não têm nenhuma assertiva. Isso contraria o Success
> Criteria da própria spec — "a suíte de testes cobre cada AC dos P1".

---

## Conclusão dos tasks

28 tasks (T1–T25 + T7b, T14b, T19b) marcadas concluídas em `tasks.md`; zero caixas
`- [ ]` pendentes. `.specs/STATE.md:44` declara 25 tasks + 5 fix tasks.

| Task | Estado | Nota |
| ---- | ------ | ---- |
| T1–T25 (+ b) | ✅ Feitas | Nenhuma caixa aberta em `tasks.md` |

---

## Critérios de aceitação ancorados na spec

Coluna "Esperado pela spec" = o valor que a spec fixa, não o que o teste faz.
Coluna "Evidência" = `arquivo:linha` + a expressão da assertiva reproduzida.

### P1 — Design system em tokens (MT07-01)

A Test Coverage Matrix (`tasks.md:26`) classifica `src/styles/index.css` como
"Config / build — none (build gate)": os critérios abaixo são verificados por
inspeção + grep + build, não por assertiva.

| Critério | Esperado pela spec | Evidência | Resultado |
| -------- | ------------------ | --------- | --------- |
| AC1 — oito tokens de cor num único arquivo de tema | `ink`, `ink-2`, `ink-3`, `line`, `khaki`, `paper`, `paper-dim`, `cyan` | `src/styles/index.css:6` a `src/styles/index.css:14` — `--color-ink: #0b0c0d;` … `--color-cyan: #2bd4cf;` (os 8 presentes, mais `khaki-dim`, `cyan-soft`, `danger`) | ✅ COBERTO (inspeção; sem assertiva) |
| AC2 — três famílias tipográficas como token | Archivo (display), Barlow (corpo), IBM Plex Mono (dado) | `src/styles/index.css:18` — `--font-display: "Archivo", …`; `:19` `--font-body: "Barlow"…`; `:20` `--font-mono: "IBM Plex Mono"…`; carregadas em `index.html:12` | ✅ COBERTO (inspeção; sem assertiva) |
| AC3 — cor da identidade só por token, sem hex no componente | zero literal hex de identidade em componente | `grep -rniE '#[0-9a-f]{3,8}\b' src/components src/Pages` → 0 ocorrências. O único hex de produto vive no catálogo (`src/data/catalog.js:28` — `hex: "#1E4FA0"`), consumido em `src/components/configurator/steps/ColorStep.jsx:83` — `style={{ backgroundColor: color.hex }}` | ✅ COBERTO (grep; sem assertiva) |
| AC4 — `#2BD4CF` como acento único | ocorrência única no projeto | `src/styles/index.css:14` — `--color-cyan: #2bd4cf;` — `grep -rni 2bd4cf src index.html` retorna só essa linha | ✅ COBERTO (grep; sem assertiva) |

### P1 — Hero e seções da landing (MT07-02, 03, 04, 07)

| Critério | Esperado pela spec | Evidência | Resultado |
| -------- | ------------------ | --------- | --------- |
| AC1 — nome, subtítulo, três números e preço inicial na carga | 689 cc, 74,8 cv, 6,9 kgf.m e o preço inicial | `src/components/landing/__tests__/Hero.test.jsx:18` — `screen.getByRole("heading", { name: /mt-07 master of torque/i })`; `:20` `screen.getByText(/hyper naked · 2025/i)`; `:26`–`:31` `expect(screen.getByText("689"))`, `("cc")`, `("74,8")`, `("cv")`, `("6,9")`, `("kgf.m")`; `:37` `expect(screen.getByText("R$ 48.500,00")).toBeInTheDocument()` | ✅ COBERTO |
| AC1 (parte) — "sem exigir rolagem" | primeira dobra completa | nenhuma assertiva; jsdom não tem viewport. Implementação: `src/components/landing/Hero.jsx:33` — `min-h-[560px] grid-rows-[1fr_auto]` | ⚠️ lacuna de precisão da spec (a spec não define altura de referência) + sem assertiva |
| AC2 — botão principal abre o configurador no passo 1 | painel do passo 1 | `src/Pages/Home/__tests__/Home.test.jsx:37` — `expect(screen.getByRole("dialog")).toBeInTheDocument()`; `:38` — `expect(screen.getByText(FIRST_STEP_HEADING))`, com `FIRST_STEP_HEADING = \`Passo 1 de ${STEPS.length} — ${STEPS[0].label}\`` (`:10`); gatilho em `src/components/landing/__tests__/Hero.test.jsx:47` — `expect(onOpenConfigurator).toHaveBeenCalledTimes(1)` | ✅ COBERTO |
| AC3 — ficha técnica com barra proporcional ao valor de cada spec | barra proporcional | **nenhuma assertiva**. Implementação: `src/components/landing/SpecSheet.jsx:56` — `style={{ width: barWidth(spec.ratio) }}` e `:15` `return \`${Math.round(ratio * 100)}%\``. O que há é forma do dado: `src/data/__tests__/catalog.test.js:83` — `expect(spec.ratio).toBeGreaterThan(0)` e `:84` `toBeLessThanOrEqual(1)` — não liga `ratio` à largura. Mutante **M18 sobreviveu** | ❌ LACUNA + ⚠️ lacuna de precisão da spec: `ratio` é número de direção de arte (689 cc → 0,86; 184 kg → 0,52), não proporção calculada do valor; a spec não define o teto da categoria |
| AC4 — galeria alinha a imagem seguinte ao início do trilho (scroll snap) | encaixe no início | **nenhuma assertiva**. Implementação: `src/components/landing/Gallery.jsx:31` — `className="flex snap-x snap-mandatory gap-0.5 overflow-x-auto …"` e `:37` `snap-start`. Mutante **M20 sobreviveu** | ❌ LACUNA |
| AC5 — foco visível em todo elemento interativo pelo teclado | contorno de foco visível | **nenhuma assertiva**. Implementação: `src/styles/index.css:58` — `:focus-visible { outline: 2px solid var(--color-cyan); }`; `src/components/ui/Button.jsx:9` — `focus-visible:outline-2 focus-visible:outline-offset-[3px]` | ❌ LACUNA |
| MT07-07 (edge case) — imagem que falha mantém a altura reservada | bloco não desloca o vizinho | **nenhuma assertiva**. Implementação: `src/components/landing/Hero.jsx:38` — `<div className="absolute inset-0 z-0">`; `src/components/landing/SpecSheet.jsx:66` — `aspect-[4/3] … md:min-h-[320px]`; `src/components/landing/Gallery.jsx:44` — `aspect-[42/29]`; `src/components/configurator/steps/ColorStep.jsx:31` — `min-h-[260px]` | ❌ LACUNA |

### P1 — Configurador de 5 passos (MT07-05, 06)

| Critério | Esperado pela spec | Evidência | Resultado |
| -------- | ------------------ | --------- | --------- |
| AC1 — indicador dos 5 passos de um único componente | 5 abas, sem duplicação | `src/components/configurator/__tests__/Stepper.test.jsx:34` — `expect(tabs).toHaveLength(STEPS.length)`; `:36` `expect(tabs[index]).toHaveAccessibleName(new RegExp(\`passo ${index + 1}: ${step.label}\`, "i"))`. Fonte única: `src/components/configurator/Stepper.jsx:106` — `{STEPS.map((step, index) => {` | ✅ COBERTO |
| AC2 — selecionar passo já liberado exibe o painel daquele passo | painel correspondente | `src/components/configurator/__tests__/Configurator.test.jsx:97` — `await user.click(screen.getByRole("tab", { name: /passo 1: cor/i }))` seguido de `:99` `await screen.findByRole("group", { name: /cores disponíveis/i })`; recusa de salto: `src/hooks/__tests__/useConfigurator.test.jsx:191` — `expect(result.current.state.step).toBe(STEP_IDS.PERSONAL)` após `goTo(STEP_IDS.PAYMENT)` | ✅ COBERTO |
| AC3 — no primeiro passo, navegação anterior desabilitada | controle desabilitado | `src/components/configurator/__tests__/Configurator.test.jsx:107` — `expect(screen.getByRole("button", { name: "Anterior" })).toBeDisabled()`; limite no estado: `src/hooks/__tests__/useConfigurator.test.jsx:167` — `expect(result.current.state.step).toBe(FIRST_STEP)` após `previous()` | ✅ COBERTO |
| AC4 — no último passo, navegação para o próximo desabilitada | controle desabilitado | `src/components/configurator/__tests__/Configurator.test.jsx:113` — `expect(screen.getByRole("button", { name: "Próximo" })).toBeDisabled()` | ⚠️ COBERTO na UI, **não** no estado: `src/hooks/__tests__/useConfigurator.test.jsx:176` — `expect(result.current.state.step).toBe(LAST_STEP)` passa **pelo motivo errado** (mutante **M6 sobreviveu**, ver Sensor) |
| AC5 — selecionar cor troca a imagem e marca a cor | imagem da cor + marca | `src/components/configurator/steps/__tests__/ColorStep.test.jsx:49` — `await screen.findByAltText(new RegExp(\`MT-07 ${PAID_COLOR.name}\`, "i"))`; `:28` `expect(pressed).toHaveLength(1)`; `:40` `expect(onSelect).toHaveBeenCalledWith(PAID_COLOR.id)` | ✅ COBERTO |
| AC6 — marcar opcional soma ao subtotal, base R$ 48.500,00 intacta | subtotal = base + preço do opcional | `src/hooks/__tests__/useConfigurator.test.jsx:98` — `expect(result.current.subtotal).toBe(BASE_PRICE + windscreen.price)`; base fixada em `src/data/__tests__/catalog.test.js:17` — `expect(BASE_PRICE).toBe(48500)`; preços do catálogo em `:64`–`:70` `expect(byName).toEqual({ "Projetor auxiliar": 1800, … })` | ✅ COBERTO |
| AC7 — desmarcar opcional subtrai aquele preço | subtotal volta sem o item | `src/hooks/__tests__/useConfigurator.test.jsx:110` — `expect(result.current.subtotal).toBe(BASE_PRICE + kit.price)` após três toggles; `:109` `expect(result.current.state.optionIds).toEqual([kit.id])` | ✅ COBERTO |
| AC8 — parcela = subtotal ÷ 24, sem parcelar a entrega | subtotal/24 | `src/hooks/__tests__/useConfigurator.test.jsx:139` — `expect(result.current.parcel).toBeCloseTo(result.current.subtotal / INSTALLMENTS, 5)`; `:143` `expect(result.current.parcel).toBeLessThan(result.current.total / INSTALLMENTS)`; exibição em `src/components/configurator/__tests__/Configurator.test.jsx:134` — `screen.getByText(\`ou ${INSTALLMENTS}x de ${formatBRL(subtotal / INSTALLMENTS)}\`)`; `INSTALLMENTS = 24` em `src/data/__tests__/catalog.test.js:19` | ✅ COBERTO (AD-008) |
| AC9 — fechar preserva as escolhas ao reabrir | cor e opcionais mantidos | `src/components/configurator/__tests__/Configurator.test.jsx:171` — `.toHaveAttribute("aria-pressed", "true")` no opcional após `rerender(isOpen={false})` + `rerender(isOpen)` (`:166`–`:167`); `:176` idem para a cor | ✅ COBERTO (AD-021) |

### P1 — Formulários de dados e entrega (MT07-08)

| Critério | Esperado pela spec | Evidência | Resultado |
| -------- | ------------------ | --------- | --------- |
| AC1 — sair de campo obrigatório vazio exibe erro no campo | mensagem no campo | `src/components/configurator/steps/__tests__/PersonalStep.test.jsx:63` — `expect(screen.getByText(MESSAGES.required)).toBeInTheDocument()` (`MESSAGES.required = "Campo obrigatório"`, `src/lib/validation.js:12`); entrega: `.../DeliveryStep.test.jsx:60` — idem; unidade: `src/lib/__tests__/validation.test.js:32` — `expect(validateRequired("")).toBe(MESSAGES.required)` | ✅ COBERTO |
| AC2 — e-mail fora de `nome@dominio.tld` exibe "Informe um e-mail válido" | texto exato | `src/lib/__tests__/validation.test.js:44` — `expect(validateEmail("joao@exemplo")).toBe("Informe um e-mail válido")` (literal); UI: `.../PersonalStep.test.jsx:73` — `expect(screen.getByText(MESSAGES.email)).toBeInTheDocument()` | ✅ COBERTO |
| AC3 — CPF sem 11 dígitos ou com DV errado exibe "CPF inválido" | texto exato | `src/lib/__tests__/validation.test.js:57` — `expect(validateCPF("1234567890")).toBe("CPF inválido")` (tamanho); `:62` — `expect(validateCPF("529.982.247-26")).toBe("CPF inválido")` (DV); UI: `.../PersonalStep.test.jsx:83` — `expect(screen.getByText(MESSAGES.cpf))` | ✅ COBERTO |
| AC4 — máscara brasileira ao digitar CPF, telefone ou CEP | formato BR | `.../PersonalStep.test.jsx:100` — `expect(screen.getByLabelText("CPF")).toHaveValue("123.456.789-09")`; `:103` — `expect(screen.getByLabelText("Telefone")).toHaveValue("(31) 99876-5432")`; `.../DeliveryStep.test.jsx:50` — `expect(screen.getByLabelText("CEP")).toHaveValue("30140-071")` | ✅ COBERTO |
| AC5 — campo com erro impede o avanço | passo não muda | `src/hooks/__tests__/useConfigurator.test.jsx:187` — `expect(result.current.state.step).toBe(STEP_IDS.PERSONAL)` após `next()`; `:188` — `expect(result.current.state.errors.firstName).toBe(MESSAGES.required)`; UI: `src/components/configurator/__tests__/Configurator.test.jsx:146` — `expect(await screen.findByRole("alert")).toHaveTextContent(/revise os campos marcados/i)` e `:150` `screen.getByText(\`Passo 3 de ${STEPS.length} — ${STEPS[2].label}\`)` | ✅ COBERTO |
| AC6 — contador de caracteres em todo campo com limite | `n/max` | `.../PersonalStep.test.jsx:91` — `expect(screen.getByText(\`4/${field.maxLength}\`)).toBeInTheDocument()`; implementação genérica em `src/components/ui/Field.jsx:62`–`:66` — `{maxLength !== undefined && … \`${value.length}/${maxLength}\`}`; tetos do catálogo em `src/data/__tests__/catalog.test.js:143` — `expect(field.maxLength).toBeGreaterThan(0)` | ⚠️ COBERTO num campo só (`firstName`); "todo campo" repousa na generalidade do `Field`, sem assertiva por passo |
| AC7 — rótulo sem ícone decorativo | nenhum `svg`/`img` no `label` | `.../PersonalStep.test.jsx:51` — `expect(label.querySelector("svg, img")).toBeNull()` para cada campo do passo | ⚠️ COBERTO no passo de dados; entrega e pagamento sem assertiva equivalente (mesmo `Field`) |

### P1 — Pagamento e resumo do pedido (MT07-09)

| Critério | Esperado pela spec | Evidência | Resultado |
| -------- | ------------------ | --------- | --------- |
| AC1 — resumo lista moto com a cor, a entrega e cada opcional, com preços | linhas com preço | `src/components/configurator/steps/__tests__/PaymentStep.test.jsx:74` — `within(summary).getByText(\`Yamaha MT-07 · ${COLOR.name}\`)`; `:77` — `within(summary).getByText(formatBRL(MOTORCYCLE_PRICE))`; `:94` — `within(summary).getByText(/entrega em domicílio/i)`; `:96`–`:99` — `getByText(option.name)` + `getAllByText(formatBRL(option.price)).length).toBeGreaterThan(0)`; miniatura fiel à cor: `:86` — `expect(summary.querySelector("img")).toHaveAttribute("src", COLOR.image)` | ✅ COBERTO |
| AC2 — número do cartão refletido de quatro em quatro | `4429 8812 0043 1197` | `.../PaymentStep.test.jsx:123` — `expect(screen.getByText("4429 8812 0043 1197")).toBeInTheDocument()`; máscara: `src/lib/__tests__/masks.test.js:53` — `expect(maskCard("4429881200431197")).toBe("4429 8812 0043 1197")` | ✅ COBERTO |
| AC3 — nome do titular refletido em caixa alta | `JOAO MARCOS` | `.../PaymentStep.test.jsx:133` — `expect(screen.getByText("JOAO MARCOS")).toBeInTheDocument()`, com `:132` provando que o campo preserva `"joao marcos"` | ✅ COBERTO |
| AC4 — todo valor monetário em BRL por extenso, sem abreviação | `R$ 48.500,00` | `src/lib/__tests__/currency.test.js:6` — `expect(formatBRL(BASE_PRICE)).toBe("R$ 48.500,00")`; `:18` — `expect(formatted).toBe("R$ 1.000.000,00")`; `:19` — `expect(formatted).not.toMatch(/mil|mi|bi|k/i)`; no resumo: `.../PaymentStep.test.jsx:114` — `expect(within(summary).queryByText(/\b(mil|mi|bi)\b/i)).toBeNull()`; "sem dado" ≠ zero: `currency.test.js:10`–`:13` — `expect(formatBRL(0)).toBe("R$ 0,00")` / `toBe(NO_DATA)` (AD-013) | ✅ COBERTO |
| AC5 — finalizar válido exibe carregamento e depois a confirmação | `submitting` → `confirmed` | `src/hooks/__tests__/useConfigurator.test.jsx:243` — `expect(result.current.state.status).toBe(SUBMIT_STATUS.submitting)`; `:247` — `…toBe(SUBMIT_STATUS.confirmed)` após `vi.advanceTimersByTime(SUBMIT_DELAY_MS)`; UI do carregamento: `.../PaymentStep.test.jsx:151` — `expect(screen.getByRole("button", { name: /enviando pedido/i })).toBeDisabled()` e `:155` `screen.getByText(/enviando o pedido/i)`; confirmação: `:163` — `expect(confirmation).toHaveTextContent(/pedido confirmado/i)` e `:164` `toHaveTextContent(formatBRL(TOTAL))` (AD-009) | ✅ COBERTO |
| AC6 — finalizar inválido leva ao primeiro passo com erro e aponta o campo | passo do 1º inválido + campo apontado | `src/hooks/__tests__/useConfigurator.test.jsx:229` — `expect(result.current.state.status).toBe(SUBMIT_STATUS.idle)`; `:230` — `expect(result.current.state.step).toBe(STEP_IDS.DELIVERY)`; `:231` — `expect(result.current.state.errors.city).toBe(MESSAGES.required)`; `:220` — `expect(result.current.state.errors.cardHolder).toBe(MESSAGES.required)` | ✅ COBERTO |
| AC6 (textos) — `Telefone incompleto`, `CEP incompleto`, `Número do cartão incompleto` | textos exatos | `src/lib/__tests__/validation.test.js:80` — `expect(validatePhone("(31) 9888")).toBe("Telefone incompleto")`; `:89` — `expect(validateCEP("30140-07")).toBe("CEP incompleto")`; `:96` — `expect(validateCard("4429 8812 0043")).toBe("Número do cartão incompleto")` (literais) | ✅ COBERTO |
| AC6 (textos) — `Validade inválida`, `Cartão vencido`, `CVV inválido` | textos exatos | asseridos **só pela constante**: `src/lib/__tests__/validation.test.js:103` — `expect(validateExpiration("1229", NOW)).toBe(MESSAGES.expiration)`; `:111` — `…toBe(MESSAGES.expired)`; `:133` — `expect(validateCVV("12")).toBe(MESSAGES.cvv)`. Trocar o texto em `src/lib/validation.js:18`–`:20` não quebra nada — mutantes **M14 e M15 sobreviveram** | ❌ LACUNA (o texto que a spec fixa não está travado) |
| AC7 — validade passada exibe `Cartão vencido`, distinta de formato errado | vencido ≠ inválida | `src/lib/__tests__/validation.test.js:111`–`:113` — `expect(validateExpiration("08/26", NOW)).toBe(MESSAGES.expired)`, `("12/25")`, `("01/20")`; `:122` — `expect(validateExpiration("13/20", NOW)).toBe(MESSAGES.expiration)` (mês fora da faixa **não** vira vencido); `:117` — `expect(validateExpiration("09/26", NOW)).toBe("")` (mês corrente vale); ligação com o catálogo: `:157` — `expect(validateField(field, "01/20")).toBe(MESSAGES.expired)` (AD-017) | ✅ COBERTO (texto exato: ver lacuna acima) |

### P2 — Motion com função (MT07-10)

| Critério | Esperado pela spec | Evidência | Resultado |
| -------- | ------------------ | --------- | --------- |
| AC1 — revelar seção a partir de deslocamento de **no máximo 24px** | ≤ 24px | **nenhuma assertiva**. Implementação: `src/components/ui/Reveal.jsx:9` — `const OFFSET = 24;` e `:36` `initial={{ opacity: 0, y: OFFSET }}`. Mutante **M16 sobreviveu** (24 → 96) | ❌ LACUNA |
| AC2 — animar a transição entre painéis do configurador | transição entre painéis | **nenhuma assertiva**. Implementação: `src/components/configurator/Configurator.jsx:233` — `<AnimatePresence initial={false} mode="wait">` com `:234` `<motion.div key={state.step} {...PANEL_MOTION}>` e `:47`–`:52` `PANEL_MOTION` | ❌ LACUNA |
| AC3 — crossfade entre as imagens ao trocar a cor | crossfade | troca de imagem asserida (`.../ColorStep.test.jsx:49` — `findByAltText(...)`), o **crossfade** não. Implementação: `src/components/configurator/steps/ColorStep.jsx:52`–`:61` — `<motion.img … initial={{ opacity: 0, x: SHIFT }} exit={{ opacity: 0, x: -SHIFT }} transition={FADE}>` | ⚠️ parcial (efeito sem assertiva) |
| AC4 — `prefers-reduced-motion: reduce` entrega tudo no estado final, sem animação | conteúdo final, zero animação | **nenhuma assertiva** — `useReducedMotion` não é simulado em nenhum teste. Implementação: `src/components/ui/Reveal.jsx:22` — `if (prefersReducedMotion) { … return <Plain …> }`; `src/components/configurator/Configurator.jsx:230` — `{prefersReducedMotion ? panel : (…)}`; `src/components/configurator/steps/ColorStep.jsx:44`; CSS: `src/styles/index.css:74`. Mutante **M17 sobreviveu** (ramo desligado) | ❌ LACUNA (AC com ramo explícito e sem guarda) |
| AC5 — conteúdo textual legível se o JS de animação não executar | texto sempre presente | **nenhuma assertiva** do cenário sem JS. Evidência de projeto: `src/components/landing/SpecSheet.jsx:56` nasce com a largura do `ratio` (AD-015), sem depender de animação | ❌ LACUNA |

### P2 — Limpeza da base técnica (MT07-11)

| Critério | Esperado pela spec | Evidência | Resultado |
| -------- | ------------------ | --------- | --------- |
| AC1 — `package.json` só com dependências efetivamente importadas | zero dep morta | inspeção 1:1 das 6 `dependencies`: `@tailwindcss/vite` → `vite.config.js`; `motion` → `src/lib/motion.js` + 3 componentes; `prop-types` → 15 arquivos; `react`/`react-dom` → `src/main.jsx`; `tailwindcss` → `src/styles/index.css:1`. `grep -rn "react-router\|bootstrap\|gsap\|styled-components\|react-spinners\|imask" src package.json index.html` → 0 (AD-022) | ✅ COBERTO (inspeção; sem assertiva) |
| AC2 — menu mobile por estado do React, sem `querySelector`/`classList` | estado React | `src/components/layout/__tests__/Header.test.jsx:45` — `expect(toggle).toHaveAttribute("aria-expanded", "true")`; `:55` — `expect(screen.queryByRole("navigation", { name: MENU_NAV })).toBeNull()` após fechar; `grep -rn "querySelector\|classList" src` fora de testes → 0; implementação: `src/components/layout/Header.jsx:43` — `const [isMenuOpen, setIsMenuOpen] = useState(false);` | ✅ COBERTO |
| AC3 — zero `styles.js` de styled-components em `src` | nenhum arquivo | `find src -name "styles.js" -o -name "style.js"` → vazio; `grep -rn "styled-components" src` → vazio | ✅ COBERTO (inspeção) |
| AC4 — `npm run build` conclui sem erro | exit 0 | gate executado neste relatório: exit 0, `✓ built in 534ms` | ✅ COBERTO |
| AC5 — `npm run lint` sem erro e sem aviso | exit 0, 0 avisos | gate executado: exit 0, saída vazia (`--max-warnings 0`) | ✅ COBERTO |

### P3 — Rodapé e navegação (MT07-12)

| Critério | Esperado pela spec | Evidência | Resultado |
| -------- | ------------------ | --------- | --------- |
| AC1 — rodapé exibe crédito de autoria e aviso de uso não comercial | crédito + aviso | **nenhuma assertiva** (não existe `Footer.test.jsx`). Implementação: `src/components/layout/Footer.jsx:77` — `Desenvolvido por <strong…>João Marcos</strong> ·` e `:78` `Projeto sem fim comercial: todos os direitos pertencem à marca oficial.`. Mutante **M19 sobreviveu** | ❌ LACUNA |
| AC2 — link de âncora do cabeçalho rola até a seção | âncora resolve numa seção real | `src/Pages/Home/__tests__/Home.test.jsx:85` — `expect(document.getElementById(href.slice(1))).not.toBeNull()` para cada âncora do `banner`; `src/components/layout/__tests__/Header.test.jsx:24` — `expect(link.getAttribute("href")).toMatch(/^#/)`; fonte única em `src/data/catalog.js:134` (AD-014); rolagem suave em `src/styles/index.css:71` | ✅ COBERTO (o alvo existe; a rolagem em si é do navegador) |

---

## Edge cases da spec

| Edge case | Evidência | Resultado |
| --------- | --------- | --------- |
| Imagem do acervo falha → mantém a altura reservada | `src/components/landing/SpecSheet.jsx:66` — `aspect-[4/3] … md:min-h-[320px]`; `src/components/landing/Gallery.jsx:44` — `aspect-[42/29]`; sem assertiva | ❌ LACUNA |
| Nenhum opcional → subtotal R$ 48.500,00, total R$ 50.500,00, entrega como linha própria | `src/hooks/__tests__/useConfigurator.test.jsx:89` — `expect(result.current.subtotal).toBe(BASE_PRICE)`; `:90` — `expect(result.current.total).toBe(START_TOTAL)` com `START_TOTAL = BASE_PRICE + DELIVERY_PRICE` (`:21`), ancorado em `src/data/__tests__/catalog.test.js:17`–`:18` (`48500`, `2000`); linha própria: `.../PaymentStep.test.jsx:94` + `src/components/configurator/steps/PaymentStep.jsx:176` — `<TotalRow label="Entrega" value={formatBRL(DELIVERY_PRICE)} />` (AD-008) | ✅ COBERTO (a string `R$ 50.500,00` em si não é asserida; só a aritmética) |
| Todos os opcionais → subtotal = base + todos; total = subtotal + entrega | `src/hooks/__tests__/useConfigurator.test.jsx:121` — `expect(result.current.subtotal).toBe(BASE_PRICE + allOptions)`; `:122` — `expect(result.current.total).toBe(START_TOTAL + allOptions)` | ✅ COBERTO |
| Largura < 768px → configurador em coluna única com indicador acessível | `src/components/configurator/Configurator.jsx:169` — `grid-rows-[auto_minmax(0,1fr)] … md:grid-cols-[auto_minmax(0,1fr)] md:grid-rows-1`; `src/components/configurator/Stepper.jsx:102` — `flex … items-center … md:flex-col`; sem assertiva (jsdom não tem media query) | ❌ LACUNA |
| Valor mascarado colado já formatado → preserva dígitos e reaplica a máscara | `src/lib/__tests__/masks.test.js:23` — `expect(maskCPF("123.456.789-09")).toBe("123.456.789-09")`; `:24` — `expect(maskCPF("123.456.789-0912345")).toBe("123.456.789-09")`; `:46`–`:47` idem CEP; `:57` — `expect(maskCard("4429-8812-0043-1197-88")).toBe("4429 8812 0043 1197")` | ✅ COBERTO |
| Ir ao último passo e voltar ao primeiro → mantém cor e opcionais | `src/hooks/__tests__/useConfigurator.test.jsx:203` — `expect(result.current.state.colorId).toBe(paidColor.id)`; `:204` — `expect(result.current.state.optionIds).toEqual([kit.id])`; `:205` — `expect(result.current.total).toBe(START_TOTAL + paidColor.surcharge + kit.price)` | ✅ COBERTO |

**Contagem**: 41 critérios verificados (35 ACs + 6 edge cases). **27 cobertos**
(4 deles com ressalva), **11 sem assertiva**, **3 marcados como lacuna de
precisão da spec**.

---

## Lacunas registradas em vez de testadas

Onde a AC não vira assertiva honesta no ambiente da suíte, o critério fica
registrado aqui — com o motivo — em vez de ganhar teste teatral. Nenhum destes
é defeito de comportamento.

| Critério | Por que não vira assertiva | Onde a regra vive de fato |
| -------- | -------------------------- | ------------------------- |
| AC MT07-02.5 — foco visível em todo elemento interativo | **Limitação do ambiente.** O `:focus-visible` é heurística do navegador e o contorno vem de folha de estilo; o jsdom não avalia a pseudo-classe nem calcula estilo aplicado (`css: false` na config do Vitest). Assertar a *string* de classe `focus-visible:outline-2` provaria que o texto existe no `className`, não que há contorno visível — teste teatral | `src/styles/index.css:58` (`:focus-visible { outline: 2px solid var(--color-cyan) }`) e a variante em `src/components/ui/Button.jsx:9`, `:24`, `:26`. O que É testável e está testado: alcance por teclado e foco preso no diálogo (`Configurator.test.jsx:210`) e devolução do foco ao gatilho (`Home.test.jsx:51`, `:63`) |
| Edge case — imagem que falha ao carregar não desloca o vizinho | **Limitação do ambiente.** O jsdom não carrega imagem nem faz layout: não há altura para medir, e `aspect-ratio` não é resolvido. Além disso não existe ramo de código a cobrir — a reserva é puramente CSS, sem `onError` em nenhum `img` do projeto, de propósito | `src/components/landing/SpecSheet.jsx:66` (`aspect-[4/3] … md:min-h-[320px]`), `src/components/landing/Gallery.jsx:44` (`aspect-[42/29]`), `src/components/configurator/steps/ColorStep.jsx:31` (`min-h-[260px]`) |
| Edge case — abaixo de 768px o configurador empilha em coluna única | **Limitação do ambiente.** O breakpoint é media query do Tailwind; o jsdom não avalia media query e a suíte roda com `css: false`. O indicador de passos, que é a parte acessível do critério, está testado por papel (`tablist`/`tab`) e por teclado, o que não depende de largura | `src/components/configurator/Configurator.jsx:169` (`grid-rows-[auto_minmax(0,1fr)] … md:grid-cols-…`) e `src/components/configurator/Stepper.jsx:102` (`flex … md:flex-col`) |
| AC MT07-10.5 — conteúdo textual legível se o JS de animação não executar | **Lacuna de precisão da spec.** A página é React: sem JS não há DOM nenhum, então "o JS de animação não executa" não tem cenário observável isolado dentro da suíte. O que a AC quer dizer, na prática, é que nada de textual fica *dependendo* da animação terminar — e isso está coberto por dois lados: o ramo de movimento reduzido entrega o conteúdo em estado final (`reduced-motion.test.jsx`), e a barra da ficha nasce com a largura do dado, não de `scaleX` animado (`SpecSheet.test.jsx`, AD-015) | `src/components/ui/Reveal.jsx:22`, `src/components/landing/SpecSheet.jsx:56`, `src/styles/index.css:74` |
| AC MT07-02.1 (parte) — primeira dobra "sem exigir rolagem" | **Lacuna de precisão da spec.** A spec não fixa altura de referência nem viewport de teste, e o jsdom não tem viewport. O conteúdo da dobra (nome, subtítulo, três números e preço) está todo asserido | `src/components/landing/Hero.jsx:33` (`min-h-[560px]`) |
| AC MT07-02.4 — encaixe da imagem seguinte no início do trilho | **Limitação do ambiente**, agora com o contrato travado. O jsdom não rola nem faz snap; o teste trava o que o navegador executa (eixo, obrigatoriedade, ponto de encaixe por item e rolagem contida no trilho), não o encaixe em si | `src/components/landing/Gallery.jsx:31`, `:37`; teste em `src/components/landing/__tests__/Gallery.test.jsx` |

Ficam de fora desta lista, por já terem virado assertiva: M6, M14, M15, M16,
M17, M18, M19, M20, e as ACs MT07-10.2 e 10.3.

---

## Sensor de discriminação

**Isolamento**: `git worktree add <scratch>/sensor HEAD --detach`, com
`node_modules` por symlink. Nenhum `git stash`, nenhum `git checkout` na árvore
real. Cada mutante foi aplicado sozinho, a suíte inteira rodou, e o scratch foi
revertido com `git checkout -- .` dentro dele. Ao final: `git worktree remove
--force` + `git worktree prune`; `git status --porcelain` da árvore real voltou
**vazio**, idêntico ao baseline, e `git diff HEAD` ficou vazio.

**Profundidade**: P0-full (fluxo de pagamento e integridade de preço) — 20
mutações manuais de comportamento, acima do mínimo de 5.

| # | Arquivo:linha | Mutação | Morto? |
| - | ------------- | ------- | ------ |
| M1 | `src/hooks/useConfigurator.js:63` | preço: `+ optionsTotal` → `+ optionsTotal + DELIVERY_PRICE` (entrega dentro do subtotal) | ✅ Morto — 7 testes / 2 arquivos |
| M2 | `src/hooks/useConfigurator.js:53` | preço: `BASE_PRICE + (color?.surcharge ?? 0)` → `BASE_PRICE` (acréscimo de cor ignorado) | ✅ Morto — 3 testes |
| M3 | `src/hooks/useConfigurator.js:61` | preço: `sum + option.price` → `sum + option.price * 2` (opcional somado duas vezes) | ✅ Morto — 5 testes |
| M4 | `src/hooks/useConfigurator.js:99` | navegação: guarda de `goTo` desligada (salto adiante sem validar) | ✅ Morto — 1 teste |
| M5 | `src/hooks/useConfigurator.js:81` | navegação: piso do clamp removido (`previous` passa do primeiro) | ✅ Morto — 1 teste |
| M6 | `src/hooks/useConfigurator.js:81` | navegação: teto do clamp removido (`next` passa do último → `step: undefined`) | ❌ **SOBREVIVEU** |
| M7 | `src/lib/validation.js:66`–`:67` | validação: checagem dos dois dígitos verificadores do CPF removida | ✅ Morto — 2 testes |
| M8 | `src/lib/validation.js:26` | validação: `EMAIL_PATTERN` sem `\.[a-z]{2,}` (aceita e-mail sem domínio.tld) | ✅ Morto — 3 testes |
| M9 | `src/lib/validation.js:100`–`:101` | validação: comparação de vencimento removida (aceita cartão vencido) | ✅ Morto — 2 testes |
| M10 | `src/hooks/useConfigurator.js:172` | envio: `status: submitting` → `confirmed` (confirma sem carregamento) | ✅ Morto — 1 teste |
| M11 | `src/hooks/useConfigurator.js:163` | envio: `if (firstInvalid)` → `if (false && firstInvalid)` (confirma com formulário inválido) | ✅ Morto — 1 teste |
| M12 | `src/components/configurator/Stepper.jsx:112` | a11y: `aria-selected={selected}` → `aria-selected` (sempre verdadeiro) | ✅ Morto — 1 teste |
| M13 | `src/components/configurator/Configurator.jsx:79` | a11y: `previouslyFocused.focus()` removido (foco não volta ao gatilho) | ✅ Morto — 2 testes |
| M14 | `src/lib/validation.js:19` | mensagem: `"Cartão vencido"` → `"Data do cartão no passado"` | ❌ **SOBREVIVEU** |
| M15 | `src/lib/validation.js:20` | mensagem: `"CVV inválido"` → `"Código de segurança inválido"` | ❌ **SOBREVIVEU** |
| M16 | `src/components/ui/Reveal.jsx:9` | motion: `OFFSET = 24` → `96` (viola o teto da AC MT07-10.1) | ❌ **SOBREVIVEU** |
| M17 | `src/components/ui/Reveal.jsx:22` | motion: ramo `prefers-reduced-motion` desligado | ❌ **SOBREVIVEU** |
| M18 | `src/components/landing/SpecSheet.jsx:15` | ficha: `barWidth` → `"100%"` fixo (barra ignora o `ratio`) | ❌ **SOBREVIVEU** |
| M19 | `src/components/layout/Footer.jsx:77`–`:78` | rodapé: crédito de autoria e aviso não comercial removidos | ❌ **SOBREVIVEU** |
| M20 | `src/components/landing/Gallery.jsx:37` | galeria: `snap-start` removido do item do trilho | ❌ **SOBREVIVEU** |

**Sensor**: 20 mutações, **11 mortas, 9 sobreviventes** — ❌ não discriminante.

### O sobrevivente mais grave: M6, um teste que passa pelo motivo errado

`src/hooks/__tests__/useConfigurator.test.jsx:170`–`:177` promete travar a AC
MT07-05.4 no estado ("mantém o último passo quando pedem o próximo"), mas a
assertiva `expect(result.current.state.step).toBe(LAST_STEP)` (`:176`) é
satisfeita pelo **portão de validação**, não pelo clamp: o helper `advanceTo`
(`:75`–`:82`) não preenche o passo de destino, então no passo de pagamento o
`next` sai em `errorsOfStep` (`src/hooks/useConfigurator.js:104`–`:105`) antes de
chegar a `stepAt(stepIndex(state.step) + 1)`.

Prova executada no scratch, com M6 aplicado e o formulário de pagamento
**válido**: `PROBE step apos next no ultimo passo: undefined` →
`AssertionError: expected undefined to be 5`. Sem M6 o código real clampa
corretamente (`src/hooks/useConfigurator.js:81`), ou seja **não há defeito em
produção** — há um teste que não cobre o que diz cobrir. A Test Coverage Matrix
(`tasks.md:23`) exige do hook justamente "edge cases de limite (primeiro/último
passo)".

---

## Qualidade de código

| Princípio | Estado |
| --------- | ------ |
| Código mínimo, sem feature além do pedido | ✅ |
| Sem abstração para uso único | ✅ — `Field`/`FieldGrid` servem 3 passos (AD-019); `Stepper` substitui 5 blocos duplicados |
| Sem "flexibilidade" desnecessária | ✅ |
| Só arquivos necessários tocados | ✅ |
| Não "melhorou" código alheio | ✅ |
| Segue os padrões do projeto | ✅ — anti-hardcode (0 hex em componente), formatadores centralizados (`src/lib/currency.js`), BRL completo, rótulo sem ícone |
| Testes mapeiam ACs e não são rasos | ⚠️ — 1 teste passa pelo motivo errado (M6); 5 ACs de P1/P2/P3 sem nenhuma assertiva |
| Checagem ancorada na spec (valor assertado = valor da spec) | ❌ — 3 dos 6 textos que a AC MT07-09.6 fixa não estão travados (M14, M15) |
| Coverage Expectation por camada | ❌ — "Lógica pura: 1:1 com as ACs" não vale para os textos de `MESSAGES`; "Hook: edge cases de limite" não vale para o teto do último passo |
| Todo teste mapeia a um AC / edge case / done-when | ✅ — nenhum teste órfão encontrado nos 16 arquivos |
| Diretrizes documentadas do projeto seguidas | ✅ — `tasks.md:18` registra "guidelines encontradas: nenhuma; defaults fortes aplicados" |

### Achados extra (não são ACs; nenhum quebra teste ou gate)

1. **`Stepper` contraria a AD-026.** A decisão diz "navegação por posição em
   `STEPS`, não por aritmética no id", e o hook obedece
   (`src/hooks/useConfigurator.js:75`–`:83`). Mas
   `src/components/configurator/Stepper.jsx:64` decide o destravamento por
   `step.id <= furthest` — aritmética de id. Com ids não contíguos ou
   reordenados, o trilho ofereceria abas que o hook recusaria. Latente hoje
   (ids 1–5 contíguos), inconsistente já.
2. **Divergência de contagem na spec.** `spec.md:244` afirma "113 testes"; a
   suíte tem **123** (e `.specs/STATE.md:44` já diz 123).
3. **`Configurator.jsx:87`** calcula `progress` com `position / STEPS.length`;
   `current` vem de `STEPS.find` (`:85`) e é desreferenciado em `:184`
   (`current.label`) sem guarda. Inalcançável pelo fluxo atual, porque `clampStep`
   garante id válido — anotado só como fragilidade.

---

## Gates

Executados por este Verifier na árvore real, em `HEAD = 4429c27`.

| Gate | Comando | Saída | Código |
| ---- | ------- | ----- | ------ |
| Quick/Full | `npm test -- --run` | `Test Files 16 passed (16)` · `Tests 123 passed (123)` · `Duration 8.51s` | 0 |
| Lint | `npm run lint` | saída vazia (`eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0`) — 0 erro, 0 aviso | 0 |
| Build | `npm run build` | `dist/index.html 0.95 kB` · `dist/assets/index-DD1xBkYD.js 313.06 kB │ gzip: 101.58 kB` · `✓ built in 534ms` | 0 |

- Contagem de testes antes da feature: **0** (`tasks.md:18` — "O repo não tem
  nenhum teste hoje; a suíte nasce nesta feature")
- Contagem depois: **123** em 16 arquivos — delta **+123**
- Testes pulados: **nenhum**
- Falhas: **nenhuma**
- Gate Build composto de `tasks.md:34` (`lint && test && build`): os três verdes

---

## Lacunas priorizadas

### Bloqueantes — teste que não discrimina o que a matriz exige

1. **M6 — o teto do último passo não é testado; a assertiva atual passa pelo
   motivo errado.** AC MT07-05.4. `src/hooks/__tests__/useConfigurator.test.jsx:176`.
   *Fix*: um teste que chegue ao passo de pagamento com o formulário **válido**
   e então chame `next()`, assertando `state.step === LAST_STEP`. Sem preencher
   o passo, a assertiva mede o portão de validação, não o limite.
2. **M14 / M15 — os textos que a AC MT07-09.6 enumera não estão travados.**
   `src/lib/validation.js:18`–`:20` vs `src/lib/__tests__/validation.test.js:103`,
   `:111`, `:133`. *Fix*: assertar os literais `"Validade inválida"`,
   `"Cartão vencido"` e `"CVV inválido"` como já é feito com
   `"Telefone incompleto"` (`:80`), `"CEP incompleto"` (`:89`) e
   `"Número do cartão incompleto"` (`:96`).
3. **M17 — o ramo de `prefers-reduced-motion` não tem guarda.** AC MT07-10.4,
   com ramo explícito em `src/components/ui/Reveal.jsx:22`,
   `src/components/configurator/Configurator.jsx:230` e
   `src/components/configurator/steps/ColorStep.jsx:44`. *Fix*: simular
   `useReducedMotion` (`vi.mock("motion/react")`) e assertar que o conteúdo
   chega no estado final, sem `motion.*`.

### Maiores — AC de P1/P3 sem nenhuma assertiva

4. **M18 — a barra da ficha técnica não é ligada ao `ratio`** (AC MT07-02.3).
   `src/components/landing/SpecSheet.jsx:56`. *Fix*: teste de `SpecSheet`
   assertando `style.width === \`${Math.round(spec.ratio * 100)}%\`` por linha.
   Junto: fechar a **lacuna de precisão da spec** — dizer contra qual teto o
   `ratio` é proporcional, ou reescrever a AC como "proporcional ao `ratio` do
   catálogo".
5. **M20 — o scroll snap da galeria não é asserido** (AC MT07-02.4).
   `src/components/landing/Gallery.jsx:31`, `:37`. *Fix*: assertar as classes
   `snap-x snap-mandatory` no trilho e `snap-start` em cada item.
6. **M19 — crédito de autoria e aviso não comercial do rodapé sem assertiva**
   (AC MT07-12.1). Não existe `Footer.test.jsx`.
   *Fix*: assertar o crédito e o aviso de `src/components/layout/Footer.jsx:77`–`:78`.
7. **AC MT07-02.5 — foco visível não é asserido em nenhum lugar.**
   `src/styles/index.css:58`, `src/components/ui/Button.jsx:9`. *Fix*: assertar a
   classe `focus-visible:*` nos controles, ou documentar que a regra vive só no
   CSS base e sai do escopo de teste.

### Menores

8. **M16 — o teto de 24px do reveal não é asserido** (AC MT07-10.1).
   `src/components/ui/Reveal.jsx:9`. *Fix*: assertar `OFFSET <= 24`.
9. **ACs MT07-10.2, 10.3 (crossfade), 10.5 sem assertiva** —
   `src/components/configurator/Configurator.jsx:233`,
   `src/components/configurator/steps/ColorStep.jsx:52`.
10. **Edge cases sem assertiva**: imagem que falha mantendo altura
    (`src/components/landing/SpecSheet.jsx:66`) e empilhamento abaixo de 768px
    (`src/components/configurator/Configurator.jsx:169`). Ambos são CSS puro; se
    ficarem fora do escopo de teste, dizê-lo na matriz em vez de deixar o AC solto.
11. **AC MT07-08.6 e 08.7 asseridas em um passo só** — replicar o contador e o
    "rótulo sem ícone" nos passos de entrega e pagamento, ou testá-los em
    `src/components/ui/Field.jsx` diretamente.
12. **Achados extra 1–3** da seção de qualidade: `Stepper.jsx:64` contra a
    AD-026, `spec.md:244` dizendo 113 testes, `Configurator.jsx:85`/`:184` sem
    guarda em `current`.

---

## Atualização da rastreabilidade

| Requisito | Status anterior | Novo status |
| --------- | --------------- | ----------- |
| MT07-01 | Done | ✅ Verificado (inspeção + build gate, conforme a matriz) |
| MT07-02 | Done | ❌ Precisa de correção (AC 2.5 sem assertiva) |
| MT07-03 | Done | ❌ Precisa de correção (AC 2.3 — M18 sobreviveu) |
| MT07-04 | Done | ❌ Precisa de correção (AC 2.4 — M20 sobreviveu) |
| MT07-05 | Done | ❌ Precisa de correção (AC 5.4 — M6 sobreviveu) |
| MT07-06 | Done | ✅ Verificado (M1, M2, M3 mortos) |
| MT07-07 | Done | ❌ Precisa de correção (edge case sem assertiva) |
| MT07-08 | Done | ✅ Verificado (M7, M8 mortos; AC 8.6/8.7 com ressalva) |
| MT07-09 | Done | ❌ Precisa de correção (AC 9.6 — M14, M15 sobreviveram) |
| MT07-10 | Done | ❌ Precisa de correção (AC 10.1, 10.4 — M16, M17 sobreviveram) |
| MT07-11 | Done | ✅ Verificado (3 gates verdes; grep de dep morta limpo) |
| MT07-12 | Done | ❌ Precisa de correção (AC 12.1 — M19 sobreviveu) |

---

## Resumo

**Geral**: ❌ não está pronto — a implementação está, a suíte não.

**Checagem ancorada na spec**: 27 de 41 critérios cobertos com evidência
`arquivo:linha`; 11 sem assertiva; 3 lacunas de precisão da spec.
**Sensor**: 11 de 20 mutantes mortos, 9 sobreviventes.
**Gates**: 123 testes verdes, lint 0/0, build ok — os três com código 0.

**O que funciona** (comprovado por mutação, não só por teste verde): regra de
preço inteira (base, acréscimo de cor, opcionais, subtotal × total, parcela),
máquina de navegação (limites e recusa de salto adiante), validação brasileira
(CPF com DV, e-mail, telefone, CEP, cartão, validade com vencimento, CVV), ciclo
de envio (carregamento → confirmação, recusa com formulário inválido, reabertura
ao editar), acessibilidade do diálogo (foco preso, devolução do foco ao gatilho,
`inert` no fundo, `aria-selected` fiel), e a limpeza técnica (zero
`styled-components`, zero dep morta, menu por estado do React).

**O que falta**: as 12 lacunas priorizadas acima — 3 bloqueantes, 4 maiores,
5 menores. Nenhuma delas é defeito de comportamento no código de produção.

**Próximo passo**: rotear as lacunas 1–7 como fix tasks para um implementador
(o Verifier é read-only sobre o código), reexecutar o sensor sobre M6, M14, M15,
M17, M18, M19 e M20, e revalidar. Limite de 3 ciclos fix → reverificação antes
de escalar.
