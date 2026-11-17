// Dados FICTÍCIOS da área do médico. Os nomes são propositalmente artificiais.
// O nível de cada triagem NUNCA é digitado aqui: vem de evaluate(answers).
// Mude uma resposta abaixo e o nível exibido no painel muda junto.
import { atDay, fmtDate, hoursAgo, isoToBr } from '@/lib/dates';
import type { Answers } from './conditions';
import { type Evaluation, evaluate } from './flags';
import { invite } from './invite';
import { IN_PERSON_KEY } from './questionnaire';
import { getScenario } from './scenarios';

export type Role = 'medico' | 'admin' | 'recepcao';

export interface User {
  id: string;
  nome: string;
  email: string;
  papel: Role;
}

export const roleLabel: Record<Role, string> = {
  medico: 'Médica',
  admin: 'Admin',
  recepcao: 'Recepção',
};

export const users: Record<Role, User> = {
  medico: { id: 'u1', nome: 'Dra. Helena Demo', email: 'helena@clinica.demo', papel: 'medico' },
  admin: { id: 'u2', nome: 'Carla Gestão Demo', email: 'carla@clinica.demo', papel: 'admin' },
  recepcao: { id: 'u3', nome: 'Rafael Recepção Demo', email: 'rafael@clinica.demo', papel: 'recepcao' },
};

export const clinic = { id: 'clinica-demo', nome: invite.clinica, questionario: 'gineco-demo v1' };

export type Status = 'pendente' | 'em_analise' | 'concluido';
export const statusLabel: Record<Status, string> = {
  pendente: 'Pendente',
  em_analise: 'Em análise',
  concluido: 'Concluído',
};

export type Categoria = 'rotina' | 'dor' | 'emergencia' | 'gestacao';
export const categoriaLabel: Record<Categoria, string> = {
  rotina: 'Rotina',
  dor: 'Dor',
  emergencia: 'Emergência',
  gestacao: 'Gestação',
};

export interface TimelineEvent {
  evento: string;
  quando: Date;
}

export interface Triage {
  id: string;
  paciente: { nome: string; nascimento: string; cpf: string; telefone: string };
  answers: Answers;
  consulta: Date;
  profissional: string;
  enviadaEm: Date;
  status: Status;
  /** Já foi aberta por alguém da clínica (senão aparece o ponto "Nova"). */
  aberta: boolean;
  timeline: TimelineEvent[];
  /** Destaque pulsante (triagem urgente simulada ou vinda da jornada da paciente). */
  destaque?: boolean;
}

/** Gera um CPF de teste VÁLIDO a partir de 9 dígitos (calcula os verificadores). */
export function makeCpf(base9: string): string {
  const d = base9.split('').map(Number);
  for (const len of [9, 10]) {
    let sum = 0;
    for (let i = 0; i < len; i++) sum += d[i] * (len + 1 - i);
    const r = (sum * 10) % 11;
    d.push(r === 10 ? 0 : r);
  }
  const s = d.join('');
  return `${s.slice(0, 3)}.${s.slice(3, 6)}.${s.slice(6, 9)}-${s.slice(9)}`;
}

export const maskCpfHidden = (cpf: string) => `***.***.***-${cpf.slice(-2)}`;

/** "Ana Exemplo" -> "Ana E." (usado no registro de acessos). */
export function partialName(nome: string): string {
  const [first, ...rest] = nome.split(' ');
  const last = rest.at(-1);
  return last ? `${first} ${last[0]}.` : first;
}

/** Categoria derivada das respostas e do nível (metadado aberto). */
export function categoriaOf(a: Answers, ev: Evaluation): Categoria {
  const gestacao = a.gravidez === 'talvez' || a.gravidez === 'positivo';
  if (gestacao) return 'gestacao';
  if (ev.nivel === 'urgente') return 'emergencia';
  const s = Array.isArray(a.sintomas) ? a.sintomas : [];
  if (a.motivo === 'dor' || s.includes('dor_baixa') || s.includes('dor_relacao')) return 'dor';
  return 'rotina';
}

const sc = (id: string): Answers => ({ ...getScenario(id)!.answers });

interface Seed {
  nome: string;
  nascimento: string;
  cpfBase: string;
  answers: Answers;
  dia: number;
  hora: [number, number];
  enviadaHa: number; // horas
  status: Status;
  aberta: boolean;
}

