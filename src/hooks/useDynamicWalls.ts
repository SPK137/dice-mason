import { useEffect, useRef } from "react";
import * as CANNON from "cannon-es";
import * as THREE from "three";
import { wallMaterial } from "./usePhysicsWorld";

export function useDynamicWalls(
  worldRef: React.RefObject<CANNON.World | null>,
  camera: THREE.Camera | null
) {
  const wallBodiesRef = useRef<CANNON.Body[]>([]);

  const rebuildWalls = (world: CANNON.World, cam: THREE.Camera) => {
    // Remove existing walls
    wallBodiesRef.current.forEach((w) => world.removeBody(w));
    wallBodiesRef.current = [];

    // Unproject screen corners to world space at y = 0
    const corners = [
      new THREE.Vector3(-1, -1, 0.5), // bottom-left
      new THREE.Vector3(1, -1, 0.5),  // bottom-right
      new THREE.Vector3(-1, 1, 0.5),  // top-left
      new THREE.Vector3(1, 1, 0.5),   // top-right
    ];

    const worldCorners = corners.map((ndc) => {
      const vec = ndc.clone().unproject(cam);
      const dir = vec.sub(cam.position).normalize();
      // Ray-plane intersection at y = 0
      const t = -cam.position.y / dir.y;
      return cam.position.clone().add(dir.multiplyScalar(t));
    });

    const minX = Math.min(...worldCorners.map((c) => c.x));
    const maxX = Math.max(...worldCorners.map((c) => c.x));
    const minZ = Math.min(...worldCorners.map((c) => c.z));
    const maxZ = Math.max(...worldCorners.map((c) => c.z));

    // Add a small padding so walls sit just outside the visible area
    const margin = -0.3;

    const wallConfigs = [
      { pos: [0, 0, minZ - margin] as [number, number, number], euler: [0, 0, 0] as [number, number, number] },
      { pos: [0, 0, maxZ + margin] as [number, number, number], euler: [0, Math.PI, 0] as [number, number, number] },
      { pos: [minX - margin, 0, 0] as [number, number, number], euler: [0, Math.PI / 2, 0] as [number, number, number] },
      { pos: [maxX + margin, 0, 0] as [number, number, number], euler: [0, -Math.PI / 2, 0] as [number, number, number] },
    ];

    wallConfigs.forEach(({ pos, euler }) => {
      const wall = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: new CANNON.Plane(),
        material: wallMaterial,
      });
      wall.position.set(...pos);
      wall.quaternion.setFromEuler(...euler);
      world.addBody(wall);
      wallBodiesRef.current.push(wall);
    });
  };

  useEffect(() => {
    if (!worldRef.current || !camera) return;
    rebuildWalls(worldRef.current, camera);
  }, [camera, worldRef]);

  useEffect(() => {
    const handleResize = () => {
      if (!worldRef.current || !camera) return;
      rebuildWalls(worldRef.current, camera);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [camera, worldRef]);

  return wallBodiesRef;
}