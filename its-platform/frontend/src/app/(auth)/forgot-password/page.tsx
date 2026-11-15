import Link from 'next/link';
import { Card, CardBody, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { ForgotPasswordForm } from './forgot-password-form';
import { passwordReset } from '@/presentation/lib/copy';
import { routes } from '@/shared/routes';

/**
 * The public "forgot password" screen.
 *
 * It is a Server Component: the form itself is the Client Component, and the page only
 * lays it out. Nothing here needs an identity — the person who forgot the password is
 * not signed in, and the platform answers the same way for an unknown address.
 */
export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 items-start justify-center pt-12">
      <Card className="w-full">
        <CardHeader>
          <CardTitle as="h1">{passwordReset.forgotTitle}</CardTitle>
          <p className="text-sm text-ink-600">{passwordReset.forgotDescription}</p>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          <ForgotPasswordForm />
          <Link href={routes.login} className="text-sm text-ink-600 underline">
            {passwordReset.backToLogin}
          </Link>
        </CardBody>
      </Card>
    </div>
  );
}
