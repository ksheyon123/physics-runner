"use client";
import * as THREE from "three";

import { useEffect, useRef, useState } from "react";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { useCamera } from "@/hooks/useCamera";
import { useRenederer } from "@/hooks/useRenderer";
import { useMesh } from "@/hooks/useMesh";
import { ForwardedCanvas } from "@/components/Canvas/Canvas";
import { makeMesh, makeSphere } from "@/utils/threejs.utils";
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

      const sphere = makeSphere();
      scene.add(sphere);

      const box = makeMesh(1, 1, 1);
      scene.add(box);

      let phi = 0;
      let id: any;
      const animate = () => {
        updateLookAt(sphere);

        const { x, y, z } = polarToCartesian(5 + 0.5, 0, phi);

        box.position.set(x, y, z);

        // Box의 기본 "위쪽" 방향 (0, 1, 0)과 법선 벡터 (x, y, z)를 맞추는 Quaternion 계산
        const up = new THREE.Vector3(0, 1, 0); // Box의 기본 '위쪽' 방향
        const normal = new THREE.Vector3(x, y, z).normalize(); // 구의 표면에 수직인 법선 벡터

        const quaternion = new THREE.Quaternion();
        quaternion.setFromUnitVectors(up, normal);
        box.quaternion.copy(quaternion);

        id = requestAnimationFrame(animate);
        renderer.render(scene, camera);
        phi += 0.01;
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
