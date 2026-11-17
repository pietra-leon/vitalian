// Resumo para a consulta, montado POR REGRAS a partir das respostas (sem IA).
// Tudo aqui é "resposta autodeclarada da paciente": nenhum texto pode soar
// como diagnóstico ou conduta.
import { type Answers, isAnswered } from '@/mock/conditions';
import { type Rule } from '@/mock/flags';
import { findQuestion, inPersonIds, isInPerson, optionLabel } from '@/mock/questionnaire';

const low = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
const str = (a: Answers, f: string) => (typeof a[f] === 'string' ? (a[f] as string) : '');
const list = (a: Answers, f: string) => (Array.isArray(a[f]) ? (a[f] as string[]) : []);
const opt = (a: Answers, f: string) => (str(a, f) ? low(optionLabel(f, str(a, f))) : '');

const PESSOALMENTE = 'prefere conversar pessoalmente';
const SEM = 'não informado';

function single(a: Answers, f: string, questionId = f): string {
  if (isInPerson(a, questionId)) return PESSOALMENTE;
  return opt(a, f) || SEM;
}

export function dumText(a: Answers): string {
  const v = str(a, 'dum');
  if (!v) return SEM;
  if (v === 'nao_lembro') return 'não lembra';
  if (v === 'nao_menstruo') return 'não menstrua no momento';
  return v;
}

export function metodosText(a: Answers): string {
  const m = list(a, 'metodos');
  return m.length ? m.map((x) => low(optionLabel('metodos', x))).join(', ') : SEM;
}

export function alergiasText(a: Answers): string {
  const v = str(a, 'alergia');
  if (v === 'sim') return str(a, 'alergia_quais') || 'sim (não especificou)';
  if (v === 'nao') return 'nenhuma relatada';
  if (v === 'nao_sei') return 'não sabe informar';
  return SEM;
}

export function cirurgiasText(a: Answers): string {
  const v = str(a, 'cirurgia');
  if (v === 'sim') return str(a, 'cirurgia_qual') || 'sim (não especificou)';
  if (v === 'nao') return 'nenhuma relatada';
  return SEM;
}

export const medicacoesText = (a: Answers) => str(a, 'medicamentos') || 'nenhuma relatada';
export const gestacaoText = (a: Answers) => single(a, 'gravidez');

/** Dados-chave do relatório (grade de 2 colunas). */
export function keyData(a: Answers): [string, string][] {
  return [
    ['DUM', dumText(a)],
    ['Método contraceptivo', metodosText(a)],
    ['Possibilidade de gestação', gestacaoText(a)],
    ['Alergias', alergiasText(a)],
    ['Cirurgias prévias', cirurgiasText(a)],
    ['Medicações em uso', medicacoesText(a)],
  ];
}

function sintomasDetalhe(a: Answers): string[] {
  const s = list(a, 'sintomas');
  const out: string[] = [];
  if (s.includes('dor_baixa')) {
    const partes = [];
    if (typeof a.dor_intensidade === 'number') partes.push(`intensidade ${a.dor_intensidade}/10`);
    if (str(a, 'dor_inicio')) partes.push(`início: ${opt(a, 'dor_inicio')}`);
    if (partes.length) out.push(`Dor: ${partes.join(', ')}.`);
  }
  if (s.includes('sangramento') && str(a, 'sangramento_volume'))
    out.push(`Sangramento: volume ${opt(a, 'sangramento_volume')}.`);
  if (s.includes('febre') && str(a, 'febre_temp')) out.push(`Febre: ${opt(a, 'febre_temp')}.`);
  if (s.includes('atraso') && str(a, 'atraso_tempo')) out.push(`Atraso menstrual: ${opt(a, 'atraso_tempo')}.`);
  return out;
}

