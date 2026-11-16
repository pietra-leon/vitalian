import { Lock } from 'lucide-react';

/** Aviso discreto das perguntas sensíveis. */
export function SensitiveNote({ id }: { id: string }) {
  return (
    <p id={id} className="mt-6 flex items-start gap-2 text-[15px] text-texto-2">
      <Lock className="mt-0.5 size-[18px] shrink-0 text-verde" aria-hidden="true" />
      <span>Só responda se quiser. Quem vê: a equipe de saúde da clínica.</span>
    </p>
  );
}
