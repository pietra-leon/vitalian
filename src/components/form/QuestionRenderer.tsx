// Renderizador genérico: lê uma pergunta de questionnaire.ts e desenha os
// campos. Não conhece nenhuma pergunta específica.
import type { Value } from '@/mock/conditions';
import {
  type Field,
  type Question,
  isInPerson,
  maskPhone,
  offersInPerson,
  fieldIds,
  visibleFields,
} from '@/mock/questionnaire';
import { useJourney } from '@/state/JourneyContext';
import { CpfInput } from './CpfInput';
import { DateMaskedInput } from './DateMaskedInput';
import { FieldMessage } from './FieldMessage';
import { LongText } from './LongText';
import { OptionCard } from './OptionCard';
import { PainSlider } from './PainSlider';
import { PreferInPerson } from './PreferInPerson';
import { ScaleInput } from './ScaleInput';
import { SensitiveNote } from './SensitiveNote';
import { TextField } from './TextField';

interface Props {
  question: Question;
  /** id do título da pergunta, para rotular grupos sem rótulo próprio. */
  titleId: string;
  errors: Record<string, string>;
  onEnter: () => void;
}

export function QuestionRenderer({ question, titleId, errors, onEnter }: Props) {
  const { answers, setAnswer, setInPerson } = useJourney();
  const inPerson = isInPerson(answers, question.id);
  const fields = visibleFields(question, answers);
  const noteId = `${question.id}-sensivel`;

  // Responder qualquer campo desfaz o "Prefiro conversar pessoalmente".
  const set = (fieldId: string, v: Value | undefined) => {
    if (inPerson) setInPerson(question.id, false, []);
    setAnswer(fieldId, v);
  };

  return (
    <div className="space-y-8">
      {fields.map((f) => (
        <FieldView
          key={f.id}
          field={f}
          single={fields.length === 1}
          titleId={titleId}
          value={answers[f.id]}
          error={errors[f.id]}
          set={(v) => set(f.id, v)}
          onEnter={onEnter}
        />
      ))}
      {offersInPerson(question) ? (
        <PreferInPerson
          questionId={question.id}
          checked={inPerson}
          onChange={(on) => setInPerson(question.id, on, fieldIds(question))}
        />
      ) : null}
      {question.sensitive ? <SensitiveNote id={noteId} /> : null}
    </div>
  );
}

interface FieldProps {
  field: Field;
  /** Único campo da pergunta: o título da pergunta já serve de rótulo. */
  single: boolean;
  titleId: string;
  value: Value | undefined;
  error?: string;
  set: (v: Value | undefined) => void;
  onEnter: () => void;
}

function FieldView({ field: f, single, titleId, value, error, set, onEnter }: FieldProps) {
  const id = `campo-${f.id}`;
  const label = f.label ?? '';
  const str = typeof value === 'string' ? value : '';
  const groupLabelId = f.label ? `${id}-rotulo` : titleId;
  const errId = `${id}-erro`;

  switch (f.type) {
    case 'readonly':
      return <TextField id={id} label={label} value={f.readonlyValue ?? ''} onChange={() => {}} readOnly help={f.help} />;

    case 'text':
      return (
        <TextField
          id={id}
          label={label}
          value={str}
          onChange={(v) => set(v)}
          help={f.help}
          error={error}
          maxLength={f.maxLength}
          onEnter={onEnter}
        />
      );

    case 'phone':
      return (
        <TextField
          id={id}
          label={label}
          value={str}
          onChange={(v) => set(v)}
          mask={maskPhone}
          inputMode="tel"
          placeholder="(00) 00000-0000"
          help={f.help}
          error={error}
          onEnter={onEnter}
        />
      );

    case 'cpf':
      return <CpfInput id={id} label={label} value={str} onChange={(v) => set(v)} error={error} onEnter={onEnter} />;

    case 'longtext':
      return (
        <LongText id={id} label={label} hideLabel={single} value={str} onChange={(v) => set(v)} maxLength={f.maxLength ?? 600} />
      );

    case 'date': {
      const alt = f.alternatives?.find((o) => o.value === str);
      return (
        <div className="space-y-3">
          <DateMaskedInput
            id={id}
            label={label}
            hideLabel={single}
            value={alt ? '' : str}
            onChange={(v) => set(v)}
            help={f.help}
            error={error}
            onEnter={onEnter}
          />
          {f.alternatives?.map((o) => (
            <OptionCard
              key={o.value}
              type="checkbox"
              name={`${id}-${o.value}`}
              label={o.label}
              checked={str === o.value}
              onChange={(on) => set(on ? o.value : undefined)}
            />
          ))}
        </div>
      );
    }

    case 'single':
      return (
        <div role="radiogroup" aria-labelledby={groupLabelId} aria-describedby={errId}>
          {f.label ? (
            <p id={groupLabelId} className="mb-3 text-base font-semibold text-verde-profundo">
              {f.label}
            </p>
          ) : null}
          <div className="space-y-3">
            {f.options?.map((o) => (
              <OptionCard
                key={o.value}
                type="radio"
                name={id}
                label={o.label}
                checked={value === o.value}
                onChange={() => set(o.value)}
              />
            ))}
          </div>
          <FieldMessage id={errId} message={error} />
        </div>
      );

    case 'multi': {
      const list = Array.isArray(value) ? value : [];
      const toggle = (v: string, on: boolean, exclusive?: boolean) => {
        if (!on) return set(list.filter((x) => x !== v));
        if (exclusive) return set([v]);
        const exclusives = f.options?.filter((o) => o.exclusive).map((o) => o.value) ?? [];
        set([...list.filter((x) => !exclusives.includes(x)), v]);
      };
      return (
        <div role="group" aria-labelledby={groupLabelId} aria-describedby={errId}>
          <div className="space-y-3">
            {f.options?.map((o) => (
              <OptionCard
                key={o.value}
                type="checkbox"
                name={`${id}-${o.value}`}
                label={o.label}
                checked={list.includes(o.value)}
                onChange={(on) => toggle(o.value, on, o.exclusive)}
              />
            ))}
          </div>
          <FieldMessage id={errId} message={error} />
        </div>
      );
    }

    case 'scale':
      return (
        <div>
          <ScaleInput
            name={id}
            labelledBy={groupLabelId}
            value={typeof value === 'number' ? value : undefined}
            onChange={(v) => set(v)}
            minLabel={f.minLabel ?? ''}
            maxLabel={f.maxLabel ?? ''}
          />
          <FieldMessage id={errId} message={error} />
        </div>
      );

    case 'slider':
      return (
        <div>
          <PainSlider
            id={id}
            label={label}
            value={typeof value === 'number' ? value : undefined}
            onChange={(v) => set(v)}
            minLabel={f.minLabel ?? ''}
            maxLabel={f.maxLabel ?? ''}
            describedBy={errId}
          />
          <FieldMessage id={errId} message={error} />
        </div>
      );
  }
}