/**
 * 12 triagens: 3 urgentes, 3 de atenção e 6 de rotina (uma delas com várias
 * respostas "Prefiro conversar pessoalmente"). Consultas: 3 hoje, 4 amanhã,
 * 3 nos próximos dias e 2 já realizadas. Status: 7 pendentes, 2 em análise,
 * 3 concluídas.
 */
const seeds: Seed[] = [
  {
    nome: 'Ana Exemplo',
    nascimento: '2001-04-12',
    cpfBase: '111444777',
    answers: { ...sc('urgente-dor'), alergia: 'sim', alergia_quais: 'Dipirona', cirurgia: 'sim', cirurgia_qual: 'Apendicectomia, 2019' },
    dia: 0, hora: [14, 30], enviadaHa: 2, status: 'pendente', aberta: false,
  },
  {
    nome: 'Beatriz Modelo',
    nascimento: '1997-09-03',
    cpfBase: '222555888',
    answers: sc('atencao-nodulo'),
    dia: 0, hora: [16, 0], enviadaHa: 5, status: 'pendente', aberta: false,
  },
  {
    nome: 'Camila Teste',
    nascimento: '1999-01-21',
    cpfBase: '333666999',
    answers: { ...sc('rotina'), metodos: ['diu_hormonal'], nome_preferido: 'Cami' },
    dia: 0, hora: [17, 30], enviadaHa: 20, status: 'em_analise', aberta: true,
  },
  {
    nome: 'Daniela Amostra',
    nascimento: '2003-06-30',
    cpfBase: '444777111',
    answers: sc('urgente-gestacao'),
    dia: 1, hora: [9, 0], enviadaHa: 1, status: 'pendente', aberta: false,
  },
  {
    nome: 'Elisa Fictícia',
    nascimento: '2000-11-08',
    cpfBase: '555888222',
    answers: {
      ...sc('rotina'),
      metodos: ['preservativo'],
      motivo: 'atraso',
      sintomas: ['atraso'],
      atraso_tempo: 'mais_45',
      duracao: '1_6_meses',
      dum: 'nao_lembro',
      ansiedade: 4,
    },
    dia: 1, hora: [10, 30], enviadaHa: 9, status: 'pendente', aberta: false,
  },
  {
    nome: 'Fernanda Ensaio',
    nascimento: '1996-02-17',
    cpfBase: '666999333',
    answers: { ...sc('rotina'), motivo: 'receita', medicamentos: 'Anticoncepcional oral' },
    dia: 1, hora: [14, 0], enviadaHa: 26, status: 'pendente', aberta: true,
  },
  {
    nome: 'Gabriela Piloto',
    nascimento: '2004-08-25',
    cpfBase: '777111444',
    answers: sc('pessoalmente'),
    dia: 1, hora: [15, 30], enviadaHa: 30, status: 'em_analise', aberta: true,
  },
  {
    nome: 'Heloísa Protótipo',
    nascimento: '1998-12-02',
    cpfBase: '888222555',
    answers: sc('apoio-violencia'),
    dia: 3, hora: [11, 0], enviadaHa: 3, status: 'pendente', aberta: false,
  },
  {
    nome: 'Isabela Simulada',
    nascimento: '2002-03-14',
    cpfBase: '999333666',
    answers: { ...sc('rotina'), motivo: 'duvidas', ist: 'sim', metodos: ['nenhum'], ansiedade: 4, preocupacoes: ['julgada'] },
    dia: 2, hora: [9, 30], enviadaHa: 14, status: 'pendente', aberta: false,
  },
  {
    nome: 'Júlia Rascunho',
    nascimento: '1995-07-19',
    cpfBase: '123456789',
    answers: { ...sc('rotina'), motivo: 'duvidas', violencia: 'passado', [IN_PERSON_KEY]: [] },
    dia: 4, hora: [15, 0], enviadaHa: 50, status: 'concluido', aberta: true,
  },
  {
    nome: 'Larissa Esboço',
    nascimento: '1994-10-05',
    cpfBase: '987654321',
    answers: { ...sc('rotina'), metodos: ['implante'] },
    dia: -1, hora: [10, 0], enviadaHa: 60, status: 'concluido', aberta: true,
  },
  {
    nome: 'Marina Protocolo',
    nascimento: '2005-05-27',
    cpfBase: '135792468',
    answers: { ...sc('rotina'), motivo: 'receita', primeira_consulta: 'sim', ansiedade: 3 },
    dia: -2, hora: [16, 30], enviadaHa: 80, status: 'concluido', aberta: true,
  },
];

