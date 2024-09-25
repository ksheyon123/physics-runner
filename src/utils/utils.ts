export const combineTypedArray = (arr1: Float32Array, arr2: Float32Array) => {
  // Create a new Float32Array with enough space for both arrays
  const combinedArray = new Float32Array(arr1.length + arr2.length);

  // Set the values from both arrays
  combinedArray.set(arr1);
  combinedArray.set(arr2, arr1.length);
  return combinedArray;
};
