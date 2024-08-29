import { ChangeEvent, RefObject, useEffect, useRef, useState } from "react";
import styled from "styled-components";

import styles from "./Gauge.module.css";

interface IProps {
  value: number;
  onChangeValue: (event: ChangeEvent) => void;
}

export const Gauge = ({ value, onChangeValue }: IProps) => {
  const barRef = useRef<HTMLDivElement>(null);

  const [range, changeRange] = useState<[number, number]>([0, 0]);

  const [barPosition, setBarPosition] = useState<number>();

  const onChangeRange = (key: "start" | "end", v: number) => {
    changeRange((prv) => {
      if (key === "start") {
        return [v, prv[1]];
      } else {
        return [prv[0], v];
      }
    });
  };

  useEffect(() => {
    let isMouseDown: boolean = false;
    const mousedown = (e: MouseEvent) => {
      setBarPosition(e.offsetX);
      isMouseDown = true;
    };
    const mousemove = () => {
      if (!isMouseDown) return;
    };

    const mouseup = () => {
      isMouseDown = false;
    };

    if (barRef) {
      barRef.current?.addEventListener("mousedown", mousedown);
      barRef.current?.addEventListener("mousemove", mousemove);
      barRef.current?.addEventListener("mouseup", mouseup);
      return () => {
        barRef.current?.removeEventListener("mousedown", mousedown);
        barRef.current?.removeEventListener("mousemove", mousedown);
        barRef.current?.removeEventListener("mouseup", mouseup);
      };
    }
  }, [barRef]);

  return (
    <div>
      <div className={styles["gauge-wrapper"]}>
        <div className={styles["gauge-input"]}>
          <input
            value={range[0]}
            onChange={(e) =>
              onChangeRange("start", Number(e.target.value || 0))
            }
          />
        </div>
        <div className={styles["gauge-controller"]}>
          <StyledGauge
            ref={barRef as RefObject<HTMLDivElement>}
            barP={barPosition || 0}
          >
            <div className="background"></div>
            <div className="bar"></div>
          </StyledGauge>
          <div className={styles["gauge-input"]}>
            <input value={value} onChange={onChangeValue} />
          </div>
        </div>
        <div className={styles["gauge-input"]}>
          <input
            value={range[1]}
            onChange={(e) => onChangeRange("end", Number(e.target.value || 0))}
          />
        </div>
      </div>
    </div>
  );
};

const StyledGauge = styled.div<{ barP: number }>`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100px;
  height: 30px;
  justify-contents: center;
  align-items: center;
  margin: 0px 5px;

  div.background {
    width: 100%;
    height: 8px;
    background-color: #ccc;
  }

  div.bar {
    position: absolute;
    left: ${(props) => props.barP}px;
    width: 10px;
    height: 30px;
    background-color: #ddd;
  }
`;
