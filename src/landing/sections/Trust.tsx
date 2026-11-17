import { Eyebrow } from '../components/Eyebrow';
import { Reveal } from '../components/Reveal';
import { SectionTitle } from '../components/SectionTitle';
import { confianca } from '../content/copy';

/**
 * Confiança e privacidade: lista editorial numerada, sem grade de ícones.
 * Declarações proibidas nesta página (ver o prompt, seção 8.8): "ponta a
 * ponta", "100% LGPD", "padrão de bancos", região de servidores, "IA",
 * integrações e certificações. Não acrescente nenhuma sem comprovação.
 */
export function Trust() {
  const { naoFaz } = confianca;
  return (
    <section id="seguranca" className="sobre-escuro secao bg-verde text-creme" aria-labelledby="seguranca-titulo">
      <div className="conteiner grid gap-x-10 gap-y-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Reveal className="lg:sticky lg:top-[calc(var(--cabecalho)+48px)]">
            <Eyebrow>{confianca.eyebrow}</Eyebrow>
            <SectionTitle id="seguranca-titulo" className="mt-4 max-w-[12ch]">
              {confianca.titulo}
            </SectionTitle>
            <p className="mt-6 max-w-[26rem] text-creme/90">{confianca.subtitulo}</p>
          </Reveal>
        </div>

        <ol className="lg:col-span-6 lg:col-start-7">
          {confianca.itens.map(([titulo, texto], i) => (
            <Reveal as="li" key={titulo} atraso={i * 50} className="flex gap-6 border-t border-creme/30 py-6">
              <span aria-hidden="true" className="w-7 shrink-0 pt-1 text-[16px] font-bold tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="display text-[1.5rem] leading-tight">{titulo}</h3>
                <p className="mt-1.5 text-creme/90">{texto}</p>
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal className="rounded-[28px] bg-salmao p-8 text-verde-profundo lg:col-span-10 lg:col-start-2 lg:mt-10 lg:-mb-48 lg:grid lg:grid-cols-10 lg:gap-x-10 lg:p-14">
          <h3 className="eyebrow lg:col-span-10">{naoFaz.titulo}</h3>
          <p className="display t-medio mt-5 lg:col-span-6">
            {naoFaz.frases.map((f) => (
              <span key={f} className="block">
                {f}
              </span>
            ))}
          </p>
          <p className="mt-5 lg:col-span-4 lg:self-end">{naoFaz.texto}</p>
        </Reveal>
      </div>
    </section>
  );
}
