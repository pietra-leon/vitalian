import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/app/components/ui/accordion';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Btn } from '@/components/form/Btn';
import { StepLayout } from '@/components/flow/StepLayout';
import { invite } from '@/mock/invite';
import { useJourney } from '@/state/JourneyContext';

const itens = [
  [
    'Quais dados são coletados',
    'Seu nome, data de nascimento, CPF, telefone (se você informar) e as respostas sobre a sua saúde que você escolher dar neste questionário.',
  ],
  [
    'Quem pode ver',
    'Somente a equipe de saúde da clínica que vai atender você. Suas respostas não são compartilhadas com outras pessoas ou empresas.',
  ],
  [
    'Seus direitos',
    'Você pode pedir acesso ao que respondeu, corrigir alguma informação ou solicitar a exclusão dos seus dados. Basta falar com a clínica.',
  ],
] as const;

export default function Consent() {
  const { consent, giveConsent } = useJourney();
  const [checked, setChecked] = useState(consent);
  const navigate = useNavigate();

  return (
    <StepLayout
      title="Como vamos usar o que você contar"
      actions={
        <>
          <Btn variante="texto" onClick={() => navigate('/triagem/demo')}>
            Voltar
          </Btn>
          <Btn
            className="flex-1"
            disabled={!checked}
            onClick={() => {
              giveConsent();
              navigate('/triagem/demo/verificacao');
            }}
          >
            Continuar
          </Btn>
        </>
      }
    >
      <p className="mt-4 text-[17px] leading-relaxed text-texto-2">
        Suas respostas serão vistas apenas pela equipe de saúde da {invite.clinica}. Elas servem para
        preparar a sua consulta, e você pode pular qualquer pergunta sensível.
      </p>

      <div className="mt-6 rounded-[20px] border border-borda bg-superficie px-4 sombra-suave">
        <Accordion type="single" collapsible>
          {itens.map(([titulo, texto]) => (
            <AccordionItem key={titulo} value={titulo} className="border-borda">
              <AccordionTrigger className="min-h-14 items-center py-3 text-base font-semibold text-verde-profundo hover:no-underline [&>svg]:size-5 [&>svg]:text-verde">
                {titulo}
              </AccordionTrigger>
              <AccordionContent className="text-[15px] leading-relaxed text-texto-2">{texto}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <p className="mt-2 w-fit rounded-full border-[1.5px] border-dashed border-verde px-3 py-1 text-[13px] text-verde-profundo">
        Texto de demonstração
      </p>

      <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-[20px] border-[1.5px] border-texto-2/70 bg-superficie p-4 text-base leading-snug font-medium text-verde-profundo has-[[data-state=checked]]:border-verde has-[[data-state=checked]]:bg-verde-claro">
        <Checkbox
          className="mt-0.5 size-6 rounded-md border-2 border-texto-2 [&_svg]:size-4"
          checked={checked}
          onCheckedChange={(v) => setChecked(v === true)}
        />
        <span>Li e concordo com o uso das minhas respostas para preparar a minha consulta.</span>
      </label>
      <p className="mt-3 text-[13px] text-texto-2">Versão do termo: {invite.versaoTermo}</p>
    </StepLayout>
  );
}
