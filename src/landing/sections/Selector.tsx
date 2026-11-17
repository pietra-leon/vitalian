import * as Tabs from '@radix-ui/react-tabs';
import { Reveal } from '../components/Reveal';
import { SectionTitle } from '../components/SectionTitle';
import { seletor } from '../content/copy';
import { Botanical } from '../illustrations/Botanical';

const desenhos = { tempo: 'broto', dados: 'flor', ansiedade: 'ramo', risco: 'duas' } as const;

/** "O que mais pesa na sua consulta?": quatro pílulas que trocam o painel. */
export function Selector() {
  return (
    <section className="secao" aria-labelledby="seletor-titulo">
      <div className="conteiner">
        <Reveal>
          <SectionTitle id="seletor-titulo" className="max-w-[14ch]">
            {seletor.titulo}
          </SectionTitle>
        </Reveal>

        <Tabs.Root defaultValue={seletor.opcoes[0].id} className="mt-10 lg:mt-14">
          <Tabs.List
            aria-label={seletor.titulo}
            className="-mx-6 flex gap-2.5 overflow-x-auto px-6 pb-3 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0"
          >
            {seletor.opcoes.map((o) => (
              <Tabs.Trigger key={o.id} value={o.id} className="pilula shrink-0">
                {o.label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          {seletor.opcoes.map((o) => (
            <Tabs.Content
              key={o.id}
              value={o.id}
              className="painel mt-8 grid items-end gap-x-8 gap-y-6 border-t border-verde-profundo pt-8 lg:mt-10 lg:grid-cols-12 lg:pt-12"
            >
              <h3 className="display text-[clamp(2.25rem,5.6vw,4.75rem)] leading-[0.98] lg:col-span-7">
                <span className="block">{o.titulo[0]}</span>
                <span className="block text-verde">{o.titulo[1]}</span>
              </h3>
              <div className="flex items-end gap-6 lg:col-span-5 lg:pb-2">
                <p className="max-w-[26rem] text-texto-2">{o.texto}</p>
                <Botanical variante={desenhos[o.id]} className="-mb-1 w-[84px] shrink-0 lg:w-[132px]" />
              </div>
            </Tabs.Content>
          ))}
        </Tabs.Root>
      </div>
    </section>
  );
}
