import type { ReactNode } from 'react';

/** Título de seção em Fraunces. Aceita um array para títulos em duas partes. */
export function SectionTitle({
  children,
  id,
  className = '',
  as: Tag = 'h2',
}: {
  children: ReactNode | readonly string[];
  id?: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
}) {
  return (
    <Tag id={id} className={`display t-secao ${className}`}>
      {Array.isArray(children)
        ? (children as string[]).map((linha) => (
            <span key={linha} className="block">
              {linha}
            </span>
          ))
        : (children as ReactNode)}
    </Tag>
  );
}
