import { Reveal } from '../components/Reveal';
import { fatos } from '../content/copy';

/** Faixa de fatos do desenho do produto. Numerais grandes, sem ícones. */
export function Numbers() {
  return (
    <section aria-label="O produto em quatro fatos" className="border-y border-borda bg-superficie">
      <div className="conteiner">
        <dl className="grid grid-cols-2 lg:grid-cols-4">
          {fatos.itens.map((f, i) => (
            <Reveal
              key={f.texto}
              atraso={i * 70}
              className={`flex flex-col-reverse justify-end gap-2 py-8 lg:py-10 ${
                i % 2 ? 'border-l border-borda pl-5' : 'pr-5'
              } ${i > 1 ? 'border-t border-borda lg:border-t-0' : ''} ${i === 2 ? 'lg:border-l lg:pl-8' : ''} ${
                i > 0 ? 'lg:pl-8' : ''
              }`}
            >
              <dt className="max-w-[16ch] text-[16px] leading-snug text-texto-2">{f.texto}</dt>
              <dd className="numeral text-[clamp(3rem,6vw,5rem)] whitespace-nowrap text-verde-profundo">{f.numero}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
      <p className="conteiner border-t border-borda py-3 text-[16px] text-texto-2">{fatos.nota}</p>
    </section>
  );
}
