import { Question } from "@/types/question";
import { Exam } from "@/types/exam";

/**
 * SOF IMO · Class 6 · Set B #2.
 *
 * The correct option for every question comes from the official answer key supplied as
 * `Answer Key 2.pdf` (IMO6B2_KEY below). The printed question booklet itself has not
 * been supplied, so the wording and options here are reconstructed from the activity
 * brief. Every question carries `customConfig.reconstructed = true` and should be checked
 * against the printed paper when it is available.
 *
 * Where the brief's numbers could not produce the keyed answer, the question was adjusted
 * so that it does, and `customConfig.adjusted` says what changed (Q1, Q6, Q12, Q14, Q23,
 * Q30, Q39, Q46, Q49).
 */

export const IMO6B2_KEY =
  "BAADCCBDDC" + "DACDBDCBDA" + "CCCBBABCBD" + "ACBCBCBDDC" + "ADBACBBBAD";

type Section = "Logical Reasoning" | "Mathematical Reasoning" | "Everyday Mathematics" | "Achievers Section";
const sectionOf = (n: number): Section =>
  n <= 15 ? "Logical Reasoning" : n <= 35 ? "Mathematical Reasoning" : n <= 45 ? "Everyday Mathematics" : "Achievers Section";

function q(
  n: number,
  topic: string,
  questionText: string,
  options: [string, string, string, string],
  customConfig: Record<string, unknown> = {},
  difficulty: Question["difficulty"] = "MEDIUM"
): Question {
  const nn = String(n).padStart(2, "0");
  return {
    id: `q_imo6b2_${nn}`,
    questionId: `IMO6B2-Q${nn}`,
    subjectId: "sub_mathematics",
    subjectName: "Mathematics",
    grade: 6,
    section: sectionOf(n),
    chapter: sectionOf(n),
    topic,
    difficulty: n > 45 ? "ACHIEVER" : difficulty,
    questionType: "MULTIPLE_CHOICE",
    questionText,
    marks: n > 45 ? 3 : 1,
    negativeMarks: 0,
    version: 1,
    status: "Published",
    createdAt: "2026-09-25T00:00:00Z",
    updatedAt: "2026-09-25T00:00:00Z",
    multipleChoiceConfig: {
      options: (["A", "B", "C", "D"] as const).map((id, i) => ({ id, text: options[i] })),
      correctOptionId: IMO6B2_KEY[n - 1],
      layout: "list",
    },
    customConfig: { ...customConfig, reconstructed: true },
  } as Question;
}

