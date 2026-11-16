// Estado da jornada: vive SOMENTE em memória (React context).
// Nada de localStorage, sessionStorage, cookies, IndexedDB ou rede: são dados
// de saúde. Recarregar a página reinicia a jornada, e isso é intencional.
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Answers, Value } from '@/mock/conditions';
import { invite } from '@/mock/invite';
import { IN_PERSON_KEY, inPersonIds } from '@/mock/questionnaire';
import { getScenario } from '@/mock/scenarios';

export interface Simulation {
  /** A paciente do convite é menor de 18 anos. */
  minor: boolean;
  /** O próximo envio falha. */
  sendError: boolean;
  /** Faixa "sem internet". */
  offline: boolean;
  /** Aviso de sessão prestes a expirar. */
  sessionWarning: boolean;
  /** Quadro "o que a médica veria" na revisão. */
  showRules: boolean;
}

interface JourneyState {
  consent: boolean;
  verified: boolean;
  attemptsLeft: number;
  answers: Answers;
  submitted: boolean;
  scenarioId: string | null;
  sim: Simulation;
}

const initialSim: Simulation = {
  minor: false,
  sendError: false,
  offline: false,
  sessionWarning: false,
  showRules: false,
};

const initial: JourneyState = {
  consent: false,
  verified: false,
  attemptsLeft: invite.tentativasDeVerificacao,
  answers: {},
  submitted: false,
  scenarioId: null,
  sim: initialSim,
};

interface Journey extends JourneyState {
  giveConsent: () => void;
  verify: () => void;
  /** Registra uma tentativa errada de verificação. */
  failAttempt: () => void;
  exhaustAttempts: () => void;
  setAnswer: (fieldId: string, value: Value | undefined) => void;
  /** Marca ou desmarca "Prefiro conversar pessoalmente" e limpa os campos. */
  setInPerson: (questionId: string, on: boolean, clearFields: string[]) => void;
  clearFields: (fieldIds: string[], questionId: string) => void;
  markSubmitted: () => void;
  loadScenario: (id: string) => void;
  setSim: (patch: Partial<Simulation>) => void;
  /** Encerra a sessão: apaga respostas, mantém as opções de simulação. */
  endSession: () => void;
  /** Reinicia tudo. */
  reset: () => void;
}

const Ctx = createContext<Journey | null>(null);

export function JourneyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<JourneyState>(initial);

  const giveConsent = useCallback(() => setState((s) => ({ ...s, consent: true })), []);
  const verify = useCallback(() => setState((s) => ({ ...s, verified: true })), []);

  const failAttempt = useCallback(
    () => setState((s) => ({ ...s, attemptsLeft: Math.max(0, s.attemptsLeft - 1) })),
    [],
  );

  const exhaustAttempts = useCallback(
    () => setState((s) => ({ ...s, attemptsLeft: 0, verified: false })),
    [],
  );

  const setAnswer = useCallback((fieldId: string, value: Value | undefined) => {
    setState((s) => ({ ...s, submitted: false, answers: { ...s.answers, [fieldId]: value } }));
  }, []);

  const setInPerson = useCallback((questionId: string, on: boolean, clear: string[]) => {
    setState((s) => {
      const answers: Answers = { ...s.answers };
      const ids = inPersonIds(answers).filter((id) => id !== questionId);
      if (on) {
        ids.push(questionId);
        for (const f of clear) answers[f] = undefined;
      }
      answers[IN_PERSON_KEY] = ids;
      return { ...s, submitted: false, answers };
    });
  }, []);

  const clearFields = useCallback((ids: string[], questionId: string) => {
    setState((s) => {
      const answers: Answers = { ...s.answers };
      for (const f of ids) answers[f] = undefined;
      answers[IN_PERSON_KEY] = inPersonIds(answers).filter((id) => id !== questionId);
      return { ...s, submitted: false, answers };
    });
  }, []);

  const markSubmitted = useCallback(
    () => setState((s) => ({ ...s, submitted: true, sim: { ...s.sim, sendError: false } })),
    [],
  );

  const loadScenario = useCallback((id: string) => {
    const sc = getScenario(id);
    if (!sc) return;
    setState((s) => ({
      ...s,
      consent: true,
      verified: true,
      attemptsLeft: invite.tentativasDeVerificacao,
      submitted: false,
      scenarioId: id,
      answers: { ...sc.answers },
      sim: { ...s.sim, minor: false },
    }));
  }, []);

  const setSim = useCallback(
    (patch: Partial<Simulation>) => setState((s) => ({ ...s, sim: { ...s.sim, ...patch } })),
    [],
  );

  const endSession = useCallback(
    () => setState((s) => ({ ...initial, sim: { ...s.sim, sessionWarning: false } })),
    [],
  );

  const reset = useCallback(() => setState(initial), []);

  const value = useMemo<Journey>(
    () => ({
      ...state,
      giveConsent,
      verify,
      failAttempt,
      exhaustAttempts,
      setAnswer,
      setInPerson,
      clearFields,
      markSubmitted,
      loadScenario,
      setSim,
      endSession,
      reset,
    }),
    [
      state,
      giveConsent,
      verify,
      failAttempt,
      exhaustAttempts,
      setAnswer,
      setInPerson,
      clearFields,
      markSubmitted,
      loadScenario,
      setSim,
      endSession,
      reset,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useJourney(): Journey {
  const v = useContext(Ctx);
  if (!v) throw new Error('useJourney precisa estar dentro de <JourneyProvider>.');
  return v;
}

/** Primeira etapa pendente, para os guardas de rota. */
export function firstPendingPath(j: Pick<JourneyState, 'consent' | 'verified'>): string {
  if (!j.consent) return '/triagem/demo/consentimento';
  if (!j.verified) return '/triagem/demo/verificacao';
  return '/triagem/demo/revisao';
}
