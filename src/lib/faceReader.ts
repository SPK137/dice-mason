import * as CANNON from "cannon-es";
import * as THREE from "three";

// D6 face normals in local space mapped to result values
const D6_FACES: { normal: THREE.Vector3; value: number }[] = [
  { normal: new THREE.Vector3(0, 1, 0),  value: 1 },
  { normal: new THREE.Vector3(0, -1, 0), value: 6 },
  { normal: new THREE.Vector3(1, 0, 0),  value: 2 },
  { normal: new THREE.Vector3(-1, 0, 0), value: 5 },
  { normal: new THREE.Vector3(0, 0, 1),  value: 3 },
  { normal: new THREE.Vector3(0, 0, -1), value: 4 },
];

const WORLD_UP = new THREE.Vector3(0, 1, 0);

export function readD6TopFace(body: CANNON.Body): number {
  // Convert Cannon quaternion to Three.js quaternion
  const quaternion = new THREE.Quaternion(
    body.quaternion.x,
    body.quaternion.y,
    body.quaternion.z,
    body.quaternion.w
  );

  let bestValue = 1;
  let bestDot = -Infinity;

  for (const face of D6_FACES) {
    // Rotate the face normal by the die's current rotation
    const rotated = face.normal.clone().applyQuaternion(quaternion);
    // The face most aligned with world up is the top face
    const dot = rotated.dot(WORLD_UP);
    if (dot > bestDot) {
      bestDot = dot;
      bestValue = face.value;
    }
  }

  return bestValue;
}

export function readAllD6Results(bodies: CANNON.Body[]): number[] {
  return bodies.map((body) => readD6TopFace(body));
}