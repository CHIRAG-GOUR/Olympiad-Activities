import { Question } from "@/types/question";

/**
 * SOF IMO 2018-19 · Class 6 · Set A — Section 4: Achievers Section (Q46–Q50, 3 marks each).
 *
 * Text and options transcribed verbatim from the official paper; correct option ids come
 * from the official answer key.
 */

const base = {
  subjectId: "sub_mathematics",
  subjectName: "Mathematics",
  grade: 6 as const,
  section: "Achievers Section" as const,
  chapter: "Achievers Section",
  questionType: "MULTIPLE_CHOICE" as const,
  marks: 3,
  negativeMarks: 0,
  difficulty: "ACHIEVER" as const,
  version: 1,
  status: "Published" as const,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};

export const IMO6A_ACHIEVERS: Question[] = [
  {
    ...base,
    id: "q_imo6a_46",
    questionId: "IMO6A-Q46",
    topic: "Multi-concept Problem Solving",
    difficulty: "ACHIEVER",
    questionText:
      "Fill in the blanks.\n(i) A right angle is __P__ of a revolution.\n(ii) A figure whose all sides are equal and all angles are __Q__ is called regular closed figure.\n(iii) The product of two negative integers is a __R__ integer.\n(iv) __S__ of a number is a number that comes just after that number.",
    multipleChoiceConfig: {
      options: [
        { id: "A", text: "One-fourth, different, positive, successor" },
        { id: "B", text: "One-third, different, negative, predecessor" },
        { id: "C", text: "One-fourth, equal, positive, successor" },
        { id: "D", text: "Half, equal, negative, predecessor" },
      ],
      correctOptionId: "C",
      layout: "list",
    },
    customConfig: {
      activity: "blank-bench",
      // Each blank is settled by its own hands-on instrument rather than by picking a word.
      blanks: [
        {
          id: "P",
          prompt: "A right angle is ___ of a revolution.",
          instrument: "revolution-dial",
          choices: ["One-fourth", "One-third", "Half"],
          config: { turns: [0.25, 0.3333, 0.5] },
        },
        {
          id: "Q",
          prompt: "All sides equal and all angles ___ makes a regular closed figure.",
          instrument: "polygon-gauge",
          choices: ["equal", "different"],
        },
        {
          id: "R",
          prompt: "The product of two negative integers is a ___ integer.",
          instrument: "sign-multiplier",
          choices: ["positive", "negative"],
        },
        {
          id: "S",
          prompt: "___ of a number is the number that comes just after it.",
          instrument: "number-stepper",
          choices: ["successor", "predecessor"],
        },
      ],
      readOrder: ["P", "Q", "R", "S"],
    },
    explanation:
      "Each blank has its own instrument: turn the revolution dial, gauge a polygon, multiply two negative counters and step along the number track. The bench assembles the four findings into one reading.",
  },
  {
    ...base,
    id: "q_imo6a_47",
    questionId: "IMO6A-Q47",
    topic: "Advanced Logic & Number Theory",
    difficulty: "ACHIEVER",
    questionText:
      "State 'T' for true and 'F' for false and select the correct option.\n(i) Set-squares are useful to draw parallel lines.\n(ii) 13.5 + 4 3/8 + 9 1/8 + 6 4/8 > 12.5 + 5 1/2 + 8 + 14.6\n(iii) Zero is less than every negative number.\n(iv) 4 more than −7 is −3.",
    multipleChoiceConfig: {
      options: [
        { id: "A", text: "(i) T, (ii) T, (iii) F, (iv) T" },
        { id: "B", text: "(i) T, (ii) F, (iii) F, (iv) T" },
        { id: "C", text: "(i) T, (ii) T, (iii) F, (iv) F" },
        { id: "D", text: "(i) F, (ii) T, (iii) F, (iv) T" },
      ],
      correctOptionId: "B",
      layout: "list",
    },
    customConfig: {
      activity: "truth-bench",
      statements: [
        {
          id: "i",
          text: "Set-squares are useful to draw parallel lines.",
          instrument: "set-square-board",
        },
        {
          id: "ii",
          text: "13.5 + 4 3/8 + 9 1/8 + 6 4/8  >  12.5 + 5 1/2 + 8 + 14.6",
          instrument: "twin-scale",
          config: {
            left: [13.5, [4, 3, 8], [9, 1, 8], [6, 4, 8]],
            right: [12.5, [5, 1, 2], 8, 14.6],
            relation: ">",
          },
        },
        {
          id: "iii",
          text: "Zero is less than every negative number.",
          instrument: "integer-line",
          config: { probe: 0, compareAgainst: "all-negatives", relation: "<" },
        },
        {
          id: "iv",
          text: "4 more than −7 is −3.",
          instrument: "integer-line",
          config: { start: -7, jump: 4, claimedResult: -3 },
        },
      ],
      readOrder: ["i", "ii", "iii", "iv"],
    },
    explanation:
      "Every statement gets tested, not guessed: slide set-squares to draw parallels, load both sides onto the twin scale, and hop along the integer line. The bench reports the T/F pattern you produced.",
  },
  {
    ...base,
    id: "q_imo6a_48",
    questionId: "IMO6A-Q48",
    topic: "Data Handling",
    difficulty: "ACHIEVER",
    questionText:
      "The given bar graph shows the sale of different brands of shirts in a shop in one month.\n(i) How many total shirts are sold in the month?\n(ii) Find the fraction of number of shirts sold of brand S to the number of shirts sold of brand P and R together.",
    multipleChoiceConfig: {
      options: [
        { id: "A", text: "195, 8/9" },
        { id: "B", text: "200, 13/8" },
        { id: "C", text: "165, 11/7" },
        { id: "D", text: "195, 13/8" },
      ],
      correctOptionId: "B",
      layout: "list",
    },
    customConfig: {
      activity: "bar-graph-reader",
      axisLabel: "Number of shirts sold",
      categoryLabel: "Brands",
      yMax: 70,
      yStep: 10,
      bars: [
        { id: "P", value: 15 },
        { id: "Q", value: 35 },
        { id: "R", value: 25 },
        { id: "S", value: 65 },
        { id: "T", value: 60 },
      ],
      queries: [
        { id: "total", kind: "sum", of: ["P", "Q", "R", "S", "T"] },
        { id: "fraction", kind: "ratio", numerator: ["S"], denominator: ["P", "R"] },
      ],
      readOrder: ["total", "fraction"],
    },
    explanation:
      "Drag the reading line across each bar to record its height, then drop bars into the two collectors: one totals every brand, the other compares S against P and R together.",
  },
  {
    ...base,
    id: "q_imo6a_49",
    questionId: "IMO6A-Q49",
    topic: "Fractions & Decimals",
    difficulty: "ACHIEVER",
    questionText: "Study the given number lines and find the value of (S + R) ÷ (P − Q).",
    multipleChoiceConfig: {
      options: [
        { id: "A", text: "1 64/101" },
        { id: "B", text: "1 512/101" },
        { id: "C", text: "2 512/403" },
        { id: "D", text: "1 61/213" },
      ],
      correctOptionId: "A",
      layout: "list",
    },
    customConfig: {
      activity: "twin-number-lines",
      lines: [
        {
          id: "top",
          min: 0,
          max: 3,
          divisions: 8,
          markers: [
            { id: "S", num: 13, den: 8 },
            { id: "P", num: 21, den: 8 },
          ],
        },
        {
          id: "bottom",
          min: 0,
          max: 3,
          divisions: 10,
          markers: [
            { id: "Q", num: 1, den: 10 },
            { id: "R", num: 25, den: 10 },
          ],
        },
      ],
      expression: { numerator: ["S", "+", "R"], denominator: ["P", "-", "Q"], operation: "divide" },
      renderAsMixed: true,
    },
    explanation:
      "Read each marker off its own number line by snapping it to the tick it sits on. The expression panel then adds, subtracts and divides the exact fractions.",
  },
  {
    ...base,
    id: "q_imo6a_50",
    questionId: "IMO6A-Q50",
    topic: "Fractions & Ratio",
    difficulty: "ACHIEVER",
    questionText:
      "Match the figures given in Column-I with their shaded ratio given in Column-II and select the correct option.",
    multipleChoiceConfig: {
      options: [
        { id: "A", text: "(P) → (iii), (Q) → (iv), (R) → (i), (S) → (ii)" },
        { id: "B", text: "(P) → (iv), (Q) → (iii), (R) → (ii), (S) → (i)" },
        { id: "C", text: "(P) → (iv), (Q) → (iv), (R) → (i), (S) → (ii)" },
        { id: "D", text: "(P) → (iii), (Q) → (ii), (R) → (iv), (S) → (i)" },
      ],
      correctOptionId: "B",
      layout: "list",
    },
    customConfig: {
      activity: "shade-ratio-match",
      // Column-I figures: total parts and how many are shaded, giving shaded : unshaded.
      figures: [
        { id: "P", label: "Hexagon in 12 sectors", parts: 12, shaded: 4, shape: "hexagon-12" },
        { id: "Q", label: "Square in 8 triangles", parts: 19, shaded: 7, shape: "square-8" },
        { id: "R", label: "Triangle strip", parts: 20, shaded: 7, shape: "triangle-strip" },
        { id: "S", label: "Tiled cross", parts: 8, shaded: 3, shape: "tiled-cross" },
      ],
      ratios: [
        { id: "i", text: "3 : 5" },
        { id: "ii", text: "7 : 13" },
        { id: "iii", text: "7 : 12" },
        { id: "iv", text: "1 : 2" },
      ],
      readOrder: ["P", "Q", "R", "S"],
    },
    explanation:
      "Shade each figure by tapping its parts until it matches the printed pattern, then run a cord from every figure to the ratio its shading produces.",
  },
];
