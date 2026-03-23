import { Link2, FileText, BarChart3, Smartphone, Heart, Activity } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: Link2,
      title: 'Link Personalizado',
      description: 'A paciente recebe um link seguro e personalizado logo após o agendamento da consulta.',
      // Ilustração para o Passo 1: Celular + Link
      visual: (
        <div className="relative w-full h-full flex items-center justify-center bg-white/30 backdrop-blur-sm">
          <div className="relative w-48 h-80 bg-gray-900 rounded-[3rem] border-4 border-gray-800 shadow-2xl overflow-hidden flex flex-col items-center justify-center p-6 text-center">
            <div className="w-12 h-12 bg-[#5a6d4f] rounded-full flex items-center justify-center mb-4 animate-pulse">
              <Link2 className="text-white w-6 h-6" />
            </div>
            <div className="h-2 w-24 bg-gray-700 rounded-full mb-2" />
            <div className="h-2 w-16 bg-gray-800 rounded-full" />
            {/* Elemento flutuante de "Mensagem enviada" */}
            <div className="absolute top-10 -right-8 bg-white p-3 rounded-lg shadow-lg border border-gray-100 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
              <span className="text-[10px] font-bold text-gray-500">Link Enviado</span>
            </div>
          </div>
        </div>
      )
    },
    {
      number: '02',
      icon: FileText,
      title: 'Questionário Empático',
      description: 'Responde a perguntas dinâmicas e humanizadas no conforto de casa, sem pressão ou vergonha.',
      // Ilustração para o Passo 2: Coração + Papel
      visual: (
        <div className="relative w-full h-full flex items-center justify-center bg-white/30 backdrop-blur-sm">
          <div className="w-64 h-64 bg-white rounded-2xl shadow-xl flex flex-col p-6 space-y-4 transform -rotate-2">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#f05a61] fill-[#f05a61]" />
              <div className="h-3 w-32 bg-gray-100 rounded-full" />
            </div>
            <div className="space-y-2">
              <div className="h-2 w-full bg-gray-50 rounded-full" />
              <div className="h-2 w-full bg-gray-50 rounded-full" />
              <div className="h-2 w-3/4 bg-gray-50 rounded-full" />
            </div>
            <div className="mt-4 flex justify-end">
              <div className="w-20 h-8 bg-[#5a6d4f] rounded-md" />
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#5a6d4f]/10 rounded-full -z-10" />
        </div>
      )
    },
    {
      number: '03',
      icon: BarChart3,
      title: 'Dashboard Inteligente',
      description: 'Você recebe um painel completo com flags de risco e insights antes da consulta começar.',
      // Ilustração para o Passo 3: Gráficos + Flags
      visual: (
        <div className="relative w-full h-full flex items-center justify-center bg-white/30 backdrop-blur-sm">
          <div className="w-72 h-48 bg-gray-900 rounded-xl shadow-2xl p-4 flex flex-col justify-between overflow-hidden">
            <div className="flex justify-between items-start">
              <Activity className="text-[#f05a61] w-6 h-6" />
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              </div>
            </div>
            <div className="flex items-end gap-2 h-20">
              <div className="w-full bg-white/10 h-1/2 rounded-t-sm" />
              <div className="w-full bg-[#5a6d4f] h-3/4 rounded-t-sm" />
              <div className="w-full bg-white/10 h-1/4 rounded-t-sm" />
              <div className="w-full bg-[#f05a61] h-full rounded-t-sm" />
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <section id="como-funciona" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-gray-900 mb-4 font-calistoga">
            A Experiência Vitalian
          </h2>
          <p className="text-xl text-gray-600">
            Simples para a paciente. Poderoso para você.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-32"> {/* Aumentei o espaço entre passos */}
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex flex-col lg:flex-row gap-16 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
            >
              {/* Content */}
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-4">
                  <span className="text-6xl font-serif text-[#5a6d4f]/20">
                    {step.number}
                  </span>
                  <div className="w-14 h-14 bg-[#5a6d4f] rounded-lg flex items-center justify-center shadow-lg">
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                </div>
                <h3 className="text-3xl text-gray-900 font-calistoga">
                  {step.title}
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Visual - Ilustrações Dinâmicas */}
              <div className="flex-1 w-full max-w-[500px]">
                <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-white/40 border border-white/20 shadow-xl transition-transform hover:scale-[1.02] duration-500">
                  {step.visual}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}