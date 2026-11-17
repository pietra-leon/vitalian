import { Download } from 'lucide-react';
import { useMemo, useState } from 'react';
import { cn } from '@/app/components/ui/utils';
import { Nome } from '@/components/painel/shell/Nome';
import { botaoTabela, cartao, selectCls } from '@/components/painel/triagem/chips';
import { fmtDateTime } from '@/lib/dates';
import { downloadText, toCsv } from '@/lib/download';
import { acoes, roleLabel, users } from '@/mock/clinic';
import { useClinic } from '@/state/ClinicContext';

/** Registro de acessos (somente admin). As ações feitas na demonstração entram aqui em tempo real. */
export default function Acessos() {
  const { access } = useClinic();
  const [usuario, setUsuario] = useState('todos');
  const [acao, setAcao] = useState('todas');
  const [periodo, setPeriodo] = useState('tudo');

  const rows = useMemo(() => {
    const limite = { tudo: Infinity, hoje: 24, '7dias': 24 * 7 }[periodo] ?? Infinity;
    const agora = Date.now();
    return access.filter(
      (a) =>
        (usuario === 'todos' || a.usuario === usuario) &&
        (acao === 'todas' || a.acao === acao) &&
        (agora - a.quando.getTime()) / 3600_000 <= limite,
    );
  }, [access, usuario, acao, periodo]);

  const exportar = () =>
    downloadText(
      'registro-de-acessos-demo.csv',
      toCsv(
        ['Data e hora', 'Usuário', 'Papel', 'Ação', 'Paciente'],
        rows.map((a) => [fmtDateTime(a.quando), a.usuario, roleLabel[a.papel], a.acao, a.paciente]),
      ),
      'text/csv',
    );

  return (
    <>
      <div className="flex flex-wrap items-end gap-3">
        <label>
          <span className="mb-1 block text-[13px] font-medium text-texto-2">Usuário</span>
          <select className={selectCls} value={usuario} onChange={(e) => setUsuario(e.target.value)}>
            <option value="todos">Todos</option>
            {Object.values(users).map((u) => (
              <option key={u.id}>{u.nome}</option>
            ))}
          </select>
        </label>
        <label>
          <span className="mb-1 block text-[13px] font-medium text-texto-2">Ação</span>
          <select className={selectCls} value={acao} onChange={(e) => setAcao(e.target.value)}>
            <option value="todas">Todas</option>
            {acoes.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </label>
        <label>
          <span className="mb-1 block text-[13px] font-medium text-texto-2">Período</span>
          <select className={selectCls} value={periodo} onChange={(e) => setPeriodo(e.target.value)}>
            <option value="tudo">Todo o período</option>
            <option value="hoje">Últimas 24 horas</option>
            <option value="7dias">Últimos 7 dias</option>
          </select>
        </label>
        <button type="button" className={cn(botaoTabela, 'ml-auto')} onClick={exportar}>
          <Download className="size-4" aria-hidden="true" />
          Exportar CSV
        </button>
      </div>
      <p className="mt-3 text-[14px] text-texto-2 tabular-nums" aria-live="polite">
        {rows.length} {rows.length === 1 ? 'registro' : 'registros'}
      </p>

      <div className={cn(cartao, 'relative mt-2 overflow-x-auto')}>
        <table className="w-full border-collapse text-[15px] md:min-w-[640px]">
          <caption className="sr-only">Registro de acessos a dados de pacientes</caption>
          <thead className="bg-verde-claro text-left text-[13px] text-verde-profundo max-md:sr-only">
            <tr>
              {['Data e hora', 'Usuário', 'Papel', 'Ação', 'Paciente'].map((h) => (
                <th key={h} scope="col" className="px-3 py-3 font-semibold first:pl-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => (
              <tr key={a.id} className="border-t border-borda max-md:flex max-md:flex-wrap max-md:gap-x-2 max-md:px-4 max-md:py-2.5 max-md:first:border-t-0">
                <td className="py-2.5 pr-3 pl-4 whitespace-nowrap tabular-nums max-md:w-full max-md:p-0 max-md:text-[13px] max-md:text-texto-2">{fmtDateTime(a.quando)}</td>
                <td className="max-md:p-0 px-3 py-2.5">{a.usuario}</td>
                <td className="max-md:p-0 px-3 py-2.5 text-texto-2">{roleLabel[a.papel]}</td>
                <td className="max-md:w-full max-md:p-0 px-3 py-2.5 font-medium text-verde-profundo max-md:order-first">{a.acao}</td>
                <td className="max-md:p-0 px-3 py-2.5"><Nome>{a.paciente}</Nome></td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-texto-2">Nenhum registro para esses filtros.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </>
  );
}
