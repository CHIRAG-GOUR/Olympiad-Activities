/**
 * Activity Archetypes Library
 * 
 * A curated collection of activity concepts organized by cognitive domain.
 * These are INSPIRATION — not templates to be blindly applied.
 * 
 * For every question, the system should:
 * 1. Identify the cognitive skill being tested
 * 2. Find relevant archetypes
 * 3. Combine/modify archetypes to create a UNIQUE experience
 * 4. Never reuse the same archetype + metaphor + interaction within a short sequence
 */

export interface Archetype {
  id: string;
  name: string;
  description: string;
  cognitiveSkills: string[];
  interactionPattern: string;
  visualMetaphor: string;
  technology: string[];
  complexity: "low" | "medium" | "high";
  gradeRange: [number, number];
  estimatedTime: [number, number]; // seconds [min, max]
}

// ─── PHYSICS / MOTION ──────────────────────────────────────

export const PHYSICS_ARCHETYPES: Archetype[] = [
  { id: "rocket-launch", name: "Rocket Launch", description: "Student configures launch parameters; rocket trajectory visualizes the mathematical relationship", cognitiveSkills: ["calculation", "comparison", "estimation"], interactionPattern: "slider-adjust → launch → observe", visualMetaphor: "Space launch pad with Earth-to-target trajectory", technology: ["svg", "canvas", "gsap"], complexity: "medium", gradeRange: [5, 8], estimatedTime: [20, 45] },
  { id: "slingshot", name: "Slingshot Launcher", description: "Pull-and-release mechanic where force/angle determines trajectory", cognitiveSkills: ["estimation", "comparison"], interactionPattern: "drag-pull → release → trajectory", visualMetaphor: "Mechanical slingshot with target zone", technology: ["svg", "matter-js"], complexity: "medium", gradeRange: [5, 8], estimatedTime: [15, 40] },
  { id: "cannon-trajectory", name: "Cannon Trajectory", description: "Set angle and power to hit a target — demonstrates projectile math", cognitiveSkills: ["calculation", "angle", "estimation"], interactionPattern: "rotate-cannon → set-power → fire", visualMetaphor: "Castle cannon on cliff aiming at target", technology: ["canvas", "gsap"], complexity: "medium", gradeRange: [6, 8], estimatedTime: [20, 45] },
  { id: "planet-orbit", name: "Planet Orbit", description: "Adjust orbital parameters to achieve stable orbit or reach destination", cognitiveSkills: ["spatial-reasoning", "calculation"], interactionPattern: "adjust-parameter → observe-orbit", visualMetaphor: "Solar system with orbital paths", technology: ["svg", "canvas"], complexity: "high", gradeRange: [6, 8], estimatedTime: [25, 50] },
  { id: "train-track", name: "Train Track Switchyard", description: "Switch track junctions to route trains to correct destinations", cognitiveSkills: ["logic", "direction", "sequencing"], interactionPattern: "click-switch → train-moves → destination", visualMetaphor: "Railway junction with multiple tracks", technology: ["svg", "gsap"], complexity: "medium", gradeRange: [5, 8], estimatedTime: [15, 35] },
  { id: "elevator", name: "Elevator Controller", description: "Program elevator stops to satisfy constraints", cognitiveSkills: ["sequencing", "logic", "calculation"], interactionPattern: "select-floors → run-elevator → verify", visualMetaphor: "Building cross-section with elevator shaft", technology: ["svg", "css"], complexity: "low", gradeRange: [5, 7], estimatedTime: [15, 30] },
  { id: "balance-beam", name: "Balance Beam", description: "Place weights to achieve equilibrium — represents equations and ratios", cognitiveSkills: ["ratio", "equation", "comparison"], interactionPattern: "drag-weight → beam-tilts → balance", visualMetaphor: "Classical balance scale with weight plates", technology: ["svg", "matter-js"], complexity: "medium", gradeRange: [5, 8], estimatedTime: [20, 40] },
  { id: "pulley-system", name: "Pulley System", description: "Configure pulleys to lift objects — demonstrates mechanical advantage", cognitiveSkills: ["ratio", "multiplication", "logic"], interactionPattern: "add-pulleys → pull-rope → observe-lift", visualMetaphor: "Construction crane with configurable pulleys", technology: ["svg", "canvas"], complexity: "high", gradeRange: [6, 8], estimatedTime: [25, 50] },
  { id: "gear-mechanism", name: "Gear Mechanism", description: "Connect gears to transmit rotation — demonstrates ratio and direction", cognitiveSkills: ["ratio", "direction", "pattern"], interactionPattern: "place-gears → engage → observe-rotation", visualMetaphor: "Steampunk gear workshop", technology: ["svg", "gsap"], complexity: "medium", gradeRange: [6, 8], estimatedTime: [20, 40] },
  { id: "pendulum", name: "Pendulum Laboratory", description: "Adjust pendulum length/mass to match timing — demonstrates relationships", cognitiveSkills: ["measurement", "comparison", "estimation"], interactionPattern: "adjust-parameter → release → observe-period", visualMetaphor: "Physics lab with grandfather clock", technology: ["svg", "canvas"], complexity: "medium", gradeRange: [6, 8], estimatedTime: [20, 40] },
  { id: "water-wheel", name: "Water Wheel", description: "Control water flow to power a water wheel at target speed", cognitiveSkills: ["ratio", "calculation", "estimation"], interactionPattern: "adjust-valve → water-flows → wheel-turns", visualMetaphor: "Mill with water channel and wheel", technology: ["svg", "gsap"], complexity: "medium", gradeRange: [5, 8], estimatedTime: [15, 35] },
  { id: "gravity-drop", name: "Gravity Drop Tower", description: "Drop objects from height — compare fall times/distances", cognitiveSkills: ["comparison", "estimation", "calculation"], interactionPattern: "select-object → drop → observe-fall", visualMetaphor: "Tall tower with measurement markings", technology: ["svg", "gsap"], complexity: "low", gradeRange: [5, 7], estimatedTime: [10, 25] },
];

