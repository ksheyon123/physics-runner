"use client";
import * as THREE from "three";

import { useEffect, useRef, useState } from "react";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { useCamera } from "@/hooks/useCamera";
import { useRenederer } from "@/hooks/useRenderer";
import { useMesh } from "@/hooks/useMesh";
import { ForwardedCanvas } from "@/components/Canvas/Canvas";
import { makeCylinder } from "@/utils/threejs.utils";

const Page = () => {
  const gap = 80;
  const canvasWidth = window.innerWidth;
  const canvasHeight = window.innerHeight - gap;
  const canvasRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const { createCamera } = useCamera(canvasRef.current, rendererRef.current, sceneRef.current);
  const { createRenderer, createScene } = useRenederer();
  const {} = useMesh();

  const [isMounted, setIsMounted] = useState<boolean>(false);

  const hz = 1 / 60; //seconds

  useEffect(() => {
    sceneRef.current = createScene();
    cameraRef.current = createCamera();
    cameraRef.current.position.set(0, 0, 10);
    const renderer = createRenderer(canvasWidth, canvasHeight);
    rendererRef.current = renderer
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      console.log("IS LOADED");
      const scene = sceneRef.current;
      const camera = cameraRef.current;
      const renderer = rendererRef.current;

      canvasRef.current && canvasRef.current.appendChild(renderer.domElement);
      const controls = new OrbitControls(camera, renderer.domElement);

      let id: any;

      // Create bones and attach them in a hierarchy
      const rootBone = new THREE.Bone();
      rootBone.position.y = -5;

      const midBone = new THREE.Bone();
      midBone.position.y = 0;
      rootBone.add(midBone);

      const endBone = new THREE.Bone();
      endBone.position.y = 5;
      midBone.add(endBone);

      // Create skeleton with bones
      const skeleton = new THREE.Skeleton([rootBone, midBone, endBone]);

      // Geometry and material for the skinned mesh
      const geometry = new THREE.CylinderGeometry(1, 1, 10);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
      const skinnedMesh = new THREE.SkinnedMesh(geometry, material);

      console.log(skinnedMesh.position)
      // Set up bone weights and indices
      const position = geometry.attributes.position;
      console.log(position)
      const vertex = new THREE.Vector3();

      const skinIndices = [];
      const skinWeights = [];

      // Vertices at the bottom (y < 0): We assign these vertices to rootBone (index 0) with full influence. skinIndices.push(0, 0, 0, 0); means only rootBone influences these vertices. skinWeights.push(1, 0, 0, 0); gives rootBone a weight of 1 (full influence).
      // Vertices in the middle (0 ≤ y < 5): We assign these vertices to midBone (index 1) with full influence, following the same pattern as above.
      // Vertices at the top (y ≥ 5): We assign these vertices to endBone (index 2), making endBone fully control them.
      for (let i = 0; i < position.count; i++) {
          vertex.fromBufferAttribute(position, i);
          // Determine which bone each vertex belongs to
          if (vertex.y < 0) {
              // 1. skinIndices[0]: This refers to the first influencing bone for the vertex.
              // 2. skinIndices[1]: This would be the second influencing bone (if any).
              // 3. skinIndices[2]: Third influencing bone.
              // 4. skinIndices[3]: Fourth influencing bone.
              skinIndices.push(0, 0, 0, 0);
              // 1. skinWeights[0]: The weight for the first influencing bone, which is 1 here, meaning rootBone has 100% influence.
              // 2. skinWeights[1]: The weight for the second bone (if there was one), which is 0, meaning it has no influence.
              // 3. skinWeights[2]: The weight for the third bone, also 0.
              // 4. skinWeights[3]: The weight for the fourth bone, also 0.
              skinWeights.push(1, 0, 0, 0);
          } else if (vertex.y < 5) {
              skinIndices.push(1, 1, 0, 0);
              skinWeights.push(1, 0, 0, 0);
          } else {
              skinIndices.push(2, 2, 0, 0);
              skinWeights.push(1, 0, 0, 0);
          }
      }
      console.log(vertex)

      // Assign skin attributes to the geometry
      geometry.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(skinIndices, 4));
      geometry.setAttribute('skinWeight', new THREE.Float32BufferAttribute(skinWeights, 4));

      // Add the root bone to the skinned mesh and bind skeleton
      skinnedMesh.add(rootBone);
      skinnedMesh.bind(skeleton);

      // Position and add to scene
      skinnedMesh.position.set(0, 0, 0);
      scene.add(skinnedMesh);

      const animate = () => {
        controls.update();
        // Simple rotation for visualization
        id = requestAnimationFrame(animate);

        // Animate bones
        rootBone.rotation.y += 0.01;
        midBone.rotation.z +=0.01
        renderer.render(scene, camera);
      };

      animate();

      return () => {
        cancelAnimationFrame(id);
      };
    }
  }, [isMounted]);

  return (
    <ForwardedCanvas
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
    />
  );
};

export default Page;
