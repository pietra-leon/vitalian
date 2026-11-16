import { invite } from '@/mock/invite';
import { maskCpf } from '@/mock/questionnaire';
import { TextField } from './TextField';

interface Props {
  id: string;
  label: string;
  hideLabel?: boolean;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  onEnter?: () => void;
}

/** CPF com máscara. A validação dos dígitos verificadores fica em questionnaire.ts. */
export function CpfInput(p: Props) {
  return (
    <TextField
      {...p}
      mask={maskCpf}
      inputMode="numeric"
      placeholder="000.000.000-00"
      maxLength={14}
      after={
        <div className="mt-4 flex flex-col items-start gap-2 rounded-[14px] border-[1.5px] border-dashed border-verde px-4 py-3">
          <p className="text-[15px] text-verde-profundo">
            Na demonstração, não use um CPF real.
          </p>
          <button
            type="button"
            className="min-h-12 rounded-full bg-verde-claro px-4 text-[15px] font-semibold text-verde-profundo hover:bg-verde-claro/70"
            onClick={() => p.onChange(invite.cpfDeTeste)}
          >
            Usar CPF de teste
          </button>
        </div>
      }
    />
  );
}
