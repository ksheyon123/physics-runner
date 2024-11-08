"use client";

import { RefObject, useEffect, useRef, useState } from "react";

import * as THREE from "three";

import { useCamera } from "@/hooks/useCamera";
import { useRenederer } from "@/hooks/useRenderer";
import { useMesh } from "@/hooks/useMesh";
import styled from "styled-components";
import { ForwardedCanvas } from "@/components/Canvas/Canvas";
import {
  bindMesh,
  makeCylinder,
  makeMesh,
  makeSphere,
} from "@/utils/threejs.utils";

const Page = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const { createCamera } = useCamera(canvasRef.current, rendererRef.current, sceneRef.current);
  const { createRenderer, createScene } = useRenederer();

  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    const scene = createScene();
    const camera = createCamera();
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);
    const renderer = createRenderer(
      window.innerWidth,
      window.innerHeight - 80
    );
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      console.log("IS LOADED");
      const scene = sceneRef.current;
      const camera= cameraRef.current 
      const renderer = rendererRef.current;
      canvasRef.current && canvasRef.current.appendChild(renderer.domElement);

      const sphere = makeSphere(0.5);
      sphere.position.set(0, 0.5, 5.5);
      const cy = makeCylinder(5, 1, 32);
      const merged = bindMesh([cy, sphere]);
      scene.add(merged);
      let id: any;
      let angVel = 1 // [rad / s]
      const animate = () => {
        id = requestAnimationFrame(animate);


        renderer.render(scene, camera);
      };

      animate();

      return () => {
        cancelAnimationFrame(id);
      };
    }
  }, [isMounted]);

  return (
    <ForwardedCanvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight - 80}
    />
  );
};

export default Page;
