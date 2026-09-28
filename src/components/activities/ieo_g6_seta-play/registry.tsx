"use client";

import type { ActivityComponentType } from "../kit/types";
import {
  Q01MorningRoutineActivity,
  Q02PackingRobotActivity,
  Q03MemoryKitchenActivity,
  Q04LanguageMapActivity,
  Q05BusStopTimeActivity,
} from "./p01_05";
import {
  Q06RestaurantTimelineActivity,
  Q07MagicBagActivity,
  Q08MangoDetectiveActivity,
  Q09HandwashingLabActivity,
  Q10GeographyDiscoveryActivity,
} from "./p06_10";
import {
  Q11IceCreamShopActivity,
  Q12CricketMemoryActivity,
  Q13StormRescueActivity,
  Q14ParkExplorerActivity,
  Q15WaitingGameActivity,
} from "./p11_15";
import {
  Q16OldPlaygroundActivity,
  Q17BeachMemoryActivity,
  Q18BotanicalLabActivity,
  Q19TimeLapseBenchActivity,
  Q20GiftDeliveryActivity,
} from "./p16_20";
import {
  Q21ArtRestorationActivity,
  Q22CakeChallengeActivity,
  Q23SoundDetectorActivity,
  Q24DetentionChamberActivity,
  Q25OceanExplorerActivity,
} from "./p21_25";
import {
  Q26SpellingLockActivity,
  Q27BeaverExpeditionActivity,
  Q28SouthAmericaTimelineActivity,
  Q29ConservationMissionActivity,
  Q30FurTradingInvestigationActivity,
} from "./p26_30";
import {
  Q31BeaverBodyScannerActivity,
  Q32SouthAmericanEcologyActivity,
  Q33DamBuilderActivity,
  Q34MovingDayActivity,
  Q35FriendshipVisitsActivity,
} from "./p31_35";
import {
  Q36NewHouseShowroomActivity,
  Q37WalkToSchoolActivity,
  Q38NewSchoolActivity,
  Q39PartyPlannerActivity,
  Q40PartyPreparationActivity,
} from "./p36_40";
import {
  Q41AccidentResponseActivity,
  Q42NoseyCharacterActivity,
  Q43DinnerInvitationActivity,
  Q44ProverbWorkshopActivity,
  Q45AgreementDialogueActivity,
} from "./p41_45";
import {
  Q46RidiculousBikeActivity,
  Q47CommunalKitchenActivity,
  Q48SwimmingPropulsionActivity,
  Q49SpellingDetectiveActivity,
  Q50RepayingFavourActivity,
} from "./p46_50";

/**
 * Activity registry for SOF International English Olympiad (IEO) Class 6 Set A.
 * Maps both internal IDs (ieo_g6_seta_q01) and question codes (IEO-G6-SETA-Q01).
 */
