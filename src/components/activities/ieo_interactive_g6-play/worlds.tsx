"use client";

import React from "react";
import { Avatar3D, type Avatar3DProps } from "../ieo_g6_seta-play/avatar3D";
import type { WorldProps } from "../ieo_g6_seta-play/story";
import {
  AcousticSoundLab3D, AirportLuggage3D, ArtStudio3D, BeachSeaside3D, BeaverHabitat3D, BikeWorkshop3D, BusStopShelter3D,
  CafeBistro3D, CarRideDropoff3D, ChefKitchen3D, ClassroomAuditorium3D, CommunalKitchen3D, CricketPitch3D, DiningTable3D,
  GiftUnboxing3D, GlacierExpedition3D, GoaVilla3D, GrandBanquetHall3D, Herbarium3D, IceCreamParlour3D, LanguageGlobe3D,
  LexicalVault3D, MarineReef3D, MedicalInfirmary3D, MountainSummit3D, OpticalScanner3D, ParkBenchClock3D, ParkTrail3D,
  PlaygroundPark3D, SuburbanGarden3D, SwimmingPool3D, TrailGreeting3D, TrainPlatform3D, VillaVerandah3D, WeatherStation3D,
  AbsurdBicycle3D,
} from "./scenes";

/* ══════════════════════════════════════════════════════════════════════
   Worlds for the Interactive Master Edition (IEO Class 6, paper 1).
   Each is one of the rebuilt scenes plus the characters its question needs.
   A character marked `onFill` changes what it is doing once the sentence
   is complete — the same change whichever tile completed it.
   ══════════════════════════════════════════════════════════════════════ */

type Cast = Avatar3DProps & { onFill?: Avatar3DProps["pose"] };
type Scene = React.ComponentType<{ position?: [number, number, number] }>;

function world(Scene: Scene, cast: Cast[] = []) {
  function W({ filled }: WorldProps) {
    return (
      <group>
        <Scene />
        {cast.map(({ onFill, pose, ...a }, i) => (
          <Avatar3D key={i} {...a} pose={filled && onFill ? onFill : pose} />
        ))}
      </group>
    );
  }
  return W;
}

const tilt = (y: number): [number, number, number] => [0, y, 0];

