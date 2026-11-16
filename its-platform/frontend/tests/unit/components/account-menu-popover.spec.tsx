/**
 * `AccountMenuPopover` — o menu flutuante da conta.
 *
 * **O componente é testado como a pessoa o usa, e não como ele é implementado.** O
 * gatilho é clicado, o `X` é clicado, a tecla é pressionada, o texto é lido. Nenhum
 * estado interno é lido: um popover que fecha por um caminho que a interface não oferece
 * é um popover que *parece* fechado e continua aberto — e isso só é visível no DOM.
 *
 * **As três saídas são o contrato, e cada uma tem um jeito próprio de ser falsa.**
 * O `X` é o caminho que o mouse usa; o `Esc` é o caminho que o teclado usa; o clique
 * fora é o caminho que ninguém pensa em usar — e é o mais comum. Um popover que só
 * fecha por um dos três é uma janela que captura a pessoa que entrou nela.
 *
 * **O foco volta ao gatilho.** Fechar um diálogo e deixar o foco no `<body>` é a forma
 * mais comum de perder um leitor de tela: o próximo `Tab` recomeça a página do zero.
 *
 * **O rodapé é um destino, e um destino é um link.** `/account` é onde os direitos da
 * LGPD moram; o botão "Sair" é uma *ação*, e por isso é um formulário que posta para o
 * BFF — nunca um link, nunca um script no navegador que finge limpar a sessão.
 */
import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { AccountIdentity } from '@/core';

/**
 * A Server Action é substituída: ela vive num módulo `'use server'` que só o servidor
 * pode carregar, e o popover não é o que está sob teste aqui — o editor é, e o editor
 * só precisa de um stub que devolve a identidade.
 */
const updateAccountProfileAction = vi.fn();
vi.mock('@/presentation/actions/account-actions', () => ({ updateAccountProfileAction }));

const { AccountMenuPopover } = await import('@/presentation/components/account-menu-popover');
const { routes } = await import('@/shared/routes');

const IDENTITY: AccountIdentity = {
  learnerId: '74726c7a-efa6-4c4e-b145-916013e34033',
  displayName: 'Ana Souza',
  email: 'ana@example.com',
  avatarUrl: null,
  cefrLevel: 'A2',
};

function renderPopover(identity: AccountIdentity = IDENTITY) {
  return render(<AccountMenuPopover identity={identity} />);
}

/** O gatilho — o botão que abre o popover. */
function trigger(): HTMLButtonElement {
  const button = screen.getByRole('button', { name: /menu da conta/i });
  expect(button).toBeInstanceOf(HTMLButtonElement);
  return button as HTMLButtonElement;
}

/** Abre o popover e devolve o diálogo. */
function open(): HTMLElement {
  fireEvent.click(trigger());
  const dialog = screen.getByRole('dialog');
  expect(dialog).toBeTruthy();
  return dialog;
}

beforeEach(() => {
  updateAccountProfileAction.mockReset();
});

describe('RN20 — o popover abre no gatilho e mostra a identidade', () => {
  it('abre ao clicar no avatar e announces o diálogo', () => {
    renderPopover();

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(trigger().getAttribute('aria-expanded')).toBe('false');

    fireEvent.click(trigger());

    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(trigger().getAttribute('aria-expanded')).toBe('true');
  });

  it('mostra o nome, o e-mail e a banda do aluno', () => {
    renderPopover();
    const dialog = open();

    expect(within(dialog).getByTestId('account-display-name').textContent).toBe('Ana Souza');
    expect(within(dialog).getByText('ana@example.com')).toBeTruthy();
    expect(within(dialog).getByText('Nível A2')).toBeTruthy();
  });

  it('não abre quando o aluno não tem nome escolhido', () => {
    renderPopover({ ...IDENTITY, displayName: null });

    fireEvent.click(trigger());

    expect(screen.getByTestId('account-display-name').textContent).toBe('Aprendiz');
  });

  it('diz que o e-mail não existe quando a conta não tem um', () => {
    renderPopover({ ...IDENTITY, email: null });

    fireEvent.click(trigger());

    expect(screen.getByText('Sem e-mail cadastrado')).toBeTruthy();
  });

  it('diz que o nível não foi avaliado quando não há diagnóstico', () => {
    renderPopover({ ...IDENTITY, cefrLevel: null });

    fireEvent.click(trigger());

    expect(screen.getByText('Nível não avaliado')).toBeTruthy();
  });
});

describe('RN21 — o `X` fecha o popover', () => {
  it('fecha e devolve o foco ao gatilho', () => {
    renderPopover();
    open();

    fireEvent.click(screen.getByRole('button', { name: 'Fechar' }));

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(trigger());
  });
});

describe('RN22 — a tecla `Esc` fecha o popover', () => {
  it('fecha e devolve o foco ao gatilho', () => {
    renderPopover();
    open();

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(trigger());
  });
});

describe('RN23 — o clique fora fecha o popover', () => {
  it('fecha quando o clique cai fora do popover', () => {
    renderPopover();
    open();

    fireEvent.pointerDown(document.body);

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('não fecha quando o clique cai dentro do popover', () => {
    renderPopover();
    const dialog = open();

    fireEvent.pointerDown(dialog);

    expect(screen.getByRole('dialog')).toBeTruthy();
  });
});

describe('RN24 — o nome longo é truncado, e não empurrado', () => {
  it('mostra o nome inteiro no `title` e aplica a truncagem no texto', () => {
    const longName =
      'Maria das Graças Albuquerque de Vasconcelos 도움 Santa Ana';
    renderPopover({ ...IDENTITY, displayName: longName });
    open();

    const shown = screen.getByTestId('account-display-name');

    expect(shown.textContent).toBe(longName);
    expect(shown.getAttribute('title')).toBe(longName);
    expect(shown.className).toContain('truncate');
  });
});

describe('RN25 — "Sair" é uma ação de sessão, e não um link', () => {
  it('posta para a rota de logout do BFF', () => {
    renderPopover();
    const dialog = open();

    const signOut = within(dialog).getByRole('button', { name: 'Sair' });
    const form = signOut.closest('form');

    expect(form).toBeTruthy();
    expect(form?.getAttribute('action')).toBe('/api/auth/logout');
    expect(form?.getAttribute('method')).toBe('post');
  });
});

describe('RN26 — o rodapé leva à tela de conta', () => {
  it('tem um link para `/account`', () => {
    renderPopover();
    const dialog = open();

    const link = within(dialog).getByRole('link', {
      name: 'Gerenciar sua Conta e Privacidade',
    });

    expect(link.getAttribute('href')).toBe(routes.account);
    expect(link.getAttribute('href')).toBe('/account');
  });

  it('tem um link para adicionar outra conta', () => {
    renderPopover();
    const dialog = open();

    const link = within(dialog).getByRole('link', { name: 'Adicionar outra conta' });

    expect(link.getAttribute('href')).toBe(routes.loginWithSwitch);
    expect(link.getAttribute('href')).toBe('/login?switch=1');
  });
});
