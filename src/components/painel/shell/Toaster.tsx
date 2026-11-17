import { OctagonAlert, X } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useClinic } from '@/state/ClinicContext';
import { Nome } from './Nome';

/** Avisos no canto superior direito. O urgente é persistente até abrir ou dispensar. */
export function Toaster() {
  const { toasts, dismissToast } = useClinic();
  const navigate = useNavigate();
  return (
    <div
      aria-live="polite"
      className="nao-imprimir pointer-events-none fixed top-12 right-3 z-[60] flex w-[min(360px,calc(100vw-1.5rem))] flex-col gap-2"
    >
      {toasts.map((t) =>
        t.triageId ? (
          <div
            key={t.id}
            role="alert"
            className="sombra-suave pointer-events-auto flex items-start gap-3 rounded-2xl border-2 border-[#B3261E] bg-superficie p-3 text-verde-profundo"
          >
            <OctagonAlert className="mt-0.5 size-6 shrink-0 text-[#B3261E]" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold">
                {t.texto} · <Nome>{t.nome ?? ''}</Nome>
              </p>
              <button
                type="button"
                className="mt-2 min-h-11 rounded-xl bg-verde px-4 text-[15px] font-semibold text-creme hover:bg-verde-profundo"
                onClick={() => navigate(`/painel/triagem/${t.triageId}`)}
              >
                Abrir
              </button>
            </div>
            <button
              type="button"
              aria-label="Dispensar aviso"
              className="flex size-11 shrink-0 items-center justify-center rounded-xl hover:bg-verde-claro"
              onClick={() => dismissToast(t.id)}
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <p
            key={t.id}
            className="sombra-suave pointer-events-auto rounded-xl bg-verde-profundo px-4 py-3 text-[15px] font-medium text-creme"
          >
            {t.texto}
          </p>
        ),
      )}
    </div>
  );
}
