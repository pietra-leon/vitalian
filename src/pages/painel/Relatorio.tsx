import { ArrowLeft, Download, MessageCircle, Printer } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router';
import { Btn } from '@/components/form/Btn';
import { logoSrc } from '@/components/shell/Header';
import { SuggestDialog } from '@/components/painel/questionario/SuggestDialog';
import { Nome } from '@/components/painel/shell/Nome';
import { nivelIcon, nivelLabel, selectCls } from '@/components/painel/triagem/chips';
import { nomesModulos, respostaDoPainel, useTriageView } from '@/components/painel/triagem/useTriage';
import { fmtDate, fmtDateTime, fmtTime, isoToBr } from '@/lib/dates';
import { SUMMARY_NOTE } from '@/lib/summary';
import { type Triage, clinic } from '@/mock/clinic';
import { isInPerson, modules, visibleFields, visibleQuestions } from '@/mock/questionnaire';
import { useClinic } from '@/state/ClinicContext';

export const entregas: Record<string, { nome: string; texto: string }> = {
  painel: {
    nome: 'Painel web',
    texto: 'Você abre o painel no computador ou no celular, com login. Nada sai do sistema; cada acesso fica registrado.',
  },
  whatsapp: {
    nome: 'PDF no WhatsApp',
    texto: 'O relatório chegaria como PDF na sua conversa. É prático, mas o arquivo com dados de saúde passa a ficar no seu aparelho e na nuvem do aplicativo.',
  },
  email: {
    nome: 'PDF por e-mail',
    texto: 'O relatório chegaria como anexo no e-mail da clínica. Fica fácil de arquivar, mas o e-mail não é um canal protegido para dados de saúde.',
  },
};

export default function Relatorio() {
  const { id } = useParams();
  const { triages } = useClinic();
  const t = triages.find((x) => x.id === id);
  if (!t) return <Navigate to="/painel/nao-encontrado" replace />;
  return <Folha key={t.id} t={t} />;
}

