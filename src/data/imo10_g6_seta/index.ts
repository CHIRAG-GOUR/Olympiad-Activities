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
  "ACDCBACAAA" + "AABBCDBABB" + "DADABABCAD" + "CCDAACADCB" + "AAADBBCDDD";

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

const F = (n: string) => ({ src: `/papers/imo7/${n}.png` });
const figOpts = (n: string) => ({ A: F(`${n}A`), B: F(`${n}B`), C: F(`${n}C`), D: F(`${n}D`) });
const dial = (hint: string, extra: Record<string, unknown> = {}) => ({ lab: { mode: "dial", hints: [hint], ...extra } });
const tile = (template: string, hint: string, extra: Record<string, unknown> = {}) => ({ lab: { mode: "tile", template, hints: [hint], ...extra } });
const fig = (n: string, slot: string, hint: string, stem = true) => ({ lab: { mode: "figure", ...(stem ? { fig: F(n) } : {}), opts: figOpts(n), slot, hints: [hint] } });

// Transcribed from the scan of Question Paper VI Imo - 7 (10th IMO, Set A); figures are cropped from it.
export const IMO10_G6_SETA_QUESTIONS: Question[] = [
  // ── Logical Reasoning ──
  q(1, "Number Analogy", "Find the missing number, if same rule is followed in all the three figures.", ["49", "37", "50", "94"], dial("Compare 25 with 5, and 36 with 6.", { fig: F("q01") })),
  q(2, "Paper Folding & Cutting", "A set of three figures X, Y and Z showing a sequence of folding of a piece of paper is given. Fig. (Z) shows the manner in which the folded paper has been cut. Select the option which shows the unfolded form of Fig. (Z).", ["Figure A", "Figure B", "Figure C", "Figure D"], fig("q02", "Unfolded paper", "Unfold one step at a time; each fold doubles the holes, mirrored across the fold.")),
  q(3, "Mirror Images", "Select the correct mirror image of Fig. (X).", ["Figure A", "Figure B", "Figure C", "Figure D"], fig("q03", "Mirror image", "The mirror is on the right: left and right swap, up and down stay.")),
  q(4, "Odd One Out", "Select odd one out.", ["Lion", "Cat", "Rabbit", "Fox"], tile("The odd one out is ___.", "Think about what each animal eats.")),
  q(5, "Cube Nets", "Which of the following net can be used to form the given cube?", ["Net A", "Net B", "Net C", "Net D"], fig("q05", "The net that folds into the cube", "In a net, faces that are opposite on the cube never touch.")),
  q(6, "Direction Sense", "Latika is facing Bikaner. What will she be facing, if she turns 315° anti-clockwise?", ["McD", "KFC", "Subway", "Nirula's"], tile("After turning 315° anti-clockwise, Latika faces ___.", "315° anti-clockwise is the same as 45° clockwise.", { fig: F("q06") })),
  q(7, "Coded Relations", "If 'earth' is called 'sky', 'sky' is called 'tree' and 'tree' is called 'wall', then on which of the following a fruit grows?", ["earth", "sky", "wall", "tree"], tile("A fruit grows on the ___.", "A fruit really grows on a tree — what is a tree called here?")),
  q(8, "Embedded Figures", "In which of the following options, Fig. (X) is exactly embedded as one of its part?", ["Figure A", "Figure B", "Figure C", "Figure D"], fig("q08", "Contains Fig. (X)", "Look for the exact shape, the same way round and the same size.")),
  q(9, "Figure Analogy", "There is a certain relationship between figures (1) and (2). Establish the same relationship between figures (3) and (4) by selecting a suitable figure from the options which will replace the (?) in figure (4).", ["Figure A", "Figure B", "Figure C", "Figure D"], fig("q09", "Figure (4)", "Count the lines in figures (1) and (2) — how does the number change?")),
  q(10, "Missing Number", "Find the missing number.", ["64", "400", "360", "380"], dial("Find how the four corner numbers of each box make the number below it.", { fig: F("q10") })),
  q(11, "Counting Figures", "How many circles are there in the figure given below?", ["9", "10", "11", "12"], { lab: { mode: "count", what: "circle", fig: F("q11"), hints: ["Count the ring of circles, then check the centre."] } }),
  q(12, "Pattern Completion", "Which of the following options will complete the Fig. (X)?", ["Figure A", "Figure B", "Figure C", "Figure D"], fig("q12", "The ? quarter", "The figure is symmetrical — the missing quarter mirrors the one opposite it.")),
  q(13, "Ranking", "Naman ranks 14th from the top and 26th from the bottom in a class. How many students are there in the class?", ["31", "39", "34", "33"], dial("Total = rank from top + rank from bottom − 1.")),
  q(14, "Mathematical Operations", "If 8 ★ 7 = 56, 9 ★ 6 = 54 and 8 ★ 3 = 24, then find the value of 8 ★ 5.", ["55", "40", "50", "44"], dial("Work out what ★ does from the three examples.")),
  q(15, "Direction Sense", "One morning Raju start walk towards his school. After covering 5 km distance in East, he turned to the left and walk 2 km, then again turns to the right and walk 5 km. He again turns to the left. In which direction is he facing now?", ["East", "West", "North", "South"], tile("Raju is now facing ___.", "Track each turn: left from East is North.")),
  // ── Mathematical Reasoning ──
  q(16, "Decimals", "The simplification of 2.002 + 7.9 {2.8 − 6.3(3.6 − 1.5) + 15.6} yields", ["2.002", "4.2845", "40.843", "42.845"], dial("Work from the innermost bracket outwards.")),
  q(17, "Fractions", "If I = 13/4 ÷ 5/6, II = 13 ÷ [(4 ÷ 5) ÷ 6], III = [13 ÷ (4 ÷ 5)] ÷ 6 and IV = 13 ÷ 4(5 ÷ 6) then, which of the following are equal?", ["I and II", "I and IV", "I and III", "All are equal"], tile("The equal ones are: ___.", "Work out each value as a fraction.")),
  q(18, "Number System", "Which of the following statements is/are INCORRECT?\n(i) Eighty four in Roman numeral is written as CXXXIV.\n(ii) There are seven zeroes in 1 crore.\n(iii) There are ten thousand milligrams in 1 kg.\n(iv) The smallest 4-digit number formed by using all the digits 4, 3, 0, 8 without repetition is 3048.", ["Both (i) and (iii)", "Both (i) and (iv)", "Only (i)", "Only (iii)"], { lab: { mode: "truth", statements: ["Eighty four in Roman numeral is written as CXXXIV.", "There are seven zeroes in 1 crore.", "There are ten thousand milligrams in 1 kg.", "The smallest 4-digit number formed by using all the digits 4, 3, 0, 8 without repetition is 3048."], map: { FTFT: "A", FTTF: "B", FTTT: "C", TTFT: "D" }, hints: ["Mark each statement true or false; the question asks for the incorrect ones."] } }),
  q(19, "Distributive Property", "Using distributive property, 258 × 1008 = ?", ["258 + 1000 + 8", "258 × 1000 + 258 × 8", "258 × 1000 + 8", "1000 + 8 × 258"], { lab: { mode: "build", tokens: ["258", "1000", "8", "×", "+"], hints: ["Split 1008 into 1000 + 8 and multiply each part."] } }),
  q(20, "Integers", "Which situation is best represented by the integer −12?", ["The length of curtains is increased by 12 inches.", "The price of petrol is reduced by ₹ 12.", "The size of picture is enlarged by 12 per cent.", "The temperature rises by 12°C."], tile("−12 stands for: ___", "A negative integer shows a decrease.")),
  q(21, "Area", "Find the area of the following figure (not drawn to scale) by splitting them into rectangles and squares.", ["14 sq. cm", "15 sq. cm", "17 sq. cm", "16 sq. cm"], dial("Split the shape into one tall strip and three arms.", { fig: F("q21"), unit: "sq. cm" })),
  q(22, "Fractions", "Match the fractions given in Column I with the shaded portion of figures in Column II.", ["(i) → (r); (ii) → (q); (iii) → (s); (iv) → (p)", "(i) → (s); (ii) → (p); (iii) → (r); (iv) → (q)", "(i) → (r); (ii) → (s); (iii) → (p); (iv) → (q)", "(i) → (q); (ii) → (p); (iii) → (s); (iv) → (r)"], { lab: { mode: "match", left: ["6/4", "6/10", "6/6", "6/16"], right: [{ key: "p", text: "", img: "/papers/imo7/q22p.png" }, { key: "q", text: "", img: "/papers/imo7/q22q.png" }, { key: "r", text: "", img: "/papers/imo7/q22r.png" }, { key: "s", text: "", img: "/papers/imo7/q22s.png" }], map: { "r,q,s,p": "A", "s,p,r,q": "B", "r,s,p,q": "C", "q,p,s,r": "D" }, hints: ["Count shaded parts over total parts in each figure."] } }),
  q(23, "Symmetry", "How many of the following figures are symmetrical?", ["9", "10", "3", "None of these"], { lab: { mode: "count", what: "symmetrical figure", fig: F("q23"), hints: ["Look for a line that folds the figure onto itself."] } }),
  q(24, "Area", "The diagram below shows a framed picture. Find the area of the picture.", ["48 cm²", "39 cm²", "92 cm²", "120 cm²"], dial("Take away the 2 cm frame from both sides of each measurement.", { fig: F("q24"), unit: "cm²" })),
  q(25, "Integers", "Which sign will show correct comparison between the given expressions?\n(−3) − 74 + (−42) + (−82) ☐ (−12) + (−43) − (−57) + 1", [">", "<", "=", "Can't be determined"], { lab: { mode: "compare", left: "(−3) − 74 + (−42) + (−82)", right: "(−12) + (−43) − (−57) + 1", map: { ">": "A", "<": "B", "=": "C" }, hints: ["Subtracting a negative is adding."] } }),
  q(26, "Collinear Points", "The number of collinear points in the given figure are", ["10", "18", "15", "12"], dial("Points on one straight line are collinear.", { fig: F("q26") })),
  q(27, "Polygons", "A polygon has prime number of sides. If number of sides is equal to the sum of the two least consecutive primes. The number of diagonals of the polygon is", ["4", "5", "7", "10"], dial("The two least consecutive primes are 2 and 3; diagonals = n(n − 3)/2.")),
  q(28, "Prime Numbers", "Number of primes between 16 to 80 and 90 to 100 is", ["20", "18", "17", "16"], dial("List the primes in each range and add the counts.")),
  q(29, "3D Shapes", "Which three-dimensional figure has 5 faces, 8 edges and 5 vertices?", ["Figure A", "Figure B", "Figure C", "Figure D"], fig("q29", "5 faces · 8 edges · 5 vertices", "Count the faces, edges and corners of each solid.", false)),
  q(30, "Angles", "If the sum of two angles is equal to an obtuse angle, then which of the following is not possible?", ["One obtuse and one acute angle", "One right angle and one acute angle", "Two acute angles", "Two right angles"], tile("Not possible: ___", "An obtuse angle is more than 90° but less than 180°.")),
  q(31, "Logic & Numbers", "Latika, Garima and Sanchi draw 3 cards each from 9 cards numbered from 1 to 9. (Latika : L, Garima : G, Sanchi : S)\nL : The product of my numbers is 48.\nG : The sum of my numbers is 15.\nS : The product of my numbers is 63.\nWhat is the largest number in the cards of Sanchi?", ["8", "7", "9", "6"], dial("Which three different cards multiply to 63?")),
  q(32, "HCF", "Find the greatest number from the options that will divide 1025, 1299 and 1575 leaving remainders 5, 7 and 11 respectively.", ["70", "78", "68", "98"], dial("Subtract the remainders first, then find the HCF.")),
  q(33, "Rounding", "Select the CORRECT statement.", ["1592 rounded off to nearest tens is 1600.", "7532 rounded off to nearest thousands is 7500.", "245 rounded off to nearest hundreds is 240.", "214653 rounded off to nearest ten thousands is 210000."], { lab: { mode: "truth", statements: ["1592 rounded off to nearest tens is 1600.", "7532 rounded off to nearest thousands is 7500.", "245 rounded off to nearest hundreds is 240.", "214653 rounded off to nearest ten thousands is 210000."], map: { TFFF: "A", FTFF: "B", FFTF: "C", FFFT: "D" }, hints: ["Round each number yourself before judging."] } }),
  q(34, "Comparing Fractions", "In an activity class, students were asked to make a circular rangoli. Trishu, Sidak, Mini and Kavleen made rangolies having different diameters as 17/20 inches, 3/4 inches, 5/6 inches and 7/10 inches, respectively. Who among them made the smallest one?", ["Kavleen", "Trishu", "Mini", "Sidak"], tile("The smallest rangoli was made by ___.", "Compare the fractions over a common denominator of 60.")),
  q(35, "Zero", "Which of the following will not represent zero?", ["1/0", "0 × 9", "0/2", "(3 − 3)/2"], tile("___ does not represent zero.", "Division by zero is not defined.")),
  // ── Everyday Mathematics ──
  q(36, "Fractions", "Mohit travelled 2/3 of his journey by train, 1/4 of the journey by bus and the remaining journey by car. If the distance he travelled by train is 60 km more than the distance he travelled by bus, what was the total distance he had travelled?", ["70 km", "250 km", "144 km", "153 km"], dial("2/3 − 1/4 of the journey equals 60 km.", { unit: "km" })),
  q(37, "LCM", "Deepika has more than 30 stickers but less than 40 stickers. She can pack the stickers into packs of 2, 3 or 4 without leaving any remainder. How many stickers does she have?", ["36", "37", "33", "39"], dial("The number is a multiple of the LCM of 2, 3 and 4.")),
  q(38, "Area & Cost", "Priya used four similar rectangular carpets and a square carpet for the flooring in her study room as shown below. If it cost her ₹ 6 per square metre for the rectangular carpets and ₹ 8 per square metre for the square carpet, how much did she pay in all?", ["₹ 512", "₹ 600", "₹ 417", "₹ 416"], dial("Find the rectangle size from the 6 m and 2 m marks, then the square in the middle.", { fig: F("q38"), unit: "₹" })),
  q(39, "Decimals", "Kiara weighs 34.5 kg. Her uncle weighs thrice as much as Kiara. What is their total weight?", ["69 kg", "103.50 kg", "138 kg", "172.50 kg"], dial("Total = Kiara + 3 × Kiara.", { unit: "kg" })),
  q(40, "HCF", "Two ropes 16 m and 20 m long are to be cut into small pieces of equal lengths. What will be the maximum length of each piece?", ["5 m", "4 m", "7 m", "10 m"], dial("The longest equal piece is the HCF.", { unit: "m" })),
  q(41, "Large Numbers", "A cold storage company had a stock of 58970252 egg trays. Out of this stock, 3789441 egg trays were sent to Delhi and 4207985 egg trays were sent to Punjab for public consumption. How much is the exact count of eggs left with company, if an egg tray contains 30 eggs?", ["1529184780", "1509184780", "1529084780", "1529184880"], dial("Trays left × 30 eggs.")),
  q(42, "Money", "Garima was shopping for a new hand bag. The one she wanted to buy cost ₹ 428.98. The sales person informed her that the same hand bag would be on sale the following week for ₹ 399.99. How much money would she save by waiting until the hand bag went on sale?", ["₹ 28.99", "₹ 29.01", "₹ 128.99", "₹ 39.09"], dial("Subtract the sale price from the full price.", { unit: "₹" })),
  q(43, "Fractions", "1/10 of a rod is coloured red, 1/20 orange, 1/30 yellow, 1/40 green, 1/50 blue, 1/60 black and the rest violet. If the length of the violet portion is 12.08 m, then what is the length of the rod?", ["16 m", "18 m", "20 m", "30 m"], dial("Add the coloured fractions; the rest of the rod is violet.", { unit: "m" })),
  q(44, "Decimals", "A drum of oil has a capacity of 705 litres. Two containers of 135.75 litres and 253.50 litres capacity are filled with oil from the drum. Find the quantity of oil left in the drum.", ["720 litres", "300 litres", "215.75 litres", "315.75 litres"], dial("Subtract both containers from the drum.", { unit: "litres" })),
  q(45, "Multiplication", "A truck can carry 582 boxes of biscuits weighing 16 kg each, whereas a van can carry 359 boxes each of the same weight. Find the total weight that can be carried by both the vehicles.", ["20000 kg", "15056 kg", "25000 kg", "12000 kg"], dial("Add the boxes first, then multiply by 16 kg.", { unit: "kg" })),
  // ── Achievers Section ──
  q(46, "3D Shapes", "Match the following.", ["(P) – (i), (Q) – (ii), (R) – (iv), (S) – (iii)", "(P) – (ii), (Q) – (iii), (R) – (iv), (S) – (i)", "(P) – (ii), (Q) – (iv), (R) – (iii), (S) – (i)", "(P) – (ii), (Q) – (iii), (R) – (i), (S) – (iv)"], { lab: { mode: "match", left: ["P", "Q", "R", "S"], leftImg: ["/papers/imo7/q46P.png", "/papers/imo7/q46Q.png", "/papers/imo7/q46R.png", "/papers/imo7/q46S.png"], right: [{ key: "i", text: "Octagonal Prism" }, { key: "ii", text: "Triangular Prism" }, { key: "iii", text: "Rectangular Pyramid" }, { key: "iv", text: "Pentagonal Pyramid" }], map: { "i,ii,iv,iii": "A", "ii,iii,iv,i": "B", "ii,iv,iii,i": "C", "ii,iii,i,iv": "D" }, hints: ["Count the sides of the base, and check whether the solid comes to a point."] } }),
  q(47, "Fractions", "Trishika bought some strawberries. 1/8 of the strawberries were rotten and had to be thrown away. Trishika then used 25 strawberries to bake a cake. She then had 1/4 of the total strawberries left.\n(a) How many strawberries did she have at first?\n(b) If Trishika shared the remaining strawberries between her two sons equally, what fraction of the strawberries did each of them receive?", ["(a) 70; (b) 1/8", "(a) 50; (b) 4/8", "(a) 40; (b) 1/8", "(a) 40; (b) 1/4"], { lab: { mode: "multi", parts: [{ label: "strawberries at first" }, { label: "fraction each son received" }], hints: ["The 25 used for the cake are 1 − 1/8 − 1/4 of the whole."] } }),
  q(48, "Prime Numbers", "Consider the following statements:\nI. Every prime is odd.\nII. Product of any two prime numbers is odd.\nWhich of the given statement(s) is/are correct?", ["I alone", "II alone", "I and II", "Neither I nor II"], { lab: { mode: "truth", statements: ["Every prime is odd.", "Product of any two prime numbers is odd."], map: { TF: "A", FT: "B", TT: "C", FF: "D" }, hints: ["Is 2 a prime number?"] } }),
  q(49, "Data Handling", "Study the bar graph (preferences of people in playing different games over the years). From 2011 to 2016, find the difference between the total number of people who preferred to play Basketball and Badminton (in millions)?", ["525", "275", "730", "250"], dial("Add the Basketball bars and the Badminton bars separately.", { fig: F("q49") })),
  q(50, "Data Handling", "Study the bar graph (preferences of people in playing different games over the years). How many people (in millions) have preferred to play Tennis in all the years altogether?", ["3200", "2100", "1200", "1700"], dial("Add the six Tennis bars.", { fig: F("q49") })),
];

