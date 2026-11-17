import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router';
import { roleLabel } from '@/mock/clinic';
import { useClinic } from '@/state/ClinicContext';

/** Cartão do usuário: nome, chip do papel e Sair. */
export function UserCard() {
  const { user, logout } = useClinic();
  const navigate = useNavigate();
  if (!user) return null;
  return (
    <div className="rounded-2xl border border-borda bg-superficie p-3">
      <p className="truncate text-[15px] font-semibold text-verde-profundo">{user.nome}</p>
      <div className="mt-1.5 flex items-center justify-between gap-2">
        <span className="rounded-full bg-verde-claro px-2.5 py-0.5 text-[13px] font-medium text-verde-profundo">
          {roleLabel[user.papel]}
        </span>
        <button
          type="button"
          className="flex min-h-11 items-center gap-1.5 rounded-xl px-2 text-[15px] font-semibold text-verde-profundo hover:bg-verde-claro"
          onClick={() => {
            logout();
            navigate('/painel/login');
          }}
        >
          <LogOut className="size-[18px]" aria-hidden="true" />
          Sair
        </button>
      </div>
    </div>
  );
}
