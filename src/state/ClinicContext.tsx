// Estado da área do médico: vive SOMENTE em memória. Recarregar a página
// reinicia tudo. Nenhuma rede, nenhum armazenamento do navegador.
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { Answers } from '@/mock/conditions';
import {
  type AccessEntry,
  type Acao,
  type Invite,
  type Role,
  type Status,
  type Triage,
  type User,
  buildAccessLog,
  buildInvites,
  buildPatientTriage,
  buildTriages,
  buildUrgentTriage,
  partialName,
  users,
} from '@/mock/clinic';

export interface Note {
  id: string;
  quando: Date;
  origem: string;
  tipo: string;
  comentario: string;
  porque?: string;
}

export interface Toast {
  id: string;
  texto: string;
  /** Urgente: persistente, com botão "Abrir". */
  triageId?: string;
  nome?: string;
}

interface Sim {
  loading: boolean;
  error: boolean;
  empty: boolean;
}

interface State {
  now: Date;
  user: User | null;
  triages: Triage[];
  invites: Invite[];
  access: AccessEntry[];
  notes: Note[];
  toasts: Toast[];
  sim: Sim;
  hideNames: boolean;
  search: string;
  notesOpen: boolean;
}

function fresh(): State {
  const now = new Date();
  const triages = buildTriages(now);
  return {
    now,
    user: null,
    triages,
    invites: buildInvites(now, triages),
    access: buildAccessLog(now, triages),
    notes: [],
    toasts: [],
    sim: { loading: false, error: false, empty: false },
    hideNames: false,
    search: '',
    notesOpen: false,
  };
}

interface Clinic extends State {
  login: (role: Role) => void;
  logout: () => void;
  /** Abre uma triagem: marca como vista e registra o acesso. */
  viewTriage: (id: string) => void;
  log: (acao: Acao, pacienteNome: string) => void;
  setStatus: (id: string, status: Status) => void;
  createInvite: (dados: { paciente: string; consulta: Date }) => void;
  revokeInvite: (id: string) => void;
  renewInvite: (id: string) => void;
  addNote: (n: Omit<Note, 'id' | 'quando'>) => void;
  deleteNote: (id: string) => void;
  toast: (texto: string) => void;
  dismissToast: (id: string) => void;
  simulateUrgent: () => void;
  simulateLoading: () => void;
  setSim: (p: Partial<Sim>) => void;
  setHideNames: (v: boolean) => void;
  setSearch: (v: string) => void;
  setNotesOpen: (v: boolean) => void;
  /** Integração: a paciente concluiu a jornada nesta mesma sessão. */
  receiveFromPatient: (answers: Answers) => void;
  reset: () => void;
}

const Ctx = createContext<Clinic | null>(null);
let seq = 0;
const uid = (p: string) => `${p}-${++seq}`;

