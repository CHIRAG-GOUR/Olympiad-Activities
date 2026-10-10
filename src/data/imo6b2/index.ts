import { Question } from "@/types/question";
import { Exam } from "@/types/exam";

/**
 * Exam 5 — SOF 9th IMO · Class 6 · Set B (Question Paper VI Imo - 2.pdf).
 *
 * Wording, options and figures are transcribed from the scanned paper; the correct options
 * come from the official key (`Answer Key 2.pdf`, the same as `Answer ket VI Imo - 2.pdf`).
 * Every question was also solved independently. They agree on 49 of 50: for Q39 the
 * printed seat numbers give ₹ 3,20,000 (C) while the key prints D, so Q39 is scored as C
 * and carries `discrepancy` (the same practice as Paper 3's verified answers).
 *
 * Figures are redrawn as data so the games can let the student work on them. Where a
 * scanned figure could not be reproduced exactly, the redraw keeps the property the
 * question tests; those questions carry `customConfig.redrawn`.
 */

export const IMO6B2_KEY =
  "BAADCCBDDC" + "DACDBDCBDA" + "CCCBBABCBD" + "ACBCBCBDDC" + "ADBACBBBAD";

/** Where the verified answer differs from the printed key. */
const VERIFIED: Record<number, string> = { 39: "C" };

type Section = "Logical Reasoning" | "Mathematical Reasoning" | "Everyday Mathematics" | "Achievers Section";
const sectionOf = (n: number): Section =>
  n <= 15 ? "Logical Reasoning" : n <= 35 ? "Mathematical Reasoning" : n <= 45 ? "Everyday Mathematics" : "Achievers Section";

type P = [number, number];

function q(
  n: number,
  topic: string,
  questionText: string,
  options: [string, string, string, string],
  customConfig: Record<string, unknown> = {}
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
    difficulty: n > 45 ? "ACHIEVER" : "MEDIUM",
    questionType: "MULTIPLE_CHOICE",
    questionText,
    marks: n > 45 ? 3 : 1,
    negativeMarks: 0,
    version: 2,
    status: "Published",
    createdAt: "2026-09-25T00:00:00Z",
    updatedAt: "2026-09-27T00:00:00Z",
    multipleChoiceConfig: {
      options: (["A", "B", "C", "D"] as const).map((id, i) => ({ id, text: options[i] })),
      correctOptionId: VERIFIED[n] ?? IMO6B2_KEY[n - 1],
      layout: "list",
    },
    customConfig: { paper: "9th IMO Class 6 Set B", ...customConfig },
  } as Question;
}

/* ── figure builders ─────────────────────────────────────────── */

const r3 = (v: number) => +v.toFixed(3);
function sectors(n: number, cx = 50, cy = 50, r = 40): P[][] {
  return Array.from({ length: n }, (_, i) => {
    const a0 = (i / n) * Math.PI * 2 - Math.PI / 2;
    const a1 = ((i + 1) / n) * Math.PI * 2 - Math.PI / 2;
    return [[cx, cy], ...Array.from({ length: 7 }, (_, k) => [r3(cx + r * Math.cos(a0 + ((a1 - a0) * k) / 6)), r3(cy + r * Math.sin(a0 + ((a1 - a0) * k) / 6))] as P)];
  });
}
/** Unit squares at the given cells, side s, starting at (ox, oy). */
function squares(cells: P[], s: number, ox: number, oy: number): P[][] {
  return cells.map(([c, r]) => [[ox + c * s, oy + r * s], [ox + (c + 1) * s, oy + r * s], [ox + (c + 1) * s, oy + (r + 1) * s], [ox + c * s, oy + (r + 1) * s]]);
}
/** A cols × rows grid of squares, each cut on its diagonal into two triangles. */
function halvedGrid(cols: number, rows: number, s: number, ox: number, oy: number): P[][] {
  const out: P[][] = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const x = ox + c * s;
      const y = oy + r * s;
      out.push([[x, y + s], [x + s, y], [x, y]], [[x, y + s], [x + s, y + s], [x + s, y]]);
    }
  return out;
}
/** A six-pointed star as 12 equal triangles: the six points and the six pieces of its hexagon. */
function star12(cx = 50, cy = 50, R = 42): P[][] {
  const r = R / Math.sqrt(3);
  const outer = (k: number): P => [r3(cx + R * Math.cos(-Math.PI / 2 + (k * Math.PI) / 3)), r3(cy + R * Math.sin(-Math.PI / 2 + (k * Math.PI) / 3))];
  const inner = (k: number): P => [r3(cx + r * Math.cos(-Math.PI / 2 + Math.PI / 6 + (k * Math.PI) / 3)), r3(cy + r * Math.sin(-Math.PI / 2 + Math.PI / 6 + (k * Math.PI) / 3))];
  const pts: P[][] = [];
  for (let k = 0; k < 6; k++) pts.push([outer(k), inner(k), inner((k + 5) % 6)]);
  for (let k = 0; k < 6; k++) pts.push([[cx, cy], inner(k), inner((k + 5) % 6)]);
  return pts;
}
/** Three rhombuses in a row, each cut by its diagonals into 4 triangles. */
function rhombusRow(): P[][] {
  return [0, 1, 2].flatMap((k) => {
    const cx = 18 + k * 32;
    const c: P = [cx, 50];
    const t: P = [cx, 34], rr: P = [cx + 16, 50], b: P = [cx, 66], l: P = [cx - 16, 50];
    return [[c, t, rr], [c, rr, b], [c, b, l], [c, l, t]] as P[][];
  });
}

