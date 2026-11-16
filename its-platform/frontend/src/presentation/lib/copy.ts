import type {
  ActivityType,
  CefrLevel,
  DomainError,
  MasteryBand,
  PasswordProblem,
  SelectionRule,
  UnavailableReason,
} from '@/core';
import { humanizeIdentifier } from '@/shared/format';

/**
 * Every Portuguese string in the interface, in one module.
 *
 * `core/` deliberately carries no copy: it decides *what* something is (`kind:
 * 'rate_limited'`, `band: 'developing'`) and this module decides how to say it. That split
 * is what lets a test assert on `thumb.verdict === 'incorrect'` without matching on
 * accented text, and what keeps a wording change from touching the domain.
 */

const SKILL_LABELS: Readonly<Record<string, string>> = {
  grammar: 'Gramática',
  vocab: 'Vocabulário',
  reading: 'Leitura',
  pronunciation: 'Pronúncia',
  listening: 'Compreensão auditiva',
  coherence: 'Coerência',
};

const MASTERY_BAND_LABELS: Readonly<Record<MasteryBand, string>> = {
  not_started: 'Não iniciado',
  emerging: 'Inicial',
  developing: 'Em desenvolvimento',
  approaching: 'Quase lá',
  mastered: 'Dominado',
};

const SELECTION_RULE_LABELS: Readonly<Record<SelectionRule, string>> = {
  mastery_gate: 'Domínio pendente',
  prerequisite: 'Pré-requisito',
  spaced_review: 'Revisão espaçada',
  diagnostic_followup: 'Continuação do diagnóstico',
};

const SELECTION_RULE_EXPLANATIONS: Readonly<Record<SelectionRule, string>> = {
  mastery_gate: 'Escolhemos esta atividade porque há habilidades abaixo da meta de domínio.',
  prerequisite: 'Esta atividade desbloqueia conteúdos que dependem dela.',
  spaced_review: 'Está na hora de revisar para a memória durar mais.',
  diagnostic_followup: 'O diagnóstico apontou este como o próximo passo.',
};

const ACTIVITY_TYPE_LABELS: Readonly<Record<ActivityType, string>> = {
  lesson: 'Lição',
  practice_pack: 'Pacote de prática',
  listening: 'Compreensão auditiva',
  review: 'Revisão',
};

const UNAVAILABLE_REASON_MESSAGES: Readonly<Record<UnavailableReason, string>> = {
  not_implemented: 'Este tipo de atividade ainda não tem tela nesta versão da interface.',
  malformed_identifier: 'A plataforma devolveu um identificador inválido para esta atividade.',
};

/** Unknown skill ids are shown, humanised — never dropped. */
export function skillLabel(skill: string): string {
  return SKILL_LABELS[skill] ?? humanizeIdentifier(skill);
}

export function masteryBandLabel(band: MasteryBand): string {
  return MASTERY_BAND_LABELS[band];
}

export function selectionRuleLabel(rule: SelectionRule): string {
  return SELECTION_RULE_LABELS[rule];
}

export function selectionRuleExplanation(rule: SelectionRule): string {
  return SELECTION_RULE_EXPLANATIONS[rule];
}

export function activityTypeLabel(activityType: ActivityType): string {
  return ACTIVITY_TYPE_LABELS[activityType];
}

export function unavailableReasonMessage(reason: UnavailableReason): string {
  return UNAVAILABLE_REASON_MESSAGES[reason];
}

/**
 * `null` is a real state, not a missing value: the learner's `cefr_level` is `null` until
 * a diagnostic has been completed, and the screen has to say that rather than pick a band.
 */
export function cefrLabel(level: CefrLevel | null): string {
  return level ?? 'Não avaliado';
}

export interface ErrorCopy {
  readonly title: string;
  readonly message: string;
  /** What the learner can do about it. Empty when there is nothing useful to say. */
  readonly action: string;
  readonly showRetry: boolean;
}

