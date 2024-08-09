"use client";

import { useCamera } from "@/hooks/useCamera";
import { useMesh } from "@/hooks/useMesh";
import { useRenederer } from "@/hooks/useRenderer";
import { RefObject, useEffect, useRef, useState } from "react";

import styled from "styled-components";

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const Page = () => {
  const { createCamera } = useCamera();
  const { createRenderer, createScene } = useRenederer();
  const { createMesh } = useMesh();

  const canvasRef = useRef<HTMLDivElement>();
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
          const v = j / heightSegments;
          const x = u * width - width / 2;
          const y = v * height - height / 2;

          // Modify the z-coordinate to make the plane asymmetric on the ZY plane
          // Introduce an asymmetric term in the z calculation
          const z = Math.sin(u * Math.PI) * 2; // Asymmetric term

          vertices.push(x, y, z);
        }
      }

      // Calculate indices
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

      curvedPlane.rotation.x = 90;
      curvedPlane.position.set(0, -2.5, 0);
      scene.add(curvedPlane);

      // Get the position attribute (which contains the vertices)
      const positionAttribute = curvedPlane.geometry.attributes.position;
      const normalAttribute = curvedPlane.geometry.attributes.normal;
      // Choose a random vertex index
      const randomIndex = Math.floor(10);
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

      // Step 2: Define the cube's local up vector
      const cubeUpVector = new THREE.Vector3(0, 1, 0);

      // Step 3: Compute the rotation axis
      const rotationAxis = new THREE.Vector3();
      rotationAxis.crossVectors(cubeUpVector, normal).normalize();

      // Step 4: Compute the rotation angle
      const angle = Math.acos(
        cubeUpVector.dot(normal) / (cubeUpVector.length() * normal.length())
      );

      // Step 5: Create the quaternion
      const quaternion = new THREE.Quaternion();
      quaternion.setFromAxisAngle(rotationAxis, angle);

      // Step 6: Apply the quaternion to the cube
      mesh.setRotationFromQuaternion(quaternion);

      // Optionally, you can move the cube to the vertex position
      // const vertexPosition = new THREE.Vector3();
      // vertexPosition.fromBufferAttribute(
      //   curvedPlane.geometry.attributes.position,
      //   randomIndex
      // );
      const a = new THREE.Vector3(0, 0, 0);
      mesh.position.copy(randomVertex);

      scene.add(mesh);
      const animate = (t: number) => {
        // requestAnimationFrame(animate);
        controls.update();

        renderer.render(scene, camera);
      };
      // animate();
      renderer.setAnimationLoop(animate);
    }
  }, [isMounted]);

  return (
    <StyledDrawer
      $width={window.innerWidth}
      $height={window.innerHeight - 80}
      ref={canvasRef as RefObject<HTMLDivElement>}
    />
  );
};

const StyledDrawer = styled.div<{ $width?: number; $height?: number }>`
  position: relative;
  width: ${(props) => `${props.$width}px` || "100%"};
  height: ${(props) => `${props.$height}px` || "100%"};
`;

export default Page;
