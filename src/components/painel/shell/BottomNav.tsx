import { Menu } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/app/components/ui/sheet';
import { cn } from '@/app/components/ui/utils';
import { clinic } from '@/mock/clinic';
import { can, useClinic } from '@/state/ClinicContext';
import { isActive, navItems } from './nav';
import { UserCard } from './UserCard';

/** Navegação inferior (celular e tablet): Triagens, Convites, Questionário e "Mais". */
export function BottomNav() {
  const { user } = useClinic();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  if (!user) return null;
  const allowed = navItems.filter((i) => can(user.papel, i.area));
  const main = allowed.filter((i) => i.area !== 'acessos');
  const extra = allowed.filter((i) => i.area === 'acessos');
  const item = 'flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[12px] font-medium';

  return (
    <nav
      aria-label="Navegação do painel"
      className="nao-imprimir fixed inset-x-0 bottom-0 z-30 flex border-t border-borda bg-creme/95 pb-[env(safe-area-inset-bottom)] pl-16 backdrop-blur-sm lg:hidden"
    >
      {main.map((i) => {
        const active = isActive(i, pathname);
        return (
          <Link
            key={i.to}
            to={i.to}
            aria-current={active ? 'page' : undefined}
            className={cn(item, active ? 'font-semibold text-verde-profundo' : 'text-texto-2')}
          >
            <span className={cn('flex h-7 w-12 items-center justify-center rounded-full', active && 'bg-verde text-creme')}>
              <i.icon className="size-5" aria-hidden="true" />
            </span>
            {i.curto}
          </Link>
        );
      })}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger className={cn(item, 'text-texto-2')}>
          <span className="flex h-7 w-12 items-center justify-center">
            <Menu className="size-5" aria-hidden="true" />
          </span>
          Mais
        </SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-[20px] border-borda bg-creme pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
          <SheetHeader className="pb-0">
            <SheetTitle className="font-titulo text-2xl text-verde-profundo">Mais</SheetTitle>
            <SheetDescription className="text-[15px] text-texto-2">{clinic.nome}</SheetDescription>
          </SheetHeader>
          <div className="space-y-3 px-4">
            {extra.map((i) => (
              <Link
                key={i.to}
                to={i.to}
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center gap-3 rounded-xl border border-borda bg-superficie px-4 text-[15px] font-medium text-verde-profundo"
              >
                <i.icon className="size-5" aria-hidden="true" />
                {i.label}
              </Link>
            ))}
            <UserCard />
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
}
