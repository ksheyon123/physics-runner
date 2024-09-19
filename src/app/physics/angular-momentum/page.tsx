"use client";

import { RefObject, useEffect, useRef, useState } from "react";

import * as THREE from "three";

import { useCamera } from "@/hooks/useCamera";
import { useRenederer } from "@/hooks/useRenderer";
import { useMesh } from "@/hooks/useMesh";
import styled from "styled-components";
import { ForwardedCanvas } from "@/components/Canvas/Canvas";
import { bindMesh, makeCylinder, makeMesh } from "@/utils/threejs.utils";

const Page = () => {
  const { createCamera } = useCamera();
  const { createRenderer, createScene } = useRenederer();
  // const { createMesh } = useMesh();

  const canvasRef = useRef<HTMLDivElement>(null);

  const [isMounted, setIsMounted] = useState<boolean>(false);

  const hz = 1 / 60; //seconds

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      console.log("IS LOADED");
      const scene = createScene();
      const camera = createCamera();
      camera.position.set(0, 5, 10);
      camera.lookAt(0, 0, 0);
      const renderer = createRenderer(
        window.innerWidth,
        window.innerHeight - 80
      );

      canvasRef.current && canvasRef.current.appendChild(renderer.domElement);

      const cube = makeMesh(1, 1, 1);
      cube.position.set(0, 0, 5.5);
      const cy = makeCylinder(5, 1, 32);
      const merged = bindMesh([cy, cube]);
      let id: any;
      let deg = 0;
      const animate = () => {
        scene.add(merged);
        merged.rotateY(deg / 360);
        deg = deg + 0.01;
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
      width={window.innerWidth}
      height={window.innerHeight - 80}
    />
  );
};

export default Page;
