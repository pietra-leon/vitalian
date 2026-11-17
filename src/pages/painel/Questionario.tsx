import { BellRing, FileText, type LucideIcon, MessageSquarePlus, MonitorSmartphone } from 'lucide-react';
import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/app/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { cn } from '@/app/components/ui/utils';
import { SuggestDialog } from '@/components/painel/questionario/SuggestDialog';
import { LevelBadge, botaoTabela, cartao } from '@/components/painel/triagem/chips';
import { nomesModulos } from '@/components/painel/triagem/useTriage';
import { describeCondition } from '@/lib/conditionText';
import { rules } from '@/mock/flags';
import { type FieldType, type Question, canSkip, modules } from '@/mock/questionnaire';

const tipoCampo: Record<FieldType, string> = {
  readonly: 'somente leitura',
  text: 'texto curto',
  longtext: 'texto longo',
  date: 'data',
  cpf: 'CPF',
  phone: 'telefone',
  single: 'escolha única',
  multi: 'múltipla escolha',
  scale: 'escala de 1 a 5',
  slider: 'régua de 0 a 10',
};

const chip = 'rounded-full border border-texto-2/60 px-2.5 py-0.5 text-[13px] font-medium text-verde-profundo';
const aba =
  'min-h-11 flex-none rounded-lg px-4 text-[15px] text-verde-profundo data-[state=active]:bg-superficie data-[state=active]:font-semibold data-[state=active]:shadow-sm';

const entregasCartoes: [LucideIcon, string, string][] = [
  [MonitorSmartphone, 'Painel web', 'Você abre o painel com login, no computador da clínica ou no celular. Os dados não saem do sistema.'],
  [FileText, 'PDF para anexar ao prontuário', 'Um relatório de uma página, impresso ou salvo em PDF por você, a partir do painel.'],
  [BellRing, 'Alerta sem dados clínicos no celular', 'Uma notificação só com contagens ("3 triagens para hoje: 1 urgente"). Sem nome e sem sintoma.'],
];

