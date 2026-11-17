// Traduz as condições (dados) para português, para o médico ler e criticar.
import type { Condition } from '@/mock/conditions';
import { optionLabel } from '@/mock/questionnaire';

const nomes: Record<string, string> = {
  sintomas: 'sintomas',
  metodos: 'método contraceptivo',
  gravidez: 'possibilidade de gestação',
  alergia: 'alergia a medicamento',
  cirurgia: 'cirurgia prévia',
  dor_intensidade: 'intensidade da dor',
  dor_inicio: 'início da dor',
  sangramento_volume: 'volume do sangramento',
  febre_temp: 'temperatura',
  atraso_tempo: 'tempo de atraso',
  ist: 'possível exposição a IST',
  autolesao: 'pensamentos de se machucar',
  violencia: 'segurança nos relacionamentos',
};

const nome = (f: string) => nomes[f] ?? f;
const q = (f: string, v: string) => `"${optionLabel(f, v)}"`;
const lista = (f: string, vs: string[]) => vs.map((v) => q(f, v)).join(', ');

export function describeCondition(c: Condition, top = true): string {
  if ('all' in c) {
    const s = c.all.map((x) => describeCondition(x, false)).join(' E ');
    return top ? s : `(${s})`;
  }
  if ('any' in c) {
    const s = c.any.map((x) => describeCondition(x, false)).join(' OU ');
    return top ? s : `(${s})`;
  }
  if ('not' in c) return `NÃO (${describeCondition(c.not, true)})`;
  if ('equals' in c) return `${nome(c.field)} é ${q(c.field, c.equals)}`;
  if ('in' in c) return `${nome(c.field)} é um de: ${lista(c.field, c.in)}`;
  if ('includes' in c) return `${nome(c.field)} inclui ${q(c.field, c.includes)}`;
  if ('includesAny' in c) return `${nome(c.field)} inclui algum de: ${lista(c.field, c.includesAny)}`;
  if ('gte' in c) return `${nome(c.field)} é ${c.gte} ou mais`;
  return `${nome(c.field)} foi respondido`;
}
