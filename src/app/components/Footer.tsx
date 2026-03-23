import { Instagram, Mail, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Brand Column */}
          <div className="space-y-4">
            <a href="/" className="flex items-center gap-3 group w-fit">
              {/* Logo estrela */}
              <img
                src="/LOGO.png"
                alt="Vitalian Logo"
                className="h-10 w-auto object-contain transition-opacity group-hover:opacity-80"
              />

              {/* Nome Logo */}
              <img
                src="/LOGO_NOME_DARK.png"
                alt="Vitalian"
                className="h-8 w-auto object-contain transition-opacity group-hover:opacity-80"
              />
            </a>

            <p className="text-sm text-gray-400 leading-relaxed">
              Essencialmente humano.
            </p>

            {/* Redes Sociais */}
            <div className="flex items-center gap-4 pt-2">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/vitalian.tech"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#5a6d4f] transition-colors"
                title="Siga-nos no Instagram"
              >
                <span className="sr-only">Instagram</span>
                <Instagram className="w-5 h-5 text-white" />
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/5564981157082"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#25D366] transition-colors"
                title="Fale conosco no WhatsApp"
              >
                <span className="sr-only">WhatsApp</span>
                <MessageCircle className="w-5 h-5 text-white" />
              </a>

              {/* Email */}
              <a
                href="mailto:vitaliantech@gmail.com"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#5a6d4f] transition-colors"
                title="Envie um e-mail"
              >
                <span className="sr-only">E-mail</span>
                <Mail className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Links Column */}
          <div>
            <h4 className="text-white mb-4 font-medium">Produto</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Como Funciona
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Preços
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Segurança
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="text-white mb-4 font-medium">Legal</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Termos de Uso
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Conformidade LGPD
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Cookies
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="text-white mb-4 font-medium">Newsletter</h4>
            <p className="text-sm text-gray-400 mb-4">
              Receba insights sobre gestão de clínicas.
            </p>
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="seu@email.com"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:ring-[#5a6d4f]"
              />
              <Button className="w-full bg-[#5a6d4f] hover:bg-[#4a5d3f] text-white">
                Assinar
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © 2026 Vitalian. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span className="hidden md:inline">•</span>
              <span>Feito com cuidado no Brasil</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}