const ids = (from: number, to: number) => IMO10_G6_SETA_QUESTIONS.slice(from, to).map((x) => x.id);

export const IMO10_G6_SETA_EXAM: Exam = {
  id: "imo-class6-setA-2026",
  code: "IMO-10TH-G6-SETA",
  title: "10th SOF International Mathematics Olympiad (Set A)",
  subtitle: "Class 6 • Set A • Level 1 • 50 Bespoke Interactive Olympiad Missions",
  description:
    "Official 10th SOF International Mathematics Olympiad (IMO) Class 6 Set A Level-1 digital examination. Complete with 50 bespoke interactive activities, live calculation chambers, 3D spatial environments, deterministic answer resolvers, and full real-time scoring.",
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
      "This examination contains 50 questions across 4 sections.",
      "Section 1: Logical Reasoning (Q1–Q15, 1 mark each).",
      "Section 2: Mathematical Reasoning (Q16–Q35, 1 mark each).",
      "Section 3: Everyday Mathematics (Q36–Q45, 1 mark each).",
      "Section 4: Achievers Section (Q46–Q50, 3 marks each).",
      "Total time allowed is 60 minutes. There is no negative marking.",
      "Each question is paired with a bespoke interactive activity. Completing the activity automatically solves and records your answer.",
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
