import { useEffect, useState, type ReactNode } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Btn } from '@/components/form/Btn';
import { useClinic } from '@/state/ClinicContext';

const tipos = ['Remover', 'Alterar', 'Incluir', 'Dúvida'];
export const campo =
  'w-full rounded-xl border-[1.5px] border-texto-2/70 bg-superficie px-3 py-2.5 text-base text-verde-profundo placeholder:text-texto-2';

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  /** De onde veio a anotação, ex.: "Regra: Possível gestação junto com dor ou sangramento". */
  origem: string;
  title?: string;
  /** Texto explicativo (usado nas opções de entrega). */
  children?: ReactNode;
  /** Opinião simples, sem escolher tipo. */
  opiniao?: boolean;
}

/** Registra uma sugestão ou opinião do médico na lista de anotações da validação. */
export function SuggestDialog({ open, onOpenChange, origem, title, children, opiniao }: Props) {
  const { addNote } = useClinic();
  const [tipo, setTipo] = useState('Alterar');
  const [comentario, setComentario] = useState('');
  const [porque, setPorque] = useState('');
  const [erro, setErro] = useState(false);

  useEffect(() => {
    if (open) {
      setTipo('Alterar');
      setComentario('');
      setPorque('');
      setErro(false);
    }
  }, [open]);

  const salvar = () => {
    if (!comentario.trim()) return setErro(true);
    addNote({ origem, tipo: opiniao ? 'Opinião' : tipo, comentario: comentario.trim(), porque: porque.trim() || undefined });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-2xl border-borda bg-superficie">
        <DialogHeader className="text-left">
          <DialogTitle className="font-titulo pr-6 text-2xl leading-tight text-verde-profundo">
            {title ?? 'Sugerir alteração'}
          </DialogTitle>
          <DialogDescription className="text-[15px] text-texto-2">{origem}</DialogDescription>
        </DialogHeader>
        {children}
        {opiniao ? null : (
          <fieldset>
            <legend className="mb-2 text-[15px] font-semibold text-verde-profundo">Tipo</legend>
            <div className="flex flex-wrap gap-2">
              {tipos.map((t) => (
                <label
                  key={t}
                  className="opcao flex min-h-11 cursor-pointer items-center rounded-full border-[1.5px] border-texto-2/70 px-4 text-[15px] font-medium text-verde-profundo has-[:checked]:border-verde has-[:checked]:bg-verde has-[:checked]:text-creme"
                >
                  <input type="radio" name="tipo-sugestao" className="sr-only" checked={tipo === t} onChange={() => setTipo(t)} />
                  {t}
                </label>
              ))}
            </div>
          </fieldset>
        )}
        <div>
          <label htmlFor="sug-comentario" className="mb-1.5 block text-[15px] font-semibold text-verde-profundo">
            {opiniao ? 'O que acha desta opção?' : 'Comentário'}
          </label>
          <textarea
            id="sug-comentario"
            rows={3}
            className={campo}
            value={comentario}
            aria-invalid={erro || undefined}
            aria-describedby="sug-erro"
            onChange={(e) => {
              setComentario(e.target.value);
              setErro(false);
            }}
          />
          <p id="sug-erro" aria-live="polite" className="mt-1 text-[14px] font-medium text-salmao-profundo">
            {erro ? 'Escreva um comentário para salvar a anotação.' : ''}
          </p>
        </div>
        <div>
          <label htmlFor="sug-porque" className="mb-1.5 block text-[15px] font-semibold text-verde-profundo">
            Por que isso importa na sua rotina? <span className="font-normal text-texto-2">(opcional)</span>
          </label>
          <textarea id="sug-porque" rows={2} className={campo} value={porque} onChange={(e) => setPorque(e.target.value)} />
        </div>
        <DialogFooter className="gap-2">
          <Btn variante="texto" onClick={() => onOpenChange(false)}>
            Cancelar
          </Btn>
          <Btn onClick={salvar}>Salvar anotação</Btn>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
