// Per-company office maps (full custom buildings). A company opts in with meta.map = '<id>'.
// Each builder returns { colliders, interactables, root, spots, bounds, playerStart, meetingSeat, catPath, update, dispose }.
import { buildBama } from './bama.js';
import { buildTech } from './tech.js';
import { buildAgency } from './agency.js';
import { buildAudit } from './audit.js';
import { buildEvent } from './event.js';

export const MAPS = { bama: buildBama, tech: buildTech, agency: buildAgency, audit: buildAudit, event: buildEvent };
