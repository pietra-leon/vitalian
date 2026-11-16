import { CircleAlert } from 'lucide-react';

/** Mensagem de validação gentil: ícone + texto, nunca só cor. */
export function FieldMessage({ id, message }: { id: string; message?: string }) {
  return (
    <div id={id} aria-live="polite">
      {message ? (
        <p className="mt-2 flex items-start gap-2 text-[15px] font-medium text-salmao-profundo">
          <CircleAlert className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          <span>{message}</span>
        </p>
      ) : null}
    </div>
  );
}
