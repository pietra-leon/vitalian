// Downloads gerados no próprio navegador (Blob + link temporário).
// Nenhuma requisição de rede e nada gravado em armazenamento.
export function downloadText(filename: string, content: string, mime: string): void {
  const url = URL.createObjectURL(new Blob([content], { type: `${mime};charset=utf-8` }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** CSV com ponto e vírgula (padrão do Excel em português) e BOM para acentos. */
export function toCsv(header: string[], rows: string[][]): string {
  const cell = (s: string) => `"${s.replace(/"/g, '""')}"`;
  return '﻿' + [header, ...rows].map((r) => r.map(cell).join(';')).join('\r\n');
}
