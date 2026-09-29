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
  Q13StormWarningActivity,
  Q14ParkPathActivity,
  Q15TrainPlatformActivity,
} from "./p11_15";
import {
  Q16OldPlaygroundActivity,
  Q17BeachMemoryActivity,
  Q18BotanicalHerbariumActivity,
  Q19BenchDurationActivity,
  Q20LuckyGiftActivity,
} from "./p16_20";
import {
  Q21ArtStudioActivity,
  Q22CakeRegretActivity,
  Q23QuietSoundActivity,
  Q24SchoolDisciplineActivity,
  Q25MarineCreaturesActivity,
} from "./p21_25";
import {
  Q26SpellingInspectorActivity,
  Q27PassageTitleActivity,
  Q28HistoricalTimelineActivity,
  Q29EuropeanRewildingActivity,
  Q30FurHuntingActivity,
} from "./p26_30";
import {
  Q31BeaverAnatomyActivity,
  Q32PatagoniaEcoImpactActivity,
  Q33DamFunctionActivity,
  Q34GoaRelocationActivity,
  Q35HospitalityInviteActivity,
} from "./p31_35";
import {
  Q36NewHouseShowroomActivity,
  Q37SchoolWalkActivity,
  Q38DualSchoolActivity,
  Q39PartyPlanningActivity,
  Q40FoodPrepActivity,
} from "./p36_40";
import {
  Q41BruisedKneeActivity,
  Q42CuriousNeighbourActivity,
  Q43DinnerResponseActivity,
  Q44StitchInTimeActivity,
  Q45NegativeAgreementActivity,
} from "./p41_45";
import {
  Q46RidiculousBikeActivity,
  Q47SharedHostelKitchenActivity,
  Q48SwimmingPropulsionActivity,
  Q49AdvancedSpellingActivity,
  Q50FavorRepaymentActivity,
} from "./p46_50";

/**
 * Activity registry for SOF International English Olympiad (IEO) Class 6 Set A.
 * Maps both internal IDs (ieo_g6_interactive_q01) and question codes (IEO-G6-INT-Q01).
 */
