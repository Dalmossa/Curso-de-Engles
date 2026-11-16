/**
 * A identidade do aluno — a linha de `users` que responde pelo nome, pelo e-mail e pelo avatar.
 *
 * **Por que um repositório só para isto.** O perfil (`LearnerProfileRepository`) lê quatro fontes do
 * *portfólio de aprendizagem* — `learners`, `diagnostic_results`, `learner_mastery` e
 * `fsrs_states` — e cada uma tem uma tabela que a possui. A identidade mora em outra tabela,
 * `users`, com outra chave (`learner_id`, não `id`) e outras regras. Um repositório por artefacto
 * é o que mantém a frase *"cada membro é função de um artefacto"* verdadeira: quando o perfil
 * ganhar um membro novo, a pergunta é *que tabela o possui?*, e a resposta traz o repositório
 * junto.
 *
 * **A tabela `users` não tem RLS.** Só `learners` tem a política `learner_isolation`; `users` é
 * lida e escrita pela camada de autenticação, que trabalha por sessão e não por contexto de
 * aluno. A consequência é concreta e está escrita em cada consulta abaixo: **o predicado
 * `learner_id = $1` não é redundante, é a fronteira**. Sem ele, uma consulta a `users` dentro de
 * uma transação de aluno devolveria a conta de qualquer outro aluno — a política não a filtra,
 * porque a política não existe ali.
 *
 * Por isso as duas consultas repetem o predicado, e por isso ele **não** é o mesmo `$1` em todas
 * as formas: em `read` ele é o único parâmetro; em `update` ele é o primeiro, e os valores
 * gravados são os seguintes, para que nenhum valor interpolate a consulta.
 *
 * **A transação é obrigatória.** `tx` não é opcional aqui, pelo mesmo motivo que não é opcional
 * em `LearnerProfileRepository`: `SET LOCAL` é um no-op fora de uma transação, e a consulta de
 * `users` precisa correr na mesma transação que `LearnerScopeService` abriu — a mesma em que a
 * visibilidade do aluno foi decidida. Uma leitura fora dela seria uma leitura sem o contexto da
 * política, e o predicado passaria a ser a única defesa (o que ele é, de todo modo — mas a
 * leitura *completa* da linha de `users` também tem de estar dentro do contexto em que a
 * visibilidade foi decidida).
 *
 * **O e-mail é uma coluna, não um segredo.** Ele sai daqui porque o titular da conta precisa
 * reconhecê-lo — é o endereço de login. Nenhum hash, nenhum token e nenhum identificador de
 * sessão atravessa esta classe.
 */

import { Injectable } from '@nestjs/common';
import type { QueryRunner } from 'typeorm';

import type {
  LearnerIdentity,
  LearnerIdentityPatch,
} from '../../domain/entities/learner-identity.js';

@Injectable()
export class UserIdentityRepository {
  /**
   * A identidade do aluno — ou `null`, quando não há conta para este `learner_id`.
   *
   * `null` é uma resposta honesta e não uma falha: `users.learner_id` é anulável, e um aluno sem
   * conta (o que o registro de dados de teste produz) tem uma identidade que ainda não foi
   * preenchida. Um chamador que trate `null` como erro estará mentindo sobre um estado que o
   * banco permite.
   */
  async read(learnerId: string, tx: QueryRunner): Promise<LearnerIdentity | null> {
    const rows = (await tx.query(
      'SELECT email, display_name, avatar_url FROM users WHERE learner_id = $1 LIMIT 1',
      [learnerId],
    )) as Array<{ email: string; display_name: string | null; avatar_url: string | null }>;

    const row = rows[0];
    if (row === undefined) return null;

    return {
      email: row.email,
      displayName: row.display_name,
      avatarUrl: row.avatar_url,
    };
  }

  /**
   * Grava os membros que o corpo trouxe e devolve a identidade resultante.
   *
   * `undefined` — *"não mexa neste campo"* — é o mesmo que o patch não o traz, e por isso o
   * `SET` é montado a partir dos membros **presentes**, e não a partir de todos os membros
   * possíveis: um `PATCH` que não menciona o avatar não pode, nem por acidente, apagá-lo.
   *
   * `updated_at` é escrito à mão porque a tabela não tem trigger (`pg_trigger` está vazia para
   * `users`): sem ele, a linha pareceria nunca ter sido tocada.
   */
  async update(
    learnerId: string,
    patch: LearnerIdentityPatch,
    tx: QueryRunner,
  ): Promise<LearnerIdentity | null> {
    const assignments: string[] = [];
    const params: unknown[] = [learnerId];

    if (patch.displayName !== undefined) {
      params.push(patch.displayName);
      assignments.push(`display_name = $${params.length}`);
    }

    if (patch.avatarUrl !== undefined) {
      params.push(patch.avatarUrl);
      assignments.push(`avatar_url = $${params.length}`);
    }

    if (assignments.length === 0) {
      // Nada a gravar: a resposta é a identidade como ela está, e o `UPDATE` é omitido para que
      // um `PATCH` vazio não mova `updated_at` sem ter mudado nada.
      return this.read(learnerId, tx);
    }

    // `tx.query(..., true)` asks TypeORM for the **structured** result, and that is not a
    // detail: for an `UPDATE`, the plain form returns `[rows, rowCount]` and not the rows
    // themselves (`PostgresQueryRunner.query` switches on the command), so `rows[0]` would be
    // the array and every member read from it would be `undefined`. The structured result puts
    // the rows in `records`, for every command.
    const result = await tx.query(
      `UPDATE users SET ${assignments.join(', ')}, updated_at = now() ` +
        'WHERE learner_id = $1 RETURNING email, display_name, avatar_url',
      params,
      true,
    );

    const rows = result.records as Array<{
      email: string;
      display_name: string | null;
      avatar_url: string | null;
    }>;

    const row = rows[0];
    if (row === undefined) return null;

    return {
      email: row.email,
      displayName: row.display_name,
      avatarUrl: row.avatar_url,
    };
  }
}
