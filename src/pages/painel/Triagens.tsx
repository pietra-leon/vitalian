import { ArrowDown, ArrowRight, ArrowUp, ArrowUpDown, Inbox, RefreshCw, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { cn } from '@/app/components/ui/utils';
import { Btn } from '@/components/form/Btn';
import { Nome } from '@/components/painel/shell/Nome';
import { CategoryChip, LevelBadge, StatusChip, botaoTabela, cartao, nivelLabel, nivelRank, selectCls } from '@/components/painel/triagem/chips';
import { ShiftNotificationPreview } from '@/components/painel/triagem/ShiftNotificationPreview';
import { ageFrom, dayDiff, fmtAgo, fmtConsulta, fmtLong } from '@/lib/dates';
import { type Categoria, type Status, type Triage, categoriaLabel, categoriaOf, statusLabel } from '@/mock/clinic';
import { type Nivel, evaluate } from '@/mock/flags';
import { useClinic } from '@/state/ClinicContext';

/**
 * Linha da lista. FIDELIDADE À ARQUITETURA: a lista usa SOMENTE metadados
 * abertos (nome, idade, consulta, nível, categoria, status, horário de envio).
 * Queixa e respostas clínicas ficam criptografadas no produto e só existem no
 * detalhe; por isso este tipo não carrega `answers`.
 */
interface Row {
  id: string;
  nome: string;
  idade: number;
  consulta: Date;
  enviadaEm: Date;
  nivel: Nivel;
  categoria: Categoria;
  status: Status;
  nova: boolean;
  destaque: boolean;
}

function toRow(t: Triage, now: Date): Row {
  // O nível vem sempre de evaluate(); no produto, o servidor grava só o resultado.
  const ev = evaluate(t.answers);
  return {
    id: t.id,
    nome: t.paciente.nome,
    idade: ageFrom(t.paciente.nascimento, now),
    consulta: t.consulta,
    enviadaEm: t.enviadaEm,
    nivel: ev.nivel,
    categoria: categoriaOf(t.answers, ev),
    status: t.status,
    nova: !t.aberta,
    destaque: Boolean(t.destaque),
  };
}

type Quick = 'hoje' | 'urgentes' | 'atencao' | 'pendentes';
type Col = 'nivel' | 'paciente' | 'consulta' | 'categoria' | 'enviada' | 'status';
type Periodo = 'todas' | 'hoje' | 'amanha' | 'semana';

const quickTest: Record<Quick, (r: Row, now: Date) => boolean> = {
  hoje: (r, now) => dayDiff(r.consulta, now) === 0,
  urgentes: (r) => r.nivel === 'urgente',
  atencao: (r) => r.nivel === 'atencao',
  pendentes: (r) => r.status === 'pendente',
};

const colunas: [Col, string][] = [
  ['nivel', 'Nível'],
  ['paciente', 'Paciente'],
  ['consulta', 'Consulta'],
  ['categoria', 'Categoria'],
  ['enviada', 'Enviada'],
  ['status', 'Status'],
];

export default function Triagens() {
  const { triages, now, sim, setSim, search, setSearch } = useClinic();
  const navigate = useNavigate();
  const [quick, setQuick] = useState<Quick | null>(null);
  const [status, setStatus] = useState<Status | 'todos'>('todos');
  const [nivel, setNivel] = useState<Nivel | 'todos'>('todos');
  const [periodo, setPeriodo] = useState<Periodo>('todas');
  const [sort, setSort] = useState<{ col: Col; dir: 1 | -1 }>({ col: 'nivel', dir: -1 });

  const all = useMemo(() => (sim.empty ? [] : triages.map((t) => toRow(t, now))), [triages, now, sim.empty]);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    const out = all.filter((r) => {
      const d = dayDiff(r.consulta, now);
      return (
        (!quick || quickTest[quick](r, now)) &&
        (!q || r.nome.toLowerCase().includes(q)) &&
        (status === 'todos' || r.status === status) &&
        (nivel === 'todos' || r.nivel === nivel) &&
        (periodo === 'todas' || (periodo === 'hoje' && d === 0) || (periodo === 'amanha' && d === 1) || (periodo === 'semana' && d >= 0 && d <= 6))
      );
    });
    const cmp: Record<Col, (a: Row, b: Row) => number> = {
      nivel: (a, b) => nivelRank[a.nivel] - nivelRank[b.nivel],
      paciente: (a, b) => a.nome.localeCompare(b.nome, 'pt-BR'),
      consulta: (a, b) => a.consulta.getTime() - b.consulta.getTime(),
      categoria: (a, b) => categoriaLabel[a.categoria].localeCompare(categoriaLabel[b.categoria], 'pt-BR'),
      enviada: (a, b) => a.enviadaEm.getTime() - b.enviadaEm.getTime(),
      status: (a, b) => statusLabel[a.status].localeCompare(statusLabel[b.status], 'pt-BR'),
    };
    // Padrão: nível (urgente primeiro) e depois horário da consulta.
    // Triagens recém-chegadas (em destaque) ficam no topo até serem abertas.
    return out.sort(
      (a, b) =>
        Number(b.destaque) - Number(a.destaque) ||
        cmp[sort.col](a, b) * sort.dir ||
        a.consulta.getTime() - b.consulta.getTime(),
    );
  }, [all, quick, search, status, nivel, periodo, sort, now]);

  const conta = (k: Quick) => all.filter((r) => quickTest[k](r, now)).length;
  const hoje = all.filter((r) => quickTest.hoje(r, now));
  const filtrando = Boolean(quick || search || status !== 'todos' || nivel !== 'todos' || periodo !== 'todas');
  const limpar = () => {
    setQuick(null);
    setSearch('');
    setStatus('todos');
    setNivel('todos');
    setPeriodo('todas');
  };

  const tiles: [Quick, string, string][] = [
    ['hoje', 'Para hoje', 'consultas de hoje'],
    ['urgentes', 'Urgentes', 'pedem leitura primeiro'],
    ['atencao', 'Atenção', 'pontos a observar'],
    ['pendentes', 'Pendentes', 'ainda não analisadas'],
  ];

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-base text-texto-2 first-letter:uppercase">{fmtLong(now)}</p>
        <div className={cn(cartao, 'flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5')}>
          <p className="text-[15px] text-verde-profundo">
            <span className="font-semibold">Resumo do turno:</span>{' '}
            <span className="tabular-nums">{hoje.length}</span> para hoje
          </p>
          <ShiftNotificationPreview
            hoje={hoje.length}
            urgentes={hoje.filter((r) => r.nivel === 'urgente').length}
            atencao={hoje.filter((r) => r.nivel === 'atencao').length}
          />
        </div>
      </div>

      {/* Cartões-resumo: filtros rápidos. */}
      <ul className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {tiles.map(([k, titulo, legenda]) => (
          <li key={k}>
            <button
              type="button"
              aria-pressed={quick === k}
              onClick={() => setQuick(quick === k ? null : k)}
              className={cn(
                cartao,
                'w-full p-4 text-left hover:bg-verde-claro/40',
                quick === k ? 'border-2 border-verde bg-verde-claro/50 p-[15px]' : '',
              )}
            >
              <span className="block text-[15px] font-semibold text-verde-profundo">{titulo}</span>
              <span className="block text-[34px] leading-tight font-semibold text-verde-profundo tabular-nums">{conta(k)}</span>
              <span className="block text-[13px] text-texto-2">{quick === k ? 'Filtro ativo' : legenda}</span>
            </button>
          </li>
        ))}
      </ul>

      {/* Filtros */}
      <div className="mt-4 flex flex-wrap items-end gap-3">
        <label className="relative min-w-[200px] flex-1 xl:hidden">
          <span className="mb-1 block text-[13px] font-medium text-texto-2">Buscar por nome</span>
          <Search className="pointer-events-none absolute bottom-3 left-3 size-[18px] text-texto-2" aria-hidden="true" />
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} className={cn(selectCls, 'w-full pl-10')} />
        </label>
        <label>
          <span className="mb-1 block text-[13px] font-medium text-texto-2">Status</span>
          <select className={selectCls} value={status} onChange={(e) => setStatus(e.target.value as Status | 'todos')}>
            <option value="todos">Todos</option>
            {(Object.keys(statusLabel) as Status[]).map((s) => (
              <option key={s} value={s}>{statusLabel[s]}</option>
            ))}
          </select>
        </label>
        <label>
          <span className="mb-1 block text-[13px] font-medium text-texto-2">Nível</span>
          <select className={selectCls} value={nivel} onChange={(e) => setNivel(e.target.value as Nivel | 'todos')}>
            <option value="todos">Todos</option>
            <option value="urgente">Urgente</option>
            <option value="atencao">Atenção</option>
            <option value="rotina">Rotina</option>
          </select>
        </label>
        <label>
          <span className="mb-1 block text-[13px] font-medium text-texto-2">Consulta</span>
          <select className={selectCls} value={periodo} onChange={(e) => setPeriodo(e.target.value as Periodo)}>
            <option value="todas">Todas</option>
            <option value="hoje">Hoje</option>
            <option value="amanha">Amanhã</option>
            <option value="semana">Esta semana</option>
          </select>
        </label>
        <button type="button" className={botaoTabela} disabled={!filtrando} onClick={limpar}>
          Limpar filtros
        </button>
      </div>

      <p className="sr-only" aria-live="polite">
        {sim.loading ? 'Carregando triagens' : `${rows.length} ${rows.length === 1 ? 'triagem' : 'triagens'} na lista`}
      </p>

      <div className="mt-4">
        {sim.loading ? (
          <div className={cn(cartao, 'space-y-3 p-4')} aria-hidden="true">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="esqueleto h-7 w-24" />
                <div className="esqueleto h-5 flex-1" />
                <div className="esqueleto hidden h-5 w-28 sm:block" />
                <div className="esqueleto h-5 w-20" />
              </div>
            ))}
          </div>
        ) : sim.error ? (
          <div className={cn(cartao, 'p-8 text-center')} role="alert">
            <p className="text-lg font-semibold text-verde-profundo">Não foi possível carregar as triagens.</p>
            <Btn className="mt-4" onClick={() => setSim({ error: false })}>
              <RefreshCw aria-hidden="true" />
              Tentar novamente
            </Btn>
          </div>
        ) : all.length === 0 ? (
          <div className={cn(cartao, 'p-8 text-center')}>
            <Inbox className="mx-auto size-14 text-verde" strokeWidth={1.25} aria-hidden="true" />
            <p className="mx-auto mt-3 max-w-sm text-lg font-semibold text-verde-profundo">Nenhuma triagem por aqui ainda.</p>
            <p className="mx-auto max-w-sm text-base text-texto-2">Quando uma paciente responder, ela aparece aqui.</p>
          </div>
        ) : rows.length === 0 ? (
          <div className={cn(cartao, 'p-8 text-center')}>
            <p className="text-lg font-semibold text-verde-profundo">Nenhum resultado para esses filtros.</p>
            <button type="button" className={cn(botaoTabela, 'mt-3')} onClick={limpar}>
              Limpar filtros
            </button>
          </div>
        ) : (
          <>
            {/* Desktop e tablet: tabela (rolagem interna só em telas estreitas). */}
            <div className={cn(cartao, 'relative hidden max-h-[calc(100dvh-9rem)] overflow-auto md:block')}>
              <table className="w-full min-w-[700px] border-collapse text-[15px]">
                <caption className="sr-only">Triagens da clínica. Enter abre a triagem da linha em foco.</caption>
                <thead className="sticky top-0 z-10 bg-verde-claro text-left text-[13px] text-verde-profundo">
                  <tr>
                    {colunas.map(([c, nome]) => {
                      const ativo = sort.col === c;
                      const Icon = ativo ? (sort.dir === 1 ? ArrowUp : ArrowDown) : ArrowUpDown;
                      return (
                        <th key={c} scope="col" aria-sort={ativo ? (sort.dir === 1 ? 'ascending' : 'descending') : 'none'} className="px-1 py-0 font-semibold first:pl-2">
                          <button
                            type="button"
                            className="flex min-h-11 items-center gap-1 rounded-lg px-2 font-semibold hover:bg-superficie/60"
                            onClick={() => setSort({ col: c, dir: ativo ? (sort.dir === 1 ? -1 : 1) : c === 'nivel' ? -1 : 1 })}
                          >
                            {nome}
                            <Icon className={cn('size-3.5', !ativo && 'opacity-50')} aria-hidden="true" />
                          </button>
                        </th>
                      );
                    })}
                    <th scope="col" className="w-12">
                      <span className="sr-only">Abrir</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr
                      key={r.id}
                      tabIndex={0}
                      aria-label={`Abrir triagem de ${r.nome}, nível ${nivelLabel[r.nivel].toLowerCase()}`}
                      className={cn(
                        'cursor-pointer border-t border-borda hover:bg-verde-claro/40',
                        r.nivel === 'urgente' && 'shadow-[inset_4px_0_0_#B3261E]',
                        r.destaque && 'pulso',
                      )}
                      onClick={() => navigate(`/painel/triagem/${r.id}`)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.target === e.currentTarget) navigate(`/painel/triagem/${r.id}`);
                      }}
                    >
                      <td className="py-2.5 pr-2 pl-4"><LevelBadge nivel={r.nivel} /></td>
                      <td className="px-3 py-2.5">
                        <span className="font-semibold text-verde-profundo"><Nome>{r.nome}</Nome></span>
                        <span className="text-texto-2 tabular-nums">, {r.idade} anos</span>
                        {r.nova ? (
                          <span className="ml-2 inline-flex items-center gap-1 text-[13px] font-semibold text-verde-profundo">
                            <span className="size-2 rounded-full bg-verde" aria-hidden="true" />
                            Nova
                          </span>
                        ) : null}
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap tabular-nums">{fmtConsulta(r.consulta, now)}</td>
                      <td className="px-3 py-2.5"><CategoryChip categoria={r.categoria} /></td>
                      <td className="px-3 py-2.5 whitespace-nowrap text-texto-2 tabular-nums">{fmtAgo(r.enviadaEm, now)}</td>
                      <td className="px-3 py-2.5"><StatusChip status={r.status} /></td>
                      <td className="pr-2">
                        <Link
                          to={`/painel/triagem/${r.id}`}
                          tabIndex={-1}
                          aria-hidden="true"
                          className="flex size-11 items-center justify-center rounded-xl text-verde hover:bg-verde-claro"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ArrowRight className="size-5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Celular: cada linha vira um cartão. */}
            <ul className="space-y-2.5 md:hidden">
              {rows.map((r) => (
                <li key={r.id}>
                  <Link
                    to={`/painel/triagem/${r.id}`}
                    aria-label={`Abrir triagem de ${r.nome}, nível ${nivelLabel[r.nivel].toLowerCase()}`}
                    className={cn(cartao, 'flex min-h-11 items-center gap-3 p-3', r.nivel === 'urgente' && 'border-l-4 border-l-[#B3261E]', r.destaque && 'pulso')}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <LevelBadge nivel={r.nivel} />
                        {r.nova ? (
                          <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-verde-profundo">
                            <span className="size-2 rounded-full bg-verde" aria-hidden="true" />
                            Nova
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1.5 truncate text-base font-semibold text-verde-profundo">
                        <Nome>{r.nome}</Nome>
                        <span className="font-normal text-texto-2">, {r.idade} anos</span>
                      </p>
                      <p className="flex flex-wrap items-center gap-x-3 text-[14px] text-texto-2 tabular-nums">
                        {fmtConsulta(r.consulta, now)}
                        <StatusChip status={r.status} />
                      </p>
                    </div>
                    <ArrowRight className="size-5 shrink-0 text-verde" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
}
