/**
 * Contract gate — negative controls (ADR-040 D5, R7).
 *
 * The gate **replaced** `contract-check.mjs` — deleted in A3 along with `scripts/contract-check-full.mjs`
 * — whose 31 lines only asked whether the obsolete document contained ten substrings. A0's N-4
 * proved, on a copy, that that gate PASSED with `components.schemas = {}`, with `POST` swapped for
 * `GET`, and with a path that exists in no controller. Each of those mutations is a case below.
 *
 * Every case runs the real CLI against a mutated copy — no mocking of the gate
 * itself — so what is asserted is the thing that ships.
 */
import { execFileSync } from 'child_process';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import * as yaml from 'yaml';

const ROOT = process.cwd();
const GATE = join(ROOT, 'scripts', 'contract-gate.mjs');
const SPEC = join(ROOT, 'docs', 'api-spec.openapi.yaml');
const SRC = join(ROOT, 'src');

interface GateResult {
  code: number;
  out: string;
}

function runGate(specPath: string = SPEC, srcDir: string = SRC): GateResult {
  try {
    const out = execFileSync(
      process.execPath,
      [GATE, '--spec', specPath, '--src', srcDir],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
    );
    return { code: 0, out };
  } catch (error) {
    const e = error as { status?: number; stdout?: string; stderr?: string };
    return { code: e.status ?? 1, out: `${e.stdout ?? ''}${e.stderr ?? ''}` };
  }
}

const tempDirs: string[] = [];
function tempDir(): string {
  const dir = mkdtempSync(join(tmpdir(), 'contract-gate-'));
  tempDirs.push(dir);
  return dir;
}

/** Writes a spec copy mutated by `mutate`, and returns its path. */
function mutatedSpec(mutate: (doc: any) => void): string {
  const doc = yaml.parse(readFileSync(SPEC, 'utf8'));
  mutate(doc);
  const p = join(tempDir(), 'spec.yaml');
  writeFileSync(p, yaml.stringify(doc));
  return p;
}

/** Writes a spec copy whose raw text is rewritten by `rewrite`. */
function rewrittenSpec(rewrite: (raw: string) => string): string {
  const p = join(tempDir(), 'spec.yaml');
  writeFileSync(p, rewrite(readFileSync(SPEC, 'utf8')));
  return p;
}

/** Copies `src/` and applies `mutate` to the copy. */
function mutatedSrc(removeRelativePath: string): string {
  const dir = join(tempDir(), 'src');
  cpSync(SRC, dir, { recursive: true });
  rmSync(join(dir, removeRelativePath));
  return dir;
}

/** Copies `src/` and rewrites `main.ts` with `rewrite`. */
function mutatedMainSrc(rewrite: (main: string) => string): string {
  const dir = join(tempDir(), 'src');
  cpSync(SRC, dir, { recursive: true });
  const mainPath = join(dir, 'main.ts');
  writeFileSync(mainPath, rewrite(readFileSync(mainPath, 'utf8')));
  return dir;
}

/** Copies `src/` and rewrites the composition root `app.setup.ts` with `rewrite`. */
function mutatedAppSetupSrc(rewrite: (setup: string) => string): string {
  const dir = join(tempDir(), 'src');
  cpSync(SRC, dir, { recursive: true });
  const setupPath = join(dir, 'app.setup.ts');
  writeFileSync(setupPath, rewrite(readFileSync(setupPath, 'utf8')));
  return dir;
}

afterAll(() => {
  for (const dir of tempDirs) rmSync(dir, { recursive: true, force: true });
});

describe('contract gate — the unmutated repository', () => {
  it('passes on the canonical spec against the real controllers', () => {
    const { code, out } = runGate();
    expect(out).not.toMatch(/^FAIL/m);
    expect(code).toBe(0);
  });
});

