import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Btn } from '@/components/form/Btn';
import { useJourney } from '@/state/JourneyContext';

/** Aviso prévio de 1 minuto antes de a sessão expirar (só quando simulado). */
export function SessionWarning() {
  const { sim, setSim, endSession } = useJourney();
  const navigate = useNavigate();
  const [left, setLeft] = useState(60);
  const open = sim.sessionWarning;

  useEffect(() => {
    if (!open) return;
    setLeft(60);
    const t = window.setInterval(() => setLeft((s) => s - 1), 1000);
    return () => window.clearInterval(t);
  }, [open]);

  const expirar = () => {
    endSession();
    navigate('/triagem/sessao-expirada');
  };

  useEffect(() => {
    if (open && left <= 0) expirar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left, open]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && setSim({ sessionWarning: false })}>
      <DialogContent className="rounded-[20px] border-borda bg-superficie">
        <DialogHeader>
          <DialogTitle className="font-titulo text-2xl leading-tight text-verde-profundo">
            Você ainda está aí?
          </DialogTitle>
          <DialogDescription className="text-base text-texto-2">
            Por segurança, a sessão será encerrada em{' '}
            <strong className="text-verde-profundo">{Math.max(left, 0)} segundos</strong> se não houver
            atividade.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-3 sm:flex-col">
          <Btn onClick={() => setSim({ sessionWarning: false })}>Continuar respondendo</Btn>
          <Btn variante="demo" onClick={expirar}>
            Demonstração: encerrar agora
          </Btn>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
