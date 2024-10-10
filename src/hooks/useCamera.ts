import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export const useCamera = () => {
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

  useEffect(() => {
    const camera = createCamera();
    cameraRef.current = camera;
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      let keys: { [key: string]: boolean } = {};
      const keyevent = (e: KeyboardEvent) => {
        const code = e.code;
        keys = {
          ...keys,
          [code]: !keys[code],
        };
      };

      const ev = () => {};

      window.addEventListener("keydown", keyevent);
      window.addEventListener("keyup", keyevent);
      window.addEventListener("mousemove", ev);
      return () => {
        window.removeEventListener("keydown", keyevent);
        window.removeEventListener("keyup", keyevent);
        window.removeEventListener("mousemove", ev);
      };
    }
  }, [isLoaded]);

  return {
    createCamera,
    isLoaded,
    camera: cameraRef.current,
  };
};
