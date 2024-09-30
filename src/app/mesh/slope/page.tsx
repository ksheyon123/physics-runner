"use client";
import * as THREE from "three";

import { useEffect, useRef, useState } from "react";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { useCamera } from "@/hooks/useCamera";
import { useRenederer } from "@/hooks/useRenderer";
import { useMesh } from "@/hooks/useMesh";
import { ForwardedCanvas } from "@/components/Canvas/Canvas";
import { combineTypedArray } from "@/utils/utils";
import {
  carvedBox,
  setIndexBetweenPlane,
  setIndexFromSingleVertex,
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

  const slope = () => {
    // Create the halfpipe geometry
    const geometry = new THREE.BufferGeometry();

    // Parameters for the halfpipe
    const width = 10;
    const depth = 5;
    const height = 5;
    const segments = 20; // More segments for a smoother curve

    // Vertices array for the halfpipe
    const vertices = [];

    // Generate the vertices for the halfpipe
    for (let i = 0; i <= segments; i++) {
      const t = i / segments; // From 0 to 1 across the curve
      const angle = Math.PI * t - Math.PI / 2; // Half-circle from -π/2 to π/2

      const y = Math.sin(angle) * height; // Curved height
      const z = Math.cos(angle) * depth; // Curved depth

      // Left and right side vertices for each segment
      vertices.push(-width / 2, y, z); // Left side
      vertices.push(width / 2, y, z); // Right side
    }

    // Define the faces (triangles) for the halfpipe
    const indices = [];
    for (let i = 0; i < segments; i++) {
      const a = i * 2;
      const b = a + 1;
      const c = a + 2;
      const d = a + 3;

      // Create two triangles per segment to form a quad (left and right faces)
      indices.push(a, b, c);
      indices.push(b, d, c);
    }

    // Set the positions and indices in the geometry
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(vertices), 3)
    );
    geometry.setIndex(indices);
    geometry.computeVertexNormals(); // Compute normals for lighting

    // Create a material and mesh for the halfpipe
    const material = new THREE.MeshStandardMaterial({
      color: 0x0077ff,
      side: THREE.DoubleSide,
    });
    const halfpipe = new THREE.Mesh(geometry, material);
    return halfpipe;
  };

  useEffect(() => {
    if (isMounted) {
      console.log("IS LOADED");
      const camera = cameraRef.current;
      const renderer = rendererRef.current;
      const scene = sceneRef.current;
      canvasRef.current && canvasRef.current.appendChild(renderer.domElement);
      const controls = new OrbitControls(camera, renderer.domElement);

      // prettier-ignore
      const firstVertices0 = [
        -0.5, -0.5, 0,
        -0.5, 1, 0,
        0, 1, 0,
        1, 0, 0,
        1, -0.5, 0,
      ];
      const secondVertices0 = firstVertices0.map((d, idx) =>
        (idx + 1) % 3 === 0 ? d + 3 : d
      );
      const mesh0 = carvedBox(firstVertices0, secondVertices0);
      scene.add(mesh0);

      // prettier-ignore
      const firstVertices1 = [
       1, -0.5, 0,
       1, 0, 0,
       3, 0, 0, 
       3, -0.5, 0
      ];
      const secondVertices1 = firstVertices1.map((d, idx) =>
        (idx + 1) % 3 === 0 ? d + 3 : d
      );

      const mesh1 = carvedBox(firstVertices1, secondVertices1);
      scene.add(mesh1);
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

  const secondPlane = () => {
    // 두 번째 면: Float32Array로 생성한 사각형 (곡선 부분에 연결할 사각형)
    const secondVertices = new Float32Array([
      -2.0,
      1.0,
      0.0, // 왼쪽 아래 (곡선의 마지막 점과 맞춤)
      2.0,
      1.0,
      0.0, // 오른쪽 아래 (곡선의 시작점과 맞춤)
      2.0,
      3.0,
      0.0, // 오른쪽 위
      -2.0,
      3.0,
      0.0, // 왼쪽 위
    ]);

    const secondIndices = new Uint16Array([
      0,
      1,
      2, // 첫 번째 삼각형
      0,
      2,
      3, // 두 번째 삼각형
    ]);

    const secondGeometry = new THREE.BufferGeometry();
    secondGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(secondVertices, 3)
    );
    secondGeometry.setIndex(new THREE.BufferAttribute(secondIndices, 1));

    // 두 번째 면 재질 및 메쉬 생성
    const secondMaterial = new THREE.MeshBasicMaterial({
      color: 0x0000ff,
      side: THREE.DoubleSide,
    });
    const secondMesh = new THREE.Mesh(secondGeometry, secondMaterial);
  };

  return (
    <ForwardedCanvas
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
    />
  );
};

export default Page;
