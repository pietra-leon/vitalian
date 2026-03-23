import { Button } from './ui/button';
import {
  Sparkles,
  MessageSquareText,
  HeartHandshake,
  ClipboardCheck,
  ShieldCheck,
  MessageCircle
} from 'lucide-react';

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

            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 italic font-medium"> </span>
              </div>
            </div>
          </div>

          {/* Nova Ilustração: Jornada de Acolhimento */}
          <div className="relative flex items-center justify-center p-4">
            {/* Círculo decorativo de fundo com gradiente suave */}
            <div className="absolute w-[85%] h-[85%] bg-gradient-to-tr from-[#5a6d4f]/10 to-[#f05a61]/5 rounded-full blur-3xl animate-pulse"></div>

            {/* Container Principal da Ilustração */}
            <div className="relative w-full max-w-[450px] aspect-[4/5] sm:aspect-square">

              {/* Card 1: A Triagem (Interface de Mensagem) */}
              <div className="absolute top-0 left-0 w-[80%] bg-white/60 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/40 transform -rotate-3 transition-transform hover:rotate-0 duration-500 z-20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-[#f05a61]/20 rounded-full flex items-center justify-center text-[#f05a61]">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div className="h-2 w-24 bg-gray-200 rounded-full"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-2.5 w-full bg-[#5a6d4f]/10 rounded-full"></div>
                  <div className="h-2.5 w-[90%] bg-[#5a6d4f]/10 rounded-full"></div>
                  <div className="h-2.5 w-[60%] bg-[#f05a61]/40 rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* Card 2: O Dashboard Médico (Conexão) */}
              <div className="absolute bottom-4 right-0 w-[80%] bg-[#5a6d4f] rounded-2xl p-5 shadow-2xl transform rotate-3 transition-transform hover:rotate-0 duration-500 z-10">
                <div className="flex justify-between items-start mb-4">
                  <ClipboardCheck className="w-10 h-10 text-white/90" />
                  <Sparkles className="w-5 h-5 text-white/40" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 text-[10px] uppercase tracking-wider"></span>
                    <span className="text-[10px] text-green-300 font-bold bg-green-900/30 px-2 py-0.5 rounded-full">Pronto</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-white/60 rounded-full"></div>
                  </div>
                  <p className="text-white/80 text-xs leading-relaxed">
                    Paciente preparada para a consulta.
                  </p>
                </div>
              </div>

              {/* Elemento Central: O Ícone de Conversa Vitalian */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-3xl shadow-2xl flex items-center justify-center z-30 border-4 border-[#FEFAE0]">
                <MessageSquareText className="w-10 h-10 text-[#5a6d4f]" />
              </div>

              {/* Decoração Adicional: Pontos de Dados */}
              <div className="absolute -top-6 -right-6 w-12 h-12 bg-[#f05a61]/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-[#5a6d4f]/10 rounded-full blur-2xl"></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}