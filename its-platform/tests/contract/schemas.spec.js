"use strict";
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
import { readFileSync } from 'fs';
import { join } from 'path';
import * as yaml from 'yaml';
function isObject(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
/** Structural equality for the JSON values `enum`/`const` compare against. */
function deepEqual(a, b) {
    if (a === b)
        return true;
    if (Array.isArray(a) && Array.isArray(b)) {
        return a.length === b.length && a.every((item, index) => deepEqual(item, b[index]));
    }
    if (isObject(a) && isObject(b)) {
        const aKeys = Object.keys(a);
        const bKeys = Object.keys(b);
        return (aKeys.length === bKeys.length &&
            aKeys.every(key => Object.prototype.hasOwnProperty.call(b, key) && deepEqual(a[key], b[key])));
    }
    return false;
}
function typeMatches(value, type) {
    switch (type) {
        case 'object':
            return isObject(value);
        case 'array':
            return Array.isArray(value);
        case 'string':
            return typeof value === 'string';
        case 'number':
            return typeof value === 'number' && Number.isFinite(value);
        case 'integer':
            return typeof value === 'number' && Number.isInteger(value);
        case 'boolean':
            return typeof value === 'boolean';
        case 'null':
            return value === null;
        default:
            throw new Error(`mini-validator: unknown type \`${type}\``);
    }
}
function describeValue(value) {
    if (value === null)
        return 'null';
    if (typeof value === 'string')
        return JSON.stringify(value);
    if (Array.isArray(value))
        return `array(${value.length})`;
    if (isObject(value))
        return 'object';
    return String(value);
}
/** `#/components/schemas/X` → the node it points at. */
function resolveRef(root, ref) {
    const prefix = '#/';
    if (!ref.startsWith(prefix))
        throw new Error(`mini-validator: unsupported $ref \`${ref}\``);
    let node = root;
    for (const rawPart of ref.slice(prefix.length).split('/')) {
        const part = rawPart.replace(/~1/g, '/').replace(/~0/g, '~');
        if (!isObject(node))
            return undefined;
        node = node[part];
    }
    return node;
}
/**
 * Validate `value` against `schema`, appending one message per violation to `errors`. `root` is
 * the whole document, so `$ref` resolution works at any depth.
 */
function validate(schema, value, root, path, errors) {
    if (schema === true || schema === undefined)
        return;
    if (schema === false) {
        errors.push(`${path}: no value satisfies \`false\``);
        return;
    }
    if (!isObject(schema))
        return;
    if (typeof schema['$ref'] === 'string') {
        const { $ref, ...siblings } = schema;
        validate(resolveRef(root, $ref), value, root, path, errors);
        // OpenAPI 3.1 keeps `$ref` siblings meaningful, so they are applied too.
        if (Object.keys(siblings).length > 0)
            validate(siblings, value, root, path, errors);
        return;
    }
    const declaredType = schema['type'];
    if (declaredType !== undefined) {
        const types = Array.isArray(declaredType) ? declaredType : [declaredType];
        if (!types.some(type => typeof type === 'string' && typeMatches(value, type))) {
            errors.push(`${path}: ${describeValue(value)} is not ${JSON.stringify(declaredType)}`);
        }
        else {
            // A type match is required before the structural keywords can be interpreted; a mismatch
            // is already the whole error.
            validateAssertions(schema, value, root, path, errors);
        }
        return;
    }
    validateAssertions(schema, value, root, path, errors);
}
/** Every keyword except `type` (which `validate` has already resolved). */
function validateAssertions(schema, value, root, path, errors) {
    if ('const' in schema && !deepEqual(schema['const'], value)) {
        errors.push(`${path}: ${describeValue(value)} is not the constant ${describeValue(schema['const'])}`);
    }
    const enumeration = schema['enum'];
    if (Array.isArray(enumeration) && !enumeration.some(candidate => deepEqual(candidate, value))) {
        errors.push(`${path}: ${describeValue(value)} is not in the enum ${JSON.stringify(enumeration)}`);
    }
    const pattern = schema['pattern'];
    if (typeof pattern === 'string' && typeof value === 'string' && !new RegExp(pattern).test(value)) {
        errors.push(`${path}: ${JSON.stringify(value)} does not match ${pattern}`);
    }
    const minimum = schema['minimum'];
    if (typeof minimum === 'number' && typeof value === 'number' && value < minimum) {
        errors.push(`${path}: ${value} < minimum ${minimum}`);
    }
    const exclusiveMinimum = schema['exclusiveMinimum'];
    if (typeof exclusiveMinimum === 'number' &&
        typeof value === 'number' &&
        value <= exclusiveMinimum) {
        errors.push(`${path}: ${value} <= exclusiveMinimum ${exclusiveMinimum}`);
    }
    const maximum = schema['maximum'];
    if (typeof maximum === 'number' && typeof value === 'number' && value > maximum) {
        errors.push(`${path}: ${value} > maximum ${maximum}`);
    }
    if (Array.isArray(value)) {
        const minItems = schema['minItems'];
        if (typeof minItems === 'number' && value.length < minItems) {
            errors.push(`${path}: has ${value.length} item(s), fewer than minItems ${minItems}`);
        }
        const maxItems = schema['maxItems'];
        if (typeof maxItems === 'number' && value.length > maxItems) {
            errors.push(`${path}: has ${value.length} item(s), more than maxItems ${maxItems}`);
        }
        const itemSchema = schema['items'];
        if (itemSchema !== undefined) {
            value.forEach((item, index) => validate(itemSchema, item, root, `${path}[${index}]`, errors));
        }
    }
    if (isObject(value)) {
        const required = schema['required'];
        if (Array.isArray(required)) {
            for (const name of required) {
                if (typeof name === 'string' && !Object.prototype.hasOwnProperty.call(value, name)) {
                    errors.push(`${path}: missing required property \`${name}\``);
                }
            }
        }
        const properties = schema['properties'];
        if (isObject(properties)) {
            for (const [name, propertySchema] of Object.entries(properties)) {
                if (Object.prototype.hasOwnProperty.call(value, name)) {
                    validate(propertySchema, value[name], root, `${path}.${name}`, errors);
                }
            }
        }
        const additional = schema['additionalProperties'];
        if (additional === false && isObject(properties)) {
            for (const name of Object.keys(value)) {
                if (!Object.prototype.hasOwnProperty.call(properties, name)) {
                    errors.push(`${path}: unexpected property \`${name}\``);
                }
            }
        }
        else if (isObject(additional)) {
            for (const name of Object.keys(value)) {
                if (!isObject(properties) || !Object.prototype.hasOwnProperty.call(properties, name)) {
                    validate(additional, value[name], root, `${path}.${name}`, errors);
                }
            }
        }
        const ifSchema = schema['if'];
        if (ifSchema !== undefined) {
            const branchErrors = [];
            validate(ifSchema, value, root, path, branchErrors);
            const branch = branchErrors.length === 0 ? schema['then'] : schema['else'];
            if (branch !== undefined)
                validate(branch, value, root, path, errors);
        }
    }
}
// ---------------------------------------------------------------------------
// The two spec files
// ---------------------------------------------------------------------------
/**
 * `docs/api-spec.openapi.yaml` embeds its document in a ```` ```yaml ```` fence; `openapi.yaml`
 * is the bare document. Both are read the same way: the fenced body when there is one, the file
 * otherwise.
 */
function loadSpec(relativePath) {
    const raw = readFileSync(join(process.cwd(), relativePath), 'utf8');
    const fenced = raw.match(/```ya?ml\n([\s\S]*?)\n```/);
    const body = fenced && fenced[1] !== undefined ? fenced[1] : raw;
    const parsed = yaml.parse(body);
    if (!isObject(parsed))
        throw new Error(`${relativePath} did not parse to an object`);
    return parsed;
}
const SPEC_PATHS = ['docs/api/openapi.yaml', 'docs/api-spec.openapi.yaml'];
const SPECS = SPEC_PATHS.map(relativePath => ({
    relativePath,
    doc: loadSpec(relativePath),
}));
function schemaOf(doc, name) {
    const components = doc['components'];
    const schemas = isObject(components) ? components['schemas'] : undefined;
    if (!isObject(schemas))
        throw new Error('document has no components.schemas');
    if (!(name in schemas))
        throw new Error(`document has no components.schemas.${name}`);
    return schemas[name];
}
/** Validate one instance against one named schema in one document. */
function contractErrors(spec, schemaName, instance) {
    const errors = [];
    validate(schemaOf(spec.doc, schemaName), instance, spec.doc, schemaName, errors);
    return errors;
}
/** A schema with its prose annotations removed, for the structural drift guard. */
const ANNOTATIONS = new Set(['description', 'summary', 'title', 'example', 'examples']);
function withoutAnnotations(node) {
    if (Array.isArray(node))
        return node.map(withoutAnnotations);
    if (isObject(node)) {
        const result = {};
        for (const [key, value] of Object.entries(node)) {
            if (!ANNOTATIONS.has(key))
                result[key] = withoutAnnotations(value);
        }
        return result;
    }
    return node;
}
// ---------------------------------------------------------------------------
// The instances — every value read back out of the loaded catalogue
// ---------------------------------------------------------------------------
/** `les_a1_alphabet_sounds`, the reference lesson (A1, authored, publishable, 4 phases). */
const LESSON = {
    lesson_id: 'les_a1_alphabet_sounds',
    title: 'Alphabet, Sounds, Letter Names',
    cefr_level: 'A1',
    reuse_basis: 'cite_only',
    authoring_state: 'authored',
    publication_state: 'publishable',
    // Headings and body heads verbatim; the bodies themselves are elided (`markdown` is a string
    // to the schema, and the whole value is asserted in the integration spec).
    phases: [
        { phase: 1, heading: 'FASE 1 — Input (i+1) [4 min]', markdown: '\n### Vocabulário-chave (com gloss PT-BR)' },
        { phase: 2, heading: 'FASE 2 — Guided Practice [5 min]', markdown: '\n### Item 1 — Vocabulary (MCQ)' },
        { phase: 3, heading: 'FASE 3 — Output Task [4 min]', markdown: '\n### Speaking: Alphabet Practice (individual)' },
        { phase: 4, heading: 'FASE 4 — Shadow CAT [2 min]', markdown: '\n### Item 1 — Vocabulary (L1, adaptive)' },
    ],
    learner_model: { lesson_id: 'les_a1_alphabet_sounds', cefr_level: 'A1' },
};
/** The same schema with `learner_model: null` — `les_a2_it_internet_history`, the one such lesson. */
const LESSON_NULL_MODEL = { ...LESSON, lesson_id: 'les_a2_it_internet_history', learner_model: null };
/** A lesson with three phases and an out-of-enum CEFR code: two independent violations. */
const LESSON_WRONG = {
    ...LESSON,
    cefr_level: 'A9',
    phases: [
        { phase: 1, heading: 'FASE 1 — Input (i+1) [4 min]', markdown: 'x' },
        { phase: 2, heading: 'FASE 2 — Guided Practice [5 min]', markdown: 'y' },
        { phase: 3, heading: 'FASE 3 — Output Task [4 min]', markdown: 'z' },
    ],
};
/**
 * `pack_les_a1_alphabet_sounds_v1` (legacy_v1), item `vocab.alphabet.vowels` — the option rows
 * exactly as `item_options` holds them: a key option with `note: null` and distractors whose
 * `note` is the loader's stated no-rationale marker.
 */
const PACK_LEGACY = {
    pack_id: 'pack_les_a1_alphabet_sounds_v1',
    lesson_id: 'les_a1_alphabet_sounds',
    schema_version: 'legacy_v1',
    items: [
        {
            item_id: 'vocab.alphabet.vowels',
            item_type: 'contextual_selection',
            skill: 'vocab',
            domain: 'vocab',
            prompt: '**Vowels** in English are:',
            scoring: 'choice',
            options: [
                {
                    letter: 'A',
                    text: 'B, C, D, F, G',
                    is_key: false,
                    br_pt_form: 'vogais / A, E, I, O, U',
                    note: 'no distractor rationale recorded (legacy_v1)',
                },
                {
                    letter: 'B',
                    text: '**A, E, I, O, U**',
                    is_key: true,
                    br_pt_form: 'vogais / A, E, I, O, U',
                    note: null,
                },
                {
                    letter: 'C',
                    text: 'A, B, C, D, E',
                    is_key: false,
                    br_pt_form: 'vogais / A, E, I, O, U',
                    note: 'no distractor rationale recorded (legacy_v1)',
                },
                {
                    letter: 'D',
                    text: 'X, Y, Z',
                    is_key: false,
                    br_pt_form: 'vogais / A, E, I, O, U',
                    note: 'no distractor rationale recorded (legacy_v1)',
                },
            ],
            key: 'B',
            listening_items: [],
        },
    ],
};
/**
 * `pack_les_a2_greetings_intro_v1` (canonical) — `grm_demonstrative_this_001` (a choice) and
 * `prn_th_voiced_001`, one of the six `asr_phoneme_match` items that carry **no options and
 * `key: null`** by design (ADR-004). That pair is why `options` has no `minItems`, why `key` is
 * `[string, 'null']`, and why the `if scoring == choice` conjunct exists: it rejects `choice`
 * with a null key while admitting `asr_phoneme_match` with one. A subset of the real pack, but
 * every column value is the real one.
 */
const PACK_CANONICAL = {
    pack_id: 'pack_les_a2_greetings_intro_v1',
    lesson_id: 'les_a2_greetings_intro',
    schema_version: 'canonical',
    items: [
        {
            item_id: 'grm_demonstrative_this_001',
            item_type: 'gap_fill',
            skill: 'grammar',
            domain: 'grammar',
            prompt: "Sarah: 'This' is used here. Complete: “___ is Marco.”",
            scoring: 'choice',
            options: [
                { letter: 'A', text: 'This', is_key: true, br_pt_form: null, note: null },
                {
                    letter: 'B',
                    text: 'He',
                    is_key: false,
                    br_pt_form: 'Ele é o Marco',
                    note: "PT *é* serves both introducing and describing, so the learner has no cue that EN splits them — the item's own stated cause",
                },
                {
                    letter: 'C',
                    text: 'There',
                    is_key: false,
                    br_pt_form: null,
                    note: 'there-introducer',
                },
                {
                    letter: 'D',
                    text: 'It',
                    is_key: false,
                    br_pt_form: null,
                    note: 'null-subject transfer',
                },
            ],
            key: 'A',
            listening_items: [],
        },
        {
            item_id: 'prn_th_voiced_001',
            item_type: 'minimal_pair',
            skill: 'pronunciation',
            domain: 'pronunciation',
            prompt: 'Which word did you hear?',
            scoring: 'asr_phoneme_match',
            options: [],
            key: null,
            listening_items: [],
        },
    ],
};
/**
 * A `choice` item with the `key` member **absent**. `required: [key]` is the only thing it
 * violates: `key: null` would be admitted (a null is present), which is exactly the gap the
 * `then` conjunct's `type: string` records.
 */
const PACK_WRONG = {
    pack_id: 'pack_les_a1_alphabet_sounds_v1',
    lesson_id: 'les_a1_alphabet_sounds',
    schema_version: 'legacy_v1',
    items: [
        {
            item_id: 'vocab.alphabet.vowels',
            item_type: 'contextual_selection',
            skill: 'vocab',
            domain: 'vocab',
            prompt: '**Vowels** in English are:',
            scoring: 'choice',
            options: [{ letter: 'A', text: 'B, C, D, F, G', is_key: true, note: null }],
            listening_items: [],
        },
    ],
};
/**
 * `dlg_a1_01_first_intro` — two slots of the real six, one `gist` and one `pronunciation`
 * (`lst_pron_minpair` → `pronunciation`), with their real keys and distractor rows. The
 * transcript is the dialogue's own (the endpoint repeats it per slot; the schema asks only that
 * it be a string).
 */
const TRANSCRIPT = [
    "> **Ana:** Hi. I'm Ana Silva. I think I start today.",
    "> **Ben:** Hi Ana, welcome. I'm Ben. Nice to meet you.",
    '> **Ana:** Nice to meet you too.',
    '> **Ben:** Are you new here?',
    '> **Ana:** Yes. I start on the payments team.',
    "> **Ben:** Oh, cool. I'm in design. I'm here three years already.",
    "> **Ana:** Really? I thought you were new.",
].join('\n');
const DIALOGUE = {
    dialogue_id: 'dlg_a1_01_first_intro',
    title: 'Monday morning, a developer starts on a team of six.',
    cefr_level: 'A1',
    status: 'shipped',
    duration_seconds: 51,
    voices: [
        { voice_id: 'v_a', speaker: 'Ana', accent: 'en-US' },
        { voice_id: 'v_b', speaker: 'Ben', accent: 'en-US' },
    ],
    slots: [
        {
            slot_id: 'lst_gist_001',
            skill: 'gist',
            key: 'B',
            transcript: TRANSCRIPT,
            distractors: [
                { letter: 'A', text: 'Choosing a name for a new team member', type: 'semantic_plausible' },
                { letter: 'C', text: 'A meeting about the payments team', type: 'overgeneralization' },
                { letter: 'D', text: 'An argument about who the manager is', type: 'semantic_plausible' },
            ],
        },
        {
            slot_id: 'lst_prn_th_001',
            skill: 'pronunciation',
            key: 'A',
            transcript: TRANSCRIPT,
            // The distractor taxonomy is null here: the corpus's `Notes` column holds an articulatory
            // note where a type would sit (measured: 2638 of 2745 non-key options).
            distractors: [
                { letter: 'B', text: 'tree', type: null },
                { letter: 'C', text: 'free', type: null },
                { letter: 'D', text: 'street', type: null },
            ],
        },
    ],
};
/** A dialogue the endpoint must never serve: withdrawn from the DDL vocabulary, below the floor. */
const DIALOGUE_WRONG = {
    dialogue_id: 'dlg_zz_never',
    title: 'Not servable',
    cefr_level: 'B1',
    status: 'withdrawn',
    duration_seconds: 44,
    voices: [],
    slots: [{ slot_id: 'lst_gist_999', skill: 'gist', transcript: 'x', distractors: [] }],
};
/**
 * P1.13 — `dlg_a1_01_first_intro`'s audio playlist, two of its six clips (ADR-028 §2/§7).
 *
 * The load-bearing assertion is the **type** of `rate` and `duration_s`, not their presence:
 * `clip_renders.rate`/`duration_s` are `NUMERIC`, `pg` returns `NUMERIC` as a string, and a
 * mapper that passes the row through would publish `"1.00"` here. `rate: 1` (a number) is
 * therefore the case that matters, and `DIALOGUE_AUDIO_BAD_RATE` below is its negative.
 */
const AUDIO_CLIP_A = {
    clip_id: 'clp_dlg_a1_01_first_intro_1',
    sort_index: 1,
    speaker_id: 'sp_ana',
    voice_id: 'v_a',
    take: 2,
    rate: 1,
    duration_s: 4.25,
    url: 'https://audio.its.example.com/catalog/render/clp_dlg_a1_01_first_intro_1/take-2.opus?rate=1&exp=1760000000&sig=0f8a',
    expires_at: '2026-10-11T12:34:56Z',
};
const AUDIO_CLIP_B = {
    clip_id: 'clp_dlg_a1_01_first_intro_2',
    sort_index: 2,
    speaker_id: 'sp_ben',
    voice_id: 'v_b',
    take: 2,
    rate: 1,
    duration_s: 3.5,
    url: 'https://audio.its.example.com/catalog/render/clp_dlg_a1_01_first_intro_2/take-2.opus?rate=1&exp=1760000000&sig=1b2c',
    expires_at: '2026-10-11T12:34:56.789Z',
};
const DIALOGUE_AUDIO = {
    dialogue_id: 'dlg_a1_01_first_intro',
    cefr_level: 'A1',
    ttl_seconds: 300,
    clips: [AUDIO_CLIP_A, AUDIO_CLIP_B],
};
/** The `0.75` accommodation: a different `take` at the lower rate, longer per clip. */
const DIALOGUE_AUDIO_075 = {
    ...DIALOGUE_AUDIO,
    clips: [
        {
            ...AUDIO_CLIP_A,
            take: 4,
            rate: 0.75,
            duration_s: 5.67,
            url: 'https://audio.its.example.com/catalog/render/clp_dlg_a1_01_first_intro_1/take-4.opus?rate=0.75&exp=1760000000&sig=2d3e',
        },
    ],
};
/** The `NUMERIC`-as-string defect: `rate` is the string `"1.00"`, which `type: number` rejects. */
const DIALOGUE_AUDIO_BAD_RATE = {
    ...DIALOGUE_AUDIO,
    clips: [{ ...AUDIO_CLIP_A, rate: '1.00' }],
};
/** A zero-length render; `exclusiveMinimum: 0` is the only thing that rejects it. */
const DIALOGUE_AUDIO_BAD_DURATION = {
    ...DIALOGUE_AUDIO,
    clips: [{ ...AUDIO_CLIP_A, duration_s: 0 }],
};
/** RFC 3339 without the `Z` the pattern requires — `format` would not have caught it. */
const DIALOGUE_AUDIO_BAD_EXPIRY = {
    ...DIALOGUE_AUDIO,
    clips: [
        { ...AUDIO_CLIP_A, expires_at: '2026-10-11T12:34:56+00:00' },
    ],
};
const CASES = [
    { schema: 'LessonContent', label: 'the reference lesson', instance: LESSON, valid: true },
    {
        schema: 'LessonContent',
        label: 'a lesson with a null learner model',
        instance: LESSON_NULL_MODEL,
        valid: true,
    },
    {
        schema: 'LessonContent',
        label: 'a lesson with a bad CEFR and three phases',
        instance: LESSON_WRONG,
        valid: false,
        becauseOf: 'cefr_level',
    },
    { schema: 'PackContent', label: 'a legacy_v1 pack', instance: PACK_LEGACY, valid: true },
    {
        schema: 'PackContent',
        label: 'a canonical pack with an ASR item',
        instance: PACK_CANONICAL,
        valid: true,
    },
    {
        schema: 'PackContent',
        label: 'a pack item with `choice` and no key member',
        instance: PACK_WRONG,
        valid: false,
        becauseOf: 'missing required property `key`',
    },
    {
        schema: 'DialogueContent',
        label: 'a shipped dialogue with keyed slots',
        instance: DIALOGUE,
        valid: true,
    },
    {
        schema: 'DialogueContent',
        label: 'a withdrawn, sub-floor dialogue',
        instance: DIALOGUE_WRONG,
        valid: false,
        becauseOf: 'is not in the enum',
    },
    {
        schema: 'DialogueAudio',
        label: 'a playlist at rate 1 with numeric rate and duration_s',
        instance: DIALOGUE_AUDIO,
        valid: true,
    },
    {
        schema: 'DialogueAudio',
        label: 'the 0.75 accommodation playlist',
        instance: DIALOGUE_AUDIO_075,
        valid: true,
    },
    {
        schema: 'DialogueAudio',
        label: 'a playlist whose rate is the NUMERIC string "1.00"',
        instance: DIALOGUE_AUDIO_BAD_RATE,
        valid: false,
        becauseOf: 'is not "number"',
    },
    {
        schema: 'DialogueAudio',
        label: 'a playlist with a zero-length render',
        instance: DIALOGUE_AUDIO_BAD_DURATION,
        valid: false,
        becauseOf: 'exclusiveMinimum',
    },
    {
        schema: 'DialogueAudio',
        label: 'a playlist whose expires_at is not Z-suffixed',
        instance: DIALOGUE_AUDIO_BAD_EXPIRY,
        valid: false,
        becauseOf: 'does not match',
    },
];
// ---------------------------------------------------------------------------
describe('Content API response schemas (P1.12 contract)', () => {
    for (const spec of SPECS) {
        describe(`against ${spec.relativePath}`, () => {
            for (const testCase of CASES) {
                it(`${testCase.valid ? 'accepts' : 'rejects'} ${testCase.label}`, () => {
                    const errors = contractErrors(spec, testCase.schema, testCase.instance);
                    if (testCase.valid) {
                        expect(errors).toEqual([]);
                    }
                    else {
                        // A wrong instance is only useful if the validator can say why, and says the reason
                        // the case names.
                        expect(errors.length).toBeGreaterThan(0);
                        if (testCase.becauseOf !== undefined) {
                            expect(errors.join('\n')).toContain(testCase.becauseOf);
                        }
                    }
                });
            }
        });
    }
    it('the two files define the six content schemas identically (drift guard)', () => {
        const [first, second] = SPECS;
        if (!first || !second)
            throw new Error('expected two spec files');
        for (const name of [
            'LessonContent',
            'PackOption',
            'PackContent',
            'DialogueContent',
            'DialogueAudio',
            'DialogueAudioClip',
        ]) {
            expect(withoutAnnotations(schemaOf(second.doc, name))).toEqual(withoutAnnotations(schemaOf(first.doc, name)));
        }
    });
});
//# sourceMappingURL=schemas.spec.js.map