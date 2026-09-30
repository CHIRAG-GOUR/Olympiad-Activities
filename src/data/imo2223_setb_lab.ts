/**
 * Paper 5 (SOF IMO 2022-23 Class 6 Set B — Question Paper VI Imo - 5.pdf) on the maths lab.
 * For each question: the lab tool it is worked with, figures cropped from the scan, and — where
 * the stored text described a figure in words — the paper's own wording.
 */
const F = (n: string) => ({ src: `/papers/imo5/${n}.png` });
const figOpts = (n: string) => ({ A: F(`${n}A`), B: F(`${n}B`), C: F(`${n}C`), D: F(`${n}D`) });
const dial = (hint: string, extra: Record<string, unknown> = {}) => ({ mode: "dial", hints: [hint], ...extra });
const tile = (template: string, hint: string, extra: Record<string, unknown> = {}) => ({ mode: "tile", template, hints: [hint], ...extra });
const fig = (n: string, slot: string, hint: string, stem = true) => ({ mode: "figure", ...(stem ? { fig: F(n) } : {}), opts: figOpts(n), slot, hints: [hint] });
const FIGS = ["Figure A", "Figure B", "Figure C", "Figure D"];

export type Paper5Patch = { lab: Record<string, unknown>; questionText?: string; options?: string[] };

