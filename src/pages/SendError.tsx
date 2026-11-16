import { LoaderCircle, RotateCw } from 'lucide-react';
import { StateScreen } from '@/components/feedback/StateScreen';
import { Btn } from '@/components/form/Btn';
import { useSend } from '@/state/useSend';

export default function SendError() {
  const { sending, send } = useSend();
  return (
    <StateScreen
      arte="nuvem"
      title="Não conseguimos enviar agora."
      text="Suas respostas continuam aqui. Tente de novo."
    >
      {/* Reenvia mantendo o estado em memória. */}
      <Btn disabled={sending} onClick={() => send({ retry: true })}>
        {sending ? (
          <>
            <LoaderCircle className="girar" aria-hidden="true" />
            Enviando suas respostas…
          </>
        ) : (
          <>
            <RotateCw aria-hidden="true" />
            Tentar novamente
          </>
        )}
      </Btn>
      <div role="status" className="sr-only">
        {sending ? 'Enviando suas respostas…' : ''}
      </div>
    </StateScreen>
  );
}
