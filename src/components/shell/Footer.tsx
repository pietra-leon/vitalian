import { PrivacySheet } from './PrivacySheet';

/** Rodapé discreto. */
export function Footer() {
  return (
    <footer className="mt-10 flex items-center justify-center gap-1 border-t border-borda pt-2 text-[15px] text-texto-2">
      <span>Vitalian</span>
      <span aria-hidden="true">·</span>
      <PrivacySheet />
    </footer>
  );
}
