import * as THREE from "three";

const useRaycaster = () => {
  const rayCrossing = (event: any) => {
    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components

    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;
    const raycaster = new THREE.Raycaster();
  };
};
