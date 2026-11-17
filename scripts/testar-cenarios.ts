// Confere, sem navegador, que cada cenário pronto está completo e leva ao
// resultado esperado, e exercita os casos-limite das regras de triagem.
// Rode com: npm run test:cenarios
import type { Answers } from '../src/mock/conditions';
import { evaluate } from '../src/mock/flags';
import { isValidCpf, modules, questionProblems, visibleQuestions } from '../src/mock/questionnaire';
import { scenarios } from '../src/mock/scenarios';
import { buildAccessLog, buildInvites, buildTriages, categoriaOf } from '../src/mock/clinic';
import { dayDiff } from '../src/lib/dates';
import { buildSummary } from '../src/lib/summary';
import { isValidCpf as cpfOk } from '../src/mock/questionnaire';

let falhas = 0;
const confere = (ok: boolean, nome: string) => {
  console.log(`${ok ? 'ok  ' : 'FALHOU'}  ${nome}`);
  if (!ok) falhas++;
};

for (const s of scenarios) {
  const r = evaluate(s.answers);
  const pendentes = modules.flatMap((m) =>
    visibleQuestions(m, s.answers).filter((q) => Object.keys(questionProblems(q, s.answers)).length > 0),
  );
  confere(
    r.nivel === s.esperado.nivel && r.apoio === s.esperado.apoio && pendentes.length === 0,
    `${s.nome} -> ${r.nivel}${r.apoio ? ' + apoio' : ''}` +
      (pendentes.length ? ` (perguntas pendentes: ${pendentes.map((q) => q.id).join(', ')})` : ''),
  );
}

const base = scenarios[0].answers;
const caso = (nome: string, extra: Answers, nivel: string, apoio = false) => {
  const r = evaluate({ ...base, ...extra });
  confere(r.nivel === nivel && r.apoio === apoio, `${nome} -> ${r.nivel}${r.apoio ? ' + apoio' : ''}`);
};

caso('dor 7, há dias', { sintomas: ['dor_baixa'], dor_intensidade: 7, dor_inicio: 'dias' }, 'rotina');
caso('dor 8, há dias', { sintomas: ['dor_baixa'], dor_intensidade: 8, dor_inicio: 'dias' }, 'urgente');
caso('dor 3, de repente', { sintomas: ['dor_baixa'], dor_intensidade: 3, dor_inicio: 'de_repente' }, 'urgente');
caso('sangramento muito', { sintomas: ['sangramento'], sangramento_volume: 'muito' }, 'urgente');
caso('sangramento pouco', { sintomas: ['sangramento'], sangramento_volume: 'pouco' }, 'rotina');
caso('febre 38+ sozinha', { sintomas: ['febre'], febre_temp: '38_mais' }, 'rotina');
caso('febre 38+ com corrimento', { sintomas: ['febre', 'corrimento'], febre_temp: '38_mais' }, 'urgente');
caso('febre baixa com corrimento', { sintomas: ['febre', 'corrimento'], febre_temp: 'ate_37_9' }, 'rotina');
caso('talvez grávida, sem sintomas', { gravidez: 'talvez' }, 'rotina');
caso('talvez grávida com dor leve', { gravidez: 'talvez', sintomas: ['dor_baixa'], dor_intensidade: 2, dor_inicio: 'dias' }, 'urgente');
caso('IST sim', { ist: 'sim' }, 'atencao');
caso('feridas', { sintomas: ['feridas'] }, 'atencao');
caso('atraso +45 com pílula', { sintomas: ['atraso'], atraso_tempo: 'mais_45' }, 'rotina');
caso('atraso +45 só preservativo', { sintomas: ['atraso'], atraso_tempo: 'mais_45', metodos: ['preservativo'] }, 'atencao');
caso('atraso +45 sem método', { sintomas: ['atraso'], atraso_tempo: 'mais_45', metodos: ['nenhum'] }, 'atencao');
caso('atraso 15-45 sem método', { sintomas: ['atraso'], atraso_tempo: '15_45', metodos: ['nenhum'] }, 'rotina');
caso('violência no passado', { violencia: 'passado' }, 'rotina');

