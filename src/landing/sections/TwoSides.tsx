import { Eyebrow } from '../components/Eyebrow';
import { Reveal } from '../components/Reveal';
import { doisLados } from '../content/copy';
import { StarMark } from '../illustrations/StarMark';

function Lista({ itens, linha }: { itens: string[]; linha: string }) {
  return (
    <ul className="mt-8">
      {itens.map((t) => (
        <li key={t} className={`border-t py-4 text-[1.125rem] font-medium ${linha}`}>
          {t}
        </li>
      ))}
    </ul>
  );
}

/** Dois painéis grandes, desalinhados e parcialmente sobrepostos. */
export function TwoSides() {
  const { atende, atendida } = doisLados;
  return (
    <section className="secao overflow-x-clip" aria-labelledby="lados-titulo">
      <div className="conteiner">
        <h2 id="lados-titulo" className="sr-only">
          {doisLados.titulo}
        </h2>
        <div className="grid lg:grid-cols-12">
          <Reveal className="sobre-escuro relative rounded-[28px] bg-verde p-8 text-creme lg:col-span-7 lg:col-start-1 lg:row-start-1 lg:p-14 lg:pr-28">
            <Eyebrow>{atende.eyebrow}</Eyebrow>
            <p className="display t-secao mt-5 max-w-[11ch]">{atende.titulo}</p>
            <Lista itens={atende.itens} linha="border-creme/30" />
          </Reveal>
          <Reveal
            atraso={120}
            className="relative -mt-6 ml-6 rounded-[28px] bg-salmao p-8 text-verde-profundo lg:col-span-6 lg:col-start-7 lg:row-start-1 lg:mt-40 lg:ml-0 lg:p-14"
          >
            <StarMark
              size={72}
              cores={['var(--verde)', 'var(--verde-profundo)']}
              className="absolute -top-8 right-8 lg:-top-9 lg:right-12"
            />
            <Eyebrow>{atendida.eyebrow}</Eyebrow>
            <p className="display t-secao mt-5 max-w-[10ch]">{atendida.titulo}</p>
            <Lista itens={atendida.itens} linha="border-verde-profundo/30" />
          </Reveal>
        </div>
        <p className="mx-auto mt-14 max-w-[34rem] text-center text-[16px] text-texto-2 lg:mt-20">{doisLados.fecho}</p>
      </div>
    </section>
  );
}
