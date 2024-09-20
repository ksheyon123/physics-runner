import * as THREE from "three";

export const useRaycaster = (width: number, height: number, gap: number) => {
  const calPointerCoord = (event: any) => {
    const x = (event.clientX / width) * 2 - 1;
    const y = -((event.clientY - gap) / height) * 2 + 1;
    return {
      x,
      y,
    };
  };

  const rayCrossing = (
    coord: any,
    camera: THREE.PerspectiveCamera,
    scene: THREE.Scene,
    filter?: string
  ) => {
    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components
    const pointer = new THREE.Vector2(coord.x, coord.y);
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(pointer, camera);
    let objs = scene.children;
    console.log(objs);
    if (filter) {
      objs = scene.children.filter((el) => el.name === filter);
    }

    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(objs);
    return intersects;
  };

  return {
    calPointerCoord,
    rayCrossing,
  };
};
