# Redesenho da Landing Page MT-07 — Especificação

## Problem Statement

A landing page da Yamaha MT-07 foi escrita em 2024 e envelheceu no tratamento visual: overlay chapado sobre a foto do hero, tipografia sem escala definida, todas as seções com o mesmo peso e um verde ácido carregando a página inteira. A camada técnica acompanha: `bootstrap` importado sem uso de componente, `react-spinners` sem nenhum import, oito arquivos `styles.js` com cores repetidas e sem tokens, o mesmo bloco de sidebar duplicado cinco vezes no configurador e manipulação de DOM via `classList.toggle` fora do React. O mockup aprovado (direção "editorial de performance") define o alvo visual; falta implementá-lo.

## Goals

- [ ] Aplicar o design system do mockup aprovado em 100% das telas: tokens de cor, tipografia e espaçamento em fonte única, zero hex solto em componente.
- [ ] Migrar a camada de estilo de `styled-components` + `bootstrap` para Tailwind CSS, e o motion de GSAP para Framer Motion, sem perder nenhuma funcionalidade existente.
- [ ] Entregar o configurador de 5 passos com preço reativo, estado de passo visível e um único componente de stepper no lugar dos cinco blocos duplicados.
- [ ] Interface inteiramente em PT-BR com valores monetários em BRL completo.
- [ ] Reduzir dependências: remover `bootstrap`, `react-spinners`, `styled-components` e `gsap` do `package.json`.

## Out of Scope

| Feature | Reason |
| ------- | ------ |
| Backend / persistência de pedido | Projeto é vitrine de portfólio; o checkout permanece simulado, como hoje |
| Gateway de pagamento real | Mesma razão; o cartão é apenas visual |
| Novas rotas ou páginas (ex.: catálogo de motos) | O mockup aprovado cobre uma página única; ampliar é outro escopo |
| Troca das imagens do acervo por novas fotos | Reaproveitar os assets existentes é premissa da direção aprovada |
| Internacionalização (i18n) com troca de idioma | A decisão foi entregar em PT-BR fixo; multi-idioma exigiria infraestrutura própria |
| Migração para TypeScript | Aumenta o diff sem servir ao objetivo visual desta entrega |

---

## Assumptions & Open Questions

| Assumption / decision | Chosen default | Rationale | Confirmed? |
| --------------------- | -------------- | --------- | ---------- |
| Biblioteca de motion | Framer Motion (`motion`) | Foi a recomendação apresentada e aceita junto com a stack; integra com React de forma declarativa e dispensa `useEffect` + seletor de classe como o GSAP exigia | y |
| Idioma da interface | PT-BR fixo | Decidido junto com a aprovação do mockup, que já está em PT-BR | y |
| Acento visual | Icon Blue `#2BD4CF` como acento único | Aprovado no mockup; o verde ácido deixa de ser protagonista | y |
| Versão do Tailwind | Tailwind CSS v4 com tokens em `@theme` | É a versão corrente e dispensa `tailwind.config.js`, mantendo os tokens em CSS junto do resto do tema | n |
| Persistência do carrinho | Nenhuma — estado só em memória React | Não há backend nem requisito de retomar pedido; `localStorage` seria estado sem dono | n |
| Validação de CPF | Formato e dígitos verificadores, sem consulta externa | Feedback imediato ao usuário sem depender de serviço de terceiros | n |
| Preço dos opcionais | Valores do mockup aprovado, num catálogo único | O código atual tem `setPrice(5100)` sobrescrevendo o preço base — comportamento errado que não se preserva | n |
| Framework de teste | Vitest + Testing Library | O projeto não tem teste nenhum; Vitest é o runner nativo do Vite já usado aqui | n |

**Open questions:** none — all resolved or logged above.

**Implicit-requirement dimensions sweep:**

