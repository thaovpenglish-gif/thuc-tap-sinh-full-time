// Per-company office maps (full custom buildings). A company opts in with meta.map = '<id>'.
// Each builder returns { colliders, interactables, root, spots, bounds, playerStart, meetingSeat, catPath, update, dispose }.
import { buildBama } from './bama.js';

export const MAPS = { bama: buildBama };