export const WORLDS: Record<number, React.ComponentType<WorldProps>> = {
  1: world(DiningTable3D),
  2: world(AirportLuggage3D),
  3: world(ChefKitchen3D),
  4: world(LanguageGlobe3D),
  5: world(BusStopShelter3D),
  6: world(ChefKitchen3D),
  7: world(AirportLuggage3D),
  8: world(Herbarium3D),
  9: world(OpticalScanner3D),
  10: world(LanguageGlobe3D),
  11: world(IceCreamParlour3D, [{ position: [0.8, 0, 0.4], rotation: tilt(-0.6), shirtColor: "#3B82F6", pose: "holding_cone", hairStyle: "cap" }]),
  12: world(CricketPitch3D),
  13: world(WeatherStation3D),
  14: world(ParkTrail3D),
  15: world(TrainPlatform3D, [{ position: [-0.4, 0.5, 0.4], rotation: tilt(Math.PI), pose: "walking", shirtColor: "#EC4899", hairStyle: "ponytail", hasBackpack: true, backpackColor: "#22C55E" }]),
  16: world(PlaygroundPark3D),
  17: world(BeachSeaside3D),
  18: world(Herbarium3D),
  19: world(ParkBenchClock3D),
  20: world(GiftUnboxing3D),
  21: world(ArtStudio3D, [{ position: [0.9, 0, 0.4], rotation: tilt(-0.6), shirtColor: "#7C3AED", hairStyle: "beret", pose: "pointing", onFill: "gesturing" }]),
  22: world(GrandBanquetHall3D),
  23: world(AcousticSoundLab3D),
  24: world(ClassroomAuditorium3D, [{ position: [0.9, 0, -0.2], rotation: tilt(-0.4), shirtColor: "#F97316", hairStyle: "short", pose: "standing", expression: "worried", onFill: "tired" }]),
  25: world(MarineReef3D),
  26: world(LexicalVault3D, [{ position: [0.9, 0, 0.4], rotation: tilt(-0.6), shirtColor: "#E11D48", hairStyle: "short", pose: "reading", onFill: "pointing" }]),
  27: world(BeaverHabitat3D, [{ position: [1.4, 0, 0.4], rotation: tilt(-0.7), shirtColor: "#059669", hairStyle: "cap", pose: "pointing" }]),
  28: world(GlacierExpedition3D, [{ position: [0.8, 0, 0.5], rotation: tilt(-0.6), shirtColor: "#2563EB", hairStyle: "cap", hasBackpack: true, backpackColor: "#F59E0B", pose: "standing" }]),
  29: world(BeaverHabitat3D, [{ position: [-1.2, 0, 0.4], rotation: tilt(0.7), shirtColor: "#0D9488", hairStyle: "ponytail", pose: "gesturing" }]),
  30: world(BeaverHabitat3D, [{ position: [1.1, 0, 0.4], rotation: tilt(-0.6), shirtColor: "#D97706", hairStyle: "bun", pose: "thinking" }]),
  31: world(BeaverHabitat3D, [{ position: [1.2, 0, 0.4], rotation: tilt(-0.6), shirtColor: "#D97706", hairStyle: "cap", pose: "kneeling", hasGlasses: true }]),
  32: world(GlacierExpedition3D, [{ position: [0.7, 0, 0.4], rotation: tilt(-0.6), shirtColor: "#DC2626", expression: "worried", pose: "pointing" }]),
  33: world(BeaverHabitat3D, [{ position: [-1.3, 0, 0.5], rotation: tilt(0.7), shirtColor: "#059669", hairStyle: "short", pose: "gesturing" }]),
  34: world(GoaVilla3D, [{ position: [0.8, 0, 0.5], rotation: tilt(-0.6), shirtColor: "#0284C7", hairStyle: "cap", pose: "carrying", onFill: "gesturing" }]),
  35: world(VillaVerandah3D, [{ position: [0.8, 0, 0.4], rotation: tilt(-0.6), shirtColor: "#059669", hairStyle: "ponytail", pose: "gesturing" }]),
  36: world(GoaVilla3D, [{ position: [1.1, 0, 0.4], rotation: tilt(-0.6), shirtColor: "#7C3AED", hairStyle: "ponytail", pose: "pointing", onFill: "jumping" }]),
  37: world(TrailGreeting3D),
  38: world(ClassroomAuditorium3D, [
    { position: [-0.5, 0, 0.4], rotation: tilt(0.4), shirtColor: "#2563EB", hairStyle: "short", hasBackpack: true, backpackColor: "#F59E0B", pose: "standing", onFill: "gesturing" },
    { position: [0.5, 0, 0.4], rotation: tilt(-0.4), shirtColor: "#EC4899", hairStyle: "ponytail", hasBackpack: true, backpackColor: "#8B5CF6", pose: "standing", onFill: "gesturing" },
  ]),
  39: world(GrandBanquetHall3D, [{ position: [1.0, 0, 0.4], rotation: tilt(-0.6), shirtColor: "#EC4899", hairStyle: "bun", pose: "phone", onFill: "gesturing" }]),
  40: world(DiningTable3D, [{ position: [-1.0, 0, 0.3], rotation: tilt(0.6), shirtColor: "#EF4444", hairStyle: "bun", pose: "carrying" }]),
  41: world(MedicalInfirmary3D, [
    { position: [-0.8, 0, 0.4], rotation: tilt(0.6), shirtColor: "#9333EA", hairStyle: "bun", pose: "kneeling" },
    { position: [0.7, 0, 0.3], rotation: tilt(-0.6), shirtColor: "#2563EB", hairStyle: "short", pose: "sitting", expression: "worried" },
  ]),
  42: world(SuburbanGarden3D, [
    { position: [-0.8, 0, 0.4], rotation: tilt(0.6), shirtColor: "#D97706", hairStyle: "short", pose: "gesturing" },
    { position: [0.9, 0, 0.3], rotation: tilt(-0.6), shirtColor: "#EC4899", hairStyle: "ponytail", pose: "pointing", onFill: "shrugging" },
  ]),
  43: world(CafeBistro3D, [
    { position: [-0.9, 0, 0.4], rotation: tilt(0.6), shirtColor: "#6366F1", hairStyle: "short", pose: "sitting" },
    { position: [0.9, 0, 0.4], rotation: tilt(-0.6), shirtColor: "#A855F7", hairStyle: "bun", pose: "sitting", onFill: "sitting_eating" },
  ]),
  44: world(BikeWorkshop3D, [{ position: [1.1, 0, 0.4], rotation: tilt(-0.6), shirtColor: "#2563EB", hairStyle: "cap", pose: "standing", onFill: "kneeling" }]),
  45: world(MountainSummit3D, [
    { position: [-0.8, 0, 0.4], rotation: tilt(0.6), shirtColor: "#0284C7", hairStyle: "cap", pose: "sitting", expression: "worried" },
    { position: [0.8, 0, 0.4], rotation: tilt(-0.6), shirtColor: "#EC4899", hairStyle: "ponytail", pose: "sitting", expression: "worried" },
  ]),
  46: world(AbsurdBicycle3D, [{ position: [-0.3, 0.02, 0], rotation: tilt(Math.PI / 2), shirtColor: "#3B82F6", hairStyle: "cap", pose: "biking", expression: "worried" }]),
  47: world(CommunalKitchen3D, [
    { position: [-0.9, 0, 0.4], rotation: tilt(0.6), shirtColor: "#0D9488", hairStyle: "short", pose: "gesturing" },
    { position: [0.9, 0, 0.4], rotation: tilt(-0.6), shirtColor: "#8B5CF6", hairStyle: "bun", pose: "holding_cup" },
  ]),
  48: world(SwimmingPool3D, [{ position: [0, -0.1, 0], rotation: tilt(Math.PI / 2), shirtColor: "#0284C7", hairStyle: "swimcap", pose: "swimming" }]),
  49: world(LexicalVault3D, [{ position: [1.1, 0, 0.4], rotation: tilt(-0.6), shirtColor: "#E11D48", hairStyle: "short", pose: "reading", onFill: "pointing" }]),
  50: world(CarRideDropoff3D, [
    { position: [-0.8, 0, 0.4], rotation: tilt(0.6), shirtColor: "#2563EB", hairStyle: "short", pose: "gesturing" },
    { position: [1.2, 0, 0.3], rotation: tilt(-0.6), shirtColor: "#EC4899", hairStyle: "ponytail", pose: "standing", onFill: "shrugging" },
  ]),
};
