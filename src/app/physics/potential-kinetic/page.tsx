"use client";

import { ForwardedCanvas } from "@/components/Canvas/Canvas";
import { useCamera } from "@/hooks/useCamera";
import { useMesh } from "@/hooks/useMesh";
import { useRenederer } from "@/hooks/useRenderer";
import { RefObject, useEffect, useRef, useState } from "react";

import styled from "styled-components";

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const Page = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const { createCamera } = useCamera(canvasRef.current, rendererRef.current, sceneRef.current);
  const { createRenderer, createScene } = useRenederer();
  const {
    createMesh,
    calForce,
    calAcceleration,
    calVelocity,
    calCoordinate,
    collisionCheck,
  } = useMesh();

  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const scene = createScene();
      const camera = createCamera();

      const renderer = createRenderer(
        window.innerWidth,
        window.innerHeight - 80
      );

      canvasRef.current && canvasRef.current.appendChild(renderer.domElement);
      const controls = new OrbitControls(camera, renderer.domElement);
      camera.position.set(0, 0, 10);
      controls.update();

      // Parameters for the curved plane
      const width = 10;
      const height = 10;
      const widthSegments = 40;
      const heightSegments = 40;

      // Create a buffer geometry
      const curvedPlaneGeometry = new THREE.BufferGeometry();

      // Calculate vertices
      const vertices = [];
      for (let i = 0; i <= widthSegments; i++) {
        for (let j = 0; j <= heightSegments; j++) {
          const u = i / widthSegments;
          const w = j / heightSegments;
          const x = u * width - width / 2; //
          const z = w * height - height / 2;

          // Modify the z-coordinate to make the plane asymmetric on the ZY plane
          // Introduce an asymmetric term in the z calculation
          const y = -Math.sin(u * Math.PI) * 2; // Asymmetric term
          vertices.push(x, y, z);
        }
      }

      // Calculate indices
      // A single segment vertices position
      // |a, c|
      // |b, d|
      const indices = [];
      for (let i = 0; i < widthSegments; i++) {
        for (let j = 0; j < heightSegments; j++) {
          const a = i * (heightSegments + 1) + j;
          const b = i * (heightSegments + 1) + j + 1;
          const c = (i + 1) * (heightSegments + 1) + j;
          const d = (i + 1) * (heightSegments + 1) + j + 1;
          indices.push(a, b, d);
          indices.push(a, d, c);
        }
      }

      // Create a buffer attribute for the vertices
      curvedPlaneGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(vertices, 3)
      );
      curvedPlaneGeometry.setIndex(indices);
      curvedPlaneGeometry.computeVertexNormals();

      // Create a material
      const material = new THREE.MeshBasicMaterial({
        color: 0x0077ff,
        wireframe: true,
        side: THREE.DoubleSide,
      });
      const curvedPlane = new THREE.Mesh(curvedPlaneGeometry, material);

      curvedPlane.position.set(0, -0.25, 0);
      scene.add(curvedPlane);

      // Get the position attribute (which contains the vertices)
      const positionAttribute = curvedPlane.geometry.attributes.position;
      // Choose a random vertex index
      const randomIndex = Math.floor(20);
      const randomVertex = new THREE.Vector3().fromBufferAttribute(
        positionAttribute,
        randomIndex
      );
      const mesh = createMesh(0.5, 0.5, 0.5);

      // Step 1: Compute the normal at the vertex
      const normal = new THREE.Vector3();
      curvedPlane.geometry.computeVertexNormals();
      normal.fromBufferAttribute(
        curvedPlane.geometry.attributes.normal,
        randomIndex
      );
      // mesh.rotateZ(-normal.x / normal.y);

      mesh.position.set(randomVertex.x, randomVertex.y + 0.01, randomVertex.z);

      mesh.rotateZ(-normal.x / normal.y);
      scene.add(mesh);

      const prevVel = new THREE.Vector3();
      let uForce = new THREE.Vector3();

      const animate = (t: number) => {
        const curPosition = mesh.position.clone();
        const g = 9.805;

        const force = calForce(uForce);
        console.log(force);
        const acc = calAcceleration(force);
        const newVel = calVelocity(prevVel, acc);
        const newP = calCoordinate(curPosition, prevVel, newVel);

        const { isCollided } = collisionCheck(
          mesh,
          new THREE.Vector3(curPosition.x, curPosition.y - 0.02, curPosition.z),
          [curvedPlane]
        );
        const { normal } = collisionCheck(mesh, newP, [curvedPlane]);
        if (isCollided) {
          const theta = Math.acos((normal?.x || 0) / (normal?.y || 0));
          uForce = new THREE.Vector3(
            g * Math.cos(theta),
            g * Math.sin(theta),
            0
          );
        } else {
          uForce = new THREE.Vector3();
        }

        mesh.position.copy(newP);
        prevVel.set(newVel.x, newVel.y, newVel.z);
        controls.update();

        renderer.render(scene, camera);
      };
      // animate();
      renderer.setAnimationLoop(animate);
    }
  }, [isMounted]);

  const getNormalAtPoint = (
    mesh: THREE.Mesh,
    point: THREE.Vector3,
    direction: THREE.Vector3
  ) => {
    const raycaster = new THREE.Raycaster();
    raycaster.ray.origin.copy(point);
    raycaster.ray.direction.set(direction.x, direction.y, direction.z); // Direction of ray (assuming downward in the Z-axis)

    const intersects = raycaster.intersectObject(mesh); // mesh is the object containing the geometry
    if (intersects.length > 0) {
      const intersect = intersects[0];

      // Get the face normal
      const normal = intersect.face!.normal.clone();
      console.log(normal);
      // normal.applyQuaternion(mesh.quaternion); // Apply the mesh's rotation to get the world normal

      return normal;
    }
    return null; // No intersection found, return null
  };

  return (
    <ForwardedCanvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight - 80}
    />
  );
};

export default Page;
