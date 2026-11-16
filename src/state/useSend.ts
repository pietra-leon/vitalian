import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { firstPendingPath, useJourney } from './JourneyContext';

const ESPERA_MS = 1800;

/**
 * Envio SIMULADO: só espera ~1,8s e muda de tela. Nenhuma requisição é feita;
 * as respostas nunca saem da memória do navegador.
 */
export function useSend() {
  const j = useJourney();
  const navigate = useNavigate();
  const [sending, setSending] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const send = useCallback(
    (opts: { retry?: boolean } = {}) => {
      if (sending) return;
      setSending(true);
      timer.current = window.setTimeout(() => {
        setSending(false);
        if (!j.consent || !j.verified) {
          navigate(firstPendingPath(j));
        } else if (j.sim.sendError && !opts.retry) {
          navigate('/triagem/erro');
        } else {
          j.markSubmitted(); // também desliga o erro simulado
          navigate('/triagem/demo/concluido');
        }
      }, ESPERA_MS);
    },
    [j, navigate, sending],
  );

  return { sending, send };
}