export function domainErrorCopy(error: DomainError): ErrorCopy {
  switch (error.kind) {
    case 'network':
      return {
        title: 'Não conseguimos falar com a plataforma',
        message: 'A conexão falhou ou demorou demais. Verifique sua internet e tente de novo.',
        action: 'Tentar novamente',
        showRetry: true,
      };
    case 'unauthorized':
      return {
        title: 'Sua sessão não está ativa',
        message:
          'A plataforma exige uma credencial válida e nenhuma foi apresentada. Enquanto a autenticação não estiver definida (ADR-013), o ambiente de desenvolvimento precisa de ITS_API_TOKEN configurado.',
        action: '',
        showRetry: false,
      };
    case 'forbidden':
      return {
        title: 'Sua credencial não autoriza esta ação',
        message: 'Você está autenticado, mas sem permissão para este conteúdo.',
        action: '',
        showRetry: false,
      };
    case 'not_found':
      return {
        title: 'Não encontramos este conteúdo',
        message:
          'Ele pode ter sido removido, ou não estar liberado para exibição. A plataforma responde a mesma coisa nos dois casos.',
        action: '',
        showRetry: false,
      };
    case 'invalid_input':
      return {
        title: 'Os dados enviados não foram aceitos',
        message: error.detail || 'Revise o formulário e tente novamente.',
        action: '',
        showRetry: false,
      };
    case 'rate_limited':
      return {
        title: 'Muitas solicitações em pouco tempo',
        message:
          error.retryAfterSeconds === null
            ? 'Aguarde um instante antes de tentar de novo.'
            : `Tente de novo em ${error.retryAfterSeconds} s.`,
        action: 'Tentar novamente',
        showRetry: true,
      };
    case 'server':
      return {
        title: 'A plataforma falhou ao responder',
        message: 'O problema é do nosso lado, não dos seus dados.',
        action: 'Tentar novamente',
        showRetry: true,
      };
    case 'invalid_response':
      return {
        title: 'A resposta da plataforma veio em um formato inesperado',
        message:
          'Isso indica uma divergência entre o contrato publicado e o que a API devolveu — um defeito a ser corrigido, não algo que você fez.',
        action: '',
        showRetry: false,
      };
    case 'unknown':
      return {
        title: 'Algo deu errado',
        message: error.detail || 'Não foi possível concluir a operação.',
        action: 'Tentar novamente',
        showRetry: false,
      };
  }
}

/**
 * The correlation id (CONSTITUTION.md §4.6), rendered so a learner can quote it in a bug
 * report. Absent for transport-level failures, where no server ever assigned one.
 */
export function requestIdHint(error: DomainError): string | null {
  return error.requestId === null ? null : `Código da requisição: ${error.requestId}`;
}

/**
 * Screen-reader text for the loading skeletons, one per route that has one.
 *
 * A skeleton is decorative — each block is `aria-hidden` — so this single sentence is the
 * whole of what assistive technology gets. It names the destination instead of repeating
 * "carregando": "which screen is coming" is what a sighted learner reads off the shape of
 * the placeholders, and it is precisely what is invisible to everyone else.
 */
export const LOADING_LABELS = {
  /** The root fallback in `app/loading.tsx`, for routes without a skeleton of their own. */
  generic: 'Carregando a página…',
  dashboard: 'Carregando o painel do aprendiz…',
  lesson: 'Carregando a lição…',
  practice: 'Carregando o pacote de prática…',
  mastery: 'Carregando o progresso por habilidade…',
  diagnostic: 'Carregando o formulário de diagnóstico…',
} as const;

export interface EmptyStateCopy {
  readonly title: string;
  readonly description: string;
  /**
   * The one action that fills the panel. Every empty state in this slice has one: an empty
   * panel that only says "sem dados" restates what the learner already sees and tells them
   * nothing they can do about it.
   */
  readonly actionLabel: string;
}

/** The panels that can be empty. Named so the record's type fits on one line. */
export type EmptyStateKey = 'nextActivity' | 'mastery' | 'practicePack';