export function buildTriages(now: Date): Triage[] {
  return seeds.map((s, i) => {
    const cpf = makeCpf(s.cpfBase);
    const enviadaEm = hoursAgo(now, s.enviadaHa);
    return {
      id: `t${i + 1}`,
      paciente: { nome: s.nome, nascimento: s.nascimento, cpf, telefone: `(11) 9${i}000-00${String(10 + i)}` },
      answers: {
        ...s.answers,
        // Identificação coerente com o cadastro desta paciente fictícia.
        nome: s.nome,
        nascimento: isoToBr(s.nascimento),
        nome_preferido: s.answers.nome_preferido === 'Cami' ? 'Cami' : undefined,
        telefone: `(11) 9${i}000-00${String(10 + i)}`,
        cpf,
        dum: s.answers.dum === 'nao_lembro' ? 'nao_lembro' : fmtDate(atDay(now, -14 - i, 0)),
      },
      consulta: atDay(now, s.dia, s.hora[0], s.hora[1]),
      profissional: invite.profissional,
      enviadaEm,
      status: s.status,
      aberta: s.aberta,
      timeline: [
        { evento: 'Convite enviado', quando: hoursAgo(enviadaEm, 20) },
        { evento: 'Questionário aberto', quando: hoursAgo(enviadaEm, 0.3) },
        { evento: 'Respondido', quando: enviadaEm },
      ],
    };
  });
}

/** Triagem inserida por "Chegou uma triagem urgente". */
export function buildUrgentTriage(now: Date, n: number): Triage {
  const cpf = makeCpf('246813579');
  return {
    id: `urgente-${n}`,
    paciente: { nome: 'Natália Simulação', nascimento: '2000-02-09', cpf, telefone: '(11) 90000-0099' },
    answers: {
      ...sc('urgente-dor'),
      nome: 'Natália Simulação',
      nascimento: '09/02/2000',
      nome_preferido: undefined,
      telefone: '(11) 90000-0099',
      cpf,
      sintomas: ['dor_baixa', 'sangramento', 'febre'],
      dor_intensidade: 8,
      sangramento_volume: 'muito',
      febre_temp: '38_mais',
      dum: fmtDate(atDay(now, -9, 0)),
    },
    consulta: atDay(now, 1, 8, 30),
    profissional: invite.profissional,
    enviadaEm: now,
    status: 'pendente',
    aberta: false,
    destaque: true,
    timeline: [
      { evento: 'Convite enviado', quando: hoursAgo(now, 6) },
      { evento: 'Questionário aberto', quando: hoursAgo(now, 0.2) },
      { evento: 'Respondido', quando: now },
    ],
  };
}

/** Triagem vinda da jornada da paciente, na mesma sessão do navegador. */
export function buildPatientTriage(now: Date, answers: Answers, n: number): Triage {
  const consulta = atDay(now, ((4 - now.getDay() + 7) % 7) || 7, 14, 30); // próxima quinta-feira
  return {
    id: `paciente-${n}`,
    paciente: {
      nome: invite.paciente.nome,
      nascimento: invite.paciente.nascimento,
      cpf: typeof answers.cpf === 'string' && answers.cpf ? answers.cpf : invite.cpfDeTeste,
      telefone: typeof answers.telefone === 'string' && answers.telefone ? answers.telefone : 'não informado',
    },
    answers: { ...answers },
    consulta,
    profissional: invite.profissional,
    enviadaEm: now,
    status: 'pendente',
    aberta: false,
    destaque: true,
    timeline: [
      { evento: 'Convite enviado', quando: hoursAgo(now, 1) },
      { evento: 'Questionário aberto', quando: hoursAgo(now, 0.15) },
      { evento: 'Respondido', quando: now },
    ],
  };
}

