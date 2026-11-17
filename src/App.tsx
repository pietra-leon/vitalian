// Mockup da jornada da paciente. Servido em /jornada/ (a landing continua em /).
// HashRouter: o GitHub Pages não faz fallback de rotas.
import { Suspense, lazy, type ReactNode } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router';
import { Allow, PanelShell } from '@/components/painel/shell/PanelShell';
import { AppShell } from '@/components/shell/AppShell';
import { ClinicProvider } from '@/state/ClinicContext';
import { JourneyProvider, firstPendingPath, useJourney } from '@/state/JourneyContext';

// Code-splitting por rota.
const Demo = lazy(() => import('@/pages/Demo'));
const Welcome = lazy(() => import('@/pages/Welcome'));
const Consent = lazy(() => import('@/pages/Consent'));
const Verify = lazy(() => import('@/pages/Verify'));
const Module = lazy(() => import('@/pages/Module'));
const Review = lazy(() => import('@/pages/Review'));
const Done = lazy(() => import('@/pages/Done'));
const Unavailable = lazy(() => import('@/pages/Unavailable'));
const Locked = lazy(() => import('@/pages/Locked'));
const Minor = lazy(() => import('@/pages/Minor'));
const SendError = lazy(() => import('@/pages/SendError'));
const SessionExpired = lazy(() => import('@/pages/SessionExpired'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Área do médico (/painel)
const Login = lazy(() => import('@/pages/painel/Login'));
const Triagens = lazy(() => import('@/pages/painel/Triagens'));
const TriagemDetalhe = lazy(() => import('@/pages/painel/TriagemDetalhe'));
const Relatorio = lazy(() => import('@/pages/painel/Relatorio'));
const Convites = lazy(() => import('@/pages/painel/Convites'));
const NovoConvite = lazy(() => import('@/pages/painel/NovoConvite'));
const Questionario = lazy(() => import('@/pages/painel/Questionario'));
const Acessos = lazy(() => import('@/pages/painel/Acessos'));
const estados = () => import('@/pages/painel/Estados');
const SemPermissao = lazy(() => estados().then((m) => ({ default: m.SemPermissao })));
const NaoEncontrado = lazy(() => estados().then((m) => ({ default: m.NaoEncontrado })));
const SessaoExpirada = lazy(() => estados().then((m) => ({ default: m.SessaoExpirada })));

/**
 * Guardas em memória: sem consentimento não se acessa a verificação; sem
 * verificação não se acessa o questionário; sem enviar pela revisão não se
 * acessa a conclusão. Quem viola a regra vai para a primeira etapa pendente.
 */
function Guard({ need, children }: { need: 'consent' | 'verified' | 'submitted'; children: ReactNode }) {
  const j = useJourney();
  if (need === 'consent') {
    if (!j.consent) return <Navigate to={firstPendingPath(j)} replace />;
    if (j.attemptsLeft <= 0) return <Navigate to="/triagem/bloqueado" replace />;
    return children;
  }
  if (!j.consent || !j.verified) return <Navigate to={firstPendingPath(j)} replace />;
  if (need === 'submitted' && !j.submitted) return <Navigate to="/triagem/demo/revisao" replace />;
  return children;
}

export default function App() {
  return (
    <ClinicProvider>
    <JourneyProvider>
      <HashRouter>
        <Suspense fallback={null}>
        <Routes>
          {/* Área do médico. Login e sessão expirada ficam fora do shell. */}
          <Route path="/painel/login" element={<Login />} />
          <Route path="/painel/sessao-expirada" element={<SessaoExpirada />} />
          <Route element={<PanelShell />}>
            <Route path="/painel" element={<Allow area="triagens"><Triagens /></Allow>} />
            <Route path="/painel/triagem/:id" element={<Allow area="triagens"><TriagemDetalhe /></Allow>} />
            <Route path="/painel/triagem/:id/relatorio" element={<Allow area="triagens"><Relatorio /></Allow>} />
            <Route path="/painel/convites" element={<Allow area="convites"><Convites /></Allow>} />
            <Route path="/painel/convites/novo" element={<Allow area="convites"><NovoConvite /></Allow>} />
            <Route path="/painel/questionario" element={<Allow area="questionario"><Questionario /></Allow>} />
            <Route path="/painel/acessos" element={<Allow area="acessos"><Acessos /></Allow>} />
            <Route path="/painel/sem-permissao" element={<SemPermissao />} />
            <Route path="/painel/nao-encontrado" element={<NaoEncontrado />} />
            <Route path="/painel/*" element={<NaoEncontrado />} />
          </Route>

          <Route element={<AppShell />}>
            <Route path="/" element={<Demo />} />
            <Route path="/triagem/demo" element={<Welcome />} />
            <Route path="/triagem/demo/consentimento" element={<Consent />} />
            <Route path="/triagem/demo/verificacao" element={<Guard need="consent"><Verify /></Guard>} />
            <Route path="/triagem/demo/modulo/:n" element={<Guard need="verified"><Module /></Guard>} />
            <Route path="/triagem/demo/revisao" element={<Guard need="verified"><Review /></Guard>} />
            <Route path="/triagem/demo/concluido" element={<Guard need="submitted"><Done /></Guard>} />
            <Route path="/triagem/indisponivel" element={<Unavailable />} />
            <Route path="/triagem/bloqueado" element={<Locked />} />
            <Route path="/triagem/menor" element={<Minor />} />
            <Route path="/triagem/erro" element={<SendError />} />
            <Route path="/triagem/sessao-expirada" element={<SessionExpired />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        </Suspense>
      </HashRouter>
    </JourneyProvider>
    </ClinicProvider>
  );
}
