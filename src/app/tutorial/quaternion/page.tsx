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
import { polarToCartesian } from "@/utils/math.utils";

const Page = () => {
  const gap = 80;
  const canvasWidth = window.innerWidth;
  const canvasHeight = window.innerHeight - gap;
  const canvasRef = useRef<HTMLDivElement>(null);
  const { createCamera } = useCamera(canvasRef.current);
  const { createRenderer, createScene } = useRenederer();
  const {} = useMesh();

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
      box.position.set(0, 3.5, 0);
      scene.add(box);

      // Quaternion을 사용하여 박스의 위치와 회전 설정
      let phi = 0;
      let theta = 0;

      setInterval(() => {
        phi = Math.random() * (Math.PI / 2); // 0 ~ 90
        theta = Math.random() * (2 * Math.PI); // 0 ~ 360
      }, 1000);

      let id: any;
      const animate = () => {
        controls.update();

        // 구의 표면에서 회전하는 위치 계산
        const { x, y, z } = polarToCartesian(radius, theta, phi);

        // 박스의 위치 업데이트
        box.position.set(x, y, z);

        // Box의 기본 "위쪽" 방향 (0, 1, 0)과 법선 벡터 (x, y, z)를 맞추는 Quaternion 계산
        const up = new THREE.Vector3(0, 1, 0); // Box의 기본 '위쪽' 방향
        const normal = new THREE.Vector3(x, y, z).normalize(); // 구의 표면에 수직인 법선 벡터

        const quaternion = new THREE.Quaternion();
        quaternion.setFromUnitVectors(up, normal);
        box.quaternion.copy(quaternion);

        id = requestAnimationFrame(animate);
        renderer.render(scene, camera);

        // theta += 0.001;
        // phi += 0.005;
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
