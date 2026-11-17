import { BellRing } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { botaoTabela } from './chips';

/**
 * Prévia da notificação do turno. REGRA DO PRODUTO que esta tela valida:
 * nunca enviar dado clínico nem nome de paciente por WhatsApp ou push. A
 * notificação traz só contagens e convida a abrir o painel.
 */
export function ShiftNotificationPreview({ hoje, urgentes, atencao }: { hoje: number; urgentes: number; atencao: number }) {
  const partes = [urgentes ? `${urgentes} ${urgentes === 1 ? 'urgente' : 'urgentes'}` : '', atencao ? `${atencao} atenção` : ''].filter(Boolean);
  const texto = `${hoje} ${hoje === 1 ? 'triagem' : 'triagens'} para hoje${partes.length ? `: ${partes.join(', ')}` : ''}. Toque para abrir o painel.`;
  return (
    <Dialog>
      <DialogTrigger className={botaoTabela}>
        <BellRing className="size-4" aria-hidden="true" />
        Ver prévia da notificação
      </DialogTrigger>
      <DialogContent className="rounded-2xl border-borda bg-superficie">
        <DialogHeader className="text-left">
          <DialogTitle className="font-titulo text-2xl text-verde-profundo">Notificação do turno</DialogTitle>
          <DialogDescription className="text-[15px] text-texto-2">
            Sem nome de paciente e sem dado clínico: só as contagens.
          </DialogDescription>
        </DialogHeader>
        {/* Celular desenhado em CSS. */}
        <div aria-hidden="true" className="mx-auto w-[240px] rounded-[36px] border-[6px] border-verde-profundo bg-verde-claro p-3 pb-10">
          <div className="mx-auto mb-6 h-4 w-20 rounded-full bg-verde-profundo" />
          <p className="font-titulo text-center text-4xl text-verde-profundo tabular-nums">07:30</p>
          <div className="mt-6 rounded-2xl bg-superficie p-3 shadow">
            <p className="text-[12px] font-semibold text-texto-2">Vitalian · agora</p>
            <p className="mt-0.5 text-[13px] leading-snug text-verde-profundo">{texto}</p>
          </div>
        </div>
        <p className="sr-only">Texto da notificação: Vitalian · {texto}</p>
      </DialogContent>
    </Dialog>
  );
}
