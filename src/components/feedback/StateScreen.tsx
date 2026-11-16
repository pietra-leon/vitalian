import type { ReactNode } from 'react';
import { StepLayout } from '@/components/flow/StepLayout';
import { Estado, type EstadoArte } from './Illustrations';

interface Props {
  arte: EstadoArte;
  title: string;
  text: string;
  /** Um botão (ou grupo curto de botões). */
  children: ReactNode;
}

/** Tela de estado: ilustração simples, título curto, uma frase acolhedora e um botão. */
export function StateScreen({ arte, title, text, children }: Props) {
  return (
    <StepLayout
      title={title}
      centered
      top={
        <div className="mt-6 mb-6">
          <Estado tipo={arte} />
        </div>
      }
    >
      <p className="mx-auto mt-3 max-w-[36ch] text-[17px] leading-relaxed text-texto-2">{text}</p>
      <div className="mt-8 flex flex-col items-stretch gap-3">{children}</div>
    </StepLayout>
  );
}
