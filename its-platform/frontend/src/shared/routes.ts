export const routes = {
  home: '/',
  login: '/login',
  /** The login page after a successful password reset — it shows the confirmation. */
  loginWithResetSuccess: '/login?reset=success',
  /**
   * The login page in "add another account" mode.
   *
   * The `switch` marker is what tells the login screen that the learner arrived here on
   * purpose, to sign in with a different account — and not by following a link that
   * expired. The screen reads it and says so; the marker changes nothing about *how* the
   * login works.
   */
  loginWithSwitch: '/login?switch=1',
  diagnostic: '/diagnostic',
  mastery: '/mastery',
  /** The account screen — the learner's own data, privacy and LGPD rights. */
  account: '/account',
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
