'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardBody } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { routes } from '@/shared/routes';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(routes.login);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface-sunken p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Bem-vindo ao ITS Platform</CardTitle>
        </CardHeader>
        <CardBody className="text-center">
          <p className="text-2xl text-ink-600 mb-6">
            Melhore seu inglês com lições interativas e prática de pronúncia.
          </p>
          <Button
            onClick={() => {
              router.replace(routes.login);
            }}
            className="w-full"
          >
            Começar a aprender
          </Button>
          <p className="mt-4 text-sm text-ink-500">
            Acesse sua conta para continuar sua trilha adaptativa.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}