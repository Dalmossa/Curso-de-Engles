'use client';

import { useActionState } from 'react';
import { forgotPasswordAction, type ForgotPasswordState } from './actions';
import { buttonClasses } from '@/presentation/components/ui/button';
import { passwordReset } from '@/presentation/lib/copy';

const INITIAL_STATE: ForgotPasswordState = { result: null };

/**
 * The "forgot password" form.
 *
 * The form is a Client Component because it shows what the Server Action answered —
 * `useActionState` carries the result of the submission without a second round trip.
 * The action itself runs on the server; nothing here talks to the API.
 */
export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(forgotPasswordAction, INITIAL_STATE);

  const result = state.result;
  const succeeded = result !== null && result.ok;
  const devResetUrl = succeeded ? (result.data.devResetUrl ?? null) : null;

  return (
    <div className="flex flex-col gap-4">
      {succeeded && (
        <div role="status" className="flex flex-col gap-1 rounded-lg border border-subtle px-3 py-2">
          <p className="text-sm font-medium text-ink-900">{passwordReset.forgotSuccessTitle}</p>
          <p className="text-sm text-ink-600">{result.data.message}</p>
        </div>
      )}

      {result !== null && !result.ok && (
        <p role="alert" className="text-sm text-red-600">
          {result.error.detail || result.error.title}
        </p>
      )}

      {devResetUrl !== null && (
        <div className="flex flex-col gap-2 rounded-lg border border-subtle px-3 py-2">
          <p className="text-sm font-medium text-ink-900">{passwordReset.devTitle}</p>
          <p className="text-sm text-ink-600">{passwordReset.devDescription}</p>
          <a href={devResetUrl} className={buttonClasses('primary', 'sm')}>
            {passwordReset.devAction}
          </a>
        </div>
      )}

      <form action={formAction} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm" htmlFor="email">
          <span>{passwordReset.emailLabel}</span>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder={passwordReset.emailPlaceholder}
            className="rounded-lg border border-subtle px-3 py-2"
          />
        </label>
        <button type="submit" disabled={pending} className={buttonClasses('primary', 'lg')}>
          {pending ? passwordReset.forgotSubmitting : passwordReset.forgotSubmit}
        </button>
      </form>
    </div>
  );
}
