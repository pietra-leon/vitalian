import { Button } from '../components/Button';
import { Eyebrow } from '../components/Eyebrow';
import { Reveal } from '../components/Reveal';
import { SectionTitle } from '../components/SectionTitle';
import { mensagens, piloto, wa } from '../content/copy';

/** Programa piloto: sem preços, sem cartões. Três passos em linha simples. */
export function Pilot() {
  return (
    <section className="secao lg:pt-72" aria-labelledby="piloto-titulo">
      <div className="conteiner grid gap-x-10 gap-y-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-6">
          <Eyebrow className="text-texto-2">{piloto.eyebrow}</Eyebrow>
          <SectionTitle id="piloto-titulo" className="mt-4">
            <span className="block">{piloto.titulo[0]}</span>
            <span className="block text-verde">{piloto.titulo[1]}</span>
          </SectionTitle>
        </Reveal>
        <Reveal atraso={100} className="lg:col-span-5 lg:col-start-8 lg:pt-10">
          <p className="text-texto-2">{piloto.texto}</p>
          <Button href={wa(mensagens.piloto)} externo className="mt-8">
            {piloto.cta}
          </Button>
        </Reveal>
        <ol className="grid border-t border-verde-profundo lg:col-span-12 lg:mt-8 lg:grid-cols-3">
          {piloto.passos.map((p, i) => (
            <li
              key={p}
              className="flex items-baseline gap-4 border-b border-borda py-5 lg:border-b-0 lg:border-l lg:py-7 lg:pl-6 lg:first:border-l-0 lg:first:pl-0"
            >
              <span aria-hidden="true" className="numeral text-[2.5rem] text-verde">
                {i + 1}
              </span>
              <span className="text-[1.125rem] font-medium">{p}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
