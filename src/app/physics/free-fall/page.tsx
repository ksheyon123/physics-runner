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
import { OptionBox } from "@/components/OptionBox/OptionBox";
import { useText } from "@/hooks/useText";

const Page = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const { isLoaded, createText, updateText } = useText();
  const { createCamera } = useCamera(canvasRef.current);
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
    if (isMounted && isLoaded) {
      const scene = createScene();
      const camera = createCamera();

      const renderer = createRenderer(
        window.innerWidth,
        window.innerHeight - 80
      );

      canvasRef.current && canvasRef.current.appendChild(renderer.domElement);

      const mesh = createMesh(0.5, 0.5, 0.5, 0xff0000);
      mesh.position.set(0, 5, 0);
      scene.add(mesh);

      const prevVel = new THREE.Vector3();

      const textMesh = createText(prevVel.y.toString());
      textMesh.position.set(2, 5, 0);

      scene.add(textMesh);

      let handleId: any;

      const animate = () => {
        const prevPosition = mesh.position.clone();
        const force = calForce(new THREE.Vector3());
        const acc = calAcceleration(force);
        const newVel = calVelocity(prevVel, acc);
        const newP = calCoordinate(prevPosition, prevVel, newVel);

        mesh.position.set(newP.x, newP.y, newP.z);
        prevVel.set(newVel.x, newVel.y, newVel.z);
        updateText(textMesh, newVel.y.toString());
        textMesh.position.set(2, newP.y, newP.z);

        camera.position.set(0, newP.y, 10);
        camera.lookAt(newP.x, newP.y, newP.z);
        // divEl.innerHTML = "Vel y : " + newVel.y;
        handleId = requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };

      animate();
      return () => cancelAnimationFrame(handleId);
    }
  }, [isMounted, isLoaded]);

  useEffect(() => {
    const scene = createScene();
    sceneRef.current = scene;
    setIsMounted(true);
  }, []);

  return (
    <>
      <ForwardedCanvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight - 80}
      >
        <OptionBox />
      </ForwardedCanvas>
    </>
  );
};

export default Page;
