/**
 * LGPD Art. 7, 8 — Finalidades de consentimento granular.
 * Cada finalidade deve ser específica, informada e livre.
 */
export enum ConsentPurpose {
  /** Analytics de uso da plataforma (métricas agregadas, não identificáveis) */
  ANALYTICS = 'analytics',

  /** Comunicações de marketing (e-mail, push, newsletter) */
  MARKETING = 'marketing',

  /** Personalização da experiência de aprendizagem (recomendações adaptativas) */
  PERSONALIZATION = 'personalization',

  /** Compartilhamento com terceiros (parceiros educacionais, certificadoras) */
  THIRD_PARTY_SHARING = 'third_party_sharing',

  /** Processamento de dados sensíveis (dados de performance, dificuldades) */
  SENSITIVE_PROCESSING = 'sensitive_processing',
}

export const CONSENT_PURPOSE_LABELS: Record<ConsentPurpose, string> = {
  [ConsentPurpose.ANALYTICS]: 'Análise de uso da plataforma',
  [ConsentPurpose.MARKETING]: 'Comunicações de marketing',
  [ConsentPurpose.PERSONALIZATION]: 'Personalização da aprendizagem',
  [ConsentPurpose.THIRD_PARTY_SHARING]: 'Compartilhamento com terceiros',
  [ConsentPurpose.SENSITIVE_PROCESSING]: 'Processamento de dados sensíveis',
};

export const CONSENT_PURPOSE_DESCRIPTIONS: Record<ConsentPurpose, string> = {
  [ConsentPurpose.ANALYTICS]:
    'Coleta de métricas agregadas e anonimizadas para melhorar a plataforma. Não inclui dados identificáveis.',
  [ConsentPurpose.MARKETING]:
    'Envio de comunicações promocionais, newsletters e ofertas por e-mail ou notificações.',
  [ConsentPurpose.PERSONALIZATION]:
    'Uso do histórico de aprendizagem para recomendar lições, ajustar dificuldade e adaptar o conteúdo.',
  [ConsentPurpose.THIRD_PARTY_SHARING]:
    'Compartilhamento de dados com parceiros educacionais, certificadoras ou instituições de ensino.',
  [ConsentPurpose.SENSITIVE_PROCESSING]:
    'Processamento de dados sobre dificuldades de aprendizagem, performance detalhada e padrões de erro.',
};

export function isValidConsentPurpose(value: string): value is ConsentPurpose {
  return Object.values(ConsentPurpose).includes(value as ConsentPurpose);
}

export function getAllConsentPurposes(): ConsentPurpose[] {
  return Object.values(ConsentPurpose);
}
