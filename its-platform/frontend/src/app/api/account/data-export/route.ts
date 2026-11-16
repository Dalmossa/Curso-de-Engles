import { NextResponse } from 'next/server';

import { fetchAccountExport } from '@/infrastructure/account/account-bff.server';

/**
 * `GET /api/account/data-export` — the learner's own data, as a file.
 *
 * The LGPD's portability right (Art. 18, II and V) is a **right to a copy**, and a copy
 * that arrives as a JSON rendered into a page is not what the learner asked for. The
 * `Content-Disposition: attachment` header is what makes the browser download it.
 *
 * The filename carries the date: two exports on the same day would otherwise overwrite
 * each other in the download folder, and the learner would have to keep only one.
 */
export async function GET() {
  const response = await fetchAccountExport();

  if (response === null) {
    return NextResponse.json(
      { error: 'Não há sessão ativa para exportar.' },
      { status: 401 },
    );
  }

  if (!response.ok) {
    return NextResponse.json(
      { error: 'A plataforma recusou a exportação dos seus dados.' },
      { status: response.status },
    );
  }

  const body = await response.text();
  const stamp = new Date().toISOString().slice(0, 10);

  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': `attachment; filename="its-dados-${stamp}.json"`,
      'Cache-Control': 'no-store',
    },
  });
}
