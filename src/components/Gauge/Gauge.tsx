import { ChangeEvent, RefObject, useEffect, useRef, useState } from "react";
import styled from "styled-components";

import styles from "./Gauge.module.css";
import { OptionBoxItem } from "@/constants";

interface IProps extends OptionBoxItem {
  onChangeValue: (key: string, event: ChangeEvent) => void;
}

export const Gauge = ({ id, min, max, initValue, onChangeValue }: IProps) => {
  const barRef = useRef<HTMLDivElement>(null);

  const [range, changeRange] = useState<[string | number, string | number]>([
    min || "0",
    max || "0",
  ]);
  const [value, setValue] = useState<number>();

  const [barPosition, setBarPosition] = useState<number>();

  const onChangeRange = (key: "start" | "end", v: string) => {
    changeRange((prv) => {
      if (key === "start") {
        return [v, prv[1]];
      } else {
        return [prv[0], v];
      }
    });
  };

  // cal 0 ~ 100 to range value
  const calRange = (p: number) => {
    if (
      Number(range[1]).toString() === "NaN" ||
      Number(range[0]).toString() === "NaN"
    )
      return 0;
    // Get total range size
    const t = Number(range[1]) - Number(range[0]);
    // get real v
    const c = t * p + Number(range[0]);
    return c;
  };

  // validate input value
  const validate = () => {};

  // Directly change input range value
  const onChangeInput = (key: string, e: any) => {
    const v = e.target.value;
    onChangeValue(key, e);
    setValue(v);
  };

  useEffect(() => {
    if (barPosition) {
      const p = barPosition / 100;
      const t = calRange(p);
      setValue(t);
    }
  }, [barPosition, range[0], range[1]]);

  useEffect(() => {
    if (barRef) {
      let isMoueseDown: boolean = false;
      const mousedown = (e: MouseEvent) => {
        isMoueseDown = true;

        setBarPosition(e.offsetX < 0 ? 0 : e.offsetX);
      };

      const mousemove = (e: MouseEvent) => {
        if (!isMoueseDown) return;
        setBarPosition(e.offsetX < 0 ? 0 : e.offsetX);
      };

      const mouseup = () => {
        isMoueseDown = false;
      };
      barRef.current?.addEventListener("mousedown", mousedown);
      barRef.current?.addEventListener("mousemove", mousemove);
      barRef.current?.addEventListener("mouseup", mouseup);
      barRef.current?.addEventListener("mouseout", mouseup);

      return () => {
        barRef.current?.removeEventListener("mousedown", mousedown);
        barRef.current?.removeEventListener("mousemove", mousedown);
        barRef.current?.removeEventListener("mouseup", mouseup);
        barRef.current?.removeEventListener("mouseout", mouseup);
      };
    }
  }, [barRef, setBarPosition]);

  return (
    <div key={id} className={styles["gauge-container"]}>
      <div className={styles["gauge-wrapper"]}>
        <div className={styles["gauge-range"]}>
          <input
            value={range[0]}
            onChange={(e) => onChangeRange("start", e.target.value)}
          />
        </div>
        <div className={styles["gauge-controller"]}>
          <div
            ref={barRef as RefObject<HTMLDivElement>}
            className={styles["gauge-background"]}
          >
            <StyledBar bar={barPosition || 0} />
          </div>
          <div className={styles["gauge-input"]}>
            <input
              value={value || initValue || 0}
              onChange={(e) => onChangeInput(id, e)}
            />
          </div>
        </div>
        <div className={styles["gauge-range"]}>
          <input
            value={range[1]}
            onChange={(e) => onChangeRange("end", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

const StyledBar = styled.div<{ bar: number }>`
  position: absolute;
  left: ${(props) => props.bar}px;
  width: 10px;
  height: 20px;
  background-color: #ddd;
  pointer-events: none;
`;