export const IMO6B2_QUESTIONS: Question[] = [
  /* ── Logical Reasoning ─────────────────────────────────── */
  q(1, "Alphanumeric Series", "How many such symbols are there in the given arrangement, each of which is immediately preceded by a number and immediately followed by a consonant?\nR 5 M E % 4 W 1 A 2 D # K $ 3 P 9 @ F B © 8 J I 7 * H 6 Q V Y", ["One", "Two", "Three", "More than three"], {
    sequence: "R5ME%4W1A2D#K$3P9@FB©8JI7*H6QVY".split(""),
  }),
  q(2, "Figure Analogy", "There is a certain relationship between figures (i) and (ii). Establish a similar relationship between figures (iii) and (iv) by selecting a suitable figure from the given options which will replace the (?) in figure (iv).\n(i): small ○ top-left, a line in the middle, + bottom-right. (ii): + top-left, a large ○ in the middle, a small line bottom-right. (iii): small □ top-left, a long rectangle in the middle, Δ bottom-right.", [
    "Δ top-left, large □ in the middle, small rectangle bottom-right",
    "Small rectangle top-left, large □ in the middle, Δ bottom-right",
    "Small rectangle top-left, Δ in the middle, ○ bottom-right",
    "Small rectangle top-left, long rectangle in the middle, small □ bottom-right",
  ], {
    fig1: { TL: "○", C: "—", BR: "+" },
    fig2: { TL: "+", C: "○", BR: "−" },
    fig3: { TL: "□", C: "▭", BR: "Δ" },
    optionStates: {
      A: { TL: "Δ", C: "□", BR: "▭" },
      B: { TL: "▭", C: "□", BR: "Δ" },
      C: { TL: "▭", C: "Δ", BR: "○" },
      D: { TL: "▭", C: "▭", BR: "□" },
    },
  }),
  q(3, "Coding-Decoding", "In a certain code language, ENGLISH is written as FMHKJRI. How is OCTOBER written in that code?", ["PBUNCDS", "PBUCNSD", "BPUNCSD", "PBUCNDS"], {
    example: { plain: "ENGLISH", coded: "FMHKJRI" },
    target: "OCTOBER",
  }),
  q(4, "Direction Sense", "Pravin walked 30 metres towards East, took a right turn and walked 20 metres, again took a right turn and walked 30 metres. How far is he from his starting point?", ["30 metres", "80 metres", "50 metres", "20 metres"], {
    startFacing: "E",
    step: 10,
  }),
  q(5, "Series Completion", "Select a figure from the options which will continue the same series as established by the Problem Figures.\nProblem figures: a small Δ; a large Δ holding a small □; a small □; a large □ holding a small shield-shaped pentagon; a small shield-shaped pentagon; ?", [
    "A large □ holding a small □",
    "A large house-shaped pentagon holding a small □",
    "A large shield-shaped pentagon holding a small hexagon",
    "A large hexagon holding a small hexagon",
  ], {
    series: [
      [null, "triangle"],
      ["triangle", "square"],
      [null, "square"],
      ["square", "shield"],
      [null, "shield"],
    ],
    optionStates: {
      A: ["square", "square"],
      B: ["house", "square"],
      C: ["shield", "hexagon"],
      D: ["hexagon", "hexagon"],
    },
  }),
  q(6, "Number Arrangement", "Which number will be the smallest, if the first and the last digits of each of the following numbers are interchanged?\n389   476   635   847   568", ["389", "476", "635", "847"], {
    numbers: [389, 476, 635, 847, 568],
    rank: 1,
  }),
  q(7, "Classification", "Arrange the given figures into three classes using each figure only once.\n1 an open curve crossed by a line · 2 a triangle with a line through it · 3 a rectangle with a line through it · 4 a circle resting on a line · 5 an arrow on a line · 6 a triangle with a line along one side · 7 a square with a line along one side · 8 an open figure crossed by a line · 9 a circle with a line through it", [
    "1, 3, 9 ; 2, 5, 8 ; 4, 6, 7",
    "1, 5, 8 ; 4, 6, 7 ; 2, 3, 9",
    "2, 5, 9 ; 1, 3, 8 ; 2, 6, 7",
    "1, 8, 9 ; 4, 6, 7 ; 2, 3, 5",
  ], {
    figures: ["openCross", "triThrough", "rectThrough", "circleTouch", "arrowLine", "triTouch", "squareTouch", "openCross2", "circleThrough"],
    redrawn: "The nine small figures are redrawn; each keeps whether its line passes through a closed figure, only touches one, or crosses an open figure.",
  }),
  q(8, "Pattern Completion", "Which of the following options will complete the pattern in Fig. (X)?\n(Fig. X is a square design whose lower middle triangle is missing; the design is the same above and below its middle line.)", [
    "The top piece as it is, pointing down",
    "The top piece turned half a turn",
    "The top piece flipped left to right, pointing down",
    "The top piece reflected top to bottom",
  ], {
    optionStates: { A: { turn: 0, flip: false }, B: { turn: 180, flip: false }, C: { turn: 0, flip: true }, D: { turn: 180, flip: true } },
    redrawn: "The pattern is redrawn with a lopsided top piece so that turning it and reflecting it give different pictures, as the printed options do.",
  }),
  q(9, "Blood Relations", "Introducing a man, a woman says, \"His wife is the only daughter of my father.\" How is the man related to the woman?", ["Brother", "Father-in-law", "Brother-in-law", "Husband"]),
  q(10, "Venn Diagrams", "Which of the following Venn diagrams best represents the relationship amongst \"Fruit, Mango, Grass\"?", [
    "Three circles, one inside another",
    "Three circles all overlapping one another",
    "One circle inside another, with a third circle apart",
    "Three circles overlapping in a chain",
  ], {
    labels: ["Fruit", "Mango", "Grass"],
    optionStates: { A: "nested-three", B: "overlap-all", C: "nested-plus-separate", D: "overlap-chain" },
  }),
  q(11, "Embedded Figures", "In which of the following figures, Fig. (X) is exactly embedded as one of its part?\n(Fig. X: a short bar across the top, a long stem down from its middle, then a short step to the right and a short drop.)", [
    "Figure A — a tower of bars with two long legs",
    "Figure B — a slanted roof over a box, with short legs and a hook",
    "Figure C — an open box with a wheel and an arrow below",
    "Figure D — a stick figure with arms, a body and curled feet",
  ], {
    target: [[[0, 0], [2, 0]], [[1, 0], [1, 3]], [[1, 3], [2, 3]], [[2, 3], [2, 4]]],
    rooms: {
      A: [[[0, 1], [4, 1]], [[1, 1], [1, 5]], [[3, 1], [3, 5]], [[0, 0], [0, 1]], [[1, 3], [3, 3]], [[4, 1], [4, 2]], [[0, 0], [3, 0]]],
      B: [[[0, 1], [2, 1]], [[1, 1], [1, 3]], [[2, 3], [3, 3]], [[3, 3], [3, 4]], [[0, 0], [4, 0]], [[4, 0], [4, 4]], [[1, 3], [1, 5]]],
      C: [[[0, 0], [4, 0]], [[2, 0], [2, 3]], [[1, 3], [2, 3]], [[1, 3], [1, 4]], [[0, 0], [0, 4]], [[4, 0], [4, 4]], [[3, 3], [3, 5]]],
      D: [[[0, 1], [4, 1]], [[2, 0], [2, 1]], [[2, 1], [2, 4]], [[2, 4], [3, 4]], [[3, 4], [3, 5]], [[1, 1], [1, 4]], [[1, 4], [2, 4]], [[1, 4], [1, 5]]],
    },
    redrawn: "The four option figures are redrawn on a grid; only figure D contains Fig. (X) exactly, as in the printed paper.",
  }),
  q(12, "Number Matrix", "Find the missing number, if a certain rule is followed row-wise or column-wise.\n3 6 8\n5 5 4\n6 9 ?", ["6", "7", "8", "9"], {
    grid: [
      [3, 6, 8],
      [5, 5, 4],
      [6, 9, null],
    ],
    note: "The paper does not state the rule; third = (difference of the first two) + 5, 4, 3 fits both complete rows and gives the keyed answer.",
  }),
  q(13, "Dot Situation", "Which of the following options satisfies the same condition of placement of the dots as in Fig. (X)?\n(Fig. X: one dot lies in the circle and the triangle only; the other lies in the circle only.)", [
    "Figure A — a slanted four-sided shape over a square, with a circle below",
    "Figure B — a circle over a square, with a long triangle across the square",
    "Figure C — a circle overlapping a square, with a triangle across both",
    "Figure D — a triangle around a circle, with a square below",
  ], {
    given: { circle: [50, 42, 22], square: [28, 42, 44], triangle: [[6, 64], [56, 6], [92, 30]], dots: [[51, 26], [36, 30]] },
    rules: [
      { dot: 1, inside: ["circle", "triangle"], outside: ["square"] },
      { dot: 2, inside: ["circle"], outside: ["triangle", "square"] },
    ],
    figures: {
      A: { circle: [50, 68, 20], square: [26, 20, 48], triangle: [[30, 62], [40, 24], [70, 40]] },
      B: { circle: [50, 34, 22], square: [28, 34, 44], triangle: [[10, 60], [88, 48], [95, 82]] },
      C: { circle: [40, 45, 24], square: [40, 40, 40], triangle: [[10, 90], [60, 8], [78, 24]] },
      D: { circle: [50, 50, 18], square: [32, 58, 36], triangle: [[12, 76], [50, 6], [88, 76]] },
    },
    hints: ["Look for a part of the circle that is inside the triangle but outside the square.", "Then look for a part of the circle that is outside both other shapes."],
    redrawn: "Option A's four-sided shape is drawn as a triangle that stays inside the square; the regions each option offers are as printed.",
  }),
  q(14, "Word Formation", "How many meaningful English words can be formed from the letters A, I, P, R using each letter only once?", ["Six", "Five", "Four", "None of these"], {
    letters: ["A", "I", "P", "R"],
    dictionary: ["PAIR"],
  }),
  q(15, "Mirror Images", "Select the correct mirror image of the given combination, if mirror is placed vertically to the right.\n◒ M 2 T h 5 F 8 1 ◓", [
    "The characters in the same order, each turned upside down",
    "The characters in reverse order, each reversed left to right",
    "The characters in the same order, turned upside down, with the 5 left upright",
    "The characters in a mixed order, each reversed left to right",
  ], {
    text: "◒M2Th5F81◓",
    optionStates: {
      A: { seq: "◒M2Th5F81◓", flip: "v" },
      B: { seq: "◓18F5hT2M◒", flip: "h" },
      C: { seq: "◒M2Th5F81◓", flip: "v5" },
      D: { seq: "◓M8F5hT21◒", flip: "h" },
    },
    hints: ["A mirror on the right shows the last character first.", "In a mirror each character is reversed left to right, not turned upside down."],
  }),

  /* ── Mathematical Reasoning ────────────────────────────── */
  q(16, "Fractions", "Select the INCORRECT match of equivalent shaded fraction given in Column-I and Column-II.", [
    "A — half a circle shaded / 4 of 8 squares shaded",
    "B — 6 of 12 star pieces shaded / 6 of 12 rhombus pieces shaded",
    "C — 3 of 9 squares shaded / 6 of 18 triangles shaded",
    "D — 2 of 8 circle sectors shaded / 9 of 18 triangles shaded",
  ], {
    pairs: {
      A: [
        { regions: sectors(2), shaded: [1] },
        { regions: squares([[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [0, 2], [1, 2]], 22, 17, 17), shaded: [0, 3, 6, 7] },
      ],
      B: [
        { regions: star12(), shaded: [0, 2, 4, 7, 9, 11] },
        { regions: rhombusRow(), shaded: [0, 2, 5, 7, 8, 10] },
      ],
      C: [
        { regions: squares([[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [0, 2], [1, 2], [2, 2]], 22, 17, 17), shaded: [0, 4, 8] },
        { regions: halvedGrid(3, 3, 22, 17, 17), shaded: [0, 3, 7, 8, 12, 17] },
      ],
      D: [
        { regions: sectors(8), shaded: [1, 2] },
        { regions: halvedGrid(3, 3, 22, 17, 17), shaded: [0, 2, 4, 6, 8, 10, 12, 14, 16] },
      ],
    },
    redrawn: "The shaded pieces are redrawn as equal parts so each fraction can be counted.",
  }),
  q(17, "Solids", "How many faces does the given solid have? (It is a pentagonal prism.)", ["5", "6", "7", "10"], { solid: "pentagonal-prism" }),
  q(18, "Algebra", "If 8 pens cost ₹ w, find the cost of 5 such pens.", ["₹ 40w", "₹ (5w/8)", "₹ (80w/5)", "₹ (w/40)"], { given: 8, symbol: "w" }),
  q(19, "Area", "The perimeter of rectangle ABCD is 76 cm. AB is 3 times as long as AE. BC is twice as long as BJ. Find the shaded area in the given figure. (BC = 20 cm; the corner cuts at A and D are as long as AE.)", ["132 cm²", "148 cm²", "150 cm²", "156 cm²"], {
    perimeter: 76,
    bc: 20,
    abOverAe: 3,
    bcOverBj: 2,
  }),
  q(20, "Circles", "Which of the following statements is CORRECT?\n(i) A sector is the region in the interior of a circle enclosed by an arc on one side and a pair of radii on the other two sides.\n(ii) A segment of a circle is the region in the interior of the circle enclosed by an arc and a chord.", ["Both (i) & (ii)", "Only (i)", "Only (ii)", "Neither (i) nor (ii)"], {
    verdictOptions: { TT: "A", TF: "B", FT: "C", FF: "D" },
  }),
  q(21, "Whole Numbers", "Which of the following statements is INCORRECT with respect to the whole numbers?", [
    "They are closed under addition and multiplication.",
    "Division by 0 is not defined.",
    "Addition and subtraction are commutative.",
    "Multiplication is distributive over addition.",
  ]),
  q(22, "Divisibility", "If the number 517*324 is exactly divisible by 3, then the smallest whole number in place of * will be", ["0", "1", "2", "3"], { left: "517", right: "324", divisor: 3, keys: [0, 1, 2, 3] }),
  q(23, "Decimals & Place Value", "If 47.2506 = 4A + 7/B + 2C + 5/D + 6E, then the value of 5A + 3B + 6C + D + 3E is", ["53.6003", "53.603", "153.6003", "213.0003"], {
    target: 47.2506,
    terms: [
      { k: "A", coef: 4, recip: false },
      { k: "B", coef: 7, recip: true },
      { k: "C", coef: 2, recip: false },
      { k: "D", coef: 5, recip: true },
      { k: "E", coef: 6, recip: false },
    ],
    ask: { A: 5, B: 3, C: 6, D: 1, E: 3 },
    askText: "5A + 3B + 6C + D + 3E",
    cards: [0.0001, 0.001, 0.01, 0.1, 1, 10, 100, 1000],
    hints: ["Each term supplies one digit of 47.2506: 4A gives the 4 tens, 7/B gives the 7 ones, and so on.", "For 5/D to be 0.05, D must be 100."],
  }),
  q(24, "Integers", "Which sign will come in the box to make the expression true?\n(−25) − (−42) − (−27) ☐ (−42) − (−25) + (−22)", ["<", ">", "=", "≤"], {
    left: [-25, 42, 27],
    leftText: "(−25) − (−42) − (−27)",
    right: [-42, 25, -22],
    rightText: "(−42) − (−25) + (−22)",
    signs: ["<", ">", "=", "≤"],
  }),
  q(25, "Perimeter", "Find the perimeter of the given figure. (A pinwheel made of 1 cm wide strips; its sides measure 1 cm, 4 cm, 3 cm, 4 cm and 5 cm on each of its four arms.)", ["17 cm", "68 cm", "43 cm", "96 cm"], {
    outline: [[0, 9], [1, 9], [1, 5], [4, 5], [4, 9], [9, 9], [9, 8], [5, 8], [5, 5], [9, 5], [9, 0], [8, 0], [8, 4], [5, 4], [5, 0], [0, 0], [0, 1], [4, 1], [4, 4], [0, 4]],
  }),
  q(26, "Decimals & Fractions", "In which of the following figure does the shaded part represents 0.3?", [
    "A staircase of 10 squares, 3 shaded",
    "A circle with a quarter shaded",
    "A triangle cut into 4, the middle one shaded",
    "A 3 × 10 grid, 10 squares shaded",
  ], {
    targetPercent: 30,
    figures: {
      A: { parts: 10, shaded: [1, 4, 7], shape: "staircase" },
      B: { parts: 4, shaded: [3], shape: "circle" },
      C: { parts: 4, shaded: [2], shape: "triangle" },
      D: { parts: 30, shaded: [0, 2, 5, 8, 11, 13, 17, 20, 24, 28], shape: "grid" },
    },
  }),
  q(27, "Large Numbers", "80325901 can be written in words as", [
    "Eight crore thirty two lakh five thousand nine hundred one",
    "Eight crore three lakh twenty five thousand nine hundred one",
    "Eighty lakh thirty two thousand nine hundred one",
    "Eighty crore thirty two lakh five thousand nine hundred one",
  ], { number: 80325901 }),
  q(28, "Triangles", "In case of a scalene triangle ______.", ["Two angles are equal", "All the angles are equal", "All the angles are of different measures", "None of these"]),
  q(29, "Fractions", "Simplify: 4 3/5 − 2 7/9 − 1 2/15 − 2/5", ["14/45", "13/45", "16/45", "12/45"], {
    start: { whole: 4, num: 3, den: 5 },
    takeaway: [
      { whole: 2, num: 7, den: 9 },
      { whole: 1, num: 2, den: 15 },
      { whole: 0, num: 2, den: 5 },
    ],
    trays: [15, 30, 45, 90],
  }),
  q(30, "HCF", "HCF of an even number and an odd number is always", ["1", "0", "2", "Can't say"]),
  q(31, "Solids", "The given figure is called as ____ which contains ____ faces; ____ corners and ____ edges.", [
    "Triangular prism, 5, 6, 9",
    "Triangular prism, 6, 9, 5",
    "Rectangular prism, 5, 9, 6",
    "Rectangular prism, 9, 6, 5",
  ], { solid: "triangular-prism" }),
  q(32, "Symmetry", "Read the given statements below and identify the correct option.\n(i) A parallelogram has only one line of symmetry.\n(ii) A square and a rectangle have the same line of symmetry.\n(iii) The diameter of a circle is its line of symmetry.", [
    "False, True, False",
    "True, False, True",
    "False, False, True",
    "False, False, False",
  ]),
  q(33, "Word Problems", "On a straight road there are four cities A, B, C and D. Distance between B and D is 39 km, between A and C is 27 km and between C and D is 15 km. How far is A from B?", ["2 km", "3 km", "4 km", "5 km"], {
    order: ["A", "B", "C", "D"],
    known: [
      { from: "B", to: "D", km: 39 },
      { from: "A", to: "C", km: 27 },
      { from: "C", to: "D", km: 15 },
    ],
    ask: { from: "A", to: "B" },
  }),
  q(34, "Polygons", "Which of the following figures are NOT polygons?\n(i) a triangle with an extra line crossing it · (ii) a hexagon · (iii) two crossing lines with open ends · (iv) a triangle with lines drawn inside it · (v) a bow-tie whose sides cross", [
    "(i), (ii) and (v)",
    "(i), (ii) and (iii)",
    "(i), (iii), (iv) and (v)",
    "(i), (ii), (iii) and (iv)",
  ], {
    shapes: [
      { id: "(i)", name: "triangleExtra", simple: false },
      { id: "(ii)", name: "hexagon", simple: true },
      { id: "(iii)", name: "openCross", simple: false },
      { id: "(iv)", name: "triangleInner", simple: false },
      { id: "(v)", name: "bowTie", simple: false },
    ],
  }),
  q(35, "Factors & Multiples", "The greatest number that exactly divides 105, 1001 and 2436 is", ["3", "7", "11", "21"], { numbers: [105, 1001, 2436], blocks: [2, 3, 5, 7, 11, 13, 21] }),

  /* ── Everyday Mathematics ──────────────────────────────── */
  q(36, "HCF in Context", "A rectangular courtyard 3.78 m long and 5.25 m wide is to be paved exactly with square tiles, all of same size. Then the largest size of the tile which could be used for the purpose is (n × 3) cm. Find n.", ["6", "8", "7", "None of these"], {
    lengthCm: 378,
    widthCm: 525,
  }),
  q(37, "Measurement", "A courier man covers 35 m distance to deliver a product to the customer. He travels 0.028 km by bicycle and the rest on foot. What distance does he cover on foot?", ["5 m", "7 m", "8 m", "10 m"], { totalMetres: 35, bikeKm: 0.028 }),
  q(38, "Decimals", "From a barrel containing 513.76 kg of rice, the cook used 27.895 kg in the first three days of the week. How much rice was left in the barrel?", ["386.865 kg", "475.685 kg", "468.786 kg", "485.865 kg"], { stock: 513.76, removed: 27.895 }),
  q(39, "Money", "An auditorium has a capacity of 2000 seats. There are 200 seats each allotted for ₹ 500 tickets, 500 seats each for ₹ 250 tickets, 600 seats each for ₹ 100 tickets and the rest for ₹ 50 tickets each. If all the tickets are sold, how much money would be collected?", ["₹ 1,60,000", "₹ 2,80,050", "₹ 3,20,000", "₹ 2,20,000"], {
    capacity: 2000,
    sections: [
      { label: "₹ 500 seats", seats: 200, price: 500 },
      { label: "₹ 250 seats", seats: 500, price: 250 },
      { label: "₹ 100 seats", seats: 600, price: 100 },
      { label: "₹ 50 seats", seats: null, price: 50 },
    ],
    discrepancy: "Answer Key 2 prints D (₹ 2,20,000). With the printed seat numbers the collection is 1,00,000 + 1,25,000 + 60,000 + 35,000 = ₹ 3,20,000, option C, which is scored as correct.",
  }),
  q(40, "LCM in Context", "Three bells ring at intervals of 30, 45 and 60 minutes respectively. If they begin ringing together at 5 p.m., then they will ring together again at ____.", ["8:30 p.m.", "5:30 p.m.", "8 p.m.", "6 p.m."], {
    intervals: [30, 45, 60],
    start: { h: 17, m: 0 },
  }),
  q(41, "Fractions in Context", "Arvind has a box of chocolates which is 7/8 full. Suraj has a box which is 4/5 full. Whose box has more chocolates and by how much?", ["Arvind, 3/40", "Suraj, 3/40", "Arvind, 9/10", "Suraj, 9/10"], {
    boxes: [
      { who: "Arvind", num: 7, den: 8 },
      { who: "Suraj", num: 4, den: 5 },
    ],
  }),
  q(42, "Ratio & Speed", "A boat covers a distance of 15 km in 6 hours. What distance will it cover in 24 hours?", ["32 km", "48 km", "56 km", "60 km"], { km: 15, hours: 6, askHours: 24 }),
  q(43, "Money", "Sunil had ₹ 30. He spent ₹ 6.25 on books and ₹ 12.75 on toys. How much amount is left with him?", ["₹ 10", "₹ 11", "₹ 12.02", "₹ 9.02"], {
    wallet: 30,
    items: [
      { label: "Books", price: 6.25 },
      { label: "Toys", price: 12.75 },
    ],
  }),
  q(44, "Perimeter", "The cost of making a fence around a square field is ₹ 392 at the rate of ₹ 14 per metre. What is the length of each side of the field?", ["7 m", "8 m", "8 cm", "7 cm"], { cost: 392, rate: 14 }),
  q(45, "Unitary Method", "32 bags of sugar, each weighing 42 kg, cost ₹ 26880. What is the cost of 25 bags of sugar each weighing 31 kg?", ["₹ 17,535", "₹ 19,325", "₹ 15,500", "₹ 14,850"], {
    first: { bags: 32, kg: 42, cost: 26880 },
    second: { bags: 25, kg: 31 },
  }),

  /* ── Achievers Section ─────────────────────────────────── */
  q(46, "Area & Perimeter", "PQRS is a rectangle. When the length and breadth of the rectangle increases, the rectangle is enlarged to VWRT and the area of the rectangle is increased by 226 cm². If the length of rectangle PQRS is twice its breadth, find:\n(a) Perimeter of rectangle PQRS.\n(b) Area of rectangle VWRT.\n(Each side grows by 4 cm.)", [
    "105 cm, 388.5 cm²",
    "105 cm, 838.5 cm²",
    "108 cm, 838.5 cm²",
    "108 cm, 388.5 cm²",
  ], {
    ratio: 2,
    grow: 4,
    increase: 226,
  }),
  q(47, "Reasoning with Numbers", "Which of the following statements is INCORRECT?", [
    "Two friends ate 2/3 and 1/4 of a chocolate. The fraction of the chocolate they eat together is 11/12.",
    "A point A on a mountain is 6,450 m above the sea level. Another point B is in a mine 48,600 m below the sea level. The distance between these two points is 55050 cm.",
    "Monika's present age is x years. Her father's age is 5 years more than 3 times her age. Monika's father's age is (3x + 5) years.",
    "On subtracting, the sum of 34.29 and 158.3 from the sum of 21.947 and 201.3, we get 30.657.",
  ], {
    labs: {
      A: { a: [2, 3], b: [1, 4], claim: [11, 12] },
      B: { peak: 6450, mine: -48600, claimCm: 55050 },
      C: { factor: 3, years: 5 },
      D: { from: [21.947, 201.3], take: [34.29, 158.3], claim: 30.657 },
    },
  }),
  q(48, "Divisibility", "Study the statements carefully.\nStatement I: Any number is divisible by 5, if the sum of the digits of the number is divisible by 5.\nStatement II: Any number is divisible by 6, if it is divisible by either 2 or 3 or both 2 and 3.\nWhich of the following options hold?", [
    "Both Statement I and Statement II are true.",
    "Both Statement I and Statement II are false.",
    "Statement I is true but Statement II is false.",
    "Statement I is false and Statement II is true.",
  ], {
    verdictOptions: { TT: "A", FF: "B", TF: "C", FT: "D" },
  }),
  q(49, "Lines & Circles", "Match the columns.\n(i) Number of line(s) passing through two given points is\n(ii) Number of ray(s) can be drawn with same initial point is\n(iii) The minimum number of point of intersection of three lines (if lines are parallel) is\n(iv) The distance around a circle is its\nColumn II: (p) Circumference · (q) Zero · (r) One · (s) Infinite", [
    "(i) → (r), (ii) → (s), (iii) → (q), (iv) → (p)",
    "(i) → (r), (ii) → (p), (iii) → (q), (iv) → (s)",
    "(i) → (s), (ii) → (q), (iii) → (p), (iv) → (r)",
    "(i) → (s), (ii) → (r), (iii) → (q), (iv) → (p)",
  ], {
    columnII: { Circumference: "p", Zero: "q", One: "r", Infinite: "s" },
  }),
  q(50, "Data Handling", "The total number of students who applied for a scholarship in the last five years is given below.\n2008: 3,000 · 2009: 3,500 · 2010: 4,000 · 2011: 4,500 · 2012: 5,000\nUsing the symbol ☆ to represent 500 students, answer the following questions.\n(i) How many symbols are needed to represent the number of students in 2010?\n(ii) How many more symbols are needed to represent the number of students in 2012 than in 2009?", ["7 and 4", "7 and 3", "8 and 4", "8 and 3"], {
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
  code: "IMO-9TH-G6-SETB2",
  title: "SOF 9th International Mathematics Olympiad (Class 6 - Set B)",
  subtitle: "Science Olympiad Foundation • Level-1 Examination Paper",
  description:
    "Official 9th SOF International Mathematics Olympiad Class 6 Set B examination paper covering Logical Reasoning, Mathematical Reasoning, Everyday Mathematics, and Achievers Section.",
  subjectId: "sub_mathematics",
  subjectName: "Mathematics & Logical Reasoning",
  grade: 6,
  academicYear: "9th IMO",
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
      "Only 4 hints can be used: 1-mark questions will only get 1/2 mark, and 3-mark questions cut 1 & half mark for taking a hint",
      "The question paper comprises four sections: Logical Reasoning (15 questions), Mathematical Reasoning (20 questions), Everyday Mathematics (10 questions) and Achievers Section (5 questions).",
      "Each question in the Achievers Section carries 3 marks, whereas all other questions carry 1 mark each.",
      "All questions are compulsory. There is no negative marking.",
      "You may move freely between questions using the Question Palette.",
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
  updatedAt: "2026-09-27T00:00:00Z",
} as Exam;
