"use client";

import { RefObject, useEffect, useRef, useState } from "react";

import * as THREE from "three";

import { useCamera } from "@/hooks/useCamera";
import { useRenederer } from "@/hooks/useRenderer";
import { useMesh } from "@/hooks/useMesh";
import styled from "styled-components";

const Page = () => {
  const { createCamera } = useCamera();
  const { createRenderer, createScene } = useRenederer();
  const {
    createMesh,
    calForce,
    calAcceleration,
    calVelocity,
    calCoordinate,
    collisionCheck,
    kinetic,
    dragForce,
  } = useMesh();

  const canvasRef = useRef<HTMLDivElement>();

  const [isMounted, setIsMounted] = useState<boolean>(false);

  const hz = 1 / 60; //seconds

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      console.log("IS LOADED");
      const scene = createScene();
      const camera = createCamera();
      camera.position.set(0, 0, 200);
      camera.lookAt(0, 0, 0);
      const renderer = createRenderer(
        window.innerWidth,
        window.innerHeight - 80
      );
      canvasRef.current && canvasRef.current.appendChild(renderer.domElement);
      const mesh = createMesh(0, 0, 0, 0xff0000);
      mesh.position.set(0, 100, 0);
      scene.add(mesh);

      const plane = createMesh(100, 100, 1);
      plane.position.set(0, 0, 0);
      plane.rotation.x = 90;

      const plane2 = createMesh(100, 100, 1);
      plane2.position.set(10, 0, 0);
      scene.add(plane);

      const vel = new THREE.Vector3();
      let id: any;
      const animate = () => {
        id = requestAnimationFrame(animate);
        const prevPosition = mesh.position.clone();
        const dForce = dragForce(0.47, 1.225, 1, vel.y);
        // const dForce = new THREE.Vector3();
        const force = calForce(dForce, prevPosition);
        const acc = calAcceleration(force);
        const newVel = calVelocity(vel, acc);
        const newP = calCoordinate(prevPosition, newVel);
        // if (collisionCheck(mesh, newP)) {
        //   console.log("Collided");
        //   const { x, y, z } = kinetic(newVel);
        //   newVel.set(x, y, z);
        if (newP.y <= 0) {
          const { x, y, z } = kinetic(vel);
          newVel.set(x, y, z);
        }

        mesh.position.set(newP.x, newP.y, newP.z);
        vel.set(newVel.x, newVel.y, newVel.z);
        renderer.render(scene, camera);
      };

      animate();

      return () => {
        cancelAnimationFrame(id);
      };
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