export const PAPER5_LAB: Record<number, Paper5Patch> = {
  1: { lab: tile("The lady is Ankit's ___.", "The only daughter of my mother is… me.") },
  2: { lab: fig("q02", "Same dot conditions", "Note which shapes each dot sits inside.") },
  3: { lab: fig("q03", "Judge, Police and Thief", "None of the three groups overlaps the others.", false), options: ["Diagram A", "Diagram B", "Diagram C", "Diagram D"] },
  4: { lab: tile("The next term is ___.", "Track the letters and the numbers separately.") },
  5: { lab: fig("q05", "Figure (iv)", "See how figure (i) changes into (ii) and do the same to (iii).") },
  6: { lab: { mode: "count", what: "triangle", fig: F("q06"), hints: ["Count small triangles, then those made of two or more parts."] } },
  7: { lab: fig("q07", "Unfolded paper", "Unfold one fold at a time, mirroring the cut.") },
  8: { lab: tile("There are ___ such symbols.", "Look at the neighbours on both sides of every symbol.") },
  9: { lab: tile("The three classes: ___", "Sort the figures by what is drawn inside them.", { fig: F("q09") }) },
  10: { lab: { mode: "order", items: ["1", "2", "3", "4", "5", "6"], labels: { "1": "L", "2": "J", "3": "N", "4": "U", "5": "G", "6": "E" }, ask: "Tap the letters in the order that spells the word", hints: ["It is an animal's home with many trees."] } },
  11: { lab: tile("SAFEST is coded as ___.", "CREDIT → CDEIRT: the letters are put in alphabetical order.") },
  12: { lab: fig("q12", "Mirror image", "The mirror is on the right: left and right swap."), questionText: "Find the correct mirror image of the given figure." },
  13: { lab: dial("Replace each sign by what it stands for, then use BODMAS.") },
  14: { lab: { mode: "count", what: "cube", fig: F("q14"), hints: ["Count row by row, including cubes hidden behind others."] } },
  15: { lab: fig("q15", "The ? cell", "Each row keeps its arrow direction; each column keeps its number of arrows.") },
  16: { lab: dial("Read Siachin's and Chennai's temperatures off the number line.", { fig: F("q16"), unit: "°C", keys: "-" }), questionText: "Given number line represents the average temperature (in °C) of different places in January. Find the temperature difference between Siachin and Chennai." },
  17: { lab: dial("Count the vowels, then all the letters.") },
  18: { lab: dial("The place value of 3 in 637258 is 30000.") },
  19: { lab: dial("Break 7350 into primes and count the different ones.") },
  20: { lab: fig("q20", "Not a polygon", "A polygon is closed and made only of straight sides.", false), options: FIGS },
  21: { lab: { mode: "build", fig: F("q21"), tokens: ["2", "4", "8", "×", "÷", "−"], hints: ["Count the hops and the size of each hop."] }, questionText: "What does the given number line represent?" },
  22: { lab: dial("Put x = 4 and y = 5 and simplify.", { keys: ":" }) },
  23: { lab: { mode: "build", tokens: ["x", "5", "+", "×", "÷", "−"], hints: ["The cousin is younger by 5 years."] } },
  24: { lab: dial("Shaded area = whole rectangle − unshaded rectangle.", { fig: F("q24"), unit: "cm²" }), questionText: "What is the area of the shaded part in the given figure?" },
  25: { lab: dial("Add first, then subtract.") },
  26: { lab: dial("Read the five bars, then compare the two groups of years.", { fig: F("q26") }), questionText: "The given bar graph represents the total number of runs scored by a player in five different years across all formats of cricket. How many more runs were scored by the player in years 2018, 2019 and 2021 altogether than in years 2017 and 2020 together?" },
  27: { lab: fig("q27", "Obtuse angle between the hands", "Each hour mark is 30°; obtuse is between 90° and 180°.", false), options: ["Clock A", "Clock B", "Clock C", "Clock D"] },
  28: { lab: dial("491/1000 has three decimal places.") },
  29: { lab: tile("Exactly two lines of symmetry: ___", "Try folding each shape.") },
  30: { lab: dial("Write it group by group: millions, thousands, ones.") },
  31: { lab: { mode: "multi", fig: F("q31"), parts: [{ label: "value of a pineapple" }, { label: "value of a mango" }], hints: ["Take the second equation away from the first."] }, questionText: "If mango + pineapple + pineapple = 400 and pineapple + mango = 240, then find the value of pineapple and mango respectively." },
  32: { lab: dial("Parallel lines never meet; count every pair.", { fig: F("q32") }) },
  33: { lab: { mode: "truth", statements: ["Smallest natural number is 0.", "Every whole number has a successor.", "Predecessor of a two digit number is always a two digit number.", "Smallest whole number is 1."], map: { TFFF: "A", FTFF: "B", FFTF: "C", FFFT: "D" }, hints: ["Think about 10 for the third statement."] } },
  34: { lab: dial("Count the shaded triangles out of all the triangles.", { fig: F("q34") }) },
  35: { lab: dial("Count the matches with 2 or more goals.") },
  36: { lab: dial("Length = 2 × 65 − 7; five rounds of the perimeter.", { unit: "m" }) },
  37: { lab: dial("The least number divisible by 2, 3, 5 and 6 is their LCM.") },
  38: { lab: dial("Find the cost of one egg and one omelette first.", { keys: ":" }) },
  39: { lab: dial("1 3/5 − 1 1/2 as fractions.", { unit: "km" }) },
  40: { lab: dial("Area = cost ÷ rate; the side is the number that squares to it.", { unit: "m" }) },
  41: { lab: tile("2860 in Roman numerals is ___.", "2000 = MM, 800 = DCCC, 60 = LX.") },
  42: { lab: dial("Start at 125 and apply each change in order.", { unit: "₹", keys: "-" }) },
  43: { lab: dial("Q = total − P.") },
  44: { lab: dial("Add up everything she bought and subtract from ₹ 5000.", { unit: "₹" }) },
  45: { lab: dial("Round each number to the nearest ten first.") },
  46: { lab: { mode: "match", left: ["The sum of place values of the digits 5 and 8 in 95807", "8 hundreds more than the smallest 4-digit even number", "Greatest 4-digit number having all different digits such that 3 is at tens place"], right: [{ key: "i", text: "1800" }, { key: "ii", text: "9837" }, { key: "iii", text: "5800" }], map: { "iii,i,ii": "A", "ii,i,iii": "B", "iii,ii,i": "C", "i,iii,ii": "D" }, hints: ["The smallest 4-digit even number is 1000."] } },
  47: { lab: { mode: "truth", statements: ["One-fourth of a revolution is a right angle.", "A person is facing towards North. He turns clockwise to face towards South-West. So, he turned 5/8 of a revolution clockwise."], map: { TF: "A", FT: "B", TT: "C", FF: "D" }, hints: ["Each of the 8 compass directions is 1/8 of a turn."] } },
  48: { lab: { mode: "multi", parts: [{ label: "(P) 57.295 + 108.280 − 33.912" }, { label: "(Q) 50 + 5 + 5/10 + 5/100" }, { label: "(R) ₹ 12.50 + ₹ 5.75 + ₹ 8.38" }], hints: ["Line up the decimal points."] } },
  49: { lab: { mode: "multi", parts: [{ label: "(a) area of the path", unit: "m²" }, { label: "(b) area of the square", unit: "cm²" }], hints: ["(a) The field with the path is 13 m by 9 m."] } },
  50: { lab: { mode: "multi", fig: F("q50"), parts: [{ label: "(i) how many more laptops S sold than Q" }, { label: "(ii) fraction sold by P and R together" }], hints: ["Each symbol is 4 laptops; a half symbol is 2."] }, questionText: "The given pictograph shows the number of laptops sold by five different shops in a month.\n(i) How many more laptops were sold by shop S than shop Q?\n(ii) Find the fraction of the number of laptops sold by shops P and R together to the total number of laptops sold by all the shops." },
};
