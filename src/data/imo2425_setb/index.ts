import { Question } from "@/types/question";
import { Exam } from "@/types/exam";
import { IMO_CLASS6_SETB_2024_EXAM } from "@/data/sofImoClass6SetB";

/**
 * SOF International Mathematics Olympiad 2024-25 · Class 6 · Set B · Level 1
 * Transcribed from "Question Paper VI Imo - 8.pdf" (the same scan as "Chirag Gour.pdf"); the key
 * is "Answer ket VI Imo - 8.pdf". Figures are cropped from the scan into public/papers/imo8.
 *
 * The official key lists answers for Q1–Q49 only. Q50's answer is worked out here: part (p)
 * is 66 cm, which only option A offers, so A is stored and flagged for review.
 * ("answer key.pdf" in the repository is not an official key — it contains guesses — and is not used.)
 */

export const IMO2425_SETB_KEY =
  "DABACABBAD" + "ABBBBCDBBB" + "DABBDBACBC" + "CDDCDCBABD" + "BDCACCABDA";

type Section = "Logical Reasoning" | "Mathematical Reasoning" | "Everyday Mathematics" | "Achievers Section";
const sectionOf = (n: number): Section => (n <= 15 ? "Logical Reasoning" : n <= 35 ? "Mathematical Reasoning" : n <= 45 ? "Everyday Mathematics" : "Achievers Section");

function q(n: number, topic: string, questionText: string, options: [string, string, string, string], customConfig: Record<string, unknown> = {}): Question {
  const nn = String(n).padStart(2, "0");
  return {
    id: `imo2425_b_q${nn}`,
    questionId: `IMO2425_B-Q${nn}`,
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
    createdAt: "2026-09-30T00:00:00Z",
    updatedAt: "2026-09-30T00:00:00Z",
    multipleChoiceConfig: {
      options: (["A", "B", "C", "D"] as const).map((id, i) => ({ id, text: options[i] })),
      correctOptionId: IMO2425_SETB_KEY[n - 1],
      layout: "list",
    },
    customConfig: { paper: "SOF IMO 2024-25 Class 6 Set B", examId: IMO_CLASS6_SETB_2024_EXAM.id, questionNumber: n, ...customConfig },
  } as Question;
}

const F = (n: string) => ({ src: `/papers/imo8/${n}.png` });
const figOpts = (n: string, ids = ["A", "B", "C", "D"]) => Object.fromEntries(ids.map((k) => [k, F(`${n}${k}`)]));
const dial = (hint: string, extra: Record<string, unknown> = {}) => ({ lab: { mode: "dial", hints: [hint], ...extra } });
const tile = (template: string, hint: string, extra: Record<string, unknown> = {}) => ({ lab: { mode: "tile", template, hints: [hint], ...extra } });
const fig = (n: string, slot: string, hint: string, stem = true) => ({ lab: { mode: "figure", ...(stem ? { fig: F(n) } : {}), opts: figOpts(n), slot, hints: [hint] } });
const truth = (statements: string[], map: Record<string, string>, hint: string) => ({ lab: { mode: "truth", statements, map, hints: [hint] } });