/**
 * The empty states, worded so each one is a next step rather than an apology.
 *
 * `description` never claims a cause it cannot observe — "a plataforma devolveu o pacote
 * sem itens" is what happened; "o conteúdo foi removido" would be a guess.
 */
export const EMPTY_STATE_COPY: Readonly<Record<EmptyStateKey, EmptyStateCopy>> = {
  nextActivity: {
    title: 'Nenhuma atividade recomendada agora',
    description:
      'A plataforma não indicou um próximo passo para este aprendiz. Enquanto isso, o progresso por habilidade mostra onde a prática está rendendo.',
    actionLabel: 'Ver progresso por habilidade',
  },
  mastery: {
    title: 'Ainda não há domínio medido',
    description:
      'Nenhuma habilidade tem domínio estimado até agora. A primeira prática preenche este painel; o diagnóstico de colocação define o seu ponto de partida.',
    actionLabel: 'Fazer o diagnóstico',
  },
  practicePack: {
    title: 'Este pacote não tem itens',
    description:
      'A plataforma devolveu o pacote sem nenhum item para responder, então não há o que enviar. Volte para a lição e escolha outra prática.',
    actionLabel: 'Voltar para a lição',
  },
};

/**
 * Pronunciation practice copy — História 1 (TTS) e História 2 (Avaliação).
 */
export const pronunciation = {
  practiceTitle: 'Prática de pronúncia',
  practiceDescription:
    'Ouça a frase, depois grave sua voz para receber feedback palavra por palavra.',
  listen: 'Ouvir',
  practice: 'Praticar',
  play: 'Reproduzir',
  pause: 'Pausar',
  stop: 'Parar',
  speed: 'Velocidade',
  targetPhrase: 'Frase-alvo',
  currentTarget: 'Alvo atual',
  phase: 'Fase',
  yourTranscript: 'O que você disse',
  noTranscript: '(nada reconhecido)',
  overallScore: 'Pontuação geral',
  wordScores: 'Pontuação por palavra',
  contrastiveTips: 'Dicas (pt-BR → en-US)',
  grammarTipButton: 'Dica de Gramática',
  grammarTipLoading: 'Buscando dica…',
  grammarTipTitle: 'Apoio gramatical',
  grammarTipEmpty: 'Nenhuma dica gramatical encontrada para este tema no momento.',
  grammarTipError: 'Não foi possível carregar a dica gramatical agora.',
  progress: 'Progresso',
  targetNavigation: 'Navegação entre alvos',
  startRecording: 'Iniciar gravação',
  stopRecording: 'Parar gravação',
  rerecord: 'Gravar novamente',
  generating: 'Gerando áudio…',
  regenerateAudio: 'Regerar áudio',
  processing: 'Avaliando sua pronúncia…',
  noRecording: 'Nenhuma gravação ou transcrição disponível.',
  noAudio: 'Áudio não disponível para esta frase.',
  fallbackNotice: 'Usando síntese de voz do navegador (sem servidor de TTS configurado).',
  usingBrowserTTS: 'Síntese do navegador',
  micPermissionDenied: 'Permissão de microfone negada. Permita o acesso ao microfone nas configurações do navegador.',
  micError: 'Não foi possível acessar o microfone.',
  asrUnavailable: 'Serviço de reconhecimento de fala não configurado. Use o reconhecimento do navegador ou configure ASR_SERVICE_URL.',
  evaluationFailed: 'Falha ao avaliar a pronúncia. Tente novamente.',
  tryAgain: 'Tentar novamente',
  phaseLabel: 'Fase',
  liveTranscript: 'Transcrição ao vivo',
} as const;

export const pronunciationMastery = {
  title: 'Prática Oral e Pronúncia',
  description: 'Evolução das suas tentativas de pronúncia e palavras para reforçar.',
  totalAttempts: 'Total de tentativas',
  averageScore: 'Média',
  bestScore: 'Melhor nota',
  weakWords: 'Palavras para Reforçar',
  noAttempts: 'Nenhuma tentativa de pronúncia registrada ainda. Pratique em uma lição para ver sua evolução aqui.',
  playWord: 'Ouvir palavra',
  loading: 'Carregando histórico de pronúncia…',
  unavailable: 'Não foi possível carregar o histórico de pronúncia agora.',
} as const;

