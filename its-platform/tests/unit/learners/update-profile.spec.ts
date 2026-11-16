/**
 * A identidade do aluno — `PATCH /learners/{learner_id}/profile` — provada em três lugares.
 *
 * O que este arquivo fixa são três decisões que nenhuma delas sobrevive sozinha:
 *
 * 1. **O que é um avatar aceitável** é uma regra de **segurança**, não de formatação: um `data:`
 *    URL é same-origin com a página que o renderiza, e um SVG é um documento ativo — então SVG,
 *    `http://` e `javascript:` são recusados. A regra mora no domínio
 *    (`src/domain/entities/learner-identity.ts`), e o DTO apenas a transcreve.
 * 2. **"Opcional" tem três estados** — ausente (*não mexa*), `null` (*limpe*) e um valor (*use*).
 *    Um `PATCH` que não menciona o avatar não pode, nem por acidente, apagá-lo.
 * 3. **A escrita é condicionada à visibilidade** — e a visibilidade é decidida **antes** da
 *    escrita, dentro da transação do chamador. Uma escrita para a linha de outro aluno não é
 *    "recusada depois": ela não acontece.
 *
 * O DTO é exercitado pelo **`ValidationPipe` real**, com as mesmas opções do `configureApp`
 * (`whitelist`, `forbidNonWhitelisted`, `transform`): um dublê de validador provaria o dublê.
 */

import { ValidationPipe } from '@nestjs/common';
import type { ArgumentMetadata } from '@nestjs/common';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import {
  AVATAR_MAX_LENGTH,
  isAllowedAvatar,
  normalizeDisplayName,
} from '../../../src/domain/entities/learner-identity.js';
import { UpdateProfileDto } from '../../../src/modules/learners/dto/update-profile.dto.js';
import { LearnersService } from '../../../src/modules/learners/learners.service.js';
import type { LearnerProfileRepository } from '../../../src/infrastructure/repositories/learner-profile.repository.js';
import type { UserIdentityRepository } from '../../../src/infrastructure/repositories/user-identity.repository.js';
import type { LearnerScopeService } from '../../../src/modules/learners/learner-scope.service.js';

const SUBJECT = '3f2a1c44-9b7e-4a01-8c4d-1e2f3a4b5c6d';
const ADDRESSED = '9b7e4a01-8c4d-1e2f-3a4b-5c6d3f2a1c44';

/** O `ValidationPipe` do `configureApp` — as mesmas quatro opções, para que o teste seja o real. */
const PIPE = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  transformOptions: { enableImplicitConversion: true },
});

const BODY: ArgumentMetadata = { type: 'body', metatype: UpdateProfileDto };

/**
 * Valida um corpo como o pipe global faria, e devolve as mensagens que ele devolveria.
 *
 * O `ValidationPipe` **lança** `BadRequestException` quando um corpo é recusado — esta função
 * é a mesma regra vista do outro lado, para que o teste possa afirmar *o que* foi recusado em vez
 * de afirmar apenas que houve uma recusa.
 */
async function validateBody(payload: unknown): Promise<string[]> {
  try {
    await PIPE.transform(payload, BODY);
    return [];
  } catch (error) {
    if (error instanceof BadRequestException) {
      const message = (error.getResponse() as { message?: unknown }).message;
      if (Array.isArray(message)) return message.map(entry => String(entry));
      if (typeof message === 'string') return [message];
      return [];
    }
    throw error;
  }
}

// ---------------------------------------------------------------------------
// O dublê do serviço: o repositório de identidade em memória e o gate de visibilidade
// ---------------------------------------------------------------------------

interface IdentityStore {
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
}

/** O repositório de identidade, em memória — e o registo do que ele recebeu. */
function identityRepository(store: IdentityStore | null) {
  const received: Array<{ displayName?: string | null; avatarUrl?: string | null }> = [];

  const repository = {
    read: jest.fn(async () => (store === null ? null : { ...store })),
    update: jest.fn(async (_learnerId: string, patch: { displayName?: string | null; avatarUrl?: string | null }) => {
      received.push(patch);
      if (store === null) return null;
      if (patch.displayName !== undefined) store.displayName = patch.displayName;
      if (patch.avatarUrl !== undefined) store.avatarUrl = patch.avatarUrl;
      return { ...store };
    }),
  };

  return { repository: repository as unknown as UserIdentityRepository, received };
}

