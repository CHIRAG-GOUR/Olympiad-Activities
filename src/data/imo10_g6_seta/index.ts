import { Question } from "@/types/question";
import { Exam } from "@/types/exam";

/**
 * 10th SOF International Mathematics Olympiad (IMO) · Class 6 · Set A · Level 1
 *
 * 50 Questions across 4 Sections:
 *   - Logical Reasoning: Q1–Q15 (1 mark each)
 *   - Mathematical Reasoning: Q16–Q35 (1 mark each)
 *   - Everyday Mathematics: Q36–Q45 (1 mark each)
 *   - Achievers Section: Q46–Q50 (3 marks each)
 */

export const IMO10_G6_SETA_KEY =
  "ACDCBDCABA" + "AABBCDBABB" + "BCBAACBCAD" + "CCDDACADCB" + "AAADBADDDD";

type Section = "Logical Reasoning" | "Mathematical Reasoning" | "Everyday Mathematics" | "Achievers Section";

const sectionOf = (n: number): Section =>
  n <= 15
    ? "Logical Reasoning"
    : n <= 35
    ? "Mathematical Reasoning"
    : n <= 45
    ? "Everyday Mathematics"
    : "Achievers Section";

function q(
  n: number,
  topic: string,
  questionText: string,
  options: [string, string, string, string],
  customConfig: Record<string, unknown> = {}
): Question {
  const nn = String(n).padStart(2, "0");
  const correctOption = IMO10_G6_SETA_KEY[n - 1];
  return {
    id: `imo10_g6_seta_q${nn}`,
    questionId: `IMO10_G6_SETA-Q${nn}`,
    subjectId: "sub_mathematics",
    subjectName: "Mathematics",
    grade: 6,
    section: sectionOf(n),
    chapter: sectionOf(n),
    topic,
    difficulty: n > 45 ? "ACHIEVER" : "MEDIUM",
    questionType: "MULTIPLE_CHOICE",
    questionText,
    marks: n > 45 ? 3 : 1,
    negativeMarks: 0,
    version: 1,
    status: "Published",
    createdAt: "2026-09-28T00:00:00Z",
    updatedAt: "2026-09-28T00:00:00Z",
    multipleChoiceConfig: {
      options: (["A", "B", "C", "D"] as const).map((id, i) => ({ id, text: options[i] })),
      correctOptionId: correctOption,
      layout: "list",
    },
    customConfig: {
      paper: "10th SOF IMO Class 6 Set A",
      examId: "imo-class6-setA-2026",
      questionNumber: n,
      ...customConfig,
    },
  } as Question;
}

