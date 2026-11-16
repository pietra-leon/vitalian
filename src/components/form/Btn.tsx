import type { ComponentProps } from 'react';
import { Button } from '@/app/components/ui/button';
import { cn } from '@/app/components/ui/utils';

type Variante = 'primario' | 'secundario' | 'contorno' | 'texto' | 'demo';

const estilos: Record<Variante, string> = {
  // Fundo verde, texto creme (9,9:1).
  primario: 'bg-verde text-creme hover:bg-verde-profundo hover:text-creme px-6',
  // Salmão só como FUNDO, sempre com verde-profundo por cima (6,6:1).
  secundario: 'bg-salmao text-verde-profundo hover:bg-salmao/85 hover:text-verde-profundo px-6',
  contorno:
    'border-[1.5px] border-verde bg-superficie text-verde-profundo hover:bg-verde-claro px-6',
  texto: 'bg-transparent text-verde-profundo underline-offset-4 hover:underline hover:bg-transparent px-3',
  // Controles que só existem no mockup: sempre tracejados.
  demo: 'border-[1.5px] border-dashed border-verde bg-transparent text-verde-profundo hover:bg-verde-claro px-5',
};

/** Botão em pílula, com alvo de toque de 48px, sobre o Button do shadcn/ui. */
export function Btn({
  variante = 'primario',
  className,
  ...props
}: Omit<ComponentProps<typeof Button>, 'variant' | 'size'> & { variante?: Variante }) {
  return (
    <Button
      variant="ghost"
      className={cn(
        'h-auto min-h-12 rounded-full py-3 text-base font-semibold whitespace-normal [&_svg:not([class*=size-])]:size-5',
        'disabled:opacity-100 disabled:bg-verde-claro disabled:text-texto-2',
        estilos[variante],
        className,
      )}
      {...props}
    />
  );
}
