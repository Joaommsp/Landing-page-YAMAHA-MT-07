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
| AD-020 | O passo de pagamento não traz as abas de forma de pagamento (Cartão/Pix/Financiamento) que o mockup desenha | Só o cartão é simulado nesta entrega; três abas em que duas não fazem nada seriam controle morto na tela. Se Pix e financiamento entrarem, entram com comportamento | 2026-09-03 |
| AD-021 | Fechar o configurador não desmonta o shell: ele fica montado e devolve `null` | O estado vive no `useConfigurator` dentro do shell; desmontar apagaria cor e opcionais, e a spec exige que reabrir preserve as escolhas. Como nada se perde ao fechar, a saída também não precisa de diálogo de confirmação | 2026-09-03 |
| AD-022 | Sem roteador: `main.jsx` renderiza a `Home` direto; `App.jsx`, `AppRoutes.jsx` e `react-router-dom` saem | Duas rotas apontavam para a mesma página e nada no projeto navega por rota — a navegação é por âncora. `AppRoutes` era indireção vazia e o roteador, dependência sem uso, contra a AC1 de MT07-11. O número segue a sequência do log: AD-018 já estava tomada pelos ids do configurador | 2026-09-03 |
| AD-022 | O preço da moto (base + acréscimo da cor) é derivado do hook (`motorcyclePrice`), e a miniatura do resumo é a foto da própria cor | O passo de pagamento recalculava `BASE_PRICE + surcharge` e mostrava um asset fixo: escolher Blood White exibia o nome de uma cor ao lado da foto de outra, e a regra de preço tinha duas donas (achado BLOQUEANTE do revisor de reúso) | 2026-09-03 |
| AD-023 | `MODEL_YEAR` e `DELIVERY_LEAD_TIME_DAYS` vivem no catálogo | Ano do modelo e prazo de entrega estavam cravados na copy do hero e do resumo, ao lado de `DELIVERY_PRICE`, que já vinha do catálogo | 2026-09-03 |
| AD-024 | Pedido em envio tranca trilho, Anterior e Próximo; fechar segue liberado | Voltar a um passo de formulário durante o envio e digitar disparava `setField`, que zera o `status` e mata o temporizador: o pedido era cancelado em silêncio. Fechar é saída, não edição, e não cancela nada (achado BLOQUEANTE) | 2026-09-03 |
| AD-025 | A curva de movimento vive em `src/lib/motion.js` (`EASE_EDITORIAL`) | O array `[0.22, 1, 0.36, 1]` estava redigitado em três componentes além do token `--ease-editorial` do tema; o motion é JS e não lê o `@theme`, então o espelho precisa ser único | 2026-09-03 |

| AD-026 | Navegação do configurador por posição em `STEPS`, não por aritmética no id | `step ± 1` contrariava a promessa do catálogo de que reordenar os passos não muda o significado de ninguém; id não contíguo levaria a passo inexistente e quebra em `current.label` | 2026-09-03 |
| AD-027 | `setField(name, value)` — a seção sai do passo atual, dentro do reducer | O shell repassava `"personal"`/`"delivery"`/`"payment"` à mão; divergência de nome virava no-op silencioso e o campo não digitava | 2026-09-03 |
| AD-028 | O diálogo do configurador vive num portal em `document.body`, com `inert` no `#root` e rolagem travada | Sem isso a landing seguia rolando e navegável por leitor de tela atrás do modal; o `inert` no root alcançaria o próprio diálogo se ele continuasse dentro da árvore da página | 2026-09-03 |
| AD-029 | Porta de desenvolvimento fixa em 9000 (`strictPort`), preview em 9001 | Pedido do dono do projeto; `strictPort` falha alto em vez de subir noutra porta em silêncio | 2026-09-03 |
| AD-030 | A barra da ficha técnica é proporcional ao `ratio` do catálogo, e o `ratio` é número de direção de arte — não proporção calculada do valor contra o teto da categoria | A AC MT07-02.3 diz "proporcional ao valor de cada especificação" e não define teto de categoria nenhum (689 cc → 0,86; 184 kg → 0,52 não saem da mesma conta). O que o código promete, e o que o teste trava, é o elo barra ↔ `ratio`: mudar o `ratio` muda a barra, e nada mais a muda | 2026-09-03 |
| AD-031 | Critério que não vira assertiva honesta no ambiente da suíte é REGISTRADO com motivo em `validation.md`, não convertido em assertiva de string de classe | Foco visível, snap de rolagem, altura reservada de imagem e breakpoint são resolvidos pelo navegador; o jsdom não avalia `:focus-visible`, não faz layout e não lê media query, e a suíte roda com `css: false`. Assertar `toHaveClass("focus-visible:outline-2")` provaria o `className`, não o comportamento — teste que passa sem medir nada é pior que lacuna declarada. Onde há contrato que o navegador executa (eixo do snap, ponto de encaixe), o contrato é travado e o limite é dito | 2026-09-03 |

