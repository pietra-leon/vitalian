import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { seo } from '../content/copy';
import { About } from '../sections/About';
import { Faq } from '../sections/Faq';
import { FinalCta } from '../sections/FinalCta';
import { Footer } from '../sections/Footer';
import { Header } from '../sections/Header';
import { Hero } from '../sections/Hero';
import { HowItWorks } from '../sections/HowItWorks';
import { Numbers } from '../sections/Numbers';
import { Pilot } from '../sections/Pilot';
import { Product } from '../sections/Product';
import { Selector } from '../sections/Selector';
import { Silence } from '../sections/Silence';
import { TopBar } from '../sections/TopBar';
import { Trust } from '../sections/Trust';
import { TwoSides } from '../sections/TwoSides';

export default function Home() {
  // Com HashRouter, "#como-funciona" chega aqui como rota "/como-funciona":
  // usamos o nome para rolar até a seção (o CSS cuida do deslocamento do cabeçalho).
  const { pathname } = useLocation();
  useEffect(() => {
    document.title = seo.titulo;
    const id = pathname.slice(1);
    if (!id) return;
    document.getElementById(id)?.scrollIntoView();
  }, [pathname]);

  return (
    <>
      <TopBar />
      <Header />
      <main>
        <Hero />
        <Numbers />
        <Selector />
        <Silence />
        <HowItWorks />
        <Product />
        <TwoSides />
        <Trust />
        <Pilot />
        <About />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
