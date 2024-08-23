import { RefObject, useEffect, useRef, useState } from "react";
import styled from "styled-components";

const Page = () => {
  const canvasRef = useRef<HTMLDivElement>();

  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {}, []);

  return (
    <StyledDrawer
      $width={window.innerWidth}
      $height={window.innerHeight - 80}
      ref={canvasRef as RefObject<HTMLDivElement>}
    />
  );
};

const StyledDrawer = styled.div<{ $width?: number; $height?: number }>`
  position: relative;
  width: ${(props) => `${props.$width}px` || "100%"};
  height: ${(props) => `${props.$height}px` || "100%"};
`;

export default Page;
