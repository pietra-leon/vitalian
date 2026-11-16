import { MessageCircle } from 'lucide-react';
import { IN_PERSON_LABEL } from '@/mock/questionnaire';
import { OptionCard } from './OptionCard';

/**
 * "Prefiro conversar pessoalmente": sempre a última opção das perguntas
 * sensíveis, em cartão tracejado. Conta como resposta válida e NUNCA bloqueia
 * o avanço.
 */
export function PreferInPerson({
  questionId,
  checked,
  onChange,
}: {
  questionId: string;
  checked: boolean;
  onChange: (on: boolean) => void;
}) {
  return (
    <OptionCard
      type="checkbox"
      name={`${questionId}-pessoalmente`}
      dashed
      checked={checked}
      onChange={onChange}
      icon={<MessageCircle className="size-5 shrink-0 text-verde" aria-hidden="true" />}
      label={IN_PERSON_LABEL}
    />
  );
}
