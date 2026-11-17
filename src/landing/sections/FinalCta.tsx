import { useState } from 'react';
import { Reveal } from '../components/Reveal';
import { ctaFinal, mensagemDoFormulario, wa } from '../content/copy';
import { Botanical } from '../illustrations/Botanical';

const campo =
  'mt-2 h-14 w-full rounded-2xl border-[1.5px] border-verde-profundo bg-superficie px-4 text-[1rem] text-verde-profundo';

/**
 * CTA final. O formulário NÃO envia nada: só monta o texto e abre o WhatsApp.
 * Nenhum dado passa por servidor nosso nem fica guardado no navegador.
 */
export function FinalCta() {
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState<string>(ctaFinal.tipos[0]);

  return (
    <section id="conversar" className="overflow-x-clip bg-salmao text-verde-profundo" aria-labelledby="cta-titulo">
      <div className="conteiner relative grid gap-x-10 gap-y-10 py-[72px] lg:grid-cols-12 lg:py-32">
        <Botanical
          variante="buque"
          cores={['var(--verde)', 'var(--salmao-suave)', 'var(--salmao-profundo)']}
          className="pointer-events-none absolute -top-12 right-2 w-[38%] max-w-[300px] lg:-top-36 lg:right-auto lg:left-[27%] lg:w-[19%]"
        />
        <Reveal className="relative pt-16 lg:col-span-6 lg:pt-0">
          <h2 id="cta-titulo" className="display t-secao max-w-[13ch]">
            {ctaFinal.titulo}
          </h2>
          <p className="mt-6 max-w-[26rem] text-[1.125rem]">{ctaFinal.subtitulo}</p>
        </Reveal>

        <Reveal atraso={100} className="relative lg:col-span-5 lg:col-start-8">
          <form
            className="rounded-[28px] bg-creme p-7 lg:p-9"
            onSubmit={(e) => {
              e.preventDefault();
              window.open(wa(mensagemDoFormulario(nome, tipo)), '_blank', 'noopener,noreferrer');
            }}
          >
            <label htmlFor="cta-nome" className="block text-[16px] font-bold">
              {ctaFinal.nome}
            </label>
            <input
              id="cta-nome"
              type="text"
              autoComplete="given-name"
              maxLength={60}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className={campo}
            />
            <label htmlFor="cta-tipo" className="mt-5 block text-[16px] font-bold">
              {ctaFinal.tipo}
            </label>
            <select id="cta-tipo" value={tipo} onChange={(e) => setTipo(e.target.value)} className={campo}>
              {ctaFinal.tipos.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <button type="submit" className="botao botao-primario mt-7 w-full">
              {ctaFinal.botao}
            </button>
            <p className="mt-4 text-[14px] leading-snug text-texto-2">{ctaFinal.nota}</p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
