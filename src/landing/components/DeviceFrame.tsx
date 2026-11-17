// Molduras de dispositivo construídas em CSS, para mostrar as capturas reais
// dos mockups como "packshots". Cada captura tem versão 1x e 2x (WebP).
import type { CSSProperties } from 'react';

export interface Captura {
  /** Nome do arquivo em public/img, sem extensão. */
  src: string;
  alt: string;
  w: number;
  h: number;
}

const base = import.meta.env.BASE_URL;

interface ImgProps {
  captura: Captura;
  /** Imagem do hero: carrega com prioridade. As demais são lazy. */
  prioridade?: boolean;
  sizes: string;
  className?: string;
  style?: CSSProperties;
}

export function Shot({ captura, prioridade, sizes, className, style }: ImgProps) {
  return (
    <img
      src={`${base}img/${captura.src}.webp`}
      srcSet={`${base}img/${captura.src}.webp ${captura.w}w, ${base}img/${captura.src}@2x.webp ${captura.w * 2}w`}
      sizes={sizes}
      width={captura.w}
      height={captura.h}
      alt={captura.alt}
      loading={prioridade ? 'eager' : 'lazy'}
      decoding="async"
      {...(prioridade ? { fetchPriority: 'high' as const } : {})}
      className={className}
      style={style}
    />
  );
}

/** Celular: moldura verde-profundo, cantos bem arredondados. */
export function PhoneFrame({
  captura,
  prioridade,
  sizes = '(min-width: 1024px) 280px, 60vw',
  className = '',
}: Omit<ImgProps, 'style' | 'sizes'> & { sizes?: string }) {
  return (
    <div className={`contato ${className}`}>
      <div className="rounded-[12.5%/5.8%] bg-verde-profundo p-[3.2%]">
        <div className="relative overflow-hidden rounded-[10%/4.6%] bg-creme" style={{ aspectRatio: '390 / 844' }}>
          <Shot
            captura={captura}
            prioridade={prioridade}
            sizes={sizes}
            className="absolute inset-0 size-full object-cover object-top"
          />
        </div>
      </div>
    </div>
  );
}

/** Notebook: tela com moldura e uma base fina. */
export function LaptopFrame({
  captura,
  prioridade,
  sizes = '(min-width: 1024px) 640px, 92vw',
  className = '',
}: Omit<ImgProps, 'style' | 'sizes'> & { sizes?: string }) {
  return (
    <div className={`contato ${className}`}>
      <div className="mx-[5%] rounded-t-[2.6%/4%] bg-verde-profundo p-[1.6%] pb-[1.9%]">
        <div className="relative overflow-hidden rounded-[1%/1.6%] bg-creme" style={{ aspectRatio: '1280 / 800' }}>
          <Shot
            captura={captura}
            prioridade={prioridade}
            sizes={sizes}
            className="absolute inset-0 size-full object-cover object-top"
          />
        </div>
      </div>
      <div className="relative h-[2.4%] min-h-2.5 rounded-b-[14px] rounded-t-[3px] bg-[#4f5730]">
        <span className="absolute top-0 left-1/2 h-[45%] w-[14%] -translate-x-1/2 rounded-b-md bg-verde-profundo" />
      </div>
    </div>
  );
}

/** Folha A4: o relatório impresso, como papel. */
export function PaperFrame({
  captura,
  sizes = '(min-width: 1024px) 420px, 80vw',
  className = '',
}: Omit<ImgProps, 'style' | 'sizes' | 'prioridade'> & { sizes?: string }) {
  return (
    <div className={`contato ${className}`}>
      <div className="rounded-[3px] bg-white p-[6%]">
        <Shot captura={captura} sizes={sizes} className="block h-auto w-full" />
      </div>
    </div>
  );
}
