import * as Accordion from '@radix-ui/react-accordion';
import { Plus } from 'lucide-react';
import { Eyebrow } from '../components/Eyebrow';
import { Reveal } from '../components/Reveal';
import { SectionTitle } from '../components/SectionTitle';
import { faq } from '../content/copy';

export function Faq() {
  return (
    <section id="perguntas" className="secao bg-superficie" aria-labelledby="faq-titulo">
      <div className="conteiner grid gap-x-10 gap-y-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <Eyebrow className="text-texto-2">{faq.eyebrow}</Eyebrow>
          <SectionTitle id="faq-titulo" className="mt-4 max-w-[11ch]">
            {faq.titulo}
          </SectionTitle>
        </Reveal>
        <Accordion.Root type="single" collapsible className="border-b border-verde-profundo lg:col-span-7 lg:col-start-6">
          {faq.itens.map(([pergunta, resposta]) => (
            <Accordion.Item key={pergunta} value={pergunta} className="border-t border-verde-profundo first:border-t">
              <Accordion.Header asChild>
                <h3>
                  <Accordion.Trigger className="flex min-h-[72px] w-full cursor-pointer items-center justify-between gap-6 py-4 text-left text-[1.125rem] font-bold lg:text-[1.25rem]">
                    {pergunta}
                    <Plus className="faq-sinal size-6 shrink-0" aria-hidden="true" />
                  </Accordion.Trigger>
                </h3>
              </Accordion.Header>
              <Accordion.Content className="faq-conteudo">
                <p className="max-w-[38rem] pb-6 text-texto-2">{resposta}</p>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}
