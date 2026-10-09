"use client";

import React, { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";
import type { ActivityComponentProps, ActivityComponentType } from "../kit/types";

/**
 * IGKO Class 6 Science & Technology — activity registry.
 *
 * Each investigation is its own chunk, loaded when its question is opened, so a student
 * never downloads fifteen 3D labs to look at one.
 */

function Loading() {
  return (
    <div className="h-[clamp(260px,46vw,420px)] rounded-2xl border-2 border-teal-100 bg-teal-50/40 grid place-items-center" role="status">
      <span className="flex items-center gap-2 text-sm font-bold text-teal-800">
        <Loader2 className="w-4 h-4 animate-spin" /> Preparing the laboratory…
      </span>
    </div>
  );
}

function lazyActivity(load: () => Promise<{ default: React.ComponentType<ActivityComponentProps> }>): ActivityComponentType {
  const Lazy = lazy(load);
  function LazyActivity(props: ActivityComponentProps) {
    return (
      <Suspense fallback={<Loading />}>
        <Lazy {...props} />
      </Suspense>
    );
  }
  return LazyActivity;
}

const Q01 = lazyActivity(() => import("./q01_nobel").then((m) => ({ default: m.IgkoQ01Nobel })));
const Q02 = lazyActivity(() => import("./q02_plasma").then((m) => ({ default: m.IgkoQ02Plasma })));
const Q03 = lazyActivity(() => import("./q03_lunar").then((m) => ({ default: m.IgkoQ03Lunar })));
const Q04 = lazyActivity(() => import("./q04_force").then((m) => ({ default: m.IgkoQ04Force })));
const Q05 = lazyActivity(() => import("./q05_imaging").then((m) => ({ default: m.IgkoQ05Imaging })));
const Q06 = lazyActivity(() => import("./q06_raman").then((m) => ({ default: m.IgkoQ06Raman })));
const Q07 = lazyActivity(() => import("./q07_milk").then((m) => ({ default: m.IgkoQ07Milk })));
const Q08 = lazyActivity(() => import("./q08_reactor").then((m) => ({ default: m.IgkoQ08Reactor })));
const Q09 = lazyActivity(() => import("./q09_botany").then((m) => ({ default: m.IgkoQ09Botany })));
const Q10 = lazyActivity(() => import("./q10_energy").then((m) => ({ default: m.IgkoQ10Energy })));
const Q11 = lazyActivity(() => import("./q11_observatory").then((m) => ({ default: m.IgkoQ11Observatory })));
const Q12 = lazyActivity(() => import("./q12_museum").then((m) => ({ default: m.IgkoQ12Museum })));
const Q13 = lazyActivity(() => import("./q13_thermal").then((m) => ({ default: m.IgkoQ13Thermal })));
const Q14 = lazyActivity(() => import("./q14_dive").then((m) => ({ default: m.IgkoQ14Dive })));
const Q15 = lazyActivity(() => import("./q15_motor").then((m) => ({ default: m.IgkoQ15Motor })));

const BY_NUMBER: Record<number, ActivityComponentType> = {
  1: Q01, 2: Q02, 3: Q03, 4: Q04, 5: Q05, 6: Q06, 7: Q07, 8: Q08,
  9: Q09, 10: Q10, 11: Q11, 12: Q12, 13: Q13, 14: Q14, 15: Q15,
};

export const IGKO_G6_SCITECH_ACTIVITY_MAP: Record<string, ActivityComponentType> = Object.fromEntries(
  Object.entries(BY_NUMBER).flatMap(([n, C]) => {
    const nn = String(n).padStart(2, "0");
    return [
      [`igko_g6_st_q${nn}`, C],
      [`IGKO-G6-ST-Q${nn}`, C],
    ];
  })
);
