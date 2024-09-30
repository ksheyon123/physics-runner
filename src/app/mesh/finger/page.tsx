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

      const plane = makePlane(20, 20, 0x00ff00);
      plane.rotateX(Math.PI / 2);
      scene.add(plane);

      const height = 4;

      const p = { x: 0, y: 1, z: 0 };
      const cylinder0 = makeCylinder(1, height, 32);
      cylinder0.geometry.translate(0, height / 2, 0);
      cylinder0.position.set(p.x, p.y, p.z);
      cylinder0.rotateZ(-Math.PI / 2);
      scene.add(cylinder0);

      const cylinder1 = makeCylinder(1, 2, 32, 0xff00000);
      cylinder1.geometry.translate(0, 1, 0);
      cylinder1.position.set(4.5, p.y, p.z);
      cylinder1.rotateZ(-Math.PI / 2);
      scene.add(cylinder1);

      // 세타: 0에서 2π 사이의 임의의 값 (방위각)
      // 파이: 0에서 π/2 사이의 임의의 값 (고도각)

      let id: any;
      const animate = () => {
        controls.update();

        cylinder0.rotateZ(-0.01);
        const { x, y, z } = getHemiSpherePoint(4.5, 0, -cylinder0.rotation.z);

        cylinder1.position.set(x, y + 1, z);

        id = requestAnimationFrame(animate);
        renderer.render(scene, camera);

        cylinder0.rotation.z = cylinder0.rotation.z % (Math.PI / 2);
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