export const IEO_INTERACTIVE_G6_PLAY_ACTIVITY_MAP: Record<string, ActivityComponentType> = {
  // Q1 - Q5
  ieo_g6_interactive_q01: Q01MorningRoutineActivity,
  "IEO-G6-INT-Q01": Q01MorningRoutineActivity,
  ieo_g6_interactive_q02: Q02PackingRobotActivity,
  "IEO-G6-INT-Q02": Q02PackingRobotActivity,
  ieo_g6_interactive_q03: Q03MemoryKitchenActivity,
  "IEO-G6-INT-Q03": Q03MemoryKitchenActivity,
  ieo_g6_interactive_q04: Q04LanguageMapActivity,
  "IEO-G6-INT-Q04": Q04LanguageMapActivity,
  ieo_g6_interactive_q05: Q05BusStopTimeActivity,
  "IEO-G6-INT-Q05": Q05BusStopTimeActivity,

  // Q6 - Q10
  ieo_g6_interactive_q06: Q06RestaurantTimelineActivity,
  "IEO-G6-INT-Q06": Q06RestaurantTimelineActivity,
  ieo_g6_interactive_q07: Q07MagicBagActivity,
  "IEO-G6-INT-Q07": Q07MagicBagActivity,
  ieo_g6_interactive_q08: Q08MangoDetectiveActivity,
  "IEO-G6-INT-Q08": Q08MangoDetectiveActivity,
  ieo_g6_interactive_q09: Q09HandwashingLabActivity,
  "IEO-G6-INT-Q09": Q09HandwashingLabActivity,
  ieo_g6_interactive_q10: Q10GeographyDiscoveryActivity,
  "IEO-G6-INT-Q10": Q10GeographyDiscoveryActivity,

  // Q11 - Q15
  ieo_g6_interactive_q11: Q11IceCreamShopActivity,
  "IEO-G6-INT-Q11": Q11IceCreamShopActivity,
  ieo_g6_interactive_q12: Q12CricketMemoryActivity,
  "IEO-G6-INT-Q12": Q12CricketMemoryActivity,
  ieo_g6_interactive_q13: Q13StormWarningActivity,
  "IEO-G6-INT-Q13": Q13StormWarningActivity,
  ieo_g6_interactive_q14: Q14ParkPathActivity,
  "IEO-G6-INT-Q14": Q14ParkPathActivity,
  ieo_g6_interactive_q15: Q15TrainPlatformActivity,
  "IEO-G6-INT-Q15": Q15TrainPlatformActivity,

  // Q16 - Q20
  ieo_g6_interactive_q16: Q16OldPlaygroundActivity,
  "IEO-G6-INT-Q16": Q16OldPlaygroundActivity,
  ieo_g6_interactive_q17: Q17BeachMemoryActivity,
  "IEO-G6-INT-Q17": Q17BeachMemoryActivity,
  ieo_g6_interactive_q18: Q18BotanicalHerbariumActivity,
  "IEO-G6-INT-Q18": Q18BotanicalHerbariumActivity,
  ieo_g6_interactive_q19: Q19BenchDurationActivity,
  "IEO-G6-INT-Q19": Q19BenchDurationActivity,
  ieo_g6_interactive_q20: Q20LuckyGiftActivity,
  "IEO-G6-INT-Q20": Q20LuckyGiftActivity,

  // Q21 - Q25
  ieo_g6_interactive_q21: Q21ArtStudioActivity,
  "IEO-G6-INT-Q21": Q21ArtStudioActivity,
  ieo_g6_interactive_q22: Q22CakeRegretActivity,
  "IEO-G6-INT-Q22": Q22CakeRegretActivity,
  ieo_g6_interactive_q23: Q23QuietSoundActivity,
  "IEO-G6-INT-Q23": Q23QuietSoundActivity,
  ieo_g6_interactive_q24: Q24SchoolDisciplineActivity,
  "IEO-G6-INT-Q24": Q24SchoolDisciplineActivity,
  ieo_g6_interactive_q25: Q25MarineCreaturesActivity,
  "IEO-G6-INT-Q25": Q25MarineCreaturesActivity,

  // Q26 - Q30
  ieo_g6_interactive_q26: Q26SpellingInspectorActivity,
  "IEO-G6-INT-Q26": Q26SpellingInspectorActivity,
  ieo_g6_interactive_q27: Q27PassageTitleActivity,
  "IEO-G6-INT-Q27": Q27PassageTitleActivity,
  ieo_g6_interactive_q28: Q28HistoricalTimelineActivity,
  "IEO-G6-INT-Q28": Q28HistoricalTimelineActivity,
  ieo_g6_interactive_q29: Q29EuropeanRewildingActivity,
  "IEO-G6-INT-Q29": Q29EuropeanRewildingActivity,
  ieo_g6_interactive_q30: Q30FurHuntingActivity,
  "IEO-G6-INT-Q30": Q30FurHuntingActivity,

  // Q31 - Q35
  ieo_g6_interactive_q31: Q31BeaverAnatomyActivity,
  "IEO-G6-INT-Q31": Q31BeaverAnatomyActivity,
  ieo_g6_interactive_q32: Q32PatagoniaEcoImpactActivity,
  "IEO-G6-INT-Q32": Q32PatagoniaEcoImpactActivity,
  ieo_g6_interactive_q33: Q33DamFunctionActivity,
  "IEO-G6-INT-Q33": Q33DamFunctionActivity,
  ieo_g6_interactive_q34: Q34GoaRelocationActivity,
  "IEO-G6-INT-Q34": Q34GoaRelocationActivity,
  ieo_g6_interactive_q35: Q35HospitalityInviteActivity,
  "IEO-G6-INT-Q35": Q35HospitalityInviteActivity,

  // Q36 - Q40
  ieo_g6_interactive_q36: Q36NewHouseShowroomActivity,
  "IEO-G6-INT-Q36": Q36NewHouseShowroomActivity,
  ieo_g6_interactive_q37: Q37SchoolWalkActivity,
  "IEO-G6-INT-Q37": Q37SchoolWalkActivity,
  ieo_g6_interactive_q38: Q38DualSchoolActivity,
  "IEO-G6-INT-Q38": Q38DualSchoolActivity,
  ieo_g6_interactive_q39: Q39PartyPlanningActivity,
  "IEO-G6-INT-Q39": Q39PartyPlanningActivity,
  ieo_g6_interactive_q40: Q40FoodPrepActivity,
  "IEO-G6-INT-Q40": Q40FoodPrepActivity,

  // Q41 - Q45
  ieo_g6_interactive_q41: Q41BruisedKneeActivity,
  "IEO-G6-INT-Q41": Q41BruisedKneeActivity,
  ieo_g6_interactive_q42: Q42CuriousNeighbourActivity,
  "IEO-G6-INT-Q42": Q42CuriousNeighbourActivity,
  ieo_g6_interactive_q43: Q43DinnerResponseActivity,
  "IEO-G6-INT-Q43": Q43DinnerResponseActivity,
  ieo_g6_interactive_q44: Q44StitchInTimeActivity,
  "IEO-G6-INT-Q44": Q44StitchInTimeActivity,
  ieo_g6_interactive_q45: Q45NegativeAgreementActivity,
  "IEO-G6-INT-Q45": Q45NegativeAgreementActivity,

  // Q46 - Q50
  ieo_g6_interactive_q46: Q46RidiculousBikeActivity,
  "IEO-G6-INT-Q46": Q46RidiculousBikeActivity,
  ieo_g6_interactive_q47: Q47SharedHostelKitchenActivity,
  "IEO-G6-INT-Q47": Q47SharedHostelKitchenActivity,
  ieo_g6_interactive_q48: Q48SwimmingPropulsionActivity,
  "IEO-G6-INT-Q48": Q48SwimmingPropulsionActivity,
  ieo_g6_interactive_q49: Q49AdvancedSpellingActivity,
  "IEO-G6-INT-Q49": Q49AdvancedSpellingActivity,
  ieo_g6_interactive_q50: Q50FavorRepaymentActivity,
  "IEO-G6-INT-Q50": Q50FavorRepaymentActivity,
};
