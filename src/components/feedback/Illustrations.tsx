// Ilustrações em SVG inline (sem imagens externas), só em verde e salmão.
// São decorativas: sempre com aria-hidden.
import type { ReactNode } from 'react';

const V = 'var(--verde)';
const VP = 'var(--verde-profundo)';
const VC = 'var(--verde-claro)';
const S = 'var(--salmao)';
const SUP = 'var(--superficie)';

function Base({ children, size = 120 }: { children: ReactNode; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      stroke={VP}
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mx-auto block"
    >
      <path
        d="M60 8c26 0 48 16 50 44s-14 56-48 58S10 92 9 62 34 8 60 8Z"
        fill={VC}
        stroke="none"
      />
      {children}
    </svg>
  );
}

/** Boas-vindas: um ramo com folhas e uma flor simples. */
export function Ramo({ size = 148 }: { size?: number }) {
  return (
    <Base size={size}>
      <path d="M58 104C56 84 60 62 72 44" stroke={V} />
      <path d="M61 82c-16 2-27-6-30-20 15-2 27 5 30 20Z" fill={SUP} stroke={V} />
      <path d="M64 66c14 4 26-2 31-15-14-4-26 2-31 15Z" fill={SUP} stroke={V} />
      <path d="M60 94c10 2 18-2 22-10-10-3-18 1-22 10Z" fill={V} stroke={V} />
      <g stroke={VP}>
        <circle cx="76" cy="26" r="7" fill={S} />
        <circle cx="88" cy="35" r="7" fill={S} />
        <circle cx="84" cy="49" r="7" fill={S} />
        <circle cx="69" cy="49" r="7" fill={S} />
        <circle cx="64" cy="35" r="7" fill={S} />
        <circle cx="76" cy="39" r="6" fill={SUP} />
      </g>
    </Base>
  );
}

/** Sucesso: um visto dentro de um círculo, com folhinhas. */
export function Sucesso({ size = 120 }: { size?: number }) {
  return (
    <Base size={size}>
      <circle cx="60" cy="60" r="28" fill={SUP} stroke={V} />
      <path d="m47 61 9 9 18-20" stroke={V} strokeWidth={3} />
      <path d="M92 30c-8 0-13 5-13 12 8 0 13-5 13-12Z" fill={S} />
      <path d="M26 86c0-7 5-11 12-11 0 7-5 11-12 11Z" fill={S} />
    </Base>
  );
}

export type EstadoArte = 'link' | 'cadeado' | 'pessoas' | 'nuvem' | 'relogio' | 'bussola';

/** Ilustrações simples das telas de estado. */
export function Estado({ tipo, size = 120 }: { tipo: EstadoArte; size?: number }) {
  return (
    <Base size={size}>
      {tipo === 'link' && (
        <>
          <path d="M52 68 68 52" stroke={V} strokeWidth={2.5} />
          <path d="M56 46l6-6a14 14 0 0 1 20 20l-6 6" fill="none" stroke={V} strokeWidth={2.5} />
          <path d="M64 74l-6 6a14 14 0 0 1-20-20l6-6" fill="none" stroke={V} strokeWidth={2.5} />
          <circle cx="88" cy="84" r="7" fill={S} />
        </>
      )}
      {tipo === 'cadeado' && (
        <>
          <rect x="38" y="54" width="44" height="34" rx="8" fill={SUP} stroke={V} />
          <path d="M47 54v-8a13 13 0 0 1 26 0v8" stroke={V} />
          <circle cx="60" cy="69" r="4" fill={S} />
          <path d="M60 73v6" />
        </>
      )}
      {tipo === 'pessoas' && (
        <>
          <circle cx="48" cy="46" r="10" fill={SUP} stroke={V} />
          <path d="M30 88c0-12 8-20 18-20s18 8 18 20" fill={SUP} stroke={V} />
          <circle cx="78" cy="54" r="8" fill={S} />
          <path d="M64 88c0-10 6-16 14-16s14 6 14 16" fill={S} />
        </>
      )}
      {tipo === 'nuvem' && (
        <>
          <path
            d="M40 80a14 14 0 0 1 2-28 20 20 0 0 1 38 4 12 12 0 0 1 0 24Z"
            fill={SUP}
            stroke={V}
          />
          <path d="M60 60v10" stroke={V} strokeWidth={2.5} />
          <path d="m54 62 6-6 6 6" stroke={V} strokeWidth={2.5} />
          <circle cx="88" cy="38" r="6" fill={S} />
        </>
      )}
      {tipo === 'relogio' && (
        <>
          <circle cx="60" cy="62" r="26" fill={SUP} stroke={V} />
          <path d="M60 46v16l10 7" stroke={V} strokeWidth={2.5} />
          <circle cx="86" cy="34" r="6" fill={S} />
        </>
      )}
      {tipo === 'bussola' && (
        <>
          <circle cx="60" cy="60" r="27" fill={SUP} stroke={V} />
          <path d="m70 50-6 16-14 4 6-16Z" fill={S} />
          <circle cx="60" cy="60" r="2" fill={VP} />
        </>
      )}
    </Base>
  );
}
