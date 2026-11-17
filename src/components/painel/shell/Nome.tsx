import { useClinic } from '@/state/ClinicContext';

/** Nome de paciente. Com "Ocultar nomes" ligado, fica desfocado na tela e some do leitor de tela. */
export function Nome({ children }: { children: string }) {
  const { hideNames } = useClinic();
  if (!hideNames) return <>{children}</>;
  return (
    <>
      <span className="nome-oculto" aria-hidden="true">
        {children}
      </span>
      <span className="sr-only">Nome oculto</span>
    </>
  );
}
