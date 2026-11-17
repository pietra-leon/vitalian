import { Link } from 'react-router';
import { contato, mensagens, rodape, wa } from '../content/copy';

const base = import.meta.env.BASE_URL;
const elo = 'elo elo-nav font-medium';

export function Footer() {
  return (
    <footer className="sobre-escuro bg-verde-profundo text-creme">
      <div className="conteiner grid gap-x-10 gap-y-10 py-16 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-6">
          <img
            src={`${base}LOGO_NOME_DARK.png`}
            alt="Vitalian"
            width={416}
            height={94}
            loading="lazy"
            className="h-10 w-auto"
          />
          <p className="mt-5 max-w-[22rem]">{rodape.frase}</p>
        </div>
        <nav aria-label="Contato" className="flex flex-col items-start lg:col-span-3">
          <a href={contato.instagram} target="_blank" rel="noopener noreferrer" className={elo}>
            Instagram
          </a>
          <a href={wa(mensagens.conhecer)} target="_blank" rel="noopener noreferrer" className={elo}>
            WhatsApp
          </a>
          <a href={`mailto:${contato.email}`} className={`${elo} break-all`}>
            {contato.email}
          </a>
        </nav>
        <nav aria-label="Páginas legais" className="flex flex-col items-start lg:col-span-3">
          <Link to="/privacidade" className={elo}>
            Privacidade
          </Link>
          <Link to="/termos" className={elo}>
            Termos
          </Link>
        </nav>
        {/* [CNPJ, quando houver] */}
        <p className="border-t border-creme/25 pt-6 text-[16px] lg:col-span-12">{rodape.direitos}</p>
      </div>
    </footer>
  );
}
