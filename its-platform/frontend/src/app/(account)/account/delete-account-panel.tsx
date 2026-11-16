'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { account as copy } from '@/presentation/lib/copy';

/**
 * A zona de perigo — a única parte da tela `/account` que pode destruir algo.
 *
 * **A confirmação é digitada, não clicada.** Um botão "Excluir minha conta" que apaga
 * a conta no primeiro clique é a falha de usabilidade mais cara que existe — e a mais
 * comum (Nielsen: *prevenção de erros*; a destructive-action de Material 3 exige uma
 * confirmação explícita pelo mesmo motivo). O aluno precisa **digitar** `EXCLUIR`: a
 * palavra é o que prova que ele leu, e a digitação é o que prova que ele quis dizer.
 *
 * **A palavra é conferida no servidor também.** A tela confere para dar o feedback
 * imediato; o BFF confere para que um `POST` direto não apague nada. Uma confirmação que
 * existe só na interface é uma confirmação que não existe.
 *
 * **A palavra é comparada em claro, e não é um segredo.** A confirmação é enviada como um
 * campo de formulário; `EXCLUIR` não é uma credencial, é um sinal de que a pessoa leu o
 * aviso. Por isso ele pode ser comparado em claro — e por isso ele **não** aparece em
 * nenhum log.
 */
export function DeleteAccountPanel() {
  const router = useRouter();
  const [confirmation, setConfirmation] = useState('');
  const [acknowledged, setAcknowledged] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const matches = confirmation.trim() === copy.deleteConfirmWord;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!matches) {
      setError(copy.deleteConfirmMismatch);
      return;
    }

    setPending(true);

    const response = await fetch('/api/account/delete', { method: 'POST' });

    if (response.redirected) {
      router.push(response.url);
      return;
    }

    setPending(false);
    setError('A plataforma recusou a exclusão da sua conta.');
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3" noValidate>
      <p className="text-sm text-ink-600">{copy.dangerDescription}</p>

      <label className="flex items-start gap-2 text-sm text-ink-700">
        <input
          type="checkbox"
          checked={acknowledged}
          onChange={(event) => setAcknowledged(event.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-border-strong text-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        />
        <span>{copy.deleteAcknowledged}</span>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-ink-700">{copy.deleteConfirmPrompt}</span>
        <input
          type="text"
          value={confirmation}
          onChange={(event) => setConfirmation(event.target.value)}
          autoComplete="off"
          spellCheck={false}
          aria-invalid={confirmation.length > 0 && !matches}
          className="w-fit rounded-lg border border-subtle bg-surface-raised px-3 py-2 font-mono text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        />
      </label>

      {error !== null && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={pending || !acknowledged || !matches}
          className="rounded-lg bg-danger-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-danger-700 disabled:cursor-not-allowed disabled:opacity-55 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
          {pending ? copy.deleting : copy.deleteAccount}
        </button>
      </div>
    </form>
  );
}
