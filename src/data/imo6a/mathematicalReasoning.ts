import { Question } from "@/types/question";

/**
 * SOF IMO 2018-19 · Class 6 · Set A — Section 2: Mathematical Reasoning (Q16–Q35, 1 mark each).
 *
 * Text and options transcribed verbatim from the official paper; correct option ids come
 * from the official answer key. `customConfig` holds the microworld parameters for each
 * activity so no component hard-codes either the numbers or the answer.
 */

const base = {
  subjectId: "sub_mathematics",
  subjectName: "Mathematics",
  grade: 6 as const,
  section: "Mathematical Reasoning" as const,
  chapter: "Mathematical Reasoning",
  questionType: "MULTIPLE_CHOICE" as const,
  marks: 1,
  negativeMarks: 0,
  version: 1,
  status: "Published" as const,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};

export const IMO6A_MATHEMATICAL_REASONING: Question[] = [
  {
    ...base,
    id: "q_imo6a_16",
    questionId: "IMO6A-Q16",
    topic: "Knowing Our Numbers",
    difficulty: "EASY",
    questionText:
      "Find the difference between the smallest 5-digit number and the greatest 5-digit number formed by using the digits 6, 8, 2, 5 and 9 (using each digit only once).",
    multipleChoiceConfig: {
      options: [
        { id: "A", text: "27936" },
        { id: "B", text: "72963" },
        { id: "C", text: "56293" },
        { id: "D", text: "39576" },
      ],
      correctOptionId: "B",
      layout: "list",
    },
    customConfig: {
      activity: "digit-arranger",
      digits: [6, 8, 2, 5, 9],
      rows: [
        { id: "smallest", label: "Smallest 5-digit number" },
        { id: "greatest", label: "Greatest 5-digit number" },
      ],
      operation: "absolute-difference",
    },
    explanation:
      "Drag the five digit tiles into both racks to build the smallest and the greatest number, then the subtraction bar shows their difference.",
  },
  {
    ...base,
    id: "q_imo6a_17",
    questionId: "IMO6A-Q17",
    topic: "Playing with Numbers & LCM/HCF",
    difficulty: "EASY",
    questionText:
      "If the product of two numbers is 1728 and their H.C.F. is 12, then their L.C.M. is _____.",
    multipleChoiceConfig: {
      options: [
        { id: "A", text: "156" },
        { id: "B", text: "144" },
        { id: "C", text: "256" },
        { id: "D", text: "172" },
      ],
      correctOptionId: "B",
      layout: "list",
    },
    customConfig: {
      activity: "hcf-lcm-gearbox",
      product: 1728,
      hcf: 12,
      // Student drives the gear train: product on the input shaft, HCF on the divider gear.
      solveFor: "lcm",
    },
    explanation:
      "Feed the product into the gearbox and set the H.C.F. gear. The output shaft turns at product ÷ H.C.F., which is the L.C.M.",
  },
  {
    ...base,
    id: "q_imo6a_18",
    questionId: "IMO6A-Q18",
    topic: "Roman Numerals",
    difficulty: "MEDIUM",
    questionText: "Which of the following options gives the result CCC?",
    multipleChoiceConfig: {
      options: [
        { id: "A", text: "MXIII − DCCXIV" },
        { id: "B", text: "LXIV + CCXXVI" },
        { id: "C", text: "CXXIX + CLXXI" },
        { id: "D", text: "XCVI + CCII" },
      ],
      correctOptionId: "C",
      layout: "list",
    },
    customConfig: {
      activity: "roman-forge",
      target: "CCC",
      candidates: [
        { optionId: "A", left: "MXIII", op: "-", right: "DCCXIV" },
        { optionId: "B", left: "LXIV", op: "+", right: "CCXXVI" },
        { optionId: "C", left: "CXXIX", op: "+", right: "CLXXI" },
        { optionId: "D", left: "XCVI", op: "+", right: "CCII" },
      ],
    },
    explanation:
      "Load each Roman expression onto the forge. It melts both numerals into Hindu-Arabic values, performs the operation and recasts the result — only one casting matches CCC.",
  },
  {
    ...base,
    id: "q_imo6a_19",
    questionId: "IMO6A-Q19",
    topic: "Properties of Operations",
    difficulty: "EASY",
    questionText:
      "Which of the following properties holds true in the given expression?\n72(4 + 5) = 72 × 4 + 72 × 5",
    multipleChoiceConfig: {
      options: [
        { id: "A", text: "Commutative property" },
        { id: "B", text: "Closure property" },
        { id: "C", text: "Associative property" },
        { id: "D", text: "Distributive property" },
      ],
      correctOptionId: "D",
      layout: "list",
    },
    customConfig: {
      activity: "area-distributor",
      multiplier: 72,
      parts: [4, 5],
      // Splitting the rectangle demonstrates which law is at work.
      propertyOfSplit: "Distributive property",
    },
    explanation:
      "Slice the 72-by-9 rectangle into a 72-by-4 piece and a 72-by-5 piece. The law that lets you do this without changing the total area is the one being demonstrated.",
  },
  {
    ...base,
    id: "q_imo6a_20",
    questionId: "IMO6A-Q20",
    topic: "Knowing Our Numbers",
    difficulty: "MEDIUM",
    questionText:
      "If a number is formed by interchanging the digits at tens and thousands places of 7939, then which of the following is CORRECT?",
    multipleChoiceConfig: {
      options: [
        { id: "A", text: "New number > Original number" },
        { id: "B", text: "New number < Original number" },
        { id: "C", text: "New number = Original number" },
        { id: "D", text: "None of these" },
      ],
      correctOptionId: "B",
      layout: "list",
    },
    customConfig: {
      activity: "place-value-swapper",
      number: 7939,
      swap: ["thousands", "tens"],
      comparisonLabels: { gt: "New number > Original number", lt: "New number < Original number", eq: "New number = Original number" },
    },
    explanation:
      "Lift the digits out of the tens and thousands columns and swap them. The balance beam then weighs the new number against the original.",
  },
  {
    ...base,
    id: "q_imo6a_21",
    questionId: "IMO6A-Q21",
    topic: "Lines, Rays & Angles",
    difficulty: "MEDIUM",
    questionText: "Find the minimum number of points at which three lines intersect.",
    multipleChoiceConfig: {
      options: [
        { id: "A", text: "1" },
        { id: "B", text: "3" },
        { id: "C", text: "2" },
        { id: "D", text: "0" },
      ],
      correctOptionId: "A",
      layout: "list",
    },
    customConfig: {
      activity: "line-arranger",
      lineCount: 3,
      // The three lines must genuinely intersect; the board counts distinct crossing points.
      requireIntersecting: true,
      goal: "minimise",
    },
    explanation:
      "Drag and rotate the three lines. The board marks every distinct crossing point and reports the count — push it as low as it will go while the lines still intersect.",
  },
  {
    ...base,
    id: "q_imo6a_22",
    questionId: "IMO6A-Q22",
    topic: "Practical Geometry",
    difficulty: "EASY",
    questionText: "Using a ruler and compasses, which of the following constructions can be made?",
    multipleChoiceConfig: {
      options: [
        { id: "A", text: "A circle, when the length of its radius is known." },
        { id: "B", text: "The perpendicular bisector of a line segment of the given length." },
        { id: "C", text: "Both A and B" },
        { id: "D", text: "None of these" },
      ],
      correctOptionId: "C",
      layout: "list",
    },
    customConfig: {
      activity: "compass-bench",
      tasks: [
        { id: "circle", label: "Draw a circle of a known radius", optionId: "A" },
        { id: "bisector", label: "Construct the perpendicular bisector of a segment", optionId: "B" },
      ],
      bothOptionId: "C",
      neitherOptionId: "D",
      // Mini-game: a known radius to set on the compass and a segment to bisect (centimetres).
      play: { radiusCm: 3, segmentCm: 4 },
    },
    explanation:
      "Attempt each construction on the bench with only the ruler and the pair of compasses. The bench records which constructions you actually completed.",
  },
  {
    ...base,
    id: "q_imo6a_23",
    questionId: "IMO6A-Q23",
    topic: "Integers & Signs",
    difficulty: "EASY",
    questionText:
      "On a number line, numbers are marked at a distance of 1 cm apart from each other. One end of a line segment is at −8 and the other end is at 9. How long is the line segment (in cm)?",
    multipleChoiceConfig: {
      options: [
        { id: "A", text: "1" },
        { id: "B", text: "−1" },
        { id: "C", text: "16" },
        { id: "D", text: "17" },
      ],
      correctOptionId: "D",
      layout: "list",
    },
    customConfig: {
      activity: "number-line-ruler",
      min: -12,
      max: 12,
      spacingCm: 1,
      endpoints: [-8, 9],
      unit: "cm",
    },
    explanation:
      "Drag the two end markers onto −8 and 9. The measuring tape between them counts the 1 cm steps it spans.",
  },
  {
    ...base,
    id: "q_imo6a_24",
    questionId: "IMO6A-Q24",
    topic: "Word Problems",
    difficulty: "HARD",
    questionText:
      "1162 is divided into three parts such that 4 times the first part, 5 times the second part and 7 times the third part are equal. Find the parts.",
    multipleChoiceConfig: {
      options: [
        { id: "A", text: "490, 392, 280" },
        { id: "B", text: "492, 392, 278" },
        { id: "C", text: "493, 329, 340" },
        { id: "D", text: "393, 290, 360" },
      ],
      correctOptionId: "A",
      layout: "list",
    },
    customConfig: {
      activity: "triple-balance",
      total: 1162,
      multipliers: [4, 5, 7],
      partLabels: ["First part", "Second part", "Third part"],
    },
    explanation:
      "Pour the 1162 units between three tanks. Each tank's reading is multiplied by its own factor; balance the three beams while the total stays 1162.",
  },
  {
    ...base,
    id: "q_imo6a_25",
    questionId: "IMO6A-Q25",
    topic: "Fractions & Decimals",
    difficulty: "EASY",
    questionText: "Find the fraction, if its decimal value is 0.6 and denominator is 75.",
    multipleChoiceConfig: {
      options: [
        { id: "A", text: "35/75" },
        { id: "B", text: "45/75" },
        { id: "C", text: "65/75" },
        { id: "D", text: "85/75" },
      ],
      correctOptionId: "B",
      layout: "list",
    },
    customConfig: {
      activity: "fraction-dialer",
      denominator: 75,
      targetDecimal: 0.6,
      numeratorRange: { min: 0, max: 90, step: 5 },
    },
    explanation:
      "Turn the numerator dial. The gauge shows the fraction's decimal value live — stop when it reads exactly 0.6.",
  },
  {
    ...base,
    id: "q_imo6a_26",
    questionId: "IMO6A-Q26",
    topic: "Perimeter & Area",
    difficulty: "HARD",
    questionText:
      "In the given figure (not drawn to scale), ΔABC, ΔEFG, ΔKIJ and ΔNMO are 4 different equilateral triangles. Find the perimeter of the figure, if side of square PDHL is 8 cm, AC = 4 cm, EG = 2 cm, KI = 3 cm and MO = 2 cm.",
    multipleChoiceConfig: {
      options: [
        { id: "A", text: "34 cm" },
        { id: "B", text: "64 cm" },
        { id: "C", text: "43 cm" },
        { id: "D", text: "52 cm" },
      ],
      correctOptionId: "C",
      layout: "list",
    },
    customConfig: {
      activity: "perimeter-walker",
      squareSide: 8,
      // Each triangle sits on one side of the square; its base is removed from the outline
      // and its other two sides are added.
      triangles: [
        { name: "ΔABC", side: 4, on: "top" },
        { name: "ΔEFG", side: 2, on: "right" },
        { name: "ΔKIJ", side: 3, on: "bottom" },
        { name: "ΔNMO", side: 2, on: "left" },
      ],
      unit: "cm",
    },
    explanation:
      "Walk the tracer all the way round the outside edge. Every stretch it covers is added up; the bases hidden under the triangles are never walked.",
  },
  {
    ...base,
    id: "q_imo6a_27",
    questionId: "IMO6A-Q27",
    topic: "Algebra",
    difficulty: "MEDIUM",
    questionText:
      "If a = 8 and x = 4, then the value of (3ax + 6x − 9) / (3a − 4x − 2) is _____.",
    multipleChoiceConfig: {
      options: [
        { id: "A", text: "18 1/3" },
        { id: "B", text: "19 2/7" },
        { id: "C", text: "19 1/3" },
        { id: "D", text: "18 1/2" },
      ],
      correctOptionId: "D",
      layout: "list",
    },
    customConfig: {
      activity: "substitution-lab",
      variables: [
        { name: "a", value: 8, min: 0, max: 12 },
        { name: "x", value: 4, min: 0, max: 12 },
      ],
      numerator: { terms: [{ coef: 3, vars: ["a", "x"] }, { coef: 6, vars: ["x"] }, { coef: -9, vars: [] }] },
      denominator: { terms: [{ coef: 3, vars: ["a"] }, { coef: -4, vars: ["x"] }, { coef: -2, vars: [] }] },
      renderAsMixed: true,
    },
    explanation:
      "Load the value of each variable into its socket. The lab evaluates the numerator and denominator separately and reduces the result to a mixed number.",
  },
  {
    ...base,
    id: "q_imo6a_28",
    questionId: "IMO6A-Q28",
    topic: "Symmetry & Reflections",
    difficulty: "MEDIUM",
    questionText: "Which of the following squares should be shaded to make the given figure symmetric?",
    multipleChoiceConfig: {
      options: [
        { id: "A", text: "P and Q" },
        { id: "B", text: "P and S" },
        { id: "C", text: "Q and R" },
        { id: "D", text: "R and S" },
      ],
      correctOptionId: "D",
      layout: "list",
    },
    customConfig: {
      activity: "symmetry-grid",
      cols: 4,
      rows: 5,
      // Cells already shaded in the printed grid, as [col,row] zero-indexed.
      shaded: [[3, 0], [2, 1], [1, 2], [1, 3], [2, 3], [2, 4]],
      // Labelled candidate cells the student may toggle.
      labelled: [
        { id: "P", col: 0, row: 0 },
        { id: "S", col: 0, row: 2 },
        { id: "R", col: 2, row: 3 },
        { id: "Q", col: 0, row: 4 },
      ],
      axis: "diagonal",
      // Mini-game grid read cell by cell off the printed figure: 5 columns × 5 rows,
      // [col, row] from the top-left. The four lettered squares are the only ones a
      // student may paint.
      play: {
        cols: 5,
        rows: 5,
        shaded: [[4, 0], [1, 1], [3, 1], [0, 2], [2, 2], [1, 3], [2, 3], [2, 4]],
        labelled: [
          { id: "P", col: 1, row: 0 },
          { id: "S", col: 1, row: 2 },
          { id: "R", col: 3, row: 3 },
          { id: "Q", col: 1, row: 4 },
        ],
      },
    },
    explanation:
      "Switch candidate squares on and off. The mirror overlay shows live whether the pattern has become symmetric about the axis.",
  },
  {
    ...base,
    id: "q_imo6a_29",
    questionId: "IMO6A-Q29",
    topic: "Perimeter & Area",
    difficulty: "HARD",
    questionText: "Find the area of the given figure.",
    multipleChoiceConfig: {
      options: [
        { id: "A", text: "25.5 sq. cm" },
        { id: "B", text: "23.5 sq. cm" },
        { id: "C", text: "25 sq. cm" },
        { id: "D", text: "24 sq. cm" },
      ],
      correctOptionId: "A",
      layout: "list",
    },
    customConfig: {
      activity: "area-decomposer",
      unit: "sq. cm",
      // The composite outline as a closed path in centimetres, origin bottom-left:
      // a 6 × 3 base, a 2 × 3 tower on it and a 1.5 × 1 step beside the tower.
      outline: [
        [0, 0], [6, 0], [6, 3], [5.5, 3], [5.5, 4], [4, 4],
        [4, 6], [2, 6], [2, 3], [0, 3],
      ],
      grid: 0.5,
      width: 6,
      height: 6,
    },
    explanation:
      "Tile the shape with rectangles from the palette. The running total adds each rectangle's area and warns you if pieces overlap or leave a gap.",
  },
  {
    ...base,
    id: "q_imo6a_30",
    questionId: "IMO6A-Q30",
    topic: "Basic Geometrical Ideas",
    difficulty: "MEDIUM",
    questionText:
      "Read the statements carefully and select the CORRECT option.\nStatement-I : A circle is the path of a point moving at the same distance from a fixed point.\nStatement-II : A sector of a circle is a region in the interior of the circle enclosed by an arc and a chord.",
    multipleChoiceConfig: {
      options: [
        { id: "A", text: "Both Statement-I and Statement-II are true." },
        { id: "B", text: "Statement-I is true but Statement-II is false." },
        { id: "C", text: "Statement-I is false but Statement-II is true." },
        { id: "D", text: "Both Statement-I and Statement-II are false." },
      ],
      correctOptionId: "B",
      layout: "list",
    },
    customConfig: {
      activity: "circle-workbench",
      statements: [
        {
          id: "I",
          text: "A circle is the path of a point moving at the same distance from a fixed point.",
          test: "trace-locus",
        },
        {
          id: "II",
          text: "A sector of a circle is a region in the interior of the circle enclosed by an arc and a chord.",
          test: "build-region",
        },
      ],
      // The workbench lets the student build a region from an arc + chord and from an arc +
      // two radii, and name each; the truth of II follows from what they actually built.
      regionKinds: [
        { id: "sector", label: "Arc + two radii", name: "Sector" },
        { id: "segment", label: "Arc + a chord", name: "Segment" },
      ],
      verdictOptions: { TT: "A", TF: "B", FT: "C", FF: "D" },
    },
    explanation:
      "Test each statement on the bench: trace the locus for Statement-I, and build the arc-and-chord region for Statement-II to see what it is really called.",
  },
  {
    ...base,
    id: "q_imo6a_31",
    questionId: "IMO6A-Q31",
    topic: "Fractions & Decimals",
    difficulty: "MEDIUM",
    questionText: "Arrange the following in ascending order.\n6/15,  2/9,  4/7,  3/18",
    multipleChoiceConfig: {
      options: [
        { id: "A", text: "4/7, 2/9, 6/15, 3/18" },
        { id: "B", text: "3/18, 6/15, 2/9, 4/7" },
        { id: "C", text: "3/18, 2/9, 6/15, 4/7" },
        { id: "D", text: "2/9, 3/18, 4/7, 6/15" },
      ],
      correctOptionId: "C",
      layout: "list",
    },
    customConfig: {
      activity: "fraction-ladder",
      fractions: [
        { id: "f1", num: 6, den: 15 },
        { id: "f2", num: 2, den: 9 },
        { id: "f3", num: 4, den: 7 },
        { id: "f4", num: 3, den: 18 },
      ],
      order: "ascending",
    },
    explanation:
      "Drag the fraction bars into order. Each bar fills to its true size, so you can see which is smaller before you commit.",
  },
  {
    ...base,
    id: "q_imo6a_32",
    questionId: "IMO6A-Q32",
    topic: "Solids & Nets",
    difficulty: "MEDIUM",
    questionText:
      "The net of a solid is given. Identify the shape and find the number of faces of the solid formed when the net is folded.",
    multipleChoiceConfig: {
      options: [
        { id: "A", text: "Triangular pyramid, 4" },
        { id: "B", text: "Square pyramid, 5" },
        { id: "C", text: "Triangular prism, 5" },
        { id: "D", text: "Tetrahedron, 6" },
      ],
      correctOptionId: "A",
      layout: "list",
    },
    customConfig: {
      activity: "net-folder",
      // A large triangle split into four smaller triangles — the classic tetrahedron net.
      net: { kind: "triangle-of-triangles", panels: 4 },
      solidNames: ["Triangular pyramid", "Square pyramid", "Triangular prism", "Tetrahedron"],
    },
    explanation:
      "Drag the fold slider to raise the net into a solid, then count the faces the finished solid actually has.",
  },
  {
    ...base,
    id: "q_imo6a_33",
    questionId: "IMO6A-Q33",
    topic: "Divisibility",
    difficulty: "EASY",
    questionText: "Which of the following numbers is completely divisible by 9?",
    multipleChoiceConfig: {
      options: [
        { id: "A", text: "596348" },
        { id: "B", text: "965864" },
        { id: "C", text: "695844" },
        { id: "D", text: "746936" },
      ],
      correctOptionId: "C",
      layout: "list",
    },
    customConfig: {
      activity: "divisibility-sorter",
      divisor: 9,
      candidates: [
        { optionId: "A", value: 596348 },
        { optionId: "B", value: 965864 },
        { optionId: "C", value: 695844 },
        { optionId: "D", value: 746936 },
      ],
    },
    explanation:
      "Feed each number into the sorter. It stacks the digits to show the digit sum and reports whether that sum is a multiple of 9.",
  },
  {
    ...base,
    id: "q_imo6a_34",
    questionId: "IMO6A-Q34",
    topic: "Fractions & Decimals",
    difficulty: "HARD",
    questionText:
      "Find the values of circles P, Q and R respectively, such that the sum of the numbers in two quadrilaterals equals to the value of the circle in between them.",
    multipleChoiceConfig: {
      options: [
        { id: "A", text: "2.676, 8.064, 9.742" },
        { id: "B", text: "7.334, 6.442, 2.332" },
        { id: "C", text: "9.742, 2.676, 8.064" },
        { id: "D", text: "8.064, 9.742, 8.999" },
      ],
      correctOptionId: "A",
      layout: "list",
    },
    customConfig: {
      activity: "decimal-network",
      // Each quadrilateral carries a decimal expression; each circle joins two of them.
      nodes: [
        { id: "TL", kind: "quad", expression: "3.569 + 0.699 − 3.769", terms: [3.569, 0.699, -3.769] },
        { id: "TR", kind: "quad", expression: "0.99 − 0.48 + 1.667", terms: [0.99, -0.48, 1.667] },
        { id: "BM", kind: "quad", expression: "8.301 + 5.309 − 6.045", terms: [8.301, 5.309, -6.045] },
      ],
      circles: [
        { id: "P", between: ["TL", "TR"] },
        { id: "Q", between: ["TL", "BM"] },
        { id: "R", between: ["TR", "BM"] },
      ],
      readOrder: ["P", "Q", "R"],
      decimals: 3,
    },
    explanation:
      "Resolve each quadrilateral, then connect it to its neighbours. Every circle lights up with the sum of the two quadrilaterals it sits between.",
  },
  {
    ...base,
    id: "q_imo6a_35",
    questionId: "IMO6A-Q35",
    topic: "Ratio & Proportion",
    difficulty: "MEDIUM",
    questionText: "Which of the following ratios are in proportion?",
    multipleChoiceConfig: {
      options: [
        { id: "A", text: "150 g : 350 g and 35 kg : 210 kg" },
        { id: "B", text: "₹60 : ₹120 and ₹90 : ₹160" },
        { id: "C", text: "24 cm : 15 m and 80 g : 5 kg" },
        { id: "D", text: "3 L : 9 L and 18 mL : 27 L" },
      ],
      correctOptionId: "C",
      layout: "list",
    },
    customConfig: {
      activity: "proportion-scales",
      // Each candidate holds two ratios; quantities carry units that must be converted
      // to a common base before the pans can balance.
      candidates: [
        {
          optionId: "A",
          left: [{ v: 150, u: "g" }, { v: 350, u: "g" }],
          right: [{ v: 35, u: "kg" }, { v: 210, u: "kg" }],
        },
        {
          optionId: "B",
          left: [{ v: 60, u: "₹" }, { v: 120, u: "₹" }],
          right: [{ v: 90, u: "₹" }, { v: 160, u: "₹" }],
        },
        {
          optionId: "C",
          left: [{ v: 24, u: "cm" }, { v: 15, u: "m" }],
          right: [{ v: 80, u: "g" }, { v: 5, u: "kg" }],
        },
        {
          optionId: "D",
          left: [{ v: 3, u: "L" }, { v: 9, u: "L" }],
          right: [{ v: 18, u: "mL" }, { v: 27, u: "L" }],
        },
      ],
      unitBase: { g: 1, kg: 1000, cm: 1, m: 100, mL: 1, L: 1000, "₹": 1 },
    },
    explanation:
      "Convert each quantity to a common unit, then load the pair onto the twin scales. They balance only when the two ratios are genuinely equal.",
  },
];
