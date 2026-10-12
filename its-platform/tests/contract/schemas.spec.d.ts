/**
 * P1.12 — the three `/content/*` responses, validated against the contract.
 *
 * `docs/api/openapi.yaml` and `docs/api-spec.openapi.yaml` both publish `LessonContent`,
 * `PackContent` and `DialogueContent`, and until now the only test over them,
 * `tests/contract/schemas.spec.ts`, checked a *four-phase sketch* (`fase1`–`fase4`) that the
 * endpoint never served and that ADR-027 §4 replaced. It could not have caught the one thing it
 * existed for: a response that no longer matches the published schema. This file validates real
 * instances of what `ContentService` returns, and validates them against **both** files, because
 * the two are edited by hand and had already drifted (one published `PackOption.note` as
 * `type: string`, which no key option in the catalogue satisfied).
 *
 * There is no dependency on `ajv` or `jsonschema`: a hand-written validator covers the exact
 * keywords these schemas use — `$ref`, `type` (including the `[T, 'null']` arrays), `required`,
 * `properties`, `items`, `enum`, `const`, `pattern`, `minItems`, `maxItems`, `minimum`,
 * `maximum`, `exclusiveMinimum`, `if`/`then`/`else`, and `additionalProperties`. Adding a schema
 * keyword means extending `validate` here, which keeps the validator's reach visible instead of
 * implicit.
 *
 * The instances are real: every value was read out of the loaded catalogue (PGlite, `loadContent`
 * over the content repo) rather than invented. `describeContract` runs each one against both
 * files, so a schema edited in one file and not the other fails a case.
 */
export {};
//# sourceMappingURL=schemas.spec.d.ts.map