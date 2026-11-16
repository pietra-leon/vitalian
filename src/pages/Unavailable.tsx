import { useNavigate } from 'react-router';
import { StateScreen } from '@/components/feedback/StateScreen';
import { Btn } from '@/components/form/Btn';

/**
 * IMPORTANTE: no produto real, link INVÁLIDO, EXPIRADO e JÁ USADO exibem
 * exatamente esta mesma mensagem, para não revelar a quem abre o link qual
 * dos casos ocorreu (isso evitaria, por exemplo, confirmar que um link já
 * foi respondido). Por isso existe uma única tela, sem dizer o motivo.
 */
export default function Unavailable() {
  const navigate = useNavigate();
  return (
    <StateScreen arte="link" title="Este link não está disponível." text="Peça um novo link à sua clínica.">
      <Btn variante="demo" onClick={() => navigate('/')}>
        Demonstração: voltar à central
      </Btn>
    </StateScreen>
  );
}
