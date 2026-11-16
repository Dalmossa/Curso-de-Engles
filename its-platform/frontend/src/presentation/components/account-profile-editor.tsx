'use client';

import { useId, useRef, useState } from 'react';

import { AVATAR_MAX_LENGTH, type AccountIdentity } from '@/core';
import { updateAccountProfileAction } from '@/presentation/actions/account-actions';
import { account as copy } from '@/presentation/lib/copy';
import { AccountAvatar } from './account-avatar';

/**
 * O editor de nome e foto — a folha que abre sobre o avatar.
 *
 * **Ele é um Client Component porque precisa do ficheiro.** A foto é escolhida no
 * navegador, convertida num `data:` URL e **medida antes de ser enviada**: o teto da API
 * é de 100 KiB de *texto*, e um PNG de 100 KiB vira ~133 KiB de base64. Medir o data URL
 * pronto — e não o ficheiro — é o que mede a mesma coisa que a API mede, e evita a
 * ida-e-volta para descobrir que a imagem é grande demais.
 *
 * **A conversão acontece no navegador, e o ficheiro nunca sai daqui.** O `FileReader`
 * produz o `data:` URL e é esse texto que viaja — o ficheiro em si não é enviado a
 * lugar nenhum, e a imagem não passa por um servidor de terceiros.
 *
 * **O erro é dito na tela, não engolido.** O `ActionResult` volta do servidor com o
 * `DomainError` serializado, e a mensagem é reconstruída aqui — a mesma que `ErrorState`
 * mostraria em qualquer outra tela. Uma falha silenciosa deixaria o aluno achando que
 * salvou.
 */
export interface AccountProfileEditorProps {
  readonly identity: AccountIdentity;
  readonly onCancel: () => void;
  readonly onSaved: (identity: AccountIdentity) => void;
}

export function AccountProfileEditor({ identity, onCancel, onSaved }: AccountProfileEditorProps) {
  const nameId = useId();
  const avatarId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [displayName, setDisplayName] = useState(identity.displayName ?? '');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(identity.avatarUrl);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function onPickFile(file: File | undefined) {
    if (file === undefined) return;

    setError(null);
    setSaved(false);

    const dataUrl = await readAsDataUrl(file);
    if (dataUrl === null) {
      setError(copy.avatarInvalid);
      return;
    }

    if (dataUrl.length > AVATAR_MAX_LENGTH) {
      setError(copy.avatarInvalid);
      return;
    }

    setAvatarUrl(dataUrl);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    setSaved(false);

    const result = await updateAccountProfileAction({
      displayName: displayName.trim().length === 0 ? null : displayName,
      avatarUrl,
    });

    setPending(false);

    if (!result.ok) {
      setError(result.error.detail || result.error.title || copy.nameInvalid);
      return;
    }

    setSaved(true);
    onSaved(result.data);
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 p-4" noValidate>
      <div>
        <h2 className="text-base font-semibold text-ink-900">{copy.editProfileTitle}</h2>
        <p className="mt-1 text-sm text-ink-600">{copy.editProfileDescription}</p>
      </div>

      <div className="flex items-center gap-4">
        <AccountAvatar
          avatarUrl={avatarUrl}
          displayName={displayName.trim().length === 0 ? null : displayName}
          cefrLevel={identity.cefrLevel}
          size={64}
        />
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-fit rounded-full border border-border-strong px-3 py-1.5 text-sm font-medium text-ink-700 transition-colors hover:bg-surface-sunken focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          >
            {avatarUrl === null ? copy.avatarChoose : copy.avatarChange}
          </button>
          {avatarUrl !== null && (
            <button
              type="button"
              onClick={() => setAvatarUrl(null)}
              className="w-fit text-xs text-ink-600 underline transition-colors hover:text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
            >
              {copy.avatarRemove}
            </button>
          )}
          <p className="text-xs text-ink-500">{copy.avatarHint}</p>
        </div>
        <input
          ref={fileInputRef}
          id={avatarId}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="sr-only"
          onChange={(event) => {
            void onPickFile(event.target.files?.[0]);
          }}
        />
      </div>

      <label htmlFor={nameId} className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-ink-700">{copy.displayNameLabel}</span>
        <input
          id={nameId}
          name="displayName"
          type="text"
          value={displayName}
          maxLength={80}
          placeholder={copy.displayNamePlaceholder}
          onChange={(event) => setDisplayName(event.target.value)}
          className="rounded-lg border border-subtle bg-surface-raised px-3 py-2 text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        />
        <span className="text-xs text-ink-500">{copy.displayNameHint}</span>
      </label>

      {error !== null && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
      {saved && (
        <p role="status" className="text-sm text-green-700">
          {copy.saved}
        </p>
      )}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={pending}
          className="rounded-lg px-3 py-2 text-sm font-medium text-ink-700 transition-colors hover:bg-surface-sunken disabled:opacity-55 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
          {copy.cancel}
        </button>
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-55 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
          {pending ? copy.saving : copy.save}
        </button>
      </div>
    </form>
  );
}

/**
 * O ficheiro como `data:` URL, ou `null` quando ele não é uma imagem que a plataforma
 * aceita.
 *
 * **O tipo é conferido aqui e não só pelo `accept` do input.** O `accept` é uma dica para
 * o seletor do sistema operacional — não é uma restrição, e um ficheiro arrastado para a
 * página ignora-o. O `type` declarado pelo ficheiro é verificado contra a lista que a
 * API aceita, e o `data:` URL é conferido contra a mesma regra.
 */
function readAsDataUrl(file: File): Promise<string | null> {
  const allowed = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
  if (!allowed.includes(file.type)) return Promise.resolve(null);

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onerror = () => resolve(null);
    reader.onload = () => {
      const result = reader.result;
      resolve(typeof result === 'string' ? result : null);
    };
    reader.readAsDataURL(file);
  });
}
