"use client";
import * as THREE from "three";

import { useEffect, useRef, useState } from "react";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { useCamera } from "@/hooks/useCamera";
import { useRenederer } from "@/hooks/useRenderer";
import { useMesh } from "@/hooks/useMesh";
import { ForwardedCanvas } from "@/components/Canvas/Canvas";
import { useRaycaster } from "@/hooks/useRaycaster";
import { makeMesh } from "@/utils/threejs.utils";
import { usePin } from "@/hooks/usePin";

const Page = () => {
  const gap = 80;
  const canvasWidth = window.innerWidth;
  const canvasHeight = window.innerHeight - gap;
  const { createCamera } = useCamera();
  const { createRenderer, createScene } = useRenederer();
  const { calPointerCoord, rayCrossing } = useRaycaster(
    window.innerWidth,
    window.innerHeight,
    gap
  );
  const canvasRef = useRef<HTMLDivElement>(null);

  const sceneRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);

  const { add, remove } = usePin(
    rendererRef.current,
    sceneRef.current,
    cameraRef.current
  );

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

      const mesh = makeMesh();
      mesh.rotateZ(Math.PI / 3);
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

  useEffect(() => {
    const canvas = canvasRef.current;
    const camera = cameraRef.current;
    const scene = sceneRef.current;
    const renderer = rendererRef.current;
    if (isMounted && canvas && camera && scene && renderer) {
      //   // Assuming you have your mesh object (e.g., randomMesh)
      //   const box = new THREE.Box3().setFromObject(randomMesh);

      //   // box.min and box.max contain the bounding box coordinates
      //   const height = box.max.y - box.min.y;

      const mousedownEvent = (e: MouseEvent) => {
        const coords = calPointerCoord(e);
        const [intersections] = rayCrossing(coords, camera, scene);
        const mesh = intersections?.object || undefined;
        if (mesh) {
          const box = new THREE.Box3().setFromObject(mesh);
          const height = box.max.y;
          const p = mesh.position.clone();
          add(new THREE.Vector3(p.x, height + 2, p.z));
        }
      };

      canvas.addEventListener("mousedown", mousedownEvent);
      return () => {
        canvas.removeEventListener("mousedown", mousedownEvent);
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
