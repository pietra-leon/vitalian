import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Btn } from '@/components/form/Btn';
import { DateMaskedInput } from '@/components/form/DateMaskedInput';
import { StepLayout } from '@/components/flow/StepLayout';
import { nascimentoBr } from '@/mock/invite';
import { dateProblem } from '@/mock/questionnaire';
import { useJourney } from '@/state/JourneyContext';

export default function Verify() {
  const { attemptsLeft, failAttempt, verify, sim } = useJourney();
  const [value, setValue] = useState('');
  const [error, setError] = useState<string>();
  const navigate = useNavigate();

  const submit = () => {
    // Data incompleta não gasta tentativa: só ajudamos a completar.
    const problema = dateProblem(value);
    if (problema) return setError(problema);

    if (value === nascimentoBr) {
      if (sim.minor) return navigate('/triagem/menor');
      verify();
      return navigate('/triagem/demo/modulo/1');
    }

    const restam = attemptsLeft - 1;
    failAttempt();
    if (restam <= 0) return navigate('/triagem/bloqueado');
    setError(
      `Essa data não confere. Você tem mais ${restam} ${restam === 1 ? 'tentativa' : 'tentativas'}.`,
    );
  };

  return (
    <StepLayout
      title="Só para confirmar que é você"
      actions={
        <>
          <Btn variante="texto" onClick={() => navigate('/triagem/demo/consentimento')}>
            Voltar
          </Btn>
          <Btn className="flex-1" onClick={submit}>
            Continuar
          </Btn>
        </>
      }
    >
      <p className="mt-4 mb-6 text-[17px] leading-relaxed text-texto-2">Digite sua data de nascimento.</p>
      <DateMaskedInput
        id="verificacao-nascimento"
        label="Data de nascimento"
        value={value}
        onChange={(v) => {
          setValue(v);
          setError(undefined);
        }}
        error={error}
        autoComplete="bday"
        onEnter={submit}
      />
      <p className="mt-5 w-fit rounded-full border-[1.5px] border-dashed border-verde px-4 py-2 text-[15px] text-verde-profundo">
        Na demonstração, use <strong>{nascimentoBr}</strong>
      </p>
    </StepLayout>
  );
}
