import { useRef } from "react";
import * as THREE from "three";

export const useCamera = () => {
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

  return {
    createCamera,
  };
};
