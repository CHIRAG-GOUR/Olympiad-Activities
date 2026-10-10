import { Question } from "@/types/question";
import { Exam } from "@/types/exam";

/**
 * SOF International Mathematics Olympiad (IMO) · Class 6
 * Master Interactive Digital Examination (Set A Level 1)
 *
 * 50 Questions across 4 Sections:
 *   - Section A: Logical Reasoning: Q1–Q15 (1 mark each)
 *   - Section B: Mathematical Reasoning: Q16–Q35 (1 mark each)
 *   - Section C: Everyday Mathematics: Q36–Q45 (1 mark each)
 *   - Section D: Achievers Section: Q46–Q50 (3 marks each)
 */

export const IMO_INTERACTIVE_G6_KEY =
  "BBDCDBABCB" + "CABACCBCBB" + "DCBCBCBBBA" + "CBCBDCCCBC" + "BBCCCBCBAA";

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
  const correctOption = IMO_INTERACTIVE_G6_KEY[n - 1];
  return {
    id: `imo_int_g6_q${nn}`,
    questionId: `IMO-INT-G6-Q${nn}`,
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
      paper: "SOF IMO Class 6 Master Interactive Examination",
      examId: "imo-class6-master-interactive",
      questionNumber: n,
      ...customConfig,
    },
  } as Question;
}

