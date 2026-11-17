// O questionário inteiro é DADO. O renderizador genérico (QuestionRenderer)
// lê esta estrutura; nenhuma pergunta está escrita em componente.
// No produto real isto virá de `questionnaires_templates.schema` (JSONB).
import { invite, nascimentoBr } from './invite';
import { type Answers, type Condition, type Value, isAnswered, matches } from './conditions';

export type FieldType =
  | 'readonly'
  | 'text'
  | 'longtext'
  | 'date'
  | 'cpf'
  | 'phone'
  | 'single'
  | 'multi'
  | 'scale'
  | 'slider';

export interface Option {
  value: string;
  label: string;
  /** Em múltipla escolha: marcar esta opção desmarca as outras (ex.: "Nenhum"). */
  exclusive?: boolean;
}

export interface Field {
  id: string;
  type: FieldType;
  /** Rótulo visível. Se ausente, o título da pergunta rotula o campo. */
  label?: string;
  help?: string;
  options?: Option[];
  /** Em campos de data: saídas como "Não lembro". */
  alternatives?: Option[];
  optional?: boolean;
  maxLength?: number;
  readonlyValue?: string;
  minLabel?: string;
  maxLabel?: string;
  showIf?: Condition;
}

export interface Question {
  id: string;
  title: string;
  help?: string;
  /** Sensível: aviso com cadeado, oculta na revisão e sempre pode ser pulada. */
  sensitive?: boolean;
  optional?: boolean;
  /** Oferece "Prefiro conversar pessoalmente" (toda pergunta sensível oferece). */
  inPerson?: boolean;
  showIf?: Condition;
  fields: Field[];
}

export interface Module {
  id: number;
  title: string;
  intro: string;
  estimate: string;
  questions: Question[];
}

const simNao: Option[] = [
  { value: 'sim', label: 'Sim' },
  { value: 'nao', label: 'Não' },
];

const temSintoma = (s: string): Condition => ({ field: 'sintomas', includes: s });