/** O repositório do perfil — o `cefr` do aluno, e nada mais. */
const PROFILE_REPOSITORY = {
  read: () => Promise.resolve({ cefr: 'B1', mastery: {}, fsrsStates: {} }),
} as unknown as LearnerProfileRepository;

/**
 * O gate de visibilidade: registra a pergunta e, quando o aluno não é visível, recusa com o
 * mesmo 404 que um aluno inexistente recebe (ADR-038 D3).
 */
function scopeService(visible: boolean) {
  const asked: Array<[string, string]> = [];

  const service = {
    requireVisible: async (subject: string, learnerId: string) => {
      asked.push([subject, learnerId]);
      if (!visible) throw new NotFoundException('Learner not found');
      return { id: learnerId, created_at: new Date(0), last_active_at: null };
    },
    withVisible: async <T>(
      subject: string,
      learnerId: string,
      work: (learner: { id: string; created_at: Date; last_active_at: null }, tx: unknown) => Promise<T>,
    ): Promise<T> => {
      asked.push([subject, learnerId]);
      if (!visible) throw new NotFoundException('Learner not found');
      return work({ id: learnerId, created_at: new Date(0), last_active_at: null }, {});
    },
  };

  return { service: service as unknown as LearnerScopeService, asked };
}

describe('RN10 — o nome de exibição é recortado antes de ser medido', () => {
  it('aceita um nome com espaços nas pontas e o entrega já recortado', async () => {
    const dto = (await PIPE.transform({ display_name: '  Ana Souza  ' }, BODY)) as UpdateProfileDto;

    expect(await validateBody({ display_name: '  Ana Souza  ' })).toEqual([]);
    expect(dto.display_name).toBe('Ana Souza');
  });

  it('recusa um nome que é só espaços — um nome de espaços não é um nome', async () => {
    const errors = await validateBody({ display_name: '     ' });

    expect(errors.length).toBeGreaterThan(0);
  });

  it('recusa um nome de 81 caracteres, e aceita um de 80', async () => {
    expect(await validateBody({ display_name: 'a'.repeat(81) })).not.toEqual([]);
    expect(await validateBody({ display_name: 'a'.repeat(80) })).toEqual([]);
  });

  it('recusa um nome que não é texto — a conversão implícita não pode mascará-lo', async () => {
    expect(await validateBody({ display_name: 123 })).not.toEqual([]);
  });
});

