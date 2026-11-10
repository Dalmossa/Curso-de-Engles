/**
 * The practice smoke flow, end to end, on the real Next.js app talking to a fake ITS API.
 *
 * What this adds over the component specs is the *wiring*: that the dashboard's
 * recommendation resolves to the practice screen, that the Server Action reaches the API
 * with the letters the learner clicked, and — the reason the flow is worth a browser at
 * all — that the answer key does not exist anywhere in the document until the submission
 * result brings it (ADR-044).
 *
 * Two properties of this app shape the whole file:
 *
 * 1. The pages fetch server-side (`DirectApiGateway`, `server-only`, no BFF), so
 *    `page.route` cannot stand in for the API. `fixtures/mock-its-api.ts` is therefore a
 *    real HTTP server listening where the app is configured to look.
 * 2. Because of (1), the browser has no reason to call the API at all. That is asserted
 *    rather than assumed: `guardBrowserApiTraffic` records and aborts any direct call, and
 *    `afterEach` fails the test if one happened.
 */
import { expect, test, type Locator, type Page } from '@playwright/test';
import {
  CORRECT_ITEM,
  GREETINGS_LESSON,
  ITEMS,
  LESSON_ID,
  PACK_ID,
  RESTRICTED_LESSON_ID,
  WRONG_ITEM,
  optionText,
  wrongLetter,
} from './fixtures/its-api';
import { ensureMockApi, type MockItsApi } from './fixtures/mock-its-api';

/** Generous on purpose: `next dev` compiles a route on first request, in-process. */
const ROUTE_TIMEOUT_MS = 25_000;
const NAVIGATION_TIMEOUT_MS = 60_000;
/** Cold compiles of three routes plus a retry, with room to spare. */
const TEST_TIMEOUT_MS = 180_000;

/**
 * One retry for this file, and a timeout that survives a cold `next dev` compile.
 *
 * `playwright.config.ts` runs with `retries: 0` locally and cannot be edited from here, but
 * two things this suite depends on are shared, parallel and outside the spec's control: the
 * dev server, and a fake API that lives inside worker processes which the runner stops as
 * soon as they run out of tests. A blip in either — a request caught by a socket that died
 * with its worker — leaves a page with no data rather than an obviously broken assertion, so
 * one automatic retry is the difference between reporting a fixture hiccup and reporting a
 * product defect. Playwright marks a test that needed the retry as *flaky*, never green, so
 * the tolerance stays visible in the report.
 *
 * A second, cheaper source of blips — clicking submit before React hydrated, which makes the
 * native form submission wipe `?pack` — is removed outright by `waitForAppReady` below
 * rather than left to the retry.
 *
 * The durable fix is to stop the fixture depending on a worker's lifetime at all, by hosting
 * it the way the app itself is hosted — a second `webServer` entry in `playwright.config.ts`
 * — which is a config change and therefore reported rather than made here.
 */
test.describe.configure({ retries: 1, timeout: TEST_TIMEOUT_MS });

let api: MockItsApi;
let browserApiCalls: string[] = [];

test.beforeEach(async ({ page }) => {
  // This worker keeps its own listener for as long as it lives (see the mock's `bind`), so
  // this is a cheap liveness assertion rather than a recovery path.
  api = await ensureMockApi();
  browserApiCalls = await guardBrowserApiTraffic(page, api);
});

test.afterEach(() => {
  // Empty for every test in this file: the browser talks to Next.js and nothing else.
  expect(browserApiCalls, 'the browser must never call the ITS API directly').toEqual([]);
});

/**
 * Records and aborts browser requests aimed at the API.
 *
 * A direct call would be a regression — the token lives server-side and only the server
 * gateway knows it. Aborting it makes the failure loud instead of letting a request
 * succeed against the fixture; the recorded URL is what `afterEach` reports.
 */
async function guardBrowserApiTraffic(page: Page, mock: MockItsApi): Promise<string[]> {
  const calls: string[] = [];
  await page.route(
    (url) => url.href.startsWith(`${mock.baseUrl}/`),
    async (route) => {
      calls.push(`${route.request().method()} ${route.request().url()}`);
      await route.abort('failed');
    },
  );
  return calls;
}

