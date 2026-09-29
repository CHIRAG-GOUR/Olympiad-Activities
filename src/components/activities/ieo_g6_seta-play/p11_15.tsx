"use client";

/* Q11–Q15 of SOF IEO Class 6 Set A — each question is a story world (see story.tsx). */
import { makeStory } from "./story";
import { SPECS_A } from "./specsA";
import { SPECS_B } from "./specsB";

export const Q11SteamingWaterActivity = makeStory(SPECS_A[11], "Q11SteamingWaterActivity");
export const Q12BusFareActivity = makeStory(SPECS_A[12], "Q12BusFareActivity");
export const Q13MissedCallActivity = makeStory(SPECS_B[13], "Q13MissedCallActivity");
export const Q14SaleDayActivity = makeStory(SPECS_B[14], "Q14SaleDayActivity");
export const Q15GatheringStormActivity = makeStory(SPECS_B[15], "Q15GatheringStormActivity");
