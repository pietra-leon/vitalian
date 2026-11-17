import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** Atraso em ms, para escalonar grupos. */
  atraso?: number;
  as?: ElementType;
  className?: string;
}

/** Revela o elemento ao entrar na tela: uma vez só, fade + 12px (CSS em landing.css). */
export function Reveal({ children, atraso = 0, as: Tag = 'div', className = '' }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      el.setAttribute('data-visivel', '');
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.setAttribute('data-visivel', '');
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`revelar ${className}`} style={{ '--atraso': `${atraso}ms` } as CSSProperties}>
      {children}
    </Tag>
  );
}
