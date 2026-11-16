import type { ComponentProps } from 'react';
import { Switch } from '@/app/components/ui/switch';
import { cn } from '@/app/components/ui/utils';

/** Switch do shadcn/ui em tamanho de toque, com trilho visível nos dois estados. */
export function Interruptor({ className, ...props }: ComponentProps<typeof Switch>) {
  return (
    <Switch
      className={cn(
        'h-8 w-14 border-2 border-transparent data-[state=checked]:bg-verde data-[state=unchecked]:bg-texto-2',
        '[&_[data-slot=switch-thumb]]:size-6 [&_[data-slot=switch-thumb]]:bg-superficie',
        '[&_[data-slot=switch-thumb]]:data-[state=checked]:translate-x-[26px] [&_[data-slot=switch-thumb]]:data-[state=unchecked]:translate-x-0.5',
        className,
      )}
      {...props}
    />
  );
}