export const IMO2425_SETB_QUESTIONS: Question[] = [
  // ── Logical Reasoning ──
  q(1, "Dice", "Two different positions of a dice are shown here. Which number will be at the top, if 6 is at the bottom?", ["3", "2", "4", "5"], dial("Faces seen next to each other can't be opposite; find the face opposite 6.", { fig: F("q01") })),
  q(2, "Letter Matrix", "Find the missing letter, if a certain rule is followed either row-wise or column-wise.", ["O", "Q", "S", "M"], tile("The missing letter is ___.", "Count the alphabet steps along each row.", { fig: F("q02") })),
  q(3, "Venn Diagrams", "In the given Venn diagram, square represents soldiers, circle represents females and triangle represents married people. Which of the following numbers represents unmarried female soldiers?", ["5", "7", "4", "9"], dial("Find the region inside the square and the circle but outside the triangle.", { fig: F("q03") })),
  q(4, "Direction Sense", "Rajesh walked 70 m towards North and then took a left turn and walked another 70 m, then he turned to his left again and walked 30 m. Finally, he turned right and walked 25 m. In which direction is he now with respect to his starting point?", ["North-West", "South-East", "South", "North-East"], tile("Rajesh is now to the ___ of his starting point.", "Draw the walk: North, then West, then South, then West.")),
  q(5, "Logical Sequence", "Arrange the given words in a logical sequence and select the CORRECT option.\n1. Hundreds  2. Ones  3. Tens  4. Thousands  5. Lakhs", ["2, 3, 1, 5, 4", "3, 1, 2, 4, 5", "2, 3, 1, 4, 5", "3, 2, 1, 4, 5"], { lab: { mode: "order", items: ["1", "2", "3", "4", "5"], labels: { "1": "Hundreds", "2": "Ones", "3": "Tens", "4": "Thousands", "5": "Lakhs" }, ask: "Tap the place values from the smallest to the largest", hints: ["Start with the place on the far right of a number."] } }),
  q(6, "Water Images", "Select the CORRECT water image of the given word.", ["Image A", "Image B", "Image C", "Image D"], fig("q06", "Water image", "A water image flips top and bottom; left and right stay.")),
  q(7, "Paper Folding", "A transparent square sheet with a pattern and a dotted line on it is given. Select a figure from the options as to how the pattern would appear when the transparent sheet is folded along the dotted line.", ["Figure A", "Figure B", "Figure C", "Figure D"], fig("q07", "Folded sheet", "The left half folds over onto the right half and both patterns show.")),
  q(8, "Coded Relations", "If 'Apple' is called 'Grass', 'Grass' is called 'Water', 'Water' is called 'Coal', and 'Coal' is called 'Leaf', then ______ is colourless.", ["Water", "Coal", "Grass", "Apple"], tile("___ is colourless.", "Water is colourless — what is water called here?")),
  q(9, "Blood Relations", "W is the sister of X. X is the father of V and husband of T. V is the brother of Z. How is V related to W?", ["Nephew", "Son", "Uncle", "Son-in-law"], tile("V is W's ___.", "V is the son of W's brother.")),
  q(10, "Dot Situation", "Select a figure from the options which does NOT satisfy the same conditions of placement of dots as in the given figure.", ["Figure A", "Figure B", "Figure C", "Figure D"], fig("q10", "Does NOT satisfy", "Note the regions each dot sits in; find the option that lacks one of them.")),
  q(11, "Figure Analogy", "There is a certain relationship between figures (i) and (ii). Establish the similar relationship between figures (iii) and (iv) by selecting a suitable figure from the options that will replace the (?) in figure (iv).", ["Figure A", "Figure B", "Figure C", "Figure D"], fig("q11", "Figure (iv)", "Track where each shape moves and which ones change colour.")),
  q(12, "Mathematical Operations", "If '×' is called '−', '−' is called '+', '+' is called '÷' and '÷' is called '×', then find the value of 510 + 17 × 15 ÷ 2.", ["60", "0", "30", "12"], dial("Swap every sign for the operation it stands for, then use BODMAS.", { keys: "-" })),
  q(13, "Calendar", "Ankit works part time from his home on all the dates which are multiples of 5 and on the rest of the dates, he goes to office in February 20XX. How many days does he go to office in that month, if every Sunday is a holiday?", ["21", "20", "23", "19"], dial("Take away the Sundays and the multiples of 5 from the month's days.", { fig: F("q13") })),
  q(14, "Pattern Completion", "Which of the following figures will complete the pattern in the given figure?", ["Figure A", "Figure B", "Figure C", "Figure D"], fig("q14", "The ? quarter", "The pattern is symmetrical about both diagonals.")),
  q(15, "Classification", "Group the given figures into three classes on the basis of their identical properties using each figure only once.", ["1, 7, 8; 2, 3, 5; 4, 6, 9", "1, 7, 9; 2, 3, 5; 4, 6, 8", "1, 7, 9; 2, 3, 6; 4, 5, 8", "1, 2, 3; 4, 5, 6; 7, 8, 9"], tile("The three classes: ___", "Sort by the kind of edges: all curved, all straight, or a mix.", { fig: F("q15") })),
  // ── Mathematical Reasoning ──
  q(16, "Fractions", "How many shapes of the given figure must be shaded so that 3/7 of the figure is unshaded?", ["12", "14", "16", "18"], { lab: { mode: "count", what: "shape you would shade", fig: F("q16"), hints: ["Count all the shapes; 4/7 of them must be shaded."] } }),
  q(17, "Factor Trees", "Find the value of x/y.", ["2", "6", "4", "3"], dial("Work up the factor tree: each circle is the product of the two below it.", { fig: F("q17") })),
  q(18, "Estimation", "Find the estimated difference of 789562 and 435821 when each number is rounded off to the nearest thousands place.", ["360000", "354000", "352000", "362000"], dial("Round each number to the nearest thousand first.")),
  q(19, "Integers", "In which of the following options, the sum of given integers is less than zero?", ["171, −23, −120", "−815, 750, −230", "−413, −315, 880", "Both B and C"], truth(["The sum of 171, −23, −120 is less than zero.", "The sum of −815, 750, −230 is less than zero.", "The sum of −413, −315, 880 is less than zero."], { TFF: "A", FTF: "B", FFT: "C", FTT: "D" }, "Add each set yourself.")),
  q(20, "Symmetry", "Which of the following figures have more than two lines of symmetry?", ["Only P and Q", "Only S", "All P, Q, R, S", "Only Q and R"], tile("More than two lines of symmetry: ___", "Count the fold lines of each figure.", { fig: F("q20") })),
  q(21, "Line Segments", "How many line segments are there in the given figure?", ["6", "7", "5", "8"], { lab: { mode: "count", what: "line segment", fig: F("q21"), hints: ["A segment runs between two marked points; longer segments count too."] } }),
  q(22, "Data Handling", "The given table shows the number of people who visited the library during a week. How many more people visited the library on Monday, Wednesday and Thursday altogether than on Saturday and Sunday together?", ["40", "39", "28", "43"], dial("Each bundle of tally marks is 5.", { fig: F("q22") })),
  q(23, "Data Handling", "The given table shows the number of people who visited the library during a week. Find the fraction of number of people who visited on Tuesday to the total number of people who visited in the whole week.", ["3/61", "6/61", "3/22", "None of these"], dial("Tuesday's count over the week's total, in lowest terms.", { fig: F("q22") })),
  q(24, "Area", "Find the area of the given figure (not drawn to scale).", ["36 sq. cm", "37 sq. cm", "28 sq. cm", "63 sq. cm"], dial("Split the shape into rectangles along its steps.", { fig: F("q24"), unit: "sq. cm" })),
  q(25, "Angles & Clocks", "In which of the following options, the smallest angle formed by the hands of a clock is an obtuse angle?", ["Clock A", "Clock B", "Clock C", "All of these"], { lab: { mode: "figure", opts: figOpts("q25", ["A", "B", "C"]), slot: "Obtuse smallest angle", hints: ["An obtuse angle is between 90° and 180°; each hour mark is 30°."] } }),
  q(26, "Number Names", "If X is the greatest 6-digit number that can be formed by using the digits 3, 5, 0, 2 and 9 (using each digit at least once), then which of the following options shows the number name of X in International system of numeration?", ["Nine lakh ninety five thousand three hundred twenty", "Nine hundred ninety five thousand three hundred twenty", "Nine lakh fifty five thousand three hundred two", "Nine hundred ninety thousand five hundred thirty two"], tile("X in words: ___", "Repeat the largest digit to make six digits; the International system uses thousands and millions.")),
  q(27, "Lines", "How many more pairs of intersecting lines than parallel lines are there in the given figure?", ["7", "6", "5", "8"], dial("Count pairs of parallel lines and pairs of intersecting lines separately.", { fig: F("q27") })),
  q(28, "Fractions", "Which of the following is true for the shaded fractions of models shown below?\nP : Shaded fraction of model-1\nQ : Shaded fraction of model-2", ["P = Q", "P < Q", "P > Q", "None of these"], { lab: { mode: "compare", fig: F("q28"), left: "P (shaded fraction of Model-1)", right: "Q (shaded fraction of Model-2)", map: { "=": "A", "<": "B", ">": "C" }, check: ["8/12", "3/6"], hints: ["Write each shaded part as a fraction of its model."] } }),
  q(29, "Perimeter & Area", "A wire of length 180 m is bent in the form of a rectangle. If the breadth of rectangle is half the length of rectangle, then find the area of rectangle.", ["2700 sq. m", "1800 sq. m", "2150 sq. m", "None of these"], dial("Length + breadth is half the wire; breadth is half the length.", { unit: "sq. m" })),
  q(30, "Decimals", "Compare the following and fill the box using <, > or =.\n95.23 + 220.80 − 11.05 ☐ 350.91 + 18.31 − 57.73", [">", "=", "<", "Can't be determined"], { lab: { mode: "compare", left: "95.23 + 220.80 − 11.05", right: "350.91 + 18.31 − 57.73", map: { ">": "A", "=": "B", "<": "C" }, hints: ["Line up the decimal points."] } }),
  q(31, "Integers", "Which of the following options shows the integers arranged in descending order?", ["−31, −25, −10, 12, 18", "−20, −39, −41, 0, 11", "49, 38, 20, −10, −25", "78, 57, −20, −11, −5"], tile("In descending order: ___", "Descending means from the largest down to the smallest.")),
  q(32, "Factors", "What is the product of all the common factors of 32 and 48?", ["64", "384", "1536", "1024"], dial("List the common factors, then multiply them.")),
  q(33, "Roman Numerals", "Which of the following gives the LEAST value?", ["MMMCMLIX − MMDCCXVII", "MMCDLXV + MCCXLIV", "DCCCXCIX + CDXLVII", "MMDCCIX − MMCDIII"], { lab: { mode: "max", pick: "smallest", hints: ["Convert each numeral, then work out each expression."] } }),
  q(34, "Measurement", "Select the CORRECT option.", ["5 kg 500 g + 1500 g = 7 kg 500 g", "9 kL 300 L = 930000 dL", "550 m more than 5 hm = 10 hm 50 m", "None of these"], truth(["5 kg 500 g + 1500 g = 7 kg 500 g", "9 kL 300 L = 930000 dL", "550 m more than 5 hm = 10 hm 50 m"], { TFF: "A", FTF: "B", FFT: "C", FFF: "D" }, "Convert everything to one unit before comparing.")),
  q(35, "Divisibility", "Which of the following numbers is divisible by 4?", ["420632", "315272", "555124", "All of these"], truth(["420632 is divisible by 4.", "315272 is divisible by 4.", "555124 is divisible by 4."], { TFF: "A", FTF: "B", FFT: "C", TTT: "D" }, "A number is divisible by 4 when its last two digits are.")),
  // ── Everyday Mathematics ──
  q(36, "Fractions", "Karan spent half of his pocket money to buy a pair of shoes. He spent half of the remaining on a book. He also spent half of the remaining to buy a study table. He was left with ₹ 350. With how much money he began his shopping?", ["₹ 4000", "₹ 3000", "₹ 2800", "₹ 1080"], dial("Work backwards: double ₹ 350 three times.", { unit: "₹" })),
  q(37, "Large Numbers", "Five caps are placed on a table and having digits 1, 4, 0, 6 and 8 written on them. If Rekha formed the greatest and the smallest 6-digit numbers using the above digits (using each digit at least once), then find the sum of numbers formed.", ["875680", "986878", "928170", "756868"], dial("Repeat the largest digit for the greatest; for the smallest, 0 can't come first.")),
  q(38, "Perimeter", "Rashi walked five times around a rectangular field of length 52 m and breadth 30 m. Kirti walked seven times around a square field of side 65 m. Who walked more distance and by how much?", ["Kirti, 1000 m", "Rashi, 1000 m", "Kirti, 1260 m", "Rashi, 1260 m"], tile("___ more.", "Find each perimeter, then multiply by the number of rounds.")),
  q(39, "Integers", "On a particular day in December, the minimum temperature in Manali was −8°C, whereas the minimum temperature in Jaipur was 23°C. What was the difference between the two temperatures?", ["30°C", "31°C", "29°C", "8°C"], dial("Difference = 23 − (−8).", { unit: "°C" })),
  q(40, "Division", "A company manufactured 125360 black pens and 93515 blue pens. All the pens were packed in boxes. If each box contains 425 pens, then find the total number of boxes packed in all.", ["525", "490", "570", "515"], dial("Add the pens, then divide by 425.")),
  q(41, "Time", "Puneet went to Gym at 18 : 25 hours. He completed his exercise at 19:52 hours. For how much time did he exercise?", ["1 hour 33 minutes", "1 hour 27 minutes", "72 minutes", "Both B and C"], tile("He exercised for ___.", "Count on from 18:25 to 19:25, then to 19:52.")),
  q(42, "Decimals", "The weight of Sneha is 35.28 kg. Sakshi is 4.15 kg heavier than Sneha. If Monika is 1.05 kg heavier than Sakshi, then find the total weight of all of them.", ["111.25 kg", "97.05 kg", "113.09 kg", "None of these"], dial("Find Sakshi's and Monika's weights, then add all three.", { unit: "kg" })),
  q(43, "Area", "Find the number of envelopes that can be made out of a sheet of paper 384 cm by 168 cm, if each envelope requires a piece of paper of size 16 cm by 12 cm.", ["340", "344", "336", "342"], dial("How many 16 cm fit along 384 cm, and 12 cm along 168 cm?")),
  q(44, "Roman Numerals", "Amit bought MCDLXX apples, CMXLVIII oranges and MCCCXCIX watermelons from a wholesaler. How many total fruits did he buy?", ["3817", "3750", "3250", "2913"], dial("Convert each numeral, then add.")),
  q(45, "LCM", "Three girls steps off together from the point X. Their steps measures 50 cm, 75 cm and 90 cm respectively. What is the minimum distance each should cover so that all can cover the distance in complete steps?", ["150 cm", "800 cm", "450 cm", "None of these"], dial("The distance must be a multiple of all three step lengths.", { unit: "cm" })),
  // ── Achievers Section ──
  q(46, "Integers", "Match the following and select the CORRECT option.\nColumn-I: P. Successor of (170 + (−20) + 219 + (−38)) is; Q. Predecessor of ((−911) + (175) + (−200)) is; R. Successor of (480 + (−419) + (−729) + 330)) is; S. Additive inverse of (152 + 283 + (−333)) is\nColumn-II: (i) −937, (ii) −102, (iii) 332, (iv) −337", ["P-(ii); Q-(i); R-(iv); S-(iii)", "P-(iii); Q-(iv); R-(i); S-(ii)", "P-(iii); Q-(i); R-(iv); S-(ii)", "P-(iv); Q-(ii); R-(iii); S-(i)"], { lab: { mode: "match", left: ["Successor of (170 + (−20) + 219 + (−38))", "Predecessor of ((−911) + (175) + (−200))", "Successor of (480 + (−419) + (−729) + 330)", "Additive inverse of (152 + 283 + (−333))"], right: [{ key: "i", text: "−937" }, { key: "ii", text: "−102" }, { key: "iii", text: "332" }, { key: "iv", text: "−337" }], map: { "ii,i,iv,iii": "A", "iii,iv,i,ii": "B", "iii,i,iv,ii": "C", "iv,ii,iii,i": "D" }, hints: ["Successor adds 1; predecessor takes 1 away."] } }),
  q(47, "Angles & Lines", "Observe the given figures carefully and fill in the blanks.\n(i) There are ______ angles above the line PQ in Fig. (p).\n(ii) There are ______ more acute angles than obtuse angles in Fig. (p).\n(iii) There is/are ______ pair(s) of perpendicular lines in Fig. (q).", ["(i) 15; (ii) 4; (iii) 0", "(i) 14; (ii) 4; (iii) 0", "(i) 15; (ii) 0; (iii) 2", "(i) 14; (ii) 5; (iii) 2"], { lab: { mode: "multi", fig: F("q47"), parts: [{ label: "angles above the line PQ" }, { label: "more acute than obtuse angles" }, { label: "pairs of perpendicular lines in Fig. (q)" }], hints: ["With 6 rays from O, count every pair of rays."] } }),
  q(48, "Fractions", "Read the given statements carefully and select the CORRECT option.\nStatement-I: In the word CREATIVE, the sum of fraction of vowels and the fraction of alphabets made up of only straight lines is 4/8.\nStatement-II: If 7/9 = p/729 = q/135, then the values of p, q and p + q are 81, 105 and 186 respectively.", ["Both Statement-I and Statement-II are true.", "Both Statement-I and Statement-II are false.", "Statement-I is true but Statement-II is false.", "Statement-I is false but Statement-II is true."], truth(["In the word CREATIVE, the sum of fraction of vowels and the fraction of alphabets made up of only straight lines is 4/8.", "If 7/9 = p/729 = q/135, then the values of p, q and p + q are 81, 105 and 186 respectively."], { TT: "A", FF: "B", TF: "C", FT: "D" }, "For Statement-II, work out p = 729 × 7/9 yourself.")),
  q(49, "Divisibility & Primes", "Read the given statements carefully and state T for true and F for false.\n(i) The number 705830 is divisible by both 2 and 5.\n(ii) The number of common prime factors of 150 and 275 is 5.\n(iii) If the number 2579x is divisible by 8 (where x is a single digit), then the value of x can be 2.\n(iv) If a number is prime, then it is always odd.", ["(i) T; (ii) T; (iii) F; (iv) F", "(i) F; (ii) F; (iii) T; (iv) F", "(i) F; (ii) T; (iii) F; (iv) T", "(i) T; (ii) F; (iii) T; (iv) F"], truth(["The number 705830 is divisible by both 2 and 5.", "The number of common prime factors of 150 and 275 is 5.", "If the number 2579x is divisible by 8 (where x is a single digit), then the value of x can be 2.", "If a number is prime, then it is always odd."], { TTFF: "A", FFTF: "B", FTFT: "C", TFTF: "D" }, "Check each claim yourself; think about 2 for (iv).")),
  q(50, "Perimeter & Area", "Solve the following and select the CORRECT option.\n(p) The figure given below (not drawn to scale) is made up of two rectangles P and Q & two identical squares R and S. Find the perimeter of the figure.\n(q) Find the area of unshaded part in the given figure.", ["(p) 66 cm; (q) 162 cm²", "(p) 61 cm; (q) 196 cm²", "(p) 66 cm; (q) 216 cm²", "(p) 61 cm; (q) 162 cm²"], { lab: { mode: "multi", figs: [F("q50p"), F("q50q")], parts: [{ label: "perimeter of the figure", unit: "cm" }, { label: "area of the unshaded part", unit: "cm²" }], hints: ["For (p), Q is 17 cm tall and the squares are 5 cm."] }, answerAudit: { sourceAnswer: "A", semanticValidation: "REVIEW_REQUIRED", reason: "The official key lists answers only up to Q49. A is worked out here: the perimeter in (p) is 66 cm, which only options A and C give, and (q) 162 cm² selects A." } }),
];

const ids = (a: number, b: number) => IMO2425_SETB_QUESTIONS.slice(a, b).map((x) => x.id);

/** The 2024-25 Set B exam, now holding its own paper instead of the 2022-23 questions. */
export const IMO2425_SETB_EXAM: Exam = {
  ...IMO_CLASS6_SETB_2024_EXAM,
  updatedAt: "2026-09-30T00:00:00Z",
  sections: [
    { id: "sec_logical", title: "Logical Reasoning", description: "15 Questions (1 Mark each)", questionIds: ids(0, 15) },
    { id: "sec_math", title: "Mathematical Reasoning", description: "20 Questions (1 Mark each)", questionIds: ids(15, 35) },
    { id: "sec_everyday", title: "Everyday Mathematics", description: "10 Questions (1 Mark each)", questionIds: ids(35, 45) },
    { id: "sec_achievers", title: "Achievers Section", description: "5 Questions (3 Marks each)", questionIds: ids(45, 50) },
  ],
  questionIds: IMO2425_SETB_QUESTIONS.map((x) => x.id),
};
