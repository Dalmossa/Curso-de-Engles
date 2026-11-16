/**
 * A Server Action que grava o perfil precisa dizer à interface que o dado mudou.
 *
 * **O defeito que este arquivo impede.** A gravação funcionava: o `PATCH` chegava à API, o
 * banco recebia o nome novo, a tela dizia "Perfil atualizado." — e o cabeçalho continuava
 * com o nome antigo. A causa não era o banco nem o cache do `fetch` (a camada HTTP pede
 * `cache: 'no-store'`): era que **uma Server Action que não revalida não redesenha a rota
 * atual**, e o cabeçalho mora no *layout raiz* — que o router cache do cliente mantém como
 * estava. O banco dizia uma coisa e a tela outra, e quem lê a tela é a pessoa.
 *
 * **O que é medido.** Três coisas, e as três são o contrato inteiro da chamada:
 *
 * 1. **A gravação acontece antes da revalidação** — revalidar antes de gravar publicaria um
 *    layout com o nome antigo, que é o mesmo defeito com outro nome.
 * 2. **A revalidação é a do layout raiz** (`revalidatePath('/', 'layout')`) — o cabeçalho é
 *    desenhado em *toda* rota, e uma revalidação mais estreita consertaria a tela que salvou
 *    e deixaria o resto da plataforma mentindo.
 * 3. **Uma falha não revalida** — revalidar depois de uma escrita que falhou redesenharia a
 *    página com o que já estava lá, gastando uma ida ao servidor para mostrar o mesmo dado.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DomainError, type AccountIdentity } from '@/core';

/**
 * Os dois módulos são substituídos: `next/cache` é o mecanismo que se quer observar, e o
 * container é `server-only` (o pacote `server-only` lança fora do ambiente de servidor, e o
 * Vitest não é esse ambiente).
 */
const { revalidatePath, getServerContext } = vi.hoisted(() => ({
  revalidatePath: vi.fn(),
  getServerContext: vi.fn(),
}));

vi.mock('next/cache', () => ({ revalidatePath }));
vi.mock('@/infrastructure/composition/server-container', () => ({ getServerContext }));

const { updateAccountProfileAction } = await import('@/presentation/actions/account-actions');

const LEARNER_ID = '74726c7a-efa6-4c4e-b145-916013e34033';

const IDENTITY: AccountIdentity = {
  learnerId: LEARNER_ID,
  displayName: 'Ana Souza',
  email: 'ana@example.com',
  avatarUrl: null,
  cefrLevel: 'A2',
};

/** O caso de uso de escrita — o único que esta action usa. */
const execute = vi.fn().mockResolvedValue(IDENTITY);

beforeEach(() => {
  revalidatePath.mockReset();
  execute.mockReset();
  execute.mockResolvedValue(IDENTITY);
  getServerContext.mockReset();
  getServerContext.mockResolvedValue({
    learnerId: LEARNER_ID,
    useCases: { updateAccountProfile: { execute } },
  });
});

describe('RN30 — a gravação do perfil redesenha o cabeçalho', () => {
  it('revalida o layout raiz, que é onde o cabeçalho é desenhado', async () => {
    const result = await updateAccountProfileAction({
      displayName: 'Ana Souza',
      avatarUrl: null,
    });

    expect(result.ok).toBe(true);
    expect(revalidatePath).toHaveBeenCalledTimes(1);
    expect(revalidatePath).toHaveBeenCalledWith('/', 'layout');
  });

  it('grava antes de revalidar — revalidar primeiro publicaria o nome antigo', async () => {
    await updateAccountProfileAction({ displayName: 'Ana Souza', avatarUrl: null });

    const writeOrder = execute.mock.invocationCallOrder[0] ?? 0;
    const revalidateOrder = revalidatePath.mock.invocationCallOrder[0] ?? 0;

    expect(writeOrder).toBeLessThan(revalidateOrder);
  });

  it('devolve a identidade gravada e envia o learner resolvido no servidor', async () => {
    const result = await updateAccountProfileAction({
      displayName: 'Ana Souza',
      avatarUrl: 'https://cdn.example.com/ana.png',
    });

    expect(result).toEqual({ ok: true, data: IDENTITY });
    expect(execute).toHaveBeenCalledWith(LEARNER_ID, {
      displayName: 'Ana Souza',
      avatarUrl: 'https://cdn.example.com/ana.png',
    });
  });

  it('não revalida quando a gravação falha — a tela mostra o erro e o dado continua o de antes', async () => {
    execute.mockRejectedValue(
      new DomainError({
        kind: 'invalid_input',
        status: 400,
        title: 'Nome inválido',
        detail: 'O nome deve ter entre 1 e 80 caracteres.',
        problemType: 'about:blank',
        requestId: 'req-1',
        retryAfterSeconds: null,
      }),
    );

    const result = await updateAccountProfileAction({
      displayName: 'x'.repeat(200),
      avatarUrl: null,
    });

    expect(result.ok).toBe(false);
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
