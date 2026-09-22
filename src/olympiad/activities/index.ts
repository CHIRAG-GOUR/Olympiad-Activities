/**
 * Olympiad Activities — Central Barrel Export
 * 
 * Central import point for the entire Olympiad activity system.
 */

// Core contract & Schema
export type {
  OlympiadActivity,
  ActivityContract,
  ActivityConfig,
  ActivityBlueprintConfig,
  ActivityAnswerPayload,
  ActivityEvaluationResult,
  ActivityState,
  ActivityTechnology,
  InteractionType,
  ActivityFamily,
} from "./activity-contract";

// Registry & Anti-Repetition
export {
  registerActivity,
  isConceptUsed,
  getUsageCount,
  getArchetypeUsageCount,
  wouldExceedRatio,
  getActivitiesForPaper,
  getAllActivities,
  getDiversityReport,
  generateActivityId,
} from "./registry";

export type { ActivityRegistryEntry } from "./registry";

// Archetypes & The 29 Cognitive Paradigms
export {
  THE_29_PARADIGMS,
  getParadigmById,
  getAllParadigms,
} from "./archetypes";

export type { Archetype } from "./archetypes";

// Blueprints & Quality Validation
export { validateBlueprint } from "./blueprints/types";
export type { ActivityBlueprint, BlueprintValidationResult } from "./blueprints/types";
