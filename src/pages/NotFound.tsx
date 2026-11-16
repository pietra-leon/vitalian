import { useNavigate } from 'react-router';
import { StateScreen } from '@/components/feedback/StateScreen';
import { Btn } from '@/components/form/Btn';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <StateScreen
      arte="bussola"
      title="Não encontramos esta página."
      text="Pode ter sido um endereço digitado errado. Está tudo bem: é só voltar ao início."
    >
      <Btn onClick={() => navigate('/triagem/demo')}>Voltar ao início</Btn>
    </StateScreen>
  );
}
