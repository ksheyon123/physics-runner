import styles from "./Controller.module.css";
import * as THREE from "three";
import {} from "@fortawesome/react-fontawesome";
import {} from "@fortawesome/free-solid-svg-icons";
import { RefObject, useEffect, useRef, useState } from "react";
interface IProps {
  scene: THREE.Scene | undefined;
}

export const Controller = ({ scene }: IProps) => {
  if (!scene) {
    return <div>Loading...</div>;
  }

  if (scene) {
    return (
      <div className={styles["controller-container"]}>
        <DirectionPanel scene={scene} />
      </div>
    );
  }
};

type SortOfKey = "ArrowUp" | "ArrowDown" | "ArrowRight" | "ArrowLeft";

const DirectionPanel = ({ scene }: IProps) => {
  const ref = useRef<HTMLDivElement>();
  const [key, setKey] = useState<{ [key in SortOfKey]: boolean }>({
    ArrowDown: false,
    ArrowUp: false,
    ArrowRight: false,
    ArrowLeft: false,
  });

  useEffect(() => {
    const keydownHandler = (e: KeyboardEvent) => {
      const code = e.code;
      setKey((prev) => ({ ...prev, [code]: true }));
    };

    const keyupHandler = (e: KeyboardEvent) => {
      const code = e.code;
      setKey((prev) => ({ ...prev, [code]: false }));
    };

    if (ref.current) {
      ref.current?.addEventListener("keydown", keydownHandler);
      ref.current?.addEventListener("keyup", keyupHandler);
      return () => {
        ref.current?.removeEventListener("keydown", keydownHandler);
        ref.current?.removeEventListener("keyup", keyupHandler);
      };
    }
  }, [ref, scene]);

  return <div ref={ref as RefObject<HTMLDivElement>}></div>;
};
