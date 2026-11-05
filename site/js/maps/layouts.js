// Company-specific floor layouts. The building shell (outer walls, reception, meeting room, pantry, altar) is shared,
// so story scenes that use the meeting room / pantry / reception keep working. A layout replaces the central
// furniture and the two north rooms' contents, and moves the named seats (slot names stay the same, so the
// company's story data does not change — only where those seats are).
// Spot format: [x, z, rotY] (rotY 0 = facing +z / south, PI = facing north, PI/2 = facing east).

const PI = Math.PI;

// Ba & Má moved to a full custom map (maps/custom/bama.js); this partial-layout hook stays for later use.
export const LAYOUTS = {};
