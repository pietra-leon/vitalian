import { Clock } from 'lucide-react';
import type { Module } from '@/mock/questionnaire';

/** Corpo da tela de abertura de um módulo (o título fica no StepLayout). */
export function ModuleIntro({ module }: { module: Module }) {
  return (
    <div className="mt-4 space-y-5">
      <p className="text-[17px] leading-relaxed text-texto-2">{module.intro}</p>
      <p className="inline-flex items-center gap-2 rounded-full bg-verde-claro px-4 py-2 text-[15px] font-medium text-verde-profundo">
        <Clock className="size-[18px]" aria-hidden="true" />
        {module.estimate}
      </p>
    </div>
  );
}
