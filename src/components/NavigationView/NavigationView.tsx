import Link from "next/link";
import {
  MESH_TEST_ITEMS,
  NAV_PHYSICS_ITEMS,
  NAV_TEST_ITEMS,
} from "@/constants/index";
import styles from "./NavigationView.module.css";
export const NavigationView = () => {
  return (
    <div className={styles["navigation-view-container"]}>
      <div className={styles["title"]}>Physics Case</div>
      <div className={styles["list-container"]}>
        <ul className={styles["list-box"]}>
          {NAV_PHYSICS_ITEMS.map(({ label, key, link }) => (
            <li className={styles["list-item"]} key={key}>
              <Link className={styles["link"]} href={`/${link}`}>
                <div className={styles["li-align"]}>{label}</div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles["title"]}>Threejs Case</div>
      <div className={styles["list-container"]}>
        <ul className={styles["list-box"]}>
          {NAV_TEST_ITEMS.map(({ label, key, link }) => (
            <li className={styles["list-item"]} key={key}>
              <Link className={styles["link"]} href={`/${link}`}>
                <div className={styles["li-align"]}>{label}</div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles["title"]}>Mesh Case</div>
      <div className={styles["list-container"]}>
        <ul className={styles["list-box"]}>
          {MESH_TEST_ITEMS.map(({ label, key, link }) => (
            <li className={styles["list-item"]} key={key}>
              <Link className={styles["link"]} href={`/${link}`}>
                <div className={styles["li-align"]}>{label}</div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
