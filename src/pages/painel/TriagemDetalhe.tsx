import { ArrowLeft, CalendarDays, ChevronDown, Eye, FileText, MessageCircle, UserRound } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router';
import { cn } from '@/app/components/ui/utils';
import { Btn } from '@/components/form/Btn';
import { Nome } from '@/components/painel/shell/Nome';
import { AnswersTabs } from '@/components/painel/triagem/AnswersTabs';
import { CategoryChip, LevelBadge, botaoTabela, cartao, selectCls } from '@/components/painel/triagem/chips';
import { useTriageView } from '@/components/painel/triagem/useTriage';
import { fmtConsulta, fmtDate, fmtDateTime, fmtTime, isoToBr } from '@/lib/dates';
import { SUMMARY_NOTE } from '@/lib/summary';
import { type Status, type Triage, maskCpfHidden, statusLabel } from '@/mock/clinic';
import { useClinic } from '@/state/ClinicContext';

export default function TriagemDetalhe() {
  const { id } = useParams();
  const { triages } = useClinic();
  const t = triages.find((x) => x.id === id);
  // Inexistente ou de outra clínica: sempre 404, nunca 403 (não revela que existe).
  if (!t) return <Navigate to="/painel/nao-encontrado" replace />;
  return <Detalhe key={t.id} t={t} />;
}

