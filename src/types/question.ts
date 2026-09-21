export type QuestionType =
  | "MULTIPLE_CHOICE"
  | "ORDERING"
  | "DRAG_DROP"
  | "NUMERIC"
  | "NUMERIC_TOLERANCE"
  | "MATCHING"
  | "CLASSIFICATION"
  | "HOTSPOT"
  | "SEQUENCE"
  | "GRAPH"
  | "CONSTRUCTION"
  | "SIMULATION"
  | "CUSTOM";

export type QuestionDifficulty = "EASY" | "MEDIUM" | "HARD" | "ACHIEVER";

export type QuestionStatus = "Draft" | "Review" | "Published" | "Archived";

export interface MultipleChoiceOption {
  id: string; // "A" | "B" | "C" | "D"
  text: string;
  subtext?: string;
  visualSvg?: string;
}

export interface MultipleChoiceConfig {
  options: MultipleChoiceOption[];
  correctOptionId: string; // "A" | "B" | "C" | "D"
  layout?: "grid" | "list";
}

export interface OrderingItem {
  id: string;
  label: string;
  sublabel?: string;
  visual?: string;
}

export interface OrderingConfig {
  items: OrderingItem[];
  correctOrder: string[]; // array of item ids in correct order
  orientation?: "horizontal" | "vertical";
  instruction?: string;
}

export interface DragDropZone {
  id: string;
  label: string;
  targetCount?: number;
  accepts?: string[];
}

export interface DragDropItem {
  id: string;
  label: string;
  category?: string;
  icon?: string;
  initialZone?: string;
}

export interface DragDropConfig {
  items: DragDropItem[];
  zones: DragDropZone[];
  correctMapping: Record<string, string>; // itemId -> zoneId
  instruction?: string;
}

export interface NumericConfig {
  correctValue: number;
  unit?: string;
  prefix?: string;
  tolerance?: number; // e.g. 0.05 for 5% or absolute value
  allowDecimals?: boolean;
  min?: number;
  max?: number;
  step?: number;
  showKeypad?: boolean;
}

export interface MatchingPair {
  id: string;
  leftId: string;
  leftText: string;
  leftMedia?: string;
  rightId: string;
  rightText: string;
  rightMedia?: string;
}

export interface MatchingConfig {
  leftItems: { id: string; text: string; visual?: string }[];
  rightItems: { id: string; text: string; visual?: string }[];
  correctPairs: { leftId: string; rightId: string }[];
  instruction?: string;
}

export interface ClassificationCategory {
  id: string;
  title: string;
  color?: string;
  description?: string;
}

export interface ClassificationConfig {
  categories: ClassificationCategory[];
  items: { id: string; text: string; categoryId: string; icon?: string }[];
  instruction?: string;
}

export interface HotspotSpot {
  id: string;
  label?: string;
  xPercent: number; // 0-100
  yPercent: number; // 0-100
  radiusPercent: number; // tolerance radius
}

export interface HotspotConfig {
  imageUrl?: string;
  diagramType?: "geometry" | "solar_system" | "clock" | "human_body" | "circuit" | "map" | "grid";
  customSvgData?: string;
  hotspots: HotspotSpot[];
  correctSpotIds: string[];
  maxSelections?: number;
  instruction?: string;
}

export interface SequenceConfig {
  sequence: { id: string; value: string; isBlank?: boolean; visualType?: string }[];
  options: { id: string; value: string; visualType?: string }[];
  correctAnswerId: string;
  patternRuleExplanation?: string;
}

export interface GraphConfig {
  gridMinX: number;
  gridMaxX: number;
  gridMinY: number;
  gridMaxY: number;
  step: number;
  targetPoints: { x: number; y: number }[];
  mode: "point" | "line" | "polygon";
  tolerance?: number;
}

export interface SimulationConfig {
  simulationType: "rocket_altitude" | "balance_scale" | "pendulum" | "gears" | "circuit_flow";
  parameterName: string;
  parameterUnit: string;
  defaultVal: number;
  minVal: number;
  maxVal: number;
  step: number;
  targetCondition: {
    minSuccessValue: number;
    maxSuccessValue?: number;
    description: string;
  };
  animationSpeed?: number;
}

export interface QuestionAnswerPayload {
  questionId: string;
  type: QuestionType;
  answer: any; // e.g. string[], number, Record<string, string>, etc.
  timestamp: number;
  timeSpentSeconds?: number;
}

export interface Question {
  id: string;
  questionId: string; // friendly code like MAT-G6-012
  subjectId: string;
  subjectName: string;
  chapter: string;
  topic: string;
  grade: number | string;
  section?: "Logical Reasoning" | "Mathematical Reasoning" | "Everyday Mathematics" | "Achievers Section";
  questionText: string;
  questionPromptHtml?: string;
  questionType: QuestionType;
  difficulty: QuestionDifficulty;
  marks: number;
  negativeMarks: number;
  
  // Configurations for specific interaction types
  multipleChoiceConfig?: MultipleChoiceConfig;
  orderingConfig?: OrderingConfig;
  dragDropConfig?: DragDropConfig;
  numericConfig?: NumericConfig;
  matchingConfig?: MatchingConfig;
  classificationConfig?: ClassificationConfig;
  hotspotConfig?: HotspotConfig;
  sequenceConfig?: SequenceConfig;
  graphConfig?: GraphConfig;
  simulationConfig?: SimulationConfig;
  customConfig?: Record<string, any>;

  // Additional metadata
  explanation?: string;
  hints?: string[];
  media?: {
    type: "image" | "svg" | "diagram";
    url?: string;
    caption?: string;
  };
  version: number;
  status: QuestionStatus;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}
