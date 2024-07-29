"use client";

import { RefObject, useEffect, useRef, useState } from "react";

import * as THREE from "three";

import { useCamera } from "@/hooks/useCamera";
import { useRenederer } from "@/hooks/useRenderer";

const Page = () => {
  const { createCamera } = useCamera();
  const { createRenderer, createScene } = useRenederer();

  const canvasRef = useRef<HTMLDivElement>();

  const [isMounted, setIsMounted] = useState<boolean>(false);

  const hz = 1 / 60; //seconds

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const scene = createScene();
      const camera = createCamera();
      const renderer = createRenderer();
      canvasRef.current && canvasRef.current.appendChild(renderer.domElement);

      let id: any;
      const animate = () => {
        id = requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };
      return () => cancelAnimationFrame(id);
    }
  }, []);

  return <div ref={canvasRef as RefObject<HTMLDivElement>} />;
};

export default Page;
