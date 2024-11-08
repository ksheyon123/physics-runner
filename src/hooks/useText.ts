import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { useEffect, useState } from "react";

export const useText = () => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [font, setFont] = useState<any>();
  const getFont = async () => {
    const loader = new FontLoader();
    const font = await loader.loadAsync(
      "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json"
    );
    setFont(font);
    setIsLoaded(true);
  };

  useEffect(() => {
    getFont();
  }, []);

  const createText = (text: string, size = 0.2) => {
    const textGeometry = new TextGeometry(text, {
      font: font,
      size,
      depth: 0.05,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 5,
    });

    const textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    return textMesh;
  };

  const updateText = (textMesh: THREE.Mesh, newText: string) => {
    const spec = {
      ...(textMesh.geometry as any).parameters.options,
    }
    // Remove the old geometry
    textMesh.geometry.dispose(); // Dispose of the old geometry to avoid memory leaks

    // Create a new geometry with the updated text
    const newGeometry = new TextGeometry(newText, {
      ...spec,
      font: font,
    });

    // Assign the new geometry to the textMesh
    textMesh.geometry = newGeometry;
  };

  return { isLoaded, createText, updateText };
};