export const IEO_G6_SETA_PLAY_ACTIVITY_MAP: Record<string, ActivityComponentType> = {
  // Q1 - Q5
  ieo_g6_seta_q01: Q01MorningRoutineActivity,
  "IEO-G6-SETA-Q01": Q01MorningRoutineActivity,
  ieo_g6_seta_q02: Q02PackingRobotActivity,
  "IEO-G6-SETA-Q02": Q02PackingRobotActivity,
  ieo_g6_seta_q03: Q03MemoryKitchenActivity,
  "IEO-G6-SETA-Q03": Q03MemoryKitchenActivity,
  ieo_g6_seta_q04: Q04LanguageMapActivity,
  "IEO-G6-SETA-Q04": Q04LanguageMapActivity,
  ieo_g6_seta_q05: Q05BusStopTimeActivity,
  "IEO-G6-SETA-Q05": Q05BusStopTimeActivity,

  // Q6 - Q10
  ieo_g6_seta_q06: Q06RestaurantTimelineActivity,
  "IEO-G6-SETA-Q06": Q06RestaurantTimelineActivity,
  ieo_g6_seta_q07: Q07MagicBagActivity,
  "IEO-G6-SETA-Q07": Q07MagicBagActivity,
  ieo_g6_seta_q08: Q08MangoDetectiveActivity,
  "IEO-G6-SETA-Q08": Q08MangoDetectiveActivity,
  ieo_g6_seta_q09: Q09HandwashingLabActivity,
  "IEO-G6-SETA-Q09": Q09HandwashingLabActivity,
  ieo_g6_seta_q10: Q10GeographyDiscoveryActivity,
  "IEO-G6-SETA-Q10": Q10GeographyDiscoveryActivity,

  // Q11 - Q15
  ieo_g6_seta_q11: Q11IceCreamShopActivity,
  "IEO-G6-SETA-Q11": Q11IceCreamShopActivity,
  ieo_g6_seta_q12: Q12CricketMemoryActivity,
  "IEO-G6-SETA-Q12": Q12CricketMemoryActivity,
  ieo_g6_seta_q13: Q13StormRescueActivity,
  "IEO-G6-SETA-Q13": Q13StormRescueActivity,
  ieo_g6_seta_q14: Q14ParkExplorerActivity,
  "IEO-G6-SETA-Q14": Q14ParkExplorerActivity,
  ieo_g6_seta_q15: Q15WaitingGameActivity,
  "IEO-G6-SETA-Q15": Q15WaitingGameActivity,

  // Q16 - Q20
  ieo_g6_seta_q16: Q16OldPlaygroundActivity,
  "IEO-G6-SETA-Q16": Q16OldPlaygroundActivity,
  ieo_g6_seta_q17: Q17BeachMemoryActivity,
  "IEO-G6-SETA-Q17": Q17BeachMemoryActivity,
  ieo_g6_seta_q18: Q18BotanicalLabActivity,
  "IEO-G6-SETA-Q18": Q18BotanicalLabActivity,
  ieo_g6_seta_q19: Q19TimeLapseBenchActivity,
  "IEO-G6-SETA-Q19": Q19TimeLapseBenchActivity,
  ieo_g6_seta_q20: Q20GiftDeliveryActivity,
  "IEO-G6-SETA-Q20": Q20GiftDeliveryActivity,

  // Q21 - Q25
  ieo_g6_seta_q21: Q21ArtRestorationActivity,
  "IEO-G6-SETA-Q21": Q21ArtRestorationActivity,
  ieo_g6_seta_q22: Q22CakeChallengeActivity,
  "IEO-G6-SETA-Q22": Q22CakeChallengeActivity,
  ieo_g6_seta_q23: Q23SoundDetectorActivity,
  "IEO-G6-SETA-Q23": Q23SoundDetectorActivity,
  ieo_g6_seta_q24: Q24DetentionChamberActivity,
  "IEO-G6-SETA-Q24": Q24DetentionChamberActivity,
  ieo_g6_seta_q25: Q25OceanExplorerActivity,
  "IEO-G6-SETA-Q25": Q25OceanExplorerActivity,

  // Q26 (Spelling)
  ieo_g6_seta_q26: Q26SpellingLockActivity,
  "IEO-G6-SETA-Q26": Q26SpellingLockActivity,

  // Q27 - Q33 (Reading)
  ieo_g6_seta_q27: Q27BeaverExpeditionActivity,
  "IEO-G6-SETA-Q27": Q27BeaverExpeditionActivity,
  ieo_g6_seta_q28: Q28SouthAmericaTimelineActivity,
  "IEO-G6-SETA-Q28": Q28SouthAmericaTimelineActivity,
  ieo_g6_seta_q29: Q29ConservationMissionActivity,
  "IEO-G6-SETA-Q29": Q29ConservationMissionActivity,
  ieo_g6_seta_q30: Q30FurTradingInvestigationActivity,
  "IEO-G6-SETA-Q30": Q30FurTradingInvestigationActivity,
  ieo_g6_seta_q31: Q31BeaverBodyScannerActivity,
  "IEO-G6-SETA-Q31": Q31BeaverBodyScannerActivity,
  ieo_g6_seta_q32: Q32SouthAmericanEcologyActivity,
  "IEO-G6-SETA-Q32": Q32SouthAmericanEcologyActivity,
  ieo_g6_seta_q33: Q33DamBuilderActivity,
  "IEO-G6-SETA-Q33": Q33DamBuilderActivity,

  // Q34 - Q40 (Email / Contextual Vocabulary)
  ieo_g6_seta_q34: Q34MovingDayActivity,
  "IEO-G6-SETA-Q34": Q34MovingDayActivity,
  ieo_g6_seta_q35: Q35FriendshipVisitsActivity,
  "IEO-G6-SETA-Q35": Q35FriendshipVisitsActivity,
  ieo_g6_seta_q36: Q36NewHouseShowroomActivity,
  "IEO-G6-SETA-Q36": Q36NewHouseShowroomActivity,
  ieo_g6_seta_q37: Q37WalkToSchoolActivity,
  "IEO-G6-SETA-Q37": Q37WalkToSchoolActivity,
  ieo_g6_seta_q38: Q38NewSchoolActivity,
  "IEO-G6-SETA-Q38": Q38NewSchoolActivity,
  ieo_g6_seta_q39: Q39PartyPlannerActivity,
  "IEO-G6-SETA-Q39": Q39PartyPlannerActivity,
  ieo_g6_seta_q40: Q40PartyPreparationActivity,
  "IEO-G6-SETA-Q40": Q40PartyPreparationActivity,

  // Q41 - Q45 (Spoken & Written Expression)
  ieo_g6_seta_q41: Q41AccidentResponseActivity,
  "IEO-G6-SETA-Q41": Q41AccidentResponseActivity,
  ieo_g6_seta_q42: Q42NoseyCharacterActivity,
  "IEO-G6-SETA-Q42": Q42NoseyCharacterActivity,
  ieo_g6_seta_q43: Q43DinnerInvitationActivity,
  "IEO-G6-SETA-Q43": Q43DinnerInvitationActivity,
  ieo_g6_seta_q44: Q44ProverbWorkshopActivity,
  "IEO-G6-SETA-Q44": Q44ProverbWorkshopActivity,
  ieo_g6_seta_q45: Q45AgreementDialogueActivity,
  "IEO-G6-SETA-Q45": Q45AgreementDialogueActivity,

  // Q46 - Q50 (Achievers Section · 3 Marks)
  ieo_g6_seta_q46: Q46RidiculousBikeActivity,
  "IEO-G6-SETA-Q46": Q46RidiculousBikeActivity,
  ieo_g6_seta_q47: Q47CommunalKitchenActivity,
  "IEO-G6-SETA-Q47": Q47CommunalKitchenActivity,
  ieo_g6_seta_q48: Q48SwimmingPropulsionActivity,
  "IEO-G6-SETA-Q48": Q48SwimmingPropulsionActivity,
  ieo_g6_seta_q49: Q49SpellingDetectiveActivity,
  "IEO-G6-SETA-Q49": Q49SpellingDetectiveActivity,
  ieo_g6_seta_q50: Q50RepayingFavourActivity,
  "IEO-G6-SETA-Q50": Q50RepayingFavourActivity,
};