## Handoff

**Feature**: redesign-mt07
**Branch**: `feat/redesign-2026` (árvore limpa, NADA empurrado)
**Data**: 2026-09-03
**Estado**: 25 tasks + 5 fix tasks de implementação + 6 fix tasks de cobertura (F1) concluídas. Gates: **141 testes / 22 arquivos** verdes, `npm run lint` sem erro nem aviso, `npm run build` verde. Dev server do dono do projeto em http://localhost:9000 (não subir outro).

**As 12 lacunas do Verifier estão fechadas.** O relatório de 2026-09-03
(`validation.md`) deu FAIL por **cobertura**, não por comportamento: 9 mutantes
sobreviveram e 11 critérios não tinham assertiva. Os 6 commits desta rodada:

- `test(hooks): exercise the last-step clamp for real` — M6, o teste que passava pelo portão de validação em vez do clamp (AC MT07-05.4);
- `test(lib): pin the exact validation messages the spec names` — M14/M15, os textos que a spec enumera agora travados como literal;
- `test(motion): cover the reduced-motion branches` — M17, os três ramos de `prefers-reduced-motion` com `vi.mock("motion/react")`;
- `test(landing): tie the spec bars to the catalog ratio` — M18, barra ↔ `ratio` do catálogo (AD-030);
- `test(landing): cover the gallery snap track and the footer credit` — M20 e M19;
- `test(ui): cover the remaining motion and layout criteria` — M16 e as ACs MT07-10.2/10.3, mais o registro dos critérios que não viram assertiva honesta (AD-031);
- `fix(configurator): unlock steps by position, not by id` — **único achado de código**: `Stepper` destravava aba por aritmética de id, contra a AD-026. Latente com os ids atuais; o teste chega pela lista invertida por mock do catálogo, onde as duas contas divergem.

Cada assertiva nova foi provada por mutação (mutação aplicada → teste falha →
arquivo restaurado de cópia `cp`; sem `git stash` e sem `git checkout` na
árvore). Nenhum teste existente foi enfraquecido ou removido.

**Próximo passo (obrigatório antes de declarar a feature pronta)**: **reverificação** por um Verifier independente sobre `main..HEAD` — quem implementou não vira o próprio veredito, e o `validation.md` segue com **Result: FAIL** até isso. O sensor precisa reexecutar M6, M14, M15, M16, M17, M18, M19, M20 e a aritmética de id do `Stepper`, todos esperados **mortos** agora. Depois, `python3 <skill-dir>/scripts/validate_state.py redesign-mt07` tem de sair 0. Limite de 3 ciclos fix → reverificação antes de escalar (este é o 1º).

**Fora de escopo por decisão, não por esquecimento** (ver `validation.md`, seção "Lacunas registradas em vez de testadas"): foco visível (AC MT07-02.5), imagem que falha mantendo altura, coluna única abaixo de 768px, "sem exigir rolagem" da primeira dobra e o cenário "sem JS de animação" da AC MT07-10.5. Todos com motivo escrito e o lugar onde a regra vive de fato (AD-031).

**Pendências de produto, não de código**:
- As capturas na raiz (`MacBook Pro-*.jpeg`, `iPhone 12 Pro-*.jpeg`) são do design ANTIGO; o README já as rotula como "antes". Faltam as capturas do redesenho.
- Imagens dos modelos ainda são PNG de ~3 MB (`racingBlue`, `lightBlue`, `silverBlue`). Converter para WebP responsivo ficou fora do escopo das tasks.
- `validateCard` exige 16 dígitos exatos — Amex (15) é recusada. Limitação conhecida.
- A parcela usa `subtotal / 24` com arredondamento normal (R$ 2.020,83); o mockup mostrava R$ 2.020,84, arredondado para cima por engano.
- Sugestão menor recusada: esconder o botão "Próximo" no último passo. A AC MT07-05.4 manda **desabilitar**, e há teste fixando isso.
- `Configurator.jsx:85`/`:184` desreferenciam `current` sem guarda. Segue **inalcançável** (o clamp garante id válido) e sem correção de propósito: a guarda seria ramo que nenhum teste honesto alcança. Registrado em `validation.md`, com o gatilho que a traria de volta (passo vindo de fora do hook).

**Mockup aprovado**: artifact `https://claude.ai/code/artifact/35c48844-4f20-4608-936e-87a678a915ae`, fonte em `scratchpad/mt07-redesign.src.html`.
