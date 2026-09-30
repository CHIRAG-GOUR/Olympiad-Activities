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

const F = (n: string) => ({ src: `/papers/imo6/${n}.png` });
const figOpts = (n: string) => ({ A: F(`${n}A`), B: F(`${n}B`), C: F(`${n}C`), D: F(`${n}D`) });
const dial = (hint: string, extra: Record<string, unknown> = {}) => ({ lab: { mode: "dial", hints: [hint], ...extra } });

// Transcribed from the scan of Question Paper VI Imo - 6; figures are cropped from the same scan.
export const IMO23_24_C_QUESTIONS: Question[] = [
  // ── Logical Reasoning ──
  q(1, "Direction Sense", "Riya starts walking from her college towards North. After walking for 10 m, she turns right and walks 25 m. She then turns right again and walks 50 m. Finally, she turns right and walks for 25 m to reach her home. How far is Riya now from her college?", ["30 m", "40 m", "25 m", "50 m"], dial("Sketch the walk: the two 25 m legs cancel out; compare the two north–south legs.", { unit: "m" })),
  q(2, "Counting Cubes", "Count the number of cubes in the given figure.", ["20", "21", "22", "18"], { lab: { mode: "count", what: "cube", fig: F("q02"), hints: ["Count layer by layer, and remember the cubes hidden under the ones you can see."] } }),
  q(3, "Coding-Decoding", "In a certain code language, 'EXAMS' is written as '67249' and 'SHARED' is written as '912563'. How will 'ASHRAM' be written in that code language?", ["291524", "791624", "295142", "921523"], dial("Letters shared by the two words tell you which digit stands for which letter.")),
  q(4, "Pattern Completion", "Which of the following figures will complete the pattern in the given figure?", ["Figure A", "Figure B", "Figure C", "Figure D"], { lab: { mode: "figure", fig: F("q04"), opts: figOpts("q04"), slot: "The ? corner", hints: ["The missing quarter must continue the lines and shading of its neighbours."] } }),
  q(5, "Venn Diagrams", "Which of the following Venn diagrams best represents the relationship amongst, \"Moon, Earth and India\"?", ["Diagram A", "Diagram B", "Diagram C", "Diagram D"], { lab: { mode: "figure", opts: figOpts("q05"), slot: "Moon, Earth and India", hints: ["India is part of the Earth; the Moon is separate from both."] } }),
  q(6, "Dot Situation", "Select a figure from the options which satisfies the same conditions of placement of dots as in the given figure.", ["Figure A", "Figure B", "Figure C", "Figure D"], { lab: { mode: "figure", fig: F("q06"), opts: figOpts("q06"), slot: "Same dot conditions", hints: ["For each dot, note which shapes it lies inside; the option must allow the same regions."] } }),
  q(7, "Ranking", "In a class of 28 students, Gautam is 15th from the bottom. What will be his rank from the top?", ["14th", "15th", "13th", "16th"], dial("Rank from top = total − rank from bottom + 1.", { unit: "th" })),
  q(8, "Counting Lines", "Find the minimum number of straight lines required to draw the given figure.", ["8", "9", "10", "11"], dial("Count each straight stroke once, even where it passes through several shapes.", { fig: F("q08") })),
  q(9, "Paper Folding & Cutting", "A set of three figures P, Q and R showing a sequence of folding of a piece of paper is given. Fig. R shows the manner in which the folded paper has been cut. Select a figure from the options which shows the unfolded form of Fig. R.", ["Figure A", "Figure B", "Figure C", "Figure D"], { lab: { mode: "figure", fig: F("q09"), opts: figOpts("q09"), slot: "Unfolded paper", hints: ["The paper was folded twice, so each cut appears four times, mirrored across the fold lines."] } }),
  q(10, "Mathematical Operations", "If 'A' denotes '÷', 'B' denotes '+', 'C' denotes '−' and 'D' denotes '×', then the value of 17 B 33 A 11 C 5 D 2 =", ["30", "0", "21", "10"], dial("Replace the letters, then use the order of operations (÷ and × before + and −).", { keys: "-" })),
  q(11, "Figure Matrix", "Select a figure from the options which will complete the given figure matrix.", ["Figure A", "Figure B", "Figure C", "Figure D"], { lab: { mode: "figure", fig: F("q11"), opts: figOpts("q11"), slot: "The ? cell", hints: ["Each row keeps its shape; each column keeps its pattern of small dots."] } }),
  q(12, "Blood Relations", "Pointing towards Sara, Vijay said, \"She is the daughter of my father's father.\" How is Sara related to Vijay?", ["Aunt", "Mother", "Sister", "Granddaughter"], { lab: { mode: "tile", template: "Sara is Vijay's ___.", hints: ["My father's father is my grandfather; his daughter is my father's sister."] } }),
  q(13, "Mirror Images", "Select the correct mirror image of the given combination of letters and symbols, if the mirror is placed vertically to the left.", ["Image A", "Image B", "Image C", "Image D"], { lab: { mode: "figure", fig: F("q13"), opts: figOpts("q13"), slot: "Mirror image", hints: ["A vertical mirror reverses left and right; check every symbol, including @ and ?."] } }),
  q(14, "Series Completion", "Select a figure from the options which will continue the same series as established by the Problem Figures.", ["Figure A", "Figure B", "Figure C", "Figure D"], { lab: { mode: "figure", fig: F("q14"), opts: figOpts("q14"), slot: "Next figure", hints: ["Track each corner symbol separately from one figure to the next."] } }),
  q(15, "Analogy", "There is a certain relationship between the pair of figures on the either side of ::. Identify the relationship of the left pair and find the missing figure.", ["Figure A", "Figure B", "Figure C", "Figure D"], { lab: { mode: "figure", fig: F("q15"), opts: figOpts("q15"), slot: "The ? figure", hints: ["Work out what happens to the big and small shapes in the left pair, then do the same to the right pair."] } }),
  // ── Mathematical Reasoning ──
  q(16, "Intersecting Lines", "How many pairs of intersecting lines are there in the given figure?", ["4", "3", "5", "6"], { lab: { mode: "count", what: "crossing point", fig: F("q16"), hints: ["Parallel lines never meet; mark every point where two lines cross."] } }),
  q(17, "Integers", "Which of the following gives the maximum value?", ["−5 + 7 − 17 + 0", "25 − 31 + 15 − 6", "−18 − 37 + 45 + 5", "50 − 45 − 40 + 15"], { lab: { mode: "max", hints: ["Work each expression left to right."] } }),
  q(18, "Angles", "How many obtuse angles are formed in the given figure?", ["5", "4", "3", "2"], { lab: { mode: "count", what: "obtuse angle", fig: F("q18"), hints: ["An obtuse angle is between 90° and 180°; combine neighbouring angles too."] } }),
  q(19, "Symmetry", "How many of the following numbers have at least one line of symmetry?", ["1", "2", "3", "4"], { lab: { mode: "count", what: "digit with a line of symmetry", fig: F("q19"), hints: ["Try folding each digit vertically and horizontally."] } }),
  q(20, "Area", "Find the area of the given figure (not drawn to scale).", ["25.5 sq. cm", "23.5 sq. cm", "25 sq. cm", "24 sq. cm"], dial("Split the figure into rectangles and add their areas.", { fig: F("q20"), unit: "sq. cm" })),
  q(21, "Fractions", "Which of the following options are arranged in ascending order?", ["1/2, 7/18, 5/9, 7/27", "5/9, 1/2, 7/18, 7/27", "7/27, 7/18, 1/2, 5/9", "7/27, 5/9, 7/18, 1/2"], { lab: { mode: "order", items: ["1/2", "7/18", "5/9", "7/27"], ask: "Tap the fractions from smallest to largest", hints: ["Write all four over a common denominator, such as 54."] } }),
  q(22, "LCM", "Find the smallest number which when diminished by 3 is exactly divisible by 21, 28, 36 and 45.", ["1263", "1560", "1143", "1290"], dial("Find the LCM of the four numbers first.")),
  q(23, "Roman Numerals", "Compare and fill in the box.\nCCCLXXVI + CDXIV ☐ DCXIX + CCLXVIII", [">", "=", "<", "Can't be determined"], { lab: { mode: "compare", left: "CCCLXXVI + CDXIV", right: "DCXIX + CCLXVIII", map: { ">": "A", "=": "B", "<": "C" }, hints: ["Convert every numeral to ordinary numbers before adding."] } }),
  q(24, "Data Handling", "The given line graph shows the number of shirts bought by six friends in a particular year. If Alok's father gives him 12 more shirts, then how many more shirts does he have now than the number of shirts Virat bought?", ["22", "32", "27", "35"], dial("Read Alok's and Virat's points from the graph.", { fig: F("q24") })),
  q(25, "Ratio", "The given line graph shows the number of shirts bought by six friends in a particular year. Find the ratio of number of shirts bought by Tarun to the number of shirts bought by Vinit and Ronak together.", ["17:12", "13:25", "12:13", "12:17"], dial("Read the three values, add Vinit's and Ronak's, then simplify the ratio.", { fig: F("q24"), keys: ":" })),
  q(26, "Algebra", "Equation for the statement: 'Twice the product of m and n is equal to thrice of their difference' is ______.", ["3mn = 2(m − n)", "mn = 2(m − n)", "2mn = m − n", "2mn = 3(m − n)"], { lab: { mode: "build", tokens: ["2", "3", "mn", "=", "(m − n)", "m − n"], hints: ["Twice = 2 ×, thrice = 3 ×; the product of m and n is mn."] } }),
  q(27, "Angles & Revolution", "Which of the following hands of the clocks shows 1/4 of a revolution?", ["Clock A", "Clock B", "Clock C", "Clock D"], { lab: { mode: "figure", opts: figOpts("q27"), slot: "¼ of a revolution", hints: ["A quarter turn is 90° — a right angle between the hands."] } }),
  q(28, "Decimals", "Which of the following options equals to (0.5/0.05 + 0.05/0.5)?", ["0.5", "10.1", "1.1", "5.5"], dial("Divide each pair first, then add.")),
  q(29, "Divisibility", "If the number 455?656 is completely divisible by 3, then the smallest whole number in place of ? will be ______.", ["8", "0", "1", "2"], dial("A number is divisible by 3 when the sum of its digits is.")),
  q(30, "Perimeter", "Find the perimeter of the shaded part of the given figure.", ["84 cm", "92 cm", "96 cm", "None of these"], dial("Each small square has side 4 cm; count the edges round the shaded region.", { fig: F("q30"), unit: "cm" })),
  q(31, "Algebra", "If a = 35, b = 11 and c = 23, then find a × (c − b).", ["375", "495", "235", "420"], dial("Work out the bracket first.")),
  q(32, "Number System", "Read the given statements carefully and select the correct option.\nI. Predecessor of largest 7-digit even number is even.\nII. In International system of numeration, 54137083 is written as fifty four million one hundred thirty seven thousand and eighty three.", ["Only I is true", "Only II is true", "Both I and II are true", "Neither I nor II is true"], { lab: { mode: "truth", statements: ["Predecessor of largest 7-digit even number is even.", "In International system of numeration, 54137083 is written as fifty four million one hundred thirty seven thousand and eighty three."], map: { TF: "A", FT: "B", TT: "C", FF: "D" }, hints: ["Write the largest 7-digit even number and subtract 1."] } }),
  q(33, "Curves", "How many of the following curves are open?", ["3", "4", "2", "5"], { lab: { mode: "count", what: "open curve", fig: F("q33"), hints: ["An open curve has two loose ends."] } }),
  q(34, "Money & Time", "A car was parked in a parking lot from 5:00 p.m. to 9:45 p.m. How much does it cost for parking? (Parking rates: first hour ₹ 18.50; every additional half an hour or part thereof ₹ 5)", ["₹ 74", "₹ 33.50", "₹ 35", "₹ 58.50"], dial("After the first hour, count the half-hours, rounding any part up.", { fig: F("q34"), unit: "₹" })),
  q(35, "Place Value", "Find the sum of (place value of 9) and (the difference between the place value of 3 and face value of 5) in 4325907.", ["300895", "11", "30895", "3800895"], dial("Place value depends on position; face value is just the digit.")),
  // ── Everyday Mathematics ──
  q(36, "Algebraic Expressions", "An apple costs ₹ x and a mango costs ₹ 5 more than the cost of an apple. Find the total cost (in ₹) of 5 apples and 4 mangoes.", ["5x + 20", "5x + 10", "9x + 20", "None of these"], { lab: { mode: "build", tokens: ["5x", "9x", "+", "10", "20"], hints: ["A mango costs x + 5; add 5 apples and 4 mangoes and collect like terms."] } }),
  q(37, "Multiplication", "Priyanka needs to type 1950 pages. If the number of words on each page is 315, then find the total number of words she will type in all.", ["614250", "585000", "635270", "595480"], dial("Multiply pages by words per page.")),
  q(38, "Integers", "Manya travelled 465 km towards South and Ananya travelled 644 km towards North from the same point. Find the distance between their final destination.", ["1109 km", "−1109 km", "1080 km", "179 km"], dial("They go in opposite directions from the same point.", { unit: "km" })),
  q(39, "Ratio", "There were 64 boys and some girls at a party. After one hour, 24 boys left and 30 more girls joined the party. After this, the ratio of the number of boys to the number of girls at the party became 2 : 5. How many girls were there at first?", ["65", "60", "70", "130"], dial("Find the boys after the hour, use the ratio to get the girls then, and undo the 30 who joined.")),
  q(40, "Fractions", "Mrs. Sinha is a piano teacher. She taught a total of 24 hours in the month of September. Each class lasted 3/4 hour. How many classes did she teach in the month of September?", ["42", "40", "28", "32"], dial("Divide the total hours by the length of one class.")),
  q(41, "HCF", "Three tankers contain 4200 L, 5040 L and 6750 L of water. What is the maximum capacity that can measure all the different quantities exactly?", ["42 L", "50 L", "60 L", "30 L"], dial("The largest measure dividing all three is their HCF.", { unit: "L" })),
  q(42, "Fractions", "In a day of 24 hours, if Garima spends 8 hours in office, 4 hours in travelling, 5 hours in playing with her son and rest time in sleeping, then what fraction of a day she spends in sleeping?", ["26/7", "7/26", "7/24", "24/7"], dial("Find the sleeping hours, then write them out of 24.")),
  q(43, "Money", "Sonali buys 25 pencils and 25 pens for distributing to her friends on her birthday. If the cost of a pencil is ₹ 8 and that of a pen is ₹ 15, then how much total amount does she spend?", ["₹ 575", "₹ 615", "₹ 425", "₹ 585"], dial("One pencil and one pen together cost how much? There are 25 of each.", { unit: "₹" })),
  q(44, "Decimals", "Mayank travelled 352.15 km in three days. If he travelled 115.28 km on first day and 79.50 km on second day, then how much distance did he travel on the third day?", ["98.51 km", "157.37 km", "85.40 km", "None of these"], dial("Subtract both days from the total.", { unit: "km" })),
  q(45, "Area", "The total cost of flooring a room is ₹ 2160. The rate of flooring is ₹ 45 per square metre. If the room is 8 metres long, then find its breadth.", ["11 m", "7 m", "12 m", "6 m"], dial("Cost ÷ rate gives the area; area ÷ length gives the breadth.", { unit: "m" })),
  // ── Achievers Section ──
  q(46, "Integers", "Read the given statements carefully and select the correct option.\nStatement-I: The value of (30) + (−53) + (−63) + (−40) + (20) − (−21) − (21) − (−53) + (−30) − (−63) − (−40) − (20) is −15.\nStatement-II: On subtracting the greatest 5-digit number from the additive inverse of 1000, we get 100000.", ["Both Statement-I and Statement-II are true.", "Both Statement-I and Statement-II are false.", "Statement-I is true but Statement-II is false.", "Statement-I is false but Statement-II is true."], { lab: { mode: "truth", statements: ["The value of (30) + (−53) + (−63) + (−40) + (20) − (−21) − (21) − (−53) + (−30) − (−63) − (−40) − (20) is −15.", "On subtracting the greatest 5-digit number from the additive inverse of 1000, we get 100000."], map: { TT: "A", FF: "B", TF: "C", FT: "D" }, hints: ["Many terms in Statement-I cancel in pairs.", "The additive inverse of 1000 is −1000."] } }),
  q(47, "Lines", "Study the given figure carefully and answer the following questions.\n(i) How many pairs of perpendicular lines are there in the given figure?\n(ii) How many pairs of intersecting lines are there in the given figure?\n(iii) How many concurrent lines are there in the given figure?", ["(i) 2; (ii) 6; (iii) 2", "(i) 3; (ii) 7; (iii) 0", "(i) 4; (ii) 5; (iii) 1", "(i) 3; (ii) 3; (iii) 2"], { lab: { mode: "multi", fig: F("q47"), parts: [{ label: "pairs of perpendicular lines" }, { label: "pairs of intersecting lines" }, { label: "concurrent lines" }], hints: ["p, q and r are parallel; check which lines meet m at right angles."] } }),
  q(48, "Ratio", "Out of 150 students, 45 likes to eat noodles, 30 likes to eat pizza, 25 likes to eat burger and rest of the students likes to eat pasta. Then, find and match the ratio.\nColumn-I: (i) Number of students who likes to eat pizza to that of pasta is; (ii) Number of students who likes to eat noodles to that of total number of students is; (iii) Number of students who likes to eat burger to that of noodles is.\nColumn-II: (p) 5:9, (q) 3:5, (r) 3:10", ["(i) → (q); (ii) → (r); (iii) → (p)", "(i) → (p); (ii) → (r); (iii) → (q)", "(i) → (p); (ii) → (q); (iii) → (r)", "(i) → (q); (ii) → (p); (iii) → (r)"], { lab: { mode: "match", left: ["Pizza to pasta", "Noodles to total students", "Burger to noodles"], right: [{ key: "p", text: "5 : 9" }, { key: "q", text: "3 : 5" }, { key: "r", text: "3 : 10" }], map: { "q,r,p": "A", "p,r,q": "B", "p,q,r": "C", "q,p,r": "D" }, hints: ["First find how many students like pasta; then simplify each ratio."] } }),
  q(49, "Mensuration", "Read the given statements carefully and state T for true and F for false.\n(i) The length and breadth of a rectangular floor are in the ratio 7 : 5. If the perimeter of the floor is 216 m, then its area is 2835 sq. m.\n(ii) A table top measures 4 m 25 cm by 3 m 10 cm. The cost of lacing the boundary of table top, if the cost of 1 m lace is ₹ 15, is ₹ 110.\n(iii) The perimeter of a regular pentagon of side 5 m is 20 m.", ["(i) F; (ii) T; (iii) F", "(i) F; (ii) F; (iii) T", "(i) T; (ii) F; (iii) F", "(i) T; (ii) F; (iii) T"], { lab: { mode: "truth", statements: ["The length and breadth of a rectangular floor are in the ratio 7 : 5. If the perimeter of the floor is 216 m, then its area is 2835 sq. m.", "A table top measures 4 m 25 cm by 3 m 10 cm. The cost of lacing the boundary of table top, if the cost of 1 m lace is ₹ 15, is ₹ 110.", "The perimeter of a regular pentagon of side 5 m is 20 m."], map: { FTF: "A", FFT: "B", TFF: "C", TFT: "D" }, hints: ["Half the perimeter is length + breadth."] } }),
  q(50, "Numbers", "Fill in the blanks and select the correct option.\n(i) The predecessor of largest 6-digit number is ______.\n(ii) Seventy million fifty thousand two hundred seventy nine is written as ______.\n(iii) The smallest 6-digit number that can be formed by using the digits 2, 3, 1 and 7 (using each digit at least once) is ______.", ["(i) 999998; (ii) 70,050,279; (iii) 111237", "(i) 999997; (ii) 70,050,279; (iii) 111237", "(i) 999999; (ii) 70,500,279; (iii) 111237", "(i) 999998; (ii) 7,050,279; (iii) 122237"], { lab: { mode: "multi", parts: [{ label: "predecessor of the largest 6-digit number" }, { label: "seventy million fifty thousand two hundred seventy nine" }, { label: "smallest 6-digit number using 2, 3, 1 and 7" }], hints: ["For (iii), use the smallest digit for every extra place."] } }),
];

const ids = (from: number, to: number) => IMO23_24_C_QUESTIONS.slice(from, to).map((x) => x.id);

export const IMO23_24_C_EXAM: Exam = {
  id: "imo-2023-24-class-6-set-c",
  code: "IMO-2023-24-G6-SET-C",
  title: "SOF International Mathematics Olympiad 2023–24",
  subtitle: "Class 6 • Set C • 50 Bespoke Interactive Olympiad Missions",
  description:
    "Official SOF IMO Class 6 Question Paper Set C (2023–24) featuring 50 bespoke, hands-on interactive activities across Logical Reasoning, Mathematical Reasoning, Everyday Mathematics, and the Achievers Section.",
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
      "The question paper comprises four sections: Logical Reasoning (15 questions), Mathematical Reasoning (20 questions), Everyday Mathematics (10 questions) and Achievers Section (5 questions).",
      "Each question in the Achievers Section carries 3 marks, whereas all other questions carry 1 mark each.",
      "All questions are compulsory. There is no negative marking.",
      "Every question is an interactive simulation/game. Work through the microworld to discover and derive your answer, then submit.",
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
