import type { ReactNode } from 'react';
import { cn } from '@/app/components/ui/utils';
import { FieldMessage } from './FieldMessage';

export const campoBase =
  'w-full min-h-[52px] rounded-[14px] border-[1.5px] border-texto-2/70 bg-superficie px-4 py-3 text-[17px] text-verde-profundo placeholder:text-texto-2 disabled:bg-verde-claro/60';

interface Props {
  id: string;
  label: string;
  /** Quando o título da pergunta já é o rótulo visível, o rótulo vai só para o leitor de tela. */
  hideLabel?: boolean;
  value: string;
  onChange: (v: string) => void;
  help?: string;
  error?: string;
  mask?: (v: string) => string;
  inputMode?: 'numeric' | 'tel' | 'text';
  /** Exemplo de formato (não substitui o rótulo). */
  placeholder?: string;
  autoComplete?: string;
  maxLength?: number;
  readOnly?: boolean;
  disabled?: boolean;
  after?: ReactNode;
  onEnter?: () => void;
}

/** Campo de texto com rótulo visível, ajuda e erro ligados por aria-describedby. */
export function TextField(p: Props) {
  const helpId = `${p.id}-ajuda`;
  const errId = `${p.id}-erro`;
  return (
    <div>
      <label
        htmlFor={p.id}
        className={cn('mb-2 block text-base font-semibold text-verde-profundo', p.hideLabel && 'sr-only')}
      >
        {p.label}
      </label>
      <input
        id={p.id}
        type="text"
        className={cn(campoBase, p.readOnly && 'border-dashed bg-verde-claro/60', p.error && 'border-salmao-profundo')}
        value={p.value}
        inputMode={p.inputMode}
        placeholder={p.placeholder}
        autoComplete={p.autoComplete ?? 'off'}
        maxLength={p.maxLength}
        readOnly={p.readOnly}
        disabled={p.disabled}
        aria-invalid={p.error ? true : undefined}
        aria-describedby={`${p.help ? helpId + ' ' : ''}${errId}`}
        onChange={(e) => p.onChange(p.mask ? p.mask(e.target.value) : e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && p.onEnter) {
            e.preventDefault();
            p.onEnter();
          }
        }}
      />
      {p.help ? (
        <p id={helpId} className="mt-2 text-[15px] text-texto-2">
          {p.help}
        </p>
      ) : null}
      <FieldMessage id={errId} message={p.error} />
      {p.after}
    </div>
  );
}