// ─── MATHEMATICS ───────────────────────────────────────────

export const MATH_ARCHETYPES: Archetype[] = [
  { id: "number-factory", name: "Number Factory", description: "Numbers flow through a factory pipeline — student operates machines that transform them", cognitiveSkills: ["calculation", "operation", "sequencing"], interactionPattern: "configure-machine → feed-number → observe-output", visualMetaphor: "Industrial factory with conveyor and machines", technology: ["svg", "gsap"], complexity: "medium", gradeRange: [5, 8], estimatedTime: [20, 40] },
  { id: "treasure-map", name: "Treasure Map", description: "Follow coordinate/direction clues to find treasure on a map", cognitiveSkills: ["coordinates", "direction", "measurement"], interactionPattern: "plot-coordinates → follow-path → find-treasure", visualMetaphor: "Pirate island map with grid overlay", technology: ["svg", "canvas"], complexity: "medium", gradeRange: [5, 8], estimatedTime: [20, 45] },
  { id: "digital-vault", name: "Digital Vault Lock", description: "Enter the correct combination to unlock a vault — represents numeric answers", cognitiveSkills: ["calculation", "logic", "pattern"], interactionPattern: "rotate-dials → enter-code → vault-opens", visualMetaphor: "Bank vault with combination lock mechanism", technology: ["svg", "gsap"], complexity: "low", gradeRange: [5, 8], estimatedTime: [15, 30] },
  { id: "balance-scale", name: "Mathematical Balance Scale", description: "Place number tokens on a scale to prove equality or find unknowns", cognitiveSkills: ["equation", "comparison", "algebra"], interactionPattern: "drag-tokens → scale-tilts → find-balance", visualMetaphor: "Classical brass scale with number tokens", technology: ["svg", "matter-js"], complexity: "medium", gradeRange: [5, 8], estimatedTime: [15, 35] },
  { id: "fraction-tank", name: "Fraction Tank Laboratory", description: "Control valves to fill tanks to exact fractional levels", cognitiveSkills: ["fraction", "ratio", "measurement"], interactionPattern: "adjust-valve → water-fills → match-level", visualMetaphor: "Laboratory with graduated cylinders and pipe valves", technology: ["svg", "gsap"], complexity: "medium", gradeRange: [5, 8], estimatedTime: [20, 40] },
  { id: "ratio-mixer", name: "Ratio Mixing Machine", description: "Mix ingredients in correct ratios to produce the target result", cognitiveSkills: ["ratio", "proportion", "fraction"], interactionPattern: "pour-ingredients → mix → compare-result", visualMetaphor: "Chemistry lab with beakers and mixing chamber", technology: ["svg", "canvas"], complexity: "medium", gradeRange: [5, 8], estimatedTime: [20, 40] },
  { id: "geometry-architect", name: "Geometry Architect", description: "Construct geometric shapes by placing vertices, lines, or arcs", cognitiveSkills: ["geometry", "spatial-reasoning", "construction"], interactionPattern: "place-points → connect-lines → shape-forms", visualMetaphor: "Architect drafting table with tools", technology: ["svg", "canvas"], complexity: "high", gradeRange: [6, 8], estimatedTime: [25, 50] },
  { id: "area-painter", name: "Area Painter", description: "Paint tiles to cover an area — calculate total painted area", cognitiveSkills: ["area", "calculation", "spatial-reasoning"], interactionPattern: "click-tiles → area-fills → count-total", visualMetaphor: "Floor tiling workshop with grid", technology: ["svg", "css"], complexity: "low", gradeRange: [5, 7], estimatedTime: [15, 30] },
  { id: "perimeter-fence", name: "Perimeter Fence Builder", description: "Build a fence around a property — calculate total fence length", cognitiveSkills: ["perimeter", "measurement", "addition"], interactionPattern: "place-fence-segments → measure-total", visualMetaphor: "Garden with fence posts and rails", technology: ["svg", "canvas"], complexity: "medium", gradeRange: [5, 7], estimatedTime: [15, 35] },
  { id: "clock-tower", name: "Clock Tower", description: "Set clock hands to a target time — demonstrates time relationships", cognitiveSkills: ["time", "angle", "measurement"], interactionPattern: "drag-hands → set-time → verify", visualMetaphor: "Medieval clock tower with large face", technology: ["svg", "gsap"], complexity: "low", gradeRange: [5, 7], estimatedTime: [10, 25] },
  { id: "pattern-loom", name: "Pattern Loom", description: "Complete a weaving pattern by identifying the missing sequence element", cognitiveSkills: ["pattern", "sequence", "logic"], interactionPattern: "observe-pattern → select-next → loom-weaves", visualMetaphor: "Weaving loom with colorful thread pattern", technology: ["svg", "css"], complexity: "medium", gradeRange: [5, 8], estimatedTime: [15, 35] },
  { id: "number-line-explorer", name: "Number Line Explorer", description: "Navigate a number line to find target values or intervals", cognitiveSkills: ["number-sense", "comparison", "estimation"], interactionPattern: "drag-marker → position-on-line → verify", visualMetaphor: "Horizontal ruler with magnifying glass", technology: ["svg", "gsap"], complexity: "low", gradeRange: [5, 7], estimatedTime: [10, 25] },
  { id: "equation-machine", name: "Equation Machine", description: "Feed operands into a machine that applies operations — find the output or missing operand", cognitiveSkills: ["calculation", "algebra", "logic"], interactionPattern: "insert-number → select-operation → observe-output", visualMetaphor: "Rube Goldberg-style calculation machine", technology: ["svg", "gsap"], complexity: "medium", gradeRange: [5, 8], estimatedTime: [20, 40] },
  { id: "shape-cutter", name: "Shape Cutter Workshop", description: "Cut and fold paper/material to create or identify shapes", cognitiveSkills: ["geometry", "symmetry", "spatial-reasoning"], interactionPattern: "draw-cut-line → fold → observe-result", visualMetaphor: "Paper craft workshop with scissors and paper", technology: ["svg", "canvas"], complexity: "medium", gradeRange: [5, 8], estimatedTime: [20, 40] },
];

