import { Question } from "@/types/question";
import { Exam } from "@/types/exam";

/**
 * SOF International Mathematics Olympiad 2023–24 · Class 6 · Set C
 * (Question Paper VI Imo - 6.pdf & Answer ket VI Imo - 6.pdf)
 *
 * 50 Questions across 4 Sections:
 *   - Logical Reasoning: Q1–Q15 (1 mark each)
 *   - Mathematical Reasoning: Q16–Q35 (1 mark each)
 *   - Everyday Mathematics: Q36–Q45 (1 mark each)
 *   - Achievers Section: Q46–Q50 (3 marks each)
 */

export const IMO23_24_C_KEY =
  "BCACD" + "BADCD" + "BABCC" + "CBBBA" + "CACCD" + "DABDC" + "DBADA" + "CAACD" + "DCABD" + "BBACA";

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
  const correctOption = IMO23_24_C_KEY[n - 1];
  return {
    id: `imo23_24_c_q${nn}`,
    questionId: `IMO23_24_C-Q${nn}`,
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
      paper: "IMO 2023-24 Class 6 Set C",
      examId: "imo-2023-24-class-6-set-c",
      questionNumber: n,
      ...customConfig,
    },
  } as Question;
}

export const IMO23_24_C_QUESTIONS: Question[] = [
  // ── Q1–Q15: Logical Reasoning ──
  q(
    1,
    "Direction Sense",
    "Riya starts walking from her college towards North. After walking for 10 m, she turns right and walks 25 m. She then turns right again and walks 50 m. Finally, she turns right and walks for 25 m to reach her home. How far is Riya now from her college?",
    ["30 m", "40 m", "25 m", "50 m"],
    { start: "College", path: ["N 10m", "R 25m", "R 50m", "R 25m"], targetDist: 40 }
  ),
  q(
    2,
    "Cube Counting",
    "Count the number of cubes in the given 3D isometric construction.",
    ["20", "21", "22", "18"],
    { totalCubes: 22, layers: [6, 8, 8] }
  ),
  q(
    3,
    "Coding & Decoding",
    "In a certain code language, 'EXAMS' is written as '67249' and 'SHARED' is written as '912563'. How will 'ASHRAM' be written in that code language?",
    ["291524", "791624", "295142", "921523"],
    { ex1: { word: "EXAMS", code: "67249" }, ex2: { word: "SHARED", code: "912563" }, target: "ASHRAM", answer: "291524" }
  ),
  q(
    4,
    "Pattern Completion",
    "Which of the following figures will complete the pattern in the given 2×2 geometric window?",
    ["Figure A", "Figure B", "Figure C", "Figure D"],
    { patternType: "geometric_arc_diagonal", missingQuadrant: "bottom-right", correctFigure: "C" }
  ),
  q(
    5,
    "Venn Diagrams",
    "Which of the following Venn diagrams best represents the relationship amongst, 'Moon, Earth and India'?",
    ["Diagram A", "Diagram B", "Diagram C", "Diagram D"],
    { outer: "Earth", inner: "India", separate: "Moon", correctOption: "D" }
  ),
  q(
    6,
    "Dot Situation",
    "Select a figure from the options which satisfies the same conditions of placement of dots as in the given figure.",
    ["Figure A", "Figure B", "Figure C", "Figure D"],
    { dotConditions: ["triangle-and-square", "circle-only"], correctFigure: "B" }
  ),
  q(
    7,
    "Ranking Order",
    "In a class of 28 students, Gautam is 15th from the bottom. What will be his rank from the top?",
    ["14th", "15th", "13th", "16th"],
    { totalStudents: 28, rankFromBottom: 15, derivedRankFromTop: 14 }
  ),
  q(
    8,
    "Counting Lines",
    "Find the minimum number of straight lines required to draw the given figure.",
    ["8", "9", "10", "11"],
    { minLines: 11 }
  ),
  q(
    9,
    "Paper Folding",
    "A set of three figures P, Q and R showing a sequence of folding of a piece of paper is given. Fig. R shows the manner in which the folded paper has been cut. Select a figure from the options which shows the unfolded form of Fig. R.",
    ["Pattern A", "Pattern B", "Pattern C", "Pattern D"],
    { folds: ["horizontal", "vertical"], punch: "quadrant-corner", correctPattern: "C" }
  ),
  q(
    10,
    "Symbolic Operators",
    "If 'A' denotes '÷', 'B' denotes '+', 'C' denotes '−' and 'D' denotes '×', then find the value of: 17 B 33 A 11 C 5 D 2.",
    ["30", "0", "21", "10"],
    { expression: "17 + 33 / 11 - 5 * 2", intermediate: [17, 3, 10], result: 10 }
  ),
  q(
    11,
    "Figure Matrix",
    "Select a figure from the options which will complete the given 3×3 figure matrix.",
    ["Option A", "Option B", "Option C", "Option D"],
    { matrixShapes: ["square", "circle", "diamond"], matrixDots: [1, 2, 3], correctFigure: "B" }
  ),
  q(
    12,
    "Blood Relations",
    "Pointing towards Sara, Vijay said, 'She is the daughter of my father's father.' How is Sara related to Vijay?",
    ["Aunt", "Mother", "Sister", "Granddaughter"],
    { relationChain: ["Vijay's father", "Grandfather", "Grandfather's daughter"], derivedRelation: "Aunt" }
  ),
  q(
    13,
    "Mirror Images",
    "Select the correct mirror image of the given combination of letters and symbols, if the mirror is placed vertically to the left: F @ M # L ? Y.",
    ["Image A", "Image B", "Image C", "Image D"],
    { text: "F@M#L?Y", mirrorPosition: "left", correctImage: "B" }
  ),
  q(
    14,
    "Series Continuation",
    "Select a figure from the options which will continue the same series as established by the Problem Figures.",
    ["Figure A", "Figure B", "Figure C", "Figure D"],
    { stages: 4, rule: "clockwise 45 deg + alternate arrow inversion", correctFigure: "C" }
  ),
  q(
    15,
    "Analogy",
    "There is a certain relationship between the pair of figures on the either side of ::. Identify the relationship of the left pair and find the missing figure.",
    ["Figure A", "Figure B", "Figure C", "Figure D"],
    { leftPair: "inversion + inner shape shading", correctFigure: "C" }
  ),

  // ── Q16–Q35: Mathematical Reasoning ──
  q(
    16,
    "Lines & Angles",
    "How many pairs of intersecting lines are there in the given figure?",
    ["1", "3", "5", "6"],
    { lines: ["r", "s", "p", "q"], pairs: 3 }
  ),
  q(
    17,
    "Integers",
    "Which of the following gives the maximum value?",
    ["-5 + 7 - 17 + 0", "25 - 31 + 15 - 6", "-18 - 37 + 45 + 5", "50 - 45 - 40 + 15"],
    { values: { A: -15, B: 3, C: -5, D: -20 }, maxOption: "B" }
  ),
  q(
    18,
    "Geometry Angles",
    "How many obtuse angles are formed in the given figure around vertex O?",
    ["5", "4", "3", "2"],
    { obtuseCount: 4 }
  ),
  q(
    19,
    "Symmetry",
    "How many of the following numbers have at least one line of symmetry? 3, 5, 1, 0, 6, 7.",
    ["1", "2", "3", "4"],
    { numbers: ["3", "5", "1", "0", "6", "7"], symmetric: ["3", "0"], count: 2 }
  ),
  q(
    20,
    "Mensuration Area",
    "Find the area of the given composite stepped figure (not drawn to scale).",
    ["25.5 sq. cm", "23.5 sq. cm", "25 sq. cm", "24 sq. cm"],
    { dimensions: [2, 1.5, 3, 1, 2, 3, 6], totalArea: 25.5 }
  ),
  q(
    21,
    "Fractions Ordering",
    "Which of the following options are arranged in ascending order?",
    ["1/2, 7/18, 5/9, 7/27", "5/9, 1/2, 7/18, 7/27", "7/27, 7/18, 1/2, 5/9", "7/27, 5/9, 7/18, 1/2"],
    { fractions: ["7/27", "7/18", "1/2", "5/9"], values: [0.259, 0.389, 0.5, 0.556] }
  ),
  q(
    22,
    "LCM & Divisibility",
    "Find the smallest number which when diminished by 3 is exactly divisible by 21, 28, 36 and 45.",
    ["1263", "1560", "1143", "1290"],
    { divisors: [21, 28, 36, 45], lcm: 1260, result: 1263 }
  ),
  q(
    23,
    "Roman Numerals",
    "Compare and fill in the box: CCCLXXVI + CDXIV [ ? ] DCXIX + CCLXVIII.",
    [">", "=", "<", "Can't be determined"],
    { left: "CCCLXXVI + CDXIV (790)", right: "DCXIX + CCLXVIII (887)", comparator: "<" }
  ),
  q(
    24,
    "Data Handling",
    "If Alok's father gives him 12 more shirts, then how many more shirts does he have now than the number of shirts Virat bought?",
    ["22", "32", "27", "35"],
    { alokInitial: 35, virat: 20, alokNew: 47, difference: 27 }
  ),
  q(
    25,
    "Ratio & Proportion",
    "Find the ratio of number of shirts bought by Tarun to the number of shirts bought by Vinit and Ronak together.",
    ["17:12", "13:25", "12:13", "12:17"],
    { tarun: 60, vinit: 40, ronak: 45, ratio: "12:17" }
  ),
  q(
    26,
    "Algebra",
    "Equation for the statement: 'Twice the product of m and n is equal to thrice of their difference' is:",
    ["3mn = 2(m - n)", "mn = 2(m - n)", "2mn = m - n", "2mn = 3(m - n)"],
    { leftTerm: "2mn", rightTerm: "3(m - n)", equation: "2mn = 3(m - n)" }
  ),
  q(
    27,
    "Geometry & Clock Angles",
    "Which of the following hands of the clocks shows 1/4 of a revolution?",
    ["Clock A", "Clock B", "Clock C", "Clock D"],
    { targetAngleDeg: 90, targetRevolution: "1/4", correctClock: "A" }
  ),
  q(
    28,
    "Decimals",
    "Which of the following options equals to (0.5 / 0.05) + (0.05 / 0.5)?",
    ["0.5", "10.1", "1.1", "5.5"],
    { term1: 10, term2: 0.1, result: 10.1 }
  ),
  q(
    29,
    "Divisibility Rules",
    "If the number 455?656 is completely divisible by 3, then the smallest whole number in place of ? will be:",
    ["8", "0", "1", "2"],
    { digits: [4, 5, 5, "?", 6, 5, 6], baseSum: 31, minDigit: 2 }
  ),
  q(
    30,
    "Perimeter",
    "Find the perimeter of the shaded part of the given figure (each tile 4 cm × 4 cm).",
    ["84 cm", "92 cm", "96 cm", "None of these"],
    { tileSizeCm: 4, exposedEdges: 24, perimeterCm: 96 }
  ),
  q(
    31,
    "Algebraic Evaluation",
    "If a = 35, b = 11 and c = 23, then find a × (c - b).",
    ["375", "495", "235", "420"],
    { a: 35, b: 11, c: 23, result: 420 }
  ),
  q(
    32,
    "Number System",
    "Read the given statements carefully and select the correct option:\nStatement I: Predecessor of largest 7-digit even number is even.\nStatement II: In International system of numeration, 54137083 is written as fifty four million one hundred thirty seven thousand and eighty three.",
    ["Only I is true", "Only II is true", "Both I and II are true", "Neither I nor II is true"],
    { s1: false, s2: true, verdict: "Only II is true" }
  ),
  q(
    33,
    "Basic Geometry",
    "How many of the following curves are open?",
    ["3", "4", "2", "5"],
    { totalCurves: 5, openCount: 3 }
  ),
  q(
    34,
    "Everyday Money & Time",
    "A car was parked in a parking lot from 5:00 p.m. to 9:45 p.m. How much does it cost for parking? (First hour = ₹18.50, Every additional half an hour or part thereof = ₹5).",
    ["₹ 74", "₹ 33.50", "₹ 35", "₹ 58.50"],
    { startTime: "5:00 PM", endTime: "9:45 PM", durationH: 4.75, firstHourRate: 18.5, addHalfRate: 5, totalCost: 58.5 }
  ),
  q(
    35,
    "Place Value & Face Value",
    "Find the place value of 9 + place value of 3 - face value of 5 in 4325907.",
    ["300895", "11", "30895", "3800895"],
    { number: 4325907, pv9: 900, pv3: 300000, fv5: 5, result: 300895 }
  ),

  // ── Q36–Q45: Everyday Mathematics ──
  q(
    36,
    "Algebraic Word Problems",
    "An apple costs ₹ x and a mango costs ₹ 5 more than the cost of an apple. Find the total cost (in ₹) of 5 apples and 4 mangoes.",
    ["5x + 20", "5x + 10", "9x + 20", "None of these"],
    { applePrice: "x", mangoPrice: "x + 5", totalCostExpr: "9x + 20" }
  ),
  q(
    37,
    "Whole Number Multiplication",
    "Priyanka needs to type 1950 pages. If the number of words on each page is 315, then find the total number of words she will type in all.",
    ["614250", "585000", "635270", "595480"],
    { pages: 1950, wordsPerPage: 315, totalWords: 614250 }
  ),
  q(
    38,
    "Integers & Displacement",
    "Manya travelled 465 km towards South and Ananya travelled 644 km towards North from the same point. Find the distance between their final destinations.",
    ["1109 km", "-1109 km", "1080 km", "179 km"],
    { southKm: 465, northKm: 644, separationKm: 1109 }
  ),
  q(
    39,
    "Ratios & Algebra",
    "There were 64 boys and some girls at a party. After one hour, 24 boys left and 30 more girls joined the party. After this, the ratio of the number of boys to the number of girls at the party became 2 : 5. How many girls were there at first?",
    ["65", "60", "70", "130"],
    { initialBoys: 64, boysLeft: 24, girlsJoined: 30, finalRatio: "2:5", initialGirls: 70 }
  ),
  q(
    40,
    "Fraction Applications",
    "Mrs. Sinha is a piano teacher. She taught a total of 24 hours in the month of September. Each class lasted 3/4 hour. How many classes did she teach in the month of September?",
    ["42", "40", "28", "32"],
    { totalHours: 24, classDurationH: 0.75, totalClasses: 32 }
  ),
  q(
    41,
    "HCF Applications",
    "Three tankers contain 4200 L, 5040 L and 6750 L of water. What is the maximum capacity of a container that can measure all three quantities exactly?",
    ["42 L", "50 L", "60 L", "30 L"],
    { capacities: [4200, 5040, 6750], hcfL: 30 }
  ),
  q(
    42,
    "Fractions of Time",
    "In a day of 24 hours, if Garima spends 8 hours in office, 4 hours in travelling, 5 hours in playing with her son and rest time in sleeping, then what fraction of a day she spends in sleeping?",
    ["7/26", "26/7", "7/24", "24/7"],
    { totalHours: 24, officeH: 8, travelH: 4, playH: 5, sleepH: 7, sleepFraction: "7/24" }
  ),
  q(
    43,
    "Arithmetic & Costing",
    "Sonali buys 25 pencils and 25 pens for distributing to her friends on her birthday. If the cost of a pencil is ₹ 8 and that of a pen is ₹ 15, then how much total amount does she spend?",
    ["₹ 575", "₹ 615", "₹ 425", "₹ 585"],
    { pencilCount: 25, pencilRate: 8, penCount: 25, penRate: 15, totalCost: 575 }
  ),
  q(
    44,
    "Decimals & Journey",
    "Mayank travelled 352.15 km in three days. If he travelled 115.28 km on first day and 79.50 km on second day, then how much distance did he travel on the third day?",
    ["98.51 km", "157.37 km", "85.40 km", "None of these"],
    { totalKm: 352.15, day1Km: 115.28, day2Km: 79.5, day3Km: 157.37 }
  ),
  q(
    45,
    "Area & Dimensions",
    "The total cost of flooring a room is ₹ 2160. The rate of flooring is ₹ 45 per square metre. If the room is 8 metres long, then find its breadth.",
    ["11 m", "7 m", "12 m", "6 m"],
    { totalCost: 2160, ratePerSqM: 45, lengthM: 8, areaSqM: 48, breadthM: 6 }
  ),

  // ── Q46–Q50: Achievers Section (3 Marks Each) ──
  q(
    46,
    "Integers Investigation",
    "Read the given statements carefully and select the correct option:\nStatement-I: The value of (30) + (-53) + (-63) + (-40) + (20) - (-21) - (21) - (-53) + (-30) - (-63) - (-40) - (20) is -15.\nStatement-II: On subtracting the greatest 5-digit number from the additive inverse of 1000, we get 100000.",
    [
      "Both Statement-I and Statement-II are true.",
      "Both Statement-I and Statement-II are false.",
      "Statement-I is true but Statement-II is false.",
      "Statement-I is false but Statement-II is true.",
    ],
    { s1Result: 0, s2Result: -100999, verdict: "Both Statement-I and Statement-II are false." }
  ),
  q(
    47,
    "Lines, Intersections & Concurrency",
    "Study the given figure carefully and answer:\n(i) How many pairs of perpendicular lines are there?\n(ii) How many pairs of intersecting lines are there?\n(iii) How many concurrent lines are there?",
    ["(i) 2, (ii) 6, (iii) 2", "(i) 3, (ii) 7, (iii) 0", "(i) 4, (ii) 5, (iii) 1", "(i) 3, (ii) 3, (iii) 2"],
    { perpendicular: 3, intersecting: 7, concurrent: 0, tuple: "3, 7, 0" }
  ),
  q(
    48,
    "Data Handling & Ratios",
    "Out of 150 students, 45 like noodles, 30 like pizza, 25 like burger and rest like pasta. Match the ratios:\n(i) Pizza to Pasta\n(ii) Noodles to Total\n(iii) Burger to Noodles",
    [
      "(i) → (q); (ii) → (r); (iii) → (p)",
      "(i) → (p); (ii) → (r); (iii) → (q)",
      "(i) → (p); (ii) → (q); (iii) → (r)",
      "(i) → (q); (ii) → (p); (iii) → (r)",
    ],
    { pizza: 30, noodles: 45, burger: 25, pasta: 50, ratios: { i: "3:5 (q)", ii: "3:10 (r)", iii: "5:9 (p)" } }
  ),
  q(
    49,
    "Mensuration & Perimeter Investigation",
    "Read the given statements carefully and state T for true and F for false:\n(i) The length and breadth of a rectangular floor are in the ratio 7:5. If perimeter is 216 m, its area is 2835 sq. m.\n(ii) A table top measures 4 m 25 cm by 3 m 10 cm. The cost of lacing boundary at ₹15/m is ₹110.\n(iii) The perimeter of a regular pentagon of side 5 m is 20 m.",
    ["F, T, F", "F, F, T", "T, F, F", "T, F, T"],
    { s1: true, s2: false, s3: false, tuple: "T, F, F" }
  ),
  q(
    50,
    "Pictograph Analytics",
    "The given pictograph shows laptops sold by stores P, Q, R, S, T (each icon = 4 laptops).\n(i) How many more laptops did store S sell than store Q?\n(ii) Find the fraction of total laptops sold by stores P and R together to the total laptops sold by all five stores.",
    ["(i) 10, (ii) 17/38", "(i) 12, (ii) 17/38", "(i) 10, (ii) 15/38", "(i) 8, (ii) 19/38"],
    { stores: { P: 20, Q: 24, R: 14, S: 34, T: 60 }, total: 152, diffSQ: 10, fractionPR: "17/38" }
  ),
];

