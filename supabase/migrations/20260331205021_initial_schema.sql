-- ============================================================
-- Vitalian — Initial Database Schema
-- Conformidade LGPD | Multi-tenancy | RLS | AES-256-GCM ready
-- ============================================================

-- =====================
-- 0. EXTENSIONS
-- =====================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- for gen_random_uuid() fallback


-- =====================
-- 1. ENUMS
-- =====================
CREATE TYPE public.triage_category AS ENUM (
  'rotina',
  'dor',
  'emergencia',
  'gestacao'
);

CREATE TYPE public.triage_status AS ENUM (
  'pendente',
  'em_analise',
  'concluido'
);

CREATE TYPE public.user_role AS ENUM (
  'admin',
  'doctor',
  'staff'
);


-- =====================
-- 2. TABELAS
-- =====================

-- 2.1 CLINICS — Dados do assinante/clínica
CREATE TABLE public.clinics (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  slug        TEXT        UNIQUE NOT NULL,
  cnpj        TEXT        UNIQUE,
  email       TEXT,
  phone       TEXT,
  address     TEXT,
  is_active   BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.2 PROFILES — Extensão de auth.users para médicos e staff
CREATE TABLE public.profiles (
  id          UUID              PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  clinic_id   UUID              NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  full_name   TEXT              NOT NULL,
  role        public.user_role  NOT NULL DEFAULT 'staff',
  crm         TEXT,             -- Apenas para médicos
  is_active   BOOLEAN           NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ       NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ       NOT NULL DEFAULT NOW()
);

-- 2.3 PATIENTS — PII segregado conforme LGPD
-- CPF e dados sensíveis devem ser criptografados no nível da aplicação (AES-256-GCM)
CREATE TABLE public.patients (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id  UUID        UNIQUE NOT NULL DEFAULT gen_random_uuid(), -- usado nas URLs públicas: /triagem?id=external_id
  clinic_id    UUID        NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  full_name    TEXT        NOT NULL,
  cpf          TEXT,       -- Recomenda-se criptografar no app antes de salvar (LGPD Art. 11)
  birth_date   DATE,
  phone        TEXT,
  email        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.4 QUESTIONNAIRES_TEMPLATES — Perguntas configuráveis por clínica
CREATE TABLE public.questionnaires_templates (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id   UUID        NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  name        TEXT        NOT NULL,
  description TEXT,
  questions   JSONB       NOT NULL DEFAULT '[]', -- JSONB para flexibilidade sem alterar schema
  is_active   BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.5 TRIAGE_SUBMISSIONS — Core do produto
CREATE TABLE public.triage_submissions (
  id                          UUID                    PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id                  UUID                    NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  clinic_id                   UUID                    NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  doctor_id                   UUID                    REFERENCES public.profiles(id) ON DELETE SET NULL,
  questionnaire_template_id   UUID                    REFERENCES public.questionnaires_templates(id) ON DELETE SET NULL,

  -- Metadados abertos (não sensíveis — usados para dashboard e filtros)
  category                    public.triage_category  NOT NULL DEFAULT 'rotina',
  urgency_level               INTEGER                 NOT NULL DEFAULT 1 CHECK (urgency_level BETWEEN 1 AND 5),
  has_critical_symptoms       BOOLEAN                 NOT NULL DEFAULT FALSE,
  status                      public.triage_status    NOT NULL DEFAULT 'pendente',

  -- Dados sensíveis criptografados no backend (AES-256-GCM)
  -- Formato: base64(iv:authTag:ciphertext)
  encrypted_answers           TEXT,   -- JSON com corpo completo do questionário
  encrypted_notes             TEXT,   -- Comentários adicionais da paciente

  submitted_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- =====================
-- 3. ÍNDICES
-- =====================
CREATE INDEX idx_profiles_clinic_id                   ON public.profiles(clinic_id);
CREATE INDEX idx_patients_clinic_id                   ON public.patients(clinic_id);
CREATE INDEX idx_patients_external_id                 ON public.patients(external_id);
CREATE INDEX idx_questionnaires_clinic_id             ON public.questionnaires_templates(clinic_id);
CREATE INDEX idx_triage_submissions_clinic_id         ON public.triage_submissions(clinic_id);
CREATE INDEX idx_triage_submissions_patient_id        ON public.triage_submissions(patient_id);
CREATE INDEX idx_triage_submissions_status            ON public.triage_submissions(status);
CREATE INDEX idx_triage_submissions_urgency           ON public.triage_submissions(urgency_level);
CREATE INDEX idx_triage_submissions_critical          ON public.triage_submissions(has_critical_symptoms);


-- =====================
-- 4. TRIGGERS updated_at
-- =====================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_clinics_updated_at
  BEFORE UPDATE ON public.clinics
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_patients_updated_at
  BEFORE UPDATE ON public.patients
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_questionnaires_updated_at
  BEFORE UPDATE ON public.questionnaires_templates
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_triage_submissions_updated_at
  BEFORE UPDATE ON public.triage_submissions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- =====================
-- 5. FUNÇÕES AUXILIARES PARA RLS
-- =====================

-- Retorna o clinic_id do usuário autenticado
CREATE OR REPLACE FUNCTION public.get_my_clinic_id()
RETURNS UUID AS $$
  SELECT clinic_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Retorna o role do usuário autenticado
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS public.user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;


-- =====================
-- 6. ROW LEVEL SECURITY (RLS)
-- =====================
ALTER TABLE public.clinics                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questionnaires_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.triage_submissions       ENABLE ROW LEVEL SECURITY;


-- ---- CLINICS ----
-- Médicos/staff só veem a própria clínica
CREATE POLICY "clinics: authenticated podem ver a própria"
  ON public.clinics FOR SELECT TO authenticated
  USING (id = public.get_my_clinic_id());

-- Apenas admin pode atualizar dados da clínica
CREATE POLICY "clinics: somente admin atualiza"
  ON public.clinics FOR UPDATE TO authenticated
  USING (id = public.get_my_clinic_id() AND public.get_my_role() = 'admin');


-- ---- PROFILES ----
-- Usuários veem apenas perfis da própria clínica
CREATE POLICY "profiles: ver apenas da própria clínica"
  ON public.profiles FOR SELECT TO authenticated
  USING (clinic_id = public.get_my_clinic_id());

-- Usuário atualiza apenas o próprio perfil
CREATE POLICY "profiles: atualizar apenas o próprio"
  ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid());


-- ---- PATIENTS ----
-- Ver apenas pacientes da própria clínica
CREATE POLICY "patients: ver apenas da própria clínica"
  ON public.patients FOR SELECT TO authenticated
  USING (clinic_id = public.get_my_clinic_id());

-- Inserir apenas pacientes vinculados à própria clínica
CREATE POLICY "patients: inserir na própria clínica"
  ON public.patients FOR INSERT TO authenticated
  WITH CHECK (clinic_id = public.get_my_clinic_id());

-- Atualizar apenas pacientes da própria clínica
CREATE POLICY "patients: atualizar na própria clínica"
  ON public.patients FOR UPDATE TO authenticated
  USING (clinic_id = public.get_my_clinic_id());


-- ---- QUESTIONNAIRES_TEMPLATES ----
CREATE POLICY "questionnaires: ver da própria clínica"
  ON public.questionnaires_templates FOR SELECT TO authenticated
  USING (clinic_id = public.get_my_clinic_id());

CREATE POLICY "questionnaires: admin cria"
  ON public.questionnaires_templates FOR INSERT TO authenticated
  WITH CHECK (clinic_id = public.get_my_clinic_id() AND public.get_my_role() = 'admin');

CREATE POLICY "questionnaires: admin atualiza"
  ON public.questionnaires_templates FOR UPDATE TO authenticated
  USING (clinic_id = public.get_my_clinic_id() AND public.get_my_role() = 'admin');


-- ---- TRIAGE_SUBMISSIONS ----
-- Médicos/staff veem apenas triagens da própria clínica (Zero Trust: clinic_id verificado no DB)
CREATE POLICY "triages: ver apenas da própria clínica"
  ON public.triage_submissions FOR SELECT TO authenticated
  USING (clinic_id = public.get_my_clinic_id());

-- Pacientes anônimos (via link único) podem submeter triagem — validação do external_id feita no app
CREATE POLICY "triages: paciente anônimo pode inserir"
  ON public.triage_submissions FOR INSERT TO anon
  WITH CHECK (TRUE);

-- Authenticated também pode inserir (staff/admin)
CREATE POLICY "triages: authenticated pode inserir na própria clínica"
  ON public.triage_submissions FOR INSERT TO authenticated
  WITH CHECK (clinic_id = public.get_my_clinic_id());

-- Apenas doctor/admin pode atualizar status de triagem
CREATE POLICY "triages: doctor/admin atualiza na própria clínica"
  ON public.triage_submissions FOR UPDATE TO authenticated
  USING (
    clinic_id = public.get_my_clinic_id()
    AND public.get_my_role() IN ('admin', 'doctor')
  );
