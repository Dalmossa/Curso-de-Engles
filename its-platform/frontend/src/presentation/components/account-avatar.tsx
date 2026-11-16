import type { CefrLevel } from '@/core';
import { UNNAMED_ACCOUNT_FALLBACK } from '@/core';
import { cn } from '@/shared/utils/cn';

/**
 * O avatar do aluno — a foto, ou as iniciais quando não há foto.
 *
 * **Um Server Component, sem interatividade.** A imagem é um `<img>` e as iniciais são
 * texto; nada aqui precisa de estado, e o que faz o avatar mudar de forma é o *editor*,
 * que mora no popover. O que este componente decide é o **fallback** — e o fallback não é
 * um desenho genérico: são as iniciais do nome, ou a letra "A" de "Aprendiz" quando não
 * há nome nenhum.
 *
 * **O anel é o nível, e o anel é decorativo.** A cor do anel varia com a banda CEFR, e a
 * banda também aparece **em texto** ao lado do nome — no popover e na tela de conta. Um
 * anel colorido é um segundo canal de informação, não o único: quem não distingue verde
 * de azul ainda lê "Nível A1".
 *
 * **A foto é desenhada por um `<img>` com `object-cover`** — e nunca por um `div` com
 * `background-image`, porque o `alt` de uma foto de perfil é a informação que um leitor de
 * tela precisa, e um `div` não a tem.
 */
export interface AccountAvatarProps {
  readonly avatarUrl: string | null;
  readonly displayName: string | null;
  readonly cefrLevel: CefrLevel | null;
  /** The pixel size of the square. The header's trigger and the popover's card differ. */
  readonly size?: number;
  readonly className?: string;
  /** Rendered over the image — the pencil, in the popover's identity card. */
  readonly children?: React.ReactNode;
}

/** As iniciais de um nome: a primeira letra do primeiro e do último nome. */
export function initialsOf(displayName: string | null): string {
  if (displayName === null) return 'A';

  const words = displayName.trim().split(/\s+/).filter((word) => word.length > 0);
  if (words.length === 0) return 'A';

  const first = words[0]?.[0] ?? '';
  const last = words.length > 1 ? (words[words.length - 1]?.[0] ?? '') : '';

  return (first + last).toUpperCase();
}

/** A cor do anel, por banda. Uma rampa só — e o texto sempre acompanha a cor. */
const RING_BY_LEVEL: Readonly<Record<CefrLevel, string>> = {
  A1: 'from-ink-300 to-ink-500',
  A2: 'from-brand-300 to-brand-500',
  B1: 'from-brand-500 to-brand-700',
  B2: 'from-success-400 to-success-600',
  C1: 'from-warning-400 to-warning-600',
  C2: 'from-danger-400 to-danger-600',
};

export function AccountAvatar({
  avatarUrl,
  displayName,
  cefrLevel,
  size = 40,
  className,
  children,
}: AccountAvatarProps) {
  const name = displayName ?? UNNAMED_ACCOUNT_FALLBACK;
  const ring = cefrLevel === null ? 'from-ink-200 to-ink-400' : RING_BY_LEVEL[cefrLevel];

  return (
    <span
      className={cn('relative inline-flex shrink-0 items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <span
        aria-hidden="true"
        className={cn(
          'absolute inset-0 rounded-full bg-gradient-to-br p-[2px]',
          ring,
        )}
      />
      <span
        className="absolute inset-[3px] overflow-hidden rounded-full bg-surface-sunken"
        style={{ inset: 3 }}
      >
        {avatarUrl === null ? (
          <span
            aria-hidden="true"
            className="flex h-full w-full items-center justify-center bg-brand-100 text-sm font-semibold text-brand-700"
          >
            {initialsOf(displayName)}
          </span>
        ) : (
          // The avatar is a user-supplied `https://` or `data:` URL; the next/image
          // optimizer cannot fetch either without a network round trip the BFF does
          // not authorise — and a `data:` URL has no origin to optimise from.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={`Foto de ${name}`}
            className="h-full w-full object-cover"
            width={size}
            height={size}
          />
        )}      </span>
      {children}
    </span>
  );
}
