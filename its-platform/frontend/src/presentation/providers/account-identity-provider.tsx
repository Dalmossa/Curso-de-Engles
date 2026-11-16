'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import type { AccountIdentity } from '@/core';

/**
 * A identidade da conta — o estado que o cabeçalho e a tela de conta compartilham.
 *
 * **Por que este contexto existe.** O cabeçalho mora no *layout raiz*, e o Next.js **não
 * re-renderiza o layout compartilhado** quando uma Server Action muda os dados por trás
 * dele: o layout é reaproveitado do cache do cliente. O defeito era visível e medido —
 * o `PATCH` chegava ao banco, a tela dizia "Perfil atualizado.", o servidor redesenhava o
 * layout com o nome novo (o log do servidor provava isso) e **o cliente não aplicava o
 * payload**: o cabeçalho continuava com o nome antigo.
 *
 * Nenhuma revalidação resolve, e a razão é a mesma nos três casos: `revalidatePath`,
 * `refresh` e `router.refresh()` **redesenham no servidor** e devolvem o layout novo —
 * mas o layout compartilhado que já está montado no cliente não é trocado. O dado estava
 * certo; o lugar onde ele é desenhado é que é um layout preservado.
 *
 * **A saída é fazer da identidade um estado do cliente, semeado pelo servidor.** O servidor
 * continua sendo a autoridade — é quem lê o perfil e quem grava — e a leitura continua
 * acontecendo no servidor, com a credencial do servidor. O que muda é que o valor que o
 * cabeçalho desenha passa a ser um valor que o cliente pode trocar na hora em que o dono
 * dele muda. É o mesmo desenho que o Next.js recomenda para o caso que é este: "uma shared
 * layout que busca os dados do usuário e mostra a imagem no menu" — os dados são buscados
 * no servidor e passados aos filhos por prop ou por um context provider.
 *
 * **A semente vem do servidor, e é semeada uma vez.** O `initialIdentity` é lido no layout
 * raiz, no servidor. O layout não é redesenhado no cliente (é o defeito que este
 * contexto resolve), então a semente não muda depois de montada — e o estado do cliente é
 * a verdade a partir daí. Um recarregamento da página volta ao servidor, e o servidor
 * devolve o nome novo.
 */
export interface AccountIdentityStore {
  /** A identidade atual. `null` quando não há sessão — e aí não há gatilho. */
  readonly identity: AccountIdentity | null;
  /** Publica a identidade nova, depois de uma gravação que deu certo. */
  readonly setIdentity: (identity: AccountIdentity) => void;
}

/**
 * O valor padrão é um contexto **vazio**, e não um erro: um componente que usa o hook
 * fora do provider (um teste, um STORYbook) recebe `null` e não renderiza gatilho nenhum.
 * Um contexto que lançaria seria um contexto que transformaria um engano de montagem em
 * uma tela quebrada.
 */
const AccountIdentityContext = createContext<AccountIdentityStore>({
  identity: null,
  setIdentity: () => undefined,
});

export function AccountIdentityProvider({
  initialIdentity,
  children,
}: {
  readonly initialIdentity: AccountIdentity | null;
  readonly children: ReactNode;
}) {
  const [identity, setIdentity] = useState<AccountIdentity | null>(initialIdentity);

  // A identidade é um objeto novo a cada gravação; a referência muda, o conteúdo não
  // precisa. `useCallback` mantém a função estável, para que um consumidor da store não
  // seja redesenhado só porque outro elemento da tela gravou o nome.
  const publish = useCallback((next: AccountIdentity) => {
    setIdentity(next);
  }, []);

  const store = useMemo<AccountIdentityStore>(
    () => ({ identity, setIdentity: publish }),
    [identity, publish],
  );

  return <AccountIdentityContext.Provider value={store}>{children}</AccountIdentityContext.Provider>;
}

/** A identidade da conta — e o meio de publicá-la. */
export function useAccountIdentity(): AccountIdentityStore {
  return useContext(AccountIdentityContext);
}
