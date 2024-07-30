import * as THREE from "three";

export const useMesh = () => {
  const dt = 1 / 6; // [s] (10 times faster)
  const g = -9.81; // [m/s**2]
  const mass = 1; // [kg]

  /**
   *
   * @returns {THREE.Mesh} Mesh Object
   */
  const createMesh = () => {
    const geometry = new THREE.BoxGeometry(5, 5, 5);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const cube = new THREE.Mesh(geometry, material);
    return cube;
  };

  /**
   * Calculates the force based on given force, and add gravity acceleration.
   *
   * @param {THREE.Vector3} force - The force vector [N].
   * @param {THREE.Vector3} curPosition - The current position vector [m].
   * @returns {THREE.Vector3}
   */
  const calForce = (force: THREE.Vector3, curPosition: THREE.Vector3) => {
    const gravity = new THREE.Vector3(0, g, 0);
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
   * @returns {THREE.Vector3} The acceleration vector [m/s^2].
   */
  const calAcceleration = (force: THREE.Vector3) => {
    const acceleration = force.clone().multiplyScalar(dt);
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
    const cPosition = prevPosition.clone();
    const newPosition = cPosition.add(cVel.multiplyScalar(dt));
    return newPosition;
  };

  const collide = (
    mesh: THREE.Mesh,
    prevPosition: THREE.Vector3,
    direction: THREE.Vector3
  ) => {
    let collidableMeshList: any[] = [];
    for (
      var vertexIndex = 0;
      vertexIndex < mesh.geometry.attributes.position.array.length;
      vertexIndex++
    ) {
      var localVertex = new THREE.Vector3()
        .fromBufferAttribute(mesh.geometry.attributes.position, vertexIndex)
        .clone();
      var globalVertex = localVertex.applyMatrix4(mesh.matrix);
      var directionVector = globalVertex.sub(mesh.position);

      var ray = new THREE.Raycaster(
        mesh.position,
        directionVector.clone().normalize()
      );
      var collisionResults = ray.intersectObjects(collidableMeshList);
      if (
        collisionResults.length > 0 &&
        collisionResults[0].distance < directionVector.length()
      ) {
        // a collision occurred... do something...
      }
    }
    return new THREE.Vector3();
  };

  // pe = mgh
  const potential = () => {};

  // v ** 2 - v0 ** 2 = 2gh
  const kinetic = () => {};

  // Drag Coefficient = 0.47
  // ρ (Air density) = 1.225 [kg / m3]
  //mg= 1/2 * Cd * ρ * A * v ** 2 > 종단 속도
  const terminalVelocity = () => {};

  return {
    createMesh,

    calForce,
    calAcceleration,
    calVelocity,
    calCoordinate,
  };
};