export function ClinicProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<State>(fresh);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);
  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));

  const dismissToast = useCallback(
    (id: string) => setS((x) => ({ ...x, toasts: x.toasts.filter((t) => t.id !== id) })),
    [],
  );

  const toast = useCallback(
    (texto: string) => {
      const id = uid('toast');
      setS((x) => ({ ...x, toasts: [...x.toasts, { id, texto }] }));
      later(() => dismissToast(id), 4500);
    },
    [dismissToast],
  );

  const log = useCallback((acao: Acao, pacienteNome: string) => {
    setS((x) =>
      x.user
        ? {
            ...x,
            access: [
              {
                id: uid('a'),
                quando: new Date(),
                usuario: x.user.nome,
                papel: x.user.papel,
                acao,
                paciente: partialName(pacienteNome),
              },
              ...x.access,
            ],
          }
        : x,
    );
  }, []);

  const value = useMemo<Clinic>(
    () => ({
      ...s,
      login: (role) => setS((x) => ({ ...x, user: users[role] })),
      logout: () => setS((x) => ({ ...x, user: null })),
      viewTriage: (id) => {
        const t = s.triages.find((x) => x.id === id);
        if (!t) return;
        setS((x) => ({
          ...x,
          triages: x.triages.map((y) => (y.id === id ? { ...y, aberta: true, destaque: false } : y)),
          // A notificação urgente só dura até a triagem ser aberta ou dispensada.
          toasts: x.toasts.filter((y) => y.triageId !== id),
        }));
        log('Visualizou triagem', t.paciente.nome);
        toast('Este acesso foi registrado.');
      },
      log,
      setStatus: (id, status) => {
        const t = s.triages.find((x) => x.id === id);
        if (!t) return;
        setS((x) => ({ ...x, triages: x.triages.map((y) => (y.id === id ? { ...y, status } : y)) }));
        log('Alterou status', t.paciente.nome);
        toast('Status atualizado');
      },
      createInvite: ({ paciente, consulta }) => {
        const criadoEm = new Date();
        setS((x) => ({
          ...x,
          invites: [
            {
              id: uid('c'),
              paciente,
              consulta,
              criadoPor: x.user?.nome ?? '',
              criadoEm,
              expiraEm: new Date(criadoEm.getTime() + 72 * 3600_000),
              status: 'enviado',
            },
            ...x.invites,
          ],
        }));
        log('Criou convite', paciente);
      },
      revokeInvite: (id) => {
        const c = s.invites.find((x) => x.id === id);
        if (!c) return;
        setS((x) => ({ ...x, invites: x.invites.map((y) => (y.id === id ? { ...y, status: 'revogado' } : y)) }));
        log('Revogou convite', c.paciente);
        toast('Convite revogado');
      },
      renewInvite: (id) => {
        const c = s.invites.find((x) => x.id === id);
        if (!c) return;
        const criadoEm = new Date();
        setS((x) => ({
          ...x,
          invites: x.invites.map((y) =>
            y.id === id
              ? { ...y, status: 'enviado', criadoEm, expiraEm: new Date(criadoEm.getTime() + 72 * 3600_000), criadoPor: x.user?.nome ?? y.criadoPor }
              : y,
          ),
        }));
        log('Criou convite', c.paciente);
      },
      addNote: (n) => {
        setS((x) => ({ ...x, notes: [{ ...n, id: uid('n'), quando: new Date() }, ...x.notes] }));
        toast('Anotação registrada');
      },
      deleteNote: (id) => setS((x) => ({ ...x, notes: x.notes.filter((n) => n.id !== id) })),
      toast,
      dismissToast,
      simulateUrgent: () => {
        const t = buildUrgentTriage(new Date(), ++seq);
        setS((x) => ({
          ...x,
          sim: { ...x.sim, empty: false },
          triages: [t, ...x.triages],
          toasts: [...x.toasts, { id: uid('toast'), texto: 'Nova triagem urgente', triageId: t.id, nome: t.paciente.nome }],
        }));
      },
      simulateLoading: () => {
        setS((x) => ({ ...x, sim: { ...x.sim, loading: true, error: false } }));
        later(() => setS((x) => ({ ...x, sim: { ...x.sim, loading: false } })), 3000);
      },
      setSim: (p) => setS((x) => ({ ...x, sim: { ...x.sim, ...p } })),
      setHideNames: (hideNames) => setS((x) => ({ ...x, hideNames })),
      setSearch: (search) => setS((x) => ({ ...x, search })),
      setNotesOpen: (notesOpen) => setS((x) => ({ ...x, notesOpen })),
      receiveFromPatient: (answers) =>
        setS((x) => ({ ...x, triages: [buildPatientTriage(new Date(), answers, ++seq), ...x.triages] })),
      reset: () => setS(fresh()),
    }),
    [s, log, toast, dismissToast],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useClinic(): Clinic {
  const v = useContext(Ctx);
  if (!v) throw new Error('useClinic precisa estar dentro de <ClinicProvider>.');
  return v;
}

/** O que cada papel pode ver. Recepção: só convites, sem nenhum dado clínico. */
export type Area = 'triagens' | 'convites' | 'questionario' | 'acessos';
export function can(role: Role, area: Area): boolean {
  if (role === 'admin') return true;
  if (role === 'medico') return area !== 'acessos';
  return area === 'convites';
}

export const homeOf = (role: Role) => (role === 'recepcao' ? '/painel/convites' : '/painel');
