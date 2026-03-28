import { useEffect, useRef } from "react";
import * as CANNON from "cannon-es";

export function usePhysicsWorld() {
  const worldRef = useRef<CANNON.World | null>(null);

  useEffect(() => {
    const world = new CANNON.World({
      gravity: new CANNON.Vec3(0, -20, 0),
    });

    world.broadphase = new CANNON.NaiveBroadphase();
    world.allowSleep = true;

    // Ground plane — the table surface
    const groundBody = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Plane(),
    });
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(groundBody);

    // Invisible walls to keep dice in tray
    const wallShapes = [
      { pos: [0, 0, -5], euler: [0, 0, 0] },         // back
      { pos: [0, 0, 5],  euler: [0, Math.PI, 0] },    // front
      { pos: [-5, 0, 0], euler: [0, Math.PI / 2, 0] },// left
      { pos: [5, 0, 0],  euler: [0, -Math.PI / 2, 0] },// right
    ];

    wallShapes.forEach(({ pos, euler }) => {
      const wall = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: new CANNON.Plane(),
      });
      wall.position.set(pos[0], pos[1], pos[2]);
      wall.quaternion.setFromEuler(euler[0], euler[1], euler[2]);
      world.addBody(wall);
    });

    worldRef.current = world;

    return () => {
      worldRef.current = null;
    };
  }, []);

  return worldRef;
}