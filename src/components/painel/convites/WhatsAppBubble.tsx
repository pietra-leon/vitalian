/** Prévia da mensagem de WhatsApp: balão estilizado em CSS (nada é enviado). */
export function WhatsAppBubble({ texto }: { texto: string }) {
  return (
    <div className="rounded-2xl bg-[#E5DDD5] p-4">
      <p className="relative ml-auto max-w-[92%] rounded-xl rounded-tr-none bg-[#DCF8C6] px-3 py-2 text-[15px] leading-snug break-words whitespace-pre-wrap text-[#1c1f0e] shadow-sm">
        {texto}
        <span className="mt-1 block text-right text-[11px] text-[#4a5a3c]" aria-hidden="true">
          agora ✓✓
        </span>
      </p>
    </div>
  );
}
