import { Link, useLocation } from 'react-router';
import { cn } from '@/app/components/ui/utils';
import { clinic } from '@/mock/clinic';
import { can, useClinic } from '@/state/ClinicContext';
import { logoSrc } from '@/components/shell/Header';
import { isActive, navItems } from './nav';
import { UserCard } from './UserCard';

/** Barra lateral fixa de 248px (desktop). Cada papel só vê os itens que pode abrir. */
export function Sidebar() {
  const { user } = useClinic();
  const { pathname } = useLocation();
  if (!user) return null;
  return (
    <aside className="nao-imprimir fixed top-8 bottom-0 left-0 z-30 hidden w-[248px] flex-col border-r border-borda bg-creme lg:flex">
      <div className="flex h-16 items-center gap-2 px-5">
        <img src={logoSrc} alt="" className="h-8 w-auto" />
        <div className="min-w-0">
          <p className="text-base leading-tight font-semibold text-verde-profundo">Vitalian</p>
          <p className="truncate text-[13px] leading-tight text-texto-2">{clinic.nome}</p>
        </div>
      </div>
      <nav aria-label="Navegação do painel" className="flex-1 px-3 pt-2">
        <ul className="space-y-1">
          {navItems
            .filter((i) => can(user.papel, i.area))
            .map((i) => {
              const active = isActive(i, pathname);
              return (
                <li key={i.to}>
                  <Link
                    to={i.to}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'flex min-h-11 items-center gap-3 rounded-xl px-3 text-[15px] font-medium text-verde-profundo',
                      active ? 'bg-verde text-creme' : 'hover:bg-verde-claro',
                    )}
                  >
                    <i.icon className="size-5 shrink-0" aria-hidden="true" />
                    {i.label}
                  </Link>
                </li>
              );
            })}
        </ul>
      </nav>
      {/* Espaço extra embaixo: o botão do painel de demonstração fica no canto. */}
      <div className="px-3 pb-[72px]">
        <UserCard />
      </div>
    </aside>
  );
}
