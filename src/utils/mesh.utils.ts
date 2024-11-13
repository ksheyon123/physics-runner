import * as THREE from "three";

export const createBasicMaterial = (color: number) => {
  return new THREE.MeshBasicMaterial({
    color,
    wireframe: true,
    transparent: true,
    opacity: 0.5,
  });
};

// bone 시각화를 위한 함수
export const createBoneVisual = (color: number) => {
  const geometry = new THREE.SphereGeometry(0.5, 8, 8);
  const material = new THREE.MeshBasicMaterial({ color: color });
  return new THREE.Mesh(geometry, material);
};

export const thumb = () => {
  // Create geometries
  const cylinderGeometry0 = new THREE.CylinderGeometry(0.5, 0.5, 3, 32, 10);
  cylinderGeometry0.translate(0, -1.5, 0);
  const cylinderGeometry1 = new THREE.CylinderGeometry(0.5, 0.5, 3, 32, 10);
  cylinderGeometry1.translate(0, -4.5, 0);
  const sphereGeometry = new THREE.SphereGeometry(
    0.5,
    32,
    16,
    0,
    Math.PI * 2,
    Math.PI / 2,
    Math.PI
  );
  sphereGeometry.translate(0, -1.2, 0);
  sphereGeometry.scale(1, 5, 1);

  // Create materials
  const cylinderMaterial0 = createBasicMaterial(0x00ff00);
  const cylinderMaterial1 = createBasicMaterial(0x0000ff);
  const sphereMaterial = createBasicMaterial(0xff0000);
  const fingerRod1 = new THREE.Mesh(cylinderGeometry0, cylinderMaterial0);
  const fingerRod2 = new THREE.Mesh(cylinderGeometry1, cylinderMaterial1);
  const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);

  const group = new THREE.Group();
  group.add(fingerRod1);
  group.add(fingerRod2);
  group.add(sphereMesh);
  return group;
};
