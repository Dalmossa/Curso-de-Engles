'use client';

import { useState } from 'react';

import { account as copy } from '@/presentation/lib/copy';

/**
 * O botão de exportação — a portabilidade da LGPD (Art. 18, II e V).
 *
 * **O download é um `GET` para uma rota do BFF, e não um `fetch` seguido de um blob.** A
 * diferença importa: uma rota com `Content-Disposition: attachment` deixa o navegador
 * tratar o ficheiro — nome, pasta, "abrir com" — como o utilizador espera, e funciona
 * sem JavaScript. Um blob montado à mão seria um caminho parallelo para o mesmo ficheiro,
 * e o caminho mais curto é o que a plataforma oferece.
 *
 * **O estado é visível.** O botão diz que está preparando, e a resposta da plataforma —
 * recusa ou sucesso — é dita na tela. Um botão que não reage é indistinguível de um
 * botão quebrado.
 */
export function ExportDataButton() {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onClick() {
    setPending(true);
    setMessage(null);

    try {
      const response = await fetch('/api/account/data-export');

      if (!response.ok) {
        setMessage('A plataforma recusou a exportação dos seus dados.');
        setPending(false);
        return;
      }

      // The route answers with the file itself; the browser downloads it. The `fetch`
      // here only asks whether the export is possible — the download is a navigation.
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `its-dados-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);

      setMessage('A exportação foi preparada. O download começa agora.');
    } catch {
      setMessage('Não conseguimos falar com a plataforma agora. Tente novamente em instantes.');
    }

    setPending(false);
  }

  return (
    <div className="flex flex-col gap-2">
      <div>
        <button
          type="button"
          onClick={() => void onClick()}
          disabled={pending}
          className="rounded-lg border border-border-strong px-4 py-2 text-sm font-medium text-ink-700 transition-colors hover:bg-surface-sunken disabled:cursor-not-allowed disabled:opacity-55 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
          {pending ? copy.exporting : copy.exportData}
        </button>
      </div>
      <p className="text-xs text-ink-500">{copy.exportDescription}</p>
      {message !== null && (
        <p role="status" className="text-sm text-ink-700">
          {message}
        </p>
      )}
    </div>
  );
}