/** 5 a 8 linhas curtas, legíveis em menos de um minuto. */
export function buildSummary(a: Answers, idade: number): string[] {
  const sintomas = list(a, 'sintomas').filter((x) => x !== 'nenhum');
  const duracao = str(a, 'duracao') ? `, há ${opt(a, 'duracao')}` : '';
  const linhas = [
    `Paciente de ${idade} anos. Primeira consulta ginecológica: ${single(a, 'primeira_consulta')}.`,
    `Motivo: ${opt(a, 'motivo') || SEM}${sintomas.length ? duracao : ''}.`,
    sintomas.length
      ? `Sintomas: ${sintomas.map((x) => low(optionLabel('sintomas', x))).join(', ')}.`
      : 'Sintomas: nenhum relatado.',
  ];
  const det = sintomasDetalhe(a);
  if (det.length) linhas.push(det.join(' '));
  linhas.push(`DUM: ${dumText(a)}. Contracepção: ${metodosText(a)}. Possibilidade de gestação: ${gestacaoText(a)}.`);
  linhas.push(`Alergias: ${alergiasText(a)}. Cirurgias: ${cirurgiasText(a)}.`);
  linhas.push(`Medicações em uso: ${medicacoesText(a)}.`);
  if (typeof a.ansiedade === 'number') linhas.push(`Ansiedade em relação à consulta: ${a.ansiedade} de 5.`);
  return linhas;
}

export const SUMMARY_NOTE = 'Gerado por regras a partir de respostas autodeclaradas da paciente.';

/** Motivo de um alerta, com os valores respondidos. */
export function alertReason(rule: Rule, a: Answers): string {
  const s = list(a, 'sintomas');
  const sint = (ids: string[]) =>
    ids.filter((x) => s.includes(x)).map((x) => low(optionLabel('sintomas', x)));
  switch (rule.id) {
    case 'dor_intensa':
      return [
        'Dor na parte baixa da barriga',
        typeof a.dor_intensidade === 'number' ? `intensidade ${a.dor_intensidade}/10` : '',
        str(a, 'dor_inicio') ? `início: ${opt(a, 'dor_inicio')}` : '',
      ]
        .filter(Boolean)
        .join(' · ');
    case 'sangramento_intenso':
      return `Sangramento fora do período · volume: ${opt(a, 'sangramento_volume')}`;
    case 'febre_com_sintoma':
      return `Febre: ${opt(a, 'febre_temp')} · junto com ${sint(['dor_baixa', 'corrimento', 'sangramento']).join(', ')}`;
    case 'gestacao_com_sintoma':
      return `Possibilidade de gestação: ${opt(a, 'gravidez')} · junto com ${sint(['dor_baixa', 'sangramento']).join(', ')}`;
    case 'autolesao':
      return 'Respondeu "Sim" a pensamentos de se machucar';
    case 'violencia_atual':
      return 'Respondeu "Sim, atualmente" sobre situação de violência';
    case 'nodulo_mama':
      return `Marcou "Nódulo na mama"${str(a, 'duracao') ? ` · há ${opt(a, 'duracao')}` : ''}`;
    case 'suspeita_ist':
      return 'Relatou relação sem preservativo com possível exposição a IST';
    case 'lesoes_genitais':
      return 'Marcou "Feridas ou lesões na região íntima"';
    case 'atraso_sem_metodo':
      return `Menstruação atrasada: ${opt(a, 'atraso_tempo')} · contracepção: ${metodosText(a)}`;
    default:
      return rule.rotulo;
  }
}

/** Campos cujas respostas participaram de algum alerta ("Gerou alerta"). */
const camposPorRegra: Record<string, string[]> = {
  dor_intensa: ['sintomas', 'dor_intensidade', 'dor_inicio'],
  sangramento_intenso: ['sintomas', 'sangramento_volume'],
  febre_com_sintoma: ['sintomas', 'febre_temp'],
  gestacao_com_sintoma: ['gravidez', 'sintomas'],
  autolesao: ['autolesao'],
  violencia_atual: ['violencia'],
  nodulo_mama: ['sintomas'],
  suspeita_ist: ['ist'],
  lesoes_genitais: ['sintomas'],
  atraso_sem_metodo: ['sintomas', 'atraso_tempo', 'metodos'],
};

export function alertFields(regras: Rule[]): Set<string> {
  return new Set(regras.flatMap((r) => camposPorRegra[r.id] ?? []));
}

/** Tópicos para abordar pessoalmente, em tom discreto. */
export function inPersonTopics(a: Answers): string[] {
  const out = inPersonIds(a).map((id) => findQuestion(id)?.question.title ?? id);
  if (a.violencia === 'passado')
    out.push('Relatou ter passado, no passado, por situação em que foi forçada a algo contra a vontade.');
  return out;
}

export { isAnswered };
