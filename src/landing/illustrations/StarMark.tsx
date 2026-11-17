/**
 * A estrela do logo, redesenhada em SVG: cinco pétalas elípticas chapadas.
 * É o elemento recorrente das ilustrações (miolo das flores, marcadores).
 */
export function StarMark({
  size = 48,
  cores = ['var(--salmao)', 'var(--salmao-profundo)'],
  className,
}: {
  size?: number;
  cores?: [string, string];
  className?: string;
}) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="-50 -50 100 100" className={className}>
      <Petalas cores={cores} />
    </svg>
  );
}

/** As cinco pétalas, para reutilizar dentro de outros SVGs (centradas em 0,0, raio ~46). */
export function Petalas({ cores }: { cores: [string, string] }) {
  return (
    <>
      {[0, 72, 144, 216, 288].map((a, i) => (
        <ellipse key={a} cx="0" cy="-20" rx="15" ry="26" fill={cores[i % 2]} transform={`rotate(${a + 8})`} />
      ))}
    </>
  );
}
