import { cn } from '@/app/components/ui/utils';

interface Props {
  name: string;
  labelledBy: string;
  value: number | undefined;
  onChange: (v: number) => void;
  minLabel: string;
  maxLabel: string;
}

/** Escala de 1 a 5 com rótulos nas pontas. */
export function ScaleInput({ name, labelledBy, value, onChange, minLabel, maxLabel }: Props) {
  return (
    <div role="radiogroup" aria-labelledby={labelledBy}>
      <div className="flex justify-between gap-2">
        {[1, 2, 3, 4, 5].map((n) => {
          const checked = value === n;
          return (
            <label
              key={n}
              className={cn(
                'opcao flex size-14 cursor-pointer items-center justify-center rounded-full border-[1.5px] text-lg font-semibold transition-colors',
                checked
                  ? 'border-verde bg-verde text-creme'
                  : 'border-texto-2/70 bg-superficie text-verde-profundo hover:bg-verde-claro',
              )}
            >
              <input
                type="radio"
                name={name}
                className="sr-only"
                checked={checked}
                onChange={() => onChange(n)}
                aria-label={n === 1 ? `1, ${minLabel}` : n === 5 ? `5, ${maxLabel}` : String(n)}
              />
              <span aria-hidden="true">{n}</span>
            </label>
          );
        })}
      </div>
      <div className="mt-3 flex justify-between gap-4 text-[15px] text-texto-2" aria-hidden="true">
        <span>1 · {minLabel}</span>
        <span className="text-right">5 · {maxLabel}</span>
      </div>
      <p className="mt-3 min-h-6 text-base font-semibold text-verde-profundo" aria-live="polite">
        {value !== undefined ? `Você marcou ${value} de 5.` : ''}
      </p>
    </div>
  );
}
