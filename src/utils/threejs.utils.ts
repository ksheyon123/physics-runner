import { group } from "console";
import * as THREE from "three";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";
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

export const makeCylinder = (
  radius?: number,
  height?: number,
  seg?: number
) => {
  const geometry = new THREE.CylinderGeometry(
    radius || 5,
    radius || 5,
    height || 20,
    seg || 32
  );

  const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const cylinder = new THREE.Mesh(geometry, material);

  return cylinder;
};

export const makeSphere = (radius?: number, seg?: number) => {
  const geometry = new THREE.SphereGeometry(radius || 5, seg || 32, seg || 32);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const sphere = new THREE.Mesh(geometry, material);
  return sphere;
};

export const bindMesh = (meshes: THREE.Mesh[]) => {
  const group = new THREE.Group();

  for (let mesh of meshes) {
    group.add(mesh);
  }

  return group;
};

export const colourMesh = (
  intersects: "" | any[],
  color = 0x000000,
  filter?: string
) => {
  if (intersects === "") {
  } else {
    const l = intersects.filter((el) => el.object.name === filter);
    for (let item of l) {
      if (item?.object) {
        item.object!.material.color.set(color);
        return item;
      }
    }
  }
};
