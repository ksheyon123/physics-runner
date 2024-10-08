import { getCirclePolarCoordinate, makeCone } from "@/utils/threejs.utils";
import { useRef } from "react";
import * as THREE from "three";
import { useRaycaster } from "./useRaycaster";

export const usePin = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const pinMeshesRef = useRef<THREE.Mesh>();

  const add = (coord: THREE.Vector3) => {
    // Clean up previous cone
    remove();
    const cone = makeCone();
    cone.position.set(coord.x, coord.y, coord.z);
    cone.rotateZ(Math.PI);
    pinMeshesRef.current = cone;
    scene.add(cone);
  };

  const remove = () => {
    if (pinMeshesRef.current) {
      pinMeshesRef.current!.removeFromParent();
    }
  };

  return {
    pin: pinMeshesRef.current,
    add,
    remove,
  };
};
