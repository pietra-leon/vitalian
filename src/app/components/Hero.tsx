import { Button } from './ui/button';
import { Sparkles, Stethoscope } from 'lucide-react'; // Importando ícones sugeridos

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-[#FEFAE0]">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Text Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl text-gray-900 leading-[1.1] font-calistoga">
                Acolhimento digital que prepara o encontro real.
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Reduza a ansiedade de suas pacientes e otimize o seu tempo clínico com uma triagem digital humanizada e segura.
              </p>
            </div>

            {/* Link do WhatsApp no Hero */}
            <a
              href="https://wa.me/5564981157082?text=Olá!%20Vi%20o%20site%20da%20Vitalian%20e%20tenho%20interesse%20em%20otimizar%20meu%20atendimento.%20Como%20funciona?"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Button
                size="lg"
                className="bg-[#f05a61] hover:bg-[#d94f55] text-white px-8 py-6 text-lg rounded-full shadow-md transition-all hover:scale-105"
              >
                Otimizar meu atendimento
              </Button>
            </a>

            {/* Trust Indicators */}
            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 italic"> </span>
              </div>
            </div>
          </div>

          {/* Illustration Area (No lugar da imagem) */}
          <div className="relative flex items-center justify-center">
            {/* Círculo decorativo de fundo */}
            <div className="absolute w-[80%] h-[80%] bg-[#5a6d4f]/5 rounded-full animate-pulse"></div>

            {/* Card flutuante com ícone */}
            <div className="relative aspect-square w-full max-w-[400px] bg-white/40 backdrop-blur-md rounded-3xl border border-white/20 shadow-xl flex items-center justify-center group transition-all duration-500 hover:rotate-2">
              <div className="absolute top-8 right-8 text-[#f05a61]/20">
                <Sparkles className="w-12 h-12" />
              </div>

              <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-24 bg-[#5a6d4f] rounded-2xl flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110">
                  <Stethoscope className="w-12 h-12 text-white" />
                </div>
                <div className="text-center">
                  <span className="text-[#5a6d4f] font-calistoga text-2xl">Vitalian</span>
                  <div className="flex gap-1 justify-center mt-2">
                    <div className="w-8 h-1 bg-[#f05a61] rounded-full"></div>
                    <div className="w-4 h-1 bg-[#f05a61]/40 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Elemento flutuante extra para profundidade */}
              <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex items-center gap-3 animate-bounce">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs font-medium text-gray-600">Triagem Ativa</span>
              </div>
            </div>

            {/* Decorative circles */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#f0a793]/20 rounded-full -z-10"></div>
          </div>

        </div>
      </div>
    </section>
  );
}