"use client";

import { Controller } from "@/components/Controller/Controller";
import { useCamera } from "@/hooks/useCamera";
import { useMesh } from "@/hooks/useMesh";
import { useRenederer } from "@/hooks/useRenderer";
import { createElement, RefObject, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import styled from "styled-components";
import { ForwardedCanvas } from "@/components/Canvas/Canvas";
import Cube from "@/types/Model";
import { div } from "three/webgpu";
import { Gauge } from "@/components/Gauge/Gauge";
import { OptionBox } from "@/components/OptionBox/OptionBox";
import { useText } from "@/hooks/useText";
import { makeMesh, makePlane } from "@/utils/threejs.utils";

const Page = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const { isLoaded, createText, updateText } = useText();
  const { createCamera } = useCamera(canvasRef.current, rendererRef.current, sceneRef.current);
  const { createRenderer, createScene } = useRenederer();
  const {
    createMesh,
    calForce,
    calAcceleration,
    calVelocity,
    calCoordinate,
    collisionCheck,
  } = useMesh(1 / 30);

  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    if (isMounted && isLoaded) {
      const scene = sceneRef.current;
      const camera = cameraRef.current;
      const renderer = rendererRef.current;

      canvasRef.current && canvasRef.current.appendChild(renderer.domElement);

      const mesh = makeMesh(0.5, 0.5, 0.5, 0x000000, false);
      mesh.position.set(0, 0, 0);
      scene.add(mesh);

      const prevVel = new THREE.Vector3();

      // const textMesh = createText(prevVel.y.toString());
      // textMesh.position.set(2, 0, 0);

      // scene.add(textMesh);

      let handleId: any;
      let readyToSet = true;
      let idx = 0;
      let backBoardIds : THREE.Mesh[] = [];
      const animate = () => {
        const prevPosition = mesh.position.clone();
        const curIdx = Math.floor(Math.abs(prevPosition.clone().y) % 10);
        if(curIdx === 0 && readyToSet) {
          if(backBoardIds.length > 3) {
            const b = backBoardIds.shift();
            b?.removeFromParent();
          }
          const backBoard = makePlane(5, 20, 0x00ffff, false);
          const {x, y, z} = new THREE.Vector3(0, -(idx * 20) - 10, -2)
          backBoard.position.set(x, y, z)
          backBoard.name = "back_board"
          scene.add(backBoard)

          const heightText = createText((-idx * 20).toString());
          heightText.position.set(2, -idx * 20, 0);
          scene.add(heightText)

          backBoardIds.push(backBoard)

          readyToSet = false;
          idx += 1;
        } else if (curIdx !== 0 && !readyToSet) {
          readyToSet = true;

        }
        const force = calForce(new THREE.Vector3());
        const acc = calAcceleration(force);
        const newVel = calVelocity(prevVel, acc);
        const newP = calCoordinate(prevPosition, prevVel, newVel);

        mesh.position.set(newP.x, newP.y, newP.z);
        prevVel.set(newVel.x, newVel.y, newVel.z);
        
        // Update text for Velocity
        // updateText(textMesh, newVel.y.toString());
        // textMesh.position.set(2, newP.y, newP.z);

        camera.position.set(0, newP.y, 10);
        camera.lookAt(newP.x, newP.y, newP.z);
        // divEl.innerHTML = "Vel y : " + newVel.y;
        handleId = requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };

      animate();
      return () => cancelAnimationFrame(handleId);
    }
  }, [isMounted, isLoaded]);

  useEffect(() => {
    const scene = createScene();
    const camera = createCamera();
    const renderer = createRenderer(
      window.innerWidth,
      window.innerHeight - 80
    );
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    setIsMounted(true);
  }, []);

  return (
    <>
      <ForwardedCanvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight - 80}
      >
        <OptionBox />
      </ForwardedCanvas>
    </>
  );
};

export default Page;
