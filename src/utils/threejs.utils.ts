import * as THREE from "three";
import { combineTypedArray } from "./utils";

export const makeCone = () => {
  const geometry = new THREE.ConeGeometry(0.2, 1, 32);
  const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const cone = new THREE.Mesh(geometry, material);
  return cone;
};

export const makePlane = (w: number, h: number, color?: number) => {
  const geometry = new THREE.PlaneGeometry(w, h);
  const material = new THREE.MeshBasicMaterial({
    color: color || 0xffff00,
    wireframe: true,
  });
  const plane = new THREE.Mesh(geometry, material);
  return plane;
};

export const makeMesh = (
  width?: number,
  height?: number,
  depth?: number,
  color?: number
) => {
  const geometry = new THREE.BoxGeometry(width || 5, height || 5, depth || 5);
  const material = new THREE.MeshBasicMaterial({
    color: color || 0x000000,
    wireframe: true,
  });
  const cube = new THREE.Mesh(geometry, material);
  return cube;
};

export const makeCylinder = (
  radius?: number,
  height?: number,
  seg?: number,
  color?: number
) => {
  const geometry = new THREE.CylinderGeometry(
    radius || 5,
    radius || 5,
    height || 20,
    seg || 32
  );

  const material = new THREE.MeshBasicMaterial({ color: color || 0xffff00 });
  const cylinder = new THREE.Mesh(geometry, material);

  return cylinder;
};

export const makeSphere = (
  radius?: number,
  seg?: number,
  phiStart?: number,
  phiLength?: number,
  thetaStart?: number,
  thetaLength?: number
) => {
  const geometry = new THREE.SphereGeometry(
    radius || 5,
    seg || 32,
    seg || 32,
    phiStart || 0,
    phiLength || 2 * Math.PI,
    thetaStart || 0,
    thetaLength || Math.PI
  );
  const material = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    wireframe: true,
  });
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
  color = 0x00ff00,
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

// Float32Array로 사각형 만들기
export const box = () => {
  // 연속하는 두 사각형의 꼭짓점 좌표 정의
  // prettier-ignore
  const vertices = new Float32Array([
        // 첫 번째 사각형 (왼쪽)
        -2.0, -1.0, 0.0, // 왼쪽 아래
        0.0, -1.0, 0.0, // 오른쪽 아래
        0.0, 1.0, 0.0, // 오른쪽 위
        -2.0,  1.0, 0.0, // 왼쪽 위

        // 두 번째 사각형 (오른쪽)
        0.0, -1.0, 0.0, // 왼쪽 아래
        2.0, -1.0, 0.0, // 오른쪽 아래
        2.0, 1.0, 0.0, // 오른쪽 위
        0.0, 1.0, 0.0, // 왼쪽 위
      ]);

  // 인덱스를 사용해 삼각형 4개로 2개의 사각형 구성 (각각 2개의 삼각형)
  const indices = new Uint16Array([
    // 첫 번째 사각형
    0, 1, 2, 0, 2, 3,

    // 두 번째 사각형
    4, 5, 6, 4, 6, 7,
  ]);

  // BufferGeometry 생성 및 설정
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3)); // xyz로 3개씩
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));

  // 간단한 기본 재질 생성
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    side: THREE.DoubleSide,
  });

  // 사각형 메쉬 생성
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
};

export const quadratic = () => {
  // 사각형 모양 정의
  const shape = new THREE.Shape();

  // 사각형의 왼쪽 아래 점에서 시작 (x, y)
  shape.moveTo(-2, -1);

  // 오른쪽 아래 점으로 이동
  shape.lineTo(2, -1);

  // 오른쪽 위로 이동
  shape.lineTo(2, 1);

  // 왼쪽 위로 곡선 그리기 (곡선을 정의하기 위해 `quadraticCurveTo` 사용)
  shape.quadraticCurveTo(0, 2, -2, 1); // Control point (0, 2)로 곡선 그리기

  // `ShapeGeometry`로 변환
  const geometry = new THREE.ShapeGeometry(shape);

  // 기본 재질 생성
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    side: THREE.DoubleSide,
  });

  // 메쉬 생성 및 장면에 추가
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
};

