export const polarToCartesian = (
  radius: number,
  theta: number = 0,
  phi: number = 0
) => {
  // 구 좌표를 데카르트 좌표로 변환
  let x = radius * Math.sin(phi) * Math.cos(theta);
  let y = radius * Math.cos(phi);
  let z = radius * Math.sin(phi) * Math.sin(theta);
  return { x, y, z };
};
export const cartesianToPolar = () => {};
