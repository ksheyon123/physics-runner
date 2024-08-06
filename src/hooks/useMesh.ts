import { useRef } from "react";
import * as THREE from "three";

export const useMesh = () => {
  const dt = 1 / 6; // [s] (10 times faster)
  const g = -9.805; // [m/s**2]
  const mass = 1; // [kg]

  const meshesRef = useRef<{
    [key: string]: THREE.Mesh<
      any,
      THREE.MeshBasicMaterial,
      THREE.Object3DEventMap
    >;
  }>({});

  const specsRef = useRef<any>({
    dt: 1 / 6, // [s]
    mass: 1, // [kg]
    cor: 1, // coefficient of restitution (0 ~ 1)
  });

  /**
   *
   * @returns {THREE.Mesh} Mesh Object
   */
  const createMesh = (
    width?: number,
    height?: number,
    depth?: number,
    color?: number
  ) => {
    const geometry = new THREE.BoxGeometry(width || 5, height || 5, depth || 5);
    const material = new THREE.MeshBasicMaterial({ color: color || 0x000000 });
    const cube = new THREE.Mesh(geometry, material);
    meshesRef.current = {
      ...meshesRef.current,
      [cube.uuid]: cube,
    };
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

  const collisionCheck = (mesh: THREE.Mesh, newPosition: THREE.Vector3) => {
    // Get a list of collidable meshes, excluding the current mesh
    let collidableMeshList = Object.values(meshesRef.current).filter(
      (el: any) => mesh.uuid !== el.uuid
    );
    const cloneMeshWithNewPosition = mesh
      .clone()
      .position.set(newPosition.x, newPosition.y, newPosition.z);
    // Get the positions attribute from the geometry
    const positionAttribute = mesh.geometry.attributes.position;

    // Iterate through each vertex of the mesh
    for (
      let vertexIndex = 0;
      vertexIndex < positionAttribute.count;
      vertexIndex++
    ) {
      // Get the local vertex position
      const localVertex = new THREE.Vector3().fromBufferAttribute(
        positionAttribute,
        vertexIndex
      );

      // Transform the local vertex to world coordinates
      const globalVertex = localVertex.clone().applyMatrix4(mesh.matrixWorld);

      // Calculate the direction vector from the mesh position to the global vertex
      const directionVector = globalVertex
        .clone()
        .sub(cloneMeshWithNewPosition);

      // Create a raycaster from the mesh position along the direction vector
      const ray = new THREE.Raycaster(
        cloneMeshWithNewPosition,
        directionVector.clone().normalize()
      );
      const collisionResults = ray.intersectObjects(collidableMeshList);

      // Check if there's a collision
      if (
        collisionResults.length > 0 &&
        collisionResults[0].distance < directionVector.length()
      ) {
        // Collision detected, handle it here
        return true; // Indicate that a collision occurred
      }
    }

    // No collision detected, return false
    return false;
  };

  // pe = mgh
  const potential = (vel: THREE.Vector3) => {};

  // v ** 2 - v0 ** 2 = 2gh
  const kinetic = (vel: THREE.Vector3) => {
    const h = Math.pow(vel.y, 2) / (2 * g);
    // const newVy = Math.sqrt(Math.abs(2 * h * 9.81));
    const newVy = Math.sqrt(2 * g * h);
    return new THREE.Vector3(0, newVy, 0);
    // mgh = mv2
  };

  // Drag Coefficient = 0.47, cube = 1.05
  // ρ (Air density) = 1.225 [kg / m3]
  //mg= 1/2 * Cd * ρ * A * v ** 2 > 종단 속도
  const dragForce = (
    Cd: number,
    density: number,
    area: number,
    velocity: number
  ) => {
    const dragForce = (1 / 2) * Cd * density * area * Math.pow(velocity, 2);
    return new THREE.Vector3(0, dragForce, 0);
  };

  // coefficient of restitution (반발계수)

  return {
    createMesh,

    calForce,
    calAcceleration,
    calVelocity,
    calCoordinate,
    collisionCheck,
    kinetic,
    dragForce,
  };
};
