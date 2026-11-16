import { useNavigate } from 'react-router';
import { StateScreen } from '@/components/feedback/StateScreen';
import { Btn } from '@/components/form/Btn';
import { useJourney } from '@/state/JourneyContext';

export default function Minor() {
  const navigate = useNavigate();
  const { reset } = useJourney();
  return (
    <StateScreen
      arte="pessoas"
      title="Para menores de 18 anos, o preenchimento precisa ser feito junto com o responsável."
      text="Fale com a clínica."
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
