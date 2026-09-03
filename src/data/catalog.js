import { Model } from "../assets/images/models/models";
import { Optionals } from "../assets/images/optionals/optionals";
import GalleryDetail from "../assets/images/gellery/exportGallery";
import kitImage from "../assets/images/optionals-bg.png";
import gallery1 from "../assets/images/gallery1.png";
import gallery2 from "../assets/images/gallery2.png";
import gallery3 from "../assets/images/gallery3.png";
import gallery4 from "../assets/images/gallery4.png";
import gallery5 from "../assets/images/gallery5.png";
import gallery6 from "../assets/images/gallery6.png";

/* Fonte única de verdade do produto: preço, cores, opcionais, ficha técnica,
   galeria e passos do configurador. Nenhum desses valores é redeclarado em
   componente. */

export const BASE_PRICE = 48500;
export const DELIVERY_PRICE = 2000;
export const INSTALLMENTS = 24;

export const COLORS = [
  {
    id: "racing-blue",
    name: "Racing Blue",
    hex: "#1E4FA0",
    surcharge: 0,
    image: Model.racingBlue,
  },
  {
    id: "storm-grey",
    name: "Storm Grey",
    hex: "#585C60",
    surcharge: 0,
    image: Model.stormGray,
  },
  {
    id: "blood-white",
    name: "Blood White",
    hex: "#D8D6D1",
    surcharge: 900,
    image: Model.bloodWhite,
  },
];

export const DEFAULT_COLOR_ID = COLORS[0].id;

export const OPTIONS = [
  {
    id: "front-light-projector",
    name: "Projetor auxiliar",
    price: 1800,
    description: "Feixe de LED extra para estrada à noite.",
    image: Optionals.frontLightPrev,
    featured: false,
  },
  {
    id: "windscreen",
    name: "Para-brisa esportivo",
    price: 1250,
    description: "Defletor baixo que tira o vento do peito.",
    image: Optionals.windScreenPrev,
    featured: false,
  },
  {
    id: "tail-light",
    name: "Lanterna traseira LED",
    price: 740,
    description: "Assinatura luminosa mais fina e visível.",
    image: Optionals.tailLightPrev,
    featured: false,
  },
  {
    id: "led-indicator",
    name: "Piscas sequenciais",
    price: 620,
    description: "Setas em varredura, à frente e atrás.",
    image: Optionals.ledIndicatorPrev,
    featured: false,
  },
  {
    id: "dark-side-kit",
    name: "Dark Side of Japan",
    price: 2500,
    description: "Kit de personalização completo em preto fosco.",
    image: kitImage,
    featured: true,
  },
];

/* `ratio` é a fração da barra na ficha técnica: relação do valor com o teto da
   categoria, definida na direção de arte aprovada. `unitShort` é a unidade sem
   a faixa de rotação, para a primeira dobra, que não comporta a linha inteira. */
export const SPECS = [
  {
    id: "displacement",
    name: "Cilindrada",
    value: "689",
    unit: "cc",
    unitShort: "cc",
    ratio: 0.86,
  },
  {
    id: "power",
    name: "Potência máxima",
    value: "74,8",
    unit: "cv @ 8.750 rpm",
    unitShort: "cv",
    ratio: 0.74,
  },
  {
    id: "torque",
    name: "Torque máximo",
    value: "6,9",
    unit: "kgf.m @ 6.500 rpm",
    unitShort: "kgf.m",
    ratio: 0.69,
  },
  {
    id: "weight",
    name: "Peso em ordem de marcha",
    value: "184",
    unit: "kg",
    unitShort: "kg",
    ratio: 0.52,
  },
];

/* Seções da landing: o id da âncora é contrato entre o cabeçalho, o rodapé e a
   própria seção. Fonte única para os três lados nunca divergirem. */
export const SECTION_IDS = {
  hero: "hero",
  specSheet: "ficha-tecnica",
  gallery: "galeria",
};

export function sectionHref(sectionId) {
  return `#${sectionId}`;
}