// ---------------------------------------------------------------------------
// Convites
// ---------------------------------------------------------------------------
export type InviteStatus = 'enviado' | 'aberto' | 'respondido' | 'expirado' | 'revogado';
export const inviteStatusLabel: Record<InviteStatus, string> = {
  enviado: 'Enviado',
  aberto: 'Aberto',
  respondido: 'Respondido',
  expirado: 'Expirado',
  revogado: 'Revogado',
};

export interface Invite {
  id: string;
  paciente: string;
  consulta: Date;
  criadoPor: string;
  criadoEm: Date;
  expiraEm: Date;
  status: InviteStatus;
}

export function buildInvites(now: Date, triages: Triage[]): Invite[] {
  const h = (n: number) => hoursAgo(now, n);
  // 12 respondidos (os das triagens) + 4 com os outros status = 16.
  const respondidos: Invite[] = triages.map((t, i) => ({
    id: `c${i + 1}`,
    paciente: t.paciente.nome,
    consulta: t.consulta,
    criadoPor: i % 3 === 0 ? users.medico.nome : users.recepcao.nome,
    criadoEm: t.timeline[0].quando,
    expiraEm: new Date(t.timeline[0].quando.getTime() + 72 * 3600_000),
    status: 'respondido',
  }));
  const outros: [string, number, number, InviteStatus][] = [
    ['Olívia Cenário', 2, 3, 'enviado'],
    ['Paula Hipótese', 3, 10, 'aberto'],
    ['Rita Suposição', 5, 100, 'expirado'],
    ['Sofia Conjectura', 6, 30, 'revogado'],
  ];
  return [
    ...outros.map(([paciente, dia, criadoHa, status], i) => ({
      id: `c${13 + i}`,
      paciente,
      consulta: atDay(now, dia, 9 + i, 0),
      criadoPor: users.recepcao.nome,
      criadoEm: h(criadoHa),
      expiraEm: new Date(h(criadoHa).getTime() + 72 * 3600_000),
      status,
    })),
    ...respondidos,
  ];
}

// ---------------------------------------------------------------------------
// Registro de acessos
// ---------------------------------------------------------------------------
export type Acao =
  | 'Visualizou triagem'
  | 'Revelou CPF'
  | 'Abriu relatório'
  | 'Alterou status'
  | 'Criou convite'
  | 'Revogou convite';

export const acoes: Acao[] = [
  'Visualizou triagem',
  'Revelou CPF',
  'Abriu relatório',
  'Alterou status',
  'Criou convite',
  'Revogou convite',
];

export interface AccessEntry {
  id: string;
  quando: Date;
  usuario: string;
  papel: Role;
  acao: Acao;
  paciente: string;
}

export function buildAccessLog(now: Date, triages: Triage[]): AccessEntry[] {
  const nome = (i: number) => partialName(triages[i % triages.length].paciente.nome);
  const linhas: [number, Role, Acao, number][] = [
    [1, 'medico', 'Visualizou triagem', 2],
    [1.1, 'medico', 'Abriu relatório', 2],
    [3, 'recepcao', 'Criou convite', 0],
    [5, 'medico', 'Visualizou triagem', 5],
    [5.2, 'medico', 'Alterou status', 5],
    [8, 'admin', 'Visualizou triagem', 6],
    [9, 'recepcao', 'Criou convite', 1],
    [20, 'medico', 'Visualizou triagem', 6],
    [20.1, 'medico', 'Revelou CPF', 6],
    [20.3, 'medico', 'Alterou status', 6],
    [26, 'recepcao', 'Revogou convite', 8],
    [28, 'recepcao', 'Criou convite', 3],
    [30, 'medico', 'Visualizou triagem', 9],
    [30.2, 'medico', 'Abriu relatório', 9],
    [30.5, 'medico', 'Alterou status', 9],
    [50, 'admin', 'Visualizou triagem', 10],
    [52, 'medico', 'Visualizou triagem', 10],
    [52.4, 'medico', 'Alterou status', 10],
    [75, 'medico', 'Visualizou triagem', 11],
    [75.5, 'medico', 'Alterou status', 11],
  ];
  return linhas.map(([ha, papel, acao, i], n) => ({
    id: `a${n + 1}`,
    quando: hoursAgo(now, ha),
    usuario: users[papel].nome,
    papel,
    acao,
    paciente: nome(i),
  }));
}

export { evaluate };
