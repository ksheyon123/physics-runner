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
      const gap = 1;

      const joint0 = makeSphere(1, 32);
      scene.add(joint0);

      const joint1 = makeSphere(1, 32);
      joint1.position.set(height + gap / 2, 0, 0);
      scene.add(joint1);

      const joint2 = makeSphere(1, 32);
      joint2.position.set(height + gap + height / 2 + gap / 2, 0, 0);
      scene.add(joint2);

      const cylinder0 = makeCylinder(1, height, 32, 0x0000ff);
      cylinder0.geometry.translate(0, height / 2, 0);
      cylinder0.position.set(0, 0, 0);
      cylinder0.rotateZ(-Math.PI / 2);
      scene.add(cylinder0);

      const cylinder1 = makeCylinder(1, height / 2, 32, 0x0000ff);
      cylinder1.geometry.translate(0, height / 4, 0);
      cylinder1.position.set(height + gap, 0, 0);
      cylinder1.rotateZ(-Math.PI / 2);
      scene.add(cylinder1);

      const cylinder2 = makeCylinder(1, height / 4, 32, 0x0000ff);
      cylinder2.geometry.translate(0, height / 8, 0);
      cylinder2.position.set(height + gap + height / 2 + gap, 0, 0);
      cylinder2.rotateZ(-Math.PI / 2);
      scene.add(cylinder2);

      // 세타: 0에서 2π 사이의 임의의 값 (방위각)
      // 파이: 0에서 π/2 사이의 임의의 값 (고도각)

      let d = -1;
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
