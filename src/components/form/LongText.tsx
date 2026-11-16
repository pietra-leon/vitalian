import { cn } from '@/app/components/ui/utils';
import { campoBase } from './TextField';

interface Props {
  id: string;
  label: string;
  hideLabel?: boolean;
  value: string;
  onChange: (v: string) => void;
  maxLength: number;
}

/** Texto longo com contador de caracteres. */
export function LongText({ id, label, hideLabel, value, onChange, maxLength }: Props) {
  const countId = `${id}-contador`;
  const left = maxLength - value.length;
  return (
    <div>
      <label htmlFor={id} className={cn('mb-2 block text-base font-semibold text-verde-profundo', hideLabel && 'sr-only')}>
        {label}
      </label>
      <textarea
        id={id}
        rows={6}
        className={cn(campoBase, 'resize-y leading-relaxed')}
        value={value}
        maxLength={maxLength}
        aria-describedby={countId}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
      />
      <p id={countId} className="mt-2 text-right text-[15px] text-texto-2">
        <span aria-hidden="true">
          {value.length} / {maxLength}
        </span>
        <span className="sr-only">
          {value.length} de {maxLength} caracteres usados.
        </span>
        {/* Só avisa o leitor de tela quando está perto do limite, para não interromper a digitação. */}
        <span className="sr-only" aria-live="polite">
          {left <= 50 ? `Restam ${left} caracteres.` : ''}
        </span>
      </p>
    </div>
  );
}
