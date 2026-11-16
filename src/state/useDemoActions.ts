import { useNavigate } from 'react-router';
import type { TelaDemo } from '@/components/shell/demoNav';
import { useJourney } from './JourneyContext';

/**
 * Atalhos do modo demonstração. "Ir direto a uma tela" libera os guardas
 * necessários (consentimento, verificação, envio) para a tela abrir de fato.
 */
export function useDemoActions() {
  const j = useJourney();
  const navigate = useNavigate();

  return {
    irPara(t: TelaDemo) {
      if (t.exige === 'verificacao' || t.exige === 'envio' || t.exige === 'consentimento') j.giveConsent();
      if (t.exige === 'verificacao' || t.exige === 'envio') j.verify();
      if (t.exige === 'envio') j.markSubmitted();
      navigate(t.path);
    },
    cenario(id: string) {
      j.loadScenario(id);
      navigate('/triagem/demo/revisao');
    },
    reiniciar() {
      j.reset();
      navigate('/triagem/demo');
    },
    simular: {
      indisponivel() {
        navigate('/triagem/indisponivel');
      },
      tentativas() {
        j.exhaustAttempts();
        navigate('/triagem/bloqueado');
      },
      menor() {
        j.setSim({ minor: true });
        navigate('/triagem/menor');
      },
      erroDeEnvio() {
        j.setSim({ sendError: true });
        navigate('/triagem/erro');
      },
      sessao() {
        j.setSim({ sessionWarning: true });
      },
      conexao() {
        j.setSim({ offline: !j.sim.offline });
      },
    },
  };
}
