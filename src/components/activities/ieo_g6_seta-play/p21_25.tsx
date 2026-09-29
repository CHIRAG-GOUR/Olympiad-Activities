"use client";

/* Q21–Q25 of SOF IEO Class 6 Set A — each question is a story world (see story.tsx). */
import { makeStory } from "./story";
import { SPECS_B } from "./specsB";
import { SPECS_C } from "./specsC";

export const Q21PotholeRoadActivity = makeStory(SPECS_B[21], "Q21PotholeRoadActivity");
export const Q22NewHomeActivity = makeStory(SPECS_B[22], "Q22NewHomeActivity");
export const Q23ClosingTimeErrorActivity = makeStory(SPECS_B[23], "Q23ClosingTimeErrorActivity");
export const Q24WhoseHouseErrorActivity = makeStory(SPECS_B[24], "Q24WhoseHouseErrorActivity");
export const Q25DespiseTwinsActivity = makeStory(SPECS_C[25], "Q25DespiseTwinsActivity");