// ─── LOGICAL REASONING ─────────────────────────────────────

export const LOGIC_ARCHETYPES: Archetype[] = [
  { id: "mystery-room", name: "Mystery Room", description: "Investigate clues in a room to deduce the answer", cognitiveSkills: ["deduction", "logic", "observation"], interactionPattern: "explore-room → find-clues → deduce-answer", visualMetaphor: "Detective's study with evidence pinboard", technology: ["svg", "css"], complexity: "medium", gradeRange: [5, 8], estimatedTime: [25, 50] },
  { id: "robot-path", name: "Robot Path Programmer", description: "Program a robot's movement sequence to reach a target on a grid", cognitiveSkills: ["direction", "sequencing", "logic"], interactionPattern: "queue-commands → run-robot → reach-target", visualMetaphor: "Factory floor grid with robot and destination", technology: ["svg", "gsap"], complexity: "medium", gradeRange: [5, 8], estimatedTime: [20, 45] },
  { id: "shadow-room", name: "Shadow Identification Room", description: "Match objects to their shadows/rotations — tests spatial reasoning", cognitiveSkills: ["spatial-reasoning", "rotation", "matching"], interactionPattern: "rotate-object → compare-shadow → select-match", visualMetaphor: "Dark room with spotlight and shadow screen", technology: ["svg", "gsap"], complexity: "medium", gradeRange: [5, 8], estimatedTime: [15, 35] },
  { id: "mirror-room", name: "Mirror Reflection Room", description: "Manipulate mirrors to complete reflections or navigate light", cognitiveSkills: ["symmetry", "reflection", "spatial-reasoning"], interactionPattern: "rotate-mirror → observe-reflection → match-target", visualMetaphor: "Gallery with adjustable mirrors", technology: ["svg", "canvas"], complexity: "medium", gradeRange: [5, 8], estimatedTime: [20, 40] },
  { id: "code-breaker", name: "Code Breaking Console", description: "Decode a pattern or cipher to find the answer", cognitiveSkills: ["pattern", "logic", "deduction"], interactionPattern: "observe-pattern → decode-rule → enter-answer", visualMetaphor: "Spy console with encrypted message display", technology: ["svg", "css"], complexity: "medium", gradeRange: [6, 8], estimatedTime: [20, 45] },
  { id: "sorting-machine", name: "Sorting Machine", description: "Classify items into categories using a mechanical sorting device", cognitiveSkills: ["classification", "comparison", "logic"], interactionPattern: "drag-items → sorting-bins → machine-sorts", visualMetaphor: "Industrial sorting conveyor with chutes", technology: ["svg", "gsap"], complexity: "low", gradeRange: [5, 7], estimatedTime: [15, 30] },
  { id: "logic-bridge", name: "Logic Bridge", description: "Build a bridge by answering logic gates correctly to proceed", cognitiveSkills: ["logic", "deduction", "sequencing"], interactionPattern: "answer-gate → bridge-extends → cross-gap", visualMetaphor: "Ravine with retractable bridge segments", technology: ["svg", "gsap"], complexity: "medium", gradeRange: [5, 8], estimatedTime: [20, 40] },
  { id: "missing-piece", name: "Missing Piece Machine", description: "Identify the missing element in a pattern grid or sequence machine", cognitiveSkills: ["pattern", "observation", "logic"], interactionPattern: "observe-grid → identify-rule → place-piece", visualMetaphor: "Puzzle assembly machine with one empty slot", technology: ["svg", "css"], complexity: "low", gradeRange: [5, 8], estimatedTime: [15, 30] },
  { id: "family-tree", name: "Family Tree Investigation", description: "Navigate a family tree to determine relationships", cognitiveSkills: ["relations", "logic", "deduction"], interactionPattern: "read-clues → build-tree → answer-relationship", visualMetaphor: "Detective board with photo connections", technology: ["svg", "css"], complexity: "medium", gradeRange: [5, 8], estimatedTime: [20, 40] },
  { id: "direction-navigator", name: "Direction Navigator", description: "Navigate through a map following direction clues", cognitiveSkills: ["direction", "spatial-reasoning", "sequencing"], interactionPattern: "read-direction → move-marker → reach-destination", visualMetaphor: "Top-down village map with compass rose", technology: ["svg", "gsap"], complexity: "medium", gradeRange: [5, 8], estimatedTime: [20, 40] },
  { id: "venn-sorter", name: "Venn Diagram Sorter", description: "Place items into correct regions of a Venn diagram", cognitiveSkills: ["classification", "set-theory", "logic"], interactionPattern: "drag-items → drop-in-region → verify-placement", visualMetaphor: "Interactive Venn circles with floating item cards", technology: ["svg", "gsap"], complexity: "low", gradeRange: [5, 8], estimatedTime: [15, 30] },
  { id: "evidence-board", name: "Evidence Board", description: "Connect evidence pieces to reach a logical conclusion", cognitiveSkills: ["deduction", "logic", "analysis"], interactionPattern: "connect-evidence → form-conclusion → verify", visualMetaphor: "Police investigation board with red string", technology: ["svg", "canvas"], complexity: "high", gradeRange: [6, 8], estimatedTime: [25, 50] },
];

