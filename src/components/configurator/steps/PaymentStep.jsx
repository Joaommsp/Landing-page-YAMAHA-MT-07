import PropTypes from "prop-types";

import Button from "../../ui/Button";
import FieldGrid from "../FieldGrid";
import { BASE_PRICE, DELIVERY_PRICE, STEP_IDS } from "../../../data/catalog";
import { formatBRL } from "../../../lib/currency";
import { SUBMIT_STATUS } from "../../../hooks/useConfigurator";
import ModelThumb from "../../../assets/images/banner02.png";

/* Passo 5 — resumo do pedido e pagamento. O cartão desenhado espelha o que se
   digita; nenhum valor é calculado aqui: subtotal e total chegam prontos do
   hook, que é quem sabe a regra (AD-008). */

const EMPTY_OPTIONS = [];

/* Placeholders do cartão: enquanto o campo está vazio o desenho mostra a forma
   do dado, não um valor inventado. */
const CARD_NUMBER_PLACEHOLDER = "•••• •••• •••• ••••";
const CARD_HOLDER_PLACEHOLDER = "NOME DO TITULAR";
const CARD_EXPIRATION_PLACEHOLDER = "MM/AA";

const SUMMARY_COLUMN = "bg-ink-2 p-6";
const LINE_CLASS = "flex items-center gap-3.5 border-b border-line py-3.5";
const THUMB_CLASS =
  "grid h-10 w-14 shrink-0 place-items-center overflow-hidden bg-ink-3";

function SummaryLine({ children, meta, name, price }) {
  return (
    <div className={LINE_CLASS}>
      <span className={THUMB_CLASS}>{children}</span>
      <span>
        <span className="block text-body-sm">{name}</span>
        <span className="label-mono mt-0.5 block text-paper-dim">{meta}</span>
      </span>
      <span className="data-figure ml-auto text-base">{formatBRL(price)}</span>
    </div>
  );
}

SummaryLine.propTypes = {
  children: PropTypes.node,
  meta: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
};

