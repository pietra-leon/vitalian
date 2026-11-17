import { CircleCheck, Copy, ExternalLink, Info } from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { cn } from '@/app/components/ui/utils';
import { Btn } from '@/components/form/Btn';
import { CpfInput } from '@/components/form/CpfInput';
import { DateMaskedInput } from '@/components/form/DateMaskedInput';
import { TextField } from '@/components/form/TextField';
import { WhatsAppBubble } from '@/components/painel/convites/WhatsAppBubble';
import { botaoTabela, cartao, selectCls } from '@/components/painel/triagem/chips';
import { clinic, users } from '@/mock/clinic';
import { dateProblem, isValidCpf, maskPhone, onlyDigits } from '@/mock/questionnaire';
import { useClinic } from '@/state/ClinicContext';

// Link de exemplo: no mockup, todo convite leva à mesma jornada de demonstração.
const LINK = 'https://demo.vitalian.com.br/#/triagem/demo';

type Erros = Partial<Record<'nome' | 'cpf' | 'nascimento' | 'telefone' | 'consulta' | 'hora', string>>;

/** Novo convite em 2 passos: dados da paciente e convite criado (o link aparece só uma vez). */
export default function NovoConvite() {
  const { createInvite, toast } = useClinic();
  const navigate = useNavigate();
  // "Gerar novo link" na lista cai direto no passo 2.
  const vindo = (useLocation().state as { criado?: { paciente: string } } | null)?.criado;
  const [criado, setCriado] = useState<{ paciente: string } | null>(vindo ?? null);
  const [f, setF] = useState({ nome: '', cpf: '', nascimento: '', telefone: '', consulta: '', hora: '' });
  const [erros, setErros] = useState<Erros>({});
  const set = (k: keyof typeof f) => (v: string) => {
    setF((x) => ({ ...x, [k]: v }));
    setErros((e) => ({ ...e, [k]: undefined }));
  };

  const submit = () => {
    const e: Erros = {};
    if (f.nome.trim().split(/\s+/).length < 2) e.nome = 'Digite nome e sobrenome (fictícios).';
    if (onlyDigits(f.cpf).length < 11) e.cpf = 'Digite os 11 números do CPF ou use o CPF de teste.';
    else if (!isValidCpf(f.cpf)) e.cpf = 'Esse CPF não fecha com os dígitos finais. Vale conferir os números.';
    e.nascimento = dateProblem(f.nascimento) ?? undefined;
    if (onlyDigits(f.telefone).length < 10) e.telefone = 'Digite o telefone com DDD.';
    e.consulta = dateProblem(f.consulta, { allowFuture: true }) ?? undefined;
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(f.hora)) e.hora = 'Digite a hora no formato 14:30.';
    setErros(e);
    if (Object.values(e).some(Boolean)) return;
    const [d, m, a] = f.consulta.split('/').map(Number);
    const [h, min] = f.hora.split(':').map(Number);
    createInvite({ paciente: f.nome.trim(), consulta: new Date(a, m - 1, d, h, min) });
    setCriado({ paciente: f.nome.trim() });
    window.scrollTo(0, 0);
  };

  const copiar = async (texto: string, aviso: string) => {
    try {
      await navigator.clipboard.writeText(texto);
      toast(aviso);
    } catch {
      toast('Não foi possível copiar. Selecione o texto e copie manualmente.');
    }
  };

  if (criado) {
    const primeiro = criado.paciente.split(' ')[0];
    const mensagem = `Olá, ${primeiro}! A ${clinic.nome} preparou um questionário para você responder antes da consulta. Leva cerca de 8 minutos e você pode pular o que preferir: ${LINK}`;
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <p className="text-[14px] font-semibold text-texto-2">Passo 2 de 2</p>
        <div className={cn(cartao, 'p-5')} role="status">
          <p className="flex items-center gap-3 text-lg font-semibold text-verde-profundo">
            <CircleCheck className="size-8 shrink-0 text-verde" aria-hidden="true" />
            Convite criado. Ele expira em 72 horas.
          </p>
        </div>

        <section className={cn(cartao, 'p-5')} aria-labelledby="link-titulo">
          <h2 id="link-titulo" className="text-base font-semibold text-verde-profundo">Link do convite</h2>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <code className="min-w-0 flex-1 rounded-xl border border-borda bg-creme px-3 py-2.5 font-mono text-[14px] break-all text-verde-profundo">
              {LINK}
            </code>
            <button type="button" className={botaoTabela} onClick={() => copiar(LINK, 'Link copiado')}>
              <Copy className="size-4" aria-hidden="true" />
              Copiar
            </button>
          </div>
          <p className="mt-2 flex items-start gap-2 text-[14px] font-medium text-salmao-profundo">
            <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            Este link não será exibido novamente.
          </p>
        </section>

        <section className={cn(cartao, 'p-5')} aria-labelledby="msg-titulo">
          <h2 id="msg-titulo" className="mb-2 text-base font-semibold text-verde-profundo">Prévia da mensagem de WhatsApp</h2>
          <WhatsAppBubble texto={mensagem} />
          <button type="button" className={cn(botaoTabela, 'mt-3')} onClick={() => copiar(mensagem, 'Mensagem copiada')}>
            <Copy className="size-4" aria-hidden="true" />
            Copiar mensagem
          </button>
          <p className="mt-2 text-[13px] text-texto-2">Nada é enviado pela demonstração: você copia e cola a mensagem.</p>
        </section>

        <div className="flex flex-wrap gap-2">
          <Btn onClick={() => navigate('/triagem/demo')}>
            <ExternalLink aria-hidden="true" />
            Abrir como paciente
          </Btn>
          <Btn
            variante="contorno"
            onClick={() => {
              setCriado(null);
              setF({ nome: '', cpf: '', nascimento: '', telefone: '', consulta: '', hora: '' });
              navigate('/painel/convites/novo', { replace: true, state: null });
            }}
          >
            Criar outro convite
          </Btn>
          <Btn variante="texto" onClick={() => navigate('/painel/convites')}>
            Voltar aos convites
          </Btn>
        </div>
      </div>
    );
  }

  return (
    <form
      noValidate
      className="mx-auto max-w-2xl space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <p className="text-[14px] font-semibold text-texto-2">Passo 1 de 2 · Dados da paciente</p>
      <p className="flex items-start gap-2 rounded-2xl border-[1.5px] border-dashed border-verde px-4 py-3 text-[15px] font-medium text-verde-profundo">
        <Info className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
        Ambiente de demonstração: use apenas dados fictícios.
      </p>

      <div className={cn(cartao, 'space-y-4 p-5')}>
        <TextField id="conv-nome" label="Nome completo" value={f.nome} onChange={set('nome')} error={erros.nome} placeholder="Ex.: Maria Demonstração" />
        <CpfInput id="conv-cpf" label="CPF" value={f.cpf} onChange={set('cpf')} error={erros.cpf} />
        <div className="grid gap-4 sm:grid-cols-2">
          <DateMaskedInput id="conv-nasc" label="Data de nascimento" value={f.nascimento} onChange={set('nascimento')} error={erros.nascimento} />
          <TextField id="conv-tel" label="Telefone com WhatsApp" value={f.telefone} onChange={set('telefone')} mask={maskPhone} inputMode="tel" placeholder="(00) 00000-0000" error={erros.telefone} />
          <DateMaskedInput id="conv-data" label="Data da consulta" value={f.consulta} onChange={set('consulta')} error={erros.consulta} />
          <TextField
            id="conv-hora"
            label="Hora da consulta"
            value={f.hora}
            onChange={set('hora')}
            mask={(v) => {
              const d = onlyDigits(v).slice(0, 4);
              return d.length > 2 ? `${d.slice(0, 2)}:${d.slice(2)}` : d;
            }}
            inputMode="numeric"
            placeholder="HH:MM"
            error={erros.hora}
          />
          <label>
            <span className="mb-2 block text-base font-semibold text-verde-profundo">Profissional</span>
            <select className={cn(selectCls, 'h-[52px] w-full text-base')} defaultValue={users.medico.nome}>
              <option>{users.medico.nome}</option>
            </select>
          </label>
          <label>
            <span className="mb-2 block text-base font-semibold text-verde-profundo">Questionário</span>
            <select className={cn(selectCls, 'h-[52px] w-full text-base')} defaultValue="gineco">
              <option value="gineco">Ginecologia (exemplo)</option>
            </select>
          </label>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Btn type="submit">Criar convite</Btn>
        <Btn variante="texto" onClick={() => navigate('/painel/convites')}>
          Cancelar
        </Btn>
      </div>
    </form>
  );
}
