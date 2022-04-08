// Simple isObjectEqual function...could use lodash or underscore
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MaybeEqualObject = { [key: string]: any };
export default function isObjectEqual(
  a: MaybeEqualObject,
  b: MaybeEqualObject
) {
  if (a === b) return true;
  if (a == null || b == null) return false;

  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;

  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    if (typeof a[key] === "object" && typeof b[key] === "object") {
      if (
        !isObjectEqual(a[key] as MaybeEqualObject, b[key] as MaybeEqualObject)
      )
        return false;
    } else if (a[key] !== b[key]) {
      return false;
    }
  }

  return true;
}
