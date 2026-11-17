import { motion, useReducedMotion } from 'motion/react';
import { useState } from 'react';
import { Button } from '../components/Button';
import { LaptopFrame, PhoneFrame } from '../components/DeviceFrame';
import { Eyebrow } from '../components/Eyebrow';
import { capturas } from '../content/capturas';
import { hero, mensagens, wa } from '../content/copy';
import { Botanical } from '../illustrations/Botanical';
import { OrganicShape } from '../illustrations/Shapes';

type Lado = 'paciente' | 'medico';

export function Hero() {
  const [lado, setLado] = useState<Lado>('paciente');
  const reduzir = useReducedMotion();
  const mola = reduzir ? { duration: 0 } : { type: 'spring' as const, stiffness: 170, damping: 22 };
  const paciente = lado === 'paciente';
  const legenda = hero.alternador.find((a) => a.id === lado)!.legenda;

  return (
    <section className="overflow-x-clip pt-10 pb-16 lg:pt-16 lg:pb-24">
      <div className="conteiner grid items-center gap-x-8 gap-y-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <Eyebrow className="text-texto-2">{hero.eyebrow}</Eyebrow>
          <h1 className="display t-hero mt-5">
            <span className="block">{hero.titulo[0]}</span>
            <span className="block text-verde">{hero.titulo[1]}</span>
          </h1>
          <p className="mt-7 max-w-[34rem] text-[1.125rem] leading-[1.5] text-texto-2 lg:text-[1.25rem]">
            {hero.subtitulo}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3">
            <Button href={wa(mensagens.conhecer)} externo>
              {hero.cta}
            </Button>
            <a href="#como-funciona" className="elo">
              {hero.ctaSecundario}
            </a>
          </div>
          <p className="mt-5 text-[16px] text-texto-2">{hero.apoio}</p>
        </div>

        {/* Composição: transborda para a direita da tela no desktop. */}
        <div className="lg:col-span-6 lg:-mr-24 xl:-mr-40">
          <div className="relative mx-auto aspect-[10/8] w-full max-w-[720px] lg:max-w-none">
            <OrganicShape n={1} cor="var(--salmao)" className="absolute -inset-x-[6%] -top-[4%] h-[104%] w-[112%]" />
            <Botanical
              variante="flor"
              cores={['var(--verde)', 'var(--salmao-profundo)', 'var(--verde-profundo)']}
              className="absolute -top-[9%] right-[16%] w-[19%]"
            />
            <motion.div
              className="absolute top-[13%] left-[19%] w-[80%] origin-bottom"
              animate={
                reduzir
                  ? { opacity: paciente ? 0.75 : 1 }
                  : { scale: paciente ? 0.94 : 1, x: paciente ? '0%' : '-5%', y: paciente ? '0%' : '4%' }
              }
              transition={mola}
              style={{ zIndex: paciente ? 10 : 20 }}
            >
              <LaptopFrame captura={capturas.relatorioTela} sizes="(min-width: 1024px) 600px, 76vw" />
            </motion.div>
            <motion.div
              className="absolute top-[20%] left-[3%] w-[30%] origin-bottom"
              animate={
                reduzir
                  ? { opacity: paciente ? 1 : 0.75 }
                  : { scale: paciente ? 1 : 0.84, x: paciente ? '0%' : '-8%', y: paciente ? '0%' : '-6%' }
              }
              transition={mola}
              style={{ zIndex: paciente ? 20 : 10 }}
            >
              <PhoneFrame captura={capturas.pergunta} prioridade sizes="(min-width: 1024px) 220px, 29vw" />
            </motion.div>
          </div>

          {/* Alternador: é enfeite e é função. Troca o dispositivo da frente. */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 lg:justify-start lg:pl-[10%]">
            <div role="group" aria-label="Ver a tela de quem" className="flex gap-1 rounded-full bg-superficie p-1">
              {hero.alternador.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  aria-pressed={lado === a.id}
                  onClick={() => setLado(a.id)}
                  className="pilula border-transparent"
                >
                  {a.label}
                </button>
              ))}
            </div>
            <p aria-live="polite" className="text-[16px] font-medium text-texto-2">
              {legenda}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
