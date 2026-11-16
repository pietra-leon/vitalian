import { LoaderCircle, Send } from 'lucide-react';
import { useState } from 'react';
import { Interruptor } from '@/components/form/Interruptor';
import { Btn } from '@/components/form/Btn';
import { ReviewAccordion } from '@/components/flow/ReviewAccordion';
import { StepLayout } from '@/components/flow/StepLayout';
import { evaluate } from '@/mock/flags';
import { useJourney } from '@/state/JourneyContext';
import { useSend } from '@/state/useSend';

const nomeNivel = { rotina: 'Rotina', atencao: 'Atenção', urgente: 'Urgente' } as const;

export default function Review() {
  const { answers, sim } = useJourney();
  const [showSensitive, setShowSensitive] = useState(false);
  const { sending, send } = useSend();

  return (
    <StepLayout
      title="Confira antes de enviar"
      actions={
        <Btn className="w-full" disabled={sending} onClick={() => send()}>
          {sending ? (
            <>
              <LoaderCircle className="girar" aria-hidden="true" />
              Enviando suas respostas…
            </>
          ) : (
            <>
              <Send aria-hidden="true" />
              Enviar para a equipe médica
            </>
          )}
        </Btn>
      }
    >
      <p className="mt-3 text-[17px] leading-relaxed text-texto-2">
        Dá para mudar qualquer resposta antes de enviar.
      </p>
      <div role="status" className="sr-only">
        {sending ? 'Enviando suas respostas…' : ''}
      </div>

      <label className="mt-5 mb-4 flex min-h-14 cursor-pointer items-center justify-between gap-3 rounded-[20px] border border-borda bg-superficie px-4 py-2 text-base font-medium text-verde-profundo">
        <span>
          Mostrar respostas sensíveis
          <span className="block text-[13px] font-normal text-texto-2">
            Ficam ocultas para proteger você de olhares ao redor.
          </span>
        </span>
        <Interruptor
          checked={showSensitive}
          onCheckedChange={setShowSensitive}
        />
      </label>

      <ReviewAccordion showSensitive={showSensitive} />

      {sim.showRules ? <RulesBox /> : null}
    </StepLayout>
  );

  /** Só no mockup. A paciente real nunca vê nível, regra ou "flag". */
  function RulesBox() {
    const r = evaluate(answers);
    return (
      <aside className="mt-6 rounded-[20px] border-2 border-dashed border-verde p-4 text-verde-profundo">
        <h2 className="text-base font-semibold">Somente demonstração: o que a médica veria</h2>
        <dl className="mt-3 space-y-3 text-[15px]">
          <div>
            <dt className="font-semibold">Nível</dt>
            <dd>{nomeNivel[r.nivel]}</dd>
          </div>
          <div>
            <dt className="font-semibold">Regras acionadas</dt>
            <dd>
              {r.regras.length === 0 ? (
                'Nenhuma'
              ) : (
                <ul className="list-disc pl-5">
                  {r.regras.map((x) => (
                    <li key={x.id}>
                      {x.rotulo} ({nomeNivel[x.nivel as 'atencao' | 'urgente']})
                    </li>
                  ))}
                </ul>
              )}
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Tópicos a abordar</dt>
            <dd>
              {r.topicos.length === 0 ? (
                'Nenhum'
              ) : (
                <ul className="list-disc pl-5">
                  {r.topicos.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              )}
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Bloco de apoio na tela final</dt>
            <dd>{r.apoio ? 'Sim' : 'Não'}</dd>
          </div>
        </dl>
        <p className="mt-3 text-[13px] text-texto-2">
          Regras de exemplo, ainda não revisadas por um médico.
        </p>
      </aside>
    );
  }
}