export const carvedBox = (first: number[], second: number[]) => {
  // Single Plane
  const typedArray0 = new Float32Array(first);
  const numberOfIndex = typedArray0.length / 3; // 5개의 좌표
  const typedArray1 = new Float32Array(second);
  const bindedTypeArray = combineTypedArray(typedArray0, typedArray1);
  const numberOfIndex1 = bindedTypeArray.length / 3;

  let bindings: number[] = [];
  bindings = setIndexFromSingleVertex(bindings, 0, numberOfIndex);
  bindings = setIndexFromSingleVertex(bindings, numberOfIndex, numberOfIndex1);
  for (let i = 0; i < numberOfIndex; i++) {
    bindings = setIndexBetweenPlane(bindings, i, numberOfIndex);
  }

  const indices = new Uint16Array(bindings);

  const curvedGeometry = new THREE.BufferGeometry();
  curvedGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(bindedTypeArray, 3)
  );
  curvedGeometry.setIndex(new THREE.BufferAttribute(indices, 1));
  //   // 첫 번째 면 재질 및 메쉬 생성
  const curvedMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    wireframe: true,
  });
  const curvedMesh = new THREE.Mesh(curvedGeometry, curvedMaterial);
  return curvedMesh;
};

/**
 * @description 선분을 N 등분하면 N+1 점이 생성된다
 * @param numberOfPoints 극좌표 / numberOfPoints (몇 분할)
 * @param PI 구할 구간
 * @param z z 좌표
 * @param start Polar coordinate 시작점
 * @returns
 */
export const getCirclePolarCoordinate = (
  numberOfPoints: number,
  pi: number,
  z: number = 0,
  start: number = 0
) => {
  let coords: number[] = [];
  for (let i = 0; i <= numberOfPoints; i++) {
    const theta = (pi / numberOfPoints) * i + start;
    const x = Math.cos(theta);
    const y = Math.sin(theta);
    coords = [...coords, x, y, z];
  }
  return coords;
};

/**
 *
 * @param bindings triangle index list
 * @param start start point
 * @param total end idx
 * @returns
 */
export const setIndexFromSingleVertex = (
  bindings: number[],
  start: number,
  total: number
) => {
  for (let i = start + 1; i < total - 1; i++) {
    bindings = [...bindings, start, i, i + 1];
  }
  return bindings;
};

// 어렵네
export const setIndexBetweenPlane = (
  bindings: number[],
  startIdx: number,
  gap: number
) => {
  const adjacent = startIdx + 1;
  bindings = [
    ...bindings,
    // First Triangle
    startIdx,
    adjacent % gap,
    (adjacent % gap) + gap,
    // Second Triangle
    startIdx,
    (adjacent % gap) + gap,
    startIdx + gap,
  ];
  return bindings;
};

export const halfCircle = () => {
  const coords = getCirclePolarCoordinate(10, Math.PI);
  console.log(coords);
  const vertices = new Float32Array([0, 0, 0, ...coords]);

  const numberOfTriangle = vertices.length / 3;

  let bindings: number[] = [];
  for (let i = 1; i < numberOfTriangle - 1; i++) {
    bindings = [...bindings, 0, i, i + 1];
  }

  // 인덱스를 사용해 삼각형을 연속시킴
  const indices = new Uint16Array(bindings);

  // BufferGeometry 생성 및 설정
  const curvedGeometry = new THREE.BufferGeometry();
  curvedGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(vertices, 3)
  );
  curvedGeometry.setIndex(new THREE.BufferAttribute(indices, 1));
  //   // 첫 번째 면 재질 및 메쉬 생성
  const curvedMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    wireframe: true,
  });
  const curvedMesh = new THREE.Mesh(curvedGeometry, curvedMaterial);
  return curvedMesh;
};

export const getHemiSpherePoint = (
  radius: number,
  theta: number,
  phi: number
) => {
  // 구 좌표를 데카르트 좌표로 변환
  let x = radius * Math.sin(phi) * Math.cos(theta);
  let y = radius * Math.cos(phi);
  let z = radius * Math.sin(phi) * Math.sin(theta);

  return { x, y, z };
};

export const calPointerCoord = (
  event: any,
  width: number,
  height: number,
  gap: number
) => {
  const x = (event.clientX / width) * 2 - 1;
  const y = -((event.clientY - gap) / height) * 2 + 1;
  return {
    x,
    y,
  };
};

export const rayCrossing = (
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
  if (filter) {
    objs = scene.children.filter((el) => el.name === filter);
  }

  // calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(objs);
  return intersects;
};

export const getQuaternion = () => {};
