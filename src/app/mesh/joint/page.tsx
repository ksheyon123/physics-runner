"use client";

import { RefObject, useEffect, useRef, useState } from "react";

import * as THREE from "three";

import { useCamera } from "@/hooks/useCamera";
import { useRenederer } from "@/hooks/useRenderer";
import { useMesh } from "@/hooks/useMesh";
import styled from "styled-components";
import { ForwardedCanvas } from "@/components/Canvas/Canvas";
import { makeCylinder, makeMesh, makeSphere } from "@/utils/threejs.utils";

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
      camera.position.set(0, -20, 10);
      camera.lookAt(0, 0, 0);
      const renderer = createRenderer(
        window.innerWidth,
        window.innerHeight - 80
      );
      canvasRef.current && canvasRef.current.appendChild(renderer.domElement);
      const plane = makeMesh(10, 10, 1, 0x000000);
      plane.rotateX(90);
      const sphere1 = makeSphere(0.8, 32);
      const sphere2 = makeSphere(0.8, 32);
      sphere2.position.set(0, -7.5, 0);
      const cylinder = makeCylinder(1, 5, 32);
      cylinder.position.set(0, -4.5, 0);
      scene.add(plane);
      scene.add(sphere1);
      scene.add(cylinder);
      scene.add(sphere2);

      let id: any;
      const animate = () => {
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
