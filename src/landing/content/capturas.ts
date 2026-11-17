// Capturas reais dos mockups (geradas por scripts/capturar-telas.py).
import type { Captura } from '../components/DeviceFrame';

const cel = (src: string, alt: string): Captura => ({ src, alt, w: 390, h: 844 });
const note = (src: string, alt: string): Captura => ({ src, alt, w: 960, h: 600 });

export const capturas = {
  pergunta: cel(
    'paciente-pergunta',
    'Tela do questionário no celular: a pergunta "Você tem vida sexual ativa?" com as opções Sim, Ainda não e Prefiro conversar pessoalmente.',
  ),
  boasVindas: cel(
    'paciente-boas-vindas',
    'Tela de boas-vindas no celular: "Olá, Maria. A Clínica Demonstração preparou este espaço para você."',
  ),
  sintomas: cel(
    'paciente-sintomas',
    'Tela do questionário no celular: a pergunta "O que a traz à consulta?" com uma lista de opções grandes.',
  ),
  convite: note(
    'painel-convite',
    'Painel da clínica: convite criado, com o link de uso único e a prévia da mensagem de WhatsApp.',
  ),
  triagens: note(
    'painel-triagens',
    'Painel da clínica: lista de triagens ordenada por nível, com as urgentes no topo. Dados fictícios.',
  ),
  detalhe: note(
    'painel-detalhe',
    'Painel da clínica: detalhe de uma triagem, com o alerta e o motivo no topo e o resumo para a consulta. Dados fictícios.',
  ),
  relatorioTela: note(
    'painel-relatorio',
    'Relatório de triagem pré-consulta aberto no painel, com alertas, resumo e dados-chave. Dados fictícios.',
  ),
  folha: {
    src: 'relatorio-folha',
    alt: 'Relatório de triagem em uma folha A4: alertas, resumo para a consulta, dados-chave e respostas. Dados fictícios.',
    w: 560,
    h: 792,
  } as Captura,
  folhaPb: {
    src: 'relatorio-folha-pb',
    alt: 'O mesmo relatório impresso em preto e branco, ainda legível: o alerta urgente aparece com borda dupla.',
    w: 560,
    h: 792,
  } as Captura,
};
