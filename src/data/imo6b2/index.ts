import { Question } from "@/types/question";

/**
 * SOF IMO · Class 6 · Set B #2 — work in progress.
 *
 * The printed question paper for this set has not been supplied yet. These 18 questions
 * are the ones whose numbers are fully stated in the activity brief and reproduce the
 * official key. The key letters (`KEY`) are the official key as supplied.
 *
 * Two things still have to come from the printed paper before this set can be seeded
 * into an exam:
 *   1. the exact wording of each question, and
 *   2. the three distractor options — only the correct option's text is known, the
 *      others are marked PENDING and no activity can land on them by accident.
 *
 * Questions 1, 2, 5–8, 10–17, 19–21, 23, 25–28, 30–32, 34, 36, 39, 46–49 depend on
 * diagrams, statements or sequences that exist only in the printed paper.
 */

export const IMO6B2_KEY =
  "BAADCCBDDC" + "DACDBDCBDA" + "CBBBACBABB" + "ACBCBCBDCA" + "ADBACBBBAD";

export const IMO6B2_PENDING = "— transcribe from the printed paper —";

type Section = "Logical Reasoning" | "Mathematical Reasoning" | "Everyday Mathematics" | "Achievers Section";

function sectionOf(n: number): Section {
  if (n <= 15) return "Logical Reasoning";
  if (n <= 35) return "Mathematical Reasoning";
  if (n <= 45) return "Everyday Mathematics";
  return "Achievers Section";
}

function q(
  n: number,
  topic: string,
  questionText: string,
  correctText: string,
  customConfig: Record<string, unknown>,
  difficulty: Question["difficulty"] = "MEDIUM"
): Question {
  const key = IMO6B2_KEY[n - 1];
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
    status: "Draft",
    createdAt: "2026-09-25T00:00:00Z",
    updatedAt: "2026-09-25T00:00:00Z",
    multipleChoiceConfig: {
      options: ["A", "B", "C", "D"].map((id) => ({ id, text: id === key ? correctText : IMO6B2_PENDING })),
      correctOptionId: key,
      layout: "list",
    },
    customConfig: { ...customConfig, wordingPending: true },
  } as Question;
}

export const IMO6B2_QUESTIONS: Question[] = [
  q(3, "Coding-Decoding", "If ENGLISH is written as FMHKJRI, how is OCTOBER written in that code?", "PBUNCDS", {
    example: { plain: "ENGLISH", coded: "FMHKJRI" },
    target: "OCTOBER",
  }),
  q(4, "Direction Sense", "Pravin walks 30 m towards East, turns right and walks 20 m, then turns right again and walks 30 m. How far is he from his starting point?", "20 metres", {
    legs: [
      { turn: null, metres: 30 },
      { turn: "right", metres: 20 },
      { turn: "right", metres: 30 },
    ],
    startFacing: "E",
    step: 10,
  }),
  q(9, "Blood Relations", "Pointing to a man, a woman says, “His wife is the only daughter of my father.” How is the man related to the woman?", "Husband", {
    speaker: "woman",
  }),
  q(18, "Algebra", "If the cost of 8 pens is ₹ w, what is the cost of 5 pens?", "₹ (5w/8)", { given: 8, asked: 5, symbol: "w" }),
  q(22, "Divisibility", "Which digit should replace □ so that 517□324 is divisible by 3?", "2", {
    left: "517",
    right: "324",
    divisor: 3,
    keys: [0, 1, 2, 3],
  }),
  q(24, "Integers", "Which sign should replace the box?  (−25) − (−42) − (−27)  ☐  (−42) − (−25) + (−22)", ">", {
    left: [-25, -(-42), -(-27)],
    leftText: "(−25) − (−42) − (−27)",
    right: [-42, -(-25), -22],
    rightText: "(−42) − (−25) + (−22)",
    signs: ["<", ">", "=", "≤"],
  }),
  q(29, "Fractions", "Simplify: 4 3/5 − 2 7/9 − 1 2/15 − 2/5", "13/45", {
    start: { whole: 4, num: 3, den: 5 },
    takeaway: [
      { whole: 2, num: 7, den: 9 },
      { whole: 1, num: 2, den: 15 },
      { whole: 0, num: 2, den: 5 },
    ],
    trays: [15, 30, 45, 90],
  }),
  q(33, "Word Problems", "Four cities A, B, C and D lie in that order on a straight road. The distance from B to D is 39 km, from A to C is 27 km and from C to D is 15 km. What is the distance from A to B?", "3 km", {
    order: ["A", "B", "C", "D"],
    known: [
      { from: "B", to: "D", km: 39 },
      { from: "A", to: "C", km: 27 },
      { from: "C", to: "D", km: 15 },
    ],
    ask: { from: "A", to: "B" },
  }),
  q(35, "Factors & Multiples", "Which of the following numbers divides 105, 1001 and 2436 exactly?", "7", {
    numbers: [105, 1001, 2436],
    blocks: [2, 3, 5, 7, 11, 13],
  }),
  q(37, "Measurement", "A courier covers a total distance of 35 m. He covers 0.028 km by bicycle and the rest on foot. How far does he walk?", "7 m", {
    totalMetres: 35,
    bikeKm: 0.028,
  }),
  q(38, "Decimals", "A warehouse has 513.76 kg of rice. 27.895 kg of rice is taken out. How much rice is left?", "485.865 kg", {
    stock: 513.76,
    removed: 27.895,
  }),
  q(40, "LCM in Context", "Three bells ring at intervals of 30 minutes, 45 minutes and 60 minutes. If they ring together at 5:00 p.m., when will they next ring together?", "8:00 p.m.", {
    intervals: [30, 45, 60],
    start: { h: 17, m: 0 },
  }),
  q(41, "Fractions in Context", "Arvind's box of chocolates is 7/8 full and Suraj's identical box is 4/5 full. Whose box has more chocolates, and by what fraction of the box?", "Arvind, 3/40", {
    boxes: [
      { who: "Arvind", num: 7, den: 8 },
      { who: "Suraj", num: 4, den: 5 },
    ],
  }),
  q(42, "Ratio & Speed", "A boat covers 15 km in 6 hours. At the same speed, how far will it travel in 24 hours?", "60 km", {
    km: 15,
    hours: 6,
    askHours: 24,
  }),
  q(43, "Money", "Rahul had ₹ 30. He bought a book for ₹ 6.25 and a toy for ₹ 12.75. How much money is left with him?", "₹ 11", {
    wallet: 30,
    items: [
      { label: "Book", price: 6.25 },
      { label: "Toy", price: 12.75 },
    ],
  }),
  q(44, "Perimeter", "The cost of fencing a square field at ₹ 14 per metre is ₹ 392. Find the length of each side of the field.", "7 m", {
    cost: 392,
    rate: 14,
  }),
  q(45, "Unitary Method", "32 bags of sugar, each weighing 42 kg, cost ₹ 26,880. What is the cost of 25 bags of sugar, each weighing 31 kg?", "₹ 15,500", {
    first: { bags: 32, kg: 42, cost: 26880 },
    second: { bags: 25, kg: 31 },
  }),
  q(50, "Data Handling", "The number of students who got scholarships is shown for 2008–2012 (2008: 3000, 2009: 3500, 2010: 4000, 2011: 4500, 2012: 5000). In a pictograph where one star stands for 500 students, (i) how many stars represent 2010, and (ii) how many more stars represent 2012 than 2009?", "8 and 3", {
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
