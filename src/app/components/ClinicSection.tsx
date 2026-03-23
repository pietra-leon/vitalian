import { Check, Brain, FileCheck, Download, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

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
    <section id="clinicas" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-gray-900 mb-4">
            Para sua Clínica ou Consultório
          </h2>
          <p className="text-xl text-gray-600">
            Ferramentas profissionais que economizam tempo e aumentam a qualidade do atendimento.
          </p>
        </div>

        {/* Benefits Grid with Image */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex gap-4 items-start p-6 bg-white rounded-xl hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-[#5a6d4f] rounded-lg flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg text-gray-900 mb-1">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1720180244339-95e56d52e182?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjbGluaWMlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NzQxNTg1NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Clínica moderna"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className={`rounded-2xl p-8 ${pkg.highlighted
                ? 'bg-[#5a6d4f] text-white shadow-2xl scale-105'
                : 'bg-white border-2 border-gray-200'
                }`}
            >
              {pkg.highlighted && (
                <div className="text-center mb-4">
                  <span className="inline-block px-4 py-1 bg-white/20 rounded-full text-sm">
                    Recomendado
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className={`text-2xl mb-4 ${pkg.highlighted ? 'text-white' : 'text-gray-900'}`}>
                  {pkg.name}
                </h3>
                <div className="flex items-baseline justify-center gap-2">
                  <span className={`text-4xl ${pkg.highlighted ? 'text-white' : 'text-gray-900'}`}>
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
                className={`w-full ${pkg.highlighted
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
        <div className="text-center bg-gray-50 rounded-2xl p-12">
          <h3 className="text-2xl text-gray-900 mb-4">
            Não tem certeza qual plano escolher?
          </h3>
          <p className="text-gray-600 mb-6">
            Entre na lista de espera e receba uma demonstração personalizada.
          </p>

          {/* Link envolvendo o botão */}
          <a
            href="https://wa.me/5564981157082?text=Olá!%20Gostaria%20de%20entrar%20na%20lista%20de%20espera%20da%20Vitalian%20e%20receber%20uma%20demonstração."
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              size="lg"
              className="border-[#5a6d4f] text-[#5a6d4f] hover:bg-[#5a6d4f]/10"
            >
              Entrar na Lista de Espera
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
