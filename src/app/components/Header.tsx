import { useState, useEffect } from 'react';
import { Button } from './ui/button';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="font-serif text-2xl tracking-tight text-gray-900">
              Vitalian
            </h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('problema')}
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              O Problema
            </button>
            <button
              onClick={() => scrollToSection('como-funciona')}
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Como Funciona
            </button>
            <button
              onClick={() => scrollToSection('seguranca')}
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Segurança
            </button>
            <button
              onClick={() => scrollToSection('clinicas')}
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Para Clínicas
            </button>
          </nav>

          {/* CTA Button */}
          <div>
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              Acesso do Médico
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
