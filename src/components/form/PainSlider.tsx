import type { CSSProperties } from 'react';

interface Props {
  id: string;
  label: string;
  value: number | undefined;
  onChange: (v: number) => void;
  minLabel: string;
  maxLabel: string;
  describedBy?: string;
}

/** Controle deslizante de 0 a 10. Sem valor até a paciente tocar. */
export function PainSlider({ id, label, value, onChange, minLabel, maxLabel, describedBy }: Props) {
  const shown = value ?? 0;
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-base font-semibold text-verde-profundo">
        {label}
      </label>
      <p className="font-titulo text-[40px] leading-none text-verde-profundo" aria-hidden="true">
        {value === undefined ? '–' : value}
        <span className="ml-2 font-sans text-base font-medium text-texto-2">
          {value === undefined ? 'toque na régua para responder' : 'de 10'}
        </span>
      </p>
      <input
        id={id}
        type="range"
        className="dor mt-2"
        min={0}
        max={10}
        step={1}
        value={shown}
        style={{ '--pct': `${shown * 10}%` } as CSSProperties}
        aria-valuetext={value === undefined ? 'Sem resposta' : `${value} de 10`}
        aria-describedby={describedBy}
        onChange={(e) => onChange(Number(e.target.value))}
        // Tocar sem arrastar (inclusive no zero) já conta como resposta.
        onPointerUp={(e) => onChange(Number(e.currentTarget.value))}
        onKeyUp={(e) => {
          if (e.key !== 'Tab' && e.key !== 'Shift') onChange(Number(e.currentTarget.value));
        }}
      />
      <div className="flex justify-between gap-4 text-[15px] text-texto-2">
        <span>0 · {minLabel}</span>
        <span className="text-right">10 · {maxLabel}</span>
      </div>
    </div>
  );
}
