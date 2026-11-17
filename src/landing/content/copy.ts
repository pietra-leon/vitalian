// Todo o texto da landing fica aqui, para editar sem mexer em layout.
// Onde houver [CONFIRMAR], o texto ainda depende de confirmação: não publique
// como fato antes de checar.

export const contato = {
  whatsapp: '5564981157082',
  email: 'vitaliantech@gmail.com',
  instagram: 'https://www.instagram.com/vitalian.tech',
  // [CONFIRMAR] O prompt previa https://demo.vitalian.com.br, que ainda não
  // está no ar. Enquanto isso, a demonstração é o mockup publicado neste mesmo
  // site, em /jornada/. Troque aqui quando o subdomínio existir.
  demo: '/jornada/',
};

/** Monta o link do WhatsApp com a mensagem pronta. Nada é enviado por este site. */
export const wa = (mensagem: string) =>
  `https://wa.me/${contato.whatsapp}?text=${encodeURIComponent(mensagem)}`;

export const mensagens = {
  conhecer: 'Olá! Vi o site do Vitalian e quero conhecer melhor.',
  piloto: 'Olá! Gostaria de participar do piloto do Vitalian.',
};

export const topBar = 'Estamos validando o Vitalian com ginecologistas. Quer participar? →';

export const nav = [
  { id: 'como-funciona', label: 'Como funciona' },
  { id: 'produto', label: 'O produto' },
  { id: 'seguranca', label: 'Segurança' },
  { id: 'perguntas', label: 'Perguntas' },
];
export const navCta = 'Quero conhecer';

export const hero = {
  eyebrow: 'Triagem pré-consulta para ginecologia',
  titulo: ['A primeira consulta.', 'Começa antes do consultório.'],
  subtitulo:
    'A paciente conta, em casa e no tempo dela, o que importa. Você chega à consulta com um relatório pronto e o raciocínio meio caminho andado.',
  cta: 'Quero conhecer o Vitalian',
  ctaSecundario: 'Ver como funciona ↓',
  // A conversa começa no WhatsApp: o site não pede cadastro nem cartão.
  apoio: 'Em validação com ginecologistas. Sem cadastro, sem cartão.',
  alternador: [
    { id: 'paciente', label: 'Paciente', legenda: 'O que a paciente vê' },
    { id: 'medico', label: 'Médico', legenda: 'O que você recebe' },
  ],
} as const;

// Fatos do desenho do produto. Não são métricas de uso.
export const fatos = {
  itens: [
    { numero: '4', texto: 'módulos curtos' },
    { numero: '~8 min', texto: 'pensados para responder (meta de projeto)' },
    { numero: '0', texto: 'aplicativos para baixar' },
    { numero: '1', texto: 'relatório pronto para anexar ao prontuário' },
  ],
  nota: 'Meta de projeto, em validação.',
};

export const seletor = {
  titulo: 'O que mais pesa na sua consulta?',
  opcoes: [
    {
      id: 'tempo',
      label: 'Falta de tempo',
      titulo: ['Minutos demais.', 'Para limpar o terreno.'],
      texto:
        'Histórico, alergias, medicações. Quando chegam organizados, o tempo da sala vai para o exame e a conduta.',
    },
    {
      id: 'dados',
      label: 'Dados que não chegam',
      titulo: ['O que a paciente não diz.', 'Costuma ser o que importa.'],
      texto:
        'Timidez, pressa e esquecimento deixam detalhes de fora. Em casa, com calma, ela conta mais, e pode deixar para falar pessoalmente o que preferir.',
    },
    {
      id: 'ansiedade',
      label: 'Paciente ansiosa',
      titulo: ['O medo chega antes.', 'Da paciente.'],
      texto:
        'Uma conversa acolhedora, no celular dela, tira parte da tensão antes de a porta abrir.',
    },
    {
      id: 'risco',
      label: 'Risco que passa batido',
      titulo: ['O sinal de alerta.', 'Não pode esperar.'],
      texto:
        'Respostas que indicam urgência aparecem destacadas no relatório, e a paciente recebe orientação na hora.',
    },
  ],
} as const;

export const silencio = {
  texto: [
    'Entre o agendamento e a sala de consulta, existe um silêncio.',
    'É nele que a anamnese perde detalhes.',
  ],
  inicio: 'Agendamento',
  fim: 'Consulta',
  ponte: 'Vitalian',
  alt: 'Linha do tempo: entre o agendamento e a consulta há um espaço vazio, de onde folhas se soltam. O Vitalian aparece como uma ponte que liga os dois pontos.',
};

