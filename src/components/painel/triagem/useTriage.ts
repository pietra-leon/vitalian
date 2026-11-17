import type { Answers } from '@/mock/conditions';
import { maskCpfHidden } from '@/mock/clinic';
import { type Field, effectiveValue, formatAnswer } from '@/mock/questionnaire';
import { useMemo } from 'react';
import { ageFrom } from '@/lib/dates';
import { alertFields, alertReason, buildSummary, inPersonTopics, keyData } from '@/lib/summary';
import { categoriaOf, type Triage } from '@/mock/clinic';
import { evaluate } from '@/mock/flags';
import { nivelRank } from './chips';

/** Tudo o que o detalhe e o relatório derivam das respostas. Nada é digitado à mão. */
export function useTriageView(t: Triage, now: Date) {
  return useMemo(() => {
    const ev = evaluate(t.answers);
    const idade = ageFrom(t.paciente.nascimento, now);
    const alertas = [...ev.regras]
      .sort((a, b) => nivelRank[b.nivel as 'urgente' | 'atencao'] - nivelRank[a.nivel as 'urgente' | 'atencao'])
      .map((r) => ({ id: r.id, nivel: r.nivel as 'urgente' | 'atencao', nome: r.rotulo, motivo: alertReason(r, t.answers) }));
    return {
      ev,
      idade,
      alertas,
      categoria: categoriaOf(t.answers, ev),
      resumo: buildSummary(t.answers, idade),
      topicos: inPersonTopics(t.answers),
      dados: keyData(t.answers),
      camposAlerta: alertFields(ev.regras),
    };
  }, [t, now]);
}

export const nomesModulos = ['Identificação', 'Histórico', 'Queixa', 'Bem-estar'];

/**
 * Resposta como aparece no painel e no relatório. O CPF sai sempre mascarado:
 * o número completo só aparece no cartão da paciente, pelo botão "Revelar",
 * que registra o acesso.
 */
export function respostaDoPainel(f: Field, answers: Answers): string {
  const v = effectiveValue(f, answers);
  if (f.type === 'cpf' && typeof v === 'string' && v) return maskCpfHidden(v);
  return formatAnswer(f, v);
}
