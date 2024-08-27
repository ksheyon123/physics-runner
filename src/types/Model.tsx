import { makeMesh } from "@/utils/threejs.utils";
import * as THREE from "three";

type InitProps = {
  width?: number;
  height?: number;
  depth?: number;
  color?: number;
};

class Cube {
  mesh: THREE.Mesh;

  constructor(props: InitProps) {
    const { width, height, depth, color } = props;
    const cube = makeMesh(width, height, depth, color);
    this.mesh = cube;
  }

  update() {}

  move() {}

  getMesh() {
    return this.mesh;
  }
}

export default Cube;