export const comoFunciona = {
  eyebrow: 'Como funciona',
  titulo: 'Três passos. Nenhum aplicativo.',
  passos: [
    {
      titulo: 'Um link, no WhatsApp.',
      texto:
        'A recepção gera um convite em segundos e envia à paciente. O link vale por tempo limitado e só pode ser usado uma vez.',
      tela: 'convite',
    },
    {
      titulo: 'A paciente responde, no tempo dela.',
      texto:
        'Pelo celular, sem baixar nada. Uma pergunta por vez, em linguagem simples. Ela pode pular o que quiser e marcar "prefiro conversar pessoalmente".',
      tela: 'pergunta',
    },
    {
      titulo: 'Você recebe o relatório.',
      texto:
        'Alertas no topo, resumo para a consulta e as respostas organizadas. Pronto para anexar ao prontuário.',
      tela: 'relatorio',
    },
  ],
} as const;

export const produto = {
  eyebrow: 'O produto',
  titulo: 'Veja por dentro.',
  abas: [
    { id: 'paciente', label: 'A paciente' },
    { id: 'medico', label: 'O médico' },
    { id: 'relatorio', label: 'O relatório' },
  ],
  legendas: {
    paciente: ['Um convite acolhedor', 'Uma pergunta por vez', 'Ela escolhe o que deixar para a consulta'],
    medico: ['Lista ordenada por urgência', 'O alerta e o motivo, no topo'],
    relatorio: ['Uma folha, legível em um minuto', 'Em preto e branco também fica legível'],
  },
  botao: 'Abrir a demonstração',
  nota: 'Demonstração com dados fictícios.',
} as const;

export const doisLados = {
  titulo: 'Dois lados do mesmo cuidado.',
  atende: {
    eyebrow: 'Para quem atende',
    titulo: 'Chegue com o raciocínio andado.',
    itens: ['Anamnese estruturada.', 'Alertas para o que não pode esperar.', 'Tempo de sala para o que só você faz.'],
  },
  atendida: {
    eyebrow: 'Para quem é atendida',
    titulo: 'Conte no seu tempo.',
    itens: ['Sem pressão e sem plateia.', 'Um espaço seguro para os temas difíceis.', 'Sentir-se ouvida antes de chegar.'],
  },
  fecho: 'Quando a informação flui com segurança, o cuidado se torna excelência.',
};

export const confianca = {
  eyebrow: 'Segurança',
  titulo: 'Dado de saúde pede cuidado de verdade.',
  subtitulo: 'Estes são os princípios do produto que estamos construindo.',
  itens: [
    ['Respostas criptografadas.', 'As respostas da paciente são protegidas com criptografia AES-256, campo a campo.'],
    ['Cada clínica vê só o que é seu.', 'Os dados são isolados por clínica.'],
    ['Todo acesso é registrado.', 'Fica o rastro de quem abriu cada triagem.'],
    ['Links de uso único.', 'O convite expira e não pode ser reutilizado.'],
    ['A paciente manda.', 'Ela decide o que responder e pode deixar o resto para a consulta.'],
    // [CONFIRMAR] Revisão jurídica antes de afirmar mais do que isto sobre a LGPD.
    ['Pensado para a LGPD.', 'Desenhado segundo os princípios da LGPD.'],
  ],
  naoFaz: {
    titulo: 'O que o Vitalian não faz',
    frases: ['Não substitui a anamnese.', 'Não faz diagnóstico.', 'Não decide conduta.'],
    texto: 'Ele organiza o que a paciente conta, e a decisão é sempre de quem atende.',
  },
} as const;

export const piloto = {
  eyebrow: 'Programa piloto para clínicas',
  titulo: ['Vamos começar pequeno.', 'Junto com você.'],
  texto:
    'Estamos montando um grupo pequeno de clínicas para o piloto. Você ajuda a moldar as perguntas, os alertas e o relatório, e a gente acompanha de perto.',
  passos: ['Uma conversa de 10 minutos', 'O questionário ajustado à sua rotina', 'Um piloto com poucas pacientes'],
  cta: 'Quero participar do piloto',
};

// Seção "Quem está por trás": só entra em produção quando houver conteúdo
// verdadeiro fornecido pela fundadora. Preencha `pessoas` para publicá-la.
export const sobre = {
  titulo: 'Quem está por trás',
  pessoas: [] as { nome: string; papel: string; texto: string; foto: string }[],
};