export const GALLERY = [
  {
    id: "front-three-quarter",
    image: gallery1,
    caption: "Frente de três quartos — farol central e admissão exposta",
    alt: "Yamaha MT-07 vista de três quartos pela frente",
  },
  {
    id: "cp2-engine",
    image: gallery2,
    caption: "Motor CP2 de 689 cc, dois cilindros em paralelo",
    alt: "Detalhe do motor CP2 da Yamaha MT-07",
  },
  {
    id: "chassis",
    image: gallery3,
    caption: "Chassi tubular de aço, 184 kg em ordem de marcha",
    alt: "Chassi tubular da Yamaha MT-07",
  },
  {
    id: "riding-position",
    image: gallery4,
    caption: "Posição de pilotagem ereta, guidão alto e largo",
    alt: "Piloto na posição de pilotagem da Yamaha MT-07",
  },
  {
    id: "rear-suspension",
    image: gallery5,
    caption: "Monoamortecedor traseiro com ajuste de pré-carga",
    alt: "Suspensão traseira da Yamaha MT-07",
  },
  {
    id: "front-brakes",
    image: gallery6,
    caption: "Freio dianteiro de disco duplo com ABS de série",
    alt: "Conjunto de freio dianteiro da Yamaha MT-07",
  },
  {
    id: "cockpit",
    image: GalleryDetail.image01,
    caption: "Painel digital com conta-giros em barra",
    alt: "Painel de instrumentos da Yamaha MT-07",
  },
  {
    id: "profile",
    image: GalleryDetail.image02,
    caption: "Perfil completo — entre-eixos de 1.400 mm",
    alt: "Yamaha MT-07 vista de perfil",
  },
  {
    id: "exhaust",
    image: GalleryDetail.image03,
    caption: "Escapamento lateral curto, saída única",
    alt: "Escapamento da Yamaha MT-07",
  },
];

/* Cada passo é identificado por nome, não por posição no array: quem valida ou
   navega importa o id, e reordenar a lista não muda o significado de ninguém. */
export const STEP_IDS = {
  COLOR: 1,
  OPTIONS: 2,
  PERSONAL: 3,
  DELIVERY: 4,
  PAYMENT: 5,
};

export const STEPS = [
  { id: STEP_IDS.COLOR, label: "Cor", title: "Escolha a cor" },
  { id: STEP_IDS.OPTIONS, label: "Opcionais", title: "Monte o pacote" },
  { id: STEP_IDS.PERSONAL, label: "Dados", title: "Seus dados" },
  { id: STEP_IDS.DELIVERY, label: "Entrega", title: "Endereço de entrega" },
  { id: STEP_IDS.PAYMENT, label: "Pagamento", title: "Pagamento e resumo" },
];

export const FIRST_STEP = STEPS[0].id;
export const LAST_STEP = STEPS[STEPS.length - 1].id;

/* Vocabulário de tipo de campo: escolhe a máscara na entrada e o validador na
   saída. Fica no catálogo para que os dois lados leiam a mesma lista. */
export const FIELD_TYPES = {
  TEXT: "text",
  EMAIL: "email",
  CPF: "cpf",
  PHONE: "phone",
  CEP: "cep",
  CARD: "card",
  EXPIRATION: "expiration",
};

/* Teto do e-mail pela RFC 5321: cortar antes disso trancaria endereço legítimo
   e truncaria valor colado. */
const EMAIL_MAX_LENGTH = 254;

/* Campos de cada passo com formulário: rótulo, ordem, tipo e teto de
   caracteres são catálogo de produto — o mesmo teto alimenta o contador
   exibido no campo. */
export const STEP_FIELDS = {
  [STEP_IDS.PERSONAL]: [
    { name: "firstName", label: "Nome", type: FIELD_TYPES.TEXT, maxLength: 40 },
    { name: "lastName", label: "Sobrenome", type: FIELD_TYPES.TEXT, maxLength: 60 },
    { name: "cpf", label: "CPF", type: FIELD_TYPES.CPF, maxLength: 14 },
    { name: "email", label: "E-mail", type: FIELD_TYPES.EMAIL, maxLength: EMAIL_MAX_LENGTH },
    { name: "phone", label: "Telefone", type: FIELD_TYPES.PHONE, maxLength: 15 },
  ],
  [STEP_IDS.DELIVERY]: [
    { name: "cep", label: "CEP", type: FIELD_TYPES.CEP, maxLength: 9 },
    { name: "street", label: "Rua", type: FIELD_TYPES.TEXT, maxLength: 80 },
    { name: "number", label: "Número", type: FIELD_TYPES.TEXT, maxLength: 10 },
    { name: "neighborhood", label: "Bairro", type: FIELD_TYPES.TEXT, maxLength: 60 },
    { name: "city", label: "Cidade", type: FIELD_TYPES.TEXT, maxLength: 60 },
    { name: "state", label: "Estado", type: FIELD_TYPES.TEXT, maxLength: 2 },
  ],
  [STEP_IDS.PAYMENT]: [
    { name: "cardHolder", label: "Nome no cartão", type: FIELD_TYPES.TEXT, maxLength: 40 },
    { name: "cardNumber", label: "Número do cartão", type: FIELD_TYPES.CARD, maxLength: 19 },
    { name: "cardExpiration", label: "Validade", type: FIELD_TYPES.EXPIRATION, maxLength: 5 },
    { name: "cardCvv", label: "CVV", type: FIELD_TYPES.TEXT, maxLength: 4 },
  ],
};
