import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl text-gray-900 leading-tight">
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
                className="bg-[#5a6d4f] hover:bg-[#4a5d3f] text-white px-8 py-6 text-lg"
              >
                Otimizar meu atendimento
              </Button>
            </a>

            {/* Trust Indicators */}
            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600"> </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600"> </span>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1731514836024-614e2bab04c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwY29uc3VsdGF0aW9uJTIwY2FsbSUyMHdvbWFufGVufDF8fHx8MTc3NDIxMzc2N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Consulta médica acolhedora"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#5a6d4f]/10 rounded-full -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}