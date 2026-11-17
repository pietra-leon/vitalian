import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Estado, type EstadoArte } from '@/components/feedback/Illustrations';
import { Btn } from '@/components/form/Btn';
import { DemoBanner } from '@/components/shell/DemoBanner';
import { homeOf, useClinic } from '@/state/ClinicContext';

function Tela({ arte, titulo, texto, children }: { arte: EstadoArte; titulo: string; texto?: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-md py-10 text-center">
      <Estado tipo={arte} />
      <h2 className="font-titulo mt-5 text-[26px] leading-tight text-verde-profundo">{titulo}</h2>
      {texto ? <p className="mt-2 text-base text-texto-2">{texto}</p> : null}
      <div className="mt-6 flex justify-center">{children}</div>
    </div>
  );
}

/** 403: o papel não tem acesso à área. */
export function SemPermissao() {
  const { user } = useClinic();
  const navigate = useNavigate();
  return (
    <Tela arte="cadeado" titulo="Você não tem acesso a esta área." texto="Fale com o administrador da clínica.">
      <Btn onClick={() => navigate(user ? homeOf(user.papel) : '/painel/login')}>Voltar</Btn>
    </Tela>
  );
}

/**
 * 404. IMPORTANTE: no produto real, uma triagem de OUTRA clínica responde
 * "não encontrada" (404), e nunca "sem permissão" (403), para não revelar que
 * ela existe. Por isso o texto não insinua existência nem permissão.
 */
export function NaoEncontrado() {
  const { user } = useClinic();
  const navigate = useNavigate();
  return (
    <Tela arte="bussola" titulo="Não encontramos esta triagem.">
      <Btn onClick={() => navigate(user ? homeOf(user.papel) : '/painel/login')}>Voltar à lista</Btn>
    </Tela>
  );
}

/** Sessão expirada: fora do shell, porque não há mais usuário. */
export function SessaoExpirada() {
  const navigate = useNavigate();
  const { user, logout } = useClinic();
  // A sessão termina aqui: ao chegar nesta tela, o usuário é desconectado.
  useEffect(() => {
    if (user) logout();
  }, [user, logout]);
  return (
    <div className="min-h-dvh bg-creme px-5">
      <div className="-mx-5">
        <DemoBanner />
      </div>
      <Tela arte="relogio" titulo="Por segurança, sua sessão foi encerrada.">
        <Btn onClick={() => navigate('/painel/login')}>Entrar novamente</Btn>
      </Tela>
    </div>
  );
}
