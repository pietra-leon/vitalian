import * as Tabs from '@radix-ui/react-tabs';
import type { ReactNode } from 'react';
import { Button } from '../components/Button';
import { LaptopFrame, PaperFrame, PhoneFrame } from '../components/DeviceFrame';
import { Eyebrow } from '../components/Eyebrow';
import { Reveal } from '../components/Reveal';
import { SectionTitle } from '../components/SectionTitle';
import { capturas } from '../content/capturas';
import { contato, produto } from '../content/copy';

function Legenda({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <figcaption className={`mt-5 text-[16px] font-medium ${className}`}>{children}</figcaption>;
}

/** "Veja por dentro": abas com as capturas reais em molduras de dispositivo. */
export function Product() {
  const l = produto.legendas;
  return (
    <section id="produto" className="secao overflow-x-clip bg-salmao text-verde-profundo" aria-labelledby="produto-titulo">
      <div className="conteiner">
        <Tabs.Root defaultValue="paciente">
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-8">
            <Reveal>
              <Eyebrow>{produto.eyebrow}</Eyebrow>
              <SectionTitle id="produto-titulo" className="mt-4">
                {produto.titulo}
              </SectionTitle>
            </Reveal>
            <Tabs.List aria-label="Quem usa cada tela" className="flex flex-wrap gap-2.5">
              {produto.abas.map((a) => (
                <Tabs.Trigger key={a.id} value={a.id} className="pilula border-verde-profundo">
                  {a.label}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
          </div>

          <Tabs.Content value="paciente" className="painel mt-12 lg:mt-16">
            <div className="grid grid-cols-2 items-start gap-x-5 gap-y-10 sm:grid-cols-3 lg:gap-x-12 lg:px-[8%]">
              <figure className="lg:mt-16">
                <PhoneFrame captura={capturas.boasVindas} sizes="(min-width: 1024px) 280px, 44vw" />
                <Legenda>{l.paciente[0]}</Legenda>
              </figure>
              <figure>
                <PhoneFrame captura={capturas.sintomas} sizes="(min-width: 1024px) 280px, 44vw" />
                <Legenda>{l.paciente[1]}</Legenda>
              </figure>
              <figure className="col-span-2 mx-auto w-1/2 sm:col-span-1 sm:w-auto lg:mt-28">
                <PhoneFrame captura={capturas.pergunta} sizes="(min-width: 1024px) 280px, 44vw" />
                <Legenda>{l.paciente[2]}</Legenda>
              </figure>
            </div>
          </Tabs.Content>

          <Tabs.Content value="medico" className="painel mt-12 lg:mt-16">
            <div className="grid items-end gap-x-10 gap-y-12 lg:grid-cols-12">
              <figure className="lg:col-span-7 lg:-ml-10">
                <LaptopFrame captura={capturas.triagens} sizes="(min-width: 1024px) 700px, 92vw" />
                <Legenda className="lg:pl-[5%]">{l.medico[0]}</Legenda>
              </figure>
              <figure className="lg:col-span-5 lg:mb-20">
                <LaptopFrame captura={capturas.detalhe} sizes="(min-width: 1024px) 480px, 92vw" />
                <Legenda className="lg:pl-[5%]">{l.medico[1]}</Legenda>
              </figure>
            </div>
          </Tabs.Content>

          <Tabs.Content value="relatorio" className="painel mt-12 lg:mt-16">
            <div className="grid grid-cols-2 items-start gap-x-5 gap-y-10 lg:grid-cols-12 lg:gap-x-10">
              <figure className="lg:col-span-5 lg:col-start-2">
                <PaperFrame captura={capturas.folha} sizes="(min-width: 1024px) 460px, 44vw" className="-rotate-1" />
                <Legenda>{l.relatorio[0]}</Legenda>
              </figure>
              <figure className="mt-10 lg:col-span-4 lg:mt-24">
                <PaperFrame captura={capturas.folhaPb} sizes="(min-width: 1024px) 380px, 44vw" className="rotate-1" />
                <Legenda>{l.relatorio[1]}</Legenda>
              </figure>
            </div>
          </Tabs.Content>
        </Tabs.Root>

        <div className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-verde-profundo/30 pt-8">
          <Button href={contato.demo} externo>
            {produto.botao}
          </Button>
          <p className="text-[16px]">{produto.nota}</p>
        </div>
      </div>
    </section>
  );
}
