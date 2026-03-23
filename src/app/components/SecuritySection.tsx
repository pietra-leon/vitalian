import { Shield, Lock, Server, CheckCircle2, ShieldCheck, Globe, Fingerprint } from 'lucide-react';

export function SecuritySection() {
  const features = [
    {
      icon: Lock,
      title: 'Criptografia de Ponta a Ponta',
      description: 'AES-256, o mesmo padrão usado por bancos e governos.'
    },
    {
      icon: Server,
      title: 'Servidores no Brasil',
      description: 'Dados hospedados em AWS São Paulo, garantindo soberania nacional.'
    },
    {
      icon: Shield,
      title: 'Conformidade LGPD',
      description: 'Adequado à Lei Geral de Proteção de Dados.'
    },
    {
      icon: CheckCircle2,
      title: 'Acesso Restrito',
      description: 'Apenas o médico responsável acessa as informações da paciente.'
    }
  ];

  return (
    <section id="seguranca" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Ilustração de Segurança (Substituindo a Imagem) */}
          <div className="relative flex items-center justify-center p-8">
            {/* Círculos de fundo decorativos */}
            <div className="absolute w-[90%] h-[90%] bg-[#5a6d4f]/5 rounded-full blur-3xl" />

            {/* Composição de Camadas de Segurança */}
            <div className="relative w-full aspect-square max-w-[450px] flex items-center justify-center">

              {/* Camada Base: Rede/Globo */}
              <div className="absolute inset-0 bg-white/40 backdrop-blur-xl rounded-[2.5rem] border border-white/40 shadow-2xl flex items-center justify-center overflow-hidden">
                <Globe className="w-64 h-64 text-[#5a6d4f]/5 absolute -bottom-10 -right-10" />

                {/* Centro: Escudo Principal */}
                <div className="flex flex-col items-center gap-4 z-10">
                  <div className="w-24 h-24 bg-[#5a6d4f] rounded-3xl flex items-center justify-center shadow-2xl animate-pulse">
                    <ShieldCheck className="w-12 h-12 text-white" />
                  </div>
                  <div className="px-4 py-2 bg-[#5a6d4f]/10 rounded-full border border-[#5a6d4f]/20">
                    <span className="text-[#5a6d4f] text-xs font-bold tracking-widest uppercase">Proteção Ativa</span>
                  </div>
                </div>
              </div>

              {/* Cards Flutuantes (Extra Impacto Visual) */}
              <div className="absolute -top-4 -right-4 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 animate-bounce shadow-green-900/5">
                <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <Fingerprint className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-xs font-bold text-gray-700">AES-256 Bit</span>
              </div>

              <div className="absolute bottom-10 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 transition-transform hover:scale-110 duration-500">
                <div className="w-8 h-8 bg-[#f05a61]/10 rounded-lg flex items-center justify-center">
                  <Lock className="w-5 h-5 text-[#f05a61]" />
                </div>
                <span className="text-xs font-bold text-gray-700">End-to-End</span>
              </div>
            </div>

            {/* Badge LGPD (Mantido e Estilizado) */}
            <div className="absolute -bottom-6 right-6 bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900 leading-none">Certificado</div>
                  <div className="text-xs text-green-600 font-medium mt-1">100% LGPD Compliant</div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl text-gray-900 font-calistoga leading-tight">
                Segurança e Privacidade em Primeiro Lugar
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Dados de saúde são sensíveis. O Vitalian utiliza criptografia e armazenamento em servidores seguros, garantindo que apenas o médico responsável tenha acesso às informações.
              </p>
            </div>

            {/* Security Features Grid */}
            <div className="grid sm:grid-cols-2 gap-6 pt-4">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4 p-4 rounded-xl hover:bg-white/40 transition-colors border border-transparent hover:border-white/60">
                  <div className="w-12 h-12 bg-[#5a6d4f]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-[#5a6d4f]" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-bold mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-snug">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/50 rounded-full border border-gray-100 shadow-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-bold text-gray-700 uppercase tracking-tighter">SSL/TLS</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/50 rounded-full border border-gray-100 shadow-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-bold text-gray-700 uppercase tracking-tighter">ISO 27001</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}