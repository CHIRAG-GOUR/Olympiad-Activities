"use client";

/* Q1–Q5 of the IEO Interactive Master Edition — story worlds (see ../ieo_g6_seta-play/story.tsx). */
import { makeStory } from "../ieo_g6_seta-play/story";
import { SPECS } from "./specs";

export const Q01BreakfastBeforeWorkActivity = makeStory(SPECS[1], "Q01BreakfastBeforeWorkActivity");
export const Q02PackingForTheHolidayActivity = makeStory(SPECS[2], "Q02PackingForTheHolidayActivity");
export const Q03HelpingInTheKitchenActivity = makeStory(SPECS[3], "Q03HelpingInTheKitchenActivity");
export const Q04TheLanguageGlobeActivity = makeStory(SPECS[4], "Q04TheLanguageGlobeActivity");
export const Q05WaitingForTheBusActivity = makeStory(SPECS[5], "Q05WaitingForTheBusActivity");
