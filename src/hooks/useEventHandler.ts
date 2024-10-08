import { useEffect } from "react";
import * as THREE from "three";
import { useRaycaster } from "./useRaycaster";
import { colourMesh } from "@/utils/threejs.utils";
import { polarToCartesian } from "@/utils/math.utils";

export const useEventHandler = (
  canvas: HTMLDivElement | null,
  renderer: THREE.WebGLRenderer | null,
  camera: THREE.PerspectiveCamera | null,
  scene: THREE.Scene | null,
  isReady: boolean
) => {
  const { rayCrossing, calPointerCoord } = useRaycaster(
    window.innerWidth,
    window.innerHeight,
    80
  );

  useEffect(() => {
    if (!canvas || !isReady || !renderer || !camera || !scene) return;
    const defaultColor = 0xff0000;
    const hoverColor = 0x00ff00;
    const clickedColor = 0xffff00;
    let obj: any;
    let isClicked = false;
    let tmpCoord: any;
    let altAcitve = false;

    const keydownEvent = (e: KeyboardEvent) => {
      const code = e.code as "MetaLeft";
      if (code === "MetaLeft") {
        console.log("KEY DOWN :", code);
        altAcitve = true;
      }
    };

    const keyupEvent = (e: KeyboardEvent) => {
      const code = e.code as "MetaLeft";
      if (code === "MetaLeft") {
        console.log("KEY UP : ", code);
        altAcitve = false;
      }
    };

    const mousedownEvent = (e: MouseEvent) => {
      const coords = calPointerCoord(e);
      const intersections = rayCrossing(coords, camera, scene, "joint");
      if (!isClicked) {
        obj = colourMesh(intersections, clickedColor, "joint");
        isClicked = true;
        tmpCoord = coords;
      } else {
        colourMesh(intersections, defaultColor, "joint");
        isClicked = false;
      }
    };

    const moveEvent = (e: MouseEvent) => {
      const coords = calPointerCoord(e);
      const intersections = rayCrossing(coords, camera, scene, "joint");
      const hasIntersaction = intersections.length === 0;

      if (altAcitve && hasIntersaction && isClicked) {
        const [b] = scene.children.filter((e) => e.name === "cylinder");
        if (e.movementY > 0) {
          b.rotateZ(-0.004);
          const { x, y } = polarToCartesian(2.5, 0, -b.rotation.z);
          obj.object.position.set(x, y, 0);
        }

        if (e.movementY < 0) {
          b.rotateZ(0.004);
          const { x, y } = polarToCartesian(2.5, 0, -b.rotation.z);
          obj.object.position.set(x, y, 0);
        }
        return;
      }

      if (hasIntersaction && !isClicked) {
        if (obj?.object) {
          obj.object!.material.color.set(defaultColor);
        }
      }

      if (!isClicked) {
        obj = colourMesh(intersections, hoverColor, "joint");
      }
      renderer!.render(scene!, camera!);
    };

    window.addEventListener("keydown", keydownEvent);
    window.addEventListener("keyup", keyupEvent);
    canvas.addEventListener("mousemove", moveEvent);
    canvas.addEventListener("mousedown", mousedownEvent);
    return () => {
      window.removeEventListener("keydown", keydownEvent);
      window.removeEventListener("keyup", keyupEvent);
      canvas.removeEventListener("mousemove", moveEvent);
      canvas.removeEventListener("mousedown", mousedownEvent);
    };
  }, [isReady, canvas, renderer, camera, scene]);
};
