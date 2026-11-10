/**
 * Constants shared across layers.
 *
 * `THEME_STORAGE_KEY` lives here rather than in the theme provider because the inline
 * no-flash script in the layout is a Server Component: importing a value from a module
 * marked `'use client'` would give the server a client *reference* rather than the string,
 * and the string is exactly what the script needs to interpolate.
 */
export const THEME_STORAGE_KEY = 'its-theme';

export const APP_NAME = 'ITS Platform';

export const APP_DESCRIPTION =
  'Plataforma de ensino de inglês para falantes de português do Brasil, com trilha técnica para profissionais de tecnologia.';