const ids = (from: number, to: number) => IMO23_24_C_QUESTIONS.slice(from, to).map((x) => x.id);

export const IMO23_24_C_EXAM: Exam = {
  id: "imo-2023-24-class-6-set-c",
  code: "IMO-2023-24-G6-SET-C",
  title: "SOF International Mathematics Olympiad 2023-24 (Class 6 - Set C)",
  subtitle: "Science Olympiad Foundation • Class 6 • Set C • Level 1 Paper",
  description:
    "Official SOF International Mathematics Olympiad (IMO) Class 6 Question Paper Set C (2023-24) covering Logical Reasoning, Mathematical Reasoning, Everyday Mathematics, and the Achievers Section.",
  subjectId: "sub_mathematics",
  subjectName: "Mathematics & Logical Reasoning",
  grade: 6,
  academicYear: "2023-24",
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
      "The question paper comprises four sections: Logical Reasoning (15 questions), Mathematical Reasoning (20 questions), Everyday Mathematics (10 questions) and Achievers Section (5 questions).",
      "Each question in the Achievers Section carries 3 marks, whereas all other questions carry 1 mark each.",
      "All questions are compulsory. There is no negative marking.",
      "You may move freely between questions using the Question Palette.",
      "The examination lasts 60 minutes and submits automatically when time expires.",
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
  questionIds: IMO23_24_C_QUESTIONS.map((q) => q.id),
};
