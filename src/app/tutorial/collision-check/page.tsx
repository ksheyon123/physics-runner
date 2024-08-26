"use client";

import { Controller } from "@/components/Controller/Controller";
import { useCamera } from "@/hooks/useCamera";
import { useMesh } from "@/hooks/useMesh";
import { useRenederer } from "@/hooks/useRenderer";
import { RefObject, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import styled from "styled-components";
import { ForwardedCanvas } from "@/components/Canvas/Canvas";

const Page = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const { createCamera } = useCamera();
  const { createRenderer, createScene } = useRenederer();
  const {
    createMesh,
    calForce,
    calAcceleration,
    calVelocity,
    calCoordinate,
    collisionCheck,
  } = useMesh();

  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    if (isMounted) {
      const camera = createCamera();
      const renderer = createRenderer(
        window.innerWidth,
        window.innerHeight - 200
      );

      const scene = sceneRef.current!;

      canvasRef.current && canvasRef.current.appendChild(renderer.domElement);

      const animate = () => {
        renderer.render(scene, camera);
      };

      const handleId = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(handleId);
    }
  }, [isMounted]);

  useEffect(() => {
    const scene = createScene();
    sceneRef.current = scene;
    setIsMounted(true);
  }, []);

  return (
    <>
      <ForwardedCanvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight - 200}
      />
      <Controller scene={sceneRef.current} />
    </>
  );
};

export default Page;
