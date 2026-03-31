import * as CANNON from "cannon-es";
import * as THREE from "three";
import { DieGeometryData } from "./diceGeometry";

const WORLD_UP = new THREE.Vector3(0, 1, 0);

export function readTopFace(
  body: CANNON.Body,
  geometryData: DieGeometryData
): number | string {
  const quaternion = new THREE.Quaternion(
    body.quaternion.x,
    body.quaternion.y,
    body.quaternion.z,
    body.quaternion.w
  );

  let bestValue: number | string = geometryData.faceValues[0];
  let bestDot = -Infinity;

  geometryData.faceNormals.forEach((normal, i) => {
    const rotated = normal.clone().applyQuaternion(quaternion);
    const dot = rotated.dot(WORLD_UP);
    if (dot > bestDot) {
      bestDot = dot;
      bestValue = geometryData.faceValues[i];
    }
  });

  return bestValue;
}

export function readAllResults(
  bodies: CANNON.Body[],
  geometryData: DieGeometryData
): (number | string)[] {
  return bodies.map((body) => readTopFace(body, geometryData));
}

// Keep d6 reader for backward compatibility
export function readD6TopFace(body: CANNON.Body): number {
  import("./diceGeometry").then(({ createD6Geometry }) => {});
  const faceNormals = [
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(0, -1, 0),
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(-1, 0, 0),
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(0, 0, -1),
  ];
  const faceValues = [1, 6, 2, 5, 3, 4];
  const quaternion = new THREE.Quaternion(
    body.quaternion.x,
    body.quaternion.y,
    body.quaternion.z,
    body.quaternion.w
  );
  let best = 1;
  let bestDot = -Infinity;
  faceNormals.forEach((n, i) => {
    const dot = n.clone().applyQuaternion(quaternion).dot(WORLD_UP);
    if (dot > bestDot) { bestDot = dot; best = faceValues[i]; }
  });
  return best;
}

export function readAllD6Results(bodies: CANNON.Body[]): number[] {
  return bodies.map(readD6TopFace);
}