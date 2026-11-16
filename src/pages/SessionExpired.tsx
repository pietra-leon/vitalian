import { useNavigate } from 'react-router';
import { StateScreen } from '@/components/feedback/StateScreen';
import { Btn } from '@/components/form/Btn';

export default function SessionExpired() {
  const navigate = useNavigate();
  return (
    <StateScreen
      arte="relogio"
      title="Por segurança, a sessão foi encerrada."
      text="Você pode recomeçar pelo mesmo link."
    >
      <Btn onClick={() => navigate('/triagem/demo')}>Recomeçar</Btn>
    </StateScreen>
  );
}
