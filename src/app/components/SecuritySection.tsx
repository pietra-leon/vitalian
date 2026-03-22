import { Shield, Lock, Server, CheckCircle2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

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
      description: 'Totalmente adequado à Lei Geral de Proteção de Dados.'
    },
    {
      icon: CheckCircle2,
      title: 'Acesso Restrito',
      description: 'Apenas o médico responsável acessa as informações da paciente.'
    }
  ];

  return (
    <section id="seguranca" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1767972464040-8bfee42d7bed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWN1cmUlMjB0ZWNobm9sb2d5JTIwZW5jcnlwdGVkfGVufDF8fHx8MTc3NDIxMzc2OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Segurança de dados"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Badge */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-6 max-w-xs">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-900">Certificado</div>
                  <div className="text-xs text-gray-600">LGPD Compliant</div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl text-gray-900">
                Segurança e Privacidade em Primeiro Lugar
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Dados de saúde são sensíveis. O Vitalian utiliza criptografia AES-256 e armazenamento em servidores seguros (AWS Brasil), garantindo que apenas o médico responsável tenha acesso às informações.
              </p>
            </div>

            {/* Security Features Grid */}
            <div className="grid sm:grid-cols-2 gap-6 pt-4">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-12 h-12 bg-[#5a6d4f]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-[#5a6d4f]" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">SSL/TLS</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">ISO 27001</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">HIPAA Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
