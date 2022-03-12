/* eslint-disable */
// Simple isObjectEqual function...could use lodash or underscore
export default function isObjectEqual(a: object, b: object) {
  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;

  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    if (typeof a[key] === "object" && typeof b[key] === "object") {
      if (!isObjectEqual(a[key], b[key])) return false;
    } else if (a[key] !== b[key]) {
      return false;
    }
  }

  return true;
}
