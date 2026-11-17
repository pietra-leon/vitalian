import { NotebookPen, RotateCcw, Settings } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/app/components/ui/sheet';
import { cn } from '@/app/components/ui/utils';
import { type Role, roleLabel, users } from '@/mock/clinic';
import { homeOf, useClinic } from '@/state/ClinicContext';

const item =
  'flex min-h-11 w-full items-center rounded-xl border-[1.5px] border-borda bg-superficie px-4 py-2 text-left text-[15px] font-medium text-verde-profundo hover:bg-verde-claro';

/** Painel de demonstração do médico: papéis, simulações, anotações e reinício. */
export function DemoPanel() {
  const c = useClinic();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const run = (fn: () => void) => () => {
    setOpen(false);
    fn();
  };

  const simular: [string, () => void, boolean?][] = [
    ['Chegou uma triagem urgente', () => { c.simulateUrgent(); if (c.user?.papel !== 'recepcao') navigate('/painel'); }],
    // No produto real, uma triagem de OUTRA clínica responde 404, nunca 403.
    ['Abrir triagem de outra clínica (404)', () => navigate('/painel/triagem/de-outra-clinica')],
    ['Forçar 403', () => navigate('/painel/sem-permissao')],
    ['Sessão expirada', () => navigate('/painel/sessao-expirada')],
    [c.sim.empty ? 'Lista vazia: desligar' : 'Lista vazia', () => { c.setSim({ empty: !c.sim.empty }); navigate('/painel'); }, c.sim.empty],
    ['Carregando (skeleton por 3s)', () => { c.simulateLoading(); navigate('/painel'); }],
    [c.sim.error ? 'Erro ao carregar: desligar' : 'Erro ao carregar', () => { c.setSim({ error: !c.sim.error }); navigate('/painel'); }, c.sim.error],
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Painel de demonstração"
        className="nao-imprimir sombra-suave fixed bottom-[calc(0.25rem+env(safe-area-inset-bottom))] left-2 z-40 flex size-12 items-center justify-center rounded-full border-[1.5px] border-dashed border-verde bg-superficie text-verde-profundo hover:bg-verde-claro lg:bottom-3 lg:left-3"
      >
        <Settings className="size-6" aria-hidden="true" />
      </SheetTrigger>
      <SheetContent side="left" className="w-[88%] gap-0 overflow-y-auto border-borda bg-creme sm:max-w-sm">
        <SheetHeader className="pr-12">
          <SheetTitle className="font-titulo text-2xl text-verde-profundo">Painel de demonstração</SheetTitle>
          <SheetDescription className="text-[15px] text-texto-2">
            Atalhos que só existem neste mockup.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-6 px-4 pb-8">
          <section aria-labelledby="dp-papel">
            <h3 id="dp-papel" className="mb-2 text-base font-semibold text-verde-profundo">
              Trocar de papel
            </h3>
            <ul className="space-y-2">
              {(Object.keys(users) as Role[]).map((r) => (
                <li key={r}>
                  <button
                    type="button"
                    aria-pressed={c.user?.papel === r}
                    className={cn(item, c.user?.papel === r && 'border-verde bg-verde-claro font-semibold')}
                    onClick={run(() => {
                      c.login(r);
                      navigate(homeOf(r));
                    })}
                  >
                    <span className="flex-1">
                      {roleLabel[r]} · {users[r].nome}
                    </span>
                    {c.user?.papel === r ? <span className="text-[13px]">atual</span> : null}
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="dp-sim">
            <h3 id="dp-sim" className="mb-2 text-base font-semibold text-verde-profundo">
              Simular
            </h3>
            <ul className="space-y-2">
              {simular.map(([nome, fn, ativo]) => (
                <li key={nome}>
                  <button type="button" className={item} onClick={run(fn)}>
                    <span className="flex-1">{nome}</span>
                    {ativo ? <span className="rounded-full bg-verde px-2 py-0.5 text-[13px] text-creme">ativo</span> : null}
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <button type="button" className={item} onClick={run(() => c.setNotesOpen(true))}>
            <NotebookPen className="mr-2 size-5" aria-hidden="true" />
            Anotações da validação ({c.notes.length})
          </button>
          <button type="button" className={item} onClick={run(() => navigate('/'))}>
            Central de demonstração
          </button>
          <button
            type="button"
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-verde px-6 text-base font-semibold text-creme hover:bg-verde-profundo"
            onClick={run(() => {
              c.reset();
              navigate('/painel/login');
            })}
          >
            <RotateCcw className="size-5" aria-hidden="true" />
            Reiniciar demonstração
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
