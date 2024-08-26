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
    console.log(sceneRef);
    if (sceneRef.current) {
      console.log("Animation");
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
  }, [sceneRef]);

  useEffect(() => {
    const scene = createScene();
    sceneRef.current = scene;
    // setIsMounted(true);
    console.log("Run is Mounted");
  }, []);

  return (
    <>
      <StyledDrawer
        $width={window.innerWidth || 0}
        $height={window.innerHeight - 200 || 0}
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
