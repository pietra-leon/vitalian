import { X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/app/components/ui/alert-dialog';
import { invite } from '@/mock/invite';
import { useJourney } from '@/state/JourneyContext';

export const logoSrc = `${import.meta.env.BASE_URL}LOGO.png`;

export function Header() {
  const { endSession } = useJourney();
  const navigate = useNavigate();
  const naCentral = useLocation().pathname === '/';

  return (
    <header className="h-16 border-b border-borda bg-creme/95 backdrop-blur-sm">
      <div className="mx-auto flex h-full max-w-[520px] items-center justify-between gap-2 px-4">
        <Link to="/" aria-label="Vitalian: central de demonstração" className="flex shrink-0 items-center rounded-full p-1">
          <img src={logoSrc} alt="" className="h-9 w-auto" />
        </Link>
        {naCentral ? (
          <span className="text-[15px] font-semibold text-verde-profundo">Vitalian</span>
        ) : (
          <div className="flex min-w-0 items-center gap-1">
            <span className="truncate rounded-full bg-verde-claro px-3 py-1.5 text-[13px] font-medium text-verde-profundo">
              {invite.clinica}
            </span>
            <AlertDialog>
              <AlertDialogTrigger className="flex min-h-12 shrink-0 items-center gap-1 rounded-full px-3 text-[15px] font-semibold text-verde-profundo hover:bg-verde-claro">
                <X className="size-5" aria-hidden="true" />
                Sair
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-[20px] border-borda bg-superficie">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-titulo text-2xl text-verde-profundo">
                    Sair do questionário?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-base text-texto-2">
                    Suas respostas desta sessão não serão guardadas. Você poderá recomeçar pelo mesmo link
                    enquanto ele estiver válido.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-3">
                  <AlertDialogAction
                    className="min-h-12 rounded-full bg-salmao px-6 text-base font-semibold text-verde-profundo hover:bg-salmao/85 sm:order-1"
                    onClick={() => {
                      endSession();
                      navigate('/');
                    }}
                  >
                    Sair
                  </AlertDialogAction>
                  <AlertDialogCancel className="mt-0 min-h-12 rounded-full border-0 bg-verde px-6 text-base font-semibold text-creme hover:bg-verde-profundo hover:text-creme sm:order-2">
                    Continuar respondendo
                  </AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </header>
  );
}
