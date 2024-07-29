import * as THREE from "three";

export const useMesh = () => {
  const dt = 1 / 60; // [1/s]
  const gravity = 9.8; // [m/s**2]
  const mass = 5; // [kg]
  const createMesh = () => {
    const geometry = new THREE.SphereGeometry(15, 32, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const sphere = new THREE.Mesh(geometry, material);
    return sphere;
  };

  const calForce = (force: THREE.Vector3, curPosition: THREE.Vector3) => {
    const gravity = new THREE.Vector3(0, -9.81 * mass, 0);
    const totalForce = force.clone().add(gravity);
    if (curPosition.y <= 0 && force.y < 0) {
      totalForce.y = 0;
    }
    return totalForce;
  };

  /**
   * Calculates the acceleration based on the given force and mass.
   *
   * @param {THREE.Vector3} force - The force vector [N].
   * @param {number} mass - The mass of the object [kg].
   * @returns {THREE.Vector3} The acceleration vector [m/s^2].
   */
  const calAcceleration = (force: THREE.Vector3, m = mass) => {
    if (m === 0) {
      throw new Error("Mass cannot be zero.");
    }
    const acceleration = force.clone();
    return acceleration;
  };

  /**
   * Calculates the new velocity based on the previous velocity and acceleration over a time step.
   *
   * @param {THREE.Vector3} prevVel - The previous velocity vector [m/s].
   * @param {THREE.Vector3} acc - The acceleration vector [m/s^2].
   * @returns {THREE.Vector3} The new velocity vector [m/s].
   */
  const calVelocity = (prevVel: THREE.Vector3, acc: THREE.Vector3) => {
    const cPrevVel = prevVel.clone();
    const cAcc = acc.clone();
    const newVelocity = cPrevVel.add(cAcc.multiplyScalar(dt));
    return newVelocity;
  };

  /**
   * Calculates the new position based on the previous position and velocity over a time step.
   *
   * @param {THREE.Vector3} prevPosition - The previous position vector [m].
   * @param {THREE.Vector3} vel - The velocity vector [m/s].
   * @returns {THREE.Vector3} The new position vector [m].
   */
  const calCoordinate = (prevPosition: THREE.Vector3, vel: THREE.Vector3) => {
    const cVel = vel.clone();
    const newPosition = prevPosition.add(cVel.multiplyScalar(dt));
    return newPosition;
  };

  const testor = () => {
    const force = new THREE.Vector3();
    const initVelocity = new THREE.Vector3();
    let initPosition = new THREE.Vector3(0, 10, 0);

    for (let i = 0; i < 120; i++) {
      const newForce = calForce(force, initPosition);
      const newAcceleration = calAcceleration(newForce);
      const newVelocity = calVelocity(initVelocity, newAcceleration);
      const newCoord = calCoordinate(initPosition, newVelocity);
      initPosition = newCoord;
      if (i === 119) {
        console.log(initPosition);
      }
    }
  };

  return {
    createMesh,

    calForce,
    calAcceleration,
    calVelocity,
    calCoordinate,

    testor,
  };
};