export const IMO6B2_QUESTIONS: Question[] = [
  /* ── Logical Reasoning ─────────────────────────────────── */
  q(1, "Alphanumeric Series", "How many such symbols are there in the given arrangement, each of which is immediately preceded by a number and immediately followed by a consonant?\n7 # K A 3 @ M 5 $ E 9 % U B & 4 D * T", ["One", "Two", "Three", "Four"], {
    sequence: "7#KA3@M5$E9%UB&4D*T".split(""),
    adjusted: "The brief's sequence (…9 % R B…) has three such symbols; R was changed to U so the keyed answer, two, holds.",
  }),
  q(2, "Figure Analogy", "There is a certain relationship between figures (i) and (ii). Establish the same relationship between figures (iii) and (iv) by selecting the figure that should replace (iv).", [
    "Figure (iii) turned a quarter turn clockwise",
    "Figure (iii) flipped left to right",
    "Figure (iii) turned half a turn",
    "Figure (iii) turned a quarter turn anticlockwise",
  ], {
    figI: { cells: [[0, 0], [1, 0], [2, 0], [2, 1]], dot: [0, 0] },
    figIII: { cells: [[0, 0], [0, 1], [0, 2], [1, 1]], dot: [0, 2] },
    optionTransforms: { A: "rot90", B: "flipH", C: "rot180", D: "rot270" },
    relation: "rot90",
  }),
  q(3, "Coding-Decoding", "If ENGLISH is written as FMHKJRI, how is OCTOBER written in that code?", ["PBUNCDS", "PDUPCFS", "NBSNADQ", "PBUNDCS"], {
    example: { plain: "ENGLISH", coded: "FMHKJRI" },
    target: "OCTOBER",
  }),
  q(4, "Direction Sense", "Pravin walks 30 m towards East, turns right and walks 20 m, then turns right again and walks 30 m. How far is he from his starting point?", ["10 metres", "30 metres", "50 metres", "20 metres"], {
    startFacing: "E",
    step: 10,
  }),
  q(5, "Series Completion", "Each figure is a set of shapes placed one inside another. Which figure comes next in the series?\nFigure 1: square ⊃ circle ⊃ triangle · Figure 2: circle ⊃ triangle ⊃ square · Figure 3: triangle ⊃ square ⊃ circle · Figure 4: ?", [
    "circle ⊃ square ⊃ triangle",
    "triangle ⊃ circle ⊃ square",
    "square ⊃ circle ⊃ triangle",
    "square ⊃ triangle ⊃ circle",
  ], {
    series: [
      ["square", "circle", "triangle"],
      ["circle", "triangle", "square"],
      ["triangle", "square", "circle"],
    ],
    optionStates: {
      A: ["circle", "square", "triangle"],
      B: ["triangle", "circle", "square"],
      C: ["square", "circle", "triangle"],
      D: ["square", "triangle", "circle"],
    },
  }),
  q(6, "Number Arrangement", "If the first and the last digits of each of the numbers 389, 476, 635, 847 and 568 are interchanged, which number will become the second smallest?", ["389", "635", "476", "568"], {
    numbers: [389, 476, 635, 847, 568],
    rank: 2,
    adjusted: "The brief's answer 476 is the second smallest after swapping (536 from 635 is the smallest), so the question asks for the second smallest.",
  }),
  q(7, "Classification", "Group the nine figures into three classes on the basis of their properties.\n1 equilateral triangle · 2 square · 3 circle · 4 rectangle · 5 right-angled triangle · 6 oval · 7 parallelogram · 8 semicircle · 9 scalene triangle", [
    "1, 4, 7 · 2, 5, 8 · 3, 6, 9",
    "1, 5, 9 · 2, 4, 7 · 3, 6, 8",
    "1, 2, 3 · 4, 5, 6 · 7, 8, 9",
    "1, 5, 8 · 2, 4, 7 · 3, 6, 9",
  ], {
    figures: ["equilateral", "square", "circle", "rectangle", "right", "oval", "parallelogram", "semicircle", "scalene"],
  }),
  q(8, "Pattern Completion", "Which figure will complete the pattern in Figure X, where each quarter is the previous quarter turned a quarter turn clockwise?", [
    "The tile as printed",
    "The tile turned 90° clockwise",
    "The tile turned 180°",
    "The tile turned 270° clockwise",
  ], {
    optionStates: { A: { turn: 0, flip: false }, B: { turn: 90, flip: false }, C: { turn: 180, flip: false }, D: { turn: 270, flip: false } },
  }),
  q(9, "Blood Relations", "Pointing to a man, a woman says, “His wife is the only daughter of my father.” How is the man related to the woman?", ["Brother", "Father", "Son-in-law", "Husband"]),
  q(10, "Venn Diagrams", "Which Venn diagram best represents the relationship among Fruit, Mango and Grass?", [
    "Three separate circles",
    "Three circles, one inside another",
    "One circle inside another, with a third circle separate",
    "Two overlapping circles and a third circle separate",
  ], {
    labels: ["Fruit", "Mango", "Grass"],
    optionStates: { A: "all-separate", B: "nested-three", C: "nested-plus-separate", D: "overlap-plus-separate" },
  }),
  q(11, "Embedded Figures", "In which figure is the given pentagon (a square with a triangular roof) hidden exactly, the same size and the same way up?", ["Figure A", "Figure B", "Figure C", "Figure D"], {}),
  q(12, "Number Matrix", "Find the missing number in the grid.\n3 6 8\n5 5 4\n6 9 ?", ["6", "7", "9", "5"], {
    grid: [
      [3, 6, 8],
      [5, 5, 4],
      [6, 9, null],
    ],
    adjusted: "Rule used: third number = difference of the first two + 5, 4, 3 in rows 1, 2, 3.",
  }),
  q(13, "Dot Situation", "In the given figure one dot is in the circle and the triangle only, and the other is in the rectangle and the triangle only. Which arrangement of shapes allows both dots to be placed the same way?", [
    "The triangle inside the rectangle, the circle apart",
    "The circle overlapping the rectangle, the triangle apart",
    "The triangle overlapping both the circle and the rectangle, which do not overlap each other",
    "All three shapes apart",
  ], {
    optionStates: { A: "t-in-r", B: "c-r-only", C: "t-bridges-c-r", D: "all-apart" },
  }),
  q(14, "Word Formation", "How many meaningful English words can be formed with the letters A, I, P and R, using each letter exactly once?", ["Two", "Three", "Four", "None of these"], {
    letters: ["A", "I", "P", "R"],
    dictionary: ["PAIR"],
    adjusted: "Only PAIR uses all four letters, so the count (one) is not among the numbered options.",
  }),
  q(15, "Mirror Images", "A mirror is placed vertically to the right of b4R#q7. Which is its correct mirror image?", [
    "Letters in the same order, turned upside down",
    "Letters in reverse order, each one reversed",
    "Letters in reverse order, not reversed",
    "Letters in the same order, each one reversed",
  ], {
    text: "b4R#q7",
    optionStates: { A: { reversed: false, flipped: "v" }, B: { reversed: true, flipped: "h" }, C: { reversed: true, flipped: "none" }, D: { reversed: false, flipped: "h" } },
  }),

  /* ── Mathematical Reasoning ────────────────────────────── */
  q(16, "Fractions", "Which figure has exactly 3/8 of its area shaded?", [
    "A circle in 6 equal sectors, 3 shaded",
    "A square grid of 8 equal cells, 2 shaded",
    "A triangle in 4 equal parts, 1 shaded",
    "A rectangle in 8 equal strips, 3 shaded",
  ], {
    target: [3, 8],
    figures: {
      A: { parts: 6, shaded: 3, shape: "circle" },
      B: { parts: 8, shaded: 2, shape: "grid" },
      C: { parts: 4, shaded: 1, shape: "triangle" },
      D: { parts: 8, shaded: 3, shape: "strips" },
    },
  }),
  q(17, "Solids", "How many faces does the given solid (a pentagonal prism) have?", ["5", "6", "7", "9"], { solid: "pentagonal-prism" }),
  q(18, "Algebra", "If the cost of 8 pens is ₹ w, what is the cost of 5 pens?", ["₹ (8w/5)", "₹ (5w/8)", "₹ 40w", "₹ (w/40)"], { given: 8, asked: 5, symbol: "w" }),
  q(19, "Area", "A rectangle 20 cm by 12 cm contains a polygon with corners (4, 3), (16, 3), (16, 9), (10, 11) and (4, 9), measured in cm from one corner. Find the area of the shaded part outside the polygon.", ["144 cm²", "164 cm²", "176 cm²", "156 cm²"], {
    rect: { w: 20, h: 12 },
    polygon: [[4, 3], [16, 3], [16, 9], [10, 11], [4, 9]],
  }),
  q(20, "Circles", "Which of the following statements are correct?\n(i) A chord that passes through the centre of a circle is a diameter.\n(ii) The region between a chord and its arc is called a segment.", ["Both (i) and (ii)", "Only (i)", "Only (ii)", "Neither (i) nor (ii)"], {
    verdictOptions: { TT: "A", TF: "B", FT: "C", FF: "D" },
  }),
  q(21, "Whole Numbers", "For whole numbers a and b, which of the following is NOT always true?", ["a + b is a whole number", "a × b is a whole number", "a − b is a whole number", "a × 1 = a"], {
    machines: [
      { id: "A", op: "+" },
      { id: "B", op: "×" },
      { id: "C", op: "−" },
      { id: "D", op: "×1" },
    ],
  }),
  q(22, "Divisibility", "Which digit should replace □ so that 517□324 is divisible by 3?", ["0", "1", "2", "3"], { left: "517", right: "324", divisor: 3, keys: [0, 1, 2, 3] }),
  q(23, "Decimals", "Write 100 + 50 + 3 + 6/10 + 3/10000 as a decimal.", ["153.63", "153.063", "153.6003", "153.0603"], {
    blocks: [
      { id: "b1", label: "100", digit: 1, place: 2 },
      { id: "b2", label: "50", digit: 5, place: 1 },
      { id: "b3", label: "3", digit: 3, place: 0 },
      { id: "b4", label: "6/10", digit: 6, place: -1 },
      { id: "b5", label: "3/10000", digit: 3, place: -4 },
    ],
    adjusted: "The brief's answer 153.6003 is written here as an expanded-form place-value question.",
  }),
  q(24, "Integers", "Which sign should replace the box?  (−25) − (−42) − (−27)  ☐  (−42) − (−25) + (−22)", ["<", ">", "=", "≤"], {
    left: [-25, 42, 27],
    leftText: "(−25) − (−42) − (−27)",
    right: [-42, 25, -22],
    rightText: "(−42) − (−25) + (−22)",
    signs: ["<", ">", "=", "≤"],
  }),
  q(25, "Perimeter", "Find the perimeter of the given L-shaped figure: its sides, in order, are 20 cm, 6 cm, 8 cm, 8 cm, 12 cm and 14 cm.", ["58 cm", "68 cm", "72 cm", "64 cm"], {
    outline: [[0, 0], [20, 0], [20, 6], [12, 6], [12, 14], [0, 14]],
  }),
  q(26, "Percentage & Fractions", "In which figure is exactly 40% of the area shaded?", [
    "A staircase of 10 equal squares, 4 shaded",
    "A circle in 8 equal sectors, 3 shaded",
    "A triangle in 9 equal triangles, 4 shaded",
    "A 3 × 4 grid, 5 shaded",
  ], {
    figures: {
      A: { parts: 10, shaded: [0, 3, 5, 8], shape: "staircase" },
      B: { parts: 8, shaded: [0, 2, 5], shape: "circle" },
      C: { parts: 9, shaded: [0, 2, 5, 7], shape: "triangle" },
      D: { parts: 12, shaded: [0, 3, 6, 8, 11], shape: "grid" },
    },
  }),
  q(27, "Large Numbers", "How is 8,03,25,901 written in words in the Indian system?", [
    "Eighty crore thirty-two lakh fifty-nine thousand one",
    "Eight crore three lakh twenty-five thousand nine hundred one",
    "Eight crore thirty-two lakh fifty-nine thousand one",
    "Eight crore three lakh twenty-five thousand ninety-one",
  ], { number: 80325901 }),
  q(28, "Triangles", "A triangle has all three sides of different lengths. Which statement about its angles is true?", [
    "All angles are equal",
    "Exactly two angles are equal",
    "All angles are of different measures",
    "One angle is always 90°",
  ]),
  q(29, "Fractions", "Simplify: 4 3/5 − 2 7/9 − 1 2/15 − 2/5", ["11/45", "13/45", "17/45", "1 13/45"], {
    start: { whole: 4, num: 3, den: 5 },
    takeaway: [
      { whole: 2, num: 7, den: 9 },
      { whole: 1, num: 2, den: 15 },
      { whole: 0, num: 2, den: 5 },
    ],
    trays: [15, 30, 45, 90],
  }),
  q(30, "HCF", "The HCF of any two consecutive natural numbers is always", ["0", "2", "the smaller number", "1"], {
    adjusted: "The official key gives D; the question is set on consecutive numbers, whose HCF is always 1.",
  }),
  q(31, "Solids", "Name the given solid and give its number of faces, vertices and edges.", [
    "Triangular prism, 5, 6, 9",
    "Triangular pyramid, 4, 4, 6",
    "Triangular prism, 6, 5, 9",
    "Square pyramid, 5, 5, 8",
  ], { solid: "triangular-prism" }),
  q(32, "Symmetry", "State True (T) or False (F).\n(i) A parallelogram has two lines of symmetry.\n(ii) A rectangle has as many lines of symmetry as a square.\n(iii) Every diameter of a circle is a line of symmetry.", ["T, F, T", "F, T, T", "F, F, T", "T, T, F"]),
  q(33, "Word Problems", "Four cities A, B, C and D lie in that order on a straight road. The distance from B to D is 39 km, from A to C is 27 km and from C to D is 15 km. What is the distance from A to B?", ["2 km", "3 km", "12 km", "24 km"], {
    order: ["A", "B", "C", "D"],
    known: [
      { from: "B", to: "D", km: 39 },
      { from: "A", to: "C", km: 27 },
      { from: "C", to: "D", km: 15 },
    ],
    ask: { from: "A", to: "B" },
  }),
  q(34, "Polygons", "Which of the given figures are polygons?\n1 triangle · 2 circle · 3 pentagon · 4 hexagon · 5 an open zig-zag line", ["1, 2 and 5", "2 and 4", "1, 3 and 4", "3 and 5"], {
    shapes: [
      { id: 1, name: "triangle", closed: true, straight: true },
      { id: 2, name: "circle", closed: true, straight: false },
      { id: 3, name: "pentagon", closed: true, straight: true },
      { id: 4, name: "hexagon", closed: true, straight: true },
      { id: 5, name: "zig-zag", closed: false, straight: true },
    ],
  }),
  q(35, "Factors & Multiples", "Which of the following numbers divides 105, 1001 and 2436 exactly?", ["3", "7", "11", "13"], { numbers: [105, 1001, 2436], blocks: [2, 3, 5, 7, 11, 13] }),

  /* ── Everyday Mathematics ──────────────────────────────── */
  q(36, "HCF in Context", "A courtyard 3.78 m by 5.25 m is to be paved with the largest possible identical square tiles. If each tile has side 3n cm, find n.", ["n = 5", "n = 6", "n = 7", "n = 9"], {
    lengthCm: 378,
    widthCm: 525,
  }),
  q(37, "Measurement", "A courier covers a total distance of 35 m. He covers 0.028 km by bicycle and the rest on foot. How far does he walk?", ["3 m", "7 m", "28 m", "0.7 m"], { totalMetres: 35, bikeKm: 0.028 }),
  q(38, "Decimals", "A warehouse has 513.76 kg of rice. 27.895 kg of rice is taken out. How much rice is left?", ["486.865 kg", "485.965 kg", "486.135 kg", "485.865 kg"], { stock: 513.76, removed: 27.895 }),
  q(39, "Money", "An auditorium has 1300 seats: 200 seats at ₹ 500, 200 seats at ₹ 250, 500 seats at ₹ 100 and the remaining seats at ₹ 50. How much money is collected when every seat is sold?", ["₹ 2,00,000", "₹ 2,10,000", "₹ 2,40,000", "₹ 2,20,000"], {
    capacity: 1300,
    sections: [
      { label: "Gold", seats: 200, price: 500 },
      { label: "Silver", seats: 200, price: 250 },
      { label: "Bronze", seats: 500, price: 100 },
      { label: "Gallery", seats: null, price: 50 },
    ],
    adjusted: "The brief's seat numbers already exceeded ₹ 2,20,000, so the sections were resized to give that total.",
  }),
  q(40, "LCM in Context", "Three bells ring at intervals of 30 minutes, 45 minutes and 60 minutes. If they ring together at 5:00 p.m., when will they next ring together?", ["7:00 p.m.", "7:30 p.m.", "8:00 p.m.", "9:00 p.m."], {
    intervals: [30, 45, 60],
    start: { h: 17, m: 0 },
  }),
  q(41, "Fractions in Context", "Arvind's box of chocolates is 7/8 full and Suraj's identical box is 4/5 full. Whose box has more chocolates, and by what fraction of the box?", ["Arvind, 3/40", "Suraj, 3/40", "Arvind, 1/13", "Both have the same"], {
    boxes: [
      { who: "Arvind", num: 7, den: 8 },
      { who: "Suraj", num: 4, den: 5 },
    ],
  }),
  q(42, "Ratio & Speed", "A boat covers 15 km in 6 hours. At the same speed, how far will it travel in 24 hours?", ["40 km", "48 km", "56 km", "60 km"], { km: 15, hours: 6, askHours: 24 }),
  q(43, "Money", "Rahul had ₹ 30. He bought a book for ₹ 6.25 and a toy for ₹ 12.75. How much money is left with him?", ["₹ 12", "₹ 11", "₹ 19", "₹ 10.50"], {
    wallet: 30,
    items: [
      { label: "Book", price: 6.25 },
      { label: "Toy", price: 12.75 },
    ],
  }),
  q(44, "Perimeter", "The cost of fencing a square field at ₹ 14 per metre is ₹ 392. Find the length of each side of the field.", ["7 m", "14 m", "28 m", "98 m"], { cost: 392, rate: 14 }),
  q(45, "Unitary Method", "32 bags of sugar, each weighing 42 kg, cost ₹ 26,880. What is the cost of 25 bags of sugar, each weighing 31 kg?", ["₹ 12,800", "₹ 14,300", "₹ 15,500", "₹ 16,200"], {
    first: { bags: 32, kg: 42, cost: 26880 },
    second: { bags: 25, kg: 31 },
  }),

  /* ── Achievers ─────────────────────────────────────────── */
  q(46, "Area & Perimeter", "The length of rectangle PQRS is twice its breadth. Its length and breadth are each increased by 4 cm to form rectangle VWRT, and the area increases by 226 cm². Find (i) the perimeter of PQRS and (ii) the area of VWRT.", [
    "105 cm, 812.5 cm²",
    "105 cm, 838.5 cm²",
    "110 cm, 838.5 cm²",
    "96 cm, 790 cm²",
  ], {
    ratio: 2,
    grow: 4,
    increase: 226,
    adjusted: "The brief did not give the dimensions; length = 2 × breadth and a 4 cm increase reproduce 105 cm and 838.5 cm².",
  }),
  q(47, "Reasoning with Numbers", "Which of the following statements is incorrect?", [
    "Priya ate 2/3 of a chocolate and Rohan ate 1/4 of it; together they ate 11/12 of the chocolate.",
    "A mountain peak is 2,450 m above sea level and a mine is 350 m below sea level; the difference in their heights is 2,100 m.",
    "Monika is x years old and her father is three times as old; in 5 years her father will be 3x + 5 years old.",
    "12.5 − 7.85 = 4.65",
  ], {
    labs: {
      A: { kind: "fraction", a: [2, 3], b: [1, 4], claim: [11, 12] },
      B: { kind: "height", peak: 2450, mine: -350, claim: 2100 },
      C: { kind: "age", factor: 3, years: 5 },
      D: { kind: "decimal", a: 12.5, b: 7.85, claim: 4.65 },
    },
  }),
  q(48, "Divisibility", "Statement I: If a number is divisible by 5, its last digit is 0 or 5.\nStatement II: Every number that is divisible by 6 is also divisible by 12.\nWhich is correct?", [
    "Both statements are true",
    "Statement I is true but Statement II is false",
    "Statement I is false but Statement II is true",
    "Both statements are false",
  ], {
    verdictOptions: { TT: "A", TF: "B", FT: "C", FF: "D" },
  }),
  q(49, "Lines & Circles", "Match Column I with Column II.\n(P) Number of lines through two given points\n(Q) Number of rays that can start from one point\n(R) Least number of points in which three lines in a plane can meet\n(S) Distance around a circle\nColumn II: One, Infinite, Zero, Circumference", [
    "P → One, Q → Infinite, R → Zero, S → Circumference",
    "P → Infinite, Q → One, R → Zero, S → Circumference",
    "P → One, Q → Zero, R → Infinite, S → Circumference",
    "P → One, Q → Infinite, R → One, S → Circumference",
  ], {
    adjusted: "Three lines need not meet at all (parallel lines), so R matches Zero.",
  }),
  q(50, "Data Handling", "The number of students who got scholarships is shown for 2008–2012 (2008: 3000, 2009: 3500, 2010: 4000, 2011: 4500, 2012: 5000). In a pictograph where one star stands for 500 students, (i) how many stars represent 2010, and (ii) how many more stars represent 2012 than 2009?", ["8 and 2", "10 and 3", "6 and 3", "8 and 3"], {
    rows: [
      { year: 2008, students: 3000 },
      { year: 2009, students: 3500 },
      { year: 2010, students: 4000 },
      { year: 2011, students: 4500 },
      { year: 2012, students: 5000 },
    ],
    perStar: 500,
    ask: { count: 2010, more: 2012, than: 2009 },
  }),
];

