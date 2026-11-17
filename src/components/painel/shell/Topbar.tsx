import { Bell, NotebookPen, Search } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { logoSrc } from '@/components/shell/Header';
import { can, useClinic } from '@/state/ClinicContext';
import { pageTitle } from './nav';
import { PrivacyToggle } from './PrivacyToggle';

/** Barra superior: título da página, busca, "Ocultar nomes", sino e anotações. */
export function Topbar() {
  const { user, search, setSearch, triages, notes, setNotesOpen } = useClinic();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const h1 = useRef<HTMLHeadingElement>(null);
  const title = pageTitle(pathname);

  // Ao navegar, o foco vai para o título (leitor de tela anuncia a nova página).
  useEffect(() => {
    window.scrollTo(0, 0);
    h1.current?.focus({ preventScroll: true });
    document.title = `${title} · Painel Vitalian (demonstração)`;
  }, [pathname, title]);

  if (!user) return null;
  const clinico = can(user.papel, 'triagens');
  const novas = triages.filter((t) => !t.aberta).length;

  return (
    <header className="nao-imprimir sticky top-8 z-20 border-b border-borda bg-creme/95 backdrop-blur-sm">
      <div className="flex min-h-16 flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2 lg:px-8">
        <img src={logoSrc} alt="" className="h-8 w-auto lg:hidden" />
        <h1
          ref={h1}
          tabIndex={-1}
          data-titulo-tela
          className="font-titulo min-w-0 flex-1 basis-[calc(100%-3.5rem)] truncate text-2xl text-verde-profundo md:basis-0 lg:text-[28px]"
        >
          {title}
        </h1>

        {clinico ? (
          <label className="relative hidden w-64 xl:block">
            <span className="sr-only">Buscar paciente</span>
            <Search className="pointer-events-none absolute top-1/2 left-3 size-[18px] -translate-y-1/2 text-texto-2" aria-hidden="true" />
            <input
              type="search"
              value={search}
              placeholder="Buscar paciente"
              className="h-11 w-full rounded-xl border-[1.5px] border-texto-2/70 bg-superficie pr-3 pl-10 text-[15px] text-verde-profundo placeholder:text-texto-2"
              onChange={(e) => {
                setSearch(e.target.value);
                if (pathname !== '/painel') navigate('/painel');
              }}
            />
          </label>
        ) : null}

        <div className="hidden md:block">
          <PrivacyToggle />
        </div>
        <div className="md:hidden">
          <PrivacyToggle compacto />
        </div>

        {clinico ? (
          <button
            type="button"
            aria-label={`Notificações: ${novas} ${novas === 1 ? 'triagem nova' : 'triagens novas'}`}
            className="relative flex size-11 items-center justify-center rounded-xl text-verde-profundo hover:bg-verde-claro"
            onClick={() => navigate('/painel')}
          >
            <Bell className="size-5" aria-hidden="true" />
            {novas > 0 ? (
              <span className="absolute top-1 right-0.5 min-w-5 rounded-full bg-verde px-1 text-center text-[12px] leading-5 font-semibold text-creme tabular-nums">
                {novas}
              </span>
            ) : null}
          </button>
        ) : null}

        <button
          type="button"
          className="flex min-h-11 items-center gap-2 rounded-full border-[1.5px] border-dashed border-verde px-3 text-[15px] font-medium text-verde-profundo hover:bg-verde-claro"
          onClick={() => setNotesOpen(true)}
        >
          <NotebookPen className="size-[18px]" aria-hidden="true" />
          <span className="hidden sm:inline">Anotações da validação</span>
          <span className="sm:hidden">Anotações</span>
          <span className="tabular-nums">({notes.length})</span>
        </button>
      </div>
    </header>
  );
}
