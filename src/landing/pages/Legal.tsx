import { useEffect } from 'react';
import { legal } from '../content/copy';
import { Footer } from '../sections/Footer';
import { Header } from '../sections/Header';

/** Estrutura comum das páginas legais: cabeçalho, título, coluna de 68ch e rodapé. */
export function Legal({ qual }: { qual: 'privacidade' | 'termos' }) {
  const pagina = legal[qual];

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `${pagina.titulo} | Vitalian`;
  }, [pagina.titulo]);

  return (
    <>
      <Header />
      <main className="conteiner py-16 lg:py-24">
        <p className="inline-block rounded-full bg-salmao-suave px-4 py-2 text-[16px] font-bold text-salmao-profundo">
          {legal.aviso}
        </p>
        <h1 className="display t-secao mt-6">{pagina.titulo}</h1>
        <div className="mt-10 max-w-[68ch]">
          {pagina.blocos.map(([titulo, texto]) => (
            <section key={titulo} className="border-t border-borda py-7">
              <h2 className="display text-[1.5rem]">{titulo}</h2>
              <p className="mt-3 text-texto-2">{texto}</p>
            </section>
          ))}
        </div>
        <a href="#/" className="elo mt-6">
          ← Voltar ao início
        </a>
      </main>
      <Footer />
    </>
  );
}
