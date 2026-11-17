import { CircleCheck, CircleDashed, Eye, OctagonAlert, TriangleAlert } from 'lucide-react';
import { cn } from '@/app/components/ui/utils';
import { type Categoria, type Status, categoriaLabel, statusLabel } from '@/mock/clinic';
import type { Nivel } from '@/mock/flags';

export const nivelLabel: Record<Nivel, string> = { urgente: 'Urgente', atencao: 'Atenção', rotina: 'Rotina' };
export const nivelRank: Record<Nivel, number> = { urgente: 3, atencao: 2, rotina: 1 };
export const nivelIcon = { urgente: OctagonAlert, atencao: TriangleAlert, rotina: CircleCheck };

// Cores clínicas, exclusivas da área do médico. Sempre com ícone e texto.
const nivelCor: Record<Nivel, string> = {
  urgente: 'bg-[#B3261E] text-white', // 6,5:1
  atencao: 'bg-[#F2C94C] text-verde-profundo', // 7,6:1
  rotina: 'bg-verde-claro text-verde-profundo', // 9,5:1
};

/** Badge clínico: ícone + texto (nunca só cor). */
export function LevelBadge({ nivel, className }: { nivel: Nivel; className?: string }) {
  const Icon = nivelIcon[nivel];
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[13px] font-semibold whitespace-nowrap', nivelCor[nivel], className)}>
      <Icon className="size-4" aria-hidden="true" />
      {nivelLabel[nivel]}
    </span>
  );
}

const statusIcon = { pendente: CircleDashed, em_analise: Eye, concluido: CircleCheck };

export function StatusChip({ status }: { status: Status }) {
  const Icon = statusIcon[status];
  return (
    <span className="inline-flex items-center gap-1.5 text-[14px] font-medium whitespace-nowrap text-verde-profundo">
      <Icon className="size-4 text-verde" aria-hidden="true" />
      {statusLabel[status]}
    </span>
  );
}

export function CategoryChip({ categoria }: { categoria: Categoria }) {
  return (
    <span className="inline-block rounded-full border border-texto-2/60 px-2.5 py-0.5 text-[13px] font-medium whitespace-nowrap text-verde-profundo">
      {categoriaLabel[categoria]}
    </span>
  );
}

export const cartao = 'rounded-2xl border border-borda bg-superficie sombra-suave';
export const selectCls =
  'h-11 rounded-xl border-[1.5px] border-texto-2/70 bg-superficie px-3 text-[15px] text-verde-profundo';
export const botaoTabela =
  'inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl border-[1.5px] border-verde px-3 text-[14px] font-semibold text-verde-profundo hover:bg-verde-claro disabled:border-borda disabled:text-texto-2 disabled:hover:bg-transparent';