function TotalRow({ big = false, label, value }) {
  return (
    <div
      className={`flex font-mono text-caption text-paper-dim ${
        big ? "mt-1 border-t border-line pt-3.5" : ""
      }`}
    >
      <span>{label}</span>
      <span
        className={`ml-auto tabular-nums text-paper ${
          big ? "data-figure text-2xl" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}

TotalRow.propTypes = {
  big: PropTypes.bool,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

function PaymentStep({
  color,
  options = EMPTY_OPTIONS,
  subtotal,
  total,
  values,
  errors,
  status = SUBMIT_STATUS.idle,
  onChange,
  onSubmit,
}) {
  const submitting = status === SUBMIT_STATUS.submitting;
  const confirmed = status === SUBMIT_STATUS.confirmed;

  const cardNumber = values?.cardNumber || CARD_NUMBER_PLACEHOLDER;
  /* Caixa alta em JS, não em CSS: o cartão físico é gravado em maiúsculas e o
     que se lê na tela precisa ser o que se copia dela. */
  const cardHolder = (values?.cardHolder || CARD_HOLDER_PLACEHOLDER).toUpperCase();
  const cardExpiration = values?.cardExpiration || CARD_EXPIRATION_PLACEHOLDER;

  if (confirmed) {
    return (
      <div
        className="mt-6 border border-cyan bg-ink-2 p-8 text-center"
        role="status"
      >
        <p className="label-mono text-cyan">Pedido confirmado</p>
        <p className="display-tight mt-3 text-section">Sua MT-07 é sua</p>
        <p className="mx-auto mt-4 max-w-[46ch] text-body-sm font-light text-paper-dim">
          Enviamos a confirmação por e-mail com o resumo do pedido. A
          concessionária entra em contato para combinar a entrega.
        </p>
        <p className="data-figure mt-6 text-figure">{formatBRL(total)}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-0.5 pt-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
      <section aria-label="Resumo do pedido" className={SUMMARY_COLUMN}>
        <h4 className="label-mono mb-4 text-khaki">Resumo do pedido</h4>

        <SummaryLine
          meta="1 unidade · 2025"
          name={color ? `Yamaha MT-07 · ${color.name}` : "Yamaha MT-07"}
          price={BASE_PRICE + (color ? color.surcharge : 0)}
        >
          <img alt="" className="h-full w-full object-cover" src={ModelThumb} />
        </SummaryLine>

        <SummaryLine
          meta="Prazo de 15 dias úteis"
          name="Entrega em domicílio"
          price={DELIVERY_PRICE}
        >
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-khaki"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            viewBox="0 0 24 24"
          >
            <path d="M3 16V8h11v8z" />
            <path d="M14 11h4l3 3v2h-7z" />
            <circle cx="7" cy="17" r="1.6" />
            <circle cx="17" cy="17" r="1.6" />
          </svg>
        </SummaryLine>

        {options.map((option) => (
          <SummaryLine
            key={option.id}
            meta="Opcional"
            name={option.name}
            price={option.price}
          >
            <svg
              aria-hidden="true"
              className="h-5 w-5 text-khaki"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              viewBox="0 0 24 24"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </SummaryLine>
        ))}

        <div className="mt-4 flex flex-col gap-2.5">
          <TotalRow label="Subtotal da moto" value={formatBRL(subtotal)} />
          <TotalRow label="Entrega" value={formatBRL(DELIVERY_PRICE)} />
          <TotalRow big label="Total do pedido" value={formatBRL(total)} />
        </div>
      </section>

      <section aria-label="Pagamento" className={SUMMARY_COLUMN}>
        <h4 className="label-mono mb-4 text-khaki">Pagamento</h4>

        {/* O cartão é desenho, não formulário: repete o que já está nos campos
            para conferência antes de fechar. */}
        <div
          aria-hidden="true"
          className="relative flex aspect-[1.586] max-w-[360px] flex-col overflow-hidden border border-line bg-gradient-to-br from-ink-3 via-ink-2 to-ink p-5"
        >
          <span className="absolute -top-1/3 right-0 h-[180%] w-[70%] rotate-[8deg] bg-gradient-to-tr from-transparent via-cyan/15 to-transparent" />
          <span className="mt-3.5 h-7 w-9 rounded bg-gradient-to-br from-khaki to-khaki-dim" />
          <span className="mt-auto font-mono text-lg tracking-[0.12em] tabular-nums">
            {cardNumber}
          </span>
          <span className="label-mono mt-3 flex gap-5 text-paper-dim">
            <span>
              Titular
              <b className="mt-1 block text-xs font-normal text-paper">
                {cardHolder}
              </b>
            </span>
            <span>
              Validade
              <b className="mt-1 block text-xs font-normal text-paper">
                {cardExpiration}
              </b>
            </span>
          </span>
        </div>

        <FieldGrid
          columns="pair"
          disabled={submitting}
          errors={errors}
          onChange={onChange}
          stepId={STEP_IDS.PAYMENT}
          values={values}
        />

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button disabled={submitting} onClick={onSubmit}>
            {submitting && (
              <span
                aria-hidden="true"
                className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-ink border-t-transparent"
              />
            )}
            {submitting ? "Enviando pedido" : "Finalizar compra"}
          </Button>

          <p className="label-mono ml-auto text-khaki-dim" role="status">
            {submitting
              ? "Enviando o pedido…"
              : "Simulação — nenhum pagamento é processado"}
          </p>
        </div>
      </section>
    </div>
  );
}

PaymentStep.propTypes = {
  color: PropTypes.shape({
    name: PropTypes.string.isRequired,
    surcharge: PropTypes.number.isRequired,
  }),
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
    })
  ),
  subtotal: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  values: PropTypes.object,
  errors: PropTypes.object,
  status: PropTypes.oneOf(Object.values(SUBMIT_STATUS)),
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default PaymentStep;
