"use client";

import React from "react";
import { Question } from "@/types/question";

// 50 Bespoke Interactive Olympiad Activities
import { DiceLabActivity } from "./DiceLabActivity";
import { LetterCircuitActivity } from "./LetterCircuitActivity";
import { VennScannerActivity } from "./VennScannerActivity";
import { ExplorerNavActivity } from "./ExplorerNavActivity";
import { PlaceValueCraneActivity } from "./PlaceValueCraneActivity";
import { ReflectionPoolActivity } from "./ReflectionPoolActivity";
import { FoldingStudioActivity } from "./FoldingStudioActivity";
import { TransformationLabActivity } from "./TransformationLabActivity";
import { FamilyPinboardActivity } from "./FamilyPinboardActivity";
import { PrecisionScannerActivity } from "./PrecisionScannerActivity";
import { ShapeTransformActivity } from "./ShapeTransformActivity";
import { OperatorFactoryActivity } from "./OperatorFactoryActivity";
import { CalendarPlannerActivity } from "./CalendarPlannerActivity";
import { MosaicRestorationActivity } from "./MosaicRestorationActivity";
import { ShapeClassificationActivity } from "./ShapeClassificationActivity";

import { TilePainterActivity } from "./TilePainterActivity";
import { NumberTreeActivity } from "./NumberTreeActivity";
import { RoundingRailwayActivity } from "./RoundingRailwayActivity";
import { IntegerBalanceActivity } from "./IntegerBalanceActivity";
import { SymmetryStudioActivity } from "./SymmetryStudioActivity";
import { GeometrySurveyorActivity } from "./GeometrySurveyorActivity";
import { TrafficControlActivity } from "./TrafficControlActivity";
import { PieWorkshopActivity } from "./PieWorkshopActivity";
import { FloorPlannerActivity } from "./FloorPlannerActivity";
import { ClockAngleActivity } from "./ClockAngleActivity";
import { NumberPressActivity } from "./NumberPressActivity";
import { TrackInspectorActivity } from "./TrackInspectorActivity";
import { FractionTanksActivity } from "./FractionTanksActivity";
import { WireFenceActivity } from "./WireFenceActivity";
import { PrecisionBalanceActivity } from "./PrecisionBalanceActivity";
import { NumberTrailActivity } from "./NumberTrailActivity";
import { FactorVaultActivity } from "./FactorVaultActivity";
import { RomanArchaeologyActivity } from "./RomanArchaeologyActivity";
import { MeasurementWorkshopActivity } from "./MeasurementWorkshopActivity";
import { DivisibilityScannerActivity } from "./DivisibilityScannerActivity";

import { PocketMoneyActivity } from "./PocketMoneyActivity";
import { DigitPlantActivity } from "./DigitPlantActivity";
import { FieldRaceActivity } from "./FieldRaceActivity";
import { WeatherStationActivity } from "./WeatherStationActivity";
import { PenPackingActivity } from "./PenPackingActivity";
import { GymTimeActivity } from "./GymTimeActivity";
import { WeightBalanceActivity } from "./WeightBalanceActivity";
import { EnvelopePlantActivity } from "./EnvelopePlantActivity";
import { MarketCheckoutActivity } from "./MarketCheckoutActivity";
import { StepSyncActivity } from "./StepSyncActivity";

import { IntegerElevatorActivity } from "./IntegerElevatorActivity";
import { InspectionDroneActivity } from "./InspectionDroneActivity";
import { EvidenceRoomActivity } from "./EvidenceRoomActivity";
import { TestingLabActivity } from "./TestingLabActivity";
import { DetectiveCaseFileActivity } from "./DetectiveCaseFileActivity";

