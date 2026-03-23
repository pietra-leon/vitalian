import { EyeOff, Clock, AlertCircle } from 'lucide-react';

export function ProblemSection() {
  const problems = [
    {
      icon: EyeOff,
      title: 'Vergonha e Omissão',
      description: 'Pacientes jovens escondem sintomas por timidez, comprometendo o diagnóstico preciso.',
      color: 'bg-rose-100/50 text-rose-700' // Ajustado para contraste no fundo creme
    },
    {
      icon: Clock,
      title: 'Consultas Sobrecarregadas',
      description: 'Muito tempo gasto em anamnese básica que poderia ser coletada antecipadamente.',
      color: 'bg-amber-100/50 text-amber-700'
    },
    {
      icon: AlertCircle,
      title: 'Falta de Preparo',
      description: 'Pacientes chegam sem saber o que relatar, perdendo informações importantes.',
      color: 'bg-blue-100/50 text-blue-700'
    }
  ];

  return (
    <section
      id="problema"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-background" // Usa o seu #FEFAE0 definido no CSS
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-gray-900 mb-4 font-calistoga">
            O Gap do Silêncio
          </h2>
          <p className="text-xl text-gray-600">
            Você perde dados clínicos importantes todos os dias. E isso impacta diretamente a qualidade do seu atendimento.
          </p>
        </div>

        {/* Problem Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="bg-white/40 backdrop-blur-sm border border-black/5 rounded-xl p-8 hover:shadow-md transition-all hover:-translate-y-1"
            >
              <div className={`w-14 h-14 ${problem.color} rounded-lg flex items-center justify-center mb-6`}>
                <problem.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl mb-3 text-gray-900 font-medium">
                {problem.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {problem.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-lg text-gray-700">
            <span className="font-semibold text-[#5a6d4f]">O Vitalian resolve isso.</span> Com tecnologia e empatia.
          </p>
        </div>
      </div>
    </section>
  );
}