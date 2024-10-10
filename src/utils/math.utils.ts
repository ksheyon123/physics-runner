/**
 *
 * @param radius 접하는 구의 반지름
 * @param theta 경도
 * @param phi 위도
 * @returns
 */
export const polarToCartesian = (
  radius: number,
  theta: number = 0,
  phi: number = 0
) => {
  // 구 좌표를 데카르트 좌표로 변환
  // XZ Plane에 Y 축
  let x = radius * Math.cos(phi) * Math.sin(theta);
  let y = radius * Math.sin(phi);
  let z = radius * Math.cos(phi) * Math.cos(theta);
  return { x, y, z };
};
export const cartesianToPolar = () => {};
