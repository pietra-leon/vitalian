import { useNavigate } from 'react-router';
import { StateScreen } from '@/components/feedback/StateScreen';
import { Btn } from '@/components/form/Btn';
import { useJourney } from '@/state/JourneyContext';

export default function Locked() {
  const navigate = useNavigate();
  const { reset } = useJourney();
  return (
    <StateScreen
      arte="cadeado"
      title="Por segurança, bloqueamos este link."
      text="Fale com a clínica para receber um novo."
    >
      <Btn
        variante="demo"
        onClick={() => {
          reset();
          navigate('/');
        }}
      >
        Demonstração: reiniciar jornada
      </Btn>
    </StateScreen>
  );
}
