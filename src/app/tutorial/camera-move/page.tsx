"use client";
import * as THREE from "three";

import { useEffect, useRef, useState } from "react";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { useCamera } from "@/hooks/useCamera";
import { useRenederer } from "@/hooks/useRenderer";
import { useMesh } from "@/hooks/useMesh";
import { ForwardedCanvas } from "@/components/Canvas/Canvas";
import { makeMesh, makePlane, makeSphere } from "@/utils/threejs.utils";
import { polarToCartesian } from "@/utils/math.utils";

const Page = () => {
  const gap = 80;
  const canvasWidth = window.innerWidth;
  const canvasHeight = window.innerHeight - gap;
  const { createRenderer, createScene } = useRenederer();
  const {} = useMesh();

  const canvasRef = useRef<HTMLDivElement>(null);

  const sceneRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const {
    updateLookAt,
    camera,
    isLoaded: cameraLoaded,
  } = useCamera(canvasRef.current, rendererRef.current, sceneRef.current);

  const [isMounted, setIsMounted] = useState<boolean>(false);

  const hz = 1 / 60; //seconds

  useEffect(() => {
    sceneRef.current = createScene();
    // cameraRef.current = createCamera();
    // cameraRef.current.position.set(0, 0, 10);
    rendererRef.current = createRenderer(canvasWidth, canvasHeight);
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && cameraLoaded) {
      console.log("IS LOADED");
      // const camera = cameraRef.current;
      const renderer = rendererRef.current;
      const scene = sceneRef.current;
      canvasRef.current && canvasRef.current.appendChild(renderer.domElement);
      // const controls = new OrbitControls(camera, renderer.domElement);

      const plane = makePlane(10, 10);
      plane.rotateX(Math.PI / 2);
      scene.add(plane);

      const box = makeMesh(1, 1, 1);
      scene.add(box);

      let id: any;

      const animate = () => {
        id = requestAnimationFrame(animate);
        updateLookAt(box);
        renderer.render(scene, camera);
      };

      animate();

      return () => {
        cancelAnimationFrame(id);
      };
    }
  }, [isMounted, cameraLoaded]);

  return (
    <ForwardedCanvas
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
    />
  );
};

export default Page;
