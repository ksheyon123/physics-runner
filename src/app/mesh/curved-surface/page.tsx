"use client";
import * as THREE from "three";

import { useEffect, useRef, useState } from "react";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { useCamera } from "@/hooks/useCamera";
import { useRenederer } from "@/hooks/useRenderer";
import { useMesh } from "@/hooks/useMesh";
import { ForwardedCanvas } from "@/components/Canvas/Canvas";

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

      // 사각형 모양 정의
      const shape = new THREE.Shape();

      // 사각형의 왼쪽 아래 점에서 시작 (x, y)
      shape.moveTo(-2, -1);

      // 오른쪽 아래 점으로 이동
      shape.lineTo(2, -1);

      // 오른쪽 위로 이동
      shape.lineTo(2, 1);

      // CubicBezierCurve를 사용해 왼쪽 위로 곡선 그리기
      // 시작점 (2, 1), 끝점 (-2, 1), 제어점 두 개를 사용
      const curve = new THREE.CubicBezierCurve(
        new THREE.Vector2(2, 1), // 시작점
        new THREE.Vector2(1, 2), // 첫 번째 제어점 (곡률 조정 가능)
        new THREE.Vector2(-1, 2), // 두 번째 제어점 (곡률 조정 가능)
        new THREE.Vector2(-2, 1) // 끝점
      );

      // 곡선 포인트를 얻어서 shape에 추가
      const points = curve.getPoints(50); // 50은 곡선을 정의하는 세밀한 포인트 수
      for (let i = 0; i < points.length; i++) {
        const point = points[i];
        shape.lineTo(point.x, point.y);
      }

      // `ShapeGeometry`로 변환
      const geometry = new THREE.ShapeGeometry(shape);

      // 기본 재질 생성
      const material = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        side: THREE.DoubleSide,
      });

      // 메쉬 생성 및 장면에 추가
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

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
