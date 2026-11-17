// Datas em português do Brasil, sempre relativas a "agora" para a
// demonstração parecer atual.
const DIA = 24 * 60 * 60 * 1000;

const p2 = (n: number) => String(n).padStart(2, '0');

export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

/** Diferença em dias de calendário (0 = hoje, 1 = amanhã, -1 = ontem). */
export function dayDiff(d: Date, now: Date): number {
  return Math.round((startOfDay(d).getTime() - startOfDay(now).getTime()) / DIA);
}

/** Dia relativo a agora, numa hora fixa. */
export function atDay(now: Date, days: number, hour: number, minute = 0): Date {
  const d = startOfDay(now);
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d;
}

export const hoursAgo = (now: Date, h: number) => new Date(now.getTime() - h * 60 * 60 * 1000);

export const fmtTime = (d: Date) => `${p2(d.getHours())}:${p2(d.getMinutes())}`;
export const fmtDate = (d: Date) => `${p2(d.getDate())}/${p2(d.getMonth() + 1)}/${d.getFullYear()}`;
export const fmtDateTime = (d: Date) => `${fmtDate(d)} ${fmtTime(d)}`;

const semana = ['dom.', 'seg.', 'ter.', 'qua.', 'qui.', 'sex.', 'sáb.'];

/** "Hoje, 14:30", "Amanhã, 09:00", "qui., 19/11, 10:00". */
export function fmtConsulta(d: Date, now: Date): string {
  const diff = dayDiff(d, now);
  const dia =
    diff === 0
      ? 'Hoje'
      : diff === 1
        ? 'Amanhã'
        : diff === -1
          ? 'Ontem'
          : `${semana[d.getDay()]}, ${p2(d.getDate())}/${p2(d.getMonth() + 1)}`;
  return `${dia}, ${fmtTime(d)}`;
}

/** "há 2 h", "há 3 dias", "agora". */
export function fmtAgo(d: Date, now: Date): string {
  const min = Math.max(0, Math.round((now.getTime() - d.getTime()) / 60000));
  if (min < 1) return 'agora';
  if (min < 60) return `há ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `há ${h} h`;
  const dias = Math.round(h / 24);
  return `há ${dias} ${dias === 1 ? 'dia' : 'dias'}`;
}

/** "em 2 dias", "em 5 h", "expirou". */
export function fmtIn(d: Date, now: Date): string {
  const min = Math.round((d.getTime() - now.getTime()) / 60000);
  if (min <= 0) return 'expirou';
  if (min < 60) return `em ${min} min`;
  const h = Math.round(min / 60);
  if (h < 48) return `em ${h} h`;
  return `em ${Math.round(h / 24)} dias`;
}

/** "segunda-feira, 16 de novembro de 2026". */
export function fmtLong(d: Date): string {
  return new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(d);
}

export function isoToBr(iso: string): string {
  const [a, m, d] = iso.split('-');
  return `${d}/${m}/${a}`;
}

export function ageFrom(iso: string, now: Date): number {
  const [a, m, d] = iso.split('-').map(Number);
  let age = now.getFullYear() - a;
  if (now.getMonth() + 1 < m || (now.getMonth() + 1 === m && now.getDate() < d)) age--;
  return age;
}