function Detalhe({ t }: { t: Triage }) {
  const c = useClinic();
  const navigate = useNavigate();
  const v = useTriageView(t, c.now);
  const [cpfVisivel, setCpfVisivel] = useState(false);
  const visto = useRef(false);

  // Todo acesso a dados clínicos é registrado (e avisado a quem acessa).
  useEffect(() => {
    if (visto.current) return;
    visto.current = true;
    c.viewTriage(t.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t.id]);

  const lateral = (
    <div className="space-y-3">
      <section className={cn(cartao, 'p-4')} aria-label="Paciente">
        <h2 className="flex items-center gap-2 text-[13px] font-semibold tracking-wide text-texto-2 uppercase">
          <UserRound className="size-4" aria-hidden="true" />
          Paciente
        </h2>
        <p className="mt-2 text-lg font-semibold text-verde-profundo"><Nome>{t.paciente.nome}</Nome></p>
        <dl className="mt-1 space-y-1 text-[15px] text-verde-profundo">
          <div className="flex justify-between gap-3"><dt className="text-texto-2">Idade</dt><dd className="tabular-nums">{v.idade} anos</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-texto-2">Nascimento</dt><dd className="tabular-nums">{isoToBr(t.paciente.nascimento)}</dd></div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-texto-2">CPF</dt>
            <dd className="flex items-center gap-2 tabular-nums">
              {cpfVisivel ? t.paciente.cpf : maskCpfHidden(t.paciente.cpf)}
              {cpfVisivel ? null : (
                <button
                  type="button"
                  className={cn(botaoTabela, 'min-h-9 px-2 text-[13px]')}
                  onClick={() => {
                    setCpfVisivel(true);
                    c.log('Revelou CPF', t.paciente.nome);
                    c.toast('CPF revelado. Este acesso foi registrado.');
                  }}
                >
                  <Eye className="size-4" aria-hidden="true" />
                  Revelar
                </button>
              )}
            </dd>
          </div>
          <div className="flex justify-between gap-3"><dt className="text-texto-2">Telefone</dt><dd className="tabular-nums">{t.paciente.telefone}</dd></div>
        </dl>
      </section>

      <section className={cn(cartao, 'p-4')} aria-label="Consulta">
        <h2 className="flex items-center gap-2 text-[13px] font-semibold tracking-wide text-texto-2 uppercase">
          <CalendarDays className="size-4" aria-hidden="true" />
          Consulta
        </h2>
        <p className="mt-2 text-base font-semibold text-verde-profundo tabular-nums">
          {fmtDate(t.consulta)} · {fmtTime(t.consulta)}
        </p>
        <p className="text-[15px] text-texto-2">{t.profissional}</p>
      </section>

      <section className={cn(cartao, 'p-4')}>
        <label className="block">
          <span className="block text-[13px] font-semibold tracking-wide text-texto-2 uppercase">Status</span>
          <select
            className={cn(selectCls, 'mt-2 w-full')}
            value={t.status}
            onChange={(e) => c.setStatus(t.id, e.target.value as Status)}
          >
            {(Object.keys(statusLabel) as Status[]).map((s) => (
              <option key={s} value={s}>{statusLabel[s]}</option>
            ))}
          </select>
        </label>
      </section>

      <div className="flex flex-col gap-2">
        <Btn onClick={() => navigate(`/painel/triagem/${t.id}/relatorio`)}>
          <FileText aria-hidden="true" />
          Abrir relatório
        </Btn>
        <Btn variante="contorno" onClick={() => navigate('/painel')}>
          <ArrowLeft aria-hidden="true" />
          Voltar à lista
        </Btn>
      </div>

      <section className={cn(cartao, 'p-4')} aria-label="Linha do tempo">
        <h2 className="text-[13px] font-semibold tracking-wide text-texto-2 uppercase">Linha do tempo</h2>
        <ol className="mt-3 space-y-3 border-l-2 border-verde-claro pl-4">
          {[...t.timeline, { evento: 'Visualizado por você agora', quando: null }].map((e) => (
            <li key={e.evento} className="relative text-[15px] text-verde-profundo">
              <span className="absolute top-1.5 -left-[22px] size-2.5 rounded-full bg-verde" aria-hidden="true" />
              <span className="font-medium">{e.evento}</span>
              {e.quando ? <span className="block text-[13px] text-texto-2 tabular-nums">{fmtDateTime(e.quando)}</span> : null}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2">
        <Link to="/painel" className="flex min-h-11 items-center gap-1 rounded-xl pr-2 text-[15px] font-semibold text-verde-profundo underline underline-offset-4">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Triagens
        </Link>
        <p className="text-xl font-semibold text-verde-profundo">
          <Nome>{t.paciente.nome}</Nome>
          <span className="font-normal text-texto-2">, {v.idade} anos</span>
        </p>
        <LevelBadge nivel={v.ev.nivel} />
        <CategoryChip categoria={v.categoria} />
        <span className="text-[15px] text-texto-2 tabular-nums">Consulta: {fmtConsulta(t.consulta, c.now)}</span>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Celular: a barra lateral vira um bloco recolhível no topo. */}
        <details className={cn(cartao, 'group lg:hidden')}>
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-2 px-4 text-base font-semibold text-verde-profundo [&::-webkit-details-marker]:hidden">
            Paciente, consulta e status
            <ChevronDown className="size-5 text-verde transition-transform group-open:rotate-180" aria-hidden="true" />
          </summary>
          <div className="p-3 pt-0">{lateral}</div>
        </details>

        <div className="min-w-0 space-y-5">
          {/* Faixa de alertas: um cartão por regra acionada, urgentes primeiro. */}
          <section aria-labelledby="alertas-titulo">
            <h2 id="alertas-titulo" className="sr-only">Alertas</h2>
            {v.alertas.length === 0 ? (
              <p className={cn(cartao, 'p-4 text-[15px] text-texto-2')}>Nenhum alerta acionado.</p>
            ) : (
              <ul className="space-y-2">
                {v.alertas.map((a) => (
                    <li
                      key={a.id}
                      className={cn(
                        'flex items-start gap-3 rounded-2xl border-2 bg-superficie p-3.5',
                        a.nivel === 'urgente' ? 'border-[#B3261E]' : 'border-dashed border-verde-profundo',
                      )}
                    >
                      <LevelBadge nivel={a.nivel} className="mt-0.5" />
                      <div className="min-w-0">
                        <p className="text-base font-semibold text-verde-profundo">{a.nome}</p>
                        <p className="text-[15px] text-texto-2">{a.motivo}</p>
                      </div>
                    </li>
                ))}
              </ul>
            )}
          </section>

          <section className={cn(cartao, 'p-4')} aria-labelledby="resumo-titulo">
            <h2 id="resumo-titulo" className="text-lg font-semibold text-verde-profundo">Resumo para a consulta</h2>
            <div className="mt-2 space-y-1 text-[15px] leading-relaxed text-verde-profundo">
              {v.resumo.map((l) => (
                <p key={l}>{l}</p>
              ))}
            </div>
            <p className="mt-3 text-[13px] text-texto-2">{SUMMARY_NOTE}</p>
          </section>

          {v.topicos.length > 0 ? (
            <section className="rounded-2xl border border-dashed border-texto-2 p-4" aria-labelledby="topicos-titulo">
              <h2 id="topicos-titulo" className="flex items-center gap-2 text-base font-semibold text-verde-profundo">
                <MessageCircle className="size-5 text-verde" aria-hidden="true" />
                Tópicos para abordar pessoalmente
              </h2>
              <p className="mt-1 text-[14px] text-texto-2">A paciente preferiu tratar destes assuntos na conversa.</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] text-verde-profundo marker:text-verde">
                {v.topicos.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </section>
          ) : null}

          <div className={cn(cartao, 'p-4')}>
            <AnswersTabs answers={t.answers} camposAlerta={v.camposAlerta} />
          </div>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-28">{lateral}</div>
        </aside>
      </div>
    </>
  );
}