/**
 * Password recovery copy — the "forgot password" and "reset password" screens.
 *
 * The confirmation text is the same one the platform sends, and it never says whether
 * the account exists: the wording a learner reads must not reveal more than the answer
 * the API gave.
 */
export const passwordReset = {
  forgotTitle: 'Recuperar senha',
  forgotDescription:
    'Informe o e-mail cadastrado. Se houver uma conta, enviaremos as instruções para definir uma nova senha.',
  emailLabel: 'E-mail',
  emailPlaceholder: 'voce@exemplo.com',
  forgotSubmit: 'Enviar instruções',
  forgotSubmitting: 'Enviando…',
  forgotSuccessTitle: 'Solicitação recebida',
  forgotSuccessMessage:
    'Se o e-mail estiver cadastrado, você receberá as instruções de redefinição de senha.',
  devTitle: 'Ambiente de laboratório',
  devDescription:
    'Não há servidor de e-mail configurado neste ambiente. Use o link abaixo para redefinir a senha agora.',
  devAction: 'Redefinir senha agora',
  resetTitle: 'Definir nova senha',
  resetDescription: 'Escolha uma nova senha para acessar sua conta.',
  tokenLabel: 'Token de redefinição',
  tokenHint:
    'O token vem no link enviado por e-mail. Você também pode digitá-lo aqui.',
  newPasswordLabel: 'Nova senha',
  confirmPasswordLabel: 'Confirmar nova senha',
  resetSubmit: 'Salvar nova senha',
  resetSubmitting: 'Salvando…',
  backToLogin: 'Voltar para o login',
  forgotLink: 'Esqueci minha senha',
  loginResetSuccess: 'Senha redefinida com sucesso. Faça login com a nova senha.',
  passwordTooShort: 'A senha precisa ter pelo menos 8 caracteres.',
  passwordTooLong: 'A senha pode ter no máximo 72 caracteres.',
  passwordMismatch: 'As senhas não conferem.',
  tokenMissing: 'O link de redefinição não traz um token. Solicite um novo link.',
} as const;

/**
 * Account and privacy copy — the global header's profile menu and the `/account` screen.
 *
 * **The wording assumes the learner is in control.** "Gerenciar sua Conta e Privacidade" is
 * the label the platform's own account screen carries, and it is chosen over "Privacidade"
 * alone because a menu item that says "Privacidade" sounds like a read-only policy page;
 * the learner is about to *choose* things, and the label should say so.
 *
 * **The destructive action says what it does.** "Excluir minha conta" is not "Excluir
 * dados" and not "Encerrar sessão" — the three are different things, and the learner has to
 * be able to tell them apart at a glance.
 */
