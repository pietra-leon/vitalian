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
    rotulo: 'Sangramento fora do período com volume intenso',
    when: { all: [sintoma('sangramento'), { field: 'sangramento_volume', equals: 'muito' }] },
  },
  {
    id: 'febre_com_sintoma',
    nivel: 'urgente',
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
    rotulo: 'Possível gestação junto com dor ou sangramento',
    when: { all: [possivelGestacao, { field: 'sintomas', includesAny: ['dor_baixa', 'sangramento'] }] },
  },
  {
    id: 'autolesao',
    nivel: 'urgente',
    rotulo: 'Pensamentos de se machucar',
    apoio: true,
    when: { field: 'autolesao', equals: 'sim' },
  },
  {
    id: 'violencia_atual',
    nivel: 'urgente',
    rotulo: 'Situação de violência atual',
    apoio: true,
    when: { field: 'violencia', equals: 'atualmente' },
  },
  // ---- Atenção ----
  { id: 'nodulo_mama', nivel: 'atencao', rotulo: 'Nódulo na mama', when: sintoma('nodulo') },
  {
    id: 'suspeita_ist',
    nivel: 'atencao',
    rotulo: 'Possível exposição a IST',
    when: { field: 'ist', equals: 'sim' },
  },
  {
    id: 'lesoes_genitais',
    nivel: 'atencao',
    rotulo: 'Feridas ou lesões na região íntima',
    when: sintoma('feridas'),
  },
  {
    id: 'atraso_sem_metodo',
    nivel: 'atencao',
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

  return {
    nivel: urgentes.length > 0 ? 'urgente' : regras.length > 0 ? 'atencao' : 'rotina',
    regras,
    topicos,
    apoio: acionadas.some((r) => r.apoio),
    cuidadoFisico: urgentes.some((r) => !r.apoio),
  };
}
