"use client";

import { RefObject, useEffect, useRef, useState } from "react";

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { useCamera } from "@/hooks/useCamera";
import { useRenederer } from "@/hooks/useRenderer";
import { useMesh } from "@/hooks/useMesh";
import styled from "styled-components";
import { ForwardedCanvas } from "@/components/Canvas/Canvas";
import {
  bindMesh,
  makeMesh,
  makeSphere,
  colourMesh,
} from "@/utils/threejs.utils";
import { useRaycaster } from "@/hooks/useRaycaster";
import { useText } from "@/hooks/useText";

const Page = () => {
  const gap = 80;
  const canvasWidth = window.innerWidth;
  const canvasHeight = window.innerHeight - gap;
  const canvasRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const { createCamera } = useCamera(canvasRef.current, rendererRef.current, sceneRef.current);
  const { createRenderer, createScene } = useRenederer();
  const {} = useMesh();
  const { isLoaded, createText } = useText();
  const { rayCrossing, calPointerCoord } = useRaycaster(
    canvasWidth,
    canvasHeight,
    gap
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
    if (isMounted && isLoaded) {
      console.log("IS LOADED");
      const camera = cameraRef.current;
      const renderer = rendererRef.current;
      const scene = sceneRef.current;
      //   camera.lookAt(0, 0, 0);
      canvasRef.current && canvasRef.current.appendChild(renderer.domElement);
      const controls = new OrbitControls(camera, renderer.domElement);

      const dot = makeMesh(0.1, 0.1, 0.1, 0x000000);
      scene.add(dot);

      const plane = makeMesh(10, 10, 1, 0x000000);
      plane.position.set(0, -5, 0);
      plane.rotateX(3.14 / 2);
      scene.add(plane);

      const bar = makeMesh(0.1, 10, 0.1, 0x00ff00);
      const sphere1 = makeSphere(0.2, 32);
      sphere1.name = "ball";
      sphere1.position.set(0, 5, 0);
      const sphere2 = makeSphere(0.2, 32);
      sphere2.name = "ball";
      const merged = bindMesh([bar, sphere1, sphere2]);

      scene.add(merged);
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
  }, [isMounted, isLoaded]);

  useEffect(() => {
    let obj: any;
    let isShowing = false;
    const text = createText("Center of the Mass");
    text.position.set(1, 0, 0);
    const mousemove = (e: any) => {
      const { x, y } = calPointerCoord(e);
      const intersects = rayCrossing(
        { x, y },
        cameraRef.current,
        sceneRef.current
        // "ball"
      );
      if (intersects.length === 0) {
        if (obj?.object) {
          obj.object!.material.color.set(0xff00000);
        }
        if (!isShowing) {
          text.removeFromParent();
          isShowing = false;
        }
      }

      obj = colourMesh(intersects, 0, "ball");
      if (isShowing) {
        sceneRef.current.add(text);
        isShowing = true;
      }

      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };
    if (isMounted && isLoaded) {
      canvasRef.current!.addEventListener("mousemove", mousemove);
      return () => {
        canvasRef.current!.removeEventListener("mousemove", mousemove);
      };
    }
  }, [isMounted, isLoaded]);

  return (
    <ForwardedCanvas
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
    />
  );
};

export default Page;
