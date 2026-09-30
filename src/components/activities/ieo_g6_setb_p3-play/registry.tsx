import type { ActivityComponentType } from "../kit/types";
import { makeLab } from "./lab";
import { SPECS } from "./specs";

/** IEO Class 6 Set B, Paper 3 — one lab activity per question, by id and by code. */
export const IEO_G6_SETB_P3_PLAY_ACTIVITY_MAP: Record<string, ActivityComponentType> = {};
for (let n = 1; n <= 50; n++) {
  const nn = String(n).padStart(2, "0");
  const C = makeLab(SPECS[n], `IeoSetBP3Q${nn}${SPECS[n].title.replace(/[^A-Za-z0-9]/g, "")}`);
  IEO_G6_SETB_P3_PLAY_ACTIVITY_MAP[`ieo_g6_setb_p3_q${nn}`] = C;
  IEO_G6_SETB_P3_PLAY_ACTIVITY_MAP[`IEO-G6-SETB-P3-Q${nn}`] = C;
}
