import * as THREE from "three";

export const makeMesh = (
  width?: number,
  height?: number,
  depth?: number,
  color?: number
) => {
  const geometry = new THREE.BoxGeometry(width || 5, height || 5, depth || 5);
  const material = new THREE.MeshBasicMaterial({ color: color || 0x000000 });
  const cube = new THREE.Mesh(geometry, material);
  return cube;
};
