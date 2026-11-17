import { silencio } from '../content/copy';
import { Petalas } from './StarMark';

const FOLHA = 'M0 0C-14-6-22-26-14-48 3-38 12-18 0 0Z';
// Folhas que se soltam no trecho vazio: posição, rotação, escala.
const soltas: [number, number, number, number][] = [
  [322, 286, 40, 1.05],
  [372, 258, -70, 0.9],
  [432, 244, 120, 1.2],
  [478, 280, 20, 0.8],
  [530, 262, -130, 1.0],
  [404, 292, 160, 0.7],
  [566, 290, 75, 0.85],
];

/**
 * A ilustração do "silêncio": entre o agendamento e a consulta há um trecho
 * vazio, onde as folhas se soltam. O Vitalian é a ponte em salmão.
 */
export function SilenceTimeline({ className }: { className?: string }) {
  return (
    <figure className={className}>
      <Desenho />
      {/* Rótulos em HTML, alinhados às estrelas, para ficarem legíveis no celular. */}
      <figcaption aria-hidden="true" className="relative mt-3 h-7 text-[16px] font-bold lg:text-[18px]">
        <span className="absolute left-[17%] -translate-x-1/2">{silencio.inicio}</span>
        <span className="absolute left-[83%] -translate-x-1/2">{silencio.fim}</span>
      </figcaption>
    </figure>
  );
}

function Desenho() {
  return (
    <svg role="img" aria-label={silencio.alt} viewBox="0 60 880 290" className="h-auto w-full">
      {/* A ponte: um arco chapado em salmão que liga os dois pontos. */}
      <path d="M150 300C250 120 630 120 730 300h-52C600 190 280 190 202 300Z" fill="var(--salmao)" />
      <text
        x="440"
        y="124"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontSize="46"
        fontWeight="560"
        letterSpacing="-1"
        fill="var(--verde-profundo)"
        style={{ fontVariationSettings: "'SOFT' 100" }}
      >
        {silencio.ponte}
      </text>

      {/* Linha do tempo: firme nas pontas, interrompida no meio. */}
      <path d="M40 300H250" stroke="var(--verde)" strokeWidth="6" strokeLinecap="round" />
      <path d="M630 300H840" stroke="var(--verde)" strokeWidth="6" strokeLinecap="round" />
      <path d="M280 300H600" stroke="var(--verde)" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 20" />

      {soltas.map(([x, y, r, s], i) => (
        <path
          key={i}
          d={FOLHA}
          fill={i % 3 === 0 ? 'var(--verde-profundo)' : 'var(--verde)'}
          transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}
        />
      ))}

      {/* Os dois pontos: uma estrela em cada margem. */}
      <g transform="translate(150 300) scale(0.9)">
        <Petalas cores={['var(--verde)', 'var(--verde-profundo)']} />
      </g>
      <g transform="translate(730 300) scale(0.9)">
        <Petalas cores={['var(--verde)', 'var(--verde-profundo)']} />
      </g>
    </svg>
  );
}
