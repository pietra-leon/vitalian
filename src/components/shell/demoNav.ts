// Lista de telas usada pela central e pelo painel de demonstração.
export interface TelaDemo {
  path: string;
  nome: string;
  /** O que a tela exige para abrir (os guardas redirecionam se faltar). */
  exige?: 'consentimento' | 'verificacao' | 'envio';
}

export const telas: TelaDemo[] = [
  { path: '/triagem/demo', nome: '1. Boas-vindas' },
  { path: '/triagem/demo/consentimento', nome: '2. Consentimento' },
  { path: '/triagem/demo/verificacao', nome: '3. Verificação', exige: 'consentimento' },
  { path: '/triagem/demo/modulo/1', nome: '4. Módulo 1: Quem é você', exige: 'verificacao' },
  { path: '/triagem/demo/modulo/2', nome: '4. Módulo 2: Seu histórico', exige: 'verificacao' },
  { path: '/triagem/demo/modulo/3', nome: '4. Módulo 3: O motivo da consulta', exige: 'verificacao' },
  { path: '/triagem/demo/modulo/4', nome: '4. Módulo 4: Seu bem-estar', exige: 'verificacao' },
  { path: '/triagem/demo/revisao', nome: '5. Revisão', exige: 'verificacao' },
  { path: '/triagem/demo/concluido', nome: '6. Conclusão', exige: 'envio' },
  { path: '/triagem/indisponivel', nome: 'Link indisponível' },
  { path: '/triagem/bloqueado', nome: 'Muitas tentativas' },
  { path: '/triagem/menor', nome: 'Menor de 18 anos' },
  { path: '/triagem/erro', nome: 'Erro de envio' },
  { path: '/triagem/sessao-expirada', nome: 'Sessão expirada' },
  { path: '/pagina-que-nao-existe', nome: 'Página não encontrada (404)' },
];
