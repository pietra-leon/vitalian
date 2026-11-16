import { MessageCircle, Pencil } from 'lucide-react';
import { Link } from 'react-router';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/app/components/ui/accordion';
import { isAnswered } from '@/mock/conditions';
import {
  type Question,
  effectiveValue,
  formatAnswer,
  isInPerson,
  modules,
  visibleFields,
  visibleQuestions,
} from '@/mock/questionnaire';
import { useJourney } from '@/state/JourneyContext';

/** Um accordion por módulo, com cada pergunta, a resposta e o botão "Editar". */
export function ReviewAccordion({ showSensitive }: { showSensitive: boolean }) {
  const { answers } = useJourney();
  return (
    <Accordion type="multiple" defaultValue={modules.map((m) => `m${m.id}`)} className="space-y-3">
      {modules.map((m) => (
        <AccordionItem
          key={m.id}
          value={`m${m.id}`}
          className="rounded-[20px] border border-borda bg-superficie px-4 last:border-b sombra-suave"
        >
          <AccordionTrigger className="min-h-14 items-center py-3 text-[17px] font-semibold text-verde-profundo hover:no-underline [&>svg]:size-5 [&>svg]:text-verde">
            <span>
              <span className="block text-[13px] font-medium text-texto-2">Módulo {m.id} de {modules.length}</span>
              {m.title}
            </span>
          </AccordionTrigger>
          <AccordionContent className="pb-2">
            <ul className="divide-y divide-borda">
              {visibleQuestions(m, answers).map((q) => (
                <Item key={q.id} moduleId={m.id} question={q} showSensitive={showSensitive} />
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

function Item({ moduleId, question: q, showSensitive }: { moduleId: number; question: Question; showSensitive: boolean }) {
  const { answers } = useJourney();
  const hidden = Boolean(q.sensitive) && !showSensitive;
  const inPerson = isInPerson(answers, q.id);
  const fields = visibleFields(q, answers);
  const multi = fields.length > 1;

  return (
    <li className="py-3">
      <p className="text-[15px] text-texto-2">{q.title}</p>
      <div className="mt-1 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 text-base font-medium text-verde-profundo">
          {hidden ? (
            <p>
              <span aria-hidden="true" className="tracking-widest">••••••</span>
              <span className="sr-only">Resposta oculta</span>
            </p>
          ) : inPerson ? (
            <p className="flex items-start gap-2">
              <MessageCircle className="mt-0.5 size-5 shrink-0 text-verde" aria-hidden="true" />
              Quero conversar pessoalmente
            </p>
          ) : (
            fields.map((f) => {
              const v = effectiveValue(f, answers);
              if (multi && f.optional && !isAnswered(v) && f.type !== 'single') return null;
              return (
                <p key={f.id} className="break-words">
                  {multi && f.label ? <span className="font-normal text-texto-2">{f.label} </span> : null}
                  {formatAnswer(f, v)}
                </p>
              );
            })
          )}
        </div>
        <Link
          to={`/triagem/demo/modulo/${moduleId}?p=${q.id}&editar=1`}
          aria-label={`Editar: ${q.title}`}
          className="-my-2 flex min-h-12 shrink-0 items-center gap-1.5 rounded-full px-3 text-[15px] font-semibold text-verde-profundo underline underline-offset-4 hover:bg-verde-claro"
        >
          <Pencil className="size-4" aria-hidden="true" />
          Editar
        </Link>
      </div>
    </li>
  );
}
