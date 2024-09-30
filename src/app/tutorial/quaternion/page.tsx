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
  makeMesh,
  makePlane,
  makeSphere,
} from "@/utils/threejs.utils";

const Page = () => {
  const gap = 80;
  const canvasWidth = window.innerWidth;
  const canvasHeight = window.innerHeight - gap;
  const { createCamera } = useCamera();
  const { createRenderer, createScene } = useRenederer();
  const {} = useMesh();

  const canvasRef = useRef<HTMLDivElement>(null);

  const sceneRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);

  const [isMounted, setIsMounted] = useState<boolean>(false);

  const hz = 1 / 60; //seconds

  useEffect(() => {
    sceneRef.current = createScene();
    cameraRef.current = createCamera();
    cameraRef.current.position.set(0, 0, 10);
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

      // Make Plane to clear the coordinate
      const plane = makePlane(10, 10, 0x000000);
      plane.rotateX(Math.PI / 2);
      scene.add(plane);

      const radius = 3;
      const sphere = makeSphere(radius, 32, 0, 0, 0, Math.PI / 2);
      scene.add(sphere);

      const box = makeMesh(1, 1, 1, 0xff0000);
      box.position.set(0, 3, 0);
      scene.add(box);

      let theta = 0;
      let phi = Math.PI / 2;

      let id: any;
      const animate = () => {
        controls.update();

        // 새로운 Quaternion을 만듭니다.
        const quaternion = new THREE.Quaternion();
        const { x, y, z } = getHemiSpherePoint(radius, theta, phi);
        // 회전축(x, y, z)와 회전 각도를 설정합니다.
        const axis = new THREE.Vector3(x, y, z); // y축
        const angle = Math.PI / 4; // 45도

        // Quaternion을 회전축과 각도로 설정합니다.
        quaternion.setFromAxisAngle(axis, angle);
        box.position.set(x, y, z);
        box.quaternion.copy(quaternion);
        id = requestAnimationFrame(animate);
        renderer.render(scene, camera);

        theta += 0.001;
        phi += 0.005;
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
