// @vitest-environment node
import { describe, expect, it } from 'vitest';

import { DomainError, type DomainErrorKind } from '@/core';
import { domainErrorCopy } from '@/presentation/lib/copy';

const DETAIL = 'Falha sem classificação conhecida.';

function errorWithKind(kind: DomainErrorKind): DomainError {
  return new DomainError({
    kind,
    status: null,
    title: '',
    detail: DETAIL,
    problemType: null,
    requestId: null,
    retryAfterSeconds: null,
  });
}

describe('domainErrorCopy — kind desconhecido', () => {
  it('devolve o mesmo copy de unknown para um kind fora do contrato', () => {
    const copy = domainErrorCopy(errorWithKind('kind_inexistente' as DomainErrorKind));

    expect(copy).toEqual(domainErrorCopy(errorWithKind('unknown')));
    expect(copy.title).toBe('Algo deu errado');
    expect(copy.message).toBe(DETAIL);
  });

  it('não devolve undefined quando um bundle antigo serializa kind como undefined', () => {
    const copy = domainErrorCopy(errorWithKind(undefined as unknown as DomainErrorKind));

    expect(copy).toBeDefined();
    expect(copy.title).toBeDefined();
    expect(copy.message).toBeDefined();
  });
});
