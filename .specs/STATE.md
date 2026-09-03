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

## Handoff

**Feature**: redesign-mt07
**Branch**: `feat/redesign-2026` (árvore limpa, NADA empurrado)
**Data**: 2026-09-03
**Estado**: 25 tasks + 5 fix tasks implementadas. Gates: 123 testes / 16 arquivos verdes, `npm run lint` sem erro nem aviso, `npm run build` verde. Dev server em http://localhost:9000.

**Achados de revisão: todos fechados.** Os 7 que estavam abertos saíram no commit `fix(configurator): close the review findings still open` — foco preso contando abas com `tabindex="-1"`, seção de campo duplicada no shell, navegação por aritmética de id, prop `panelId` sem chamador, `aria-orientation` fixa contra o layout, fundo rolando atrás do modal e erro de blur sobrevivendo à troca de passo. Quatro testes novos cobrem o que não tinha cobertura, cada um validado por mutação.

**Próximo passo (obrigatório antes de declarar a feature pronta)**: rodar o Verifier independente da fase 9 do Execute (author ≠ verifier) sobre `main..HEAD`, que precisa escrever `.specs/features/redesign-mt07/validation.md` com veredito PASS, evidência `file:line` por AC e resultado do sensor de discriminação. Depois, `python3 <skill-dir>/scripts/validate_state.py redesign-mt07` tem de sair 0.

**Pendências de produto, não de código**:
- As capturas na raiz (`MacBook Pro-*.jpeg`, `iPhone 12 Pro-*.jpeg`) são do design ANTIGO; o README já as rotula como "antes". Faltam as capturas do redesenho.
- Imagens dos modelos ainda são PNG de ~3 MB (`racingBlue`, `lightBlue`, `silverBlue`). Converter para WebP responsivo ficou fora do escopo das tasks.
- `validateCard` exige 16 dígitos exatos — Amex (15) é recusada. Limitação conhecida.
- A parcela usa `subtotal / 24` com arredondamento normal (R$ 2.020,83); o mockup mostrava R$ 2.020,84, arredondado para cima por engano.
- Sugestão menor recusada: esconder o botão "Próximo" no último passo. A AC MT07-05.4 manda **desabilitar**, e há teste fixando isso.

**Mockup aprovado**: artifact `https://claude.ai/code/artifact/35c48844-4f20-4608-936e-87a678a915ae`, fonte em `scratchpad/mt07-redesign.src.html`.
