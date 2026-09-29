import { Castle, Flame, Home, Scale, SpellCheck } from "lucide-react";
import { IEO_READING_PASSAGE_CASEY, IEO_READING_PASSAGE_DREAM_HOUSE } from "@/data/ieo_g6_seta";
import type { StorySpec } from "./story";
import { CaseyWorld, DreamCastleWorld, FanTheFireWorld, makeBalanceWorld, TinyLiftWorld } from "./worldsC";

const SameWorld = makeBalanceWorld({ relation: "same", crate: "#22C55E", mood: "happy" });
const OppositeWorld = makeBalanceWorld({ relation: "opposite", crate: "#F97316", mood: "neutral" });

const balance = (word: string, relation: "same" | "opposite", hints: string[]): StorySpec => ({
  title: relation === "same" ? "Word Twins" : "Opposite Balance",
  mission:
    relation === "same"
      ? `“${word}” sits on the left pan. Drop the word that means the SAME onto the right pan.`
      : `“${word}” sits on the left pan. Drop the word that means the OPPOSITE onto the right pan.`,
  icon: Scale,
  World: relation === "same" ? SameWorld : OppositeWorld,
  bubbleAt: [0, 2.1, -0.6],
  mech: { kind: "fill", template: relation === "same" ? `${word} means the same as ___.` : `${word} is the opposite of ___.` },
  hints,
});

const dream = (prompt: string, template: string, hints: string[]): StorySpec => ({
  title: "My Dream House",
  mission: "Explore the castle, read the passage, mark the line that proves your answer, then drop the answer card.",
  icon: Castle,
  World: DreamCastleWorld,
  camera: { position: [0, 2.6, 5.6], fov: 45 },
  bubbleAt: [-1.2, 2.1, 0.8],
  mech: { kind: "reading", passage: IEO_READING_PASSAGE_DREAM_HOUSE, prompt, template },
  hints,
});

const casey = (prompt: string, template: string, hints: string[]): StorySpec => ({
  title: "Casey and Margaret",
  mission: "Visit Casey's street, read the passage, mark the line that proves your answer, then drop the answer card.",
  icon: Home,
  World: CaseyWorld,
  camera: { position: [0, 2.6, 5.4], fov: 45 },
  mech: { kind: "reading", passage: IEO_READING_PASSAGE_CASEY, prompt, template },
  hints,
});

/* Q25–Q40 */
export const SPECS_C: Record<number, StorySpec> = {
  25: balance("Despise", "same", ["To despise something is to feel very strongly against it.", "Which tile is a strong negative feeling?"]),
  26: balance("Sanitary", "same", ["Sanitary is used about hospitals, kitchens and bathrooms.", "Which tile describes a place with no germs or dirt?"]),
  27: balance("Peril", "opposite", ["Peril means serious danger.", "What is the opposite of being in danger?"]),
  28: balance("Lush", "opposite", ["A lush garden is thick with green, healthy plants.", "Which tile describes land where almost nothing grows?"]),
  29: {
    title: "The Tiny Lift",
    mission: "He is scared of small spaces. Type the name of his fear on the spelling machine.",
    icon: SpellCheck,
    World: TinyLiftWorld,
    bubbleAt: [-0.9, 2.1, -0.9],
    mech: { kind: "spell", meaning: "to be afraid of small spaces" },
    hints: ["It comes from Latin “claustrum” — a shut-in place.", "Say it slowly: claus-tro-pho-bi-a."],
  },
  30: {
    title: "Fanning the Flames",
    mission: "Fanning the campfire makes things worse. Type the word that means ‘to make things worse’.",
    icon: Flame,
    World: FanTheFireWorld,
    bubbleAt: [-1.1, 2.1, 0.3],
    mech: { kind: "spell", meaning: "to make things worse" },
    hints: ["It is built on the Latin “acer” — sharp or bitter.", "Say it slowly: ex-A-cer-bate. Where does the “c” go?"],
  },
  31: dream("Choose the best title or heading for the passage.", "A good title for the passage: ___", ["The whole passage is about a home the writer imagines, not the one they live in.", "Mark a line that shows what the house is."]),
  32: dream("What is the problem of buying a house with a sea view?", "The problem with a sea view is ___.", ["Look in the first paragraph, near “sea view”.", "What does “well beyond my reach” refer to?"]),
  33: dream("The writer wants wind turbines for the house to ______.", "The writer wants wind turbines for the house to ___.", ["Look at the sentence just before the list of turbines and panels.", "What is the writer “quite keen on”?"]),
  34: dream("What will the special feature of the garden be?", "The special feature of the garden will be ___.", ["Look at the third paragraph.", "What could the writer swim in?"]),
  35: dream("What does the word ‘retractable’ mean in the third paragraph?", "‘Retractable’ means ___.", ["Watch the glass roof in the castle.", "The writer can open it and close it."]),
  36: casey("Choose the best title or heading for the passage.", "A good title for the passage: ___", ["When does the whole story take place?", "Mark a line that shows when Casey is planning her adventure."]),
  37: casey("Where was Casey's house?", "Casey's house was ___.", ["Look at the first paragraph.", "What is “on the outskirts” of a city?"]),
  38: casey("Why did Casey not like her next-door neighbour?", "Casey did not like Margaret because ___", ["Find “see eye-to-eye” in the second paragraph.", "What does it mean if two people do not see eye-to-eye?"]),
  39: casey("Casey's mother would be difficult to ______.", "Casey's mother would be difficult to ___.", ["Look for “difficult to sway” in the last paragraph.", "To sway someone is to change their mind about something."]),
  40: casey("What is the meaning of the word ‘notoriously’ in the third paragraph?", "‘Notoriously’ means ___.", ["Read the whole sentence with “notoriously” in it.", "It makes “difficult” stronger and says this is well known."]),
};

