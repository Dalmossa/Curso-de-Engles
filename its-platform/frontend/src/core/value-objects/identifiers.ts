/**
 * The catalogue's identifier formats.
 *
 * Each pattern is copied from `docs/api-spec.openapi.yaml` — they are the contract's,
 * not invented here. They live in one module because two very different places need the
 * same predicate and must not drift: the router
 * (`core/services/activity-destination.ts`), which turns an id from the wire into a URL
 * segment, and the BFF (`infrastructure/api/operations.ts`), which decides whether to
 * forward a value at all.
 */

const UUID_PATTERN = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

/** `GET /content/lessons/{lesson_id}`: `^les_[a-z0-9_]+$`. */
const LESSON_ID_PATTERN = /^les_[a-z0-9_]+$/;

/**
 * `GET /content/packs/{pack_id}`: `^pack[-_]les_[a-z0-9_]+(_v1)?$`.
 *
 * Both separators are legal because the catalogue carries two generations of pack id.
 */
const PACK_ID_PATTERN = /^pack[-_]les_[a-z0-9_]+(?:_v1)?$/;

/** `GET /content/listening/{dialogue_id}`: `^dlg_[a-z0-9_]+$`. */
const DIALOGUE_ID_PATTERN = /^dlg_[a-z0-9_]+$/;

/** `PlacementResult.start_node`: `^(les|mod)_[a-z0-9_]+$`. */
const START_NODE_PATTERN = /^(les|mod)_[a-z0-9_]+$/;

export function isUuid(value: unknown): value is string {
  return typeof value === 'string' && UUID_PATTERN.test(value);
}

export function isLessonId(value: unknown): value is string {
  return typeof value === 'string' && LESSON_ID_PATTERN.test(value);
}

export function isPackId(value: unknown): value is string {
  return typeof value === 'string' && PACK_ID_PATTERN.test(value);
}

export function isDialogueId(value: unknown): value is string {
  return typeof value === 'string' && DIALOGUE_ID_PATTERN.test(value);
}

export function isStartNodeId(value: unknown): value is string {
  return typeof value === 'string' && START_NODE_PATTERN.test(value);
}
