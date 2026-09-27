"use client";

import dynamic from "next/dynamic";
import type { ActivityComponentType } from "../kit/types";

/**
 * Mini-game registry for exam 5 — 9th IMO Class 6 Set B (Question Paper 2). One game per
 * question, 50 in all (Q1, 4, 5, 10, 17, 24, 31, 40, 46 and 50 are 3D worlds). Games that
 * follow the printed paper's own figures live in b_paper.tsx; Q13, Q15 and Q23 reuse the
 * matching Paper 3 games. Questions live in src/data/imo6b2 (exam_imo_g6_setb2).
 */

const A: Record<string, ActivityComponentType> = {
  "01": dynamic(() => import("./b_logic").then((m) => m.B01SymbolScanner), { ssr: false }),
  "02": dynamic(() => import("./b_paper").then((m) => m.B02PositionShuffler), { ssr: false }),
  "03": dynamic(() => import("./b01_24").then((m) => m.B03CipherRoom), { ssr: false }),
  "04": dynamic(() => import("./b01_24").then((m) => m.B04PravinJourney), { ssr: false }),
  "05": dynamic(() => import("./b_paper").then((m) => m.B05NestedSeries), { ssr: false }),
  "06": dynamic(() => import("./b_logic").then((m) => m.B06NumberSwapRace), { ssr: false }),
  "07": dynamic(() => import("./b_paper").then((m) => m.B07LineFigureArena), { ssr: false }),
  "08": dynamic(() => import("./b_paper").then((m) => m.B08PatternReconstruction), { ssr: false }),
  "09": dynamic(() => import("./b01_24").then((m) => m.B09FamilyHouse), { ssr: false }),
  "10": dynamic(() => import("./b_logic").then((m) => m.B10Ecosystem), { ssr: false }),
  "11": dynamic(() => import("./b_paper").then((m) => m.B11HiddenShapeHunt), { ssr: false }),
  "12": dynamic(() => import("./b_logic").then((m) => m.B12NumberReactor), { ssr: false }),
  "13": dynamic(() => import("../imo6p3-play/p01_05").then((m) => m.Q02DotLabActivity), { ssr: false }),
  "14": dynamic(() => import("./b_logic").then((m) => m.B14WordFactory), { ssr: false }),
  "15": dynamic(() => import("../imo6p3-play/p06_10").then((m) => m.Q10ReflectionPoolActivity), { ssr: false }),
  "16": dynamic(() => import("./b_paper").then((m) => m.B16FractionPairs), { ssr: false }),
  "17": dynamic(() => import("./b_math").then((m) => m.B17FacePainter), { ssr: false }),
  "18": dynamic(() => import("./b01_24").then((m) => m.B18PenShop), { ssr: false }),
  "19": dynamic(() => import("./b_paper").then((m) => m.B19ShadedCorners), { ssr: false }),
  "20": dynamic(() => import("./b_paper").then((m) => m.B20CircleRegions), { ssr: false }),
  "21": dynamic(() => import("./b_paper").then((m) => m.B21LawsLab), { ssr: false }),
  "22": dynamic(() => import("./b01_24").then((m) => m.B22DivisibilityVault), { ssr: false }),
  "23": dynamic(() => import("../imo6p3-play/p16_20").then((m) => m.Q16PlaceValueVaultActivity), { ssr: false }),
  "24": dynamic(() => import("./b01_24").then((m) => m.B24IntegerBalance), { ssr: false }),
  "25": dynamic(() => import("./b_math").then((m) => m.B25PerimeterAnt), { ssr: false }),
  "26": dynamic(() => import("./b_math").then((m) => m.B26PercentBeaker), { ssr: false }),
  "27": dynamic(() => import("./b_math").then((m) => m.B27PeriodReader), { ssr: false }),
  "28": dynamic(() => import("./b_math").then((m) => m.B28TriangleForge), { ssr: false }),
  "29": dynamic(() => import("./b29_50").then((m) => m.B29FractionKitchen), { ssr: false }),
  "30": dynamic(() => import("./b_paper").then((m) => m.B30HcfExplorer), { ssr: false }),
  "31": dynamic(() => import("./b_math").then((m) => m.B31SolidInspector), { ssr: false }),
  "32": dynamic(() => import("./b_math").then((m) => m.B32MirrorTester), { ssr: false }),
  "33": dynamic(() => import("./b29_50").then((m) => m.B33RoadSimulator), { ssr: false }),
  "34": dynamic(() => import("./b_paper").then((m) => m.B34PolygonInspector), { ssr: false }),
  "35": dynamic(() => import("./b29_50").then((m) => m.B35DivisorCannon), { ssr: false }),
  "36": dynamic(() => import("./b_every").then((m) => m.B36CourtyardTiler), { ssr: false }),
  "37": dynamic(() => import("./b29_50").then((m) => m.B37CourierRun), { ssr: false }),
  "38": dynamic(() => import("./b29_50").then((m) => m.B38RiceWarehouse), { ssr: false }),
  "39": dynamic(() => import("./b_every").then((m) => m.B39BoxOffice), { ssr: false }),
  "40": dynamic(() => import("./b29_50").then((m) => m.B40BellTower), { ssr: false }),
  "41": dynamic(() => import("./b29_50").then((m) => m.B41ChocolateBoxes), { ssr: false }),
  "42": dynamic(() => import("./b29_50").then((m) => m.B42BoatJourney), { ssr: false }),
  "43": dynamic(() => import("./b29_50").then((m) => m.B43ShoppingGame), { ssr: false }),
  "44": dynamic(() => import("./b29_50").then((m) => m.B44FenceBuilder), { ssr: false }),
  "45": dynamic(() => import("./b29_50").then((m) => m.B45SugarWarehouse), { ssr: false }),
  "46": dynamic(() => import("./b_every").then((m) => m.B46GrowingRectangle), { ssr: false }),
  "47": dynamic(() => import("./b_paper").then((m) => m.B47ClaimChecker), { ssr: false }),
  "48": dynamic(() => import("./b_paper").then((m) => m.B48DivisibilityTester), { ssr: false }),
  "49": dynamic(() => import("./b_every").then((m) => m.B49GeometryMatchLab), { ssr: false }),
  "50": dynamic(() => import("./b29_50").then((m) => m.B50DataObservatory), { ssr: false }),
};

export const IMO6B2_ACTIVITY_MAP: Record<string, ActivityComponentType> = Object.fromEntries(
  Object.entries(A).flatMap(([n, c]) => [
    [`q_imo6b2_${n}`, c],
    [`IMO6B2-Q${n}`, c],
  ])
);
