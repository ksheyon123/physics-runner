import { useState } from "react";

interface IProps {
  options: any[];
}

export const OptionBox = ({ options }: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return <div></div>;
};
