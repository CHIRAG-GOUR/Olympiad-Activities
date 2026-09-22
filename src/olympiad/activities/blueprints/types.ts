/**
 * Activity Blueprint Types
 * 
 * A blueprint is the complete specification of an activity BEFORE implementation.
 * Every question must produce a blueprint that passes the quality gate
 * before any code is written.
 */

import { ActivityFamily, ActivityTechnology, InteractionType } from "../activity-contract";

export interface ActivityBlueprint {
  // ─── IDENTITY ──────────────────────────────────────────
  
  /** Unique blueprint ID */
  blueprintId: string;
  
  /** Source question ID (e.g., "LOG-G6-001") */
  questionId: string;
  
  /** Paper identifier (e.g., "IMO-CLASS6-SETB") */
  paperId: string;
  
  // ─── SOURCE QUESTION ───────────────────────────────────
  
  /** Subject (e.g., "Mathematics") */
  subject: string;
  
  /** Chapter (e.g., "Logical Reasoning") */
  chapter: string;
  
  /** Topic (e.g., "Spatial & Symmetry") */
  topic: string;
  
  /** Grade level */
  grade: number | string;
  
  /** Section if applicable */
  section?: string;
  
  /** The original question text — SOURCE OF TRUTH */
  sourceQuestion: string;
  
  /** The original options — NEVER CHANGED */
  sourceOptions: Array<{
    id: string;
    text: string;
    subtext?: string;
  }>;
  
  /** The correct answer identifier */
  correctAnswer: string;
  
  /** What cognitive skill this question actually tests */
  cognitiveSkill: string;
  
  // ─── ACTIVITY DESIGN ───────────────────────────────────
  
  /** Human-readable activity title */
  activityTitle: string;
  
  /** One-sentence activity concept */
  activityConcept: string;
  
  /** The "pitch" — why this activity fits this question */
  designRationale: string;
  
  /** Activity family classification */
  activityFamily: ActivityFamily;
  
  /** Primary interaction type */
  interactionType: InteractionType;
  
  /** Archetype IDs that inspired this activity */
  archetypeInspiration: string[];
  
  // ─── PLAYER EXPERIENCE ─────────────────────────────────
  
  /** What the student is tasked with doing */
  playerGoal: string;
  
  /** The visual world/environment */
  environment: string;
  
  /** Visual style description */
  visualStyle: string;
  
  /** Step-by-step interaction flow */
  interactionFlow: string[];
  
  // ─── TECHNICAL ─────────────────────────────────────────
  
  /** Primary technology */
  technology: ActivityTechnology;
  
  /** Additional technologies if needed */
  additionalTech?: ActivityTechnology[];
  
  /** Primary input method for the student */
  inputMethod: string;
  
  /** How the activity answer maps to the source answer */
  answerMapping: {
    /** What the activity captures */
    activityCaptures: string;
    
    /** How to normalize to source format */
    normalizationRule: string;
    
    /** Mapping for each option */
    optionMappings: Record<string, string>;
  };
  
  // ─── SIMULATION / ANIMATION ────────────────────────────
  
  /** Simulation rules if applicable */
  simulationRules?: string[];
  
  /** Key animation sequences */
  animationSequence?: string[];
  
  // ─── STATES ────────────────────────────────────────────
  
  /** What happens when the student answers correctly */
  successState: string;
  
  /** What happens when the student answers incorrectly */
  failureState: string;
  
  /** What happens when time runs out */
  timeoutState?: string;
  
  // ─── ACCESSIBILITY ─────────────────────────────────────
  
  /** Accessible alternative for the interaction */
  accessibilityAlternative: string;
  
  // ─── METADATA ──────────────────────────────────────────
  
  /** Estimated interaction time in seconds */
  estimatedInteractionTime: [number, number];
  
  /** Required assets (images, SVGs, sounds) */
  assetsRequired: string[];
  