describe('contract gate — negative controls (each must FAIL)', () => {
  it('N-1 (A0 N-4a): empty components.schemas', () => {
    const { code, out } = runGate(mutatedSpec((doc) => { doc.components.schemas = {}; }));
    expect(code).toBe(1);
    expect(out).toMatch(/^FAIL: schemas/m);
  });

  it('N-2 (A0 N-4b): method swapped — get becomes post', () => {
    const { code, out } = runGate(mutatedSpec((doc) => {
      const op = doc.paths['/content/lessons/{lesson_id}'];
      op.post = op.get;
      delete op.get;
    }));
    expect(code).toBe(1);
    expect(out).toMatch(/^FAIL: method/m);
  });

  it('N-3 (A0 N-4c): a path implemented by no controller', () => {
    const { code, out } = runGate(mutatedSpec((doc) => {
      doc.paths['/content/imaginary/{thing_id}'] = { get: { responses: { '200': { description: 'x' } } } };
    }));
    expect(code).toBe(1);
    expect(out).toMatch(/^FAIL: spec path has no route/m);
  });

  it('N-4: a spec path removed while its route still exists', () => {
    const { code, out } = runGate(mutatedSpec((doc) => { delete doc.paths['/learners/{learner_id}/mastery']; }));
    expect(code).toBe(1);
    expect(out).toMatch(/^FAIL: route not in spec/m);
  });

  it('N-5: a fictitious spec path', () => {
    const { code, out } = runGate(mutatedSpec((doc) => {
      doc.paths['/not-in-any-controller'] = { get: { responses: { '200': { description: 'x' } } } };
    }));
    expect(code).toBe(1);
    expect(out).toMatch(/^FAIL: spec path has no route/m);
  });

  it('N-6: servers without the §4.4 /api/v1 prefix', () => {
    const { code, out } = runGate(mutatedSpec((doc) => { doc.servers = [{ url: 'https://api.its.example.com/v1' }]; }));
    expect(code).toBe(1);
    expect(out).toMatch(/^FAIL: servers/m);
  });

  it('N-7: Problem schema removed', () => {
    const { code, out } = runGate(mutatedSpec((doc) => { delete doc.components.schemas.Problem; }));
    expect(code).toBe(1);
    expect(out).toMatch(/^FAIL: Problem/m);
  });

  it('N-8: an error response served as application/json', () => {
    const { code, out } = runGate(mutatedSpec((doc) => {
      doc.paths['/content/lessons/{lesson_id}'].get.responses['404'].content = {
        'application/json': { schema: { $ref: '#/components/schemas/Problem' } },
      };
    }));
    expect(code).toBe(1);
    expect(out).toMatch(/^FAIL: error media type/m);
  });

  it('N-9: a GET on a path parameter without a 404 (R6)', () => {
    const { code, out } = runGate(mutatedSpec((doc) => {
      delete doc.paths['/content/packs/{pack_id}'].get.responses['404'];
    }));
    expect(code).toBe(1);
    expect(out).toMatch(/^FAIL: 404/m);
  });

  it('N-10: a boolean Deprecation header (ADR-033 D2)', () => {
    const { code, out } = runGate(mutatedSpec((doc) => {
      doc.paths['/content/lessons/{lesson_id}'].get.responses['200'].headers = {
        Deprecation: { schema: { type: 'boolean', const: true } },
      };
    }));
    expect(code).toBe(1);
    expect(out).toMatch(/^FAIL: Deprecation/m);
  });

  it('N-11: the historical defect — the document wrapped in a Markdown fence', () => {
    const { code, out } = runGate(rewrittenSpec((raw) => '```yaml\n' + raw + '\n```\n'));
    expect(code).toBe(1);
    expect(out).toMatch(/^FAIL: parse/m);
  });

  it('N-12: a controller route that the spec does not publish', () => {
    const dir = join(tempDir(), 'src');
    cpSync(SRC, dir, { recursive: true });
    const file = join(dir, 'modules', 'auth', 'auth.controller.ts');
    writeFileSync(
      file,
      readFileSync(file, 'utf8').replace(
        "@Post('refresh')",
        "@Post('refresh')\n  @Post('logout')\n  logout() { return null; }",
      ),
    );
    const { code, out } = runGate(SPEC, dir);
    expect(code).toBe(1);
    expect(out).toMatch(/^FAIL: route not in spec/m);
  });

  it('N-13: a route exemption that no longer matches a route (stale)', () => {
    const { code, out } = runGate(SPEC, mutatedSrc('health/health.controller.ts'));
    expect(code).toBe(1);
    expect(out).toMatch(/^FAIL: stale exemption/m);
  });

  it('N-14 (D6): a pin that no longer matches the spec it names', () => {
    const { code, out } = runGate(
      mutatedSpec((doc) => {
        doc.info['x-contract-provenance']['spec-blobs']['specs/assessment-item-spec.md'] =
          '0'.repeat(40);
      }),
    );
    expect(code).toBe(1);
    expect(out).toMatch(/^FAIL: pin/m);
  });

  it('N-15 (D6): the provenance pin absent altogether', () => {
    const { code, out } = runGate(
      mutatedSpec((doc) => {
        delete doc.info['x-contract-provenance'];
      }),
    );
    expect(code).toBe(1);
    expect(out).toMatch(/^FAIL: pin/m);
  });

  it('N-16 (§4.4): the application stops applying the /api prefix', () => {
    const { code, out } = runGate(
      SPEC,
      mutatedAppSetupSrc((appSetup) =>
        appSetup.replace(/app\.setGlobalPrefix\([\s\S]*?\);/, ''),
      ),
    );
    expect(code).toBe(1);
    expect(out).toMatch(/^FAIL: prefix/m);
  });

  it('N-17 (§4.4): header versioning instead of URI versioning', () => {
    const { code, out } = runGate(
      SPEC,
      mutatedAppSetupSrc((appSetup) => appSetup.replace('VersioningType.URI', 'VersioningType.HEADER')),
    );
    expect(code).toBe(1);
    expect(out).toMatch(/^FAIL: prefix/m);
  });

  it('N-18 (§4.3): an error response carrying the right media type but the wrong schema', () => {
    // The media type stays legal and the `$ref` still resolves, so the new `Problem` rule is the
    // only thing that can fail — this isolates the obligation A3 moved out of
    // `tests/contract/endpoints.spec.ts` when that file was removed as subsumed.
    const { code, out } = runGate(
      mutatedSpec((doc) => {
        doc.paths['/content/lessons/{lesson_id}'].get.responses['404'].content = {
          'application/problem+json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
        };
      }),
    );
    expect(code).toBe(1);
    expect(out).toMatch(/^FAIL: Problem/m);
  });

  it('N-19 (§4.4): the composition root exists but nothing reaches it', () => {
    // The control for reading `main.ts` *and* `src/app.setup.ts`: a correct `app.setup.ts` that
    // `main.ts` never calls would satisfy every pattern rule, and the application would serve its
    // routes without the /api/v1 prefix while the document kept declaring it. The `--src` copy is
    // the only difference from the passing run above.
    const { code, out } = runGate(
      SPEC,
      mutatedMainSrc((main) => main.replace(/configureApp\(app\);/, '')),
    );
    expect(code).toBe(1);
    expect(out).toMatch(/^FAIL: prefix/m);
  });

  it('N-20 (§4.5): a request body that promises a tolerance the server refuses', () => {
    // `additionalProperties` is absent from OpenAPI unless declared, and its absence means `true`:
    // a schema that stays silent documents that a caller may send whatever it likes. §4.5 mandates
    // the opposite, so the declaration is what keeps the document from contradicting the server —
    // this control removes it from one request schema and requires the gate to notice.
    const { code, out } = runGate(
      mutatedSpec((doc) => {
        delete doc.components.schemas.DiagnosticRequest.additionalProperties;
      }),
    );
    expect(code).toBe(1);
    expect(out).toMatch(/^FAIL: request body/m);
  });

  it('N-21 (§4.5): the nested object is checked too, not only the body root', () => {
    // The DTOs declare a nested class at every level the pipe can reach, so `whitelist` rejects an
    // undeclared member inside an item as well — `tests/integration/request-validation.spec.ts`
    // proves it for `responses[]`. A rule that only inspected the referenced schema would pass this
    // document and miss the level where the tolerance would reappear.
    const { code, out } = runGate(
      mutatedSpec((doc) => {
        delete doc.components.schemas.PracticeSubmission.properties.responses.items
          .additionalProperties;
      }),
    );
    expect(code).toBe(1);
    expect(out).toMatch(/^FAIL: request body.*responses\[\]/m);
  });
});
