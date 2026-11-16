import { maskDate } from '@/mock/questionnaire';
import { TextField } from './TextField';

interface Props {
  id: string;
  label: string;
  hideLabel?: boolean;
  value: string;
  onChange: (v: string) => void;
  help?: string;
  error?: string;
  disabled?: boolean;
  autoComplete?: string;
  onEnter?: () => void;
}

/** Data com máscara DD/MM/AAAA e teclado numérico. */
export function DateMaskedInput(p: Props) {
  return <TextField {...p} mask={maskDate} inputMode="numeric" placeholder="DD/MM/AAAA" maxLength={10} />;
}
