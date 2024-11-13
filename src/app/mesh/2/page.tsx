"use client";
import * as THREE from "three";

import { useEffect, useRef, useState } from "react";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { useCamera } from "@/hooks/useCamera";
import { useRenederer } from "@/hooks/useRenderer";
import { useMesh } from "@/hooks/useMesh";
import { ForwardedCanvas } from "@/components/Canvas/Canvas";
import {
  getHemiSpherePoint,
  makeCylinder,
  makePlane,
  makeSphere,
} from "@/utils/threejs.utils";
import { useEventHandler } from "@/hooks/useEventHandler";
import { createBoneVisual, thumb } from "@/utils/mesh.utils";

const Page = () => {
  const gap = 80;
  const canvasWidth = window.innerWidth;
  const canvasHeight = window.innerHeight - gap;
  const canvasRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const { createCamera } = useCamera(
    canvasRef.current,
    rendererRef.current,
    sceneRef.current
  );
  const { createRenderer, createScene } = useRenederer();
  const {} = useMesh();

  const [isMounted, setIsMounted] = useState<boolean>(false);

  const hz = 1 / 60; //seconds

  useEffect(() => {
    sceneRef.current = createScene();
    cameraRef.current = createCamera();
    cameraRef.current.position.set(0, 0, 10);
    const axesHelper = new THREE.AxesHelper(5);
    sceneRef.current.add(axesHelper);
    rendererRef.current = createRenderer(canvasWidth, canvasHeight);
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      console.log("IS LOADED");
      const camera = cameraRef.current;
      const renderer = rendererRef.current;
      const scene = sceneRef.current;
      canvasRef.current && canvasRef.current.appendChild(renderer.domElement);
      const controls = new OrbitControls(camera, renderer.domElement);

      const baseBone = new THREE.Bone();
      baseBone.position.y = 0;
      const baseVisual = createBoneVisual(0x000000); // 검은색
      baseBone.add(baseVisual);
      // Create bones and attach them in a hierarchy
      const rootBone = new THREE.Bone();
      rootBone.position.y = 0;
      const rootVisual = createBoneVisual(0xff0000); // 빨간색
      rootBone.add(rootVisual);

      const midBone = new THREE.Bone();
      midBone.position.x = 5; // rootBone으로부터 5만큼 위로
      rootBone.add(midBone);
      const midVisual = createBoneVisual(0x00ff00); // 초록색
      midBone.add(midVisual);

      const endBone = new THREE.Bone();
      endBone.position.x = 5; // midBone으로부터 5만큼 위로
      midBone.add(endBone);
      const endVisual = createBoneVisual(0x0000ff); // 파란색
      endBone.add(endVisual);

      let id: any;
      const animate = () => {
        controls.update();
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
      width={canvasWidth}
      height={canvasHeight}
    />
  );
};

export default Page;