export const IMO_INTERACTIVE_G6_QUESTIONS: Question[] = [
  // ── SECTION A: Logical Reasoning (Q1–Q15) ──
  q(
    1,
    "Linear Arrangement",
    "Four exploration robots P, Q, R and S stand in a straight line.\n\n• P is to the left of Q.\n• R is to the right of Q.\n• S stands between Q and R.\n\nWho is second from the left?",
    ["P", "Q", "S", "R"],
    { order: ["P", "Q", "S", "R"], answer: "Q" }
  ),
  q(
    2,
    "Letter Sequence",
    "Find the missing letter in the given sequence:\n\nA, C, F, J, O, ?",
    ["T", "U", "V", "W"],
    { steps: [+2, +3, +4, +5, +6], answer: "U" }
  ),
  q(
    3,
    "Odd One Out",
    "Which one of the following geometric figures is different from the others?\n\nTriangle, Square, Pentagon, Circle",
    ["Triangle", "Square", "Pentagon", "Circle"],
    { straightSides: ["Triangle", "Square", "Pentagon"], curved: ["Circle"], answer: "Circle" }
  ),
  q(
    4,
    "Direction Sense",
    "A rescue drone flies 40 m north, then 30 m east, and then 40 m south. In which direction is it from its starting point?",
    ["North", "South", "East", "West"],
    { moves: ["40m N", "30m E", "40m S"], displacement: "30m East", answer: "East" }
  ),
  q(
    5,
    "Ordering & Ranking",
    "In a race:\n• Asha finishes before Bela.\n• Bela finishes before Chet.\n• Diya finishes after Asha but before Bela.\n\nWho finishes second?",
    ["Asha", "Bela", "Chet", "Diya"],
    { rankOrder: ["Asha", "Diya", "Bela", "Chet"], second: "Diya" }
  ),
  q(
    6,
    "Water Mirror Images",
    "A vertical flag has three coloured bands from top to bottom: Red → Blue → Green.\nWhat will their order be in its water image (top to bottom)?",
    ["Red → Blue → Green", "Green → Blue → Red", "Blue → Red → Green", "Green → Red → Blue"],
    { verticalReflection: "Green → Blue → Red" }
  ),
  q(
    7,
    "Alphabet Coding",
    "If each letter is replaced by the next letter of the alphabet, then CAT is coded as DBU. Using the same rule, DOG is coded as:",
    ["EPH", "EOG", "FPH", "DPH"],
    { word: "DOG", shift: +1, code: "EPH" }
  ),
  q(
    8,
    "Blood Relations",
    "P is the brother of Q. Q is the mother of R. How is P related to R?",
    ["Father", "Maternal uncle", "Brother", "Grandfather"],
    { relation: "Maternal uncle" }
  ),
  q(
    9,
    "Calendar & Days",
    "If the 1st day of a month is Wednesday, what day will the 15th day of that month be?",
    ["Monday", "Tuesday", "Wednesday", "Thursday"],
    { day1: "Wednesday", day15: "Wednesday" }
  ),
  q(
    10,
    "Venn Diagrams",
    "In a class of 30 students, 18 like cricket, 15 like football and 7 like both. How many students like neither cricket nor football?",
    ["3", "4", "5", "6"],
    { total: 30, cricket: 18, football: 15, both: 7, neither: 4 }
  ),
  q(
    11,
    "Paper Folding & Holes",
    "A square sheet is folded in half, and then folded in half again. One hole is punched through all the layers, away from the folds. How many holes will appear when the sheet is completely unfolded?",
    ["2", "3", "4", "8"],
    { layers: 4, holes: 4 }
  ),
  q(
    12,
    "Rotating Patterns",
    "A symbol rotates 90° clockwise at every step. A dot moves one position clockwise around the symbol.\nIf the third stage is: ↓ with the dot on the right, what is the fourth stage?",
    ["← with dot at bottom", "→ with dot at top", "↑ with dot at left", "↓ with dot at left"],
    { rotation: "90° CW", dot: "CW", stage4: "← with dot at bottom" }
  ),
  q(
    13,
    "Clock Hands Angle",
    "What is the smaller angle between the hands of a clock at 4:30?",
    ["30°", "45°", "60°", "75°"],
    { time: "4:30", angle: 45 }
  ),
  q(
    14,
    "Number Formation",
    "Using digits 2, 0, 5 and 7 exactly once, what is the smallest four-digit even number?",
    ["2057", "2507", "2570", "5072"],
    { digits: [2, 0, 5, 7], condition: "smallest 4-digit even", answer: "2570" }
  ),
  q(
    15,
    "Shape Assembly",
    "Two congruent right-angled triangles are joined along their equal longest sides (hypotenuses). Which shape can they form?",
    ["Rectangle", "Circle", "Pentagon", "Hexagon"],
    { shape: "Rectangle" }
  ),

  // ── SECTION B: Mathematical Reasoning (Q16–Q35) ──
  q(
    16,
    "Fractions of Quantity",
    "What is 3/4 of 28?",
    ["18", "20", "21", "24"],
    { calculation: "(3/4) * 28 = 21", answer: "21" }
  ),
  q(
    17,
    "LCM & Cycles",
    "Two gears complete a full cycle every 12 and 18 rotations respectively. After how many rotations will both return to their starting positions together?",
    ["24", "30", "36", "54"],
    { lcm: [12, 18], result: 36 }
  ),
  q(
    18,
    "Highest Common Factor",
    "Find the HCF of 84 and 126.",
    ["14", "21", "42", "63"],
    { hcf: [84, 126], result: 42 }
  ),
  q(
    19,
    "Estimation & Rounding",
    "Estimate the difference between 483 and 761, when each number is rounded to the nearest hundred.",
    ["200", "300", "400", "500"],
    { rounded: [500, 800], diff: 300 }
  ),
  q(
    20,
    "Integer Operations",
    "Evaluate the signed integer expression: −18 + 27 − 14",
    ["−9", "−5", "5", "23"],
    { expression: "-18 + 27 - 14", result: -5 }
  ),
  q(
    21,
    "Polygonal Symmetry",
    "How many lines of symmetry does a regular hexagon have?",
    ["3", "4", "5", "6"],
    { shape: "Regular Hexagon", linesOfSymmetry: 6 }
  ),
  q(
    22,
    "Line Segments",
    "Five points lie on the same straight line. How many different line segments can be formed using pairs of these points?",
    ["5", "8", "10", "12"],
    { formula: "5 * 4 / 2", result: 10 }
  ),
  q(
    23,
    "Data Handling",
    "The table shows library visitors across a week:\nMon: 32, Tue: 18, Wed: 27, Thu: 35, Fri: 22, Sat: 16, Sun: 20.\nHow many more people visited on Monday, Wednesday and Thursday together than on Saturday and Sunday together?",
    ["56", "58", "60", "62"],
    { group1: 32 + 27 + 35, group2: 16 + 20, diff: 58 }
  ),
  q(
    24,
    "Area of Composite Region",
    "A rectangular garden is 12 m long and 8 m wide. A rectangular pond measuring 4 m × 3 m is constructed inside it. What is the remaining area of the garden?",
    ["72 m²", "78 m²", "84 m²", "90 m²"],
    { gardenArea: 96, pondArea: 12, remaining: 84 }
  ),
  q(
    25,
    "Perimeter Calculation",
    "A rectangular playground is 15 m long and 9 m wide. What is its perimeter?",
    ["42 m", "48 m", "54 m", "60 m"],
    { length: 15, width: 9, perimeter: 48 }
  ),
  q(
    26,
    "Clock Angle Measurement",
    "Determine the smaller angle between the hour hand and minute hand of a clock at 4:30.",
    ["20°", "30°", "45°", "60°"],
    { time: "4:30", angle: 45 }
  ),
  q(
    27,
    "Place Value",
    "In the number 705,032, what is the place value of digit 5?",
    ["50", "500", "5,000", "50,000"],
    { number: 705032, digit: 5, placeValue: 5000 }
  ),
  q(
    28,
    "Roman Numerals",
    "What decimal number is represented by the Roman numeral MCDXL?",
    ["1,340", "1,440", "1,540", "1,640"],
    { roman: "MCDXL", value: 1440 }
  ),
  q(
    29,
    "Divisibility Rules",
    "Which of the following numbers is divisible by 9?",
    ["5,823", "5,832", "5,842", "5,852"],
    { correctNumber: 5832, digitSum: 18 }
  ),
  q(
    30,
    "Fraction Comparison",
    "Which fraction is greater: 5/8 or 3/5?",
    ["5/8", "3/5", "They are equal", "Cannot be compared"],
    { f1: 5 / 8, f2: 3 / 5, greater: "5/8" }
  ),
  q(
    31,
    "Ratio & Proportion",
    "The ratio of red marbles to blue marbles is 3 : 5. If there are 64 marbles altogether in the jar, how many marbles are blue?",
    ["24", "32", "40", "48"],
    { ratio: [3, 5], total: 64, blue: 40 }
  ),
  q(
    32,
    "Metric Units Conversion",
    "Convert 3.5 metres into centimetres.",
    ["35 cm", "350 cm", "3,500 cm", "0.35 cm"],
    { metres: 3.5, cm: 350 }
  ),
  q(
    33,
    "Averages",
    "Find the arithmetic average of numbers: 14, 18, 10 and 22.",
    ["14", "15", "16", "18"],
    { sum: 64, count: 4, average: 16 }
  ),
  q(
    34,
    "Decimal Arithmetic",
    "Calculate the value of: 12.75 + 8.60 − 3.25",
    ["17.10", "18.10", "18.60", "19.10"],
    { result: 18.10 }
  ),
  q(
    35,
    "Number Patterns",
    "Find the next number in the recursive sequence: 2, 5, 11, 23, ?",
    ["35", "42", "46", "47"],
    { rule: "2n + 1", result: 47 }
  ),

  // ── SECTION C: Everyday Mathematics (Q36–Q45) ──
  q(
    36,
    "Money & Shopping",
    "A student buys:\n• School Bag = ₹275.50\n• Sports Shoes = ₹149.75\n• Cap = ₹74.75\n\nHow much money is spent altogether?",
    ["₹450", "₹475", "₹500", "₹525"],
    { items: [275.50, 149.75, 74.75], total: 500 }
  ),
  q(
    37,
    "Fractional Remaining Money",
    "Karan spends half of his money on shoes, half of the remaining money on a book, and half of what remains on a table. He is left with ₹120.\nHow much money did he have initially?",
    ["₹480", "₹720", "₹960", "₹1,200"],
    { final: 120, initial: 960 }
  ),
  q(
    38,
    "Speed, Distance & Time",
    "A car travels at a uniform speed of 45 km/h for 2 hours and 20 minutes. How far does it travel?",
    ["90 km", "100 km", "105 km", "120 km"],
    { speed: 45, timeHours: 7 / 3, distance: 105 }
  ),
  q(
    39,
    "Temperature Differential",
    "The minimum temperature recorded in one city is −6°C, while another city records a minimum temperature of 17°C. What is the difference between their temperatures?",
    ["11°C", "17°C", "23°C", "29°C"],
    { t1: -6, t2: 17, diff: 23 }
  ),
  q(
    40,
    "Packing & Division",
    "A stationery company has 8,640 pens. Each box contains 240 pens. How many boxes are required to pack all the pens?",
    ["32", "34", "36", "38"],
    { totalPens: 8640, boxCapacity: 240, boxes: 36 }
  ),
  q(
    41,
    "Time Intervals",
    "Puneet enters the gym at 17:35 and leaves at 19:10. For how long does he exercise?",
    ["1 h 25 min", "1 h 35 min", "1 h 45 min", "2 h 5 min"],
    { start: "17:35", end: "19:10", duration: "1 h 35 min" }
  ),
  q(
    42,
    "Weight Increments",
    "Sneha weighs 18.75 kg. Sakshi is 2.40 kg heavier than Sneha. What is Sakshi's weight?",
    ["20.15 kg", "21.15 kg", "22.15 kg", "23.15 kg"],
    { sneha: 18.75, increment: 2.40, sakshi: 21.15 }
  ),
  q(
    43,
    "Tiling & Area",
    "A rectangular floor measures 30 cm × 20 cm. Square tiles of size 5 cm × 5 cm are laid on the floor. How many tiles are needed to completely cover the floor?",
    ["20", "24", "30", "36"],
    { floorArea: 600, tileArea: 25, tiles: 24 }
  ),
  q(
    44,
    "Inventory Addition",
    "A warehouse contains 1,350 apples, 875 oranges and 625 watermelons. How many fruits are there altogether?",
    ["2,650", "2,750", "2,850", "2,950"],
    { apples: 1350, oranges: 875, watermelons: 625, total: 2850 }
  ),
  q(
    45,
    "Step Synchronisation",
    "Three robots take steps of 48 cm, 60 cm and 72 cm respectively. What is the minimum distance each robot must travel so that all three complete an exact whole number of steps?",
    ["240 cm", "360 cm", "720 cm", "1,440 cm"],
    { lcm: [48, 60, 72], result: 720 }
  ),

  // ── SECTION D: Achievers Section (Q46–Q50 · 3 Marks Each) ──
  q(
    46,
    "Multi-Stage Operation Reactor",
    "A number enters a machine:\n1. Multiply it by 3.\n2. Subtract 20.\n3. Divide the result by 2.\n\nIf the starting number is 48, what comes out of the machine?",
    ["52", "58", "62", "68"],
    { start: 48, s1: 144, s2: 124, s3: 62, output: 62 }
  ),
  q(
    47,
    "Corner Geometry Deduction",
    "A metal plate rectangle measures 18 cm × 10 cm. A 4 cm × 5 cm rectangle is cut and removed from one corner. What is the area of the remaining shape?",
    ["150 cm²", "160 cm²", "170 cm²", "180 cm²"],
    { originalArea: 180, removedArea: 20, remainingArea: 160 }
  ),
  q(
    48,
    "Water Tank Capacity",
    "A water tank is 3/5 full. After adding 12 litres of water, it becomes 9/10 full. What is the total capacity of the tank?",
    ["30 L", "36 L", "40 L", "48 L"],
    { initialFrac: "3/5", finalFrac: "9/10", diffFrac: "3/10", added: 12, capacity: 40 }
  ),
  q(
    49,
    "Divisibility Number Vault",
    "Using the digits 0, 2, 4, 6 and 8 exactly once, form the largest four-digit number that is divisible by both 3 and 8.",
    ["8640", "8624", "8460", "8264"],
    { candidates: [8640, 8624, 8460, 8264], largestValid: 8640 }
  ),
  q(
    50,
    "Master Builder Composite Shape",
    "A large rectangular sheet measures 20 cm × 14 cm. A 6 cm × 5 cm rectangular corner is removed.\nFind:\n(i) the area of the remaining shape, and\n(ii) its perimeter.",
    [
      "250 cm² and 68 cm",
      "250 cm² and 58 cm",
      "260 cm² and 68 cm",
      "260 cm² and 58 cm",
    ],
    { remainingArea: 250, perimeter: 68 }
  ),
];

