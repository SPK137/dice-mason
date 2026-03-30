import * as CANNON from "cannon-es";

const DEFAULT_INITIAL_VELOCITY_SCALE = 4
const INITIAL_VELOCITY_SCALE = 8
const Z_LOCATION_ADJUSTMENT_VALUE = -1.5

export function createD6Body(world: CANNON.World, scale: number): CANNON.Body {
  const body = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Box(new CANNON.Vec3(0.5 * scale, 0.5 * scale, 0.5 * scale)),
    linearDamping: 0.4,
    angularDamping: 0.4,
    sleepTimeLimit: 0.5,
    sleepSpeedLimit: 0.2,
  });

  body.allowSleep = true;

  // Start position — above the tray
  body.position.set(
    (Math.random() - 0.5) * 2,  // slight x variation
    6,                            // high enough to fall
    (Math.random() - 0.5) * 2   // slight z variation
  );

  world.addBody(body);
  return body;
}

export function throwD6Body(body: CANNON.Body) {
  // Wake it up if sleeping
  body.wakeUp();

  // Reset position
  body.position.set(
    (Math.random() - 0.5) * 2,
    6,
    (Math.random() - 0.5) * 2 + Z_LOCATION_ADJUSTMENT_VALUE
  );

  // Random initial velocity — downward with slight horizontal spread
  body.velocity.set(
    (Math.random() - 0.5) * INITIAL_VELOCITY_SCALE,
    -2,
    (Math.random() - 0.5) * INITIAL_VELOCITY_SCALE
  );

  // Random spin
  body.angularVelocity.set(
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 20
  );
}