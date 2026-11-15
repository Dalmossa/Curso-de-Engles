/**
 * A recuperação de senha, em termos de domínio.
 *
 * `ForgotPasswordResult` carrega o par `devResetToken`/`devResetUrl` porque o laboratório
 * não tem servidor de e-mail: sem esses dois campos o fluxo seria impossível de testar
 * fora da produção. Em produção a plataforma **não** os envia — e a interface só os
 * mostra se eles chegarem.
 *
 * `message` é a mensagem do servidor, e é sempre a mesma para um e-mail cadastrado e
 * para um e-mail inexistente: a existência da conta não pode ser revelada por esta tela.
 */

export interface ForgotPasswordResult {
  /** A confirmação que o servidor devolveu — genérica por contrato. */
  readonly message: string;
  /** Token de redefinição; presente **apenas** fora de produção. */
  readonly devResetToken?: string | null;
  /** Link de redefinição; presente **apenas** fora de produção. */
  readonly devResetUrl?: string | null;
}

/** A resposta de uma redefinição concluída. */
export interface ResetPasswordResult {
  /** A confirmação que o servidor devolveu. */
  readonly message: string;
}

/** O que a tela de redefinição envia. */
export interface ResetPasswordInput {
  readonly token: string;
  readonly newPassword: string;
}
