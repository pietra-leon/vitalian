import type { ReactNode } from 'react';

/** Rótulo pequeno em caixa alta, acima dos títulos. */
export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`eyebrow ${className}`}>{children}</p>;
}