| Dimension | Resolution |
| --------- | ---------- |
| Input validation & bounds | Coberto por MT07-08 (validação e limites dos formulários) |
| Failure / partial-failure states | Coberto por MT07-09 (erro de submissão e estado de carregamento) |
| Idempotency / retry / duplicate handling | N/A because não há chamada de rede nem escrita persistente nesta entrega |
| Auth boundaries & rate limits | N/A because a página é pública e não tem área autenticada |
| Concurrency / ordering | N/A because todo o estado é local a um único componente React |
| Data lifecycle / expiry | N/A because nada é persistido entre sessões (assumption acima) |
| Observability | N/A because não há backend nem coleta de métricas neste projeto de portfólio |
| External-dependency failure | Coberto por MT07-07 (imagem que não carrega não pode deixar buraco no layout) |
| State-transition integrity | Coberto por MT07-05 (navegação entre os 5 passos respeita limites e pré-requisitos) |

---

## User Stories

### P1: Design system em tokens ⭐ MVP

**User Story**: Como pessoa desenvolvedora, quero cor, tipografia e espaçamento definidos num único tema, para que ajustar a identidade não exija caçar hex espalhado por oito arquivos.

**Why P1**: Toda tela redesenhada consome esses tokens; sem eles o redesenho nasce com o mesmo problema do código atual.

**Acceptance Criteria**:

1. The system SHALL definir os tokens de cor `ink`, `ink-2`, `ink-3`, `line`, `khaki`, `paper`, `paper-dim` e `cyan` num único arquivo de tema.
2. The system SHALL expor as três famílias tipográficas do mockup — Archivo (display), Barlow (corpo) e IBM Plex Mono (dado técnico) — como tokens de fonte.
3. WHEN um componente precisa de uma cor da identidade THEN o sistema SHALL fornecê-la por token utilitário, sem literal hexadecimal no componente.
4. The system SHALL manter o valor `#2BD4CF` como acento único da interface.

**Independent Test**: Buscar por `#` seguido de hex nos arquivos de componente retorna zero ocorrências de cor da identidade; o arquivo de tema declara os oito tokens.

---

### P1: Hero e seções da landing ⭐ MVP

**User Story**: Como visitante, quero abrir a página e entender em um olhar qual é a moto, o que ela entrega e por onde comprar, para decidir se sigo.

**Why P1**: É a primeira dobra e a razão de existir da página.

**Acceptance Criteria**:

1. WHEN a página termina de carregar THEN o sistema SHALL exibir nome do produto, subtítulo, os três números de desempenho (689 cc, 74,8 cv, 6,9 kgf.m) e o preço inicial sem exigir rolagem.
2. WHEN a pessoa aciona o botão principal do hero THEN o sistema SHALL abrir o configurador no passo 1.
3. The system SHALL exibir a ficha técnica com uma barra proporcional ao valor de cada especificação.
4. WHILE a pessoa arrasta o trilho da galeria o sistema SHALL alinhar a imagem seguinte ao início do trilho (scroll snap).
5. IF a pessoa navega por teclado THEN o sistema SHALL manter foco visível em todo elemento interativo.

**Independent Test**: Abrir a página, ver hero completo sem rolar, clicar no botão e chegar ao passo 1 do configurador.

---

### P1: Configurador de 5 passos ⭐ MVP

**User Story**: Como comprador, quero escolher cor, opcionais, informar meus dados e o endereço e chegar ao pagamento, para montar e fechar o pedido sem sair da página.

**Why P1**: É o fluxo de conversão da página e a maior fonte de código duplicado hoje.

**Acceptance Criteria**:

1. The system SHALL renderizar o indicador dos 5 passos a partir de um único componente, sem duplicação por passo.
2. WHEN a pessoa seleciona um passo já liberado no indicador THEN o sistema SHALL exibir o painel correspondente àquele passo.
3. WHILE o passo atual é o primeiro o sistema SHALL desabilitar a navegação para o passo anterior.
4. WHILE o passo atual é o último o sistema SHALL desabilitar a navegação para o próximo passo.
5. WHEN a pessoa seleciona uma cor THEN o sistema SHALL trocar a imagem exibida da moto e marcar aquela cor como selecionada.
6. WHEN a pessoa marca um opcional THEN o sistema SHALL somar o preço do opcional ao total, mantendo o preço base de R$ 48.500,00 intacto.
7. WHEN a pessoa desmarca um opcional THEN o sistema SHALL subtrair aquele preço do total.
8. The system SHALL exibir o valor da parcela como o total dividido por 24.
9. IF a pessoa fecha o configurador THEN o sistema SHALL preservar as escolhas já feitas ao reabrir.

