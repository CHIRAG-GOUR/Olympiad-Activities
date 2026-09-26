"use client";

import React from "react";
import dynamic from "next/dynamic";
import type { ActivityComponentType } from "../kit/types";

/**
 * Activity registry for SOF IMO 2018-19 · Class 6 · Set A.
 *
 * Every activity is loaded on demand. A candidate sitting the paper only ever downloads
 * the five-question chunk they are actually looking at, so adding fifty microworlds costs
 * nothing on the dashboard or the login screen.
 */

function Loading() {
  return (
    <div
      className="bg-white border-2 border-slate-200 rounded-2xl p-4 animate-pulse"
      role="status"
      aria-label="Loading activity"
    >
      <div className="h-5 w-48 bg-slate-200 rounded mb-3" />
      <div className="h-40 bg-slate-100 rounded-xl" />
      <div className="h-12 bg-slate-100 rounded-xl mt-3" />
    </div>
  );
}

const A = {
  q01: dynamic(() => import("./q01_05").then((m) => m.Q01NumberCrossActivity), { ssr: false, loading: Loading }),
  q02: dynamic(() => import("./q01_05").then((m) => m.Q02TransformationActivity), { ssr: false, loading: Loading }),
  q03: dynamic(() => import("./q01_05").then((m) => m.Q03RenamingMachineActivity), { ssr: false, loading: Loading }),
  q04: dynamic(() => import("./q01_05").then((m) => m.Q04DotRegionsActivity), { ssr: false, loading: Loading }),
  q05: dynamic(() => import("./q01_05").then((m) => m.Q05CarromActivity), { ssr: false, loading: Loading }),

  q06: dynamic(() => import("./q06_10").then((m) => m.Q06VennActivity), { ssr: false, loading: Loading }),
  q07: dynamic(() => import("./q06_10").then((m) => m.Q07CubeNetActivity), { ssr: false, loading: Loading }),
  q08: dynamic(() => import("./q06_10").then((m) => m.Q08SeriesScannerActivity), { ssr: false, loading: Loading }),
  q09: dynamic(() => import("./q06_10").then((m) => m.Q09TriangleExplorerActivity), { ssr: false, loading: Loading }),
  q10: dynamic(() => import("./q06_10").then((m) => m.Q10MirrorActivity), { ssr: false, loading: Loading }),

  q11: dynamic(() => import("./q11_15").then((m) => m.Q11OperatorMachineActivity), { ssr: false, loading: Loading }),
  q12: dynamic(() => import("./q11_15").then((m) => m.Q12ArrowMatrixActivity), { ssr: false, loading: Loading }),
  q13: dynamic(() => import("./q11_15").then((m) => m.Q13TransparentFoldActivity), { ssr: false, loading: Loading }),
  q14: dynamic(() => import("./q11_15").then((m) => m.Q14PatternClockworkActivity), { ssr: false, loading: Loading }),
  q15: dynamic(() => import("./q11_15").then((m) => m.Q15FamilyPinboardActivity), { ssr: false, loading: Loading }),

  q16: dynamic(() => import("./q16_20").then((m) => m.Q16DigitArrangerActivity), { ssr: false, loading: Loading }),
  q17: dynamic(() => import("./q16_20").then((m) => m.Q17GearboxActivity), { ssr: false, loading: Loading }),
  q18: dynamic(() => import("./q16_20").then((m) => m.Q18RomanForgeActivity), { ssr: false, loading: Loading }),
  q19: dynamic(() => import("./q16_20").then((m) => m.Q19AreaDistributorActivity), { ssr: false, loading: Loading }),
  q20: dynamic(() => import("./q16_20").then((m) => m.Q20PlaceValueActivity), { ssr: false, loading: Loading }),

  q21: dynamic(() => import("./q21_25").then((m) => m.Q21LineArrangerActivity), { ssr: false, loading: Loading }),
  q22: dynamic(() => import("./q21_25").then((m) => m.Q22CompassBenchActivity), { ssr: false, loading: Loading }),
  q23: dynamic(() => import("./q21_25").then((m) => m.Q23NumberLineRulerActivity), { ssr: false, loading: Loading }),
  q24: dynamic(() => import("./q21_25").then((m) => m.Q24TripleBalanceActivity), { ssr: false, loading: Loading }),
  q25: dynamic(() => import("./q21_25").then((m) => m.Q25FractionDialerActivity), { ssr: false, loading: Loading }),

  q26: dynamic(() => import("./q26_30").then((m) => m.Q26PerimeterWalkerActivity), { ssr: false, loading: Loading }),
  q27: dynamic(() => import("./q26_30").then((m) => m.Q27SubstitutionLabActivity), { ssr: false, loading: Loading }),
  q28: dynamic(() => import("./q26_30").then((m) => m.Q28SymmetryGridActivity), { ssr: false, loading: Loading }),
  q29: dynamic(() => import("./q26_30").then((m) => m.Q29AreaDecomposerActivity), { ssr: false, loading: Loading }),
  q30: dynamic(() => import("./q26_30").then((m) => m.Q30CircleWorkbenchActivity), { ssr: false, loading: Loading }),

  q31: dynamic(() => import("./q31_35").then((m) => m.Q31FractionLadderActivity), { ssr: false, loading: Loading }),
  q32: dynamic(() => import("./q31_35").then((m) => m.Q32NetFolderActivity), { ssr: false, loading: Loading }),
  q33: dynamic(() => import("./q31_35").then((m) => m.Q33DivisibilitySorterActivity), { ssr: false, loading: Loading }),
  q34: dynamic(() => import("./q31_35").then((m) => m.Q34DecimalNetworkActivity), { ssr: false, loading: Loading }),
  q35: dynamic(() => import("./q31_35").then((m) => m.Q35ProportionScalesActivity), { ssr: false, loading: Loading }),

  q36: dynamic(() => import("./q36_40").then((m) => m.Q36PackingLineActivity), { ssr: false, loading: Loading }),
  q37: dynamic(() => import("./q36_40").then((m) => m.Q37PartyStockerActivity), { ssr: false, loading: Loading }),
  q38: dynamic(() => import("./q36_40").then((m) => m.Q38GardenPlannerActivity), { ssr: false, loading: Loading }),
  q39: dynamic(() => import("./q36_40").then((m) => m.Q39AgeTimelineActivity), { ssr: false, loading: Loading }),
  q40: dynamic(() => import("./q36_40").then((m) => m.Q40AlgebraSheetActivity), { ssr: false, loading: Loading }),

  q41: dynamic(() => import("./q41_45").then((m) => m.Q41ThermometerActivity), { ssr: false, loading: Loading }),
  q42: dynamic(() => import("./q41_45").then((m) => m.Q42ShopCounterActivity), { ssr: false, loading: Loading }),
  q43: dynamic(() => import("./q41_45").then((m) => m.Q43CandyFlowActivity), { ssr: false, loading: Loading }),
  q44: dynamic(() => import("./q41_45").then((m) => m.Q44GrainBaggerActivity), { ssr: false, loading: Loading }),
  q45: dynamic(() => import("./q41_45").then((m) => m.Q45BlackboardActivity), { ssr: false, loading: Loading }),

  q46: dynamic(() => import("./q46_50").then((m) => m.Q46BlankBenchActivity), { ssr: false, loading: Loading }),
  q47: dynamic(() => import("./q46_50").then((m) => m.Q47TruthBenchActivity), { ssr: false, loading: Loading }),
  q48: dynamic(() => import("./q46_50").then((m) => m.Q48BarGraphActivity), { ssr: false, loading: Loading }),
  q49: dynamic(() => import("./q46_50").then((m) => m.Q49TwinNumberLinesActivity), { ssr: false, loading: Loading }),
  q50: dynamic(() => import("./q46_50").then((m) => m.Q50ShadeMatchActivity), { ssr: false, loading: Loading }),
} as Record<string, ActivityComponentType>;

/** Both the internal id and the printed question code resolve to the classic activity. */
export const IMO6A_CLASSIC_ACTIVITY_MAP: Record<string, ActivityComponentType> = Object.fromEntries(
  Object.entries(A).flatMap(([key, component]) => {
    const n = key.slice(1); // "01" … "50"
    return [
      [`q_imo6ac_${n}`, component],
      [`IMO6AC-Q${n}`, component],
      [`q_imo6a_classic_${n}`, component],
    ];
  })
);

