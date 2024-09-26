"use client";
import * as THREE from "three";

import { useEffect, useRef, useState } from "react";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { useCamera } from "@/hooks/useCamera";
import { useRenederer } from "@/hooks/useRenderer";
import { useMesh } from "@/hooks/useMesh";
import { ForwardedCanvas } from "@/components/Canvas/Canvas";
import { getCirclePolarCoordinate, halfCircle } from "@/utils/threejs.utils";
import { combineTypedArray } from "@/utils/utils";

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

      // 반쪽
      // -2, 0, 0 | -2, -2, 0 | 0, -2, 0
      const coords0 = getCirclePolarCoordinate(10, Math.PI / 2, 0, Math.PI);
      // prettier-ignore
      const vertices0 = new Float32Array([
        -1.2, -1.2, 0,
        -1.2, 0, 0,
        ...coords0,
        0, -1.2, 0,
      ]);
      const numberOfTriangle = vertices0.length / 3;

      console.log("numberOfTriangle 1 : ", numberOfTriangle);
      let bindings: number[] = [];
      for (let i = 1; i < numberOfTriangle - 1; i++) {
        bindings = [...bindings, 0, i, i + 1];
      }

      // prettier-ignore
      const verticesForBox = new Float32Array([
        -1.2, -1.2, 0, // 마지막 코드 생략
        -1.2, 0, 0,
        -1.2, 0, 1,
        -1.2, -1.2, 1,
      ]);
      const combinedTypeArr0 = combineTypedArray(vertices0, verticesForBox);
      const numberOfTriangle2 = combinedTypeArr0.length / 3;
      bindings = [...bindings, 14, 15, 16, 14, 16, 17];

      const coords1 = getCirclePolarCoordinate(10, Math.PI / 2, 1, Math.PI);
      console.log(coords1);
      // prettier-ignore
      const vertices1 = new Float32Array([
        -1.2, 0, 1,
        -1.2, -1.2, 1,
        ...coords1,
        0, -1.2, 1,
      ]);

      const combinedTypeArr1 = combineTypedArray(combinedTypeArr0, vertices1);

      const numberOfTriangle3 = combinedTypeArr1.length / 3;

      for (let i = numberOfTriangle2 - 1; i < numberOfTriangle3 - 1; i++) {
        bindings = [...bindings, 19, i, i + 1];
      }

      // 인덱스를 사용해 삼각형을 연속시킴
      const indices = new Uint16Array(bindings);

      // BufferGeometry 생성 및 설정
      const curvedGeometry = new THREE.BufferGeometry();
      curvedGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(combinedTypeArr1, 3)
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
