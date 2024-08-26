import styles from "./Controller.module.css";
import * as THREE from "three";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faArrowLeft,
  faArrowDown,
  faArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
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

    window.addEventListener("keydown", keydownHandler);
    window.addEventListener("keyup", keyupHandler);
    return () => {
      window.removeEventListener("keydown", keydownHandler);
      window.removeEventListener("keyup", keyupHandler);
    };
  }, [scene]);

  return (
    <div className={styles["arrow-keys"]}>
      <div
        className={`${styles["key"]} ${styles["up"]} ${
          key.ArrowUp ? styles["active"] : ""
        }`}
      >
        <FontAwesomeIcon size="2xl" icon={faArrowUp} />
      </div>
      <div
        className={`${styles["key"]} ${styles["left"]} ${
          key.ArrowLeft ? styles["active"] : ""
        }`}
      >
        <FontAwesomeIcon size="2xl" icon={faArrowLeft} />
      </div>
      <div
        className={`${styles["key"]} ${styles["down"]} ${
          key.ArrowDown ? styles["active"] : ""
        }`}
      >
        <FontAwesomeIcon size="2xl" icon={faArrowDown} />
      </div>
      <div
        className={`${styles["key"]} ${styles["right"]} ${
          key.ArrowRight ? styles["active"] : ""
        }`}
      >
        <FontAwesomeIcon size="2xl" icon={faArrowRight} />
      </div>
    </div>
  );
};
