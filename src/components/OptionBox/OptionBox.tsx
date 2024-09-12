import { OPTION_BOX_ITEMS } from "@/constants";
import styles from "./OptionBox.module.css";
import { useState } from "react";

interface IProps {
  onChangeValue?: () => void;
}

export const OptionBox = ({ onChangeValue }: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className={styles["option-box-container"]}>
      {!isOpen && <div onClick={() => setIsOpen(true)}>Menu</div>}
      {isOpen && (
        <ul className={styles["option-box-list"]}>
          {OPTION_BOX_ITEMS["free-fall"].map((props) => {
            const { id, label, unit, renderer } = props;
            return (
              <li key={id}>
                <div className={styles["item-label"]}>{label}</div>
                <div className={styles["item-divider"]}>:</div>
                {!!renderer && renderer(props)}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
