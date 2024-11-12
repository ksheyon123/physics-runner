"use client";
import * as THREE from "three";

import { useEffect, useRef, useState } from "react";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { useCamera } from "@/hooks/useCamera";
import { useRenederer } from "@/hooks/useRenderer";
import { useMesh } from "@/hooks/useMesh";
import { ForwardedCanvas } from "@/components/Canvas/Canvas";
import { makeCylinder } from "@/utils/threejs.utils";

const Page = () => {
  const gap = 80;
  const canvasWidth = window.innerWidth;
  const canvasHeight = window.innerHeight - gap;
  const canvasRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const { createCamera } = useCamera(
    canvasRef.current,
    rendererRef.current,
    sceneRef.current
  );
  const { createRenderer, createScene } = useRenederer();
  const {} = useMesh();

  const [isMounted, setIsMounted] = useState<boolean>(false);

  const hz = 1 / 60; //seconds

  useEffect(() => {
    sceneRef.current = createScene();
    cameraRef.current = createCamera();
    cameraRef.current.position.set(0, 0, 10);
    const renderer = createRenderer(canvasWidth, canvasHeight);
    rendererRef.current = renderer;

    const axesHelper = new THREE.AxesHelper(5);
    sceneRef.current.add(axesHelper);

    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      console.log("IS LOADED");
      const scene = sceneRef.current;
      const camera = cameraRef.current;
      const renderer = rendererRef.current;

      canvasRef.current && canvasRef.current.appendChild(renderer.domElement);
      const controls = new OrbitControls(camera, renderer.domElement);

      let id: any;

      // bone 시각화를 위한 함수
      const createBoneVisual = (color: number) => {
        const geometry = new THREE.SphereGeometry(0.5, 8, 8);
        const material = new THREE.MeshBasicMaterial({ color: color });
        return new THREE.Mesh(geometry, material);
      };

      // Create bones and attach them in a hierarchy
      const rootBone = new THREE.Bone();
      rootBone.position.y = -5;
      const rootVisual = createBoneVisual(0xff0000); // 빨간색
      rootBone.add(rootVisual);

      const midBone = new THREE.Bone();
      midBone.position.y = 5; // rootBone으로부터 5만큼 위로
      rootBone.add(midBone);
      const midVisual = createBoneVisual(0x00ff00); // 초록색
      midBone.add(midVisual);

      const endBone = new THREE.Bone();
      endBone.position.y = 5; // midBone으로부터 5만큼 위로
      midBone.add(endBone);
      const endVisual = createBoneVisual(0x0000ff); // 파란색
      endBone.add(endVisual);

      // bone 연결선 표시 (흰색)
      const skeletonHelper = new THREE.SkeletonHelper(rootBone);
      scene.add(skeletonHelper);

      // Create skeleton with bones
      const skeleton = new THREE.Skeleton([endBone, midBone, rootBone]);

      // Geometry and material for the skinned mesh
      const geometry = new THREE.CylinderGeometry(0.5, 0.5, 10, 32);
      const material = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        wireframe: true,
        transparent: true,
        opacity: 0.5,
      });

      // 중요: SkinnedMesh를 생성하기 전에 geometry를 복제
      const skinnedGeometry = geometry.clone();
      const skinnedMesh = new THREE.SkinnedMesh(skinnedGeometry, material);

      // Set up bone weights and indices
      const position = skinnedGeometry.attributes.position;
      const vertex = new THREE.Vector3();

      const skinIndices = [];
      const skinWeights = [];

      for (let i = 0; i < position.count; i++) {
        vertex.fromBufferAttribute(position, i);

        // y값을 -5에서 5 사이로 정규화
        const y = vertex.y;

        if (y < 0) {
          // 하단부: rootBone(0)과 midBone(1)의 영향
          const influence = (y + 5) / 5; // -5~0 범위를 0~1로 변환
          skinIndices.push(0, 1, 0, 0);
          skinWeights.push(1 - influence, influence, 0, 0);
        } else {
          // 상단부: midBone(1)과 endBone(2)의 영향
          const influence = y / 5; // 0~5 범위를 0~1로 변환
          skinIndices.push(1, 2, 0, 0);
          skinWeights.push(1 - influence, influence, 0, 0);
        }
      }

      // Assign skin attributes to the geometry
      skinnedGeometry.setAttribute(
        "skinIndex",
        new THREE.Uint16BufferAttribute(skinIndices, 4)
      );
      skinnedGeometry.setAttribute(
        "skinWeight",
        new THREE.Float32BufferAttribute(skinWeights, 4)
      );

      // 중요: 본 계층구조를 먼저 씬에 추가
      scene.add(rootBone);

      // SkinnedMesh를 씬에 추가
      skinnedMesh.add(rootBone);
      skinnedMesh.bind(skeleton);
      scene.add(skinnedMesh);

      // 스켈레톤 헬퍼는 마지막에 추가

      const animate = () => {
        controls.update();
        id = requestAnimationFrame(animate);

        const time = Date.now() * 0.001;

        // rootBone은 고정
        rootBone.position.y = -5 + Math.sin(time);

        // midBone을 중심으로 구부러지는 움직임
        midBone.rotation.z = Math.sin(time) * 0.5;

        // endBone은 midBone의 움직임을 따라가되 약간의 지연효과
        // endBone.rotation.z = Math.sin(time - 0.2) * 0.3;

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
