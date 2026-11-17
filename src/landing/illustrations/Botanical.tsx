// Motivo botânico da marca: hastes, folhas e flores chapadas, sem contorno,
// com a estrela do logo no lugar da flor. Duas ou três cores por desenho.
import { Petalas } from './StarMark';

type Variante = 'broto' | 'flor' | 'ramo' | 'duas' | 'buque';

interface Props {
  variante: Variante;
  className?: string;
  /** Cores: haste/folhas, flor A, flor B. */
  cores?: [string, string, string];
}

const padrao: [string, string, string] = ['var(--verde)', 'var(--salmao)', 'var(--salmao-profundo)'];

const folha = (x: number, y: number, r: number, s = 1) =>
  `translate(${x} ${y}) rotate(${r}) scale(${s})`;
const FOLHA = 'M0 0C-22-10-34-40-22-74 4-58 18-28 0 0Z';

export function Botanical({ variante, className, cores = padrao }: Props) {
  const [v, a, b] = cores;
  if (variante === 'buque') {
    // Composição larga, para transbordar de um campo de cor.
    return (
      <svg aria-hidden="true" viewBox="0 0 520 420" className={className}>
        <path d="M250 420C246 330 232 250 190 170" fill="none" stroke={v} strokeWidth="9" strokeLinecap="round" />
        <path d="M262 420C270 320 300 250 352 196" fill="none" stroke={v} strokeWidth="9" strokeLinecap="round" />
        <path d="M256 420C256 350 262 300 268 120" fill="none" stroke={v} strokeWidth="9" strokeLinecap="round" />
        <path d={FOLHA} fill={v} transform={folha(230, 300, -62, 1.5)} />
        <path d={FOLHA} fill={v} transform={folha(290, 320, 70, 1.6)} />
        <path d={FOLHA} fill={v} transform={folha(262, 240, 36, 1.1)} />
        <g transform="translate(186 150) scale(1.5)">
          <Petalas cores={[a, b]} />
        </g>
        <g transform="translate(360 180) scale(1.2) rotate(20)">
          <Petalas cores={[b, a]} />
        </g>
        <g transform="translate(270 92) scale(1.75) rotate(-12)">
          <Petalas cores={[a, b]} />
        </g>
      </svg>
    );
  }
  return (
    <svg aria-hidden="true" viewBox="0 0 200 260" className={className}>
      {variante === 'broto' && (
        <>
          <path d="M100 260C100 200 96 150 104 96" fill="none" stroke={v} strokeWidth="7" strokeLinecap="round" />
          <path d={FOLHA} fill={v} transform={folha(100, 200, -58, 1.15)} />
          <path d={FOLHA} fill={v} transform={folha(102, 160, 62, 0.95)} />
          {/* Botão ainda fechado. */}
          <path d="M104 100C80 84 78 44 104 20c26 24 24 64 0 80Z" fill={a} />
          <path d="M104 100C96 80 96 52 104 20c8 32 8 60 0 80Z" fill={b} />
        </>
      )}
      {variante === 'flor' && (
        <>
          <path d="M96 260C98 200 108 150 100 100" fill="none" stroke={v} strokeWidth="7" strokeLinecap="round" />
          <path d={FOLHA} fill={v} transform={folha(98, 210, 64, 1.2)} />
          <path d={FOLHA} fill={v} transform={folha(102, 170, -66, 1)} />
          <g transform="translate(100 78) scale(1.5)">
            <Petalas cores={[a, b]} />
          </g>
        </>
      )}
      {variante === 'ramo' && (
        <>
          {/* Haste que se curva, como quem relaxa. */}
          <path d="M70 260C74 190 80 130 132 82" fill="none" stroke={v} strokeWidth="7" strokeLinecap="round" />
          <path d={FOLHA} fill={v} transform={folha(74, 214, -60, 1.1)} />
          <path d={FOLHA} fill={v} transform={folha(82, 168, 58, 1.2)} />
          <path d={FOLHA} fill={v} transform={folha(104, 118, -40, 0.9)} />
          <g transform="translate(140 70) scale(1.05) rotate(24)">
            <Petalas cores={[a, b]} />
          </g>
        </>
      )}
      {variante === 'duas' && (
        <>
          <path d="M92 260C90 200 84 160 70 120" fill="none" stroke={v} strokeWidth="7" strokeLinecap="round" />
          <path d="M100 260C104 190 120 130 138 76" fill="none" stroke={v} strokeWidth="7" strokeLinecap="round" />
          <path d={FOLHA} fill={v} transform={folha(98, 214, 66, 1.15)} />
          <g transform="translate(66 104) scale(0.95)">
            <Petalas cores={[a, a]} />
          </g>
          {/* A flor que se destaca. */}
          <g transform="translate(142 62) scale(1.45) rotate(-10)">
            <Petalas cores={[b, a]} />
          </g>
        </>
      )}
    </svg>
  );
}