const ids = (from: number, to: number) => IMO_INTERACTIVE_G6_QUESTIONS.slice(from, to).map((x) => x.id);

export const IMO_INTERACTIVE_G6_EXAM: Exam = {
  id: "imo-class6-master-interactive",
  code: "IMO-CLASS6-MASTER-2026",
  title: "SOF International Mathematics Olympiad 2025-26 (Class 6 - Master Set)",
  subtitle: "Science Olympiad Foundation • Class 6 • Official Master Paper",
  description:
    "Official Science Olympiad Foundation (SOF) International Mathematics Olympiad Class 6 examination covering Logical Reasoning, Mathematical Reasoning, Everyday Mathematics, and the Achievers Section.",
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
      "Section A: Logical Reasoning (Q1–Q15, 1 mark each).",
      "Section B: Mathematical Reasoning (Q16–Q35, 1 mark each).",
      "Section C: Everyday Mathematics (Q36–Q45, 1 mark each).",
      "Section D: Achievers Section (Q46–Q50, 3 marks each).",
      "Total time allowed is 60 minutes. There is no negative marking.",
      "You can navigate freely between questions using the Question Palette.",
    ],
  },
  status: "Published",
  createdAt: "2026-09-28T00:00:00Z",
  updatedAt: "2026-09-28T00:00:00Z",
  sections: [
    { id: "sec_logical", title: "Section A — Logical Reasoning", description: "15 Questions (1 Mark each)", questionIds: ids(0, 15) },
    { id: "sec_math", title: "Section B — Mathematical Reasoning", description: "20 Questions (1 Mark each)", questionIds: ids(15, 35) },
    { id: "sec_everyday", title: "Section C — Everyday Mathematics", description: "10 Questions (1 Mark each)", questionIds: ids(35, 45) },
    { id: "sec_achievers", title: "Section D — Achievers Section", description: "5 Questions (3 Marks each)", questionIds: ids(45, 50) },
  ],
  questionIds: IMO_INTERACTIVE_G6_QUESTIONS.map((q) => q.id),
};
