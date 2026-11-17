import { ClipboardList, FileQuestion, type LucideIcon, ScrollText, Send } from 'lucide-react';
import type { Area } from '@/state/ClinicContext';

export interface NavItem {
  to: string;
  label: string;
  curto: string;
  icon: LucideIcon;
  area: Area;
}

export const navItems: NavItem[] = [
  { to: '/painel', label: 'Triagens', curto: 'Triagens', icon: ClipboardList, area: 'triagens' },
  { to: '/painel/convites', label: 'Convites', curto: 'Convites', icon: Send, area: 'convites' },
  { to: '/painel/questionario', label: 'Questionário e regras', curto: 'Questionário', icon: FileQuestion, area: 'questionario' },
  { to: '/painel/acessos', label: 'Acessos', curto: 'Acessos', icon: ScrollText, area: 'acessos' },
];

/** Título da página (Calistoga, na barra superior) por rota. */
export function pageTitle(pathname: string): string {
  if (pathname === '/painel') return 'Triagens';
  if (pathname.endsWith('/relatorio')) return 'Relatório';
  if (pathname.startsWith('/painel/triagem/')) return 'Triagem';
  if (pathname === '/painel/convites/novo') return 'Novo convite';
  if (pathname.startsWith('/painel/convites')) return 'Convites';
  if (pathname.startsWith('/painel/questionario')) return 'Questionário e regras';
  if (pathname.startsWith('/painel/acessos')) return 'Acessos';
  if (pathname.startsWith('/painel/sem-permissao')) return 'Sem permissão';
  if (pathname.startsWith('/painel/nao-encontrado')) return 'Não encontrado';
  return 'Painel';
}

export function isActive(item: NavItem, pathname: string): boolean {
  if (item.to === '/painel') return pathname === '/painel' || pathname.startsWith('/painel/triagem');
  return pathname.startsWith(item.to);
}
