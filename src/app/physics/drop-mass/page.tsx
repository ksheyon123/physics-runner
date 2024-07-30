"use client";

import { RefObject, useEffect, useRef, useState } from "react";

import * as THREE from "three";

import { useCamera } from "@/hooks/useCamera";
import { useRenederer } from "@/hooks/useRenderer";
import { useMesh } from "@/hooks/useMesh";

const Page = () => {
  const { createCamera } = useCamera();
  const { createRenderer, createScene } = useRenederer();
  const { createMesh, calForce, calAcceleration, calVelocity, calCoordinate } =
    useMesh();

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
      const renderer = createRenderer();
      canvasRef.current && canvasRef.current.appendChild(renderer.domElement);
      const mesh = createMesh();
      mesh.position.set(0, 100, 0);
      scene.add(mesh);

      const vel = new THREE.Vector3();
      let id: any;
      const animate = () => {
        id = requestAnimationFrame(animate);
        const prevPosition = mesh.position.clone();
        const force = calForce(new THREE.Vector3(), prevPosition);
        const acc = calAcceleration(force);
        const newVel = calVelocity(vel, acc);
        const newP = calCoordinate(prevPosition, newVel);
        if (newP.y <= 0) {
          newP.set(0, 0, 0);
          newVel.set(0, 0, 0);
        }
        mesh.position.set(newP.x, newP.y, newP.z);
        vel.set(newVel.x, newVel.y, newVel.z);
        renderer.render(scene, camera);
      };

      //   let d = setInterval(() => {
      //     clearInterval(d);
      //     cancelAnimationFrame(id);
      //     animate();
      //   }, 5000);
      animate();

      return () => {
        cancelAnimationFrame(id);
        // clearInterval(d);
      };
    }
  }, [isMounted]);

  return <div ref={canvasRef as RefObject<HTMLDivElement>} />;
};

export default Page;
