import { LogOut } from 'lucide-react';

/**
 * Saída rápida: troca a página por um site neutro, SEM confirmação, e usa
 * `replace` para que o botão "voltar" do navegador não retorne a esta tela.
 */
export function QuickExit() {
  return (
    <button
      type="button"
      onClick={() => window.location.replace('https://www.google.com.br')}
      className="sombra-suave fixed top-[108px] right-3 z-40 flex min-h-12 items-center gap-2 rounded-full border-[1.5px] border-verde-profundo bg-salmao px-4 text-[15px] font-semibold text-verde-profundo hover:bg-salmao/85 sm:right-[max(0.75rem,calc(50vw-248px))]"
    >
      <LogOut className="size-5" aria-hidden="true" />
      Saída rápida
    </button>
  );
}
