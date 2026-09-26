"use client";

import React from "react";
import dynamic from "next/dynamic";
import type { ActivityComponentType } from "../kit/types";

/**
 * Mini-game registry for SOF IMO Class 6 · Set B (2022-23).
 *
 * Every game follows the play contract:
 * 3D World → Student Manipulation → Measurable State → Derived Answer → Automatic Option Mapping.
 * Strictly NO answer choice buttons inside the simulation.
 */

function Loading() {
  return (
    <div className="bg-slate-900 border-2 border-indigo-500/30 rounded-2xl p-6 animate-pulse text-center" role="status" aria-label="Loading 3D Activity">
      <div className="h-6 w-56 bg-indigo-500/20 rounded mx-auto mb-4" />
      <div className="h-64 bg-slate-800/50 rounded-xl" />
      <div className="h-12 bg-slate-800 rounded-xl mt-4" />
    </div>
  );
}

const B = {
  // Q01 - Q05
  q01: dynamic(() => import("./b01_05").then((m) => m.B01FamilyDetectiveHouseActivity), { ssr: false, loading: Loading }),
  q02: dynamic(() => import("./b01_05").then((m) => m.B02SpatialBlueprintLabActivity), { ssr: false, loading: Loading }),
  q03: dynamic(() => import("./b01_05").then((m) => m.B03CityRoleSortingActivity), { ssr: false, loading: Loading }),
  q04: dynamic(() => import("./b01_05").then((m) => m.B04SequencePowerReactorActivity), { ssr: false, loading: Loading }),
  q05: dynamic(() => import("./b01_05").then((m) => m.B05MechanicalTransformationActivity), { ssr: false, loading: Loading }),

  // Q06 - Q10
  q06: dynamic(() => import("./b06_10").then((m) => m.B06TriangleScannerActivity), { ssr: false, loading: Loading }),
  q07: dynamic(() => import("./b06_10").then((m) => m.B07OrigamiSimulatorActivity), { ssr: false, loading: Loading }),
  q08: dynamic(() => import("./b06_10").then((m) => m.B08SecuritySequenceScannerActivity), { ssr: false, loading: Loading }),
  q09: dynamic(() => import("./b06_10").then((m) => m.B09ShapeSortingObservatoryActivity), { ssr: false, loading: Loading }),
  q10: dynamic(() => import("./b06_10").then((m) => m.B10WordJungleActivity), { ssr: false, loading: Loading }),

  // Q11 - Q15
  q11: dynamic(() => import("./b11_15").then((m) => m.B11AlphabetFactoryActivity), { ssr: false, loading: Loading }),
  q12: dynamic(() => import("./b11_15").then((m) => m.B12MirrorDimensionActivity), { ssr: false, loading: Loading }),
  q13: dynamic(() => import("./b11_15").then((m) => m.B13OperatorControlRoomActivity), { ssr: false, loading: Loading }),
  q14: dynamic(() => import("./b11_15").then((m) => m.B14CubeConstructionYardActivity), { ssr: false, loading: Loading }),
  q15: dynamic(() => import("./b11_15").then((m) => m.B15ArrowMatrixReactorActivity), { ssr: false, loading: Loading }),

  // Q16 - Q20
  q16: dynamic(() => import("./b16_20").then((m) => m.B16GlobalTemperatureActivity), { ssr: false, loading: Loading }),
  q17: dynamic(() => import("./b16_20").then((m) => m.B17WordDissectionLabActivity), { ssr: false, loading: Loading }),
  q18: dynamic(() => import("./b16_20").then((m) => m.B18PlaceValueCityActivity), { ssr: false, loading: Loading }),
  q19: dynamic(() => import("./b16_20").then((m) => m.B19PrimeFactorMiningActivity), { ssr: false, loading: Loading }),
  q20: dynamic(() => import("./b16_20").then((m) => m.B20GeometryCertificationActivity), { ssr: false, loading: Loading }),

  // Q21 - Q25
  q21: dynamic(() => import("./b21_25").then((m) => m.B21NumberLineTrainActivity), { ssr: false, loading: Loading }),
  q22: dynamic(() => import("./b21_25").then((m) => m.B22RatioChemicalReactorActivity), { ssr: false, loading: Loading }),
  q23: dynamic(() => import("./b21_25").then((m) => m.B23AgeTimelineMachineActivity), { ssr: false, loading: Loading }),
  q24: dynamic(() => import("./b21_25").then((m) => m.B24ArchitectFloorBuilderActivity), { ssr: false, loading: Loading }),
  q25: dynamic(() => import("./b21_25").then((m) => m.B25DecimalMoneyCounterActivity), { ssr: false, loading: Loading }),

  // Q26 - Q30
  q26: dynamic(() => import("./b26_30").then((m) => m.B26CricketStadiumDataActivity), { ssr: false, loading: Loading }),
  q27: dynamic(() => import("./b26_30").then((m) => m.B27ClockTowerMechanismActivity), { ssr: false, loading: Loading }),
  q28: dynamic(() => import("./b26_30").then((m) => m.B28DecimalElevatorActivity), { ssr: false, loading: Loading }),
  q29: dynamic(() => import("./b26_30").then((m) => m.B29SymmetryLaserLabActivity), { ssr: false, loading: Loading }),
  q30: dynamic(() => import("./b26_30").then((m) => m.B30NumberConstructionTowerActivity), { ssr: false, loading: Loading }),

  // Q31 - Q35
  q31: dynamic(() => import("./b31_35").then((m) => m.B31FruitMarketAlgebraActivity), { ssr: false, loading: Loading }),
  q32: dynamic(() => import("./b31_35").then((m) => m.B32LineSurveyorActivity), { ssr: false, loading: Loading }),
  q33: dynamic(() => import("./b31_35").then((m) => m.B33NumberTheoryCourtroomActivity), { ssr: false, loading: Loading }),
  q34: dynamic(() => import("./b31_35").then((m) => m.B34FractionTileObservatoryActivity), { ssr: false, loading: Loading }),
  q35: dynamic(() => import("./b31_35").then((m) => m.B35FootballDataArenaActivity), { ssr: false, loading: Loading }),

  // Q36 - Q40
  q36: dynamic(() => import("./b36_40").then((m) => m.B36ParkRunnerActivity), { ssr: false, loading: Loading }),
  q37: dynamic(() => import("./b36_40").then((m) => m.B37ClassroomGroupingActivity), { ssr: false, loading: Loading }),
  q38: dynamic(() => import("./b36_40").then((m) => m.B38BreakfastShopRatioActivity), { ssr: false, loading: Loading }),
  q39: dynamic(() => import("./b36_40").then((m) => m.B39RaceTrackSimulatorActivity), { ssr: false, loading: Loading }),
  q40: dynamic(() => import("./b36_40").then((m) => m.B40FarmBuilderActivity), { ssr: false, loading: Loading }),

  // Q41 - Q45
  q41: dynamic(() => import("./b41_45").then((m) => m.B41RomanNumeralForgeActivity), { ssr: false, loading: Loading }),
  q42: dynamic(() => import("./b41_45").then((m) => m.B42BankAccountSimulatorActivity), { ssr: false, loading: Loading }),
  q43: dynamic(() => import("./b41_45").then((m) => m.B43LaptopFactoryActivity), { ssr: false, loading: Loading }),
  q44: dynamic(() => import("./b41_45").then((m) => m.B44SupermarketCheckoutActivity), { ssr: false, loading: Loading }),
  q45: dynamic(() => import("./b41_45").then((m) => m.B45RoundingFactoryActivity), { ssr: false, loading: Loading }),

  // Q46 - Q50
  q46: dynamic(() => import("./b46_50").then((m) => m.B46MatchingVaultActivity), { ssr: false, loading: Loading }),
  q47: dynamic(() => import("./b46_50").then((m) => m.B47CompassTowerActivity), { ssr: false, loading: Loading }),
  q48: dynamic(() => import("./b46_50").then((m) => m.B48TripleCalculationReactorActivity), { ssr: false, loading: Loading }),
  q49: dynamic(() => import("./b46_50").then((m) => m.B49ConstructionEngineerActivity), { ssr: false, loading: Loading }),
  q50: dynamic(() => import("./b46_50").then((m) => m.B50RetailAnalyticsCityActivity), { ssr: false, loading: Loading }),
} as Record<string, ActivityComponentType>;