export const IMO10_G6_SETA_QUESTIONS: Question[] = [
  // ── Q1–Q15: Logical Reasoning ──
  q(
    1,
    "Number Analogy",
    "Find the missing number, if same rule is followed in all the three figures.\n\n25 : 5\n36 : 6\n? : 7",
    ["49", "37", "50", "94"],
    { pairs: [[25, 5], [36, 6], ["?", 7]], target: 49, rule: "square" }
  ),
  q(
    2,
    "Paper Folding & Cutting",
    "A sequence of figures shows a piece of paper being folded and cut. Select the option showing the unfolded form of the paper.",
    ["Pattern A", "Pattern B", "Pattern C", "Pattern D"],
    { foldSteps: 2, cuts: "corner_triangles", correctPattern: "C" }
  ),
  q(
    3,
    "Mirror Images",
    "Select the correct mirror image of Fig. (X) along the vertical mirror line MN.",
    ["Image A", "Image B", "Image C", "Image D"],
    { targetFig: "Fig (X)", correctMirror: "D" }
  ),
  q(
    4,
    "Classification / Odd One Out",
    "Select the odd one out from the following animal group:\nLion, Cat, Rabbit, Fox",
    ["Lion", "Cat", "Rabbit", "Fox"],
    { categoryCarnivore: ["Lion", "Cat", "Fox"], categoryHerbivore: ["Rabbit"], correct: "Rabbit" }
  ),
  q(
    5,
    "Cube Nets",
    "Which of the following nets can be folded to form the given target cube with special face markings (X, circle, triangle)?",
    ["Net A", "Net B", "Net C", "Net D"],
    { targetCube: { front: "X", top: "circle", right: "triangle" }, correctNet: "B" }
  ),
  q(
    6,
    "Direction & Angle Turns",
    "Latika is facing Bikaner. What will she be facing if she turns 315° anti-clockwise?",
    ["Haldiram", "KFC", "McD", "Nirula's"],
    { startHeading: "Bikaner", turnAngle: 315, direction: "anti-clockwise", destination: "Nirula's" }
  ),
  q(
    7,
    "Semantic Word Substitution",
    "If 'earth' is called 'sky', 'sky' is called 'tree' and 'tree' is called 'wall', on which does a fruit grow?",
    ["earth", "sky", "wall", "tree"],
    { realHost: "tree", substitutionMap: { earth: "sky", sky: "tree", tree: "wall" }, answer: "wall" }
  ),
  q(
    8,
    "Embedded Figures",
    "In which of the following options is Fig. (X) exactly embedded as one of its integral geometric parts?",
    ["Figure A", "Figure B", "Figure C", "Figure D"],
    { sourceShape: "Fig (X)", correctOption: "A" }
  ),
  q(
    9,
    "Figure Analogy",
    "There is a certain relationship between figures (1) and (2). Establish the same relationship between figures (3) and (4) to find the missing figure.",
    ["Figure A", "Figure B", "Figure C", "Figure D"],
    { transformation: "rotation_plus_inversion", correctOption: "B" }
  ),
  q(
    10,
    "Mathematical Number Matrix",
    "Find the missing number in the third four-number vault lock.\n\nLock 1: produces 90\nLock 2: produces 360\nLock 3: ?",
    ["64", "72", "48", "81"],
    { locks: [90, 360, 64], target: 64 }
  ),
  q(
    11,
    "Circle Counting",
    "How many distinct complete circles are there in the given geometric arrangement?",
    ["7", "6", "8", "9"],
    { circleCount: 7 }
  ),
  q(
    12,
    "Figure Completion",
    "Which of the following options will complete the missing quarter of Fig. (X)?",
    ["Option A", "Option B", "Option C", "Option D"],
    { correctQuarter: "A" }
  ),
  q(
    13,
    "Ranking & Ordering",
    "Naman ranks 14th from the top and 26th from the bottom in a class assembly queue. How many students are there in the class?",
    ["38", "39", "40", "41"],
    { topRank: 14, bottomRank: 26, totalFormula: "14 + 26 - 1 = 39", total: 39 }
  ),
  q(
    14,
    "Custom Operator Multiplications",
    "If 8 × 7 = 56, 9 × 6 = 54 and 8 × 3 = 24, find the value of 8 × 5.",
    ["35", "40", "45", "48"],
    { calculation: "8 × 5 = 40", target: 40 }
  ),
  q(
    15,
    "Navigation Maze",
    "Raju walks 5 km East, turns left and walks 3 km, turns right and walks 5 km, then turns left. Which direction is he facing now?",
    ["East", "West", "North", "South"],
    { steps: ["East 5km", "Left (North) 3km", "Right (East) 5km", "Left (North)"], finalHeading: "North" }
  ),

  // ── Q16–Q35: Mathematical Reasoning ──
  q(
    16,
    "BODMAS Simplification",
    "Evaluate and simplify the expression:\n\n2.002 + 7.9 {2.8 − 6.3(3.6 − 1.5) + 15.6}",
    ["38.450", "40.125", "45.670", "42.845"],
    { inner: "3.6 - 1.5 = 2.1", middle: "2.8 - 6.3(2.1) + 15.6 = 5.17", result: 42.845 }
  ),
  q(
    17,
    "Algebraic Expression Equivalence",
    "Determine which of the given mathematical expressions among I, II, III and IV evaluate to equal numerical values.",
    ["I and II", "I and IV", "II and III", "III and IV"],
    { equalExpressions: ["I", "IV"] }
  ),
  q(
    18,
    "Number System & Metric Statements",
    "Which of the following statements are INCORRECT?\n\n(i) 84 in Roman numerals is CXXXIV.\n(ii) There are seven zeroes in 1 crore.\n(iii) There are ten thousand milligrams in 1 kg.\n(iv) The smallest 4-digit number using digits 4, 3, 0, 8 without repetition is 3048.",
    ["Both (i) and (iii)", "Both (ii) and (iv)", "(i), (ii) and (iii)", "Only (iii)"],
    { incorrect: ["(i)", "(iii)"], answer: "Both (i) and (iii)" }
  ),
  q(
    19,
    "Distributive Property",
    "Using the distributive property of multiplication over addition, evaluate 258 × 1008.",
    ["258 × 1000 + 8", "258 × 1000 + 258 × 8", "258 × 100 + 258 × 8", "258 × 1008 + 8"],
    { expansion: "258 × (1000 + 8) = 258 × 1000 + 258 × 8", answer: "258 × 1000 + 258 × 8" }
  ),
  q(
    20,
    "Integers in Real Life",
    "Which of the following real-world situations is best represented by the signed integer −12?",
    ["A gain of ₹12 in trade", "Petrol price reduced by ₹12", "Climbing 12 steps upstairs", "A temperature of 12°C above zero"],
    { correctSituation: "Petrol price reduced by ₹12" }
  ),
  q(
    21,
    "Mensuration & Area Splitting",
    "Find the area of the given E-shaped geometric figure by splitting it into non-overlapping rectangles and squares.",
    ["12 cm²", "15 cm²", "18 cm²", "20 cm²"],
    { totalArea: 15, unit: "cm²" }
  ),
  q(
    22,
    "Fraction Representations",
    "Match the numerical fractions in Column I with the corresponding shaded portion diagrams in Column II.",
    ["P-2, Q-4, R-1, S-3", "P-3, Q-1, R-4, S-2", "P-4, Q-3, R-2, S-1", "P-1, Q-2, R-3, S-4"],
    { correctMapping: "C" }
  ),
  q(
    23,
    "Line Symmetry",
    "How many of the 10 given geometrical shapes possess at least one line of symmetry?",
    ["8", "10", "7", "9"],
    { symmetricCount: 10 }
  ),
  q(
    24,
    "Area of Framed Border",
    "A framed picture has an outer frame measuring 12 cm by 10 cm with a uniform 2 cm frame border width around the picture. Find the area of the inner picture.",
    ["48 cm²", "54 cm²", "60 cm²", "72 cm²"],
    { innerLength: 8, innerBreadth: 6, area: 48 }
  ),
  q(
    25,
    "Signed Integer Comparison",
    "Compare the values in Box A and Box B:\n\nBox A: (-3) − 74 + (-42) − (-82)\nBox B: (-12) + (-43)",
    [">", "<", "=", "Cannot be determined"],
    { boxA: -37, boxB: -55, comparator: ">" }
  ),
  q(
    26,
    "Collinear Points",
    "The total number of collinear point triplets/sets identified in the given geometric ray diagram is:",
    ["10", "12", "15", "18"],
    { collinearCount: 15 }
  ),
  q(
    27,
    "Prime Numbers & Polygons",
    "A polygon has a prime number of sides. If the number of sides is equal to the sum of the two least consecutive prime numbers, how many sides does the polygon have?",
    ["4", "5", "6", "7"],
    { leastPrimes: [2, 3], sum: 5, polygon: "Pentagon" }
  ),
  q(
    28,
    "Prime Number Counting",
    "Find the total count of prime numbers lying strictly between 16 and 80, and between 90 and 100.",
    ["15", "16", "17", "18"],
    { count16to80: 16, count90to100: 1, totalPrimes: 17 }
  ),
  q(
    29,
    "3D Solid Properties",
    "Which three-dimensional polyhedron has exactly 5 faces, 8 edges and 5 vertices?",
    ["Square/Rectangular Pyramid", "Triangular Prism", "Tetrahedron", "Pentagonal Pyramid"],
    { faces: 5, edges: 8, vertices: 5, solid: "Square/Rectangular Pyramid" }
  ),
  q(
    30,
    "Angle Classifications",
    "If the sum of two angles is equal to an obtuse angle (between 90° and 180°), which of the following combinations is NOT possible?",
    ["One acute and one right angle", "One acute and one obtuse angle", "Two acute angles", "Two right angles"],
    { impossible: "Two right angles", reason: "90° + 90° = 180° (Straight angle, not obtuse)" }
  ),
  q(
    31,
    "Number Logic & Factor Products",
    "Latika, Garima and Sanchi draw 3 cards each from cards numbered 1 to 9 without replacement.\n• Latika's product is 48.\n• Garima's sum is 15.\n• Sanchi's product is 63.\nWhat is the largest number in Sanchi's cards?",
    ["7", "8", "9", "6"],
    { sanchiCards: [1, 7, 9], sanchiProduct: 63, largestNumber: 9 }
  ),
  q(
    32,
    "HCF with Remainders",
    "Find the greatest number from the options that will divide 1025, 1299 and 1575 leaving remainders 5, 7 and 11 respectively.",
    ["34", "52", "68", "76"],
    { adjusted: [1020, 1292, 1564], hcf: 68 }
  ),
  q(
    33,
    "Rounding & Place Value Truth",
    "Select the CORRECT mathematical statement regarding place-value rounding.",
    [
      "214653 rounded to nearest hundred is 214600",
      "214653 rounded to nearest thousand is 214000",
      "214653 rounded to nearest lakh is 300000",
      "214653 rounded to nearest ten thousand is 210000",
    ],
    { correctStatement: "214653 rounded to nearest ten thousand is 210000" }
  ),
  q(
    34,
    "Fraction Comparison in Rangoli",
    "Trishu, Sidak, Mini and Kavleen created circular rangoli designs with diameters 17/20 in, 3/4 in, 5/6 in and 7/10 in respectively. Who made the SMALLEST rangoli?",
    ["Trishu", "Mini", "Kavleen", "Sidak"],
    { diameters: { Trishu: "17/20 = 0.85", Mini: "5/6 ≈ 0.833", Kavleen: "3/4 = 0.75", Sidak: "7/10 = 0.70" }, smallest: "Sidak" }
  ),
  q(
    35,
    "Division by Zero & Identity",
    "Which of the following arithmetic expressions does NOT represent zero?",
    ["1 / 0", "0 × 9", "0 / 2", "(3 − 3) / 2"],
    { undefinedExp: "1 / 0", reason: "Division by zero is undefined, not zero." }
  ),

  // ── Q36–Q45: Everyday Mathematics ──
  q(
    36,
    "Journey Distance Fractions",
    "Mohit travelled 2/3 of his journey by train, 1/4 by bus and the remaining distance by car. If the distance travelled by train is 60 km more than the distance travelled by bus, what was the total journey distance?",
    ["120 km", "132 km", "144 km", "160 km"],
    { trainFrac: "2/3", busFrac: "1/4", diff: "2/3 - 1/4 = 5/12", totalDistance: 144 }
  ),
  q(
    37,
    "LCM & Remainder Packing",
    "Deepika has more than 30 stickers but less than 40 stickers. She can pack them into packs of 2, 3 or 4 stickers with no remainder left in each case. How many stickers does she have?",
    ["36", "32", "38", "34"],
    { lcm: 12, range: [31, 39], validStickers: 36 }
  ),
  q(
    38,
    "Flooring & Carpet Costs",
    "Priya laid four similar rectangular carpets and one central square carpet on her living room floor. If rectangular carpets cost ₹6/m² and the square carpet costs ₹8/m², how much did she pay in total?",
    ["₹384", "₹402", "₹396", "₹416"],
    { totalCost: 416 }
  ),
  q(
    39,
    "Weight Multipliers",
    "Kiara weighs 34.5 kg. Her uncle weighs three times as much as Kiara. What is the total combined weight of Kiara and her uncle?",
    ["103.5 kg", "128 kg", "138 kg", "142.5 kg"],
    { kiara: 34.5, uncle: 103.5, totalWeight: 138 }
  ),
  q(
    40,
    "HCF Rope Cutting",
    "Two ropes of length 16 m and 20 m are to be cut into small pieces of equal length. What will be the maximum possible length of each piece with no rope left over?",
    ["2 m", "4 m", "5 m", "8 m"],
    { hcf: 4, unit: "m" }
  ),
  q(
    41,
    "Large Scale Egg Logistics",
    "A cold storage facility has 58,970,252 egg trays. It dispatches 3,789,441 trays to Delhi and 4,207,985 trays to Punjab. If each tray holds exactly 30 eggs, how many eggs remain in the storage facility?",
    ["1,529,184,780", "1,528,450,220", "1,600,120,500", "1,498,782,100"],
    { remainingTrays: 50972826, eggsPerTray: 30, totalEggs: 1529184780 }
  ),
  q(
    42,
    "Price Discount & Savings",
    "A designer handbag originally priced at ₹428.98 will be on sale the following week for ₹399.99. How much money will Garima save by purchasing it during the sale?",
    ["₹28.99", "₹29.01", "₹30.99", "₹27.89"],
    { originalPrice: 428.98, salePrice: 399.99, savings: 28.99 }
  ),
  q(
    43,
    "Multi-fraction Coloured Rod",
    "Fractions of a rod are coloured red, orange, yellow, green, blue and black, while the remaining portion is coloured violet. If the violet portion measures exactly 12.08 m, find the total length of the rod.",
    ["16 m", "18 m", "20 m", "24 m"],
    { violetLength: 12.08, totalRodLength: 16 }
  ),
  q(
    44,
    "Liquid Transfer & Capacity",
    "An oil drum has a total capacity of 705 litres. Two containers of 135.75 litres and 253.50 litres are filled from it. Find the quantity of oil left in the drum.",
    ["310.25 litres", "325.50 litres", "308.75 litres", "315.75 litres"],
    { initialDrum: 705, drained: 389.25, remaining: 315.75 }
  ),
  q(
    45,
    "Cargo Vehicle Total Load",
    "A transport truck carries 582 boxes weighing 16 kg each, while a delivery van carries 359 boxes of the exact same weight. Find the total combined weight carried by both vehicles.",
    ["14,890 kg", "15,056 kg", "15,240 kg", "14,976 kg"],
    { totalBoxes: 941, weightPerBox: 16, totalWeight: 15056 }
  ),

  // ── Q46–Q50: Achievers Section (3 Marks Each) ──
  q(
    46,
    "3D Polyhedron Matching",
    "Match the 3D solid figures P, Q, R and S with their correct geometric classification names:\n\n1. Octagonal Prism\n2. Triangular Prism\n3. Rectangular Pyramid\n4. Pentagonal Pyramid",
    [
      "P-2, Q-3, R-1, S-4",
      "P-3, Q-2, R-4, S-1",
      "P-2, Q-4, R-1, S-3",
      "P-4, Q-1, R-2, S-3",
    ],
    { correctMatching: "A" }
  ),
  q(
    47,
    "Strawberry Bakery Fractions",
    "Trishika bought a basket of strawberries. 1/8 of them were rotten and thrown away. She used 25 strawberries to bake a fresh cake. She was then left with 1/4 of the total initial strawberries.\n(a) How many strawberries did she have initially?\n(b) If the remaining strawberries were shared equally between her two sons, what fraction of the total initial strawberries did each son receive?",
    [
      "(a) 36, (b) 1/6",
      "(a) 48, (b) 1/8",
      "(a) 45, (b) 1/5",
      "(a) 40, (b) 1/8",
    ],
    { initialStrawberries: 40, remaining: 10, sonFraction: "1/8", answer: "D" }
  ),
  q(
    48,
    "Prime Number Logic Theorems",
    "Consider the following two mathematical statements:\n\nStatement I: Every prime number is an odd integer.\nStatement II: The product of any two prime numbers is always an odd integer.\n\nWhich of the statement(s) is/are CORRECT?",
    [
      "Only Statement I",
      "Only Statement II",
      "Both Statement I and Statement II",
      "Neither Statement I nor Statement II",
    ],
    { counterexample: 2, statement1: false, statement2: false, answer: "Neither Statement I nor Statement II" }
  ),
  q(
    49,
    "Sports Popularity Difference",
    "The bar graph displays the number of people (in millions) who preferred playing Football, Basketball, and Badminton from 2011 to 2016. Find the absolute difference between the total number of people who preferred Basketball and Badminton over all six years.",
    ["180 million", "210 million", "230 million", "250 million"],
    { basketballTotal: 1200, badmintonTotal: 950, diff: 250 }
  ),
  q(
    50,
    "Sports Data Total Aggregation",
    "Based on the sports preferences data across 2011–2016, how many people in total (in millions) preferred to play Tennis over all the six years combined?",
    ["1500 million", "1620 million", "1680 million", "1700 million"],
    { tennisTotal: 1700 }
  ),
];

