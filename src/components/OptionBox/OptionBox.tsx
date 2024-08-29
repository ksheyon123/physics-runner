import { OPTION_BOX_ITEMS } from "@/constants";
import { useState } from "react";

interface IProps {
  onChangeValue: () => void;
}

export const OptionBox = ({ onChangeValue }: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div>
      <div onClick={() => setIsOpen(true)}>Menu</div>
      {OPTION_BOX_ITEMS["free-fall"].map(({ key, label, unit }) => (
        <div>
          <input />
        </div>
      ))}
    </div>
  );
};
