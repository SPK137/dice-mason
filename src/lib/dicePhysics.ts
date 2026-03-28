import * as CANNON from "cannon-es";

export function createD6Body(world: CANNON.World): CANNON.Body {
  const body = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
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
    (Math.random() - 0.5) * 2
  );

  // Random initial velocity — downward with slight horizontal spread
  body.velocity.set(
    (Math.random() - 0.5) * 4,
    -2,
    (Math.random() - 0.5) * 4
  );

  // Random spin
  body.angularVelocity.set(
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 20
  );
}