/**
 * Question Code and ID Mapping dictionary for IMO Class 6 Set B (2022-23)
 */
export const IMO6B_PLAY_ACTIVITY_MAP: Record<string, ActivityComponentType> = {
  // Logical Reasoning (Q1 - Q15)
  q_imo_01: B.q01, "LOG-G6-001": B.q01, "IMO6B-Q01": B.q01, q_imo6b_01: B.q01,
  q_imo_02: B.q02, "LOG-G6-002": B.q02, "IMO6B-Q02": B.q02, q_imo6b_02: B.q02,
  q_imo_03: B.q03, "LOG-G6-003": B.q03, "IMO6B-Q03": B.q03, q_imo6b_03: B.q03,
  q_imo_04: B.q04, "LOG-G6-004": B.q04, "IMO6B-Q04": B.q04, q_imo6b_04: B.q04,
  q_imo_05: B.q05, "LOG-G6-005": B.q05, "IMO6B-Q05": B.q05, q_imo6b_05: B.q05,
  q_imo_06: B.q06, "LOG-G6-006": B.q06, "IMO6B-Q06": B.q06, q_imo6b_06: B.q06,
  q_imo_07: B.q07, "LOG-G6-007": B.q07, "IMO6B-Q07": B.q07, q_imo6b_07: B.q07,
  q_imo_08: B.q08, "LOG-G6-008": B.q08, "IMO6B-Q08": B.q08, q_imo6b_08: B.q08,
  q_imo_09: B.q09, "LOG-G6-009": B.q09, "IMO6B-Q09": B.q09, q_imo6b_09: B.q09,
  q_imo_10: B.q10, "LOG-G6-010": B.q10, "IMO6B-Q10": B.q10, q_imo6b_10: B.q10,
  q_imo_11: B.q11, "LOG-G6-011": B.q11, "IMO6B-Q11": B.q11, q_imo6b_11: B.q11,
  q_imo_12: B.q12, "LOG-G6-012": B.q12, "IMO6B-Q12": B.q12, q_imo6b_12: B.q12,
  q_imo_13: B.q13, "LOG-G6-013": B.q13, "IMO6B-Q13": B.q13, q_imo6b_13: B.q13,
  q_imo_14: B.q14, "LOG-G6-014": B.q14, "IMO6B-Q14": B.q14, q_imo6b_14: B.q14,
  q_imo_15: B.q15, "LOG-G6-015": B.q15, "IMO6B-Q15": B.q15, q_imo6b_15: B.q15,

  // Mathematical Reasoning (Q16 - Q35)
  q_imo_16: B.q16, "MAT-G6-016": B.q16, "IMO6B-Q16": B.q16, q_imo6b_16: B.q16,
  q_imo_17: B.q17, "MAT-G6-017": B.q17, "IMO6B-Q17": B.q17, q_imo6b_17: B.q17,
  q_imo_18: B.q18, "MAT-G6-018": B.q18, "IMO6B-Q18": B.q18, q_imo6b_18: B.q18,
  q_imo_19: B.q19, "MAT-G6-019": B.q19, "IMO6B-Q19": B.q19, q_imo6b_19: B.q19,
  q_imo_20: B.q20, "MAT-G6-020": B.q20, "IMO6B-Q20": B.q20, q_imo6b_20: B.q20,
  q_imo_21: B.q21, "MAT-G6-021": B.q21, "IMO6B-Q21": B.q21, q_imo6b_21: B.q21,
  q_imo_22: B.q22, "MAT-G6-022": B.q22, "IMO6B-Q22": B.q22, q_imo6b_22: B.q22,
  q_imo_23: B.q23, "MAT-G6-023": B.q23, "IMO6B-Q23": B.q23, q_imo6b_23: B.q23,
  q_imo_24: B.q24, "MAT-G6-024": B.q24, "IMO6B-Q24": B.q24, q_imo6b_24: B.q24,
  q_imo_25: B.q25, "MAT-G6-025": B.q25, "IMO6B-Q25": B.q25, q_imo6b_25: B.q25,
  q_imo_26: B.q26, "MAT-G6-026": B.q26, "IMO6B-Q26": B.q26, q_imo6b_26: B.q26,
  q_imo_27: B.q27, "MAT-G6-027": B.q27, "IMO6B-Q27": B.q27, q_imo6b_27: B.q27,
  q_imo_28: B.q28, "MAT-G6-028": B.q28, "IMO6B-Q28": B.q28, q_imo6b_28: B.q28,
  q_imo_29: B.q29, "MAT-G6-029": B.q29, "IMO6B-Q29": B.q29, q_imo6b_29: B.q29,
  q_imo_30: B.q30, "MAT-G6-030": B.q30, "IMO6B-Q30": B.q30, q_imo6b_30: B.q30,
  q_imo_31: B.q31, "MAT-G6-031": B.q31, "IMO6B-Q31": B.q31, q_imo6b_31: B.q31,
  q_imo_32: B.q32, "MAT-G6-032": B.q32, "IMO6B-Q32": B.q32, q_imo6b_32: B.q32,
  q_imo_33: B.q33, "MAT-G6-033": B.q33, "IMO6B-Q33": B.q33, q_imo6b_33: B.q33,
  q_imo_34: B.q34, "MAT-G6-034": B.q34, "IMO6B-Q34": B.q34, q_imo6b_34: B.q34,
  q_imo_35: B.q35, "MAT-G6-035": B.q35, "IMO6B-Q35": B.q35, q_imo6b_35: B.q35,

  // Everyday Mathematics (Q36 - Q45)
  q_imo_36: B.q36, "EVY-G6-036": B.q36, "EVM-G6-036": B.q36, "IMO6B-Q36": B.q36, q_imo6b_36: B.q36,
  q_imo_37: B.q37, "EVY-G6-037": B.q37, "EVM-G6-037": B.q37, "IMO6B-Q37": B.q37, q_imo6b_37: B.q37,
  q_imo_38: B.q38, "EVY-G6-038": B.q38, "EVM-G6-038": B.q38, "IMO6B-Q38": B.q38, q_imo6b_38: B.q38,
  q_imo_39: B.q39, "EVY-G6-039": B.q39, "EVM-G6-039": B.q39, "IMO6B-Q39": B.q39, q_imo6b_39: B.q39,
  q_imo_40: B.q40, "EVY-G6-040": B.q40, "EVM-G6-040": B.q40, "IMO6B-Q40": B.q40, q_imo6b_40: B.q40,
  q_imo_41: B.q41, "EVY-G6-041": B.q41, "EVM-G6-041": B.q41, "IMO6B-Q41": B.q41, q_imo6b_41: B.q41,
  q_imo_42: B.q42, "EVY-G6-042": B.q42, "EVM-G6-042": B.q42, "IMO6B-Q42": B.q42, q_imo6b_42: B.q42,
  q_imo_43: B.q43, "EVY-G6-043": B.q43, "EVM-G6-043": B.q43, "IMO6B-Q43": B.q43, q_imo6b_43: B.q43,
  q_imo_44: B.q44, "EVY-G6-044": B.q44, "EVM-G6-044": B.q44, "IMO6B-Q44": B.q44, q_imo6b_44: B.q44,
  q_imo_45: B.q45, "EVY-G6-045": B.q45, "EVM-G6-045": B.q45, "IMO6B-Q45": B.q45, q_imo6b_45: B.q45,

  // Achievers Section (Q46 - Q50)
  q_imo_46: B.q46, "ACH-G6-046": B.q46, "IMO6B-Q46": B.q46, q_imo6b_46: B.q46,
  q_imo_47: B.q47, "ACH-G6-047": B.q47, "IMO6B-Q47": B.q47, q_imo6b_47: B.q47,
  q_imo_48: B.q48, "ACH-G6-048": B.q48, "IMO6B-Q48": B.q48, q_imo6b_48: B.q48,
  q_imo_49: B.q49, "ACH-G6-049": B.q49, "IMO6B-Q49": B.q49, q_imo6b_49: B.q49,
  q_imo_50: B.q50, "ACH-G6-050": B.q50, "IMO6B-Q50": B.q50, q_imo6b_50: B.q50,
};
