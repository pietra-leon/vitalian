import { topBar } from '../content/copy';

/** Faixa fina no topo, com link para a seção final. */
export function TopBar() {
  return (
    <a
      href="#conversar"
      className="sobre-escuro flex min-h-12 items-center justify-center bg-verde px-4 py-2 text-center text-[14px] leading-snug font-medium text-creme hover:underline"
    >
      {topBar}
    </a>
  );
}