export interface ActivityComponentProps {
  questionId: string;
  question?: Question;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export type ActivityComponentType = React.ComponentType<ActivityComponentProps>;

// Mapping for standard IMO Class 6 Set B question IDs and Codes
const ACTIVITY_MAP: Record<string, ActivityComponentType> = {
  // Q1 - Q15 Logical Reasoning
  q_imo_01: DiceLabActivity,
  "LOG-G6-001": DiceLabActivity,
  q_imo_02: LetterCircuitActivity,
  "LOG-G6-002": LetterCircuitActivity,
  q_imo_03: VennScannerActivity,
  "LOG-G6-003": VennScannerActivity,
  q_imo_04: ExplorerNavActivity,
  "LOG-G6-004": ExplorerNavActivity,
  q_imo_05: PlaceValueCraneActivity,
  "LOG-G6-005": PlaceValueCraneActivity,
  q_imo_06: ReflectionPoolActivity,
  "LOG-G6-006": ReflectionPoolActivity,
  q_imo_07: FoldingStudioActivity,
  "LOG-G6-007": FoldingStudioActivity,
  q_imo_08: TransformationLabActivity,
  "LOG-G6-008": TransformationLabActivity,
  q_imo_09: FamilyPinboardActivity,
  "LOG-G6-009": FamilyPinboardActivity,
  q_imo_10: PrecisionScannerActivity,
  "LOG-G6-010": PrecisionScannerActivity,
  q_imo_11: ShapeTransformActivity,
  "LOG-G6-011": ShapeTransformActivity,
  q_imo_12: OperatorFactoryActivity,
  "LOG-G6-012": OperatorFactoryActivity,
  q_imo_13: CalendarPlannerActivity,
  "LOG-G6-013": CalendarPlannerActivity,
  q_imo_14: MosaicRestorationActivity,
  "LOG-G6-014": MosaicRestorationActivity,
  q_imo_15: ShapeClassificationActivity,
  "LOG-G6-015": ShapeClassificationActivity,

  // Q16 - Q35 Mathematical Reasoning
  q_imo_16: TilePainterActivity,
  "MAT-G6-016": TilePainterActivity,
  q_imo_17: NumberTreeActivity,
  "MAT-G6-017": NumberTreeActivity,
  q_imo_18: RoundingRailwayActivity,
  "MAT-G6-018": RoundingRailwayActivity,
  q_imo_19: IntegerBalanceActivity,
  "MAT-G6-019": IntegerBalanceActivity,
  q_imo_20: SymmetryStudioActivity,
  "MAT-G6-020": SymmetryStudioActivity,
  q_imo_21: GeometrySurveyorActivity,
  "MAT-G6-021": GeometrySurveyorActivity,
  q_imo_22: TrafficControlActivity,
  "MAT-G6-022": TrafficControlActivity,
  q_imo_23: PieWorkshopActivity,
  "MAT-G6-023": PieWorkshopActivity,
  q_imo_24: FloorPlannerActivity,
  "MAT-G6-024": FloorPlannerActivity,
  q_imo_25: ClockAngleActivity,
  "MAT-G6-025": ClockAngleActivity,
  q_imo_26: NumberPressActivity,
  "MAT-G6-026": NumberPressActivity,
  q_imo_27: TrackInspectorActivity,
  "MAT-G6-027": TrackInspectorActivity,
  q_imo_28: FractionTanksActivity,
  "MAT-G6-028": FractionTanksActivity,
  q_imo_29: WireFenceActivity,
  "MAT-G6-029": WireFenceActivity,
  q_imo_30: PrecisionBalanceActivity,
  "MAT-G6-030": PrecisionBalanceActivity,
  q_imo_31: NumberTrailActivity,
  "MAT-G6-031": NumberTrailActivity,
  q_imo_32: FactorVaultActivity,
  "MAT-G6-032": FactorVaultActivity,
  q_imo_33: RomanArchaeologyActivity,
  "MAT-G6-033": RomanArchaeologyActivity,
  q_imo_34: MeasurementWorkshopActivity,
  "MAT-G6-034": MeasurementWorkshopActivity,
  q_imo_35: DivisibilityScannerActivity,
  "MAT-G6-035": DivisibilityScannerActivity,

  // Q36 - Q45 Everyday Mathematics
  q_imo_36: PocketMoneyActivity,
  "EVY-G6-036": PocketMoneyActivity,
  q_imo_37: DigitPlantActivity,
  "EVY-G6-037": DigitPlantActivity,
  q_imo_38: FieldRaceActivity,
  "EVY-G6-038": FieldRaceActivity,
  q_imo_39: WeatherStationActivity,
  "EVY-G6-039": WeatherStationActivity,
  q_imo_40: PenPackingActivity,
  "EVY-G6-040": PenPackingActivity,
  q_imo_41: GymTimeActivity,
  "EVY-G6-041": GymTimeActivity,
  q_imo_42: WeightBalanceActivity,
  "EVY-G6-042": WeightBalanceActivity,
  q_imo_43: EnvelopePlantActivity,
  "EVY-G6-043": EnvelopePlantActivity,
  q_imo_44: MarketCheckoutActivity,
  "EVY-G6-044": MarketCheckoutActivity,
  q_imo_45: StepSyncActivity,
  "EVY-G6-045": StepSyncActivity,

  // Q46 - Q50 Achievers Section
  q_imo_46: IntegerElevatorActivity,
  "ACH-G6-046": IntegerElevatorActivity,
  q_imo_47: InspectionDroneActivity,
  "ACH-G6-047": InspectionDroneActivity,
  q_imo_48: EvidenceRoomActivity,
  "ACH-G6-048": EvidenceRoomActivity,
  q_imo_49: TestingLabActivity,
  "ACH-G6-049": TestingLabActivity,
  q_imo_50: DetectiveCaseFileActivity,
  "ACH-G6-050": DetectiveCaseFileActivity,
};

/**
 * Returns the bespoke interactive activity component for a question if registered,
 * or undefined if it falls back to standard question input mechanisms.
 */
export function getQuestionActivity(
  questionIdOrCode?: string
): ActivityComponentType | undefined {
  if (!questionIdOrCode) return undefined;
  return ACTIVITY_MAP[questionIdOrCode];
}

/**
 * Check if a question has a bespoke interactive activity registered.
 */
export function hasBespokeActivity(questionIdOrCode?: string): boolean {
  return !!getQuestionActivity(questionIdOrCode);
}
