export function deepClone(value: any): any {
  if (typeof value !== 'object' || value === null) return value;
  if (Array.isArray(value)) {
    return value.map(deepClone)
  } else {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, deepClone(v)]))
  }
}
