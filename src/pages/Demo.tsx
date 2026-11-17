import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Btn } from '@/components/form/Btn';
import { StepLayout } from '@/components/flow/StepLayout';
import { telas } from '@/components/shell/demoNav';
import { logoSrc } from '@/components/shell/Header';
import { type Role, roleLabel, users } from '@/mock/clinic';
import { scenarios } from '@/mock/scenarios';
import { homeOf, useClinic } from '@/state/ClinicContext';
import { useJourney } from '@/state/JourneyContext';
import { useDemoActions } from '@/state/useDemoActions';

const linha =
  'flex min-h-12 w-full items-center justify-between gap-3 rounded-[14px] border-[1.5px] border-borda bg-superficie px-4 py-2.5 text-left text-base text-verde-profundo hover:bg-verde-claro';

/** Central de demonstração: existe só no mockup, fora da jornada real. */
export default function Demo() {
  const navigate = useNavigate();
  const { reset } = useJourney();
  const demo = useDemoActions();
  const clinic = useClinic();

  return (
    <StepLayout
      title="Demonstração da jornada da paciente"
      top={<img src={logoSrc} alt="Vitalian" className="mb-5 h-14 w-auto" />}
    >
      <p className="mt-3 text-[17px] leading-relaxed text-texto-2">
        Um mockup navegável da triagem pré-consulta. Tudo aqui é fictício e fica só na memória desta aba:
        recarregar a página apaga tudo.
      </p>

      <section aria-labelledby="g1" className="mt-8">
        <h2 id="g1" className="mb-3 text-lg font-semibold text-verde-profundo">
          Começar a jornada
        </h2>
        <Btn
          className="w-full"
          onClick={() => {
            reset();
            navigate('/triagem/demo');
          }}
        >
          Começar como a paciente
          <ArrowRight aria-hidden="true" />
        </Btn>
      </section>

      <section aria-labelledby="g3" className="mt-9">
        <h2 id="g3" className="text-lg font-semibold text-verde-profundo">
          Cenários prontos
        </h2>
        <p className="mb-3 text-[15px] text-texto-2">Preenchem as respostas e levam à revisão.</p>
        <ul className="space-y-2">
          {scenarios.map((s) => (
            <li key={s.id}>
              <button type="button" className={linha} onClick={() => demo.cenario(s.id)}>
                <span>
                  <span className="block font-semibold">{s.nome}</span>
                  <span className="block text-[15px] text-texto-2">{s.descricao}</span>
                </span>
                <ArrowRight className="size-5 shrink-0 text-verde" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="g4" className="mt-9">
        <h2 id="g4" className="text-lg font-semibold text-verde-profundo">
          Área do médico
        </h2>
        <p className="mb-3 text-[15px] text-texto-2">
          O painel da clínica. Se você concluir a jornada da paciente nesta aba, a triagem dela aparece lá.
        </p>
        <ul className="space-y-2">
          <li>
            <button type="button" className={linha} onClick={() => navigate('/painel/login')}>
              <span className="font-semibold">Abrir o login do painel</span>
              <ArrowRight className="size-5 shrink-0 text-verde" aria-hidden="true" />
            </button>
          </li>
          {(Object.keys(users) as Role[]).map((r) => (
            <li key={r}>
              <button
                type="button"
                className={linha}
                onClick={() => {
                  clinic.login(r);
                  navigate(homeOf(r));
                }}
              >
                <span>
                  <span className="block font-semibold">Entrar como {roleLabel[r]}</span>
                  <span className="block text-[15px] text-texto-2">{users[r].nome}</span>
                </span>
                <ArrowRight className="size-5 shrink-0 text-verde" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="g2" className="mt-9">
        <h2 id="g2" className="mb-3 text-lg font-semibold text-verde-profundo">
          Ir direto a uma tela
        </h2>
        <ul className="space-y-2">
          {telas.map((t) => (
            <li key={t.path}>
              <button type="button" className={linha} onClick={() => demo.irPara(t)}>
                <span className="font-medium">{t.nome}</span>
                <ArrowRight className="size-5 shrink-0 text-verde" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      </section>
    </StepLayout>
  );
}
