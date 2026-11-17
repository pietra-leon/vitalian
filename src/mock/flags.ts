// REGRAS DE EXEMPLO PARA VALIDAÇÃO CLÍNICA. Não foram revisadas por um médico.
//
// Motor de triagem do MOCKUP, rodando no navegador só para demonstrar as
// variantes da tela final. No produto real esta avaliação acontece no servidor
// (Server Action), antes de criptografar as respostas.
//
// As regras são DADOS: `evaluate` apenas percorre a lista. Para mudar uma
// regra, edite a lista; o motor não muda.
import { type Answers, type Condition, matches } from './conditions';
import { IN_PERSON_LABEL, findQuestion, inPersonIds } from './questionnaire';

export type Nivel = 'rotina' | 'atencao' | 'urgente';

export interface Rule {
  id: string;
  /** `topico`: não muda o nível; vira "tópico a abordar" para a médica. */
  nivel: 'urgente' | 'atencao' | 'topico';
  rotulo: string;
  /**
   * Nível numérico (`urgency_level` do produto): 4 e 5 = urgente, 3 = atenção.
   * A gradação entre 4 e 5 é um palpite de exemplo, para o médico criticar.
   */
  urgencia?: 3 | 4 | 5;
  /** Aciona o bloco de apoio ("Você não está sozinha"). */
  apoio?: boolean;
  when: Condition;
}

const sintoma = (s: string): Condition => ({ field: 'sintomas', includes: s });
const possivelGestacao: Condition = { field: 'gravidez', in: ['talvez', 'positivo'] };

/** "Contínuo" = qualquer método da lista, exceto "Nenhum" e "Preservativo". */
export const METODOS_CONTINUOS = [
  'pilula',
  'diu_hormonal',
  'diu_cobre',
  'implante',
  'injetavel',
  'anel',
  'adesivo',
  'outro',
];

export const rules: Rule[] = [
  // ---- Urgente ----
  {
    id: 'dor_intensa',
    nivel: 'urgente',
    urgencia: 5,
    rotulo: 'Dor na parte baixa da barriga intensa (8 ou mais) ou de início súbito',
    when: {
      all: [
        sintoma('dor_baixa'),
        { any: [{ field: 'dor_intensidade', gte: 8 }, { field: 'dor_inicio', equals: 'de_repente' }] },
      ],
    },
  },
  {
    id: 'sangramento_intenso',
    nivel: 'urgente',
    urgencia: 5,
    rotulo: 'Sangramento fora do período com volume intenso',
    when: { all: [sintoma('sangramento'), { field: 'sangramento_volume', equals: 'muito' }] },
  },
  {
    id: 'febre_com_sintoma',
    nivel: 'urgente',
    urgencia: 4,
    rotulo: 'Febre de 38 ou mais junto com dor, corrimento ou sangramento',
    when: {
      all: [
        sintoma('febre'),
        { field: 'febre_temp', equals: '38_mais' },
        { field: 'sintomas', includesAny: ['dor_baixa', 'corrimento', 'sangramento'] },
      ],
    },
  },
  {
    id: 'gestacao_com_sintoma',
    nivel: 'urgente',
    urgencia: 5,
    rotulo: 'Possível gestação junto com dor ou sangramento',
    when: { all: [possivelGestacao, { field: 'sintomas', includesAny: ['dor_baixa', 'sangramento'] }] },
  },
  {
    id: 'autolesao',
    nivel: 'urgente',
    urgencia: 5,
    rotulo: 'Pensamentos de se machucar',
    apoio: true,
    when: { field: 'autolesao', equals: 'sim' },
  },
  {
    id: 'violencia_atual',
    nivel: 'urgente',
    urgencia: 4,
    rotulo: 'Situação de violência atual',
    apoio: true,
    when: { field: 'violencia', equals: 'atualmente' },
  },
  // ---- Atenção ----
  { id: 'nodulo_mama', nivel: 'atencao', urgencia: 3, rotulo: 'Nódulo na mama', when: sintoma('nodulo') },
  {
    id: 'suspeita_ist',
    nivel: 'atencao',
    urgencia: 3,
    rotulo: 'Possível exposição a IST',
    when: { field: 'ist', equals: 'sim' },
  },
  {
    id: 'lesoes_genitais',
    nivel: 'atencao',
    urgencia: 3,
    rotulo: 'Feridas ou lesões na região íntima',
    when: sintoma('feridas'),
  },
  {
    id: 'atraso_sem_metodo',
    nivel: 'atencao',
    urgencia: 3,
    rotulo: 'Menstruação atrasada há mais de 45 dias, sem método contraceptivo contínuo',
    when: {
      all: [
        sintoma('atraso'),
        { field: 'atraso_tempo', equals: 'mais_45' },
        { not: { field: 'metodos', includesAny: METODOS_CONTINUOS } },
      ],
    },
  },
  // ---- Tópicos a abordar (não mudam o nível nem acionam apoio) ----
  {
    id: 'violencia_passada',
    nivel: 'topico',
    rotulo: 'Relatou situação de violência no passado',
    when: { field: 'violencia', equals: 'passado' },
  },
];

export interface Evaluation {
  nivel: Nivel;
  /** Nível numérico de 1 a 5 (rotina: 1 sem sintomas, 2 com algum sintoma). */
  urgencia: 1 | 2 | 3 | 4 | 5;
  /** Regras de nível urgente ou atenção que foram acionadas. */
  regras: Rule[];
  /** Tópicos a abordar na consulta (não mudam o nível). */
  topicos: string[];
  /** Mostrar o bloco de apoio. */
  apoio: boolean;
  /** Alguma regra urgente de saúde física acionada (mostra o cartão de cuidado). */
  cuidadoFisico: boolean;
}

/** Função pura: mesmas respostas, mesmo resultado. Sem efeitos colaterais. */
export function evaluate(answers: Answers): Evaluation {
  const acionadas = rules.filter((r) => matches(r.when, answers));
  const regras = acionadas.filter((r) => r.nivel !== 'topico');
  const urgentes = regras.filter((r) => r.nivel === 'urgente');

  // "Prefiro conversar pessoalmente" NUNCA aciona regra: só vira tópico.
  const topicos = [
    ...acionadas.filter((r) => r.nivel === 'topico').map((r) => r.rotulo),
    ...inPersonIds(answers).map((id) => {
      const titulo = findQuestion(id)?.question.title ?? id;
      return `${IN_PERSON_LABEL}: "${titulo}"`;
    }),
  ];

  const sintomas = answers.sintomas;
  const temSintoma = Array.isArray(sintomas) && sintomas.some((x) => x !== 'nenhum');
  const urgencia = regras.reduce<1 | 2 | 3 | 4 | 5>(
    (max, r) => (r.urgencia && r.urgencia > max ? r.urgencia : max),
    temSintoma ? 2 : 1,
  );

  return {
    urgencia,
    nivel: urgentes.length > 0 ? 'urgente' : regras.length > 0 ? 'atencao' : 'rotina',
    regras,
    topicos,
    apoio: acionadas.some((r) => r.apoio),
    cuidadoFisico: urgentes.some((r) => !r.apoio),
  };
}
