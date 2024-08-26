"use client";

import { useCamera } from "@/hooks/useCamera";
import { useRenederer } from "@/hooks/useRenderer";
import { RefObject, useEffect, useRef, useState } from "react";

import styled from "styled-components";

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const Page = () => {
  const { createCamera } = useCamera();
  const { createRenderer, createScene } = useRenederer();

  const canvasRef = useRef<HTMLDivElement>();
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const scene = createScene();
      const camera = createCamera();

      const renderer = createRenderer(
        window.innerWidth,
        window.innerHeight - 80
      );

      canvasRef.current && canvasRef.current.appendChild(renderer.domElement);
      const controls = new OrbitControls(camera, renderer.domElement);
      camera.position.set(0, 0, 10);
      controls.update();

      var A = new THREE.Mesh(
          new THREE.SphereGeometry(0.1),
          new THREE.MeshBasicMaterial({ color: "black" })
        ),
        B = A.clone(),
        C = A.clone();
      scene.add(A, B, C);

      // a Bezier curve based on three points
      var curve = new THREE.QuadraticBezierCurve3(
        A.position,
        B.position,
        C.position
      );

      // a plane that adopts the silhouette of the curve
      var plane = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 1, 20, 1),
        new THREE.MeshBasicMaterial({ color: "tomato" })
      );
      scene.add(plane);

      // vertices of the plane
      var pos = plane.geometry.getAttribute("position"),
        n = pos.count / 2,
        pnt = new THREE.Vector3(),
        tan = new THREE.Vector3();

      const animate = (t: number) => {
        // requestAnimationFrame(animate);
        controls.update();

        // move the three points up and down
        A.position.set(-2, 0, 0);
        B.position.set(0, Math.cos(t / 800), 0);
        C.position.set(2, 0, 0);

        // update the plane
        for (var i = 0; i < n; i++) {
          curve.getPoint(i / (n - 1), pnt);
          curve.getTangent(i / (n - 1), tan);

          pos.setXY(i, pnt.x - tan.y, pnt.y + tan.x);
          pos.setXY(i + n, pnt.x + tan.y, pnt.y - tan.x);
        }
        pos.needsUpdate = true;

        renderer.render(scene, camera);
      };
      // animate();
      renderer.setAnimationLoop(animate);
    }
  }, [isMounted]);

  return (
    <StyledDrawer
      $width={window.innerWidth || 0}
      $height={window.innerHeight - 80 || 0}
      ref={canvasRef as RefObject<HTMLDivElement>}
    />
  );
};

const StyledDrawer = styled.div<{ $width?: number; $height?: number }>`
  position: relative;
  width: ${(props) => `${props.$width}px` || "100%"};
  height: ${(props) => `${props.$height}px` || "100%"};
`;

export default Page;
