import { polarToCartesian } from "@/utils/math.utils";
import {
  calPointerCoord,
  getCirclePolarCoordinate,
} from "@/utils/threejs.utils";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export const useCamera = (
  canvas: HTMLDivElement | null,
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene
) => {
  const cameraRef = useRef<THREE.PerspectiveCamera>();

  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  /**
   * @description Perspective Camera 객체를 생성합니다.
   * @returns Perspective Camera Object
   */
  const createCamera = (width?: number, height?: number) => {
    const camera = new THREE.PerspectiveCamera(
      75, // 카메라 시야각
      (width || window.innerWidth) / (height || window.innerHeight), // 카메라 비율
      0.1, // Near
      1000 // Far
    );
    return camera;
  };

  const updateLookAt = (mesh: THREE.Mesh) => {
    if (cameraRef.current) {
      const camera = cameraRef.current;
      const position = mesh.position.clone();
      camera.lookAt(position);
    }
  };

  useEffect(() => {
    if (canvas) {
      const camera = createCamera();
      cameraRef.current = camera;
      camera.position.set(0, 0, 10);
      setIsLoaded(true);
    }
  }, [canvas]);

  useEffect(() => {
    if (canvas && isLoaded) {
      const camera = cameraRef.current;

      let keys: { [key: string]: boolean } = {};

      // 이전 마우스 위치를 저장할 변수
      let prevMouseX = 0;
      let prevMouseY = 0;

      // 이전 마우스 위치와 현재 마우스 위치의 변위
      let delX = null;
      let delY = null;

      let distanceTo = 10;
      let phi = 0;
      let theta = 0;

      const keyevent = (e: KeyboardEvent) => {
        const code = e.code;
        keys = {
          ...keys,
          [code]: !keys[code],
        };
      };

      const ev = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        delX = prevMouseX - x;
        delY = prevMouseY - y;

        if (keys.MetaLeft) {
          // console.log("RUN", delY);

          phi += delY / 200;
          theta += delX / 200;

          const {
            x: cx,
            y: cy,
            z: cz,
          } = polarToCartesian(distanceTo, theta, phi);

          console.log(camera!.rotation.z);
          if (camera!.rotation.z <= -3.1) {
            console.log("Prevent Flip");
            camera?.up.set(0, -1, 0);
          }

          camera!.position.set(cx, cy, cz);
          renderer.render(scene, camera!);
        }

        prevMouseX = x;
        prevMouseY = y;
      };

      const zoom = (e: WheelEvent) => {
        const delta = e.deltaY;
        if (keys.MetaLeft) {
          console.log(delta);
        }
      };

      window.addEventListener("keydown", keyevent);
      window.addEventListener("keyup", keyevent);
      canvas.addEventListener("mousemove", ev);
      canvas.addEventListener("wheel", zoom);
      return () => {
        window.removeEventListener("keydown", keyevent);
        window.removeEventListener("keyup", keyevent);
        canvas.removeEventListener("mousemove", ev);
        canvas.removeEventListener("wheel", zoom);
      };
    }
  }, [isLoaded]);

  return {
    createCamera,
    updateLookAt,
    isLoaded,
    camera: cameraRef.current,
  };
};
