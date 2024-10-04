import { useEffect } from "react";
import * as THREE from "three";
import { useRaycaster } from "./useRaycaster";
import { colourMesh } from "@/utils/threejs.utils";

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
    console.log("Event Attached");
    let obj: any;

    const mousedonwEvent = (e: MouseEvent) => {};

    const moveEvent = (e: MouseEvent) => {
      const coords = calPointerCoord(e);
      const intersections = rayCrossing(coords, camera, scene, "joint");
      if (intersections.length === 0) {
        if (obj?.object) {
          obj.object!.material.color.set(0xff0000);
        }
      }

      obj = colourMesh(intersections, 0x00ff00, "joint");
      renderer!.render(scene!, camera!);
    };

    canvas.addEventListener("mousemove", moveEvent);
    return () => {
      canvas.removeEventListener("mousemove", moveEvent);
    };
  }, [isReady, canvas, renderer, camera, scene]);
};
