import React from "react";
import ReactDOM from "react-dom/client";
import { MotionConfig } from "motion/react";

import Home from "./Pages/Home";

import "./styles/index.css";

/* Raiz da aplicação: uma página só, sem roteador (AD-022).

   `reducedMotion="user"` é o contrato de movimento do projeto inteiro — quem
   pediu movimento reduzido no sistema recebe todo conteúdo em estado final,
   sem cada componente precisar consultar a preferência por conta própria. */

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MotionConfig reducedMotion="user">
      <Home />
    </MotionConfig>
  </React.StrictMode>,
);