const sectionIds = (from: number, to: number) => IMO6B2_QUESTIONS.slice(from, to).map((x) => x.id);

export const IMO6B2_EXAM: Exam = {
  id: "exam_imo_g6_setb2",
  code: "IMO-G6-SETB2",
  title: "SOF International Mathematics Olympiad (Class 6 - Set B #2)",
  subtitle: "Science Olympiad Foundation • Level-1 Practice Paper",
  description:
    "Class 6 Set B #2, scored against the official answer key. Every one of the 50 questions is answered by working an interactive mini-game.",
  subjectId: "sub_mathematics",
  subjectName: "Mathematics & Logical Reasoning",
  grade: 6,
  academicYear: "Set B #2",
  durationMinutes: 60,
  totalQuestions: 50,
  totalMarks: 60,
  passingMarks: 24,
  rules: {
    allowBacktrack: true,
    shuffleQuestions: false,
    showTimer: true,
    autoSubmitOnTimeUp: true,
    passPercentage: 40,
    negativeMarkingEnabled: false,
    instructions: [
      "The question paper comprises four sections: Logical Reasoning (15 questions), Mathematical Reasoning (20 questions), Everyday Mathematics (10 questions) and Achievers Section (5 questions).",
      "Each question in the Achievers Section carries 3 marks, whereas all other questions carry 1 mark each.",
      "All questions are compulsory. There is no negative marking.",
      "Every question is a mini-game. Work the game, then press its violet submit button to record your answer.",
      "You may move freely between questions using the Question Palette. Open the Button guide to see what every control does.",
      "The examination lasts 60 minutes and submits itself when the time expires.",
    ],
  },
  sections: [
    { id: "sec_b2_logical", title: "Logical Reasoning", description: "15 Questions (1 Mark each)", questionIds: sectionIds(0, 15) },
    { id: "sec_b2_math", title: "Mathematical Reasoning", description: "20 Questions (1 Mark each)", questionIds: sectionIds(15, 35) },
    { id: "sec_b2_everyday", title: "Everyday Mathematics", description: "10 Questions (1 Mark each)", questionIds: sectionIds(35, 45) },
    { id: "sec_b2_achievers", title: "Achievers Section", description: "5 Questions (3 Marks each)", questionIds: sectionIds(45, 50) },
  ],
  questionIds: IMO6B2_QUESTIONS.map((x) => x.id),
  status: "Published",
  createdAt: "2026-09-25T00:00:00Z",
  updatedAt: "2026-09-25T00:00:00Z",
} as Exam;
