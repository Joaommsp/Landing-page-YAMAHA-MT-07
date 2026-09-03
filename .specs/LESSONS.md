# LESSONS - auto-maintained by scripts/lessons.py

> Machine-owned. Do NOT hand-edit. Changes are overwritten on the next `lessons.py` write.
> Canonical state lives in `.specs/lessons.json`. Edit lessons only via the script.
> promote_threshold=2 distinct features · window_days=45 · quarantine_threshold=2

## Confirmed (load these at Specify/Design)

Corroborated across multiple features. Safe to apply as guidance.

_none_

## Candidates (under observation - do NOT load as guidance yet)

Seen once or not yet corroborated. Tracked, not trusted.

### L-001 - Ao testar um clamp de limite de estado, chegue ao limite pelo caminho válido antes de assertar o clamp, ou a assertiva pode medir o portão de validação anterior em vez do limite.
- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `hooks` · harmful: 0
- features: redesign-mt07
- evidence: M6 — src/hooks/useConfigurator.js:79, src/hooks/__tests__/useConfigurator.test.jsx (hooks)
- last seen: 2026-09-03T15:09:59Z

### L-002 - Quando a spec disser 'proporcional ao valor' sem fixar o teto da categoria, registrar a decisão de que o número é de direção de arte e travar o elo dado→visual, não o cálculo implícito que a spec não define.
- signal: `spec_precision_gap` · recurrence: 1 feature(s) · scope: `landing` · harmful: 0
- features: redesign-mt07
- evidence: AC MT07-02.3 (SpecSheet ratio), AD-030 (landing)
- last seen: 2026-09-03T15:09:59Z

### L-003 - Critério de app React que presume DOM sem JS ('legível sem animação', 'sem rolagem' sem viewport de referência) não tem cenário isolável em teste de componente — registrar como lacuna de precisão da spec em vez de simular o inexistente.
- signal: `spec_precision_gap` · recurrence: 1 feature(s) · scope: `spec` · harmful: 0
- features: redesign-mt07
- evidence: AC MT07-10.5 e AC MT07-02.1 (parte), validation.md (spec)
- last seen: 2026-09-03T15:09:59Z

### L-004 - Preço derivado (base + acréscimo) deve ter uma função só, consumida pelo hook e pela apresentação — nunca recalculado num componente de tela, que diverge da fonte quando o dado muda.
- signal: `spec_deviation` · recurrence: 1 feature(s) · scope: `configurator` · harmful: 0
- features: redesign-mt07
- evidence: AD-022 (2ª entrada, STATE.md) — achado bloqueante do revisor de reúso (configurator)
- last seen: 2026-09-03T15:10:06Z

### L-005 - Nome de seção/campo repassado entre camadas como string solta falha em silêncio (no-op) se um lado divergir do outro — resolver a partir de uma fonte única no reducer, nunca duplicar o identificador entre chamador e callee.
- signal: `spec_deviation` · recurrence: 1 feature(s) · scope: `configurator` · harmful: 0
- features: redesign-mt07
- evidence: AD-027, STATE.md — setField(name, value) por seção resolvida no reducer (configurator)
- last seen: 2026-09-03T15:10:06Z

## Quarantined (failed when applied - ignore)

A confirmed lesson that recurred alongside failure. Kept for the maintainer to review.

_none_
