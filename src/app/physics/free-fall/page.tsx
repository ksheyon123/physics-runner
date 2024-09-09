"use client";

import { Controller } from "@/components/Controller/Controller";
import { useCamera } from "@/hooks/useCamera";
import { useMesh } from "@/hooks/useMesh";
import { useRenederer } from "@/hooks/useRenderer";
import { createElement, RefObject, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import styled from "styled-components";
import { ForwardedCanvas } from "@/components/Canvas/Canvas";
import Cube from "@/types/Model";
import { div } from "three/webgpu";
import { Gauge } from "@/components/Gauge/Gauge";

const Page = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const { createCamera } = useCamera();
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
    if (isMounted) {
      const scene = createScene();
      const camera = createCamera();
      camera.position.set(0, 0, 10);
      camera.lookAt(0, 0, 0);
      const renderer = createRenderer(
        window.innerWidth,
        window.innerHeight - 80
      );

      canvasRef.current && canvasRef.current.appendChild(renderer.domElement);

      const mesh = createMesh(0.5, 0.5, 0.5, 0xff0000);
      mesh.position.set(0, 5, 0);
      scene.add(mesh);

      const prevVel = new THREE.Vector3();
      let handleId: any;
      const divEl = document.createElement("div");
      divEl.setAttribute(
        "style",
        "position : absolute; top : 0; right : 0; width : 100px; height : 50px"
      );
      canvasRef.current!.appendChild(divEl);
      const animate = () => {
        const prevPosition = mesh.position.clone();
        const force = calForce(new THREE.Vector3());
        const acc = calAcceleration(force);
        const newVel = calVelocity(prevVel, acc);

        const newP = calCoordinate(prevPosition, prevVel, newVel);

        mesh.position.set(newP.x, newP.y, newP.z);
        prevVel.set(newVel.x, newVel.y, newVel.z);

        divEl.innerHTML = "Vel y : " + newVel.y;
        handleId = requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };

      animate();
      return () => cancelAnimationFrame(handleId);
    }
  }, [isMounted]);

  useEffect(() => {
    const scene = createScene();
    sceneRef.current = scene;
    setIsMounted(true);
  }, []);

  return (
    <>
      <div>
        <Gauge key={""} value={0} onChangeValue={() => {}} />
      </div>
      <ForwardedCanvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight - 80}
      />
    </>
  );
};

export default Page;
