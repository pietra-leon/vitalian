import { Link2, FileText, BarChart3 } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: Link2,
      title: 'Link Personalizado',
      description: 'A paciente recebe um link seguro e personalizado logo após o agendamento da consulta.',
      image: 'https://images.unsplash.com/photo-1731514836024-614e2bab04c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwY29uc3VsdGF0aW9uJTIwY2FsbSUyMHdvbWFufGVufDF8fHx8MTc3NDIxMzc2N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      number: '02',
      icon: FileText,
      title: 'Questionário Empático',
      description: 'Responde a perguntas dinâmicas e humanizadas no conforto de casa, sem pressão ou vergonha.',
      image: 'https://images.unsplash.com/photo-1758691463610-3c2ecf5fb3fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwcHJvZmVzc2lvbmFsJTIwdGFibGV0fGVufDF8fHx8MTc3NDIxMDU0M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      number: '03',
      icon: BarChart3,
      title: 'Dashboard Inteligente',
      description: 'Você recebe um painel completo com flags de risco e insights antes da consulta começar.',
      image: 'https://images.unsplash.com/photo-1767972464040-8bfee42d7bed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWN1cmUlMjB0ZWNobm9sb2d5JTIwZW5jcnlwdGVkfGVufDF8fHx8MTc3NDIxMzc2OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    }
  ];

  return (
    <section id="como-funciona" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-gray-900 mb-4">
            A Experiência Vitalian
          </h2>
          <p className="text-xl text-gray-600">
            Simples para a paciente. Poderoso para você.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-24">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Content */}
              <div className={`space-y-6 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="flex items-center gap-4">
                  <span className="text-6xl font-serif text-[#5a6d4f]/20">
                    {step.number}
                  </span>
                  <div className="w-14 h-14 bg-[#5a6d4f] rounded-lg flex items-center justify-center">
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                </div>
                <h3 className="text-3xl text-gray-900">
                  {step.title}
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Visual */}
              <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 shadow-xl">
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">Interface Preview</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
