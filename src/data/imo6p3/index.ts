import { Question } from "@/types/question";
import { Exam } from "@/types/exam";

/**
 * Exam 6 — SOF IMO 2019-20 · Class 6 · Set A (Question Paper VI Imo - 3.pdf).
 *
 * Wording, options and figures are transcribed from the scanned paper. The correct option
 * for every question is the official key in "Answer ket VI Imo - 3.pdf" (IMO6P3_KEY); each
 * question was also solved independently and all 50 agree with it.
 *
 * Figures are redrawn as data (coordinates, cells, lattice lines) so the games can let the
 * student work on them. Where a scanned figure could not be reproduced exactly, the redraw
 * keeps the property the question tests; those questions carry `customConfig.redrawn`.
 */

export const IMO6P3_KEY =
  "DAADDACACB" + "ABCBCDDDBD" + "CBDBCCDBCD" + "DDCACCBDAD" + "BDCCCBCCBD";

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
    id: `q_imo6p3_${nn}`,
    questionId: `IMO6P3-Q${nn}`,
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
    createdAt: "2026-09-26T00:00:00Z",
    updatedAt: "2026-09-27T00:00:00Z",
    multipleChoiceConfig: {
      options: (["A", "B", "C", "D"] as const).map((id, i) => ({ id, text: options[i] })),
      correctOptionId: IMO6P3_KEY[n - 1],
      layout: "list",
    },
    customConfig: { paper: "IMO 2019-20 Class 6 Set A", ...customConfig },
  } as Question;
}

/* ── figure builders (kept here so the question data stays declarative) ── */

const ring = (cx: number, cy: number, r: number, n: number, a0 = 0): P[] =>
  Array.from({ length: n }, (_, i) => {
    const a = a0 + (i / n) * Math.PI * 2;
    return [+(cx + r * Math.cos(a)).toFixed(3), +(cy + r * Math.sin(a)).toFixed(3)];
  });

/** Hexagon cut into 12 triangles from its centre (to every vertex and edge midpoint). */
function hexTwelfths(): P[][] {
  const v = ring(50, 50, 42, 6, 0);
  const pts: P[] = [];
  v.forEach((p, i) => {
    const q2 = v[(i + 1) % 6];
    pts.push(p, [+((p[0] + q2[0]) / 2).toFixed(3), +((p[1] + q2[1]) / 2).toFixed(3)]);
  });
  return pts.map((p, i) => [[50, 50], p, pts[(i + 1) % pts.length]]);
}

/** Square cut into 8 triangles by its diagonals and midlines. */
function squareEighths(): P[][] {
  const pts: P[] = [[10, 10], [50, 10], [90, 10], [90, 50], [90, 90], [50, 90], [10, 90], [10, 50]];
  return pts.map((p, i) => [[50, 50], p, pts[(i + 1) % 8]]);
}

/** Inverted triangle of 4 small triangles, each halved: 8 equal pieces. */
function invertedEighths(): P[][] {
  const h = 34.64;
  const A: P = [10, 15], B: P = [50, 15], C: P = [90, 15], D: P = [30, 15 + h], E: P = [70, 15 + h], F: P = [50, 15 + 2 * h];
  const mid = (a: P, b: P): P => [+((a[0] + b[0]) / 2).toFixed(3), +((a[1] + b[1]) / 2).toFixed(3)];
  const halves = (apex: P, b1: P, b2: P): P[][] => {
    const m = mid(b1, b2);
    return [[apex, b1, m], [apex, m, b2]];
  };
  return [...halves(D, A, B), ...halves(B, D, E), ...halves(E, B, C), ...halves(F, D, E)];
}

/** A cross-shaped arrangement of unit squares, each cut along a diagonal into 2 halves. */
function squareHalves(cells: P[], s = 14, ox = 8, oy = 4): P[][] {
  return cells.flatMap(([c, r]) => {
    const x = ox + c * s;
    const y = oy + r * s;
    return [
      [[x, y], [x + s, y], [x, y + s]],
      [[x + s, y], [x + s, y + s], [x, y + s]],
    ] as P[][];
  });
}

const S_CELLS: P[] = [[2, 0], [1, 1], [2, 1], [4, 1], [2, 2], [4, 2], [1, 3], [3, 3], [4, 3], [5, 3], [1, 4], [4, 4], [2, 5], [3, 2], [1, 2], [3, 1]];

const star = (n: number, ro: number, ri: number): P[] =>
  Array.from({ length: 2 * n }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / n;
    const r = i % 2 ? ri : ro;
    return [+(r * Math.cos(a)).toFixed(3), +(r * Math.sin(a)).toFixed(3)];
  });

const halfDisc = (cx: number, cy: number, r: number, from: number): P[] =>
  Array.from({ length: 13 }, (_, i) => {
    const a = from + (i / 12) * Math.PI;
    return [+(cx + r * Math.cos(a)).toFixed(3), +(cy + r * Math.sin(a)).toFixed(3)];
  });