/**
 * Wait until the Next.js client runtime — and therefore React hydration — is up.
 *
 * This is not politeness, it is the difference between a green suite and one that flakes on
 * the practice screen. The submit button is a native `<button type="submit">` inside a
 * `<form>` with no `action` and no `method`, and the *only* thing that stops the browser
 * from performing a native GET submission is React's `onSubmit` → `preventDefault()`. Until
 * hydration attaches that handler, clicking submit submits the form for real: the browser
 * replaces the query string with the form's fields — no radio is checked, so `?pack=…`
 * becomes a bare `?` — and the practice page, seeing no `pack`, redirects to the lesson
 * (see `page.tsx`'s `pack === undefined` branch). The test then waits 5 s for a warning that
 * can never appear, on a screen that is no longer the practice screen.
 *
 * `domcontentloaded` is far too early for that: it fires before the bundles are even
 * fetched. Waiting for `load` gets the scripts executed, and `window.next.router` is Next's
 * own client-runtime marker, set once the app is initialized.
 */
async function waitForAppReady(page: Page): Promise<void> {
  await page.waitForLoadState('load');
  await page.waitForFunction(
    () => (window as { next?: { router?: unknown } }).next?.router !== undefined,
    undefined,
    { timeout: ROUTE_TIMEOUT_MS },
  );
}

/**
 * Navigate and wait for the screen to be up — and for the app to be interactive.
 *
 * No retry loop of its own: a blip is Playwright's retry to absorb (see the config note
 * above), and it reports it as flaky. A retry hidden in here would instead spend 25 s of a
 * green test's budget and leave no trace of it in the report.
 */
async function open(page: Page, path: string, ready: Locator): Promise<void> {
  page.setDefaultNavigationTimeout(NAVIGATION_TIMEOUT_MS);
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  await expect(ready).toBeVisible({ timeout: ROUTE_TIMEOUT_MS });
  await waitForAppReady(page);
}

/**
 * The flow must still be on the practice screen.
 *
 * Worth spelling out because of the redirect in the practice page: the failure mode of "the
 * pack could not be loaded" is not an error page, it is *the wrong screen* — and the
 * assertion that follows (a warning about unanswered items) is simply absent there. Naming
 * it turns a confusing timeout into a one-line diagnosis.
 */