const passado = evaluate({ ...base, violencia: 'passado' });
confere(passado.topicos.length === 1, 'violência no passado vira tópico a abordar');
const pessoalmente = evaluate(scenarios.find((s) => s.id === 'pessoalmente')!.answers);
confere(
  pessoalmente.regras.length === 0 && pessoalmente.topicos.length === 7,
  '"Prefiro conversar pessoalmente" não aciona regra e vira 7 tópicos',
);
confere(isValidCpf('529.982.247-25'), 'CPF de teste é válido');
confere(!isValidCpf('529.982.247-26') && !isValidCpf('111.111.111-11'), 'CPFs inválidos são recusados');

// ---- Área do médico: os dados fictícios batem com o combinado? ----
const agora = new Date();
const tri = buildTriages(agora);
const conta = <T,>(xs: T[], f: (x: T) => string) =>
  xs.reduce<Record<string, number>>((m, x) => ((m[f(x)] = (m[f(x)] ?? 0) + 1), m), {});
const niveis = conta(tri, (t) => evaluate(t.answers).nivel);
confere(tri.length === 12 && niveis.urgente === 3 && niveis.atencao === 3 && niveis.rotina === 6, `12 triagens: ${JSON.stringify(niveis)}`);
const st = conta(tri, (t) => t.status);
confere(st.pendente === 7 && st.em_analise === 2 && st.concluido === 3, `status: ${JSON.stringify(st)}`);
const dias = conta(tri, (t) => {
  const d = dayDiff(t.consulta, agora);
  return d < 0 ? 'realizadas' : d === 0 ? 'hoje' : d === 1 ? 'amanha' : 'semana';
});
confere(dias.hoje === 3 && dias.amanha === 4 && dias.semana === 3 && dias.realizadas === 2, `consultas: ${JSON.stringify(dias)}`);
const hoje = tri.filter((t) => dayDiff(t.consulta, agora) === 0).map((t) => evaluate(t.answers).nivel).sort().join(',');
confere(hoje === 'atencao,rotina,urgente', `hoje: 1 urgente, 1 atenção, 1 rotina (${hoje})`);
confere(tri.every((t) => cpfOk(t.paciente.cpf)), 'CPFs fictícios das triagens são válidos');
confere(tri.every((t) => modules.every((m) => visibleQuestions(m, t.answers).every((q) => Object.keys(questionProblems(q, t.answers)).length === 0))), 'respostas das 12 triagens estão completas');
const cats = conta(tri, (t) => categoriaOf(t.answers, evaluate(t.answers)));
confere(cats.rotina > 0 && cats.emergencia > 0 && cats.gestacao > 0, `categorias: ${JSON.stringify(cats)}`);
// O nível vem de evaluate(): mudar uma resposta muda o nível.
const ana = tri[0];
confere(
  evaluate(ana.answers).nivel === 'urgente' && evaluate({ ...ana.answers, dor_intensidade: 4, dor_inicio: 'dias' }).nivel === 'rotina',
  'alterar uma resposta de cenário altera o nível',
);
const resumo = buildSummary(ana.answers, 25);
confere(resumo.length >= 5 && resumo.length <= 8, `resumo com ${resumo.length} linhas`);
const conv = buildInvites(agora, tri);
confere(conv.length === 16 && Object.keys(conta(conv, (c) => c.status)).length === 5, '16 convites com os 5 status');
confere(buildAccessLog(agora, tri).length === 20, '20 linhas no registro de acessos');

console.log(falhas === 0 ? '\nTudo certo.' : `\n${falhas} verificação(ões) falharam.`);
process.exit(falhas === 0 ? 0 : 1);