const leaf = (angle: number): P[] => {
  const pts: P[] = [];
  for (let i = 0; i <= 12; i++) {
    const t = (i / 12) * Math.PI;
    const x = 36 * (i / 12);
    const y = 7 * Math.sin(t);
    pts.push([x, y]);
  }
  for (let i = 11; i > 0; i--) {
    const t = (i / 12) * Math.PI;
    pts.push([36 * (i / 12), -7 * Math.sin(t)]);
  }
  const c = Math.cos(angle), s = Math.sin(angle);
  return pts.map(([x, y]) => [+(x * c - y * s).toFixed(3), +(x * s + y * c).toFixed(3)]);
};

export const IMO6P3_QUESTIONS: Question[] = [
  /* ── Logical Reasoning ─────────────────────────────────── */
  q(1, "Coding-Decoding", "If in a certain code language, 'NATION' is written as 'OZUHPM', then how will 'REASON' be written in the same language?", ["SBDRNP", "SDBRNM", "QFZTNO", "SDBRPM"], {
    example: { plain: "NATION", coded: "OZUHPM" },
    target: "REASON",
  }),
  q(2, "Dot Situation", "Select a figure from the options which satisfies the same conditions of placement of the dots as in the given figure.\n(Given figure: one dot lies in the region common to the circle and the triangle only, one in the region common to all three figures, and one in the region common to the triangle and the square only.)", [
    "Figure A — square with a triangle through it and a circle overlapping at the right",
    "Figure B — square at the bottom left, circle in the middle, triangle pointing up to the right",
    "Figure C — large triangle with a circle inside it and a square at the top right",
    "Figure D — circle around a triangle, with a square overlapping at the bottom right",
  ], {
    given: { circle: [34, 62, 20], square: [44, 56, 30], triangle: [[8, 78], [62, 12], [62, 78]], dots: [[42, 46], [50, 64], [58, 64]] },
    rules: [
      { dot: 1, inside: ["circle", "triangle"], outside: ["square"] },
      { dot: 2, inside: ["circle", "triangle", "square"], outside: [] },
      { dot: 3, inside: ["triangle", "square"], outside: ["circle"] },
    ],
    figures: {
      A: { circle: [64, 62, 22], square: [22, 12, 44], triangle: [[12, 76], [40, 22], [70, 76]] },
      B: { circle: [44, 44, 17], square: [16, 46, 30], triangle: [[36, 54], [58, 12], [88, 44]] },
      C: { circle: [38, 64, 20], square: [52, 12, 32], triangle: [[10, 86], [40, 20], [72, 86]] },
      D: { circle: [40, 40, 28], square: [38, 48, 36], triangle: [[40, 12], [16, 54], [64, 54]] },
    },
    redrawn: "Option figures redrawn to scale; each keeps which dot regions exist in the printed figure.",
  }),
  q(3, "Series Completion", "Which of the following sets of letters will continue the given letter series?\nARC, BSD, DUF, GXI, ?", ["KBM", "HBM", "JAM", "KAN"], {
    series: ["ARC", "BSD", "DUF", "GXI"],
  }),
  q(4, "Paper Folding & Cutting", "The given question consists of a set of three figures X, Y and Z which shows the folding of a piece of paper. Fig. (Z) shows the manner in which the folded paper has been cut. Select a figure from the options which shows the unfolded form of Fig. (Z).\n(X: a round sheet is folded in half, right half onto the left. Y: the half is folded again, top down onto the bottom. Z: the quarter is cut with a square hole in its middle, a round notch on each folded edge and a square notch at the corner.)", [
    "Circles on the four diagonals; squares above, below, left and right; square at the centre",
    "Squares on the four diagonals and above and below; circles at left and right; square at the centre",
    "Squares on the four diagonals and at left and right; circles above and below; square at the centre",
    "Circles above, below, left and right; squares on the four diagonals; square at the centre",
  ], {
    marks: [
      { shape: "square", x: -20, y: 20 },
      { shape: "circle", x: -26, y: 0 },
      { shape: "circle", x: 0, y: 26 },
      { shape: "square", x: 0, y: 0 },
    ],
    optionStates: {
      A: [["circle", -20, -20], ["circle", 20, -20], ["circle", -20, 20], ["circle", 20, 20], ["square", 0, -26], ["square", 0, 26], ["square", -26, 0], ["square", 26, 0], ["square", 0, 0]],
      B: [["square", -20, -20], ["square", 20, -20], ["square", -20, 20], ["square", 20, 20], ["square", 0, -26], ["square", 0, 26], ["circle", -26, 0], ["circle", 26, 0], ["square", 0, 0]],
      C: [["square", -20, -20], ["square", 20, -20], ["square", -20, 20], ["square", 20, 20], ["circle", 0, -26], ["circle", 0, 26], ["square", -26, 0], ["square", 26, 0], ["square", 0, 0]],
      D: [["square", -20, -20], ["square", 20, -20], ["square", -20, 20], ["square", 20, 20], ["circle", 0, -26], ["circle", 0, 26], ["circle", -26, 0], ["circle", 26, 0], ["square", 0, 0]],
    },
  }),
  q(5, "Direction Sense", "Umang walks 20 m towards South. Then he turned left and walks 30 m. Again, he turned left and walks 20 m. Then he turned right and walks 15 m. How far is he now from his initial position?", ["30 m", "50 m", "35 m", "45 m"], {
    step: 5,
  }),
  q(6, "Analogy", "There is a certain relationship between figures (1) and (2). Establish the same relationship between figures (3) and (4) by selecting a suitable figure from the options which will replace the (?) in Fig. (3).\n(1): ● top-left, P middle-left, ★ bottom-left. (2): ★ and P along the top right, ● middle-right. (4): H and # along the top right, Δ middle-right.", [
    "Δ top-left, # middle-left, H bottom-left",
    "H middle-right, Δ bottom-middle, # bottom-right",
    "Δ, H, # along the bottom row",
    "Δ, #, H along the bottom row",
  ], {
    fig1: { "0,0": "●", "1,0": "P", "2,0": "★" },
    fig2: { "0,1": "★", "0,2": "P", "1,2": "●" },
    fig4: { "0,1": "H", "0,2": "#", "1,2": "Δ" },
    optionStates: {
      A: { "0,0": "Δ", "1,0": "#", "2,0": "H" },
      B: { "1,2": "H", "2,1": "Δ", "2,2": "#" },
      C: { "2,0": "Δ", "2,1": "H", "2,2": "#" },
      D: { "2,0": "Δ", "2,1": "#", "2,2": "H" },
    },
  }),
  q(7, "Alphabet Test", "The position of how many letters in the word EXPLOSION will remain unchanged, when the letters of the word are arranged alphabetically?", ["None", "One", "Two", "More than two"], {
    word: "EXPLOSION",
  }),
  q(8, "Counting Cubes", "How many cubes are there in the given figure?\n(A wall three cubes high that runs three cubes to the right, two cubes back, then three cubes to the right again.)", ["24", "20", "21", "22"], {
    columns: [[0, 1, 3], [1, 1, 3], [2, 1, 3], [2, 0, 3], [2, -1, 3], [3, -1, 3], [4, -1, 3], [5, -1, 3]],
  }),
  q(9, "Number Test", "If 1 is subtracted from the tens digit and 1 is added to the unit digit in each of the given numbers, then which of the following numbers will become the greatest?\n381   376   387   368   328", ["381", "376", "387", "328"], {
    numbers: [381, 376, 387, 368, 328],
  }),
  q(10, "Water Images", "Select the correct water image of the given combination of letters and numbers.\nS W I M 1 9 2 5", [
    "Water image of S W I 1 M 9 2 5",
    "Water image of S W I M 1 9 2 5",
    "Water image of S W I M 1 2 9 5",
    "Water image of S I W M 1 9 2 5",
  ], {
    text: "SWIM1925",
    optionStates: {
      A: { seq: "SWI1M925", flip: "v" },
      B: { seq: "SWIM1925", flip: "v" },
      C: { seq: "SWIM1295", flip: "v" },
      D: { seq: "SIWM1925", flip: "v" },
    },
  }),
  q(11, "Blood Relations", "If Karan is the brother of Vijay, Sneha is the daughter of Vijay, Bharti is the sister of Karan and Atul is the brother of Sneha, then how is Karan related to Atul?", ["Uncle", "Brother", "Father", "Cousin"], {
    people: [
      { id: "Karan", g: "M" },
      { id: "Vijay", g: "M" },
      { id: "Sneha", g: "F" },
      { id: "Bharti", g: "F" },
      { id: "Atul", g: "M" },
    ],
  }),
  q(12, "Classification", "Group the given figures into three classes on the basis of their identical properties using each figure only once.\n1 circle around a square · 2 square cut into four · 3 diamond inside a diamond · 4 triangle inside a triangle · 5 rectangle cut into four · 6 trapezium cut into four · 7 square around a triangle · 8 triangle around a circle · 9 circle inside a circle", [
    "1,7,9; 2,5,6; 3,4,8",
    "1,7,8; 2,5,6; 3,4,9",
    "1,2,4; 3,5,7; 6,8,9",
    "1,2,8; 3,4,6; 5,7,9",
  ], {
    figures: ["circleSquare", "squareQuarters", "diamondDiamond", "triangleTriangle", "rectQuarters", "trapQuarters", "squareTriangle", "triangleCircle", "circleCircle"],
  }),
  q(13, "Number Puzzles", "Find the missing number, if same rule is followed in all the three figures.\nFigure 1: 2 and 5 on the sides, 3 below, 20 inside. Figure 2: 6 and 9 on the sides, 10 below, 17 inside. Figure 3: 12 and 13 on the sides, 8 below, ? inside.", ["281", "495", "249", "511"], {
    examples: [
      { a: 2, b: 5, c: 3, out: 20 },
      { a: 6, b: 9, c: 10, out: 17 },
    ],
    ask: { a: 12, b: 13, c: 8 },
  }),
  q(14, "Embedded Figures", "Select a figure from the options in which the given figure is exactly embedded as one of its parts.\n(The given figure: a long stroke down to the left, a long stroke to the right, a short stroke down to the right, a short stroke down to the left and a short stroke to the right.)", [
    "Figure A — triangle with a centre line, a small inner triangle and two corner triangles",
    "Figure B — triangle with a centre line, two cross-bars, a V and two slanting bars",
    "Figure C — triangle with a cross-bar, an inner triangle and lines to the base corners",
    "Figure D — triangle with a centre line, a short cross-bar and two long slanting lines",
  ], {
    target: ["DL", "DL", "R", "R", "DR", "DL", "R"],
    figures: {
      A: { lattice: [[[1, 0], [1, 1]], [[3, 0], [4, 1]], [[3, 3], [4, 3]]], extra: [[[50, 10], [50, 79.3]], [[46, 40], [54, 40], [50, 33], [46, 40]]] },
      B: { lattice: [[[1, 0], [1, 1]], [[2, 0], [2, 2]], [[2, 0], [4, 2]], [[2, 2], [4, 2]], [[3, 0], [4, 1]], [[3, 3], [4, 3]]], extra: [[[50, 10], [50, 79.3]]] },
      C: { lattice: [[[1, 0], [1, 1]], [[2, 0], [2, 2]], [[2, 0], [4, 2]], [[2, 2], [4, 2]]], extra: [[[10, 79.3], [40, 44.6]], [[90, 79.3], [60, 44.6]], [[50, 10], [50, 44.6]]] },
      D: { lattice: [[[1, 0], [1, 1]]], extra: [[[50, 10], [50, 79.3]], [[10, 79.3], [70, 44.6]], [[90, 79.3], [30, 44.6]]] },
    },
    redrawn: "Option figures redrawn on a triangular grid; only figure B contains the given zig-zag, as in the printed paper.",
  }),
  q(15, "Odd One Out", "Select the odd one out.", ["MORS", "EGJK", "PQUW", "ACFG"]),

  /* ── Mathematical Reasoning ────────────────────────────── */
  q(16, "Decimals & Place Value", "If 35.4067 = 3/P + 5Q + 4R + 6/S + 7T, then the value of 2P + 4Q + 5R + 7S + 3T is", ["74.003", "704.5003", "7004.703", "7004.7003"], {
    target: 35.4067,
    terms: [
      { k: "P", coef: 3, recip: true },
      { k: "Q", coef: 5, recip: false },
      { k: "R", coef: 4, recip: false },
      { k: "S", coef: 6, recip: true },
      { k: "T", coef: 7, recip: false },
    ],
    ask: { P: 2, Q: 4, R: 5, S: 7, T: 3 },
    askText: "2P + 4Q + 5R + 7S + 3T",
    cards: [0.0001, 0.001, 0.01, 0.1, 1, 10, 100, 1000],
  }),
  q(17, "Angles & Clocks", "Find the measure of the smaller angle formed by the hour hand and the minute hand of a clock at 8 O' clock.", ["160°", "240°", "90°", "120°"], { hour: 8 }),
  q(18, "Perimeter", "Find the perimeter of the shaded region in the given figure. (Each small square is 1 cm × 1 cm.)", ["30 cm", "32 cm", "26 cm", "28 cm"], {
    cells: [[2, 0], [4, 0], [1, 1], [2, 1], [3, 1], [4, 1], [2, 2], [3, 2], [1, 3], [2, 3], [2, 4], [3, 4], [3, 5], [4, 5]],
    cols: 6,
    rows: 6,
  }),
  q(19, "Area & Unitary Method", "A hall is 37.5 m long and 11.2 m wide. Its floor is to be covered with rectangular tiles of size 15 cm by 7 cm. Find the total cost of tiling the hall at the rate of ₹ 1.25 per tile.", ["₹ 25700", "₹ 50000", "₹ 45000", "₹ 48500"], {
    hallCm: [3750, 1120],
    tileCm: [15, 7],
    rate: 1.25,
  }),
  q(20, "Directions & Turns", "Arjun is facing South-East. In which direction will he face, if he takes\n(a) 1½ revolution anticlockwise?\n(b) ¾ revolution clockwise?", ["North-East, North-East", "South-West, North-West", "South-East, North-East", "North-West, North-East"], {
    start: "SE",
    tasks: [{ label: "(a)" }, { label: "(b)" }],
  }),
  q(21, "Ratio & Algebra", "If y/x = 3/4, then the value of (1/4 + (2x − y)/(x + 2y)) is", ["1", "4", "3/4", "2"], { ratio: [3, 4] }),
  q(22, "Fractions & Brackets", "If P = 3/8 ÷ 15/16, Q = 3 ÷ [(8 ÷ 15) ÷ 16], R = [3 ÷ (8 ÷ 15)] ÷ 16 and S = 3 ÷ 8(15 ÷ 16), then which of the following are equal?", ["P and Q", "P and S", "P and R", "All are equal."], {
    exprs: {
      P: ["3/8", "÷", "15/16"],
      Q: ["3", "÷", "[", "(", "8", "÷", "15", ")", "÷", "16", "]"],
      R: ["[", "3", "÷", "(", "8", "÷", "15", ")", "]", "÷", "16"],
      S: ["3", "÷", "{", "8", "·", "(", "15", "÷", "16", ")", "}"],
    },
  }),
  q(23, "Estimation", "Find the sum of 43765 and 6954 by rounding off each number to the nearest hundred.", ["50000", "51000", "53000", "50800"], { numbers: [43765, 6954] }),
  q(24, "Circles", "O is a point on the circle and P is a point in the exterior of the circle. Length of OP = 7.5 cm and radius of the circle is 5.5 cm. What will be the length of QP, if Q is the centre of the circle? (P, O and Q lie on one line.)", ["5.5 cm", "13 cm", "7.5 cm", "13.5 cm"], { radius: 5.5, op: 7.5 }),
  q(25, "Symmetry", "Which of the following figures has at least one line of symmetry?\nP: an eight-pointed star with a small diamond at its centre · Q: a six-pointed star with two opposite points shaded · R: four circles, each half shaded, turning round the centre · S: two identical petals joined at a point", ["Only P", "Only P and Q", "Only P, Q and S", "P, Q, R and S"], {
    shapes: {
      P: [{ fill: "none", pts: star(8, 38, 20) }, { fill: "white", pts: [[0, -6], [6, 0], [0, 6], [-6, 0]] }],
      Q: [
        { fill: "none", pts: star(6, 38, 21.94) },
        { fill: "shade", pts: [[-32.909, -19], [-10.97, -19], [-21.94, 0]] },
        { fill: "shade", pts: [[32.909, 19], [10.97, 19], [21.94, 0]] },
      ],
      R: [
        { fill: "none", pts: ring(-15, -15, 11, 24) },
        { fill: "none", pts: ring(15, -15, 11, 24) },
        { fill: "none", pts: ring(15, 15, 11, 24) },
        { fill: "none", pts: ring(-15, 15, 11, 24) },
        { fill: "shade", pts: halfDisc(-15, -15, 11, Math.PI) },
        { fill: "shade", pts: halfDisc(15, -15, 11, -Math.PI / 2) },
        { fill: "shade", pts: halfDisc(15, 15, 11, 0) },
        { fill: "shade", pts: halfDisc(-15, 15, 11, Math.PI / 2) },
      ],
      S: [
        { fill: "none", pts: leaf((-150 * Math.PI) / 180) },
        { fill: "none", pts: leaf((150 * Math.PI) / 180) },
      ],
    },
    redrawn: "Figure S is drawn as two identical petals (the key counts S as symmetric).",
  }),
  q(26, "Ratio & Proportion", "Which of the following ratios is not equal to 3 : 8 in its simplest form?", ["207 : 552", "261 : 696", "141 : 392", "153 : 408"], { target: [3, 8] }),
  q(27, "Whole Numbers", "Which of the following operations satisfies the commutative law for whole numbers?", ["Subtraction and division", "Subtraction and multiplication", "Division and multiplication", "Addition and multiplication"], {
    ops: ["+", "−", "×", "÷"],
  }),
  q(28, "Data Handling", "The given table shows the number of sweaters knitted by Mrs Kapoor in seven months.\nMay 8 · June 7 · July 5 · August 4 · September 5 · October 7 · November 10 (shown as tally marks)\nHow many total sweaters did she knit in these seven months?", ["42", "46", "54", "47"], {
    months: [
      { m: "May", n: 8 },
      { m: "June", n: 7 },
      { m: "July", n: 5 },
      { m: "August", n: 4 },
      { m: "September", n: 5 },
      { m: "October", n: 7 },
      { m: "November", n: 10 },
    ],
  }),
  q(29, "Data Handling", "From the same table: how many less sweaters did she knit in August than in November?", ["5", "7", "6", "4"], {
    months: [
      { m: "May", n: 8 },
      { m: "June", n: 7 },
      { m: "July", n: 5 },
      { m: "August", n: 4 },
      { m: "September", n: 5 },
      { m: "October", n: 7 },
      { m: "November", n: 10 },
    ],
  }),
  q(30, "Factors & Multiples", "The least number which when divided by 12, 16, 24 and 48 leaves a remainder of 3, 7, 15 and 39 respectively, is ____.", ["16", "48", "57", "39"], {
    locks: [
      { d: 12, r: 3 },
      { d: 16, r: 7 },
      { d: 24, r: 15 },
      { d: 48, r: 39 },
    ],
  }),
  q(31, "Integers", "The given table shows the temperature of a city for seven days.\nMon −6 °C · Tue 15 °C · Wed −2 °C · Thu 18 °C · Fri 12 °C · Sat 0 °C · Sun 20 °C\nOn which day does the temperature increase the most from the previous day?", ["Sunday", "Thursday", "Wednesday", "Tuesday"], {
    days: [
      { d: "Monday", t: -6 },
      { d: "Tuesday", t: 15 },
      { d: "Wednesday", t: -2 },
      { d: "Thursday", t: 18 },
      { d: "Friday", t: 12 },
      { d: "Saturday", t: 0 },
      { d: "Sunday", t: 20 },
    ],
  }),
  q(32, "Area", "Find the area of the given figure (not drawn to scale).\n(Going round the outline: top 4.5 cm, down 1 cm, right 1.5 cm, down the long right side, bottom 3 cm, up 2.5 cm, left 4.5 cm, up 0.5 cm, right 1.5 cm and up 5 cm to the start.)", ["25.5 cm²", "32.25 cm²", "25 cm²", "39.75 cm²"], {
    outline: [[1.5, 8], [6, 8], [6, 7], [7.5, 7], [7.5, 0], [4.5, 0], [4.5, 2.5], [0, 2.5], [0, 3], [1.5, 3]],
    labels: [
      { at: [3.75, 8.35], text: "4.5 cm" },
      { at: [6.25, 7.5], text: "1 cm" },
      { at: [6.75, 7.35], text: "1.5 cm" },
      { at: [6, 0 - 0.45], text: "3 cm" },
      { at: [4.2, 1.25], text: "2.5 cm" },
      { at: [2.25, 2.1], text: "4.5 cm" },
      { at: [-0.3, 2.75], text: "0.5 cm" },
      { at: [0.75, 3.35], text: "1.5 cm" },
      { at: [1.2, 5.5], text: "5 cm" },
    ],
    cuts: [
      { id: "rows", label: "Split into four rectangles (plan 1)", pieces: [[1.5, 3, 4.5, 5], [6, 0, 1.5, 7], [4.5, 0, 1.5, 3], [0, 2.5, 4.5, 0.5]] },
      { id: "cols", label: "Split into four rectangles (plan 2)", pieces: [[1.5, 2.5, 4.5, 5.5], [0, 2.5, 1.5, 0.5], [6, 0, 1.5, 7], [4.5, 0, 1.5, 2.5]] },
    ],
  }),
  q(33, "Roman Numerals", "Select the incorrect option.", ["CLXV - 165", "MCXLIX - 1149", "CMLXXIV - 964", "MCCLVIII - 1258"]),
  q(34, "Fractions", "Simplify: 4 1/3 − 2 4/9 + 1 3/5 − 2/5", ["3 4/45", "1 4/45", "3 7/45", "1 2/45"], {
    terms: [
      { sign: 1, whole: 4, num: 1, den: 3 },
      { sign: -1, whole: 2, num: 4, den: 9 },
      { sign: 1, whole: 1, num: 3, den: 5 },
      { sign: -1, whole: 0, num: 2, den: 5 },
    ],
    trays: [9, 15, 30, 45, 90],
  }),
  q(35, "Ratio & Proportion", "1054 is divided into three parts such that 2 times the first part, 3 times the second part and 5 times the third part are equal. Find each of the three parts.", ["450, 360, 244", "350, 456, 248", "510, 340, 204", "325, 470, 259"], {
    total: 1054,
    mult: [2, 3, 5],
  }),

  /* ── Everyday Mathematics ──────────────────────────────── */
  q(36, "LCM in Context", "Four friends step off together from the same spot. Their steps measure 18 cm, 36 cm, 45 cm and 72 cm respectively. What is the minimum distance each should cover so that all can cover distance in complete steps?", ["280 cm", "340 cm", "360 cm", "420 cm"], { steps: [18, 36, 45, 72] }),
  q(37, "Large Numbers", "For a concert, Vishakha spent ₹ 4,74,560 on musical instruments, ₹ 8,12,320 on food, ₹ 3,28,254 on decoration and ₹ 56,480 on advertisement. Find the total amount spent by her.", ["₹ 21,42,334", "₹ 16,71,614", "₹ 21,34,136", "₹ 15,49,612"], {
    items: [
      { label: "Instruments", v: 474560 },
      { label: "Food", v: 812320 },
      { label: "Decoration", v: 328254 },
      { label: "Advertisement", v: 56480 },
    ],
  }),
  q(38, "Perimeter", "Niharika walks thrice around a square field of side 22 m. Girish walks twice around a rectangular field of length 10 m and breadth 12 m. Who covers more distance and by how much?", ["Girish, 20 m", "Niharika, 200 m", "Girish, 176 m", "Niharika, 176 m"], {
    runners: [
      { who: "Niharika", field: [22, 22] },
      { who: "Girish", field: [10, 12] },
    ],
  }),
  q(39, "Money", "Jennifer bought 6 sarees and 3 shirts. A saree costs twice as a shirt. If each saree costs ₹ 1050.50, then how much total amount did she spend?", ["₹ 7878.75", "₹ 8245.25", "₹ 7545.50", "₹ 7540.25"], { saree: 1050.5 }),
  q(40, "Large Numbers", "There are 42 flats in city A and 54 flats in city B. If the cost of each flat in city A and city B is ₹ 2,84,500 and ₹ 2,69,000 respectively, then what is the difference between the cost of all the flats in city A and city B?", ["₹ 18,45,000", "₹ 25,44,000", "₹ 27,54,500", "₹ 25,77,000"], {
    towers: [
      { city: "City A", flats: 42, price: 284500 },
      { city: "City B", flats: 54, price: 269000 },
    ],
  }),
  q(41, "Algebra", "8 years ago, Vinay was 3p years old. How old (in years) will he be after 4 years?", ["3p + 4", "3p + 12", "3p − 4", "3p − 12"], { ago: 8, ahead: 4 }),
  q(42, "Ratio", "An amount of ₹ 5850 is divided into Vishal and Anita in the ratio 4 : 5. Find the share of Anita.", ["₹ 2600", "₹ 3450", "₹ 4680", "₹ 3250"], { total: 5850 }),
  q(43, "Fractions", "A container is completely filled with four packets of flour weighing 6 3/8 kg, 5 1/2 kg, 2 3/4 kg and 9 1/2 kg. Find the total weight the container can hold.", ["26 7/8 kg", "24 3/8 kg", "24 1/8 kg", "24 7/8 kg"], {
    sacks: [
      { whole: 6, num: 3, den: 8 },
      { whole: 5, num: 1, den: 2 },
      { whole: 2, num: 3, den: 4 },
      { whole: 9, num: 1, den: 2 },
    ],
  }),
  q(44, "HCF in Context", "A rectangular courtyard 1.12 m long and 0.84 m wide is to be paved exactly with square tiles, all of same size. The largest size of the tile which could be used for the purpose is (n × 4) cm. Find the value of n.", ["6", "8", "7", "None of these"], { lengthCm: 112, widthCm: 84 }),
  q(45, "Linear Relations", "Arjun weighs twice as Surbhi and Sejal weighs 5 kg less than Arjun. If the total weight of Arjun, Surbhi and Sejal is 63 kg, then find the total weight of Sejal and Arjun.", ["54.2 kg", "47 kg", "49.4 kg", "62.4 kg"], { total: 63 }),

  /* ── Achievers Section ─────────────────────────────────── */
  q(46, "Decimals", "Fill in the blanks and select the correct option.\n(i) In 43.295, the digit ____ is at hundredths place.\n(ii) Compare: 11.45 − 3.25 + 12.5 ____ 15.75 − 4.65 + 9.85\n(iii) 15.5575 rounded off to the nearest thousandths is ____.", ["5, <, 15.548", "9, <, 15.558", "9, >, 15.547", "2, <, 15.548"], {
    number: "43.295",
    left: [11.45, -3.25, 12.5],
    right: [15.75, -4.65, 9.85],
    round: 15.5575,
  }),
  q(47, "Perimeter", "Find the perimeter of the following figures (not drawn to scale) and select the correct option.\n(i) is made of 5 cm squares, (ii) of 4 cm squares and (iii) of 3 cm squares.", [
    "Perimeter of [(i) + (ii)] = Perimeter of [(ii) + (iii)]",
    "Perimeter of [(i) + (ii)] = Perimeter of (iii)",
    "Perimeter of [(i) + (iii)] > Perimeter of (ii)",
    "None of these",
  ], {
    figures: {
      "(i)": { unit: 5, rows: [[0, 1], [0, 1, 2], [0, 1, 2, 3], [2, 3], [0, 1, 2, 3], [2, 3]] },
      "(ii)": { unit: 4, rows: [[0, 2, 3, 4], [0, 2], [0, 1, 2, 3, 4], [2, 4], [0, 1, 2, 4]] },
      "(iii)": { unit: 3, rows: [[0, 1, 2, 3], [0, 1, 3, 7], [0, 1, 3, 6, 7], [0, 3, 6, 7], [0, 3, 4, 5, 6, 7], [0]] },
    },
    claims: {
      A: { left: ["(i)", "(ii)"], op: "=", right: ["(ii)", "(iii)"] },
      B: { left: ["(i)", "(ii)"], op: "=", right: ["(iii)"] },
      C: { left: ["(i)", "(iii)"], op: ">", right: ["(ii)"] },
    },
  }),
  q(48, "Divisibility", "Study the given statements carefully and select the correct option.\nStatement-I: 7456824 is divisible by 9.\nStatement-II: A natural number is divisible by 9, if the sum of the digits of the number is divisible by 3.", [
    "Both Statement-I and Statement-II are true.",
    "Both Statement-I and Statement-II are false.",
    "Statement-I is true but Statement-II is false.",
    "Statement-I is false but Statement-II is true.",
  ], {
    number: 7456824,
    verdictOptions: { TT: "A", FF: "B", TF: "C", FT: "D" },
  }),
  q(49, "Fractions", "Arrange the following figures in ascending order of their shaded fraction.\nP: a hexagon in 12 equal triangles · Q: a square in 8 equal triangles · R: an inverted triangle in 8 equal pieces · S: a cross of 16 squares, each cut into 2 halves", ["S, P, R, Q", "P, S, R, Q", "P, S, Q, R", "Q, R, S, P"], {
    figures: {
      P: { regions: hexTwelfths(), shaded: [0, 3, 5, 6, 9] },
      Q: { regions: squareEighths(), shaded: [0, 2, 3, 5, 7] },
      R: { regions: invertedEighths(), shaded: [0, 3, 4, 6] },
      S: { regions: squareHalves(S_CELLS), shaded: [0, 1, 3, 5, 6, 9, 10, 12, 14, 16, 19, 22, 24, 26, 29] },
    },
    redrawn: "Shaded pieces redrawn as equal parts so each fraction can be counted: P 5/12, S 15/32, R 4/8, Q 5/8.",
  }),
  q(50, "Number Sense", "Which of the following options is incorrect?", [
    "Roman numeral for the largest 3-digit number is CMXCIX.",
    "The smallest 4-digit number formed by using the digits 5, 6, 0, 9 (using each digit only once) is 5069.",
    "Estimated product of 5034 and 295 is 1500000.",
    "Place value and face value are always equal at tens place.",
  ], {
    stations: {
      A: { roman: "CMXCIX", claim: 999 },
      B: { digits: [5, 6, 0, 9], claim: 5069 },
      C: { factors: [5034, 295], claim: 1500000 },
      D: { place: 1 },
    },
  }),
];

