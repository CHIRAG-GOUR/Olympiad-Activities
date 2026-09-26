/**
 * Undoes the encoding Firestore forces on nested arrays.
 *
 * Firestore cannot store an array directly inside another array, so anything written
 * there has to wrap each inner array in a single-key map. The seeder uses `items`:
 *
 *   [[52.5, 33.6], [38.9, 58.9]]   ->   [{ items: [52.5, 33.6] }, { items: [38.9, 58.9] }]
 *
 * Read back unchanged, a question's `customConfig` then hands activities objects where
 * they expect coordinate pairs, and `map(([x, y]) => …)` throws "param is not iterable"
 * — which takes the whole exam page down rather than one question.
 *
 * The unwrapping is deliberately only applied to elements *of an array*, because that is
 * the only position where the encoder ever introduces the wrapper. A configuration field
 * that legitimately holds `{ items: [...] }` somewhere else is left alone.
 */

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/** An element that is only there to carry an array Firestore would not otherwise take. */
function unwrapped(element: unknown): unknown {
  if (!isPlainObject(element)) return element;
  const keys = Object.keys(element);
  if (keys.length === 1 && keys[0] === "items" && Array.isArray(element.items)) {
    return element.items;
  }
  return element;
}

export function reviveNestedArrays<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((element) => reviveNestedArrays(unwrapped(element))) as unknown as T;
  }
  if (isPlainObject(value)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = reviveNestedArrays(v);
    return out as unknown as T;
  }
  return value;
}
