import { Suspense, type ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router';
import { DemoBanner } from '@/components/shell/DemoBanner';
import { type Area, can, useClinic } from '@/state/ClinicContext';
import { BottomNav } from './BottomNav';
import { DemoPanel } from './DemoPanel';
import { NotesSheet } from './NotesSheet';
import { Sidebar } from './Sidebar';
import { Toaster } from './Toaster';
import { Topbar } from './Topbar';

/** Moldura do painel: banner, barra lateral (desktop), barra superior e navegação inferior (celular). */
export function PanelShell() {
  const { user } = useClinic();
  // Autenticação simulada: sem usuário, vai para o login.
  if (!user) return <Navigate to="/painel/login" replace />;
  return (
    <div className="min-h-dvh bg-creme text-verde-profundo">
      <div className="nao-imprimir sticky top-0 z-40">
        <DemoBanner />
      </div>
      <Sidebar />
      <div className="lg:pl-[248px]">
        <Topbar />
        <main className="area-painel mx-auto w-full max-w-[1180px] px-4 pt-5 pb-28 lg:px-8 lg:pb-12">
          <Suspense fallback={<p className="py-16 text-center text-texto-2">Carregando…</p>}>
            <Outlet />
          </Suspense>
        </main>
      </div>
      <BottomNav />
      <DemoPanel />
      <NotesSheet />
      <Toaster />
    </div>
  );
}

/**
 * Guarda por papel, em memória. Sem permissão, vai para /painel/sem-permissao.
 * (Triagem inexistente ou de outra clínica é outro caso: responde 404.)
 */
export function Allow({ area, children }: { area: Area; children: ReactNode }) {
  const { user } = useClinic();
  if (!user) return <Navigate to="/painel/login" replace />;
  if (!can(user.papel, area)) return <Navigate to="/painel/sem-permissao" replace />;
  return children;
}
