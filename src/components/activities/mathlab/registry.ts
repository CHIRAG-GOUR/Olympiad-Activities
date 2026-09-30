import type { ActivityComponentType } from "../kit/types";
import { MathLabActivity } from "./MathLab";

/** Every question of a printed maths paper runs on the maths lab, configured by its customConfig.lab. */
export function mathLabMap(prefixId: string, prefixCode: string, count = 50): Record<string, ActivityComponentType> {
  const m: Record<string, ActivityComponentType> = {};
  for (let n = 1; n <= count; n++) {
    const nn = String(n).padStart(2, "0");
    m[`${prefixId}${nn}`] = MathLabActivity;
    m[`${prefixCode}${nn}`] = MathLabActivity;
  }
  return m;
}
