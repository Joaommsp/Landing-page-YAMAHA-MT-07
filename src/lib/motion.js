/* Curva de movimento da casa. O token `--ease-editorial` vive no tema, mas o
   motion é JS e não lê o `@theme`: este módulo é o espelho único desse valor,
   para a curva não ser redigitada em cada componente que anima. */
export const EASE_EDITORIAL = [0.22, 1, 0.36, 1];
