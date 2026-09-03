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
   categoria, definida na direção de arte aprovada. */
export const SPECS = [
  {
    id: "displacement",
    name: "Cilindrada",
    value: "689",
    unit: "cc",
    ratio: 0.86,
  },
  {
    id: "power",
    name: "Potência máxima",
    value: "74,8",
    unit: "cv @ 8.750 rpm",
    ratio: 0.74,
  },
  {
    id: "torque",
    name: "Torque máximo",
    value: "6,9",
    unit: "kgf.m @ 6.500 rpm",
    ratio: 0.69,
  },
  {
    id: "weight",
    name: "Peso em ordem de marcha",
    value: "184",
    unit: "kg",
    ratio: 0.52,
  },
];

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

export const STEPS = [
  { id: 1, label: "Cor", title: "Escolha a cor" },
  { id: 2, label: "Opcionais", title: "Monte o pacote" },
  { id: 3, label: "Dados", title: "Seus dados" },
  { id: 4, label: "Entrega", title: "Endereço de entrega" },
  { id: 5, label: "Pagamento", title: "Pagamento e resumo" },
];

export const FIRST_STEP = STEPS[0].id;
export const LAST_STEP = STEPS[STEPS.length - 1].id;
