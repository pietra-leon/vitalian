import { Phone } from 'lucide-react';

const contatos = [
  { numero: '180', nome: 'Ligue 180', texto: 'Central de Atendimento à Mulher. 24h, gratuito.' },
  { numero: '188', nome: 'CVV 188', texto: 'Apoio emocional. 24h, gratuito.' },
  { numero: '190', nome: '190', texto: 'Emergência policial.' },
  { numero: '192', nome: '192', texto: 'SAMU, emergência de saúde.' },
];

/** Bloco de apoio: aparece quando há violência atual ou pensamentos de se machucar. */
export function SupportCards() {
  return (
    <section aria-labelledby="apoio-titulo" className="rounded-[20px] border border-borda bg-superficie p-5 sombra-suave">
      <h2 id="apoio-titulo" className="font-titulo text-2xl leading-tight text-verde-profundo">
        Você não está sozinha.
      </h2>
      <p className="mt-2 text-base leading-relaxed text-texto-2">
        Obrigada por confiar isso a nós. Existem pessoas prontas para ouvir você agora, de graça e sem
        julgamento.
      </p>
      <ul className="mt-4 space-y-3">
        {contatos.map((c) => (
          <li key={c.numero} className="flex items-center gap-3 rounded-[14px] border border-borda bg-creme/60 p-3">
            <div className="min-w-0 flex-1">
              <p className="text-[17px] font-semibold text-verde-profundo">{c.nome}</p>
              <p className="text-[15px] text-texto-2">{c.texto}</p>
            </div>
            <a
              href={`tel:${c.numero}`}
              aria-label={`Ligar para ${c.numero}`}
              className="flex min-h-12 shrink-0 items-center gap-2 rounded-full bg-verde px-4 text-[15px] font-semibold text-creme hover:bg-verde-profundo"
            >
              <Phone className="size-[18px]" aria-hidden="true" />
              Ligar
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-base font-semibold text-verde-profundo">
        Se você estiver em perigo agora, ligue 190.
      </p>
    </section>
  );
}
