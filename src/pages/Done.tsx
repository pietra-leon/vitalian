import { CalendarDays, ClipboardList } from 'lucide-react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { CareAlert } from '@/components/feedback/CareAlert';
import { Sucesso } from '@/components/feedback/Illustrations';
import { SupportCards } from '@/components/feedback/SupportCards';
import { Btn } from '@/components/form/Btn';
import { StepLayout } from '@/components/flow/StepLayout';
import { QuickExit } from '@/components/shell/QuickExit';
import { evaluate } from '@/mock/flags';
import { invite } from '@/mock/invite';
import { useJourney } from '@/state/JourneyContext';

const levar = [
  'Documento com foto',
  'Cartão do convênio (se tiver)',
  'Lista de medicamentos e alergias',
  'Exames anteriores',
  'Anotações com suas dúvidas',
];

/**
 * Conclusão. As variantes dependem das respostas, mas a paciente nunca vê o
 * nome do nível: só o conteúdo muda.
 *  - cuidado físico urgente: cartão de cuidado no topo;
 *  - apoio (violência atual ou pensamentos de se machucar): bloco de apoio e
 *    saída rápida. Quando o apoio é o único motivo, ele vai ao topo no lugar
 *    do cartão de cuidado, que fala de dor e sangramento.
 */
export default function Done() {
  const { answers } = useJourney();
  const navigate = useNavigate();
  const r = useMemo(() => evaluate(answers), [answers]);

  return (
    <StepLayout
      title="Pronto, recebemos suas respostas."
      top={
        <>
          {r.apoio ? <QuickExit /> : null}
          {r.cuidadoFisico || r.apoio ? (
            <div className={`mb-8 space-y-4 ${r.apoio ? 'mt-14' : ''}`}>
              {r.cuidadoFisico ? <CareAlert /> : null}
              {r.apoio ? <SupportCards /> : null}
            </div>
          ) : null}
          <div className="mb-4">
            <Sucesso size={104} />
          </div>
        </>
      }
    >
      {r.nivel !== 'urgente' || !r.cuidadoFisico ? (
        <p className="mt-3 text-[17px] leading-relaxed text-texto-2">
          A equipe vai ler com calma antes da consulta.
        </p>
      ) : null}
      {r.nivel === 'atencao' ? (
        <p className="mt-3 text-[17px] leading-relaxed text-texto-2">
          Anotamos alguns pontos que a equipe vai querer ver com carinho. Se algo piorar antes da consulta,
          fale com a clínica.
        </p>
      ) : null}

      <section aria-labelledby="consulta" className="mt-6 rounded-[20px] border border-borda bg-superficie p-5 sombra-suave">
        <h2 id="consulta" className="flex items-center gap-2 text-lg font-semibold text-verde-profundo">
          <CalendarDays className="size-5 text-verde" aria-hidden="true" />
          Sua consulta
        </h2>
        <p className="mt-3 text-[17px] font-semibold text-verde-profundo">{invite.consulta}</p>
        <p className="text-base text-texto-2">
          {invite.profissional} · {invite.clinica}
        </p>
      </section>

      <section aria-labelledby="levar" className="mt-4 rounded-[20px] border border-borda bg-superficie p-5 sombra-suave">
        <h2 id="levar" className="flex items-center gap-2 text-lg font-semibold text-verde-profundo">
          <ClipboardList className="size-5 text-verde" aria-hidden="true" />
          Para levar à consulta
        </h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-base text-verde-profundo marker:text-verde">
          {levar.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        <p className="mt-4 text-base font-medium text-texto-2">Você não precisa se preparar além disso.</p>
      </section>

      <p className="mt-6 text-center text-base text-texto-2">Você já pode fechar esta página.</p>
      <Btn variante="demo" className="mt-4 w-full" onClick={() => navigate('/')}>
        Demonstração: voltar à central
      </Btn>
    </StepLayout>
  );
}
