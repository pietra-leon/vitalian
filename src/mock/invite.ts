// Dados FICTÍCIOS do convite. Nunca use nomes ou dados reais aqui.
export const invite = {
  paciente: {
    nome: 'Maria Demonstração',
    primeiroNome: 'Maria',
    nascimento: '2000-03-15', // ISO; na tela aparece como 15/03/2000
  },
  clinica: 'Clínica Demonstração',
  profissional: 'Dra. Helena Demo',
  consulta: 'Quinta-feira · 14:30',
  versaoTermo: 'demo-0.1',
  cpfDeTeste: '529.982.247-25',
  tentativasDeVerificacao: 5,
} as const;

/** Converte "2000-03-15" em "15/03/2000". */
export function isoParaBr(iso: string): string {
  const [a, m, d] = iso.split('-');
  return `${d}/${m}/${a}`;
}

export const nascimentoBr = isoParaBr(invite.paciente.nascimento);
