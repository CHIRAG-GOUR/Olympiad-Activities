import { Armchair, Footprints, HelpCircle, Moon, PackageOpen, PenTool, Scale, Sun, Trophy } from "lucide-react";
import type { StorySpec } from "./story";
import { makeBalanceWorld } from "./worldsC";
import {
  BarefootWorld, BeachDaydreamWorld, DesignDeskWorld, HeavyCrateWorld, LivingRoomWorld, MatchPleaWorld, PuzzledWorld, TiredMorningWorld,
} from "./worldsD";

const OppositeWorld = makeBalanceWorld({ relation: "opposite", crate: "#8B5CF6", mood: "neutral" });
const SameWorld = makeBalanceWorld({ relation: "same", crate: "#0EA5E9", mood: "happy" });

/* Q41–Q50 */
export const SPECS_D: Record<number, StorySpec> = {
  41: {
    title: "Match Day Plea",
    mission: "Henry wants to go to the match. His mother has other ideas. Finish her famous saying.",
    icon: Trophy,
    World: MatchPleaWorld,
    bubbleAt: [0.7, 2.1, 0.1],
    mech: { kind: "fill", template: "No chance, not a ___ of Sundays.", speaker: "Mother" },
    hints: ["This is a fixed saying meaning “never”.", "Think of a long stretch of time made of many Sundays — the saying uses a period of a few weeks."],
  },
  42: {
    title: "The Morning After",
    mission: "Dimitri stayed up far too late. Finish his wish.",
    icon: Moon,
    World: TiredMorningWorld,
    bubbleAt: [0.3, 2.1, 0.3],
    mech: { kind: "fill", template: "I wish I ___ home earlier last night, I'm so tired today.", speaker: "Dimitri" },
    hints: ["“I wish” about the past takes the past perfect.", "Past perfect is “had” + past participle."],
  },
  43: {
    title: "One More Page",
    mission: "Aunty needs help with the tray, but her nephew is mid-page. Finish his reply.",
    icon: Armchair,
    World: LivingRoomWorld,
    bubbleAt: [-1.2, 2.1, -1.0],
    mech: { kind: "fill", template: "Can I do it in a second? I ___ finish this page first.", speaker: "Nephew" },
    hints: ["He feels he has an obligation to finish first.", "Which modal shows something you feel you have to do?"],
  },
  44: {
    title: "No Idea!",
    mission: "Amanda is baffled by the strange gadget. June is just as lost. Finish June's reply.",
    icon: HelpCircle,
    World: PuzzledWorld,
    bubbleAt: [0.8, 2.1, 0.3],
    mech: { kind: "fill", template: "___ ask me, I've no idea what you are talking about.", speaker: "June" },
    hints: ["June is telling Amanda that asking her is pointless.", "It is an instruction in the negative."],
  },
  45: {
    title: "Leave Them Be",
    mission: "The guys are struggling with the crate but didn't ask for help. Finish what Eugene says.",
    icon: PackageOpen,
    World: HeavyCrateWorld,
    bubbleAt: [0.7, 2.1, 0.5],
    mech: { kind: "fill", template: "Don't worry about those guys. If they wanted our help they ___ asked.", speaker: "Eugene" },
    hints: ["This is an imaginary situation in the past: they did not ask.", "The pattern is “would have” + past participle — look for its short form."],
  },
  46: {
    title: "At the Drawing Board",
    mission: "The client is polite but unhappy with the sketch. Link the two halves of what they say.",
    icon: PenTool,
    World: DesignDeskWorld,
    bubbleAt: [0.9, 2.1, 0.2],
    mech: { kind: "fill", template: "No offence meant to you ___ I don't think you've quite understood what I want.", speaker: "The client" },
    hints: ["The second half contrasts with the first.", "Which joining word introduces a contrast?"],
  },
  47: {
    title: "This Time Next Week",
    mission: "No lessons next week — just the beach. Finish the daydream.",
    icon: Sun,
    World: BeachDaydreamWorld,
    bubbleAt: [-0.2, 1.6, 0.2],
    mech: { kind: "fill", template: "This time next week I won't be in class, ___ on a beach relaxing." },
    hints: ["“This time next week” is a moment in the future when something will be in progress.", "That is the future continuous: will be + -ing."],
  },
  48: {
    title: "Opposite Balance",
    mission: "“Sinister” sits on the left pan. Drop the word that means the OPPOSITE onto the right pan.",
    icon: Scale,
    World: OppositeWorld,
    bubbleAt: [0, 2.1, -0.6],
    mech: { kind: "fill", template: "Sinister is the opposite of ___." },
    hints: ["Sinister means giving the feeling that something bad will happen.", "Three tiles mean nearly the same as sinister — which one is a good sign?"],
  },
  49: {
    title: "Word Twins",
    mission: "“Unilateral” sits on the left pan. Drop the word that means the SAME onto the right pan.",
    icon: Scale,
    World: SameWorld,
    bubbleAt: [0, 2.1, -0.6],
    mech: { kind: "fill", template: "Unilateral means the same as ___." },
    hints: ["“Uni-” means one; “lateral” means side.", "A unilateral decision is made by one side only."],
  },
  50: {
    title: "One Shoe Short",
    mission: "Felix's shoe is floating away down the stream. Finish how he copes.",
    icon: Footprints,
    World: BarefootWorld,
    bubbleAt: [-0.6, 2.1, 0.2],
    mech: { kind: "fill", template: "I've lost my shoe, so I am having to ___ with bare feet.", speaker: "Felix" },
    hints: ["He has to manage with what he has.", "Which phrasal verb means “manage or survive”?"],
  },
};

