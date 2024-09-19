"use client";

import { RefObject, useEffect, useRef, useState } from "react";

import * as THREE from "three";

import { useCamera } from "@/hooks/useCamera";
import { useRenederer } from "@/hooks/useRenderer";
import { useMesh } from "@/hooks/useMesh";
import styled from "styled-components";
import { ForwardedCanvas } from "@/components/Canvas/Canvas";

const Page = () => {
  const { createCamera } = useCamera();
  const { createRenderer, createScene } = useRenederer();
  const {} = useMesh();

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
      camera.position.set(0, 0, 10);
      camera.lookAt(0, 0, 0);
      const renderer = createRenderer(
        window.innerWidth,
        window.innerHeight - 80
      );
      canvasRef.current && canvasRef.current.appendChild(renderer.domElement);

      let id: any;
      const animate = () => {
        id = requestAnimationFrame(animate);
      };

      animate();

      return () => {
        cancelAnimationFrame(id);
        renderer.render(scene, camera);
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