/** Questionário e regras (somente leitura): onde o médico critica perguntas e regras. */
export default function Questionario() {
  const [alvo, setAlvo] = useState<{ origem: string; opiniao?: boolean; titulo?: string } | null>(null);
  const sugerir = (origem: string) => (
    <button type="button" className={cn(botaoTabela, 'shrink-0')} onClick={() => setAlvo({ origem })}>
      <MessageSquarePlus className="size-4" aria-hidden="true" />
      Sugerir alteração
    </button>
  );

  const pergunta = (q: Question) => (
    <li key={q.id} className="flex flex-col items-start justify-between gap-3 py-3 sm:flex-row">
      <div className="min-w-0 sm:flex-1">
        <p className="text-[15px] font-semibold text-verde-profundo">{q.title}</p>
        <ul className="mt-1 space-y-0.5 text-[14px] text-texto-2">
          {q.fields.map((f) => (
            <li key={f.id}>
              {q.fields.length > 1 && f.label ? `${f.label} ` : ''}
              <span className="text-verde-profundo">({tipoCampo[f.type]})</span>
              {f.options ? `: ${f.options.map((o) => o.label).join(' / ')}` : ''}
              {f.showIf ? ` · Aparece se: ${describeCondition(f.showIf)}` : ''}
            </li>
          ))}
        </ul>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <span className={chip}>{canSkip(q) ? 'Opcional' : 'Obrigatória'}</span>
          {q.sensitive ? <span className={cn(chip, 'border-salmao-profundo bg-salmao-suave text-salmao-profundo')}>Sensível</span> : null}
          {q.sensitive || q.inPerson ? <span className={chip}>Oferece "Prefiro conversar pessoalmente"</span> : null}
        </div>
        {q.showIf ? (
          <p className="mt-2 text-[14px] text-verde-profundo">
            <span className="font-semibold">Aparece se:</span> {describeCondition(q.showIf)}
          </p>
        ) : null}
      </div>
      {sugerir(`Pergunta: ${q.title}`)}
    </li>
  );

  return (
    <>
      <h2 className="text-xl font-semibold text-verde-profundo">Ginecologia (exemplo para validação clínica)</h2>
      <div className="mt-2 flex flex-wrap gap-2">
        <span className={chip}>Versão 1 · imutável</span>
        <span className="rounded-full bg-salmao-suave px-2.5 py-0.5 text-[13px] font-semibold text-salmao-profundo">
          Revisado por médico: não
        </span>
      </div>
      <p className="mt-2 max-w-3xl text-[15px] text-texto-2">
        Alterar o questionário cria uma nova versão; as respostas antigas mantêm a versão em que foram coletadas.
      </p>

      <Tabs defaultValue="perguntas" className="mt-5 min-w-0">
        <TabsList className="h-auto w-full flex-wrap justify-start gap-1 rounded-xl bg-verde-claro p-1">
          <TabsTrigger value="perguntas" className={aba}>Perguntas</TabsTrigger>
          <TabsTrigger value="regras" className={aba}>Regras de alerta</TabsTrigger>
          <TabsTrigger value="entrega" className={aba}>Entrega</TabsTrigger>
        </TabsList>

        <TabsContent value="perguntas" className="min-w-0">
          <Accordion type="multiple" defaultValue={['m1']} className="space-y-3">
            {modules.map((m, i) => (
              <AccordionItem key={m.id} value={`m${m.id}`} className={cn(cartao, 'px-4 last:border-b')}>
                <AccordionTrigger className="min-h-12 items-center py-2 text-base font-semibold text-verde-profundo hover:no-underline [&>svg]:size-5 [&>svg]:text-verde">
                  <span>
                    Módulo {m.id}: {nomesModulos[i]}
                    <span className="ml-2 font-normal text-texto-2">{m.questions.length} perguntas</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-1">
                  <ul className="divide-y divide-borda">{m.questions.map(pergunta)}</ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>

        <TabsContent value="regras" className="min-w-0">
          <p className="mb-3 rounded-2xl bg-salmao-suave px-4 py-3 text-[15px] font-semibold text-salmao-profundo">
            Estas regras são um exemplo e precisam da sua revisão.
          </p>
          <div className={cn(cartao, 'relative overflow-x-auto')}>
            <table className="w-full border-collapse text-[15px] md:min-w-[640px]">
              <caption className="sr-only">Regras de alerta do questionário</caption>
              <thead className="bg-verde-claro text-left text-[13px] text-verde-profundo max-md:sr-only">
                <tr>
                  <th scope="col" className="py-3 pr-3 pl-4 font-semibold">Alerta</th>
                  <th scope="col" className="px-3 py-3 font-semibold">Condição</th>
                  <th scope="col" className="px-3 py-3 font-semibold">Nível numérico</th>
                  <th scope="col" className="px-3 py-3"><span className="sr-only">Ações</span></th>
                </tr>
              </thead>
              <tbody>
                {rules.map((r) => (
                  <tr key={r.id} className="border-t border-borda align-top max-md:block max-md:px-4 max-md:py-3 max-md:first:border-t-0">
                    <th scope="row" className="py-3 pr-3 pl-4 text-left font-normal max-md:block max-md:p-0">
                      {r.nivel === 'topico' ? (
                        <span className={chip}>Tópico a abordar</span>
                      ) : (
                        <LevelBadge nivel={r.nivel} />
                      )}
                      <span className="mt-1.5 block font-semibold text-verde-profundo">{r.rotulo}</span>
                      {r.apoio ? <span className="block text-[13px] text-texto-2">Mostra à paciente os contatos de apoio</span> : null}
                    </th>
                    <td className="px-3 py-3 text-verde-profundo max-md:block max-md:px-0 max-md:py-1.5"><span className="font-semibold md:hidden">Condição: </span>{describeCondition(r.when)}</td>
                    <td className="px-3 py-3 text-verde-profundo tabular-nums max-md:block max-md:px-0 max-md:py-0"><span className="font-semibold md:hidden">Nível numérico: </span>{r.urgencia ? `${r.urgencia} de 5` : 'não altera'}</td>
                    <td className="px-3 py-3 max-md:block max-md:px-0 max-md:pt-2 max-md:pb-0">{sugerir(`Regra: ${r.rotulo}`)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[14px] text-texto-2">
            Sem regra acionada, a triagem fica como Rotina (nível 1 sem sintomas, nível 2 com algum sintoma). "Prefiro
            conversar pessoalmente" nunca aciona regra: entra só nos tópicos a abordar.
          </p>
        </TabsContent>

        <TabsContent value="entrega" className="min-w-0">
          <ul className="grid gap-3 md:grid-cols-3">
            {entregasCartoes.map(([Icon, nome, texto]) => (
              <li key={nome} className={cn(cartao, 'flex flex-col p-5')}>
                <span className="flex size-14 items-center justify-center rounded-2xl bg-verde-claro text-verde" aria-hidden="true">
                  <Icon className="size-7" />
                </span>
                <h3 className="mt-3 text-base font-semibold text-verde-profundo">{nome}</h3>
                <p className="mt-1 flex-1 text-[15px] text-texto-2">{texto}</p>
                <button type="button" className={cn(botaoTabela, 'mt-4 self-start')} onClick={() => setAlvo({ origem: `Entrega: ${nome}`, opiniao: true, titulo: nome })}>
                  <MessageSquarePlus className="size-4" aria-hidden="true" />
                  O que acha?
                </button>
              </li>
            ))}
          </ul>
        </TabsContent>
      </Tabs>

      <SuggestDialog
        open={alvo !== null}
        onOpenChange={(o) => !o && setAlvo(null)}
        origem={alvo?.origem ?? ''}
        opiniao={alvo?.opiniao}
        title={alvo?.titulo}
      />
    </>
  );
}
