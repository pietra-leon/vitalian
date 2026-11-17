import * as Dialog from '@radix-ui/react-dialog';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import { mensagens, nav, navCta, wa } from '../content/copy';

const base = import.meta.env.BASE_URL;

export function Logo() {
  return (
    <a href="#/" aria-label="Vitalian: início" className="flex shrink-0 items-center gap-2 rounded-lg py-2">
      <img src={`${base}LOGO.png`} alt="" width={214} height={209} className="h-10 w-auto" />
      <img src={`${base}LOGO_NOME.png`} alt="Vitalian" width={429} height={105} className="h-7 w-auto" />
    </a>
  );
}

/** Cabeçalho fixo de 80px. A linha inferior só aparece depois de rolar. */
export function Header() {
  const [rolou, setRolou] = useState(false);
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    const onScroll = () => setRolou(window.scrollY > 56);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 h-20 border-b bg-creme transition-colors ${rolou ? 'border-borda' : 'border-transparent'}`}
    >
      <div className="conteiner flex h-full items-center justify-between gap-6">
        <Logo />
        <nav aria-label="Principal" className="hidden items-center gap-8 lg:flex">
          {nav.map((l) => (
            <a key={l.id} href={`#${l.id}`} className="elo elo-nav text-[16px] font-medium">
              {l.label}
            </a>
          ))}
          <Button href={wa(mensagens.conhecer)} externo className="min-h-12 px-6">
            {navCta}
          </Button>
        </nav>

        {/* Menu em tela cheia no celular. */}
        <Dialog.Root open={aberto} onOpenChange={setAberto}>
          <Dialog.Trigger
            aria-label="Abrir menu"
            className="flex size-12 items-center justify-center rounded-full text-verde-profundo hover:bg-verde-claro lg:hidden"
          >
            <Menu className="size-7" aria-hidden="true" />
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Content
              aria-describedby={undefined}
              className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-salmao text-verde-profundo lg:hidden"
            >
              <div className="conteiner flex h-20 shrink-0 items-center justify-between">
                <Dialog.Title className="eyebrow">Menu</Dialog.Title>
                <Dialog.Close
                  aria-label="Fechar menu"
                  className="flex size-12 items-center justify-center rounded-full hover:bg-salmao-suave"
                >
                  <X className="size-7" aria-hidden="true" />
                </Dialog.Close>
              </div>
              <nav aria-label="Principal" className="conteiner flex flex-1 flex-col justify-center gap-1 pb-10">
                {nav.map((l) => (
                  <a
                    key={l.id}
                    href={`#${l.id}`}
                    onClick={() => setAberto(false)}
                    className="display border-b border-verde-profundo/25 py-4 text-[2.25rem]"
                  >
                    {l.label}
                  </a>
                ))}
                <Button href={wa(mensagens.conhecer)} externo className="mt-8 self-start">
                  {navCta}
                </Button>
              </nav>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </header>
  );
}
