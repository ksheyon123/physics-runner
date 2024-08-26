import React, { forwardRef, RefObject } from "react";
import styled from "styled-components";

interface CanvasProps {
  width: number;
  height: number;
}

export const ForwardedCanvas = forwardRef<HTMLDivElement, CanvasProps>(
  (props, ref) => {
    const { width, height } = props;
    return <StyledDrawer ref={ref} width={width} height={height} />;
  }
);

const StyledDrawer = styled.div<{ width?: number; height?: number }>`
  position: relative;
  width: ${(props) => `${props.width}px`};
  height: ${(props) => `${props.height}px`};
`;
