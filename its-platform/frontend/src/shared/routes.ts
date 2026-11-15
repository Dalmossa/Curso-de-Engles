export const routes = {
  home: '/',
  login: '/login',
  /** The login page after a successful password reset — it shows the confirmation. */
  loginWithResetSuccess: '/login?reset=success',
  diagnostic: '/diagnostic',
  mastery: '/mastery',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  /** The reset page with the one-time token already in it. */
  resetPasswordWithToken: (token: string) =>
    `/reset-password?token=${encodeURIComponent(token)}`,
  lesson: (lessonId: string) => `/lessons/${encodeURIComponent(lessonId)}`,
  lessonPractice: (lessonId: string, packId?: string) =>
    packId
      ? `/lessons/${encodeURIComponent(lessonId)}/practice?pack=${encodeURIComponent(packId)}`
      : `/lessons/${encodeURIComponent(lessonId)}/practice`,
} as const;
