import { WifiOff } from 'lucide-react';
import { Suspense } from 'react';
import { Outlet } from 'react-router';
import { useJourney } from '@/state/JourneyContext';
import { AnnouncerProvider } from './Announcer';
import { DemoBanner } from './DemoBanner';
import { DemoPanel } from './DemoPanel';
import { Header } from './Header';
import { SessionWarning } from './SessionWarning';

/** Moldura de todas as telas: faixa de demonstração, cabeçalho, coluna central e painel. */
export function AppShell() {
  const { sim } = useJourney();
  return (
    <AnnouncerProvider>
      {/* Atmosfera: duas formas orgânicas desfocadas (salmão a 15%, verde a 8%). */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-creme">
        <div className="absolute -top-24 -right-28 h-[420px] w-[460px] rounded-[58%_42%_55%_45%/48%_56%_44%_52%] bg-salmao opacity-15 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-[480px] w-[520px] rounded-[44%_56%_40%_60%/55%_45%_55%_45%] bg-verde opacity-[0.08] blur-3xl" />
      </div>

      <div className="sticky top-0 z-40">
        <DemoBanner />
        {sim.offline ? (
          <p
            role="status"
            className="flex items-start justify-center gap-2 bg-salmao-suave px-4 py-2 text-[15px] font-medium text-salmao-profundo"
          >
            <WifiOff className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            <span className="max-w-[480px]">
              Você está sem internet. Suas respostas estão guardadas só nesta tela; não feche a página.
            </span>
          </p>
        ) : null}
        <Header />
      </div>

      <div className="mx-auto w-full max-w-[520px] sm:my-6 sm:min-h-[640px] sm:rounded-[20px] sm:border sm:border-borda sm:bg-creme/70 sm:sombra-suave">
        <Suspense fallback={<p className="px-5 py-16 text-center text-texto-2">Carregando…</p>}>
          <Outlet />
        </Suspense>
      </div>

      <DemoPanel />
      <SessionWarning />
    </AnnouncerProvider>
  );
}