  /** Implementation complexity */
  implementationComplexity: "low" | "medium" | "high";
  
  /** Notes about why previous concepts were rejected */
  antiRepetitionNotes: string;
  
  // ─── QUALITY ASSESSMENT ────────────────────────────────
  
  /** Pre-implementation quality scores */
  qualityAssessment: {
    answerFidelity: number;     // Must be 10/10
    examSuitability: number;    // Must be ≥ 8/10
    conceptualRelevance: number; // Must be ≥ 8/10
    uniqueness: number;         // ≥ 8/10
    studentEngagement: number;  // ≥ 8/10
    clarity: number;            // ≥ 8/10
  };
  
  /** WOW Test results */
  wowTest: {
    /** If I removed the question text, would a child understand something interesting is happening? */
    visuallyInteresting: boolean;
    /** Would the student want to interact with it? */
    engagementDesire: boolean;
    /** Does the interaction actually represent the concept? */
    conceptRepresentation: boolean;
    /** Would this activity be memorable one hour later? */
    memorable: boolean;
    /** Number of YES answers (must be ≥ 3) */
    passCount: number;
  };
  
  /** Blueprint status */
  status: "draft" | "approved" | "rejected" | "implemented";
  
  /** Rejection reason if applicable */
  rejectionReason?: string;
  
  /** Created timestamp */
  createdAt: string;
}

// ─── BLUEPRINT VALIDATION ──────────────────────────────────

export interface BlueprintValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateBlueprint(bp: ActivityBlueprint): BlueprintValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Mandatory quality gates
  if (bp.qualityAssessment.answerFidelity < 10) {
    errors.push(`Answer fidelity must be 10/10 (got ${bp.qualityAssessment.answerFidelity})`);
  }
  if (bp.qualityAssessment.examSuitability < 8) {
    errors.push(`Exam suitability must be ≥ 8/10 (got ${bp.qualityAssessment.examSuitability})`);
  }
  if (bp.qualityAssessment.conceptualRelevance < 8) {
    errors.push(`Conceptual relevance must be ≥ 8/10 (got ${bp.qualityAssessment.conceptualRelevance})`);
  }
  
  // WOW Test
  if (bp.wowTest.passCount < 3) {
    errors.push(`WOW Test failed: only ${bp.wowTest.passCount}/4 criteria passed (need ≥ 3)`);
  }
  
  // Interaction time
  if (bp.estimatedInteractionTime[0] < 15 || bp.estimatedInteractionTime[1] > 60) {
    warnings.push(`Interaction time ${bp.estimatedInteractionTime[0]}–${bp.estimatedInteractionTime[1]}s is outside the 15–60s target range`);
  }
  
  // Answer mapping completeness
  if (!bp.answerMapping.optionMappings || Object.keys(bp.answerMapping.optionMappings).length === 0) {
    errors.push("Answer mapping must include option mappings");
  }
  
  // Source question preservation
  if (!bp.sourceQuestion || bp.sourceQuestion.trim().length === 0) {
    errors.push("Source question text is required");
  }
  if (!bp.correctAnswer) {
    errors.push("Correct answer is required");
  }
  
  // Design completeness
  if (!bp.activityTitle || bp.activityTitle.trim().length === 0) {
    errors.push("Activity title is required");
  }
  if (!bp.playerGoal || bp.playerGoal.trim().length === 0) {
    errors.push("Player goal is required");
  }
  if (bp.interactionFlow.length === 0) {
    errors.push("At least one interaction step is required");
  }
  
  // Quality recommendations
  if (bp.qualityAssessment.uniqueness < 8) {
    warnings.push(`Uniqueness score is ${bp.qualityAssessment.uniqueness}/10 — consider alternative design`);
  }
  if (bp.qualityAssessment.studentEngagement < 8) {
    warnings.push(`Engagement score is ${bp.qualityAssessment.studentEngagement}/10 — enhance interactivity`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
