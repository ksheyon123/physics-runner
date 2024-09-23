"use client";
import * as THREE from "three";

import { useEffect, useRef, useState } from "react";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { useCamera } from "@/hooks/useCamera";
import { useRenederer } from "@/hooks/useRenderer";
import { useMesh } from "@/hooks/useMesh";
import { ForwardedCanvas } from "@/components/Canvas/Canvas";
import BigNumber from "bignumber.js";

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

  const [coordinate, setCoordinate] = useState<number[]>([]);

  const hz = 1 / 60; //seconds

  useEffect(() => {
    sceneRef.current = createScene();
    cameraRef.current = createCamera();
    cameraRef.current.position.set(0, 0, 10);
    rendererRef.current = createRenderer(canvasWidth, canvasHeight);
    // (0, 0, 0)을 기준으로 반지름이 1인 반원
    // x**2 + y**2 = r**2
    let coords = [0, 0, 0];
    for (let x = -1; x <= 1; x = BigNumber(x).plus(0.1).toNumber()) {
      const y = 1 - Math.pow(x, 2);
      const newCoord = [x, y, 0];
      coords = [...coords, ...newCoord];
    }
    setCoordinate(coords);
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && coordinate?.length > 0) {
      console.log("IS LOADED");
      const camera = cameraRef.current;
      const renderer = rendererRef.current;
      const scene = sceneRef.current;
      canvasRef.current && canvasRef.current.appendChild(renderer.domElement);
      const controls = new OrbitControls(camera, renderer.domElement);

      // prettier-ignore
      const vertices = new Float32Array([
        // 아래 직선 부분
        0, 0, 0,
        1, 0, // 왼쪽 아래
        1.0, -1.0, 0.0, // 오른쪽 아래
        1.0, 1.0, 0.0, // 오른쪽 위

        // 곡선 부분을 구성하는 점들 (3개의 점으로 예시)
        0.8, 1.2, 0.0, // 오른쪽 곡선 제어점
        0.0, 1.4, 0.0, // 중앙 곡선 제어점
        -1.0, 1.0, 0.0, // 왼쪽 위
      ]);

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
  }, [isMounted, coordinate]);

  return (
    <ForwardedCanvas
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
    />
  );
};

export default Page;
