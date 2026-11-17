import { SectionTitle } from '../components/SectionTitle';
import { sobre } from '../content/copy';

/**
 * "Quem está por trás". Só usa conteúdo verdadeiro, fornecido pela fundadora.
 * Enquanto `sobre.pessoas` estiver vazio, a seção NÃO é publicada: em
 * produção ela some; em desenvolvimento aparece só o lembrete abaixo.
 */
export function About() {
  if (sobre.pessoas.length === 0) {
    if (!import.meta.env.DEV) return null;
    return (
      <section className="conteiner py-10">
        <p className="rounded-[28px] border-2 border-dashed border-verde p-8 text-center font-bold">
          [FOTO E TEXTO DA FUNDADORA] · visível só em desenvolvimento
        </p>
      </section>
    );
  }
  return (
    <section className="secao bg-superficie" aria-labelledby="sobre-titulo">
      <div className="conteiner">
        <SectionTitle id="sobre-titulo">{sobre.titulo}</SectionTitle>
        <ul className="mt-12 grid gap-10 lg:grid-cols-2">
          {sobre.pessoas.map((p) => (
            <li key={p.nome} className="flex items-start gap-6">
              <img src={p.foto} alt={`Foto de ${p.nome}`} width={160} height={160} loading="lazy" className="size-28 rounded-full object-cover lg:size-40" />
              <div>
                <h3 className="display t-medio">{p.nome}</h3>
                <p className="mt-1 font-bold text-texto-2">{p.papel}</p>
                <p className="mt-3 max-w-[28rem] text-texto-2">{p.texto}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
