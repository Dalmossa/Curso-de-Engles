export const routes = {
  home: '/',
  login: '/login',
  diagnostic: '/diagnostic',
  mastery: '/mastery',
  practice: '/practice',
  lesson: (lessonId: string) => `/lessons/${encodeURIComponent(lessonId)}`,
  lessonPractice: (lessonId: string, packId?: string) =>
    packId
      ? `/lessons/${encodeURIComponent(lessonId)}/practice?pack=${encodeURIComponent(packId)}`
      : `/lessons/${encodeURIComponent(lessonId)}/practice`,
} as const;
