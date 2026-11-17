import { Reveal } from '../components/Reveal';
import { silencio } from '../content/copy';
import { SilenceTimeline } from '../illustrations/SilenceTimeline';

/** O "custo do silêncio", como bloco editorial. */
export function Silence() {
  return (
    <section className="overflow-x-clip bg-verde-claro py-[72px] lg:py-28">
      <div className="conteiner grid items-center gap-x-8 gap-y-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <p className="display t-medio">
            {silencio.texto[0]} <span className="text-verde">{silencio.texto[1]}</span>
          </p>
        </Reveal>
        <Reveal atraso={120} className="lg:col-span-7 lg:-mr-16">
          <SilenceTimeline />
        </Reveal>
      </div>
    </section>
  );
}
