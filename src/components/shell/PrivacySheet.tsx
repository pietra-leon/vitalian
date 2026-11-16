import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/app/components/ui/sheet';

const topicos = [
  ['O que coletamos', 'Seus dados de identificação e as respostas que você escolher dar no questionário.'],
  ['Para que serve', 'Somente para preparar a sua consulta. Nada é usado para publicidade.'],
  ['Quem pode ver', 'A equipe de saúde da clínica que vai atender você. Mais ninguém.'],
  ['Seus direitos', 'Você pode pedir para ver, corrigir ou apagar seus dados falando com a clínica.'],
  [
    'Menores de 18 anos',
    'O preenchimento é feito junto com o responsável. Para denunciar violações de direitos de crianças e adolescentes, existe o Disque 100.',
  ],
] as const;

/** Resumo de privacidade em 5 tópicos (texto de demonstração). */
export function PrivacySheet() {
  return (
    <Sheet>
      <SheetTrigger className="inline-flex min-h-12 items-center rounded-full px-2 font-semibold text-verde-profundo underline underline-offset-4">
        Privacidade
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="mx-auto max-h-[85dvh] max-w-[520px] overflow-y-auto rounded-t-[20px] border-borda bg-superficie pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
      >
        <SheetHeader className="px-5 pt-6 pr-12 pb-0">
          <SheetTitle className="font-titulo text-2xl text-verde-profundo">Sua privacidade, em resumo</SheetTitle>
          <SheetDescription className="w-fit rounded-full border-[1.5px] border-dashed border-verde px-3 py-1 text-[13px] text-verde-profundo">
            Texto de demonstração
          </SheetDescription>
        </SheetHeader>
        <ol className="space-y-4 px-5">
          {topicos.map(([titulo, texto], i) => (
            <li key={titulo} className="flex gap-3">
              <span
                aria-hidden="true"
                className="flex size-7 shrink-0 items-center justify-center rounded-full bg-verde-claro text-sm font-semibold text-verde-profundo"
              >
                {i + 1}
              </span>
              <div>
                <p className="font-semibold text-verde-profundo">{titulo}</p>
                <p className="text-[15px] text-texto-2">{texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </SheetContent>
    </Sheet>
  );
}
