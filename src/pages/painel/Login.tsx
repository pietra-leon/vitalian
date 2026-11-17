import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Btn } from '@/components/form/Btn';
import { TextField } from '@/components/form/TextField';
import { DemoBanner } from '@/components/shell/DemoBanner';
import { logoSrc } from '@/components/shell/Header';
import type { Role } from '@/mock/clinic';
import { homeOf, useClinic } from '@/state/ClinicContext';

const atalhos: [Role, string][] = [
  ['medico', 'Entrar como Médica (Dra. Helena Demo)'],
  ['admin', 'Entrar como Admin (Carla Gestão Demo)'],
  ['recepcao', 'Entrar como Recepção (Rafael Recepção Demo)'],
];

/** Login SIMULADO: qualquer e-mail em formato válido e qualquer senha entram como médica. */
export default function Login() {
  const { login } = useClinic();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erros, setErros] = useState<{ email?: string; senha?: string }>({});
  const h1 = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    h1.current?.focus();
    document.title = 'Entrar · Painel Vitalian (demonstração)';
  }, []);

  const entrar = (r: Role) => {
    login(r);
    navigate(homeOf(r));
  };

  const submit = () => {
    const e: typeof erros = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) e.email = 'Digite um e-mail no formato nome@clinica.com.';
    if (!senha) e.senha = 'Digite uma senha (na demonstração, qualquer uma serve).';
    setErros(e);
    if (!e.email && !e.senha) entrar('medico');
  };

  return (
    <div className="min-h-dvh bg-creme">
      <DemoBanner />
      <main className="mx-auto w-full max-w-[440px] px-5 py-10">
        <img src={logoSrc} alt="Vitalian" className="h-14 w-auto" />
        <h1 ref={h1} tabIndex={-1} data-titulo-tela className="font-titulo mt-5 text-[32px] leading-tight text-verde-profundo">
          Entrar no painel
        </h1>
        <p className="mt-2 text-base text-texto-2">Área da equipe da clínica.</p>

        <form
          noValidate
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <TextField id="login-email" label="E-mail" value={email} onChange={setEmail} error={erros.email} autoComplete="off" />
          <div>
            <label htmlFor="login-senha" className="mb-2 block text-base font-semibold text-verde-profundo">
              Senha
            </label>
            <input
              id="login-senha"
              type="password"
              autoComplete="off"
              value={senha}
              aria-invalid={erros.senha ? true : undefined}
              aria-describedby="login-senha-erro"
              onChange={(e) => setSenha(e.target.value)}
              className="min-h-[52px] w-full rounded-[14px] border-[1.5px] border-texto-2/70 bg-superficie px-4 text-[17px] text-verde-profundo"
            />
            <p id="login-senha-erro" aria-live="polite" className="mt-2 text-[15px] font-medium text-salmao-profundo">
              {erros.senha ?? ''}
            </p>
          </div>
          <Btn type="submit" className="w-full">
            Entrar
          </Btn>
        </form>

        <Dialog>
          <DialogTrigger className="mt-2 min-h-11 rounded-full px-2 text-[15px] font-semibold text-verde-profundo underline underline-offset-4">
            Esqueci minha senha
          </DialogTrigger>
          <DialogContent className="rounded-2xl border-borda bg-superficie">
            <DialogHeader className="text-left">
              <DialogTitle className="font-titulo text-2xl text-verde-profundo">Recuperação de senha</DialogTitle>
              <DialogDescription className="text-base text-texto-2">
                No produto, você receberia um link por e-mail para criar uma nova senha. Nesta demonstração não há
                contas de verdade: qualquer senha é aceita.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <section aria-labelledby="atalhos" className="mt-8 rounded-2xl border-[1.5px] border-dashed border-verde p-4">
          <h2 id="atalhos" className="text-base font-semibold text-verde-profundo">
            Atalhos da demonstração
          </h2>
          <ul className="mt-3 space-y-2">
            {atalhos.map(([r, texto]) => (
              <li key={r}>
                <Btn variante="contorno" className="w-full justify-start text-left text-[15px]" onClick={() => entrar(r)}>
                  {texto}
                </Btn>
              </li>
            ))}
          </ul>
        </section>
        <Btn variante="texto" className="mt-4" onClick={() => navigate('/')}>
          Voltar à central de demonstração
        </Btn>
      </main>
    </div>
  );
}
