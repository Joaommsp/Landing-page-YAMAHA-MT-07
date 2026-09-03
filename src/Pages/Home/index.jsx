import { useState } from "react";

import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import Hero from "../../components/landing/Hero";
import SpecSheet from "../../components/landing/SpecSheet";
import Gallery from "../../components/landing/Gallery";
import SpecMarquee from "../../components/ui/SpecMarquee";
import Configurator from "../../components/configurator/Configurator";

/* Página única do projeto: cabeçalho, as três seções da landing, rodapé e o
   configurador em modal.

   O configurador fica montado o tempo todo e apenas deixa de desenhar quando
   fechado (AD-021) — é o que preserva cor e opcionais entre uma abertura e
   outra. A devolução do foco a quem abriu também é dele: o shell guarda o
   elemento focado no momento da abertura, então tanto o botão do hero quanto o
   do cabeçalho recuperam o foco ao fechar, sem a Home precisar de ref. */

function Home() {
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);

  const openConfigurator = () => setIsConfiguratorOpen(true);
  const closeConfigurator = () => setIsConfiguratorOpen(false);

  return (
    <>
      <Header onOpenConfigurator={openConfigurator} />

      <main>
        <Hero onOpenConfigurator={openConfigurator} />
        <SpecMarquee />
        <SpecSheet />
        <Gallery />
        <SpecMarquee />
      </main>

      <Footer />

      <Configurator isOpen={isConfiguratorOpen} onClose={closeConfigurator} />
    </>
  );
}

export default Home;
