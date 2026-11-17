// Campos orgânicos: cinco formas de "pedra" desenhadas à mão (caminhos reais,
// sem desfoque). Servem de fundo atrás dos dispositivos e dos títulos.
const formas = [
  'M92 148C140 52 282 8 398 42c110 32 188 124 186 232-2 112-92 196-214 212-128 17-268-22-330-126C2 296 48 236 92 148Z',
  'M48 262C22 150 118 44 262 30c132-13 286 44 306 176 18 122-74 236-214 258C214 486 76 384 48 262Z',
  'M30 300C10 190 110 96 250 80c150-18 310 20 330 150 16 108-90 200-250 214C180 458 50 410 30 300Z',
  'M150 60c90-50 230-30 290 60 70 104 60 250-30 330-84 74-226 60-300-20C30 344 40 122 150 60Z',
  'M80 320c-60-50-40-150 40-180 10-80 110-120 180-80 60-50 170-20 190 60 80 20 100 130 30 180-40 110-190 130-260 60-70 40-160 20-180-40Z',
];

export function OrganicShape({
  n,
  cor,
  className,
}: {
  n: 1 | 2 | 3 | 4 | 5;
  cor: string;
  className?: string;
}) {
  return (
    <svg aria-hidden="true" viewBox="0 0 600 500" preserveAspectRatio="none" className={className}>
      <path d={formas[n - 1]} fill={cor} />
    </svg>
  );
}