// ─── EVERYDAY MATHEMATICS ──────────────────────────────────

export const EVERYDAY_ARCHETYPES: Archetype[] = [
  { id: "supermarket", name: "Supermarket Checkout", description: "Calculate totals, change, or discounts at a checkout counter", cognitiveSkills: ["calculation", "money", "percentage"], interactionPattern: "scan-items → calculate-total → pay", visualMetaphor: "Supermarket checkout lane with products", technology: ["svg", "css"], complexity: "low", gradeRange: [5, 7], estimatedTime: [15, 30] },
  { id: "restaurant-bill", name: "Restaurant Bill", description: "Split bills, calculate tips, or verify totals", cognitiveSkills: ["calculation", "fraction", "percentage"], interactionPattern: "review-bill → calculate-share → verify", visualMetaphor: "Restaurant table with bill and calculator", technology: ["svg", "css"], complexity: "low", gradeRange: [5, 7], estimatedTime: [15, 30] },
  { id: "post-office", name: "Post Office Counter", description: "Weigh parcels and calculate postage — demonstrates weight/cost relationships", cognitiveSkills: ["measurement", "calculation", "ratio"], interactionPattern: "weigh-parcel → select-service → calculate-cost", visualMetaphor: "Post office counter with scale and price chart", technology: ["svg", "css"], complexity: "low", gradeRange: [5, 7], estimatedTime: [15, 30] },
  { id: "travel-planner", name: "Travel Planner", description: "Plan a journey — calculate distances, times, and costs", cognitiveSkills: ["calculation", "time", "distance"], interactionPattern: "select-route → calculate-time → plan-journey", visualMetaphor: "Map with routes and vehicle options", technology: ["svg", "canvas"], complexity: "medium", gradeRange: [5, 8], estimatedTime: [20, 40] },
  { id: "weather-station", name: "Weather Station", description: "Read thermometers, rain gauges — convert and compare measurements", cognitiveSkills: ["measurement", "comparison", "conversion"], interactionPattern: "read-instrument → record-data → analyze", visualMetaphor: "Weather station with instruments and log book", technology: ["svg", "gsap"], complexity: "low", gradeRange: [5, 7], estimatedTime: [15, 30] },
  { id: "construction-site", name: "Construction Site Manager", description: "Calculate materials needed for building — area, perimeter, volume", cognitiveSkills: ["area", "perimeter", "calculation"], interactionPattern: "measure-site → calculate-materials → order", visualMetaphor: "Construction site blueprint with measuring tools", technology: ["svg", "canvas"], complexity: "medium", gradeRange: [5, 8], estimatedTime: [20, 40] },
  { id: "market-stall", name: "Market Stall", description: "Buy/sell items with weight-based pricing — demonstrates unitary method", cognitiveSkills: ["ratio", "calculation", "unitary-method"], interactionPattern: "select-quantity → weigh → calculate-price", visualMetaphor: "Outdoor market stall with hanging scale", technology: ["svg", "css"], complexity: "low", gradeRange: [5, 7], estimatedTime: [15, 30] },
  { id: "calendar-scheduler", name: "Calendar Scheduler", description: "Plan events on a calendar — calculate durations, days between dates", cognitiveSkills: ["time", "calculation", "calendar"], interactionPattern: "mark-dates → calculate-duration → verify", visualMetaphor: "Desk calendar with sticky notes", technology: ["svg", "css"], complexity: "low", gradeRange: [5, 7], estimatedTime: [15, 30] },
];