export const account = {
  /** The profile trigger's accessible name, when the learner has no chosen name. */
  triggerLabel: 'Abrir o menu da conta',
  triggerLabelNamed: (name: string) => `Abrir o menu da conta de ${name}`,
  /** The close button at the top of the popover. */
  close: 'Fechar',
  /** The identity card. */
  unnamed: 'Aprendiz',
  emailMissing: 'Sem e-mail cadastrado',
  levelLabel: 'Nível',
  levelMissing: 'Nível não avaliado',
  /** The editor that opens from the pencil on the avatar. */
  editProfile: 'Editar perfil',
  editProfileTitle: 'Editar nome e foto',
  editProfileDescription:
    'Escolha como a plataforma vai chamar você. A foto é opcional e pode ser removida a qualquer momento.',
  displayNameLabel: 'Nome de exibição',
  displayNamePlaceholder: 'Como a plataforma deve chamar você?',
  displayNameHint: 'De 1 a 80 caracteres.',
  avatarLabel: 'Foto',
  avatarChoose: 'Escolher foto',
  avatarChange: 'Trocar foto',
  avatarRemove: 'Remover foto',
  avatarHint: 'PNG, JPEG, WEBP ou GIF, até 100 KiB.',
  avatarInvalid: 'Escolha uma imagem PNG, JPEG, WEBP ou GIF de até 100 KiB.',
  nameInvalid: 'O nome deve ter entre 1 e 80 caracteres.',
  save: 'Salvar',
  saving: 'Salvando…',
  cancel: 'Cancelar',
  saved: 'Perfil atualizado.',
  /** The accounts accordion. */
  accounts: 'Contas',
  currentAccount: 'Esta conta',
  /** The session block. */
  addAnotherAccount: 'Adicionar outra conta',
  signOut: 'Sair',
  /** The footer pill. */
  manageAccount: 'Gerenciar sua Conta e Privacidade',
  /** The `/account` screen. */
  pageTitle: 'Conta e Privacidade',
  pageDescription:
    'Os dados que a plataforma guarda sobre você, e o que você pode fazer com eles.',
  personalDataTitle: 'Dados Pessoais',
  personalDataDescription:
    'Seu nome de exibição e a sua foto. O e-mail é o endereço com que você entra — a plataforma não o altera por aqui.',
  emailLabel: 'E-mail',
  securityTitle: 'Segurança e Senha',
  securityDescription:
    'A senha da sua conta. Você pode definir uma nova a qualquer momento, e a redefinição envia as instruções para o seu e-mail.',
  changePassword: 'Redefinir minha senha',
  privacyTitle: 'Privacidade e LGPD',
  privacyDescription:
    'A Lei Geral de Proteção de Dados (LGPD) garante que você pode pedir uma cópia de tudo o que a plataforma guarda sobre você, e pode encerrar a sua conta.',
  exportData: 'Exportar meus dados (LGPD)',
  exporting: 'Preparando a exportação…',
  exportDescription:
    'O download é um arquivo JSON com tudo o que a plataforma guarda sobre você.',
  dangerTitle: 'Zona de perigo',
  dangerDescription:
    'Excluir sua conta apaga os seus dados de aprendizagem e encerra o acesso. A ação é definitiva e não pode ser desfeita.',
  deleteAccount: 'Excluir minha conta',
  deleteConfirmPrompt: 'Para confirmar, digite EXCLUIR abaixo.',
  deleteConfirmWord: 'EXCLUIR',
  deleteConfirmMismatch: 'Digite EXCLUIR para confirmar.',
  deleting: 'Excluindo…',
  deleteAcknowledged: 'Entendo que esta ação é definitiva.',
  /** The login screen, in "add another account" mode. */
  switchAccountNotice:
    'Você está adicionando outra conta. Entre com a conta que quer usar agora — a sessão atual será substituída.',
} as const;

/**
 * The message for a rejected password.
 *
 * The domain decides *which* problem happened; this decides how it is said. A switch
 * without a default is deliberate: adding a reason to the domain without a sentence
 * here would be a compile error, not a silent blank.
 */
export function passwordProblemMessage(problem: PasswordProblem): string {
  switch (problem) {
    case 'too_short':
      return passwordReset.passwordTooShort;
    case 'too_long':
      return passwordReset.passwordTooLong;
    case 'mismatch':
      return passwordReset.passwordMismatch;
  }
}

/**
 * Aggregated copy object for components that prefer a single import.
 * Includes all domain-specific copy namespaces.
 */
export const copy = {
  pronunciation,
  pronunciationMastery,
  passwordReset,
  account,
  // Re-export existing functions for backward compatibility
  skillLabel,
  masteryBandLabel,
  selectionRuleLabel,
  selectionRuleExplanation,
  activityTypeLabel,
  unavailableReasonMessage,
  cefrLabel,
  domainErrorCopy,
  requestIdHint,
  LOADING_LABELS,
  EMPTY_STATE_COPY,
} as const;
