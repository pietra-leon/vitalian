// Cenários prontos da demonstração: preenchem as respostas e levam à revisão.
// Todos os dados são fictícios.
import type { Answers } from './conditions';
import { invite } from './invite';
import { IN_PERSON_KEY } from './questionnaire';

export interface Scenario {
  id: string;
  nome: string;
  descricao: string;
  /** Resultado esperado, usado no teste dos cenários. */
  esperado: { nivel: 'rotina' | 'atencao' | 'urgente'; apoio: boolean };
  answers: Answers;
}

const base: Answers = {
  nome_preferido: 'Mari',
  cpf: invite.cpfDeTeste,
  telefone: '(11) 90000-0000',
  dum: '02/11/2026',
  primeira_consulta: 'nao',
  metodos: ['pilula'],
  gravidez: 'nao',
  alergia: 'nao',
  cirurgia: 'nao',
  motivo: 'rotina',
  sintomas: ['nenhum'],
  ist: 'nao',
  ansiedade: 2,
  preocupacoes: ['nada'],
  vida_sexual: 'sim',
  fuma: 'nao',
  alcool: 'as_vezes',
  tristeza: 'nao',
  autolesao: 'nao',
  violencia: 'nao',
};

export const scenarios: Scenario[] = [
  {
    id: 'rotina',
    nome: 'Rotina',
    descricao: 'Consulta de prevenção, sem sintomas.',
    esperado: { nivel: 'rotina', apoio: false },
    answers: { ...base },
  },
  {
    id: 'atencao-nodulo',
    nome: 'Atenção (nódulo na mama)',
    descricao: 'Percebeu um nódulo na mama há algumas semanas.',
    esperado: { nivel: 'atencao', apoio: false },
    answers: {
      ...base,
      motivo: 'mama',
      sintomas: ['nodulo'],
      duracao: '1_4_semanas',
      ansiedade: 4,
      preocupacoes: ['exame_fisico'],
      relato: 'Senti um carocinho na mama esquerda no banho e fiquei preocupada.',
    },
  },
  {
    id: 'urgente-dor',
    nome: 'Urgente (dor intensa)',
    descricao: 'Dor 9 de 10 na parte baixa da barriga, de início súbito.',
    esperado: { nivel: 'urgente', apoio: false },
    answers: {
      ...base,
      motivo: 'dor',
      sintomas: ['dor_baixa'],
      dor_intensidade: 9,
      dor_inicio: 'de_repente',
      duracao: 'menos_1_semana',
      ansiedade: 5,
      preocupacoes: ['dor'],
    },
  },
  {
    id: 'urgente-gestacao',
    nome: 'Urgente (possível gestação com sangramento)',
    descricao: 'Teste positivo e sangramento fora do período.',
    esperado: { nivel: 'urgente', apoio: false },
    answers: {
      ...base,
      metodos: ['preservativo'],
      gravidez: 'positivo',
      motivo: 'sangramento',
      sintomas: ['sangramento', 'atraso'],
      sangramento_volume: 'parecido',
      atraso_tempo: '15_45',
      duracao: 'menos_1_semana',
      ansiedade: 5,
    },
  },
  {
    id: 'apoio-violencia',
    nome: 'Apoio (violência atual)',
    descricao: 'Consulta de rotina; relata não estar segura no relacionamento.',
    esperado: { nivel: 'urgente', apoio: true },
    answers: { ...base, ansiedade: 4, tristeza: 'alguns_dias', violencia: 'atualmente' },
  },
  {
    id: 'apoio-autolesao',
    nome: 'Apoio (pensamentos de se machucar)',
    descricao: 'Consulta de rotina; relata tristeza e pensamentos de se machucar.',
    esperado: { nivel: 'urgente', apoio: true },
    answers: { ...base, ansiedade: 3, tristeza: 'muitos_dias', autolesao: 'sim' },
  },
  {
    id: 'pessoalmente',
    nome: 'Preferiu conversar pessoalmente',
    descricao: 'Várias respostas "Prefiro conversar pessoalmente". Nenhuma regra é acionada.',
    esperado: { nivel: 'rotina', apoio: false },
    answers: {
      ...base,
      primeira_consulta: undefined,
      gravidez: undefined,
      ist: undefined,
      vida_sexual: undefined,
      tristeza: undefined,
      autolesao: undefined,
      violencia: undefined,
      motivo: 'duvidas',
      ansiedade: 4,
      preocupacoes: ['julgada', 'sexualidade'],
      [IN_PERSON_KEY]: [
        'primeira_consulta',
        'gravidez',
        'ist',
        'vida_sexual',
        'tristeza',
        'autolesao',
        'violencia',
      ],
    },
  },
];

export function getScenario(id: string): Scenario | undefined {
  return scenarios.find((s) => s.id === id);
}
