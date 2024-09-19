import { makeMesh } from "@/utils/threejs.utils";
import { useRef } from "react";
import * as THREE from "three";

export const useMesh = () => {
  const dt = 1 / 60; // [s] (10 times faster)
  const g = -9.805; // [m/s**2]
  const mass = 1; // [kg]

  const onClick = () => {};

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
    const cube = makeMesh(width, height, depth, color);
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
  const calForce = (force: THREE.Vector3) => {
    const gravity = new THREE.Vector3(0, g, 0);
    const totalForce = gravity.add(force.clone());
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
  const calCoordinate = (
    prevPosition: THREE.Vector3,
    prevVel: THREE.Vector3,
    vel: THREE.Vector3
  ) => {
    const cVel = vel.clone();
    const cpVel = prevVel.clone();
    const cPosition = prevPosition.clone();
    // const newPosition = cPosition.add(cpVel.add(cVel).multiplyScalar(dt / 2));

    const newPosition = cPosition.add(cpVel.add(cVel).multiplyScalar(dt / 2));

    return newPosition;
  };

  const collisionCheck2 = (mesh: THREE.Mesh, direction: THREE.Vector3) => {};

  const collisionCheck = (
    mesh: THREE.Mesh,
    newPosition: THREE.Vector3,
    collidable: any[] | null = null
  ) => {
    // Get a list of collidable meshes, excluding the current mesh
    let collidableMeshList =
      collidable ||
      Object.values(meshesRef.current).filter(
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
        return {
          normal: collisionResults[0].normal,
          isCollided: true,
        }; // Indicate that a collision occurred
      }
    }

    // No collision detected, return false
    return {
      normal: undefined,
      isCollided: false,
    };
  };

  // pe = mgh
  const potential = (vel: THREE.Vector3) => {};

  // v ** 2 - v0 ** 2 = 2gh
  const kinetic = (vel: THREE.Vector3) => {
    const h = Math.pow(vel.y, 2) / (2 * g);
    console.log(h);
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

  // Angular Momentum = I * w (I : moment of inertia, w : 각속도 = r(position vector) X v() / r**2)
  const angularMomentum = (v: THREE.Vector3) => {};

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
