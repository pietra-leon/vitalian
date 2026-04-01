# Vitalian - Sistema de Triagem Ginecológica Digital

## Princípios de Segurança (Críticos)
- **LGPD Compliance:** Dados de saúde são sensíveis. O processamento deve ser anônimo sempre que possível.
- **Criptografia Field-Level (FLE):** Campos como `complaints`, `history` e `habits` DEVEM ser criptografados no servidor (Node.js) usando AES-256-GCM antes de serem enviados ao Supabase.
- **Zero Trust:** Nunca confie no ID enviado pelo cliente. Use sempre `auth.uid()` nas queries do Supabase.
- **Ambiente:** Todas as chaves (Supabase, Encryption Key) devem vir de `process.env`. Nunca use hardcoded strings.

## Tech Stack
- **Frontend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, Shadcn/UI.
- **Backend/Database:** Supabase (PostgreSQL + GoTrue Auth).
- **ORM/Migrations:** Supabase CLI para migrations de banco de dados.
- **Criptografia:** Biblioteca nativa `crypto` do Node.js.

## Estrutura do Banco de Dados (Regras)
- **Identificadores:** Use sempre `UUID v4` como chave primária.
- **Multi-tenancy:** Toda tabela clínica deve ter uma coluna `clinic_id` com Row Level Security (RLS) ativo.
- **Segregação:** Tabela `patients` (PII) deve ser separada logicamente da tabela `triages` (Saúde).

## Padrões de Código
- **Componentes:** Use Server Components por padrão. Client Components apenas para interatividade.
- **Tipagem:** TypeScript estrito. Use `npx supabase gen types` para manter os tipos sincronizados.
- **Commits:** Mensagens claras e em português.
- **Tratamento de Erros:** Use blocos try-catch em Server Actions com logs de erro que não exponham dados sensíveis.

## Fluxo de Implementação Atual
1. Configuração de Schemas de banco via migrations.
2. Implementação do Service de Criptografia no Backend.
3. Criação do fluxo de submissão da triagem (Paciente -> Backend -> Supabase).

## Fluxo e Regras de Triagem (Vitalian)

### 1. Estrutura do Questionário (Módulos)
- **Módulo 1: Identificação** (Sincronização com `patients`).
- **Módulo 2: Histórico Geral** (Primeira consulta, anticoncepcionais, cirurgias prévias).
- **Módulo 3: Queixa Principal** (Motivo da consulta, sintomas atuais, duração).
- **Módulo 4: Hábitos e Medos** (Acolhimento, nível de ansiedade, dúvidas sexuais).

### 2. Regras para "Flags" Críticas (Triagem Inteligente)
O sistema deve marcar `has_critical_symptoms = true` e elevar o `urgency_level` se as respostas incluírem:
- **Flag Vermelha (Alta Urgência):** Dor pélvica aguda/intensa, sangramento hemorrágico, febre alta associada a sintomas ginecológicos.
- **Flag Amarela (Atenção):** Nódulos palpáveis na mama, suspeita de IST, feridas genitais, atraso menstrual > 45 dias (sem método contraceptivo).

### 3. Modelo de Dados (Database Schema)

#### Tabela: `patients`
- `id` (uuid, PK)
- `external_id` (uuid, unique) - *Usado para a URL da paciente (Ex: /triagem?id=external_id)*
- `clinic_id` (uuid, FK)
- `full_name` (text)
- `cpf` (text, unique)
- `birth_date` (date)
- `phone` (text)

#### Tabela: `triage_submissions`
- `id` (uuid, PK)
- `patient_id` (uuid, FK)
- `clinic_id` (uuid, FK)
- `doctor_id` (uuid, FK, nullable)
- **Metadados (Abertos):**
    - `category` (enum: 'rotina', 'dor', 'emergencia', 'gestacao')
    - `has_critical_symptoms` (boolean)
    - `urgency_level` (int, 1-5)
    - `status` (enum: 'pendente', 'em_analise', 'concluido')
- **Dados Sensíveis (Criptografados):**
    - `encrypted_answers` (text) - *JSON com o corpo completo do questionário*
    - `encrypted_notes` (text) - *Comentários adicionais da paciente*
- `submitted_at` (timestamp)

### 4. Políticas de RLS (Row Level Security)
- **Pacientes:** Podem apenas realizar `INSERT` na tabela `triage_submissions`. Não possuem permissão de `SELECT` ou `UPDATE`.
- **Médicos:** Possuem permissão de `SELECT` apenas em registros onde `triages.clinic_id == auth.user.clinic_id`.

## Fluxo e Regras de Triagem
- **Módulos:** Identificação -> Histórico Geral -> Queixa Principal -> Hábitos/Acolhimento.
- **Flags Críticas:** O sistema deve marcar `has_critical_symptoms = true` e elevar `urgency_level` para sintomas como: dor aguda intensa, hemorragia, febre associada ou nódulos mamários.
- **Flexibilidade:** Usar JSONB para respostas para permitir mudanças futuras nas perguntas sem alterar o schema.

## Database Schema (Sprints Iniciais)

### Tabelas Principais:
1. **clinics**: Dados da clínica/assinante.
2. **profiles**: Extensão de `auth.users` para médicos e staff (vinculados a uma `clinic_id`).
3. **patients**: Dados de PII (Nome, CPF, Data de Nascimento). Possui `external_id` (uuid) para URLs.
4. **questionnaires_templates**: Define o JSON das perguntas por `clinic_id`.
5. **triage_submissions**: 
    - Metadados abertos: `category`, `urgency_level`, `has_critical_symptoms`, `status`, `clinic_id`.
    - Dados Criptografados: `encrypted_answers` (JSON), `encrypted_notes` (Text).

## Padrões de Código
- **Componentes:** Server Components por padrão.
- **Tipagem:** TypeScript estrito. Sincronizar via `npx supabase gen types`.
- **Migrations:** Todas as mudanças de DB devem ser via Supabase CLI.