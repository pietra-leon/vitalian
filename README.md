# vitalian-landing

Este repositório publica duas páginas no GitHub Pages:

| Endereço | O que é | Entrada |
|---|---|---|
| `/` | Landing do Vitalian | `index.html` → `src/main.tsx` |
| `/jornada/` | **Mockup navegável da jornada da paciente** (não indexado) | `jornada/index.html` → `src/jornada.tsx` |

## Mockup da jornada da paciente

Protótipo totalmente visual da triagem pré-consulta: boas-vindas, consentimento,
verificação, questionário em 4 módulos, revisão e tela final.

- **Não existe backend.** Nenhuma chamada de rede, nenhum `localStorage`,
  `sessionStorage`, cookie ou IndexedDB. O estado vive em memória
  (`src/state/JourneyContext.tsx`); recarregar a página reinicia a jornada.
- **Todos os dados são fictícios** (`src/mock/invite.ts`).
- As regras de triagem em `src/mock/flags.ts` são **exemplos para validação
  clínica** e não foram revisadas por um médico.

### Rodar

```bash
npm install
npm run dev            # abra http://localhost:5173/jornada/
npm run build          # confere os tipos (tsc) e gera dist/
npm run test:cenarios  # confere os 7 cenários prontos e os casos-limite das regras
```

### Onde fica cada coisa

```
jornada/index.html     página do mockup (noindex, pt-BR)
src/App.tsx            HashRouter, rotas e guardas
src/mock/              convite, questionário (dados), regras (dados), cenários
src/state/             estado em memória, envio simulado, atalhos da demonstração
src/pages/             uma tela por arquivo (carregadas sob demanda)
src/components/        shell/ form/ flow/ feedback/ (reutilizam src/app/components/ui)
src/styles/jornada.css fontes autohospedadas e tokens do mockup
```

As rotas usam `HashRouter`: `/jornada/#/` é a central de demonstração e
`/jornada/#/triagem/demo` é o início da jornada. O botão de engrenagem, no canto
inferior esquerdo, abre o painel de demonstração (telas, cenários e simulações).

## Mockup da área do médico

Fica no mesmo app, nas rotas `/jornada/#/painel/...` (login em
`/jornada/#/painel/login`). É uma ferramenta de apoio: nenhum texto sugere
diagnóstico ou conduta, e tudo é tratado como "respostas autodeclaradas da
paciente".

- **Login simulado** e três papéis: médica (triagens, relatório, convites,
  questionário), admin (tudo, mais o registro de acessos) e recepção (só
  convites, sem nenhum dado clínico).
- **Nível sempre calculado** por `evaluate()` em `src/mock/flags.ts`; os dados
  fictícios estão em `src/mock/clinic.ts`. Mudar uma resposta muda o nível.
- **A lista de triagens usa só metadados abertos** (nome, idade, consulta,
  nível, categoria, status, envio); queixa e respostas só existem no detalhe.
- **Relatório A4** com CSS de impressão (`src/styles/painel.css`), legível em
  preto e branco e com marca d'água.
- **Anotações da validação**: sugestões em perguntas, regras e opções de
  entrega, com download em `.md` gerado no navegador.
- **Integração**: se a paciente concluir a jornada na mesma aba, a triagem
  dela aparece no topo da lista do médico.

```
src/pages/painel/       Login, Triagens, TriagemDetalhe, Relatorio, Convites,
                        NovoConvite, Questionario, Acessos, Estados (403, 404, sessão)
src/components/painel/  shell/ triagem/ convites/ questionario/
src/state/ClinicContext.tsx   usuário e papel, triagens, convites, acessos, anotações
src/lib/                summary.ts (resumo por regras), conditionText.ts,
                        dates.ts, download.ts
```

### Contraste (WCAG AA, mínimo 4,5:1 para texto)

| Texto | Fundo | Razão |
|---|---|---|
| `--verde-profundo` | `--creme` | 10,8:1 |
| `--verde-profundo` | `--superficie` | 11,7:1 |
| `--verde-profundo` | `--verde-claro` | 9,5:1 |
| `--verde-profundo` | `--salmao` | 6,5:1 |
| `--verde` | `--creme` | 7,4:1 |
| `--verde` | `--superficie` | 8,0:1 |
| `--verde` | `--verde-claro` | 6,6:1 |
| `--creme` | `--verde` | 7,4:1 |
| `--creme` | `--verde-profundo` | 10,8:1 |
| `--texto-2` | `--creme` | 5,8:1 |
| `--texto-2` | `--superficie` | 6,3:1 |
| `--texto-2` | `--verde-claro` | 5,1:1 |
| `--salmao-profundo` | `--salmao-suave` | 6,2:1 |
| `--salmao-profundo` | `--creme` | 6,7:1 |
| `--salmao-profundo` | `--superficie` | 7,3:1 |

Cores clínicas e do relatório (só na área do médico, sempre com ícone e texto):

| Texto | Fundo | Razão |
|---|---|---|
| branco | urgente `#B3261E` | 6,5:1 |
| `--verde-profundo` | atenção `#F2C94C` | 7,5:1 |
| `--verde-profundo` | rotina `--verde-claro` | 9,5:1 |
| urgente `#B3261E` (ícone e borda) | `--superficie` | 6,4:1 |
| tinta do relatório `#1C1F0E` | branco | 16,8:1 |
| tinta `#1C1F0E` | balão de mensagem `#DCF8C6` | 14,6:1 |

`--salmao` sobre `--creme` dá 1,7:1 e por isso **nunca** é usado como cor de
texto ou de ícone: só como fundo (com `--verde-profundo` por cima) ou detalhe
decorativo.
