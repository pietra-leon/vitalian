import { Clock, Heart, SkipForward } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Ramo } from '@/components/feedback/Illustrations';
import { Btn } from '@/components/form/Btn';
import { StepLayout } from '@/components/flow/StepLayout';
import { invite } from '@/mock/invite';

const chips = [
  [Clock, 'Leva cerca de 8 minutos'],
  [SkipForward, 'Você pode pular o que não quiser responder'],
  [Heart, 'Ninguém vai julgar suas respostas'],
] as const;

export default function Welcome() {
  const navigate = useNavigate();
  return (
    <StepLayout
      title={`Olá, ${invite.paciente.primeiroNome}. A ${invite.clinica} preparou este espaço para você.`}
      top={
        <div className="mt-2 mb-5">
          <Ramo />
        </div>
      }
      actions={
        <Btn className="w-full" onClick={() => navigate('/triagem/demo/consentimento')}>
          Começar
        </Btn>
      }
    >
      <p className="mt-4 text-[17px] leading-relaxed text-texto-2">
        Antes da consulta, você pode contar com calma como está. Assim, a {invite.profissional} dedica o
        tempo do encontro a cuidar de você.
      </p>
      <ul className="mt-6 space-y-2.5">
        {chips.map(([Icon, texto]) => (
          <li
            key={texto}
            className="flex items-center gap-3 rounded-full bg-verde-claro px-4 py-2.5 text-[15px] font-medium text-verde-profundo"
          >
            <Icon className="size-5 shrink-0 text-verde" aria-hidden="true" />
            {texto}
          </li>
        ))}
      </ul>
    </StepLayout>
  );
}
