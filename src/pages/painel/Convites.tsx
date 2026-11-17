import { Ban, CircleCheck, Clock, type LucideIcon, MailOpen, Plus, RefreshCw, Send } from 'lucide-react';
import { useNavigate } from 'react-router';
import { cn } from '@/app/components/ui/utils';
import { Btn } from '@/components/form/Btn';
import { Nome } from '@/components/painel/shell/Nome';
import { botaoTabela, cartao } from '@/components/painel/triagem/chips';
import { fmtAgo, fmtConsulta, fmtIn } from '@/lib/dates';
import { type Invite, type InviteStatus, inviteStatusLabel } from '@/mock/clinic';
import { useClinic } from '@/state/ClinicContext';

const icone: Record<InviteStatus, LucideIcon> = {
  enviado: Send,
  aberto: MailOpen,
  respondido: CircleCheck,
  expirado: Clock,
  revogado: Ban,
};

function Chip({ status }: { status: InviteStatus }) {
  const Icon = icone[status];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-texto-2/60 px-2.5 py-0.5 text-[13px] font-medium whitespace-nowrap text-verde-profundo">
      <Icon className="size-3.5" aria-hidden="true" />
      {inviteStatusLabel[status]}
    </span>
  );
}

/** Lista de convites. Para a recepção, é a tela inicial: sem nenhum dado clínico. */
export default function Convites() {
  const { invites, now, revokeInvite, renewInvite } = useClinic();
  const navigate = useNavigate();

  const acoes = (c: Invite) => {
    const podeRevogar = c.status === 'enviado' || c.status === 'aberto';
    const podeRenovar = c.status === 'expirado' || c.status === 'revogado';
    return (
      <div className="flex flex-wrap gap-2">
        <button type="button" className={botaoTabela} disabled={!podeRevogar} onClick={() => revokeInvite(c.id)} aria-label={`Revogar convite de ${c.paciente}`}>
          <Ban className="size-4" aria-hidden="true" />
          Revogar
        </button>
        <button
          type="button"
          className={botaoTabela}
          disabled={!podeRenovar}
          aria-label={`Gerar novo link para ${c.paciente}`}
          onClick={() => {
            renewInvite(c.id);
            navigate('/painel/convites/novo', { state: { criado: { paciente: c.paciente } } });
          }}
        >
          <RefreshCw className="size-4" aria-hidden="true" />
          Gerar novo link
        </button>
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[15px] text-texto-2">Por segurança, o link só aparece uma vez, na criação.</p>
        <Btn onClick={() => navigate('/painel/convites/novo')}>
          <Plus aria-hidden="true" />
          Novo convite
        </Btn>
      </div>

      <div className={cn(cartao, 'relative mt-4 hidden overflow-x-auto md:block')}>
        <table className="w-full min-w-[860px] border-collapse text-[15px]">
          <caption className="sr-only">Convites enviados às pacientes</caption>
          <thead className="bg-verde-claro text-left text-[13px] text-verde-profundo">
            <tr>
              {['Paciente', 'Consulta', 'Criado por', 'Criado em', 'Expira em', 'Status', 'Ações'].map((h) => (
                <th key={h} scope="col" className="px-3 py-3 font-semibold first:pl-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {invites.map((c) => (
              <tr key={c.id} className="border-t border-borda">
                <th scope="row" className="py-2 pr-3 pl-4 text-left font-semibold text-verde-profundo"><Nome>{c.paciente}</Nome></th>
                <td className="px-3 py-2 whitespace-nowrap tabular-nums">{fmtConsulta(c.consulta, now)}</td>
                <td className="px-3 py-2 text-texto-2">{c.criadoPor}</td>
                <td className="px-3 py-2 whitespace-nowrap text-texto-2 tabular-nums">{fmtAgo(c.criadoEm, now)}</td>
                <td className="px-3 py-2 whitespace-nowrap text-texto-2 tabular-nums">
                  {c.status === 'respondido' || c.status === 'revogado' ? '—' : fmtIn(c.expiraEm, now)}
                </td>
                <td className="px-3 py-2"><Chip status={c.status} /></td>
                <td className="px-3 py-2">{acoes(c)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="mt-4 space-y-2.5 md:hidden">
        {invites.map((c) => (
          <li key={c.id} className={cn(cartao, 'p-3')}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-base font-semibold text-verde-profundo"><Nome>{c.paciente}</Nome></p>
              <Chip status={c.status} />
            </div>
            <p className="mt-1 text-[14px] text-texto-2 tabular-nums">
              Consulta: {fmtConsulta(c.consulta, now)} · criado {fmtAgo(c.criadoEm, now)} por {c.criadoPor}
            </p>
            <div className="mt-2">{acoes(c)}</div>
          </li>
        ))}
      </ul>
    </>
  );
}
