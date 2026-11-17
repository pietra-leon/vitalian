import { TriangleAlert } from 'lucide-react';
import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/app/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Interruptor } from '@/components/form/Interruptor';
import type { Answers } from '@/mock/conditions';
import { type Module, isInPerson, modules, visibleFields, visibleQuestions } from '@/mock/questionnaire';
import { nomesModulos, respostaDoPainel } from './useTriage';

interface Props {
  answers: Answers;
  camposAlerta: Set<string>;
}

/** Pares pergunta e resposta de um módulo. */
export function ModuleAnswers({ module, answers, camposAlerta, hideSensitive }: Props & { module: Module; hideSensitive: boolean }) {
  return (
    <dl className="divide-y divide-borda">
      {visibleQuestions(module, answers).map((q) => {
        const fields = visibleFields(q, answers);
        const oculto = hideSensitive && q.sensitive;
        const alerta = fields.some((f) => camposAlerta.has(f.id));
        return (
          <div key={q.id} className="py-2.5">
            <dt className="text-[14px] text-texto-2">{q.title}</dt>
            <dd className="mt-0.5 text-[15px] font-medium text-verde-profundo">
              {oculto ? (
                <>
                  <span aria-hidden="true" className="tracking-widest">••••••</span>
                  <span className="sr-only">Resposta sensível oculta</span>
                </>
              ) : isInPerson(answers, q.id) ? (
                'Prefere conversar pessoalmente'
              ) : (
                fields.map((f) => (
                  <span key={f.id} className="block break-words">
                    {fields.length > 1 && f.label ? <span className="font-normal text-texto-2">{f.label} </span> : null}
                    {respostaDoPainel(f, answers)}
                  </span>
                ))
              )}
              {alerta && !oculto ? (
                <span className="mt-1 inline-flex items-center gap-1 rounded-full border border-verde-profundo px-2 py-0.5 text-[12px] font-semibold text-verde-profundo">
                  <TriangleAlert className="size-3.5" aria-hidden="true" />
                  Gerou alerta
                </span>
              ) : null}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

/** Respostas por módulo: abas no desktop, acordeão no celular. */
export function AnswersTabs({ answers, camposAlerta }: Props) {
  const [hideSensitive, setHideSensitive] = useState(false);
  const body = (m: Module) => <ModuleAnswers module={m} answers={answers} camposAlerta={camposAlerta} hideSensitive={hideSensitive} />;
  return (
    <section aria-labelledby="respostas-titulo">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="respostas-titulo" className="text-lg font-semibold text-verde-profundo">
          Respostas por módulo
        </h2>
        <label className="flex min-h-11 cursor-pointer items-center gap-2 text-[14px] font-medium text-verde-profundo">
          Ocultar respostas sensíveis
          <Interruptor checked={hideSensitive} onCheckedChange={setHideSensitive} className="h-7 w-12 [&_[data-slot=switch-thumb]]:size-5 [&_[data-slot=switch-thumb]]:data-[state=checked]:translate-x-[22px]" />
        </label>
      </div>

      <Tabs defaultValue="m3" className="mt-2 hidden md:flex">
        <TabsList className="h-auto w-full justify-start gap-1 rounded-xl bg-verde-claro p-1">
          {modules.map((m, i) => (
            <TabsTrigger
              key={m.id}
              value={`m${m.id}`}
              className="min-h-11 flex-none rounded-lg px-4 text-[15px] text-verde-profundo data-[state=active]:bg-superficie data-[state=active]:font-semibold data-[state=active]:shadow-sm"
            >
              {nomesModulos[i]}
            </TabsTrigger>
          ))}
        </TabsList>
        {modules.map((m) => (
          <TabsContent key={m.id} value={`m${m.id}`} className="px-1">
            {body(m)}
          </TabsContent>
        ))}
      </Tabs>

      <Accordion type="multiple" defaultValue={['m3']} className="mt-2 md:hidden">
        {modules.map((m, i) => (
          <AccordionItem key={m.id} value={`m${m.id}`} className="border-borda">
            <AccordionTrigger className="min-h-11 items-center py-2 text-base font-semibold text-verde-profundo hover:no-underline [&>svg]:size-5 [&>svg]:text-verde">
              {nomesModulos[i]}
            </AccordionTrigger>
            <AccordionContent className="pb-2">{body(m)}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
