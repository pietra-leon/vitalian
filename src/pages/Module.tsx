import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router';
import { Btn } from '@/components/form/Btn';
import { QuestionRenderer } from '@/components/form/QuestionRenderer';
import { ModuleIntro } from '@/components/flow/ModuleIntro';
import { SegmentedProgress } from '@/components/flow/SegmentedProgress';
import { StepLayout } from '@/components/flow/StepLayout';
import {
  canSkip,
  fieldIds,
  getModule,
  modules,
  questionProblems,
  visibleQuestions,
} from '@/mock/questionnaire';
import { useJourney } from '@/state/JourneyContext';
import NotFound from './NotFound';

const REVISAO = '/triagem/demo/revisao';
const rota = (n: number, p?: string, editar?: boolean) =>
  `/triagem/demo/modulo/${n}${p ? `?p=${p}${editar ? '&editar=1' : ''}` : ''}`;

/** Um módulo do questionário: tela de abertura e, depois, uma pergunta por tela. */
export default function Module() {
  const n = Number(useParams().n);
  const [search] = useSearchParams();
  const p = search.get('p');
  const editing = search.get('editar') === '1';
  const { answers, clearFields } = useJourney();
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const dir = useRef(1);
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => setShowErrors(false), [n, p]);

  const module = getModule(n);
  if (!module) return <NotFound />;

  const visible = visibleQuestions(module, answers);
  const idx = p ? visible.findIndex((q) => q.id === p) : -1;
  // Pergunta que deixou de existir (a condição mudou): volta para a abertura.
  if (p && idx === -1) return <Navigate to={rota(n)} replace />;

  const go = (to: string, direction: 1 | -1) => {
    dir.current = direction;
    navigate(to);
  };

  const slide = (key: string, children: React.ReactNode) => (
    <motion.div
      key={key}
      initial={reduce ? false : { opacity: 0, x: 28 * dir.current }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );

  // ---- Tela de abertura do módulo ----
  if (idx === -1) {
    const prev = getModule(n - 1);
    const prevLast = prev ? visibleQuestions(prev, answers).at(-1) : undefined;
    return (
      <StepLayout
        title={`Módulo ${n} de ${modules.length}: ${module.title}`}
        focusKey={`m${n}`}
        top={<SegmentedProgress current={n} fraction={0} />}
        actions={
          <>
            {prev && prevLast ? (
              <Btn variante="texto" onClick={() => go(rota(n - 1, prevLast.id), -1)}>
                Voltar
              </Btn>
            ) : null}
            <Btn className="flex-1" onClick={() => go(rota(n, visible[0].id), 1)}>
              {n === 1 ? 'Vamos lá' : 'Continuar'}
            </Btn>
          </>
        }
      >
        {slide(`m${n}`, <ModuleIntro module={module} />)}
      </StepLayout>
    );
  }

  // ---- Uma pergunta ----
  const question = visible[idx];
  const titleId = `pergunta-${question.id}`;
  const problems = questionProblems(question, answers);
  const errors = showErrors ? problems : {};

  const advance = () => {
    // Recalcula com as respostas atuais: a resposta pode ter aberto perguntas novas.
    const now = visibleQuestions(module, answers);
    const rest = now.slice(now.findIndex((q) => q.id === question.id) + 1);
    if (editing) {
      // Ao editar, só passa pelas perguntas condicionais que ficaram sem resposta.
      const pending = rest.find((q) => q.showIf && Object.keys(questionProblems(q, answers)).length > 0);
      return go(pending ? rota(n, pending.id, true) : REVISAO, 1);
    }
    if (rest[0]) return go(rota(n, rest[0].id), 1);
    go(n < modules.length ? rota(n + 1) : REVISAO, 1);
  };

  const onContinue = () => {
    if (Object.keys(problems).length > 0) return setShowErrors(true);
    advance();
  };

  const onSkip = () => {
    clearFields(fieldIds(question), question.id);
    advance();
  };

  const onBack = () => {
    if (editing) return go(REVISAO, -1);
    go(idx > 0 ? rota(n, visible[idx - 1].id) : rota(n), -1);
  };

  return (
    <StepLayout
      title={question.title}
      kind="pergunta"
      titleId={titleId}
      focusKey={question.id}
      top={<SegmentedProgress current={n} fraction={(idx + 1) / (visible.length + 1)} />}
      actions={
        <>
          <Btn variante="texto" onClick={onBack}>
            Voltar
          </Btn>
          {canSkip(question) ? (
            <Btn variante="texto" onClick={onSkip}>
              Pular
            </Btn>
          ) : null}
          <Btn className="flex-1" onClick={onContinue}>
            {editing ? 'Salvar' : 'Continuar'}
          </Btn>
        </>
      }
    >
      {slide(
        question.id,
        <>
          {question.help ? <p className="mt-2 text-base leading-relaxed text-texto-2">{question.help}</p> : null}
          <div className="mt-6">
            <QuestionRenderer question={question} titleId={titleId} errors={errors} onEnter={onContinue} />
          </div>
        </>,
      )}
    </StepLayout>
  );
}
