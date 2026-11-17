import { Download, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/app/components/ui/sheet';
import { Btn } from '@/components/form/Btn';
import { fmtDateTime } from '@/lib/dates';
import { downloadText } from '@/lib/download';
import { type Note, useClinic } from '@/state/ClinicContext';
import { campo } from '../questionario/SuggestDialog';

export function notesToMarkdown(notes: Note[], now: Date): string {
  const head = `# Anotações da validação · Vitalian\n\nGeradas em ${fmtDateTime(now)} · ${notes.length} ${notes.length === 1 ? 'anotação' : 'anotações'}\n`;
  const body = [...notes]
    .reverse()
    .map(
      (n, i) =>
        `\n## ${i + 1}. [${n.tipo}] ${n.origem}\n\n*${fmtDateTime(n.quando)}*\n\n${n.comentario}\n` +
        (n.porque ? `\n**Por que importa:** ${n.porque}\n` : ''),
    )
    .join('');
  return head + (body || '\nNenhuma anotação registrada.\n');
}

/** Anotações da validação: registro do feedback em tempo real, durante a call. */
export function NotesSheet() {
  const { notes, notesOpen, setNotesOpen, addNote, deleteNote } = useClinic();
  const [livre, setLivre] = useState('');

  return (
    <Sheet open={notesOpen} onOpenChange={setNotesOpen}>
      <SheetContent side="right" className="w-[92%] gap-0 overflow-y-auto border-borda bg-creme sm:max-w-md">
        <SheetHeader className="pr-12">
          <SheetTitle className="font-titulo text-2xl text-verde-profundo">Anotações da validação</SheetTitle>
          <SheetDescription className="text-[15px] text-texto-2">
            Ficam só nesta sessão. Baixe o arquivo antes de fechar ou recarregar a página.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-5 px-4 pb-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!livre.trim()) return;
              addNote({ origem: 'Anotação livre', tipo: 'Livre', comentario: livre.trim() });
              setLivre('');
            }}
          >
            <label htmlFor="nota-livre" className="mb-1.5 block text-[15px] font-semibold text-verde-profundo">
              Anotação livre
            </label>
            <textarea
              id="nota-livre"
              rows={2}
              className={campo}
              placeholder="Ex.: Disposição a pagar: por paciente triada"
              value={livre}
              onChange={(e) => setLivre(e.target.value)}
            />
            <Btn type="submit" variante="contorno" className="mt-2 min-h-11 py-2 text-[15px]">
              Adicionar
            </Btn>
          </form>

          <Btn
            className="w-full"
            disabled={notes.length === 0}
            onClick={() => downloadText('anotacoes-validacao-vitalian.md', notesToMarkdown(notes, new Date()), 'text/markdown')}
          >
            <Download aria-hidden="true" />
            Baixar anotações (.md)
          </Btn>

          {notes.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-texto-2 p-4 text-[15px] text-texto-2">
              Nenhuma anotação ainda. Use "Sugerir alteração" em uma pergunta ou regra, "O que acha?" nas opções de
              entrega, ou escreva acima.
            </p>
          ) : (
            <ul className="space-y-3">
              {notes.map((n) => (
                <li key={n.id} className="rounded-2xl border border-borda bg-superficie p-3">
                  <div className="flex items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] text-texto-2 tabular-nums">{fmtDateTime(n.quando)}</p>
                      <p className="text-[15px] font-semibold text-verde-profundo">
                        <span className="mr-1.5 rounded-full bg-verde-claro px-2 py-0.5 text-[13px] font-medium">{n.tipo}</span>
                        {n.origem}
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label={`Apagar anotação: ${n.origem}`}
                      className="flex size-11 shrink-0 items-center justify-center rounded-xl text-verde-profundo hover:bg-verde-claro"
                      onClick={() => deleteNote(n.id)}
                    >
                      <Trash2 className="size-[18px]" aria-hidden="true" />
                    </button>
                  </div>
                  <p className="mt-1 text-[15px] break-words whitespace-pre-wrap text-verde-profundo">{n.comentario}</p>
                  {n.porque ? (
                    <p className="mt-1 text-[14px] break-words text-texto-2">Por que importa: {n.porque}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
