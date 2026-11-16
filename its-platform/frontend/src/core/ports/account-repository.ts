import type { AccountIdentity, AccountProfilePatch } from '../entities/account';

/**
 * A conta do aluno — o que se lê e o que se corrige.
 *
 * **Um port só, e não uma extensão do `LearnerRepository`.** O `LearnerRepository` é o
 * portfólio de aprendizagem (domínio, FSRS); a conta é outro artefacto, com outro dono no
 * banco (`users`) e outra rota de escrita (`PATCH …/profile`). Misturá-los faria a leitura
 * do progresso depender de um cadastro que a tela de progresso não tem por que tocar — e a
 * escrita de um nome arrastaria a assinatura de um método que nada mais usa.
 *
 * `learnerId` é um parâmetro explícito, e não algo que a implementação lê de uma sessão
 * ambiente: os casos de uso continuam puros e testáveis, e resolver o id é trabalho da
 * infraestrutura (`identity/`), no servidor — o navegador nunca nomeia um learner, e por
 * isso não pode pedir a conta de outro.
 */
export interface AccountRepository {
  /** A identidade tal como está. */
  getIdentity(learnerId: string): Promise<AccountIdentity>;
  /**
   * Corrige o nome e/ou o avatar, e devolve a identidade como ela ficou.
   *
   * Um membro ausente é *"não mexa"*; um membro `null` é *"limpe"*. A distinção é do
   * contrato e atravessa o port intacta — por isso o tipo é `string | null` e não
   * `string`, e por isso `undefined` e `null` não são o mesmo valor.
   */
  updateProfile(learnerId: string, patch: AccountProfilePatch): Promise<AccountIdentity>;
}
