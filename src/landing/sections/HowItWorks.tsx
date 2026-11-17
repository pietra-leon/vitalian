import { useEffect, useRef, useState } from 'react';
import { LaptopFrame, PhoneFrame } from '../components/DeviceFrame';
import { Eyebrow } from '../components/Eyebrow';
import { Reveal } from '../components/Reveal';
import { SectionTitle } from '../components/SectionTitle';
import { capturas } from '../content/capturas';
import { comoFunciona } from '../content/copy';
import { OrganicShape } from '../illustrations/Shapes';

const telas = [
  <LaptopFrame key="convite" captura={capturas.convite} sizes="(min-width: 1024px) 560px, 88vw" />,
  <PhoneFrame key="pergunta" captura={capturas.sintomas} className="mx-auto w-[46%] max-w-[250px] lg:w-[44%]" />,
  <LaptopFrame key="relatorio" captura={capturas.relatorioTela} sizes="(min-width: 1024px) 560px, 88vw" />,
];
// Cada passo tem um recuo próprio, para o texto não formar uma coluna reta.
const recuos = ['', 'lg:pl-14', 'lg:pl-28'];

/**
 * Três passos com dispositivo fixo: no desktop a tela troca conforme o passo
 * entra em cena; no celular vira uma sequência simples, uma imagem por passo.
 */
export function HowItWorks() {
  const [ativo, setAtivo] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setAtivo(Number((e.target as HTMLElement).dataset.passo));
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="como-funciona" className="secao bg-superficie" aria-labelledby="como-titulo">
      <div className="conteiner">
        <Reveal className="lg:ml-[8.33%]">
          <Eyebrow className="text-texto-2">{comoFunciona.eyebrow}</Eyebrow>
          <SectionTitle id="como-titulo" className="mt-4 max-w-[16ch]">
            {comoFunciona.titulo}
          </SectionTitle>
        </Reveal>

        <div className="mt-12 grid gap-x-10 lg:mt-4 lg:grid-cols-12">
          <ol className="lg:col-span-6">
            {comoFunciona.passos.map((p, i) => (
              <li
                key={p.titulo}
                data-passo={i}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                className={`flex flex-col justify-center border-t border-borda py-12 first:border-t-0 lg:min-h-[62vh] lg:border-t-0 lg:py-0 ${recuos[i]}`}
              >
                <div className="flex items-start gap-5">
                  {/* Salmão só como numeral decorativo grande; o texto vai em verde ao lado. */}
                  <span aria-hidden="true" className="numeral -mt-2 text-[96px] text-salmao">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="display t-medio max-w-[14ch]">
                      <span className="sr-only">Passo {i + 1}: </span>
                      {p.titulo}
                    </h3>
                    <p className="mt-4 max-w-[30rem] text-texto-2">{p.texto}</p>
                  </div>
                </div>
                <div className="relative mt-10 lg:hidden">{telas[i]}</div>
              </li>
            ))}
          </ol>

          <div className="hidden lg:col-span-6 lg:block">
            <div className="sticky top-[calc(var(--cabecalho)+12vh)] flex h-[62vh] items-center">
              <div className="relative aspect-[10/8] w-full">
                <OrganicShape n={3} cor="var(--verde-claro)" className="absolute -inset-[6%] h-[112%] w-[112%]" />
                {telas.map((tela, i) => (
                  <div
                    key={i}
                    aria-hidden={ativo !== i}
                    className="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
                    style={{ opacity: ativo === i ? 1 : 0, transitionTimingFunction: 'var(--curva)' }}
                  >
                    <div className="w-full">{tela}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
