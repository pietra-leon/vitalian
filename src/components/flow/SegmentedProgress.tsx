import { modules } from '@/mock/questionnaire';

interface Props {
  /** Módulo atual (1 a 4). */
  current: number;
  /** Fração concluída do módulo atual, de 0 a 1. */
  fraction: number;
}

/** Barra de progresso em 4 segmentos, um por módulo. */
export function SegmentedProgress({ current, fraction }: Props) {
  const total = modules.length;
  const pct = Math.round(((current - 1 + fraction) / total) * 100);
  return (
    <div className="mb-6">
      <p className="mb-2 text-[15px] font-semibold text-verde-profundo">
        Módulo {current} de {total}
        <span className="font-normal text-texto-2"> · {modules[current - 1]?.title}</span>
      </p>
      <div
        role="progressbar"
        aria-label="Progresso do questionário"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-valuetext={`Módulo ${current} de ${total}`}
        className="flex gap-1.5"
      >
        {modules.map((m) => {
          const fill = m.id < current ? 1 : m.id === current ? fraction : 0;
          return (
            <span key={m.id} className="h-2 flex-1 overflow-hidden rounded-full border border-texto-2/50 bg-verde-claro">
              <span
                className="block h-full rounded-full bg-verde transition-[width] duration-300"
                style={{ width: `${fill * 100}%` }}
              />
            </span>
          );
        })}
      </div>
    </div>
  );
}
