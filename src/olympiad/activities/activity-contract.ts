/**
 * Activity Contract Interface
 * 
 * Every interactive activity component MUST implement this contract.
 * The activity is a PRESENTATION layer — it captures student interaction
 * and produces an answer payload. It NEVER determines the official score.
 * 
 * Flow:
 *   Activity → answer payload → normalized answer → answer evaluator → scoring engine
 */

export interface ActivityAnswerPayload {
  /** The raw answer as captured by the activity interaction */
  activityAnswer: unknown;
  
  /** The answer normalized to match source question format (e.g., "C", ["1","2","3"], 42) */
  normalizedAnswer: unknown;
  
  /** Whether the student has completed the interaction (submitted/confirmed) */
  interactionCompleted: boolean;
  
  /** Time spent on this activity in milliseconds */
  timeSpentMs: number;
  
  /** Number of interaction attempts (resets, retries within the activity) */
  interactionAttempts: number;
}

export interface ActivityEvaluationResult {
  /** Visual feedback category — NOT the official score */
  visualOutcome: "success" | "failure" | "partial" | "neutral";
  
  /** Short description for animation selection */
  outcomeDescription: string;
  
  /** Animation key to trigger (e.g., "rocket_lands", "beam_balances") */
  animationKey?: string;
}

export interface ActivityState {
  /** Serialized internal state for pause/resume/restore */
  stateData: Record<string, unknown>;
  
  /** Current answer if any */
  currentAnswer?: unknown;
  
  /** Timestamp of last interaction */
  lastInteractionAt: number;
}

export interface ActivityContract {
  // ─── REQUIRED ──────────────────────────────────────────
  
  /** Initialize the activity with its configuration */
  init(config: ActivityConfig): void;
  
  /** Reset the activity to its initial state */
  reset(): void;
  
  /** Get the current answer payload */
  getAnswer(): ActivityAnswerPayload;
  
  /** Set/restore a previous answer (for resume functionality) */
  setAnswer(answer: unknown): void;
  
  /** Evaluate the current state and return visual feedback (NOT scoring) */
  evaluate(): ActivityEvaluationResult;
  
  /** Clean up all resources, listeners, animations, physics */
  destroy(): void;
  
  // ─── OPTIONAL ──────────────────────────────────────────
  
  /** Pause animations and timers */
  pause?(): void;
  
  /** Resume from paused state */
  resume?(): void;
  
  /** Handle viewport resize */
  resize?(width: number, height: number): void;
  
  /** Serialize current state for persistence */
  serialize?(): ActivityState;
  
  /** Restore from serialized state */
  restore?(state: ActivityState): void;
}

export interface ActivityConfig {
  /** Unique question identifier */
  questionId: string;
  
  /** The activity blueprint configuration */
  blueprint: ActivityBlueprintConfig;
  
  /** Container element reference or selector */
  container: HTMLElement | string;
  
  /** Whether the activity is in exam mode (no answer hints) */
  examMode: boolean;
  
  /** Whether to enable accessibility alternatives */
  accessibilityMode: boolean;
  
  /** Callback when student submits/confirms their answer */
  onAnswerSubmit?: (payload: ActivityAnswerPayload) => void;
  
  /** Callback when interaction state changes */
  onInteractionChange?: (hasInteracted: boolean) => void;
}

export interface ActivityBlueprintConfig {
  /** Activity type identifier */
  activityType: string;
  
  /** Source question options mapped to activity elements */
  answerMapping: Record<string, unknown>;
  
  /** Visual/animation configuration */
  visualConfig: Record<string, unknown>;
  
  /** Physics/simulation configuration if applicable */
  simulationConfig?: Record<string, unknown>;
  
  /** Accessibility alternative configuration */
  accessibilityConfig?: {
    alternativeInputType: "keyboard" | "dropdown" | "numeric" | "list";
    description: string;
  };
}

// ─── TECHNOLOGY TYPES ──────────────────────────────────────

export type ActivityTechnology = 
  | "svg"
  | "css"
  | "canvas"
  | "framer-motion"
  | "gsap"
  | "matter-js"
  | "pixi-js"
  | "three-js"
  | "babylon-js"
  | "custom";

// ─── INTERACTION TYPES ─────────────────────────────────────

export type InteractionType =
  | "drag-and-place"
  | "drag-reorder"
  | "click-select"
  | "click-toggle"
  | "rotate"
  | "slider-adjust"
  | "numeric-input"
  | "draw-path"
  | "plot-point"
  | "connect-lines"
  | "classify-sort"
  | "balance-weight"
  | "launch-projectile"
  | "navigate-direction"
  | "assemble-construct"
  | "mirror-reflect"
  | "fill-pour"
  | "measure-ruler"
  | "clock-set"
  | "compass-orient"
  | "valve-control"
  | "switch-toggle"
  | "code-enter"
  | "pattern-complete"
  | "sequence-arrange"
  | "evidence-select"
  | "multi-stage"
  | "custom";

// ─── ACTIVITY FAMILY ───────────────────────────────────────

export type ActivityFamily =
  | "physics-simulation"
  | "spatial-manipulation"
  | "construction"
  | "puzzle-deduction"
  | "physical-system"
  | "visual-pattern"
  | "graph-coordinate"
  | "real-world-scenario"
  | "laboratory"
  | "navigation"
  | "machine-mechanism"
  | "workshop"
  | "investigation"
  | "custom";