const ids = (from: number, to: number) => IMO10_G6_SETA_QUESTIONS.slice(from, to).map((x) => x.id);

export const IMO10_G6_SETA_EXAM: Exam = {
  id: "imo-class6-setA-2026",
  code: "IMO-10TH-G6-SETA",
  title: "10th SOF International Mathematics Olympiad (Class 6 - Set A)",
  subtitle: "Science Olympiad Foundation • Class 6 • Set A • Level 1 Paper",
  description:
    "Official 10th SOF International Mathematics Olympiad (IMO) Class 6 Set A Level-1 examination paper covering Logical Reasoning, Mathematical Reasoning, Everyday Mathematics, and Achievers Section.",
  subjectId: "sub_mathematics",
  subjectName: "Mathematics & Logical Reasoning",
  grade: 6,
  academicYear: "2025-26",
  durationMinutes: 60,
  totalMarks: 60,
  passingMarks: 24,
  totalQuestions: 50,
  rules: {
    allowBacktrack: true,
    shuffleQuestions: false,
    showTimer: true,
    autoSubmitOnTimeUp: true,
    passPercentage: 40,
    negativeMarkingEnabled: false,
    instructions: [
      "Only 4 hints can be used: 1-mark questions will only get 1/2 mark, and 3-mark questions cut 1 & half mark for taking a hint",
      "This examination contains 50 questions across 4 sections.",
      "Section 1: Logical Reasoning (Q1–Q15, 1 mark each).",
      "Section 2: Mathematical Reasoning (Q16–Q35, 1 mark each).",
      "Section 3: Everyday Mathematics (Q36–Q45, 1 mark each).",
      "Section 4: Achievers Section (Q46–Q50, 3 marks each).",
      "Total time allowed is 60 minutes. There is no negative marking.",
      "You can navigate freely between questions using the Question Palette.",
    ],
  },
  status: "Published",
  createdAt: "2026-09-28T00:00:00Z",
  updatedAt: "2026-09-28T00:00:00Z",
  sections: [
    { id: "sec_logical", title: "Logical Reasoning", description: "15 Questions (1 Mark each)", questionIds: ids(0, 15) },
    { id: "sec_math", title: "Mathematical Reasoning", description: "20 Questions (1 Mark each)", questionIds: ids(15, 35) },
    { id: "sec_everyday", title: "Everyday Mathematics", description: "10 Questions (1 Mark each)", questionIds: ids(35, 45) },
    { id: "sec_achievers", title: "Achievers Section", description: "5 Questions (3 Marks each)", questionIds: ids(45, 50) },
  ],
  questionIds: IMO10_G6_SETA_QUESTIONS.map((q) => q.id),
};
