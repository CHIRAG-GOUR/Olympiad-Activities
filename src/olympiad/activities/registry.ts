/**
 * Activity Registry
 * 
 * The global registry for tracking all activities ever created.
 * Prevents repetition across question papers and ensures global uniqueness.
 * 
 * Usage:
 *   1. Before designing a new activity, call `isConceptUsed()` or `getUsageCount()`
 *   2. After implementing an activity, call `registerActivity()`
 *   3. For diversity audits, call `getDiversityReport()`
 */

import { ActivityFamily, ActivityTechnology, InteractionType } from "./activity-contract";

// ─── REGISTRY ENTRY ────────────────────────────────────────

export interface ActivityRegistryEntry {
  /** Unique activity ID (auto-generated) */
  activityId: string;
  
  /** Source question ID (e.g., "LOG-G6-001") */
  questionId: string;
  
  /** Paper identifier (e.g., "IMO-CLASS6-SETB") */
  paperId: string;
  
  /** Activity title */
  title: string;
  
  /** Short one-line concept description */
  concept: string;
  
  /** Activity family category */
  family: ActivityFamily;
  
  /** Primary interaction pattern */
  interactionType: InteractionType;
  
  /** Visual metaphor used */
  visualMetaphor: string;
  
  /** Archetype IDs used (from archetypes.ts) */
  archetypeIds: string[];
  
  /** Technology stack used */
  technologies: ActivityTechnology[];
  
  /** Cognitive skills targeted */
  cognitiveSkills: string[];
  
  /** Subject and chapter */
  subject: string;
  chapter: string;
  topic: string;
  grade: number | string;
  
  /** Implementation complexity */
  complexity: "low" | "medium" | "high";
  
  /** Estimated interaction time in seconds */
  estimatedTimeSeconds: [number, number];
  
  /** Timestamp of creation */
  createdAt: string;
  
  /** Quality scores */
  qualityScores: {
    answerFidelity: number;     // Must be 10/10
    examSuitability: number;    // Must be ≥ 8/10
    conceptualRelevance: number; // Must be ≥ 8/10
    uniqueness: number;         // ≥ 8/10
    studentEngagement: number;  // ≥ 8/10
    clarity: number;            // ≥ 8/10
  };
  
  /** Implementation file path */
  componentPath?: string;
}

// ─── REGISTRY STATE ────────────────────────────────────────

const ACTIVITY_REGISTRY: ActivityRegistryEntry[] = [];

// ─── REGISTRY API ──────────────────────────────────────────

/**
 * Register a new activity after implementation
 */
export function registerActivity(entry: ActivityRegistryEntry): void {
  // Validate required quality gates
  if (entry.qualityScores.answerFidelity < 10) {
    throw new Error(`Activity ${entry.activityId}: Answer fidelity must be 10/10 (got ${entry.qualityScores.answerFidelity})`);
  }
  if (entry.qualityScores.examSuitability < 8) {
    throw new Error(`Activity ${entry.activityId}: Exam suitability must be ≥ 8/10 (got ${entry.qualityScores.examSuitability})`);
  }
  if (entry.qualityScores.conceptualRelevance < 8) {
    throw new Error(`Activity ${entry.activityId}: Conceptual relevance must be ≥ 8/10 (got ${entry.qualityScores.conceptualRelevance})`);
  }
  
  ACTIVITY_REGISTRY.push(entry);
}

/**
 * Check if a specific concept+family+interaction combination has been used
 */
export function isConceptUsed(
  family: ActivityFamily,
  interactionType: InteractionType,
  visualMetaphor: string,
  paperId?: string
): boolean {
  const scope = paperId 
    ? ACTIVITY_REGISTRY.filter(e => e.paperId === paperId) 
    : ACTIVITY_REGISTRY;
  
  return scope.some(
    e => e.family === family 
      && e.interactionType === interactionType 
      && e.visualMetaphor.toLowerCase() === visualMetaphor.toLowerCase()
  );
}

/**
 * Get how many times a specific family+interaction pattern has been used
 */
export function getUsageCount(
  family: ActivityFamily,
  interactionType: InteractionType,
  paperId?: string
): number {
  const scope = paperId 
    ? ACTIVITY_REGISTRY.filter(e => e.paperId === paperId) 
    : ACTIVITY_REGISTRY;
  
  return scope.filter(
    e => e.family === family && e.interactionType === interactionType
  ).length;
}

/**
 * Get how many times a specific archetype has been used
 */
export function getArchetypeUsageCount(archetypeId: string, paperId?: string): number {
  const scope = paperId 
    ? ACTIVITY_REGISTRY.filter(e => e.paperId === paperId) 
    : ACTIVITY_REGISTRY;
  
  return scope.filter(e => e.archetypeIds.includes(archetypeId)).length;
}

/**
 * Check if adding a new activity with the given family would exceed the recommended ratio
 * (for a 50-question paper)
 */