**Independent Test**: Abrir o configurador, trocar de cor, marcar dois opcionais e conferir o total somando exatamente os valores do catálogo.

---

### P1: Formulários de dados e entrega ⭐ MVP

**User Story**: Como comprador, quero preencher meus dados e o endereço com feedback imediato de erro, para não descobrir problema só no fim.

**Why P1**: Sem os dois formulários o fluxo de 5 passos não fecha.

**Acceptance Criteria**:

1. IF a pessoa sai de um campo obrigatório vazio THEN o sistema SHALL exibir mensagem de erro naquele campo.
2. IF o e-mail informado não tem a forma `nome@dominio.tld` THEN o sistema SHALL exibir "Informe um e-mail válido" naquele campo.
3. IF o CPF informado não tem 11 dígitos ou falha na checagem dos dígitos verificadores THEN o sistema SHALL exibir "CPF inválido" naquele campo.
4. WHEN a pessoa digita no campo de CPF, telefone ou CEP THEN o sistema SHALL aplicar a máscara correspondente ao formato brasileiro.
5. WHILE algum campo do passo tem erro o sistema SHALL impedir o avanço para o passo seguinte.
6. The system SHALL exibir contador de caracteres em todo campo de texto com limite máximo.
7. The system SHALL rotular todo campo sem ícone decorativo no rótulo.

**Independent Test**: Digitar `joao@exemplo` no e-mail, tentar avançar, ver o erro e a navegação bloqueada.

---

### P1: Pagamento e resumo do pedido ⭐ MVP

**User Story**: Como comprador, quero ver o resumo do que estou levando e preencher o cartão vendo o número aparecer no cartão desenhado, para conferir antes de fechar.

**Why P1**: Último passo do fluxo; sem ele o configurador não conclui.

**Acceptance Criteria**:

1. The system SHALL listar no resumo a moto com a cor escolhida, a entrega e cada opcional selecionado, com seus respectivos preços.
2. WHEN a pessoa digita o número do cartão THEN o sistema SHALL refletir os dígitos no cartão exibido, agrupados de quatro em quatro.
3. WHEN a pessoa digita o nome do titular THEN o sistema SHALL refletir o nome em caixa alta no cartão exibido.
4. The system SHALL exibir todo valor monetário em BRL por extenso (ex.: `R$ 48.500,00`), sem notação abreviada.
5. WHEN a pessoa aciona "Finalizar compra" com o formulário válido THEN o sistema SHALL exibir estado de carregamento e, ao fim, a confirmação do pedido.
6. IF a pessoa aciona "Finalizar compra" com algum campo inválido THEN o sistema SHALL manter o passo atual e apontar o campo com erro.

**Independent Test**: Preencher o cartão, ver o número espelhado no cartão desenhado e finalizar vendo a confirmação.

---

### P2: Motion com função

**User Story**: Como visitante, quero que a página responda ao que eu faço com movimento discreto, para que a navegação pareça viva sem me atrapalhar.

**Why P2**: Eleva o resultado, mas a página cumpre a função sem isso.

**Acceptance Criteria**:

1. WHEN uma seção entra na viewport THEN o sistema SHALL revelá-la a partir de um deslocamento de no máximo 24px.
2. WHEN a pessoa troca de passo no configurador THEN o sistema SHALL animar a transição entre os painéis.
3. WHEN a pessoa troca a cor da moto THEN o sistema SHALL fazer crossfade entre as imagens.
4. IF o sistema operacional pede movimento reduzido (`prefers-reduced-motion: reduce`) THEN o sistema SHALL exibir todo conteúdo em estado final, sem animação.
5. The system SHALL manter todo conteúdo textual legível mesmo se o JavaScript de animação não executar.

**Independent Test**: Ativar "reduzir movimento" no sistema operacional e conferir que nada anima e nada some.