function expectOnPracticeScreen(page: Page): void {
  expect(
    new URL(page.url()).pathname,
    'the practice screen left its own route — the pack could not be loaded (API unreachable?) or the page redirected',
  ).toBe(`/lessons/${LESSON_ID}/practice`);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** The radio a learner clicks: matched by its accessible name (letter + option text). */
function optionRadio(page: Page, item: (typeof ITEMS)[number], letter: string): Locator {
  const name = new RegExp(`^${escapeRegExp(letter)}\\.\\s*${escapeRegExp(optionText(item, letter))}`);
  return page.getByTestId(`practice-item-${item.item_id}`).getByRole('radio', { name });
}

const totalOptions = ITEMS.reduce((count, item) => count + item.options.length, 0);

test('the dashboard recommends a practice and its CTA opens that pack', async ({ page }) => {
  await open(page, '/', page.getByTestId('next-activity-card'));

  // The recommendation is justified on screen, from the fields the contract publishes.
  await expect(page.getByTestId('selection-rule')).toHaveText('Domínio pendente');
  await expect(page.getByTestId('i-plus-1')).toBeVisible();
  await expect(page.getByTestId('mastery-gaps')).toBeVisible();

  // `practice_pack` has no route of its own: the destination is derived from the pack id,
  // which embeds its lesson.
  await expect(page.getByTestId('start-activity')).toHaveAttribute(
    'href',
    `/lessons/${LESSON_ID}/practice?pack=${PACK_ID}`,
  );
});

test('answering, submitting and only then seeing the key (ADR-044)', async ({ page }) => {
  await open(page, '/', page.getByTestId('next-activity-card'));

  // The learner follows the recommendation the test above pinned, and lands on the pack.
  await page.getByTestId('start-activity').click();

  const firstItem = page.getByTestId(`practice-item-${CORRECT_ITEM.item_id}`);
  await expect(firstItem).toBeVisible({ timeout: ROUTE_TIMEOUT_MS });
  await expect(page.getByTestId(`practice-item-${WRONG_ITEM.item_id}`)).toBeVisible();
  await expect(page.getByRole('radio')).toHaveCount(totalOptions);

  /* --------------------------------------------------- before the submission */
  // Nothing is pre-selected, so "the first option" cannot act as an answer.
  await expect(page.locator('input[type="radio"]:checked')).toHaveCount(0);

  // No verdict exists in the interface: the feedback surface is not rendered at all.
  await expect(page.getByTestId('practice-feedback')).toHaveCount(0);
  await expect(page.getByText(/Correto|Incorreto/)).toHaveCount(0);

  // And not in the payload either. `scored_items[].correct` is the only member the
  // platform ever discloses the key through, so its presence — escaped into the RSC
  // payload or not — is the thing to look for, not a CSS class.
  const beforeSubmit = await page.content();
  expect(beforeSubmit).not.toContain('is_key');
  expect(beforeSubmit).not.toContain('scored_items');
  expect(beforeSubmit).not.toContain('"correct"');
  expect(beforeSubmit).not.toContain('\\"correct\\"');

  /* ------------------------------------------------------- an incomplete form */
  expectOnPracticeScreen(page);
  const submit = page.getByRole('button', { name: 'Enviar respostas' });
  await submit.click();

  await expect(page.getByTestId('unanswered-warning')).toHaveText(
    `Faltam ${ITEMS.length} itens sem resposta.`,
  );
  await expect(submit).toBeDisabled();
  // Refused, so still no result and still no key.
  await expect(page.getByTestId('practice-feedback')).toHaveCount(0);

  /* ---------------------------------------------------------------- answering */
  // One right and one wrong: the panel's two tones are both exercised, and a UI that
  // marked options by position would be caught either way (the keys are `B` and `C`).
  await optionRadio(page, CORRECT_ITEM, CORRECT_ITEM.key).check();
  await optionRadio(page, WRONG_ITEM, wrongLetter(WRONG_ITEM)).check();
  await expect(page.locator('input[type="radio"]:checked')).toHaveCount(2);

  // Still nothing: choosing an option does not grade it locally.
  await expect(page.getByTestId('practice-feedback')).toHaveCount(0);
  await expect(page.getByText(/Correto|Incorreto/)).toHaveCount(0);

  /* --------------------------------------------------------------- submitting */
  expectOnPracticeScreen(page);
  await submit.click();

  const feedback = page.getByTestId('practice-feedback');
  await expect(feedback).toBeVisible({ timeout: ROUTE_TIMEOUT_MS });

  // The form is replaced, not merely covered: the key cannot be read off the old one.
  await expect(page.getByRole('radio')).toHaveCount(0);

  await expect(
    page.getByTestId(`feedback-item-${CORRECT_ITEM.item_id}`).getByText('Correto', { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByTestId(`feedback-item-${WRONG_ITEM.item_id}`).getByText('Incorreto', { exact: true }),
  ).toBeVisible();
  await expect(feedback.getByText('Corretos: 1')).toBeVisible();
  await expect(feedback.getByText('Errados: 1')).toBeVisible();
});

test('a publishable lesson shows its four phases; a restricted one says so', async ({ page }) => {
  await open(page, `/lessons/${LESSON_ID}`, page.getByTestId('lesson-phases'));

  await expect(page.getByTestId('lesson-phases').locator(':scope > li')).toHaveCount(
    GREETINGS_LESSON.phases.length,
  );
  for (const phase of GREETINGS_LESSON.phases) {
    await expect(page.getByTestId(`lesson-phase-${phase.phase}`)).toBeVisible();
  }
  await expect(page.getByTestId('learner-model')).toBeVisible();
  await expect(page.getByTestId('publication-warning')).toHaveCount(0);

  await open(page, `/lessons/${RESTRICTED_LESSON_ID}`, page.getByTestId('lesson-phases'));

  // A lesson pending permission is still served, but never presented as finished content.
  await expect(page.getByTestId('publication-warning')).toBeVisible();
  // 1 of the 122 lessons declares no learner-model block, and it is rendered as such.
  await expect(page.getByTestId('learner-model-absent')).toBeVisible();
  await expect(page.getByTestId('learner-model')).toHaveCount(0);
});

test('practice without a pack returns to the lesson instead of inventing one', async ({ page }) => {
  await open(page, `/lessons/${LESSON_ID}/practice`, page.getByTestId('lesson-phases'));

  // There is no endpoint that lists a lesson's packs, so a hand-built URL goes back to the
  // lesson the pack would have belonged to — not to a 404 and not to an empty form.
  expect(new URL(page.url()).pathname).toBe(`/lessons/${LESSON_ID}`);
  await expect(page.getByTestId('practice-feedback')).toHaveCount(0);
  await expect(page.getByRole('radio')).toHaveCount(0);
});