export const modules: Module[] = [
  {
    id: 1,
    title: 'Quem é você',
    intro: 'Vamos só confirmar alguns dados para a equipe reconhecer você.',
    estimate: 'cerca de 1 minuto',
    questions: [
      {
        id: 'nome',
        title: 'Este é o seu nome?',
        fields: [
          {
            id: 'nome',
            type: 'readonly',
            label: 'Nome completo',
            readonlyValue: invite.paciente.nome,
            help: 'Está certo? Se não estiver, avise a clínica no dia da consulta.',
          },
          {
            id: 'nome_preferido',
            type: 'text',
            label: 'Como você prefere ser chamada? (opcional)',
            optional: true,
            maxLength: 60,
          },
        ],
      },
      {
        id: 'nascimento',
        title: 'Sua data de nascimento',
        fields: [
          {
            id: 'nascimento',
            type: 'readonly',
            label: 'Data de nascimento',
            readonlyValue: nascimentoBr,
            help: 'Você já confirmou esta data. Não precisa digitar de novo.',
          },
        ],
      },
      {
        id: 'cpf',
        title: 'Qual é o seu CPF?',
        help: 'Usamos o CPF só para ligar suas respostas ao seu cadastro na clínica.',
        fields: [{ id: 'cpf', type: 'cpf', label: 'CPF' }],
      },
      {
        id: 'telefone',
        title: 'Tem um telefone com WhatsApp?',
        help: 'A clínica só usa este número para falar sobre a sua consulta.',
        optional: true,
        fields: [{ id: 'telefone', type: 'phone', label: 'Telefone com DDD (opcional)', optional: true }],
      },
      {
        id: 'dum',
        title: 'Qual foi o primeiro dia da sua última menstruação?',
        help: 'Uma data aproximada já ajuda.',
        fields: [
          {
            id: 'dum',
            type: 'date',
            label: 'Primeiro dia da última menstruação',
            alternatives: [
              { value: 'nao_lembro', label: 'Não lembro' },
              { value: 'nao_menstruo', label: 'Não menstruo no momento' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: 'Seu histórico',
    intro: 'Algumas perguntas rápidas sobre a sua saúde até aqui.',
    estimate: 'cerca de 2 minutos',
    questions: [
      {
        id: 'primeira_consulta',
        title: 'É a sua primeira consulta ginecológica?',
        inPerson: true,
        fields: [{ id: 'primeira_consulta', type: 'single', options: simNao }],
      },
      {
        id: 'metodos',
        title: 'Você usa algum método para evitar gravidez?',
        help: 'Pode marcar mais de um.',
        fields: [
          {
            id: 'metodos',
            type: 'multi',
            options: [
              { value: 'nenhum', label: 'Nenhum', exclusive: true },
              { value: 'pilula', label: 'Pílula' },
              { value: 'diu_hormonal', label: 'DIU hormonal' },
              { value: 'diu_cobre', label: 'DIU de cobre' },
              { value: 'implante', label: 'Implante' },
              { value: 'injetavel', label: 'Injetável' },
              { value: 'anel', label: 'Anel' },
              { value: 'adesivo', label: 'Adesivo' },
              { value: 'preservativo', label: 'Preservativo' },
              { value: 'outro', label: 'Outro' },
            ],
          },
        ],
      },
      {
        id: 'gravidez',
        title: 'Existe a chance de você estar grávida agora?',
        sensitive: true,
        fields: [
          {
            id: 'gravidez',
            type: 'single',
            options: [
              { value: 'nao', label: 'Não' },
              { value: 'talvez', label: 'Talvez' },
              { value: 'positivo', label: 'Fiz um teste e deu positivo' },
            ],
          },
        ],
      },
      {
        id: 'alergia',
        title: 'Você tem alergia a algum medicamento?',
        fields: [
          {
            id: 'alergia',
            type: 'single',
            options: [...simNao, { value: 'nao_sei', label: 'Não sei' }],
          },
          {
            id: 'alergia_quais',
            type: 'text',
            label: 'Quais?',
            maxLength: 200,
            showIf: { field: 'alergia', equals: 'sim' },
          },
        ],
      },
      {
        id: 'cirurgia',
        title: 'Já fez alguma cirurgia?',
        fields: [
          { id: 'cirurgia', type: 'single', options: simNao },
          {
            id: 'cirurgia_qual',
            type: 'text',
            label: 'Qual e quando?',
            maxLength: 200,
            showIf: { field: 'cirurgia', equals: 'sim' },
          },
        ],
      },
      {
        id: 'medicamentos',
        title: 'Usa algum medicamento ou suplemento com frequência?',
        optional: true,
        fields: [
          {
            id: 'medicamentos',
            type: 'text',
            label: 'Medicamentos e suplementos (opcional)',
            optional: true,
            maxLength: 200,
          },
        ],
      },
    ],
  },
  {
    id: 3,
    title: 'O motivo da consulta',
    intro: 'Conte o que está acontecendo, do seu jeito. Não existe resposta errada.',
    estimate: 'cerca de 2 minutos',
    questions: [
      {
        id: 'motivo',
        title: 'O que a traz à consulta?',
        fields: [
          {
            id: 'motivo',
            type: 'single',
            options: [
              { value: 'rotina', label: 'Rotina e prevenção' },
              { value: 'receita', label: 'Renovar receita' },
              { value: 'dor', label: 'Dor ou desconforto' },
              { value: 'sangramento', label: 'Sangramento diferente do habitual' },
              { value: 'corrimento', label: 'Corrimento ou coceira' },
              { value: 'atraso', label: 'Atraso da menstruação' },
              { value: 'mama', label: 'Alteração na mama' },
              { value: 'duvidas', label: 'Dúvidas' },
              { value: 'outro', label: 'Outro' },
            ],
          },
        ],
      },
      {
        id: 'sintomas',
        title: 'Está sentindo algum destes sintomas?',
        help: 'Pode marcar mais de um.',
        fields: [
          {
            id: 'sintomas',
            type: 'multi',
            options: [
              { value: 'dor_baixa', label: 'Dor na parte baixa da barriga' },
              { value: 'sangramento', label: 'Sangramento fora do período' },
              { value: 'corrimento', label: 'Corrimento com cheiro' },
              { value: 'coceira', label: 'Coceira ou ardência' },
              { value: 'feridas', label: 'Feridas ou lesões na região íntima' },
              { value: 'nodulo', label: 'Nódulo na mama' },
              { value: 'febre', label: 'Febre' },
              { value: 'atraso', label: 'Menstruação atrasada' },
              { value: 'dor_relacao', label: 'Dor na relação' },
              { value: 'nenhum', label: 'Nenhum', exclusive: true },
            ],
          },
        ],
      },
      {
        id: 'dor',
        title: 'Sobre a dor na parte baixa da barriga',
        showIf: temSintoma('dor_baixa'),
        fields: [
          {
            id: 'dor_intensidade',
            type: 'slider',
            label: 'De 0 a 10, quanto dói?',
            minLabel: 'Sem dor',
            maxLabel: 'A pior dor possível',
          },
          {
            id: 'dor_inicio',
            type: 'single',
            label: 'Como começou?',
            options: [
              { value: 'de_repente', label: 'Foi de repente' },
              { value: 'dias', label: 'Há alguns dias' },
              { value: 'semanas', label: 'Há semanas' },
              { value: 'meses', label: 'Vai e volta há meses' },
            ],
          },
        ],
      },
      {
        id: 'sangramento_volume',
        title: 'Como é o volume do sangramento?',
        showIf: temSintoma('sangramento'),
        fields: [
          {
            id: 'sangramento_volume',
            type: 'single',
            options: [
              { value: 'pouco', label: 'Pouco' },
              { value: 'parecido', label: 'Parecido com a menstruação' },
              { value: 'muito', label: 'Muito: troco o absorvente em 1 hora ou menos' },
            ],
          },
        ],
      },
      {
        id: 'febre_temp',
        title: 'Qual foi a temperatura?',
        showIf: temSintoma('febre'),
        fields: [
          {
            id: 'febre_temp',
            type: 'single',
            options: [
              { value: 'nao_medi', label: 'Não medi' },
              { value: 'ate_37_9', label: 'Até 37,9' },
              { value: '38_mais', label: '38 ou mais' },
            ],
          },
        ],
      },
      {
        id: 'atraso_tempo',
        title: 'Há quanto tempo a menstruação está atrasada?',
        showIf: temSintoma('atraso'),
        fields: [
          {
            id: 'atraso_tempo',
            type: 'single',
            options: [
              { value: 'menos_15', label: 'Menos de 15 dias' },
              { value: '15_45', label: 'De 15 a 45 dias' },
              { value: 'mais_45', label: 'Mais de 45 dias' },
              { value: 'nao_sei', label: 'Não sei' },
            ],
          },
        ],
      },
      {
        id: 'duracao',
        title: 'Há quanto tempo isso acontece?',
        showIf: { all: [{ field: 'sintomas', answered: true }, { not: temSintoma('nenhum') }] },
        fields: [
          {
            id: 'duracao',
            type: 'single',
            options: [
              { value: 'menos_1_semana', label: 'Menos de 1 semana' },
              { value: '1_4_semanas', label: '1 a 4 semanas' },
              { value: '1_6_meses', label: '1 a 6 meses' },
              { value: 'mais_6_meses', label: 'Mais de 6 meses' },
            ],
          },
        ],
      },
      {
        id: 'ist',
        title:
          'Teve relação sem preservativo com alguém que teve ou pode ter uma infecção sexualmente transmissível?',
        sensitive: true,
        optional: true,
        fields: [{ id: 'ist', type: 'single', options: simNao }],
      },
      {
        id: 'relato',
        title: 'Quer contar com suas palavras o que está sentindo?',
        optional: true,
        fields: [
          {
            id: 'relato',
            type: 'longtext',
            label: 'Seu relato (opcional)',
            optional: true,
            maxLength: 600,
          },
        ],
      },
    ],
  },
  {
    id: 4,
    title: 'Seu bem-estar',
    intro:
      'Estas perguntas são mais pessoais. Responda só o que quiser: todas podem ser puladas ou deixadas para a conversa na consulta.',
    estimate: 'cerca de 2 minutos',
    questions: [
      {
        id: 'ansiedade',
        title: 'Como você está se sentindo em relação à consulta?',
        sensitive: true,
        optional: true,
        fields: [
          { id: 'ansiedade', type: 'scale', minLabel: 'Tranquila', maxLabel: 'Muito ansiosa' },
        ],
      },
      {
        id: 'preocupacoes',
        title: 'Algo disso preocupa você?',
        help: 'Pode marcar mais de um.',
        sensitive: true,
        optional: true,
        fields: [
          {
            id: 'preocupacoes',
            type: 'multi',
            options: [
              { value: 'exame_fisico', label: 'O exame físico' },
              { value: 'preventivo', label: 'O exame preventivo (papanicolau)' },
              { value: 'julgada', label: 'Ser julgada' },
              { value: 'dor', label: 'Sentir dor' },
              { value: 'sexualidade', label: 'Falar sobre sexualidade' },
              { value: 'nada', label: 'Nada em especial', exclusive: true },
            ],
          },
        ],
      },
      {
        id: 'vida_sexual',
        title: 'Você tem vida sexual ativa?',
        sensitive: true,
        optional: true,
        fields: [
          {
            id: 'vida_sexual',
            type: 'single',
            options: [
              { value: 'sim', label: 'Sim' },
              { value: 'ainda_nao', label: 'Ainda não' },
            ],
          },
        ],
      },
      {
        id: 'habitos',
        title: 'Sobre cigarro e bebida',
        sensitive: true,
        optional: true,
        fields: [
          {
            id: 'fuma',
            type: 'single',
            label: 'Você fuma?',
            optional: true,
            options: [
              { value: 'nao', label: 'Não' },
              { value: 'sim', label: 'Sim' },
              { value: 'parei', label: 'Parei' },
            ],
          },
          {
            id: 'alcool',
            type: 'single',
            label: 'Consome bebida alcoólica?',
            optional: true,
            options: [
              { value: 'nao', label: 'Não' },
              { value: 'as_vezes', label: 'Às vezes' },
              { value: 'frequencia', label: 'Com frequência' },
            ],
          },
        ],
      },
      {
        id: 'tristeza',
        title: 'Nas últimas 2 semanas, você se sentiu muito triste ou sem esperança?',
        sensitive: true,
        optional: true,
        fields: [
          {
            id: 'tristeza',
            type: 'single',
            options: [
              { value: 'nao', label: 'Não' },
              { value: 'alguns_dias', label: 'Alguns dias' },
              { value: 'muitos_dias', label: 'Muitos dias' },
            ],
          },
        ],
      },
      {
        id: 'autolesao',
        title: 'Você teve pensamentos de se machucar ou de que seria melhor não estar aqui?',
        help: 'Você pode responder com sinceridade. Isso é importante para o seu cuidado.',
        sensitive: true,
        optional: true,
        fields: [
          {
            id: 'autolesao',
            type: 'single',
            options: [
              { value: 'nao', label: 'Não' },
              { value: 'sim', label: 'Sim' },
            ],
          },
        ],
      },
      {
        id: 'violencia',
        title:
          'Você se sente segura nos seus relacionamentos? Já passou por alguma situação em que foi forçada a algo contra a sua vontade?',
        sensitive: true,
        optional: true,
        fields: [
          {
            id: 'violencia',
            type: 'single',
            options: [
              { value: 'nao', label: 'Não' },
              { value: 'passado', label: 'Sim, no passado' },
              { value: 'atualmente', label: 'Sim, atualmente' },
            ],
          },
        ],
      },
      {
        id: 'duvidas',
        title: 'Alguma dúvida que quer levar para a consulta?',
        sensitive: true,
        optional: true,
        fields: [
          {
            id: 'duvidas',
            type: 'longtext',
            label: 'Suas dúvidas (opcional)',
            optional: true,
            maxLength: 600,
          },
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// "Prefiro conversar pessoalmente": fica guardado à parte, por pergunta, para
// nunca ser confundido com uma resposta clínica (e nunca acionar regra).
// ---------------------------------------------------------------------------
export const IN_PERSON_KEY = '@pessoalmente';
export const IN_PERSON_LABEL = 'Prefiro conversar pessoalmente';

export function offersInPerson(q: Question): boolean {
  return Boolean(q.sensitive || q.inPerson);
}

export function inPersonIds(a: Answers): string[] {
  const v = a[IN_PERSON_KEY];
  return Array.isArray(v) ? v : [];
}

export function isInPerson(a: Answers, questionId: string): boolean {
  return inPersonIds(a).includes(questionId);
}

export function canSkip(q: Question): boolean {
  return Boolean(q.optional || q.sensitive);
}

export function visibleQuestions(m: Module, a: Answers): Question[] {
  return m.questions.filter((q) => !q.showIf || matches(q.showIf, a));
}

export function visibleFields(q: Question, a: Answers): Field[] {
  return q.fields.filter((f) => !f.showIf || matches(f.showIf, a));
}

export function getModule(id: number): Module | undefined {
  return modules.find((m) => m.id === id);
}

export function findQuestion(id: string): { module: Module; question: Question } | undefined {
  for (const module of modules) {
    const question = module.questions.find((q) => q.id === id);
    if (question) return { module, question };
  }
  return undefined;
}

export function findField(id: string): { question: Question; field: Field } | undefined {
  for (const m of modules) {
    for (const question of m.questions) {
      const field = question.fields.find((f) => f.id === id);
      if (field) return { question, field };
    }
  }
  return undefined;
}

/** Rótulo de uma opção (ex.: 'dor_baixa' -> 'Dor na parte baixa da barriga'). */
export function optionLabel(fieldId: string, value: string): string {
  const f = findField(fieldId)?.field;
  return [...(f?.options ?? []), ...(f?.alternatives ?? [])].find((o) => o.value === value)?.label ?? value;
}

export function effectiveValue(f: Field, a: Answers): Value | undefined {
  // Somente leitura: usa o dado do cadastro (painel) ou o do convite (jornada da paciente).
  return f.type === 'readonly' ? (a[f.id] ?? f.readonlyValue) : a[f.id];
}

/** Texto da resposta para a tela de revisão. */
export function formatAnswer(f: Field, v: Value | undefined): string {
  if (!isAnswered(v)) return 'Sem resposta';
  const all = [...(f.options ?? []), ...(f.alternatives ?? [])];
  const label = (x: string) => all.find((o) => o.value === x)?.label ?? x;
  if (Array.isArray(v)) return v.map(label).join(', ');
  if (typeof v === 'number') {
    if (f.type === 'slider') return `${v} de 10`;
    if (f.type === 'scale') return `${v} de 5 (1 = ${f.minLabel}, 5 = ${f.maxLabel})`;
    return String(v);
  }
  return label(v);
}

// ---------------------------------------------------------------------------
// Máscaras e validação gentil (mensagens sem culpa).
// ---------------------------------------------------------------------------
export const onlyDigits = (s: string) => s.replace(/\D/g, '');

export function maskDate(s: string): string {
  const d = onlyDigits(s).slice(0, 8);
  return [d.slice(0, 2), d.slice(2, 4), d.slice(4, 8)].filter(Boolean).join('/');
}

export function maskCpf(s: string): string {
  const d = onlyDigits(s).slice(0, 11);
  let out = d.slice(0, 3);
  if (d.length > 3) out += '.' + d.slice(3, 6);
  if (d.length > 6) out += '.' + d.slice(6, 9);
  if (d.length > 9) out += '-' + d.slice(9, 11);
  return out;
}

export function maskPhone(s: string): string {
  const d = onlyDigits(s).slice(0, 11);
  if (d.length === 0) return '';
  let out = '(' + d.slice(0, 2);
  if (d.length > 2) out += ') ' + d.slice(2, d.length > 10 ? 7 : 6);
  if (d.length > 6) out += '-' + d.slice(d.length > 10 ? 7 : 6);
  return out;
}

/** Valida os dois dígitos verificadores do CPF. */
export function isValidCpf(s: string): boolean {
  const d = onlyDigits(s);
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  const digit = (len: number) => {
    let sum = 0;
    for (let i = 0; i < len; i++) sum += Number(d[i]) * (len + 1 - i);
    const r = (sum * 10) % 11;
    return r === 10 ? 0 : r;
  };
  return digit(9) === Number(d[9]) && digit(10) === Number(d[10]);
}

/** Devolve a mensagem de ajuda para uma data DD/MM/AAAA, ou null se estiver ok. */
export function dateProblem(s: string, opts: { allowFuture?: boolean } = {}): string | null {
  const d = onlyDigits(s);
  if (d.length === 0) return 'Digite a data para continuar.';
  if (d.length < 2) return 'Falta só completar o dia do mês.';
  if (d.length < 4) return 'Falta só o mês.';
  if (d.length < 8) return 'Falta só o ano, com 4 números.';
  const day = Number(d.slice(0, 2));
  const month = Number(d.slice(2, 4));
  const year = Number(d.slice(4, 8));
  const date = new Date(year, month - 1, day);
  const exists =
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  if (!exists || year < 1900) return 'Não encontramos essa data no calendário. Vale conferir o dia e o mês.';
  if (!opts.allowFuture && date.getTime() > Date.now()) return 'Essa data ainda não chegou. Vale conferir o ano.';
  return null;
}

/** Mensagem de ajuda para um campo, ou null se pode seguir. */
export function fieldProblem(f: Field, a: Answers): string | null {
  const v = a[f.id];
  if (f.type === 'readonly') return null;
  if (!isAnswered(v)) {
    if (f.optional) return null;
    switch (f.type) {
      case 'single':
      case 'scale':
        return 'Escolha uma opção para continuar.';
      case 'multi':
        return 'Marque pelo menos uma opção para continuar.';
      case 'slider':
        return 'Toque na régua para indicar um número.';
      case 'cpf':
        return 'Digite o CPF para continuar.';
      case 'date':
        return 'Digite a data ou escolha uma das opções abaixo.';
      default:
        return 'Falta só preencher este campo.';
    }
  }
  if (typeof v !== 'string') return null;
  if (f.type === 'cpf') {
    if (onlyDigits(v).length < 11) return `Faltam ${11 - onlyDigits(v).length} números para completar o CPF.`;
    if (!isValidCpf(v)) return 'Esse CPF não fecha com os dígitos finais. Vale conferir os números.';
  }
  if (f.type === 'date') {
    if (f.alternatives?.some((o) => o.value === v)) return null;
    return dateProblem(v);
  }
  if (f.type === 'phone') {
    const n = onlyDigits(v).length;
    if (n < 10) return `Faltam ${10 - n} números (com o DDD).`;
  }
  return null;
}

/** Problemas da pergunta, por campo. Vazio = pode avançar. */
export function questionProblems(q: Question, a: Answers): Record<string, string> {
  if (isInPerson(a, q.id)) return {};
  const out: Record<string, string> = {};
  for (const f of visibleFields(q, a)) {
    // Em pergunta opcional ou sensível, campo vazio nunca bloqueia.
    const field = canSkip(q) ? { ...f, optional: true } : f;
    const p = fieldProblem(field, a);
    if (p) out[f.id] = p;
  }
  return out;
}

/** Ids de todos os campos da pergunta (para limpar ao pular). */
export function fieldIds(q: Question): string[] {
  return q.fields.filter((f) => f.type !== 'readonly').map((f) => f.id);
}
