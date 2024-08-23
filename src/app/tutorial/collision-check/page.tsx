"use client";

import { Controller } from "@/components/Controller/Controller";
import { useCamera } from "@/hooks/useCamera";
import { useMesh } from "@/hooks/useMesh";
import { useRenederer } from "@/hooks/useRenderer";
import { RefObject, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import styled from "styled-components";

const Page = () => {
  const canvasRef = useRef<HTMLDivElement>();
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
    const scene = createScene();
    sceneRef.current = scene;
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const camera = createCamera();
      const renderer = createRenderer(
        window.innerWidth,
        window.innerHeight - 200
      );

      canvasRef.current && canvasRef.current.appendChild(renderer.domElement);
    }
  }, [isMounted]);

  return (
    <>
      <StyledDrawer
        $width={window.innerWidth}
        $height={window.innerHeight - 200}
        ref={canvasRef as RefObject<HTMLDivElement>}
      />
      <Controller scene={sceneRef.current} />
    </>
  );
};

const StyledDrawer = styled.div<{ $width?: number; $height?: number }>`
  position: relative;
  width: ${(props) => `${props.$width}px` || "100%"};
  height: ${(props) => `${props.$height}px` || "100%"};
`;

export default Page;
