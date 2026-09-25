"use client";

import React from "react";
import dynamic from "next/dynamic";
import type { ActivityComponentType } from "../kit/types";

/**
 * Mini-game registry for SOF IMO 2018-19 · Class 6 · Set A.
 *
 * Every game follows the play contract in `./engine`: the student manipulates a world,
 * the world derives an answer, and nothing is recorded until the student submits.
 * Games load on demand, five to a chunk, and the 3D ones pull in three.js only when a
 * candidate actually opens one of them.
 */

function Loading() {
  return (
    <div className="bg-white border-2 border-violet-100 rounded-2xl p-4 animate-pulse" role="status" aria-label="Loading activity">
      <div className="h-5 w-48 bg-violet-100 rounded mb-3" />
      <div className="h-56 bg-violet-50 rounded-xl" />
      <div className="h-12 bg-slate-100 rounded-xl mt-3" />
    </div>
  );
}

const A = {
  q01: dynamic(() => import("./p01_05").then((m) => m.Q01NumberMachine), { ssr: false, loading: Loading }),
  q02: dynamic(() => import("./p01_05").then((m) => m.Q02TransformationLab), { ssr: false, loading: Loading }),
  q03: dynamic(() => import("./p01_05").then((m) => m.Q03SportsDictionary), { ssr: false, loading: Loading }),
  q04: dynamic(() => import("./p01_05").then((m) => m.Q04LaserDotGrid), { ssr: false, loading: Loading }),
  q05: dynamic(() => import("./p01_05").then((m) => m.Q05CarromBoard), { ssr: false, loading: Loading }),

  q06: dynamic(() => import("./p06_10").then((m) => m.Q06AnimalGarden), { ssr: false, loading: Loading }),
  q07: dynamic(() => import("./p06_10").then((m) => m.Q07CubeFolding), { ssr: false, loading: Loading }),
  q08: dynamic(() => import("./p06_10").then((m) => m.Q08SixHunter), { ssr: false, loading: Loading }),
  q09: dynamic(() => import("./p06_10").then((m) => m.Q09TriangleDetective), { ssr: false, loading: Loading }),
  q10: dynamic(() => import("./p06_10").then((m) => m.Q10MirrorRoom), { ssr: false, loading: Loading }),

  q11: dynamic(() => import("./p11_15").then((m) => m.Q11OperatorMixer), { ssr: false, loading: Loading }),
  q12: dynamic(() => import("./p11_15").then((m) => m.Q12MatrixLab), { ssr: false, loading: Loading }),
  q13: dynamic(() => import("./p11_15").then((m) => m.Q13XRayFold), { ssr: false, loading: Loading }),
  q14: dynamic(() => import("./p11_15").then((m) => m.Q14PatternBuilder), { ssr: false, loading: Loading }),
  q15: dynamic(() => import("./p11_15").then((m) => m.Q15FamilyDetective), { ssr: false, loading: Loading }),

  q16: dynamic(() => import("./p16_20").then((m) => m.Q16NumberForge), { ssr: false, loading: Loading }),
  q17: dynamic(() => import("./p16_20").then((m) => m.Q17FactorReactor), { ssr: false, loading: Loading }),
  q18: dynamic(() => import("./p16_20").then((m) => m.Q18RomanForge), { ssr: false, loading: Loading }),
  q19: dynamic(() => import("./p16_20").then((m) => m.Q19PropertyLab), { ssr: false, loading: Loading }),
  q20: dynamic(() => import("./p16_20").then((m) => m.Q20DigitSwapElevator), { ssr: false, loading: Loading }),

  q21: dynamic(() => import("./p21_25").then((m) => m.Q21LaserLines), { ssr: false, loading: Loading }),
  q22: dynamic(() => import("./p21_25").then((m) => m.Q22ConstructionBench), { ssr: false, loading: Loading }),
  q23: dynamic(() => import("./p21_25").then((m) => m.Q23NumberLineJourney), { ssr: false, loading: Loading }),
  q24: dynamic(() => import("./p21_25").then((m) => m.Q24RatioBalance), { ssr: false, loading: Loading }),
  q25: dynamic(() => import("./p21_25").then((m) => m.Q25DecimalTank), { ssr: false, loading: Loading }),

  q26: dynamic(() => import("./p26_30").then((m) => m.Q26PerimeterBuilder), { ssr: false, loading: Loading }),
  q27: dynamic(() => import("./p26_30").then((m) => m.Q27AlgebraPanel), { ssr: false, loading: Loading }),
  q28: dynamic(() => import("./p26_30").then((m) => m.Q28MirrorPainter), { ssr: false, loading: Loading }),
  q29: dynamic(() => import("./p26_30").then((m) => m.Q29ConstructionSite), { ssr: false, loading: Loading }),
  q30: dynamic(() => import("./p26_30").then((m) => m.Q30CircleLab), { ssr: false, loading: Loading }),

  q31: dynamic(() => import("./p31_35").then((m) => m.Q31FractionRace), { ssr: false, loading: Loading }),
  q32: dynamic(() => import("./p31_35").then((m) => m.Q32SolidFoldingLab), { ssr: false, loading: Loading }),
  q33: dynamic(() => import("./p31_35").then((m) => m.Q33DivisibilityScanner), { ssr: false, loading: Loading }),
  q34: dynamic(() => import("./p31_35").then((m) => m.Q34QuadReactor), { ssr: false, loading: Loading }),
  q35: dynamic(() => import("./p31_35").then((m) => m.Q35ProportionMarket), { ssr: false, loading: Loading }),

  q36: dynamic(() => import("./p36_40").then((m) => m.Q36StrawberryFactory), { ssr: false, loading: Loading }),
  q37: dynamic(() => import("./p36_40").then((m) => m.Q37PartyTruck), { ssr: false, loading: Loading }),
  q38: dynamic(() => import("./p36_40").then((m) => m.Q38GardenDesigner), { ssr: false, loading: Loading }),
  q39: dynamic(() => import("./p36_40").then((m) => m.Q39AgeTimeline), { ssr: false, loading: Loading }),
  q40: dynamic(() => import("./p36_40").then((m) => m.Q40BedSheetDesigner), { ssr: false, loading: Loading }),

  q41: dynamic(() => import("./p41_45").then((m) => m.Q41HillThermometer), { ssr: false, loading: Loading }),
  q42: dynamic(() => import("./p41_45").then((m) => m.Q42GroceryCheckout), { ssr: false, loading: Loading }),
  q43: dynamic(() => import("./p41_45").then((m) => m.Q43CandySharing), { ssr: false, loading: Loading }),
  q44: dynamic(() => import("./p41_45").then((m) => m.Q44FarmerBagger), { ssr: false, loading: Loading }),
  q45: dynamic(() => import("./p41_45").then((m) => m.Q45NumberBlackboard), { ssr: false, loading: Loading }),

  q46: dynamic(() => import("./p46_50").then((m) => m.Q46TruthLaboratory), { ssr: false, loading: Loading }),
  q47: dynamic(() => import("./p46_50").then((m) => m.Q47EngineeringLab), { ssr: false, loading: Loading }),
  q48: dynamic(() => import("./p46_50").then((m) => m.Q48ShirtShop), { ssr: false, loading: Loading }),
  q49: dynamic(() => import("./p46_50").then((m) => m.Q49TreasureHunt), { ssr: false, loading: Loading }),
  q50: dynamic(() => import("./p46_50").then((m) => m.Q50RatioMuseum), { ssr: false, loading: Loading }),
} as Record<string, ActivityComponentType>;

/** Both the internal id and the printed question code resolve to the same game. */
export const IMO6A_ACTIVITY_MAP: Record<string, ActivityComponentType> = Object.fromEntries(
  Object.entries(A).flatMap(([key, component]) => {
    const n = key.slice(1); // "01" … "50"
    return [
      [`q_imo6a_${n}`, component],
      [`IMO6A-Q${n}`, component],
    ];
  })
);
