import Link from 'next/link';
import { Card, CardBody, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { ResetPasswordForm } from './reset-password-form';
import { passwordReset } from '@/presentation/lib/copy';
import { routes } from '@/shared/routes';

interface PageProps {
  /** The one-time token travels in the query string of the link sent by e-mail. */
  readonly searchParams?: Promise<{ token?: string }>;
}

/**
 * The public "reset password" screen.
 *
 * The token arrives in the query string; when it is missing the form still renders and
 * asks for it, because a link can be truncated, copied without its query, or opened by
 * hand. The token itself is never logged and never leaves the browser in a URL the page
 * builds.
 */
export default async function ResetPasswordPage({ searchParams }: PageProps) {
  const params = (await searchParams) || {};
  const token = typeof params.token === 'string' ? params.token.trim() : '';

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 items-start justify-center pt-12">
      <Card className="w-full">
        <CardHeader>
          <CardTitle as="h1">{passwordReset.resetTitle}</CardTitle>
          <p className="text-sm text-ink-600">{passwordReset.resetDescription}</p>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          {token === '' && (
            <p role="status" className="text-sm text-ink-600">
              {passwordReset.tokenMissing}
            </p>
          )}
          <ResetPasswordForm token={token} />
          <Link href={routes.login} className="text-sm text-ink-600 underline">
            {passwordReset.backToLogin}
          </Link>
        </CardBody>
      </Card>
    </div>
  );
}
