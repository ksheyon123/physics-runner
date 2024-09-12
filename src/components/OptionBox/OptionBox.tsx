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
        <div>
          {OPTION_BOX_ITEMS["free-fall"].map((props) => {
            const { key, label, unit, renderer } = props;
            return <>{!!renderer && renderer(props)}</>;
          })}
        </div>
      )}
    </div>
  );
};
