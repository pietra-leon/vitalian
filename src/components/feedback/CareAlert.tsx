import { HeartPulse, MapPin, Phone } from 'lucide-react';

/**
 * Cartão de cuidado da variante urgente. Tom calmo e firme, nunca alarmista.
 * A paciente não vê nível, "flag" nem cor de severidade: só a orientação.
 */
export function CareAlert() {
  return (
    <section
      aria-labelledby="cuidado-titulo"
      className="rounded-[20px] border-[1.5px] border-salmao bg-salmao-suave p-5 text-salmao-profundo"
    >
      <div className="flex items-start gap-3">
        <HeartPulse className="mt-1 size-7 shrink-0" aria-hidden="true" />
        <h2 id="cuidado-titulo" className="font-titulo text-[22px] leading-tight text-salmao-profundo">
          Suas respostas pedem um cuidado mais rápido.
        </h2>
      </div>
      <p className="mt-3 text-base leading-relaxed">
        Pelo que você contou, é importante ser avaliada o quanto antes, sem esperar a data da consulta.
      </p>

      <div className="mt-5 flex flex-col gap-3">
        <a
          href="tel:192"
          className="flex min-h-14 items-center justify-center gap-2 rounded-full bg-verde px-6 text-[17px] font-semibold text-creme hover:bg-verde-profundo"
        >
          <Phone className="size-5" aria-hidden="true" />
          Ligar para o SAMU: 192
        </a>
        {/* No mockup, abre uma busca de mapa em outra aba; o produto pode usar a lista da própria clínica. */}
        <a
          href="https://www.google.com/maps/search/pronto+atendimento"
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-salmao px-6 text-base font-semibold text-verde-profundo hover:bg-salmao/85"
        >
          <MapPin className="size-5" aria-hidden="true" />
          Procurar um pronto-atendimento
        </a>
      </div>

      {/*
        TEXTO A VALIDAR COM GINECOLOGISTAS. A frase abaixo só pode ir para o
        produto se existir notificação real da clínica; hoje nada é enviado.
      */}
      <p className="mt-4 text-[15px]">Já avisamos a clínica sobre as suas respostas.</p>
      <p className="mt-2 text-base font-semibold">
        Se tiver muita dor, sangramento intenso ou desmaio, não espere.
      </p>
    </section>
  );
}
