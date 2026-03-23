import { Check, Brain, FileCheck, Download, Calendar, Activity, Users, ClipboardCheck } from 'lucide-react';
import { Button } from './ui/button';

export function ClinicSection() {
  const benefits = [
    {
      icon: Brain,
      title: 'Triagem Inteligente',
      description: 'IA básica de sintomas identifica casos prioritários automaticamente.',
      highlight: true
    },
    {
      icon: FileCheck,
      title: 'Guia de Preparo Automático',
      description: 'A paciente recebe orientações personalizadas antes da consulta.',
      highlight: true
    },
    {
      icon: Download,
      title: 'Exportação de Dados',
      description: 'Integre com seu prontuário eletrônico via PDF ou JSON.',
      highlight: true
    },
    {
      icon: Calendar,
      title: 'Agendamento Integrado',
      description: 'Sincronize com sua agenda e envie os formulários automaticamente.',
      highlight: false
    }
  ];

  const packages = [
    {
      name: 'Essencial',
      price: 'R$ ---',
      period: '/mês',
      features: [
        'Até 50 pacientes/mês',
        'Questionário padrão',
        'Dashboard básico',
        'Suporte por email'
      ],
      cta: 'Começar Agora',
      highlighted: false
    },
    {
      name: 'Profissional',
      price: 'R$ ---',
      period: '/mês',
      features: [
        'Até 150 pacientes/mês',
        'Questionários personalizáveis',
        'IA de triagem incluída',
        'Exportação para prontuário',
        'Suporte prioritário'
      ],
      cta: 'Mais Popular',
      highlighted: true
    },
    {
      name: 'Enterprise',
      price: 'R$ ---',
      period: '',
      features: [
        'Pacientes ilimitados',
        'API completa',
        'Múltiplos médicos',
        'Customização total',
        'Gerente de conta dedicado'
      ],
      cta: 'Falar com Consultor',
      highlighted: false
    }
  ];

  return (
    <section id="clinicas" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-gray-900 mb-4 font-calistoga">
            Para sua Clínica ou Consultório
          </h2>
          <p className="text-xl text-gray-600">
            Ferramentas profissionais que economizam tempo e aumentam a qualidade do atendimento.
          </p>
        </div>

        {/* Benefits Grid with Illustration */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex gap-4 items-start p-6 bg-white/50 backdrop-blur-sm rounded-xl hover:shadow-md transition-all border border-transparent hover:border-white"
              >
                <div className="w-12 h-12 bg-[#5a6d4f] rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg text-gray-900 mb-1 font-medium">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Ilustração da Clínica (Substituindo a Imagem) */}
          <div className="relative flex items-center justify-center p-4">
            {/* Elementos Decorativos de Fundo */}
            <div className="absolute w-72 h-72 bg-[#5a6d4f]/10 rounded-full blur-3xl" />

            <div className="relative w-full aspect-[4/3] bg-white/40 backdrop-blur-md rounded-3xl border border-white/40 shadow-2xl flex flex-col p-8 overflow-hidden">
              {/* Header da "Interface" */}
              <div className="flex justify-between items-center mb-8">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                  <div className="w-3 h-3 bg-green-400 rounded-full" />
                </div>
                <Activity className="w-5 h-5 text-[#5a6d4f]" />
              </div>

              {/* Grid de Dados Simulado */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/60 p-4 rounded-xl shadow-sm border border-white">
                  <Users className="w-6 h-6 text-[#5a6d4f] mb-2" />
                  <div className="h-2 w-12 bg-gray-200 rounded-full mb-1" />
                  <div className="h-4 w-8 bg-gray-800 rounded-sm" />
                </div>
                <div className="bg-white/60 p-4 rounded-xl shadow-sm border border-white">
                  <ClipboardCheck className="w-6 h-6 text-[#f05a61] mb-2" />
                  <div className="h-2 w-16 bg-gray-200 rounded-full mb-1" />
                  <div className="h-4 w-10 bg-gray-800 rounded-sm" />
                </div>
              </div>

              {/* Gráfico Simulado */}
              <div className="mt-6 flex-1 bg-[#5a6d4f]/5 rounded-xl border border-[#5a6d4f]/10 p-4 flex items-end gap-2">
                <div className="w-full bg-[#5a6d4f]/20 h-[30%] rounded-t-sm" />
                <div className="w-full bg-[#5a6d4f]/40 h-[60%] rounded-t-sm" />
                <div className="w-full bg-[#5a6d4f] h-[45%] rounded-t-sm" />
                <div className="w-full bg-[#5a6d4f]/30 h-[80%] rounded-t-sm" />
              </div>

              {/* Floating Elements */}
              <div className="absolute top-1/2 -right-4 bg-[#f05a61] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg transform rotate-12">
                IA ANALYZING
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className={`rounded-2xl p-8 transition-all duration-300 ${pkg.highlighted
                ? 'bg-[#5a6d4f] text-white shadow-2xl scale-105 ring-4 ring-[#5a6d4f]/20'
                : 'bg-white/60 backdrop-blur-sm border-2 border-white shadow-sm hover:shadow-md'
                }`}
            >
              {pkg.highlighted && (
                <div className="text-center mb-4">
                  <span className="inline-block px-4 py-1 bg-white/20 rounded-full text-sm font-medium">
                    Recomendado
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className={`text-2xl mb-4 font-calistoga ${pkg.highlighted ? 'text-white' : 'text-gray-900'}`}>
                  {pkg.name}
                </h3>
                <div className="flex items-baseline justify-center gap-2">
                  <span className={`text-4xl font-bold ${pkg.highlighted ? 'text-white' : 'text-gray-900'}`}>
                    {pkg.price}
                  </span>
                  {pkg.period && (
                    <span className={pkg.highlighted ? 'text-white/80' : 'text-gray-600'}>
                      {pkg.period}
                    </span>
                  )}
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${pkg.highlighted ? 'text-white' : 'text-[#5a6d4f]'
                      }`} />
                    <span className={pkg.highlighted ? 'text-white/90' : 'text-gray-600'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full font-bold shadow-lg ${pkg.highlighted
                  ? 'bg-white text-[#5a6d4f] hover:bg-gray-100'
                  : 'bg-[#5a6d4f] text-white hover:bg-[#4a5d3f]'
                  }`}
                size="lg"
              >
                {pkg.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center bg-white/40 backdrop-blur-md border border-white rounded-2xl p-12 shadow-xl">
          <h3 className="text-2xl text-gray-900 mb-4 font-calistoga">
            Não tem certeza qual plano escolher?
          </h3>
          <p className="text-gray-600 mb-6">
            Entre na lista de espera e receba uma demonstração personalizada.
          </p>

          <a
            href="https://wa.me/5564981157082?text=Olá!%20Gostaria%20de%20entrar%20na%20lista%20de%20espera%20da%20Vitalian%20e%20receber%20uma%20demonstração."
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              size="lg"
              className="border-[#5a6d4f] text-[#5a6d4f] hover:bg-[#5a6d4f]/10 font-bold px-12 rounded-full"
            >
              Entrar na Lista de Espera
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}