export function wouldExceedRatio(family: ActivityFamily, paperId: string): boolean {
  const maxRatios: Partial<Record<ActivityFamily, number>> = {
    "physics-simulation": 12,
    "spatial-manipulation": 12,
    "construction": 8,
    "puzzle-deduction": 8,
    "physical-system": 6,
    "visual-pattern": 6,
    "graph-coordinate": 5,
    "real-world-scenario": 5,
    "laboratory": 5,
    "navigation": 5,
    "machine-mechanism": 5,
    "workshop": 5,
    "investigation": 5,
  };
  
  const currentCount = ACTIVITY_REGISTRY.filter(
    e => e.paperId === paperId && e.family === family
  ).length;
  
  const max = maxRatios[family] || 5;
  return currentCount >= max;
}

/**
 * Get all activities for a specific paper
 */
export function getActivitiesForPaper(paperId: string): ActivityRegistryEntry[] {
  return ACTIVITY_REGISTRY.filter(e => e.paperId === paperId);
}

/**
 * Get all registered activities
 */
export function getAllActivities(): ActivityRegistryEntry[] {
  return [...ACTIVITY_REGISTRY];
}

/**
 * Generate a diversity report for a paper
 */
export function getDiversityReport(paperId: string): DiversityReport {
  const activities = getActivitiesForPaper(paperId);
  
  const familyCounts: Record<string, number> = {};
  const interactionCounts: Record<string, number> = {};
  const archetypeCounts: Record<string, number> = {};
  const techCounts: Record<string, number> = {};
  
  activities.forEach(a => {
    familyCounts[a.family] = (familyCounts[a.family] || 0) + 1;
    interactionCounts[a.interactionType] = (interactionCounts[a.interactionType] || 0) + 1;
    a.archetypeIds.forEach(id => {
      archetypeCounts[id] = (archetypeCounts[id] || 0) + 1;
    });
    a.technologies.forEach(t => {
      techCounts[t] = (techCounts[t] || 0) + 1;
    });
  });
  
  // Find repetitions (anything used more than 3 times)
  const repetitions = Object.entries(archetypeCounts)
    .filter(([, count]) => count > 3)
    .map(([id, count]) => ({ archetypeId: id, count }));
  
  // Calculate diversity score (0-100)
  const uniqueFamilies = Object.keys(familyCounts).length;
  const uniqueInteractions = Object.keys(interactionCounts).length;
  const uniqueArchetypes = Object.keys(archetypeCounts).length;
  const totalActivities = activities.length;
  
  const diversityScore = totalActivities > 0
    ? Math.round(
        ((uniqueFamilies / Math.min(totalActivities, 14)) * 30) +
        ((uniqueInteractions / Math.min(totalActivities, 28)) * 30) +
        ((uniqueArchetypes / Math.max(totalActivities, 1)) * 40)
      )
    : 0;
  
  return {
    paperId,
    totalActivities,
    familyDistribution: familyCounts,
    interactionDistribution: interactionCounts,
    archetypeDistribution: archetypeCounts,
    technologyDistribution: techCounts,
    repetitions,
    diversityScore: Math.min(diversityScore, 100),
    recommendations: generateRecommendations(familyCounts, interactionCounts, repetitions),
  };
}

interface DiversityReport {
  paperId: string;
  totalActivities: number;
  familyDistribution: Record<string, number>;
  interactionDistribution: Record<string, number>;
  archetypeDistribution: Record<string, number>;
  technologyDistribution: Record<string, number>;
  repetitions: { archetypeId: string; count: number }[];
  diversityScore: number;
  recommendations: string[];
}

function generateRecommendations(
  familyCounts: Record<string, number>,
  interactionCounts: Record<string, number>,
  repetitions: { archetypeId: string; count: number }[]
): string[] {
  const recs: string[] = [];
  
  if (repetitions.length > 0) {
    recs.push(
      `⚠️ ${repetitions.length} archetype(s) used more than 3 times: ${repetitions.map(r => r.archetypeId).join(", ")}`
    );
  }
  
  // Check for dominant families
  Object.entries(familyCounts).forEach(([family, count]) => {
    if (count > 10) {
      recs.push(`⚠️ "${family}" is dominant with ${count} activities. Consider redistributing.`);
    }
  });
  
  // Check for dominant interactions
  Object.entries(interactionCounts).forEach(([interaction, count]) => {
    if (count > 8) {
      recs.push(`⚠️ "${interaction}" interaction used ${count} times. Consider alternative input methods.`);
    }
  });
  
  // Check for missing families
  const expectedFamilies: ActivityFamily[] = [
    "physics-simulation", "spatial-manipulation", "construction",
    "puzzle-deduction", "real-world-scenario"
  ];
  expectedFamilies.forEach(f => {
    if (!familyCounts[f]) {
      recs.push(`💡 No "${f}" activities found. Consider adding variety.`);
    }
  });
  
  if (recs.length === 0) {
    recs.push("✅ Activity distribution looks healthy!");
  }
  
  return recs;
}

/**
 * Generate a unique activity ID
 */
export function generateActivityId(questionId: string, paperId: string): string {
  const timestamp = Date.now().toString(36);
  const cleanQuestionId = questionId.replace(/[^a-zA-Z0-9]/g, "_");
  return `act_${cleanQuestionId}_${timestamp}`;
}