const ids = (from: number, to: number) => IMO6P3_QUESTIONS.slice(from, to).map((x) => x.id);

export const IMO6P3_EXAM: Exam = {
  id: "exam_imo_g6_paper3",
  title: "SOF IMO 2019-20 Class 6 — Set A (Paper 3)",
  subtitle: "Science Olympiad Foundation • Level-1 • 50 interactive mini-games",
  description:
    "IMO 2019-20 Class 6 Set A (Question Paper 3), scored against Answer Key 3. Every question is a mini-game: work the game, its result is mapped to the matching option, and you submit it.",
  code: "IMO-G6-P3",
  subjectId: "sub_mathematics",
  subjectName: "Mathematics & Logical Reasoning",
  grade: 6,
  academicYear: "2019-20",
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
      "The question paper comprises four sections: Logical Reasoning (15 questions), Mathematical Reasoning (20 questions), Everyday Mathematics (10 questions) and Achievers Section (5 questions).",
      "Each question in the Achievers Section carries 3 marks, whereas all other questions carry 1 mark each.",
      "All questions are compulsory. There is no negative marking.",
      "Every question is an interactive mini-game. Work the game to reach your answer, then press its submit button to record it.",
      "You may move freely between questions using the Question Palette.",
      "The examination lasts 60 minutes and submits automatically when time expires.",
    ],
  },
  status: "Published",
  createdAt: "2026-09-26T00:00:00Z",
  updatedAt: "2026-09-27T00:00:00Z",
  sections: [
    { id: "sec_logical", title: "Logical Reasoning", description: "15 Questions (1 Mark each)", questionIds: ids(0, 15) },
    { id: "sec_math", title: "Mathematical Reasoning", description: "20 Questions (1 Mark each)", questionIds: ids(15, 35) },
    { id: "sec_everyday", title: "Everyday Mathematics", description: "10 Questions (1 Mark each)", questionIds: ids(35, 45) },
    { id: "sec_achievers", title: "Achievers Section", description: "5 Questions (3 Marks each)", questionIds: ids(45, 50) },
  ],
  questionIds: IMO6P3_QUESTIONS.map((x) => x.id),
};
