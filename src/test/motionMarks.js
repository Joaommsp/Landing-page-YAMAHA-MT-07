/* Sonda das marcas do motion no DOM, para os testes.

   No jsdom a animação não roda: o estado inicial do `motion` chega como estilo
   inline — opacidade e um `transform` de deslocamento — e é justamente isso que
   separa "animando" de "entregue em estado final". A leitura desse detalhe da
   biblioteca fica num lugar só: se o `motion` trocar `transform: translateY()`
   pela propriedade `translate`, muda aqui, e não em cada arquivo de teste que
   olha para movimento. */

/* Elemento que nasceu de uma animação: tem opacidade ou deslocamento inline. */
export function hasMotionMark(node) {
  return node.style.opacity !== "" || node.style.transform !== "";
}

export function animatedNodes(root) {
  return Array.from(root.querySelectorAll("[style]")).filter(hasMotionMark);
}

/* Deslocamento de entrada, em pixels, no eixo pedido. Zero quando o elemento
   não desloca — o que é o estado final, não um deslocamento de tamanho zero. */
export function entryOffsetPx(node, axis = "Y") {
  const match = node.style.transform.match(
    new RegExp(`translate${axis}\\((-?[\\d.]+)px\\)`)
  );
  return match ? Number(match[1]) : 0;
}
