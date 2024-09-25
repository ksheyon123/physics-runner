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

export const getCirclePolarCoordinate = (
  numberOfPoints: number,
  PI: number
) => {
  let coords: number[] = [];
  const pn = PI < 0 ? -1 : 1;
  for (let i = 0; i <= numberOfPoints; i++) {
    const theta = (PI * i) / numberOfPoints;
    const x = pn * Math.cos(theta);
    const y = Math.sin(theta);
    coords = [...coords, x, y, 0];
  }
  return coords;
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
