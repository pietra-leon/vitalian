// Condições descritas como DADOS. O mesmo formato serve para decidir se uma
// pergunta aparece (`showIf`, em questionnaire.ts) e para as regras de
// triagem (flags.ts). Assim os dois motores são genéricos.

export type Value = string | string[] | number;

/** Respostas em memória: id do campo -> valor. */
export type Answers = Record<string, Value | undefined>;

export type Condition =
  | { field: string; equals: string }
  | { field: string; in: string[] }
  | { field: string; includes: string }
  | { field: string; includesAny: string[] }
  | { field: string; gte: number }
  | { field: string; answered: true }
  | { all: Condition[] }
  | { any: Condition[] }
  | { not: Condition };

export function isAnswered(v: Value | undefined): v is Value {
  if (v === undefined) return false;
  if (typeof v === 'number') return true;
  return v.length > 0;
}

export function matches(c: Condition, a: Answers): boolean {
  if ('all' in c) return c.all.every((x) => matches(x, a));
  if ('any' in c) return c.any.some((x) => matches(x, a));
  if ('not' in c) return !matches(c.not, a);
  const v = a[c.field];
  if ('equals' in c) return v === c.equals;
  if ('in' in c) return typeof v === 'string' && c.in.includes(v);
  if ('includes' in c) return Array.isArray(v) && v.includes(c.includes);
  if ('includesAny' in c) return Array.isArray(v) && c.includesAny.some((x) => v.includes(x));
  if ('gte' in c) return typeof v === 'number' && v >= c.gte;
  return isAnswered(v);
}
