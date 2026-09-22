/**
 * Olympiad Activities — Barrel Export
 * 
 * Central export point for the entire activity system.
 */

// Core contract
export type {
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

// Registry
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

// Archetypes
export {
  PHYSICS_ARCHETYPES,
  MATH_ARCHETYPES,
  LOGIC_ARCHETYPES,
  EVERYDAY_ARCHETYPES,
  ACHIEVER_ARCHETYPES,
  ALL_ARCHETYPES,
  COGNITIVE_SKILL_MAP,
  getArchetypeById,
  getArchetypesForSkill,
} from "./archetypes";

export type { Archetype } from "./archetypes";

// Blueprints
export { validateBlueprint } from "./blueprints/types";
export type { ActivityBlueprint, BlueprintValidationResult } from "./blueprints/types";
