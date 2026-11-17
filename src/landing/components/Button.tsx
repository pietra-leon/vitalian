import type { AnchorHTMLAttributes, ReactNode } from 'react';

type Variante = 'primario' | 'secundario' | 'claro';

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variante?: Variante;
  /** Link externo: abre em nova aba, com rel seguro. */
  externo?: boolean;
  children: ReactNode;
}

/** Botão em pílula de 56px. É sempre um link: todas as ações da página navegam. */
export function Button({ variante = 'primario', externo, className = '', children, ...props }: Props) {
  return (
    <a
      className={`botao botao-${variante} ${className}`}
      {...(externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...props}
    >
      {children}
    </a>
  );
}
