import {parseCurriculumSpec} from './its-platform/src/infrastructure/curriculum/curriculum-parser.ts';
import fs from 'fs';
import {validateDAG} from './its-platform/src/infrastructure/curriculum/dag-validator.ts';

const CONTENT_REPO_PATH = '.';
const r = parseCurriculumSpec(CONTENT_REPO_PATH);
// enrich...
