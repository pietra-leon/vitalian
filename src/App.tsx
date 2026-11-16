// Mockup da jornada da paciente. Servido em /jornada/ (a landing continua em /).
// HashRouter: o GitHub Pages não faz fallback de rotas.
import { lazy, type ReactNode } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router';
import { AppShell } from '@/components/shell/AppShell';
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
    <JourneyProvider>
      <HashRouter>
        <Routes>
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
      </HashRouter>
    </JourneyProvider>
  );
}
