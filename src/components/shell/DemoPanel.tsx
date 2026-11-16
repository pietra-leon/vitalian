import { RotateCcw, Settings } from 'lucide-react';
import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/app/components/ui/sheet';
import { Interruptor } from '@/components/form/Interruptor';
import { scenarios } from '@/mock/scenarios';
import { useJourney } from '@/state/JourneyContext';
import { useDemoActions } from '@/state/useDemoActions';
import { telas } from './demoNav';

const item =
  'flex min-h-12 w-full items-center rounded-[14px] border-[1.5px] border-borda bg-superficie px-4 py-2 text-left text-[15px] font-medium text-verde-profundo hover:bg-verde-claro';

/** Painel flutuante do modo demonstração, presente em todas as telas. */
export function DemoPanel() {
  const [open, setOpen] = useState(false);
  const { sim, setSim } = useJourney();
  const demo = useDemoActions();
  const run = (fn: () => void) => () => {
    setOpen(false);
    fn();
  };

  const simulacoes: [string, () => void, boolean?][] = [
    ['Link indisponível', demo.simular.indisponivel],
    ['5 tentativas erradas', demo.simular.tentativas],
    ['Paciente menor de idade', demo.simular.menor, sim.minor],
    ['Erro de envio', demo.simular.erroDeEnvio, sim.sendError],
    ['Sessão expirada', demo.simular.sessao],
    [sim.offline ? 'Restabelecer conexão' : 'Perda de conexão', demo.simular.conexao, sim.offline],
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Painel de demonstração"
        className="sombra-suave fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom))] left-3 z-30 flex size-12 items-center justify-center rounded-full border-[1.5px] border-dashed border-verde bg-superficie text-verde-profundo hover:bg-verde-claro"
      >
        <Settings className="size-6" aria-hidden="true" />
      </SheetTrigger>
      <SheetContent side="left" className="w-[88%] gap-0 overflow-y-auto border-borda bg-creme sm:max-w-sm">
        <SheetHeader className="pr-12">
          <SheetTitle className="font-titulo text-2xl text-verde-profundo">Painel de demonstração</SheetTitle>
          <SheetDescription className="text-[15px] text-texto-2">
            Atalhos que só existem neste mockup. A paciente nunca vê este painel.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-7 px-4 pb-8">
          <label className="flex min-h-12 items-center justify-between gap-3 rounded-[14px] border-[1.5px] border-dashed border-verde px-4 py-2 text-[15px] font-medium text-verde-profundo">
            Mostrar regras acionadas
            <Interruptor
              checked={sim.showRules}
              onCheckedChange={(v) => setSim({ showRules: v })}
            />
          </label>

          <section aria-labelledby="painel-cenarios">
            <h3 id="painel-cenarios" className="mb-3 text-base font-semibold text-verde-profundo">
              Cenários prontos
            </h3>
            <ul className="space-y-2">
              {scenarios.map((s) => (
                <li key={s.id}>
                  <button type="button" className={item} onClick={run(() => demo.cenario(s.id))}>
                    {s.nome}
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="painel-simular">
            <h3 id="painel-simular" className="mb-3 text-base font-semibold text-verde-profundo">
              Simular
            </h3>
            <ul className="space-y-2">
              {simulacoes.map(([nome, fn, ativo]) => (
                <li key={nome}>
                  <button type="button" className={item} onClick={run(fn)}>
                    <span className="flex-1">{nome}</span>
                    {ativo ? (
                      <span className="rounded-full bg-verde px-2 py-0.5 text-[13px] text-creme">ativo</span>
                    ) : null}
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="painel-telas">
            <h3 id="painel-telas" className="mb-3 text-base font-semibold text-verde-profundo">
              Telas
            </h3>
            <ul className="space-y-2">
              {telas.map((t) => (
                <li key={t.path}>
                  <button type="button" className={item} onClick={run(() => demo.irPara(t))}>
                    {t.nome}
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <button
            type="button"
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-verde px-6 text-base font-semibold text-creme hover:bg-verde-profundo"
            onClick={run(demo.reiniciar)}
          >
            <RotateCcw className="size-5" aria-hidden="true" />
            Reiniciar jornada
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
