'use client';

import { useActionState, useState, type FormEvent } from 'react';
import { resetPasswordAction, type ResetPasswordState } from './actions';
import { validateNewPassword } from '@/core';
import { buttonClasses } from '@/presentation/components/ui/button';
import { passwordProblemMessage, passwordReset } from '@/presentation/lib/copy';

const INITIAL_STATE: ResetPasswordState = { result: null };

interface ResetPasswordFormProps {
  /** The one-time token from the link; empty when the user has to type it. */
  readonly token: string;
}

/**
 * The "reset password" form.
 *
 * The confirmation is checked **here**, before the request leaves the browser: a typo in
 * a password field is invisible to whoever cannot read it, and the platform would have no
 * way of knowing that two fields were supposed to match. The server checks the length
 * again — a form can be posted by anything that can reach the page — but it never sees
 * the confirmation, because it has no meaning for it.
 */
export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [state, formAction, pending] = useActionState(resetPasswordAction, INITIAL_STATE);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const result = state.result;
  const failure = result !== null && !result.ok ? result.error : null;

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    const form = event.currentTarget;
    const data = new FormData(form);
    const newPassword = String(data.get('newPassword') ?? '');
    const confirmation = String(data.get('confirmPassword') ?? '');

    const validation = validateNewPassword(newPassword, confirmation);
    if (!validation.ok) {
      event.preventDefault();
      setPasswordError(passwordProblemMessage(validation.problem));
      return;
    }

    setPasswordError(null);
  }

  return (
    <div className="flex flex-col gap-4">
      {failure !== null && (
        <p role="alert" className="text-sm text-red-600">
          {failure.detail || failure.title}
        </p>
      )}

      <form action={formAction} onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm" htmlFor="token">
          <span>{passwordReset.tokenLabel}</span>
          <input
            id="token"
            name="token"
            type="text"
            required
            defaultValue={token}
            aria-describedby="token-hint"
            className="rounded-lg border border-subtle px-3 py-2 font-mono text-xs"
          />
          <span id="token-hint" className="text-xs text-ink-500">
            {passwordReset.tokenHint}
          </span>
        </label>

        <label className="flex flex-col gap-1 text-sm" htmlFor="newPassword">
          <span>{passwordReset.newPasswordLabel}</span>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            required
            minLength={8}
            maxLength={72}
            autoComplete="new-password"
            aria-invalid={passwordError !== null}
            aria-describedby={passwordError !== null ? 'newPassword-error' : undefined}
            className="rounded-lg border border-subtle px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm" htmlFor="confirmPassword">
          <span>{passwordReset.confirmPasswordLabel}</span>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            minLength={8}
            maxLength={72}
            autoComplete="new-password"
            aria-invalid={passwordError !== null}
            aria-describedby={passwordError !== null ? 'newPassword-error' : undefined}
            className="rounded-lg border border-subtle px-3 py-2"
          />
        </label>

        {passwordError !== null && (
          <p id="newPassword-error" role="alert" className="text-sm text-red-600">
            {passwordError}
          </p>
        )}

        <button type="submit" disabled={pending} className={buttonClasses('primary', 'lg')}>
          {pending ? passwordReset.resetSubmitting : passwordReset.resetSubmit}
        </button>
      </form>
    </div>
  );
}
