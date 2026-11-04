// Circle-vs-AABB movement on the XZ plane. Pure math, no Three.js dependency.
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/**
 * Move `pos` ({x, z}) by (dx, dz), pushing it out of axis-aligned boxes and other circular actors.
 * colliders: [{minX, maxX, minZ, maxZ}], others: [{x, z}] (other actors), bounds: {minX, maxX, minZ, maxZ}
 */
export function moveActor(pos, dx, dz, { colliders = [], others = [], radius = 0.28, otherRadius = 0.55, bounds = null } = {}) {
  pos.x += dx; pos.z += dz;
  const r = radius;
  for (const c of colliders) {
    if (pos.x > c.minX - r && pos.x < c.maxX + r && pos.z > c.minZ - r && pos.z < c.maxZ + r) {
      const dl = pos.x - (c.minX - r), dr = (c.maxX + r) - pos.x, dt = pos.z - (c.minZ - r), db = (c.maxZ + r) - pos.z;
      const m = Math.min(dl, dr, dt, db);
      if (m === dl) pos.x = c.minX - r; else if (m === dr) pos.x = c.maxX + r; else if (m === dt) pos.z = c.minZ - r; else pos.z = c.maxZ + r;
    }
  }
  for (const o of others) {
    const ddx = pos.x - o.x, ddz = pos.z - o.z;
    const d = Math.hypot(ddx, ddz);
    if (d < otherRadius && d > 0.0001) { pos.x = o.x + ddx / d * otherRadius; pos.z = o.z + ddz / d * otherRadius; }
  }
  if (bounds) { pos.x = clamp(pos.x, bounds.minX, bounds.maxX); pos.z = clamp(pos.z, bounds.minZ, bounds.maxZ); }
  return pos;
}