---

### P2: Limpeza da base técnica

**User Story**: Como pessoa desenvolvedora, quero o projeto sem dependência morta e sem manipulação de DOM fora do React, para que a manutenção não esbarre em código que não serve a nada.

**Why P2**: Não é visível ao usuário final, mas é metade da razão do retrabalho.

**Acceptance Criteria**:

1. The system SHALL declarar em `package.json` apenas dependências efetivamente importadas pelo código.
2. The system SHALL abrir e fechar o menu mobile por estado do React, sem `document.querySelector` nem `classList.toggle`.
3. The system SHALL manter zero arquivo `styles.js` de `styled-components` no diretório `src`.
4. WHEN o projeto é construído com `npm run build` THEN o sistema SHALL concluir sem erro.
5. WHEN o projeto é analisado com `npm run lint` THEN o sistema SHALL concluir sem erro e sem aviso.

**Independent Test**: `npm run build` e `npm run lint` passam; `grep -r "styled-components" src` não retorna nada.

---

### P3: Rodapé e navegação

**User Story**: Como visitante, quero um rodapé com os links do site e o crédito de autoria, para saber quem fez e onde encontrar mais.

**Why P3**: Complementa a página; nada do fluxo principal depende dele.

**Acceptance Criteria**:

1. The system SHALL exibir no rodapé o crédito de autoria e o aviso de uso não comercial.
2. WHEN a pessoa aciona um link de âncora do cabeçalho THEN o sistema SHALL rolar até a seção correspondente.

**Independent Test**: Clicar em "A moto" no cabeçalho e chegar à seção da ficha técnica.

---

## Edge Cases

- IF uma imagem do acervo falhar ao carregar THEN o sistema SHALL manter a altura reservada do bloco, sem deslocar o conteúdo vizinho.
- IF a pessoa não seleciona nenhum opcional THEN o sistema SHALL exibir o total igual ao preço base de R$ 48.500,00.
- IF a pessoa seleciona todos os opcionais do catálogo THEN o sistema SHALL exibir o total igual ao preço base somado a todos os opcionais.
- WHEN a largura da tela é menor que 768px THEN o sistema SHALL empilhar o configurador em coluna única, mantendo o indicador de passos acessível.
- IF o valor de um campo mascarado é colado já formatado THEN o sistema SHALL preservar apenas os dígitos e reaplicar a máscara.
- IF a pessoa navega até o último passo e volta ao primeiro THEN o sistema SHALL manter as seleções de cor e opcionais.

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| -------------- | ----- | ----- | ------ |
| MT07-01 | P1: Design system em tokens | Implementing | In Tasks |
| MT07-02 | P1: Hero e seções da landing | Design | Pending |
| MT07-03 | P1: Hero e seções da landing (ficha técnica) | Design | Pending |
| MT07-04 | P1: Hero e seções da landing (galeria) | Design | Pending |
| MT07-05 | P1: Configurador de 5 passos | Design | Pending |
| MT07-06 | P1: Configurador de 5 passos (preço) | Design | Implementing |
| MT07-07 | P1: Hero e seções da landing (imagens) | Design | Pending |
| MT07-08 | P1: Formulários de dados e entrega | Design | Pending |
| MT07-09 | P1: Pagamento e resumo do pedido | Design | Implementing |
| MT07-10 | P2: Motion com função | Design | Pending |
| MT07-11 | P2: Limpeza da base técnica | Design | Pending |
| MT07-12 | P3: Rodapé e navegação | - | Pending |

**Coverage:** 12 total, 0 mapeados para tasks, 12 pendentes.

---

## Success Criteria

- [ ] `npm run build` e `npm run lint` concluem sem erro nem aviso.
- [ ] A suíte de testes cobre cada AC dos P1 e passa inteira.
- [ ] `package.json` não lista `bootstrap`, `react-spinners`, `styled-components` nem `gsap`.
- [ ] Nenhum arquivo em `src/components` contém literal hexadecimal de cor da identidade.
- [ ] O fluxo de compra vai do hero à confirmação do pedido em 5 passos, com o total correto em BRL completo.