describe('RN11 — o avatar só é aceito em duas formas, e uma delas é uma regra de segurança', () => {
  it('aceita um https e um data URL de PNG', async () => {
    expect(await validateBody({ avatar_url: 'https://cdn.example.com/ana.png' })).toEqual([]);
    expect(
      await validateBody({ avatar_url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUg==' }),
    ).toEqual([]);
  });

  it('recusa um SVG — um documento ativo, servido na origem da página', async () => {
    expect(await validateBody({ avatar_url: 'data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=' })).not.toEqual(
      [],
    );
  });

  it('recusa http, javascript e um data URL que não é imagem', async () => {
    expect(await validateBody({ avatar_url: 'http://cdn.example.com/ana.png' })).not.toEqual([]);
    expect(await validateBody({ avatar_url: 'javascript:alert(1)' })).not.toEqual([]);
    expect(await validateBody({ avatar_url: 'data:text/html;base64,PGgxPm9pPC9oMT4=' })).not.toEqual([]);
  });

  it('recusa um data URL acima de 100 KiB de texto', async () => {
    const payload = 'A'.repeat(AVATAR_MAX_LENGTH + 1);

    expect(await validateBody({ avatar_url: `data:image/png;base64,${payload}` })).not.toEqual([]);
  });

  it('é a mesma regra no domínio — e ela recusa o que o DTO recusa', () => {
    expect(isAllowedAvatar('https://cdn.example.com/ana.png')).toBe(true);
    expect(isAllowedAvatar('data:image/png;base64,iVBORw0KGgoAAAANSUhEUg==')).toBe(true);
    expect(isAllowedAvatar('data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=')).toBe(false);
    expect(isAllowedAvatar('http://cdn.example.com/ana.png')).toBe(false);
    expect(isAllowedAvatar('javascript:alert(1)')).toBe(false);
  });
});

describe('RN12 — "opcional" tem três estados, e um membro não declarado é recusado', () => {
  it('aceita a ausência (não mexer) e o null (limpar) nos dois membros', async () => {
    expect(await validateBody({})).toEqual([]);
    expect(await validateBody({ display_name: null, avatar_url: null })).toEqual([]);
  });

  it('recusa um membro que o contrato não declara', async () => {
    expect(await validateBody({ displayName: 'Ana' })).not.toEqual([]);
    expect(await validateBody({ email: 'ana@example.com' })).not.toEqual([]);
    expect(await validateBody({ cefr_level: 'C1' })).not.toEqual([]);
  });

  it('normaliza um nome de espaços para ausente, e não para uma string vazia', () => {
    expect(normalizeDisplayName('   ')).toBeNull();
    expect(normalizeDisplayName(' Ana ')).toBe('Ana');
  });
});

describe('RN13 — a escrita mexe só nos membros que o corpo trouxe', () => {
  it('grava o nome e devolve a identidade com a banda', async () => {
    const store: IdentityStore = { email: 'ana@example.com', displayName: null, avatarUrl: null };
    const { repository, received } = identityRepository(store);
    const scope = scopeService(true);
    const service = new LearnersService(scope.service, PROFILE_REPOSITORY, repository);

    const body = await service.updateProfile(SUBJECT, ADDRESSED, {
      display_name: 'Ana Souza',
    } as UpdateProfileDto);

    expect(received).toEqual([{ displayName: 'Ana Souza' }]);
    expect(store.displayName).toBe('Ana Souza');
    expect(body).toEqual({
      learner_id: ADDRESSED,
      display_name: 'Ana Souza',
      email: 'ana@example.com',
      avatar_url: null,
      cefr_level: 'B1',
    });
  });

  it('não apaga o avatar que o corpo não mencionou', async () => {
    const store: IdentityStore = {
      email: 'ana@example.com',
      displayName: 'Ana',
      avatarUrl: 'https://cdn.example.com/ana.png',
    };
    const { repository, received } = identityRepository(store);
    const scope = scopeService(true);
    const service = new LearnersService(scope.service, PROFILE_REPOSITORY, repository);

    await service.updateProfile(SUBJECT, ADDRESSED, { display_name: 'Ana Souza' } as UpdateProfileDto);

    expect(received[0]).not.toHaveProperty('avatarUrl');
    expect(store.avatarUrl).toBe('https://cdn.example.com/ana.png');
  });

  it('limpa o avatar quando o corpo traz null', async () => {
    const store: IdentityStore = {
      email: 'ana@example.com',
      displayName: 'Ana',
      avatarUrl: 'https://cdn.example.com/ana.png',
    };
    const { repository } = identityRepository(store);
    const scope = scopeService(true);
    const service = new LearnersService(scope.service, PROFILE_REPOSITORY, repository);

    await service.updateProfile(SUBJECT, ADDRESSED, { avatar_url: null } as UpdateProfileDto);

    expect(store.avatarUrl).toBeNull();
  });
});

describe('RN14 — o aluno sem conta é uma recusa, não uma conta inventada', () => {
  it('responde 404 quando não há linha de `users` para o aluno', async () => {
    const { repository } = identityRepository(null);
    const scope = scopeService(true);
    const service = new LearnersService(scope.service, PROFILE_REPOSITORY, repository);

    await expect(
      service.updateProfile(SUBJECT, ADDRESSED, { display_name: 'Ana' } as UpdateProfileDto),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});

describe('RN15 — a visibilidade é decidida antes de qualquer escrita', () => {
  it('pergunta com o sujeito primeiro e o aluno endereçado segundo', async () => {
    const { repository } = identityRepository({
      email: 'ana@example.com',
      displayName: null,
      avatarUrl: null,
    });
    const scope = scopeService(true);
    const service = new LearnersService(scope.service, PROFILE_REPOSITORY, repository);

    await service.updateProfile(SUBJECT, ADDRESSED, { display_name: 'Ana' } as UpdateProfileDto);

    expect(scope.asked).toEqual([[SUBJECT, ADDRESSED]]);
  });

  it('não escreve nada quando o aluno endereçado não é visível', async () => {
    const store: IdentityStore = { email: 'ana@example.com', displayName: 'Ana', avatarUrl: null };
    const { repository, received } = identityRepository(store);
    const scope = scopeService(false);
    const service = new LearnersService(scope.service, PROFILE_REPOSITORY, repository);

    await expect(
      service.updateProfile(SUBJECT, ADDRESSED, { display_name: 'Outra' } as UpdateProfileDto),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(received).toEqual([]);
    expect(store.displayName).toBe('Ana');
  });
});