// ─── ACHIEVERS SECTION ─────────────────────────────────────

export const ACHIEVER_ARCHETYPES: Archetype[] = [
  { id: "multi-stage-lab", name: "Multi-Stage Laboratory", description: "Solve multi-step problems through sequential laboratory experiments", cognitiveSkills: ["multi-step", "analysis", "synthesis"], interactionPattern: "stage-1 → intermediate-result → stage-2 → final", visualMetaphor: "Advanced research laboratory with multiple stations", technology: ["svg", "canvas", "gsap"], complexity: "high", gradeRange: [6, 8], estimatedTime: [30, 60] },
  { id: "mission-control", name: "Mission Control", description: "Manage multiple variables simultaneously to achieve a complex goal", cognitiveSkills: ["multi-variable", "optimization", "logic"], interactionPattern: "adjust-variables → monitor-systems → achieve-goal", visualMetaphor: "Space mission control room with multiple displays", technology: ["svg", "canvas"], complexity: "high", gradeRange: [6, 8], estimatedTime: [30, 55] },
  { id: "engineering-challenge", name: "Engineering Challenge", description: "Design and test a solution within constraints — demonstrates engineering thinking", cognitiveSkills: ["optimization", "constraint-satisfaction", "design"], interactionPattern: "design → build → test → iterate", visualMetaphor: "Engineering workshop with testing area", technology: ["svg", "canvas", "matter-js"], complexity: "high", gradeRange: [6, 8], estimatedTime: [30, 60] },
  { id: "strategy-room", name: "Strategy Room", description: "Analyze multiple data sources to make a strategic decision", cognitiveSkills: ["analysis", "comparison", "deduction"], interactionPattern: "review-data → analyze → decide → verify", visualMetaphor: "War room with maps and data displays", technology: ["svg", "css"], complexity: "high", gradeRange: [6, 8], estimatedTime: [25, 50] },
  { id: "multi-lock-vault", name: "Multi-Lock Vault", description: "Solve a chain of interconnected puzzles where each unlocks the next", cognitiveSkills: ["multi-step", "logic", "sequencing"], interactionPattern: "solve-lock-1 → reveals-clue → solve-lock-2 → vault-opens", visualMetaphor: "Ancient vault with multiple combination mechanisms", technology: ["svg", "gsap"], complexity: "high", gradeRange: [6, 8], estimatedTime: [30, 55] },
  { id: "scientific-investigation", name: "Scientific Investigation", description: "Conduct an experiment to discover a principle or verify a hypothesis", cognitiveSkills: ["hypothesis", "experiment", "analysis"], interactionPattern: "form-hypothesis → conduct-experiment → analyze-results", visualMetaphor: "Science lab with equipment and data recorder", technology: ["svg", "canvas"], complexity: "high", gradeRange: [6, 8], estimatedTime: [30, 55] },
];

