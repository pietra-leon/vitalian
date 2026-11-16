import { Check } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/app/components/ui/utils';

interface Props {
  type: 'radio' | 'checkbox';
  name: string;
  label: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Cartão tracejado, para se distinguir das respostas comuns. */
  dashed?: boolean;
  icon?: ReactNode;
  describedBy?: string;
}

/** Cartão de opção grande. Usa input nativo: teclado e leitor de tela de graça. */
export function OptionCard({ type, name, label, checked, onChange, dashed, icon, describedBy }: Props) {
  return (
    <label
      className={cn(
        'opcao flex min-h-14 cursor-pointer items-center gap-3 rounded-[20px] border-[1.5px] px-4 py-3 text-base transition-colors',
        dashed ? 'border-dashed' : 'border-solid',
        checked
          ? 'border-verde bg-verde-claro font-semibold text-verde-profundo'
          : 'border-texto-2/70 bg-superficie text-verde-profundo hover:bg-verde-claro/50',
      )}
    >
      <input
        type={type}
        name={name}
        className="sr-only"
        checked={checked}
        aria-describedby={describedBy}
        onChange={(e) => onChange(e.target.checked)}
        // Rádio já marcado: clicar de novo não faz nada; o campo se limpa com "Pular".
      />
      <span
        aria-hidden="true"
        className={cn(
          'flex size-6 shrink-0 items-center justify-center border-2',
          type === 'radio' ? 'rounded-full' : 'rounded-md',
          checked ? 'border-verde' : 'border-texto-2 bg-superficie',
          checked && type === 'checkbox' && 'bg-verde text-creme',
        )}
      >
        {checked && type === 'radio' ? <span className="size-3 rounded-full bg-verde" /> : null}
        {checked && type === 'checkbox' ? <Check className="size-4" strokeWidth={3} /> : null}
      </span>
      {icon}
      <span className="min-w-0 flex-1 leading-snug">{label}</span>
    </label>
  );
}