function Folha({ t }: { t: Triage }) {
  const c = useClinic();
  const navigate = useNavigate();
  const v = useTriageView(t, c.now);
  const [geradoEm] = useState(() => new Date());
  const [dica, setDica] = useState(false);
  const [entrega, setEntrega] = useState('');
  const visto = useRef(false);

  useEffect(() => {
    if (visto.current) return;
    visto.current = true;
    c.log('Abriu relatório', t.paciente.nome);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t.id]);

  return (
    <>
      {/* Barra de ações: fora da folha e fora da impressão. */}
      <div className="nao-imprimir mx-auto mb-4 flex max-w-[794px] flex-wrap items-end gap-2">
        <Btn variante="contorno" className="min-h-11 py-2 text-[15px]" onClick={() => navigate(`/painel/triagem/${t.id}`)}>
          <ArrowLeft aria-hidden="true" />
          Voltar
        </Btn>
        {/* No celular o relatório é só leitura. */}
        <Btn className="hidden min-h-11 py-2 text-[15px] md:inline-flex" onClick={() => window.print()}>
          <Printer aria-hidden="true" />
          Imprimir
        </Btn>
        <Btn
          variante="contorno"
          className="hidden min-h-11 py-2 text-[15px] md:inline-flex"
          onClick={() => {
            setDica(true);
            window.print();
          }}
        >
          <Download aria-hidden="true" />
          Baixar PDF
        </Btn>
        <label className="ml-auto">
          <span className="mb-1 block text-[13px] font-medium text-texto-2">Como você prefere receber?</span>
          <select className={selectCls} value={entrega} onChange={(e) => setEntrega(e.target.value)}>
            <option value="">Escolha uma opção</option>
            {Object.entries(entregas).map(([k, o]) => (
              <option key={k} value={k}>{o.nome}</option>
            ))}
          </select>
        </label>
        <p className="w-full text-[14px] text-texto-2 md:hidden">No celular, o relatório é só para leitura. Para imprimir, abra no computador.</p>
        <p className="w-full text-[14px] text-texto-2" aria-live="polite">
          {dica ? 'Para baixar: na janela de impressão, em "Destino", escolha "Salvar como PDF".' : ''}
        </p>
      </div>

      {/* Pergunta de validação: não muda nada no produto, só registra a opinião. */}
      <SuggestDialog
        open={entrega !== ''}
        onOpenChange={(o) => !o && setEntrega('')}
        origem={`Entrega: ${entregas[entrega]?.nome ?? ''}`}
        title={entregas[entrega]?.nome}
        opiniao
      >
        <p className="text-[15px] text-verde-profundo">{entregas[entrega]?.texto}</p>
      </SuggestDialog>

      <article className="folha sombra-suave rounded-sm border border-borda p-5 sm:p-10">
        <div className="marca-dagua" aria-hidden="true">
          <span>DEMONSTRAÇÃO · DADOS FICTÍCIOS</span>
          <span>DEMONSTRAÇÃO · DADOS FICTÍCIOS</span>
          <span>DEMONSTRAÇÃO · DADOS FICTÍCIOS</span>
        </div>

        <div className="relative z-[2] space-y-5">
          <header className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-[#1c1f0e] pb-4">
            <div className="flex items-center gap-3">
              <img src={logoSrc} alt="" className="h-11 w-auto" />
              <div>
                <p className="text-[13px] font-semibold">Vitalian · {clinic.nome}</p>
                <p className="font-titulo text-[22px] leading-tight">Relatório de triagem pré-consulta</p>
              </div>
            </div>
            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-[12.5px]">
              <dt className="font-semibold">Paciente</dt>
              <dd><Nome>{t.paciente.nome}</Nome>, {v.idade} anos, nasc. {isoToBr(t.paciente.nascimento)}</dd>
              <dt className="font-semibold">Consulta</dt>
              <dd>{fmtDate(t.consulta)}, {fmtTime(t.consulta)} · {t.profissional}</dd>
              <dt className="font-semibold">Respondido em</dt>
              <dd>{fmtDateTime(t.enviadaEm)}</dd>
              <dt className="font-semibold">Questionário</dt>
              <dd>{clinic.questionario}</dd>
            </dl>
          </header>

          {/* Alertas legíveis em preto e branco: texto, ícone e estilo de borda. */}
          <section>
            <h2>Alertas</h2>
            {v.alertas.length === 0 ? (
              <p className="alerta-rotina px-3 py-2">
                <strong>Rotina.</strong> Nenhum alerta acionado.
              </p>
            ) : (
              <ul className="space-y-2">
                {v.alertas.map((a) => {
                  const Icon = nivelIcon[a.nivel];
                  return (
                    <li key={a.id} className={`alerta-${a.nivel} flex items-start gap-2.5 px-3 py-2`}>
                      <Icon className="mt-0.5 size-5 shrink-0" strokeWidth={2.25} aria-hidden="true" />
                      <p>
                        <strong className="uppercase">
                          {a.nivel === 'urgente' ? '!! ' : ''}
                          {nivelLabel[a.nivel]}:
                        </strong>{' '}
                        <strong>{a.nome}.</strong> {a.motivo}.
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section>
            <h2>Resumo para a consulta</h2>
            {v.resumo.map((l) => (
              <p key={l}>{l}</p>
            ))}
            <p className="mt-1 text-[11.5px] italic">{SUMMARY_NOTE}</p>
          </section>

          <section>
            <h2>Dados-chave</h2>
            <dl className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
              {v.dados.map(([k, val]) => (
                <div key={k} className="flex gap-2 border-b border-[#1c1f0e]/25 py-1">
                  <dt className="w-[46%] shrink-0 font-semibold">{k}</dt>
                  <dd className="min-w-0 break-words">{val}</dd>
                </div>
              ))}
            </dl>
          </section>

          {modules.map((m, i) => (
            <section key={m.id}>
              <h2>
                {i + 1}. {nomesModulos[i]}
              </h2>
              <table className="w-full border-collapse text-[12.5px]">
                <thead className="sr-only">
                  <tr>
                    <th scope="col">Pergunta</th>
                    <th scope="col">Resposta</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleQuestions(m, t.answers).map((q) => {
                    const fields = visibleFields(q, t.answers);
                    return (
                      <tr key={q.id} className="border-b border-[#1c1f0e]/20 align-top">
                        <th scope="row" className="w-[55%] py-1 pr-3 text-left font-normal">{q.title}</th>
                        <td className="py-1 font-semibold break-words">
                          {isInPerson(t.answers, q.id)
                            ? 'Prefere conversar pessoalmente'
                            : fields.map((f) => (
                                <span key={f.id} className="block">
                                  {fields.length > 1 && f.label ? <span className="font-normal">{f.label} </span> : null}
                                  {respostaDoPainel(f, t.answers)}
                                  {v.camposAlerta.has(f.id) ? <span className="font-normal"> (gerou alerta)</span> : null}
                                </span>
                              ))}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>
          ))}

          {v.topicos.length > 0 ? (
            <section>
              <h2>Tópicos para abordar pessoalmente</h2>
              <ul className="space-y-0.5">
                {v.topicos.map((x) => (
                  <li key={x} className="flex gap-2">
                    <MessageCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    {x}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <footer className="border-t-2 border-[#1c1f0e] pt-2 text-[11.5px]">
            <p>
              <strong>Documento gerado a partir de respostas autodeclaradas da paciente. Não substitui a anamnese.</strong>
            </p>
            <p>Gerado em {fmtDateTime(geradoEm)} · Acesso registrado</p>
          </footer>
        </div>
      </article>
    </>
  );
}
