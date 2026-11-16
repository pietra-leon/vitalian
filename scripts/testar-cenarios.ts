// Confere, sem navegador, que cada cenário pronto está completo e leva ao
// resultado esperado, e exercita os casos-limite das regras de triagem.
// Rode com: npm run test:cenarios
import type { Answers } from '../src/mock/conditions';
import { evaluate } from '../src/mock/flags';
import { isValidCpf, modules, questionProblems, visibleQuestions } from '../src/mock/questionnaire';
import { scenarios } from '../src/mock/scenarios';

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

console.log(falhas === 0 ? '\nTudo certo.' : `\n${falhas} verificação(ões) falharam.`);
process.exit(falhas === 0 ? 0 : 1);
