```
    let coords = [0, 0, 0, 1, 0, 0];

    const numberOfPoints = 10;
    for (let i = 0; i <= numberOfPoints; i++) {
    const theta = (Math.PI * i) / numberOfPoints;
    const x = Math.cos(theta);
    const y = Math.sin(theta);
    coords = [...coords, x, y, 0];
    }
    const vertices = new Float32Array(coords);

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
    // 첫 번째 면 재질 및 메쉬 생성
    const curvedMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    wireframe: true,
    });
    const curvedMesh = new THREE.Mesh(curvedGeometry, curvedMaterial);
    scene.add(curvedMesh);
```