export const faq = {
  eyebrow: 'Perguntas',
  titulo: 'O que costumam nos perguntar.',
  itens: [
    ['Isso substitui a anamnese?', 'Não. Ele prepara a conversa; a anamnese e a conduta continuam sendo suas.'],
    ['A paciente precisa baixar um app?', 'Não. Ela abre um link no celular.'],
    [
      'E se ela não quiser responder alguma coisa?',
      'Ela pode pular, ou marcar que prefere conversar pessoalmente. Isso aparece no relatório como um tópico para a consulta.',
    ],
    [
      'E se as respostas indicarem urgência?',
      'O relatório destaca o alerta, e a paciente vê na hora uma orientação de buscar atendimento.',
    ],
    ['Quem vê as respostas?', 'A equipe de saúde da clínica. Cada acesso fica registrado.'],
    [
      'Funciona com o meu prontuário?',
      'Nesta fase, o relatório sai pronto para anexar. Integrações vêm depois, conforme a necessidade das clínicas.',
    ],
    ['E pacientes menores de 18 anos?', 'O preenchimento deve ser feito junto com o responsável.'],
    ['Quanto custa?', 'Ainda estamos definindo, junto com as clínicas do piloto.'],
    // [CONFIRMAR] Não acrescentar detalhe jurídico sem revisão.
    [
      'Meus dados e os das pacientes estão seguros?',
      'Seguimos princípios de segurança e da LGPD desde o desenho do produto. Veja a seção sobre segurança.',
    ],
  ],
} as const;

export const ctaFinal = {
  titulo: 'A primeira consulta começa antes do consultório.',
  subtitulo: 'Conte um pouco sobre a sua clínica e a gente conversa.',
  nome: 'Seu nome (opcional)',
  tipo: 'Tipo de atendimento',
  tipos: ['Consultório individual', 'Clínica pequena', 'Clínica maior'],
  botao: 'Abrir conversa no WhatsApp',
  nota: 'Este formulário só prepara uma mensagem no seu WhatsApp. Não guardamos nenhum dado.',
};

/** Mensagem montada pelo formulário final. */
export function mensagemDoFormulario(nome: string, tipo: string): string {
  const quem = nome.trim() ? `Olá! Sou ${nome.trim()}.` : 'Olá!';
  return `${quem} Vi o site do Vitalian e quero conversar. Tipo de atendimento: ${tipo}.`;
}

export const rodape = {
  frase: 'Triagem digital pré-consulta para ginecologia.',
  // [CNPJ, quando houver]
  direitos: '© 2026 Vitalian.',
};

export const legal = {
  aviso: 'Texto provisório, em revisão',
  privacidade: {
    titulo: 'Privacidade',
    blocos: [
      [
        'O que este site coleta',
        'Nada além do necessário para entregar as páginas. Este site é feito de arquivos estáticos: não usa cookies, não tem ferramentas de análise de audiência e não guarda nada no seu navegador.',
      ],
      [
        'O formulário de contato',
        'O formulário no fim da página só monta uma mensagem e abre o WhatsApp. O que você digita não passa por nenhum servidor nosso. A mensagem só é enviada se você tocar em enviar, já dentro do WhatsApp.',
      ],
      [
        'O que o WhatsApp recebe',
        'Ao iniciar a conversa, o WhatsApp trata o seu número e as mensagens conforme a política de privacidade dele. Nós recebemos a mensagem e o número que você usou, e os usamos apenas para responder.',
      ],
      [
        'A demonstração',
        'A demonstração usa somente dados fictícios e guarda tudo na memória da aba. Ao recarregar a página, tudo é apagado.',
      ],
      ['Contato', 'Dúvidas sobre privacidade: escreva para vitaliantech@gmail.com.'],
    ],
  },
  termos: {
    titulo: 'Termos de uso',
    blocos: [
      [
        'O que é este site',
        'Este site apresenta o Vitalian, uma triagem digital pré-consulta para ginecologia que está em fase de validação com profissionais de saúde.',
      ],
      [
        'O que o Vitalian não é',
        'O Vitalian não substitui a anamnese, não faz diagnóstico e não decide conduta. O conteúdo deste site é informativo e não constitui orientação médica.',
      ],
      [
        'A demonstração',
        'A demonstração é um protótipo com dados fictícios, feito para avaliação. Não insira dados reais de pacientes.',
      ],
      [
        'Mudanças',
        'O produto e estes termos podem mudar durante a validação. Esta página será atualizada quando isso acontecer.',
      ],
      ['Contato', 'Fale com a gente pelo WhatsApp ou por vitaliantech@gmail.com.'],
    ],
  },
} as const;

export const seo = {
  titulo: 'Vitalian | Triagem digital pré-consulta para ginecologia',
  descricao:
    'A paciente responde em casa, no tempo dela. Você chega à consulta com um relatório estruturado. Triagem pré-consulta para ginecologia, em validação.',
};
