import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/app/components/ui/utils';
import { useAnnounce } from '@/components/shell/Announcer';
import { Footer } from '@/components/shell/Footer';

interface Props {
  title: string;
  /** `tela`: Calistoga (títulos de tela e de módulo). `pergunta`: Inter 600, 22-24px. */
  kind?: 'tela' | 'pergunta';
  titleId?: string;
  /** Muda a cada nova etapa: move o foco para o título e avisa o leitor de tela. */
  focusKey?: string;
  top?: ReactNode;
  children: ReactNode;
  /** Ações fixas no rodapé. */
  actions?: ReactNode;
  centered?: boolean;
}

/** Estrutura de uma etapa: título com foco, conteúdo e barra de ação fixa. */
export function StepLayout({ title, kind = 'tela', titleId, focusKey, top, children, actions, centered }: Props) {
  const h1 = useRef<HTMLHeadingElement>(null);
  const announce = useAnnounce();

  useEffect(() => {
    window.scrollTo(0, 0);
    h1.current?.focus({ preventScroll: true });
    announce(title);
    document.title = `${title} · Vitalian (demonstração)`;
  }, [focusKey, title, announce]);

  return (
    <>
      <main
        className={cn(
          'px-5 pt-6',
          // Reserva espaço para a barra fixa não cobrir o conteúdo.
          actions ? 'pb-[calc(7rem+env(safe-area-inset-bottom))]' : 'pb-[calc(5rem+env(safe-area-inset-bottom))] sm:pb-8',
          centered && 'text-center',
        )}
      >
        {top}
        <h1
          ref={h1}
          id={titleId}
          tabIndex={-1}
          data-titulo-tela
          className={cn(
            'text-verde-profundo',
            kind === 'tela'
              ? 'font-titulo text-[28px] leading-[1.2] sm:text-[32px]'
              : 'text-[22px] leading-[1.35] font-semibold sm:text-2xl',
          )}
        >
          {title}
        </h1>
        {children}
        <Footer />
      </main>

      {actions ? (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-borda bg-creme/95 backdrop-blur-sm">
          {/* No celular, o canto esquerdo fica livre para o botão do painel de demonstração. */}
          <div className="mx-auto flex max-w-[520px] items-center gap-1 pr-4 pl-[68px] pt-3 min-[620px]:pl-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
            {actions}
          </div>
        </div>
      ) : null}
    </>
  );
}
