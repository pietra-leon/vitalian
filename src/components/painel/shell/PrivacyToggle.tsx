import { Eye, EyeOff } from 'lucide-react';
import { Interruptor } from '@/components/form/Interruptor';
import { useClinic } from '@/state/ClinicContext';

/** "Ocultar nomes": útil ao compartilhar a tela. */
export function PrivacyToggle({ compacto }: { compacto?: boolean }) {
  const { hideNames, setHideNames } = useClinic();
  const Icon = hideNames ? EyeOff : Eye;
  return (
    <label className="flex min-h-11 cursor-pointer items-center gap-2 text-[15px] font-medium whitespace-nowrap text-verde-profundo">
      <Icon className="size-5 shrink-0" aria-hidden="true" />
      <span className={compacto ? 'sr-only' : undefined}>Ocultar nomes</span>
      <Interruptor checked={hideNames} onCheckedChange={setHideNames} className="h-7 w-12 [&_[data-slot=switch-thumb]]:size-5 [&_[data-slot=switch-thumb]]:data-[state=checked]:translate-x-[22px]" />
    </label>
  );
}
