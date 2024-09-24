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

  const [vertices, setVertices] = useState<Float32Array>();

  const hz = 1 / 60; //seconds

  useEffect(() => {
    sceneRef.current = createScene();
    cameraRef.current = createCamera();
    cameraRef.current.position.set(0, 0, 10);
    rendererRef.current = createRenderer(canvasWidth, canvasHeight);
    // (0, 0, 0)을 기준으로 반지름이 1인 반원
    // x**2 + y**2 = r**2
    let coords = [0, 0, 0, 1, 0, 0];
    const numberOfPoints = 10;
    for (let i = 0; i <= numberOfPoints; i++) {
      const theta = (Math.PI * i) / numberOfPoints;
      const x = Math.cos(theta);
      const y = Math.sin(theta);
      coords = [...coords, x, y, 0];
    }
    const tmp = new Float32Array(coords);
    setVertices(tmp);
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && vertices) {
      console.log("IS LOADED");
      const camera = cameraRef.current;
      const renderer = rendererRef.current;
      const scene = sceneRef.current;
      canvasRef.current && canvasRef.current.appendChild(renderer.domElement);
      const controls = new OrbitControls(camera, renderer.domElement);

      const numberOfTriangle = vertices.length / 3;

      let tmp: number[] = [];
      for (let i = 1; i < numberOfTriangle - 1; i++) {
        tmp = [...tmp, 0, i, i + 1];
      }

      // 인덱스를 사용해 삼각형을 연속시킴
      const indices = new Uint16Array(tmp);

      // BufferGeometry 생성 및 설정
      const curvedGeometry = new THREE.BufferGeometry();
      curvedGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(vertices, 3)
      );
      curvedGeometry.setIndex(new THREE.BufferAttribute(indices, 1));
      //   // 첫 번째 면 재질 및 메쉬 생성
      const curvedMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        wireframe: true,
      });
      const curvedMesh = new THREE.Mesh(curvedGeometry, curvedMaterial);
      scene.add(curvedMesh);

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
  }, [isMounted, vertices]);

  return (
    <ForwardedCanvas
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
    />
  );
};

export default Page;
