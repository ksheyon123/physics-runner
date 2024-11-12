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
      // rootBone 시각화
      const rootVisual = createBoneVisual(0xff0000); // 빨간색
      rootBone.add(rootVisual);

      const midBone = new THREE.Bone();
      midBone.position.y = 5;
      rootBone.add(midBone);
      // midBone 시각화
      const midVisual = createBoneVisual(0x00ff00); // 초록색
      midBone.add(midVisual);

      const endBone = new THREE.Bone();
      endBone.position.y = 5;
      midBone.add(endBone);
      // endBone 시각화
      const endVisual = createBoneVisual(0x0000ff); // 파란색
      endBone.add(endVisual);

      // bone 연결선 표시 (흰색)
      const skeletonHelper = new THREE.SkeletonHelper(rootBone);
      scene.add(skeletonHelper);

      // Create skeleton with bones
      const skeleton = new THREE.Skeleton([rootBone, midBone, endBone]);

      // Geometry and material for the skinned mesh
      const geometry = new THREE.CylinderGeometry(1, 1, 10);
      const material = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        wireframe: true,
        transparent: true,
        opacity: 0.5,
      });
      const skinnedMesh = new THREE.SkinnedMesh(geometry, material);

      // Set up bone weights and indices
      const position = geometry.attributes.position;
      const vertex = new THREE.Vector3();

      const skinIndices = [];
      const skinWeights = [];

      // Vertices at the bottom (y < 0): We assign these vertices to rootBone (index 0) with full influence. skinIndices.push(0, 0, 0, 0); means only rootBone influences these vertices. skinWeights.push(1, 0, 0, 0); gives rootBone a weight of 1 (full influence).
      // Vertices in the middle (0 ≤ y < 5): We assign these vertices to midBone (index 1) with full influence, following the same pattern as above.
      // Vertices at the top (y ≥ 5): We assign these vertices to endBone (index 2), making endBone fully control them.
      for (let i = 0; i < position.count; i++) {
        vertex.fromBufferAttribute(position, i);

        if (vertex.y < -2) {
          // 아래쪽: rootBone만 영향
          skinIndices.push(0, 0, 0, 0);
          skinWeights.push(1, 0, 0, 0);
        } else if (vertex.y < 2) {
          // 중간: rootBone과 midBone의 혼합 영향
          const influence = (vertex.y + 2) / 4; // -2 ~ 2 범위를 0~1로 변환
          skinIndices.push(0, 1, 0, 0);
          skinWeights.push(1 - influence, influence, 0, 0);
        } else {
          // 위쪽: midBone과 endBone의 혼합 영향
          const influence = (vertex.y - 2) / 3; // 2 ~ 5 범위를 0~1로 변환
          skinIndices.push(1, 2, 0, 0);
          skinWeights.push(1 - influence, influence, 0, 0);
        }
      }

      // Assign skin attributes to the geometry
      geometry.setAttribute(
        "skinIndex",
        new THREE.Uint16BufferAttribute(skinIndices, 4)
      );
      geometry.setAttribute(
        "skinWeight",
        new THREE.Float32BufferAttribute(skinWeights, 4)
      );

      // Add the root bone to the skinned mesh and bind skeleton
      skinnedMesh.add(rootBone);
      skinnedMesh.bind(skeleton);

      // Position and add to scene
      skinnedMesh.position.set(0, 0, 0);
      scene.add(skinnedMesh);

      const animate = () => {
        controls.update();
        id = requestAnimationFrame(animate);

        // 각 bone에 다른 회전 애니메이션 적용
        const time = Date.now() * 0.001; // 시간 기반 애니메이션

        // rootBone: X축 회전
        rootBone.rotation.x = Math.sin(time) * 0.5;

        // midBone: Z축 회전
        midBone.rotation.z = Math.sin(time * 1.5) * 0.5;

        // endBone: Y축 회전
        endBone.rotation.y = Math.sin(time * 2) * 0.5;

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
