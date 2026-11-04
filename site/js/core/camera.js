// Elevated follow camera (Overcooked-style tilted top-down). Used by every mode.
import * as THREE from 'three';

export class CameraRig {
  constructor(camera) {
    this.camera = camera;
    this.target = new THREE.Vector3();      // what we follow (player / group centre)
    this.focus = null;                      // optional point to frame (dialogue partner)
    this.look = new THREE.Vector3();
    this.pos = new THREE.Vector3(0, 12, 10);
    this.zoom = 1;                          // >1 = further away (e.g. group spread)
    this.portrait = false;
    this.bounds = null;                     // optional {minX,maxX,minZ,maxZ} clamp for the framed point
  }

  resize(w, h) {
    this.portrait = w < h;
    this.camera.aspect = w / h;
    this.camera.fov = this.portrait ? 55 : 42;
    this.camera.updateProjectionMatrix();
  }

  snap() { this.update(1, true); }

  update(dt, instant = false) {
    const base = this.portrait ? { y: 13.5, z: 8.5 } : { y: 10.5, z: 7.6 };
    let cx = this.target.x, cz = this.target.z, y = base.y * this.zoom, z = base.z * this.zoom;
    if (this.bounds) { cx = Math.max(this.bounds.minX, Math.min(this.bounds.maxX, cx)); cz = Math.max(this.bounds.minZ, Math.min(this.bounds.maxZ, cz)); }
    if (this.focus) {
      // frame the player and the dialogue partner together, a bit closer
      cx = (this.target.x + this.focus.x) / 2; cz = (this.target.z + this.focus.z) / 2;
      y = base.y * 0.62; z = base.z * 0.62;
    }
    const wantPos = new THREE.Vector3(cx, y, cz + z);
    const wantLook = new THREE.Vector3(cx, 0.6, cz - 0.4);
    const k = instant ? 1 : 1 - Math.pow(0.0015, dt);
    this.pos.lerp(wantPos, k);
    this.look.lerp(wantLook, k);
    this.camera.position.copy(this.pos);
    this.camera.lookAt(this.look);
  }
}
