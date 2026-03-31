import { useEffect, useRef } from "react";
import * as CANNON from "cannon-es";

// Export materials so dicePhysics.ts can assign them to bodies
export const groundMaterial = new CANNON.Material("ground");
export const wallMaterial = new CANNON.Material("wall");
export const diceMaterial = new CANNON.Material("dice");

function setupContactMaterials(world: CANNON.World): void {
  // --- Contact Materials ---

    // Die on ground — slight bounce, low friction so dice slide to rest
    world.addContactMaterial(new CANNON.ContactMaterial(
      diceMaterial,
      groundMaterial,
      {
        friction: 0.3,
        restitution: 0.35,
        contactEquationStiffness: 1e8,
        contactEquationRelaxation: 3,
      }
    ));

    // Die on wall — very slippery so dice don't stick to walls
    world.addContactMaterial(new CANNON.ContactMaterial(
      diceMaterial,
      wallMaterial,
      {
        friction: 0.0,        // near zero — walls are like glass
        restitution: 1,
        contactEquationStiffness: 1e8,
        contactEquationRelaxation: 3,
      }
    ));

    // Die on die — low friction so dice slide off each other naturally
    world.addContactMaterial(new CANNON.ContactMaterial(
      diceMaterial,
      diceMaterial,
      {
        friction: 0.02,
        restitution: 1,     // less bouncy die-to-die than die-to-ground
        contactEquationStiffness: 1e8,
        contactEquationRelaxation: 3,
      }
    ));
}

export function usePhysicsWorld() {
  const worldRef = useRef<CANNON.World | null>(null);

  useEffect(() => {
    const world = new CANNON.World({
      gravity: new CANNON.Vec3(0, -20, 0),
    });

    world.broadphase = new CANNON.NaiveBroadphase();
    world.allowSleep = true;

    setupContactMaterials(world);

    // Ground plane — the table surface
    const groundBody = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Plane(),
    });
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(groundBody);

    worldRef.current = world;

    return () => {
      worldRef.current = null;
    };
  }, []);

  return worldRef;
}