import { DieType } from "@/types/dice";
import * as CANNON from "cannon-es";
import { diceMaterial } from "@/hooks/usePhysicsWorld";
import { DieGeometryData } from "./diceGeometry";

const DEFAULT_INITIAL_VELOCITY_SCALE = 4
const INITIAL_VELOCITY_SCALE = 8
const Z_LOCATION_ADJUSTMENT_VALUE = -1.5

export function createDieBody(
  world: CANNON.World,
  geometryData: DieGeometryData,
  dieType: DieType,
  scale: number,
  index: number = 0
): CANNON.Body {
  let shape: CANNON.Shape;

  if (dieType === "d6" || dieType === "fudge") {
    shape = new CANNON.Box(new CANNON.Vec3(0.5 * scale, 0.5 * scale, 0.5 * scale));
  } else {
    shape = new CANNON.ConvexPolyhedron({
      vertices: geometryData.physicsVertices,
      faces: geometryData.physicsFaces,
    });
  }

  const body = new CANNON.Body({
    mass: 1,
    shape,
    material: diceMaterial,
    linearDamping: 0.4,
    angularDamping: 0.4,
    sleepTimeLimit: 0.5,
    sleepSpeedLimit: 0.2,
  });

  body.allowSleep = true;

  // Spread starting positions based on index
  const spread = 1.5;
  body.position.set(
    (Math.random() - 0.5) * spread + (index % 3) * 0.5,
    6 + index * 0.3,
    (Math.random() - 0.5) * spread + Math.floor(index / 3) * 0.5
  );

  world.addBody(body);
  return body;
}

export function throwDieBody(body: CANNON.Body, index: number = 0) {
  body.wakeUp();

  const spread = 1.5;
  body.position.set(
    (Math.random() - 0.5) * spread + (index % 3) * 0.5,
    6 + index * 0.3,
    (Math.random() - 0.5) * spread + Math.floor(index / 3) * 0.5  + Z_LOCATION_ADJUSTMENT_VALUE
  );

  body.velocity.set(
    (Math.random() - 0.5) * INITIAL_VELOCITY_SCALE,
    -2,
    (Math.random() - 0.5) * INITIAL_VELOCITY_SCALE
  );

  body.angularVelocity.set(
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 20
  );

}

// Keep old exports for backward compatibility
export function createD6Body(world: CANNON.World, scale: number): CANNON.Body {
  const { createD6Geometry } = require("./diceGeometry");
  return createDieBody(world, createD6Geometry(), "d6", scale);
}

export function throwD6Body(body: CANNON.Body) {
  throwDieBody(body);
}