// ─── COGNITIVE SKILL → ARCHETYPE MAPPING ───────────────────

export const COGNITIVE_SKILL_MAP: Record<string, string[]> = {
  "ordering": ["number-factory", "sorting-machine", "elevator", "train-track"],
  "comparison": ["balance-beam", "balance-scale", "gravity-drop", "weather-station"],
  "calculation": ["digital-vault", "equation-machine", "supermarket", "number-factory"],
  "spatial-reasoning": ["shadow-room", "robot-path", "geometry-architect", "mirror-room"],
  "sequence": ["pattern-loom", "train-track", "number-factory", "code-breaker"],
  "measurement": ["perimeter-fence", "area-painter", "weather-station", "construction-site"],
  "symmetry": ["mirror-room", "shape-cutter", "shadow-room"],
  "direction": ["direction-navigator", "robot-path", "treasure-map"],
  "pattern": ["pattern-loom", "code-breaker", "missing-piece"],
  "ratio": ["ratio-mixer", "fraction-tank", "balance-beam", "water-wheel"],
  "geometry": ["geometry-architect", "area-painter", "perimeter-fence", "shape-cutter"],
  "logic": ["mystery-room", "logic-bridge", "code-breaker", "evidence-board"],
  "classification": ["sorting-machine", "venn-sorter"],
  "fraction": ["fraction-tank", "ratio-mixer", "restaurant-bill"],
  "time": ["clock-tower", "calendar-scheduler", "travel-planner"],
  "money": ["supermarket", "market-stall", "restaurant-bill"],
  "coordinates": ["treasure-map", "geometry-architect"],
  "relations": ["family-tree", "evidence-board"],
  "estimation": ["rocket-launch", "slingshot", "number-line-explorer"],
  "multi-step": ["multi-stage-lab", "multi-lock-vault", "mission-control"],
};

// ─── ALL ARCHETYPES ────────────────────────────────────────

export const ALL_ARCHETYPES: Archetype[] = [
  ...PHYSICS_ARCHETYPES,
  ...MATH_ARCHETYPES,
  ...LOGIC_ARCHETYPES,
  ...EVERYDAY_ARCHETYPES,
  ...ACHIEVER_ARCHETYPES,
];

export function getArchetypeById(id: string): Archetype | undefined {
  return ALL_ARCHETYPES.find(a => a.id === id);
}

export function getArchetypesForSkill(skill: string): Archetype[] {
  const ids = COGNITIVE_SKILL_MAP[skill] || [];
  return ids.map(id => ALL_ARCHETYPES.find(a => a.id === id)).filter(Boolean) as Archetype[];
}
