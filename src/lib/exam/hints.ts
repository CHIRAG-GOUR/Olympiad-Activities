/**
 * Hints service for National Olympiad Examination questions.
 * Provides pedagogical clues that guide the candidate without spoiling the final answer option.
 */

import { Question } from "@/types/question";

export const CURATED_HINTS: Record<string, string> = {
  // Q1 - Q15 Logical Reasoning (SOF IMO Class 6 Set B)
  "LOG-G6-001": "Break down 'only daughter of my mother'. If a person's mother has only one daughter, who is that daughter in relation to the speaker?",
  q_imo_01: "Break down 'only daughter of my mother'. If a person's mother has only one daughter, who is that daughter in relation to the speaker?",

  "LOG-G6-002": "Notice the dot's exact region in the question figure: it lies inside the circle and triangle only, completely outside the square. Find the option with that same unique region.",
  q_imo_02: "Notice the dot's exact region in the question figure: it lies inside the circle and triangle only, completely outside the square. Find the option with that same unique region.",

  "LOG-G6-003": "Consider whether a Judge, Police, and Thief share any overlapping duties or if they represent three completely distinct, non-overlapping categories.",
  q_imo_03: "Consider whether a Judge, Police, and Thief share any overlapping duties or if they represent three completely distinct, non-overlapping categories.",

  "LOG-G6-004": "Track the 3 patterns separately: 1st letters increase by +2 (B, D, F, H...), numbers increase by +3, +4, +5, +6 (4, 7, 11, 16...), and 3rd letters step backward by -1 (M, L, K, J...).",
  q_imo_04: "Track the 3 patterns separately: 1st letters increase by +2 (B, D, F, H...), numbers increase by +3, +4, +5, +6 (4, 7, 11, 16...), and 3rd letters step backward by -1 (M, L, K, J...).",

  "LOG-G6-005": "Observe how Figure (i) transforms into Figure (ii): examine the 90° rotation and how the inner symbols invert. Apply the exact same transformation to Figure (iii).",
  q_imo_05: "Observe how Figure (i) transforms into Figure (ii): examine the 90° rotation and how the inner symbols invert. Apply the exact same transformation to Figure (iii).",

  "LOG-G6-006": "Count systematically: first count the 8 small individual triangles, then the combinations of 2 triangles (4 composite), and finally the 4 large triangles along the main diagonals.",
  q_imo_06: "Count systematically: first count the 8 small individual triangles, then the combinations of 2 triangles (4 composite), and finally the 4 large triangles along the main diagonals.",

  "LOG-G6-007": "Imagine opening the paper in reverse: unfold horizontally first to mirror the cut, then unfold vertically so the cuts reflect symmetrically across both centerlines.",
  q_imo_07: "Imagine opening the paper in reverse: unfold horizontally first to mirror the cut, then unfold vertically so the cuts reflect symmetrically across both centerlines.",

  "LOG-G6-008": "Scan the sequence for symbols where the preceding character is an even number and the succeeding character is also an even number.",
  q_imo_08: "Scan the sequence for symbols where the preceding character is an even number and the succeeding character is also an even number.",

  "LOG-G6-009": "Look at the internal division of shapes: one group divides shapes into 4 equal quadrants, another group consists of symmetric closed polygons, and the third consists of open diagonal line patterns.",
  q_imo_09: "Look at the internal division of shapes: one group divides shapes into 4 equal quadrants, another group consists of symmetric closed polygons, and the third consists of open diagonal line patterns.",

  "LOG-G6-010": "Unscramble the letters to form a meaningful common English word related to wild animals or forests, then check the number corresponding to each letter.",
  q_imo_010: "Unscramble the letters to form a meaningful common English word related to wild animals or forests, then check the number corresponding to each letter.",

  "LOG-G6-011": "Notice that the letters in CREDIT are simply rearranged in alphabetical order (C-D-E-I-R-T). Rearrange the letters of SAFEST in the same alphabetical order.",
  q_imo_11: "Notice that the letters in CREDIT are simply rearranged in alphabetical order (C-D-E-I-R-T). Rearrange the letters of SAFEST in the same alphabetical order.",

  "LOG-G6-012": "In a horizontal mirror reflection, the order of letters reverses from left to right, and each individual letter is flipped horizontally.",
  q_imo_12: "In a horizontal mirror reflection, the order of letters reverses from left to right, and each individual letter is flipped horizontally.",

  "LOG-G6-013": "Substitute the real arithmetic operators according to the given key, then strictly follow the BODMAS order of operations (Division and Multiplication before Addition and Subtraction).",
  q_imo_13: "Substitute the real arithmetic operators according to the given key, then strictly follow the BODMAS order of operations (Division and Multiplication before Addition and Subtraction).",

  "LOG-G6-014": "Count the cubes layer by layer (top layer, middle layer, bottom foundation layer) including the hidden cubes supporting the visible columns.",
  q_imo_14: "Count the cubes layer by layer (top layer, middle layer, bottom foundation layer) including the hidden cubes supporting the visible columns.",

  "LOG-G6-015": "Observe how each subsequent figure adds an arrow and alternates between horizontal and vertical orientations.",
  q_imo_15: "Observe how each subsequent figure adds an arrow and alternates between horizontal and vertical orientations.",

  // Mathematical Reasoning & Everyday Mathematics
  "MAT-G6-016": "Subtract the temperature of Siachin from Chennai: Difference = 30 − (−30). Remember that subtracting a negative number equals adding.",
  q_imo_16: "Subtract the temperature of Siachin from Chennai: Difference = 30 − (−30). Remember that subtracting a negative number equals adding.",

  "MAT-G6-017": "Count the vowels (A, E, I, O, U) in the word MATHEMATICS, then divide by the total count of 11 letters.",
  q_imo_17: "Count the vowels (A, E, I, O, U) in the word MATHEMATICS, then divide by the total count of 11 letters.",

  "MAT-G6-018": "Place value depends on the position (ten-thousands place = 30,000), while face value is simply the digit itself (3). Calculate their difference.",
  q_imo_18: "Place value depends on the position (ten-thousands place = 30,000), while face value is simply the digit itself (3). Calculate their difference.",

  "MAT-G6-019": "Find the prime factors of 7350 by continuous division (divide by 2, then 3, then 5, etc.) and count how many unique prime bases appear.",
  q_imo_19: "Find the prime factors of 7350 by continuous division (divide by 2, then 3, then 5, etc.) and count how many unique prime bases appear.",

  "MAT-G6-020": "Recall the definition: a polygon is a closed two-dimensional shape made up of only straight line segments (no curved arcs).",
  q_imo_20: "Recall the definition: a polygon is a closed two-dimensional shape made up of only straight line segments (no curved arcs).",

  // Achievers Section
  "ACH-G6-046": "Compute each row: (P) 5000 + 800; (Q) Smallest 4-digit even number is 1000, add 800; (R) For maximum number with 3 at tens place, use 9, 8, 3, 7.",
  q_imo_46: "Compute each row: (P) 5000 + 800; (Q) Smallest 4-digit even number is 1000, add 800; (R) For maximum number with 3 at tens place, use 9, 8, 3, 7.",

  "ACH-G6-047": "Check each statement: One right angle equals 90°, which is 1/4 of 360°. For Statement II, calculate the angle from North to South-West (225°) as a fraction of 360°.",
  q_imo_47: "Check each statement: One right angle equals 90°, which is 1/4 of 360°. For Statement II, calculate the angle from North to South-West (225°) as a fraction of 360°.",

  "ACH-G6-048": "Carefully align the decimal points when adding and subtracting: for (P) compute (57.295 + 108.280) − 33.912.",
  q_imo_48: "Carefully align the decimal points when adding and subtracting: for (P) compute (57.295 + 108.280) − 33.912.",

  "ACH-G6-049": "For the path around a rectangle, add twice the width of the path (2 × 0.5 = 1 m) to both length and breadth to get the outer dimensions, then subtract inner area from outer area.",
  q_imo_49: "For the path around a rectangle, add twice the width of the path (2 × 0.5 = 1 m) to both length and breadth to get the outer dimensions, then subtract inner area from outer area.",

  "ACH-G6-050": "Look at the pictograph key carefully: multiply the symbol count by the unit value represented by each icon.",
  q_imo_50: "Look at the pictograph key carefully: multiply the symbol count by the unit value represented by each icon.",
};

/**
 * Returns a pedagogically constructive hint for any question.
 */
export function getQuestionHint(question: Question): string {
  // 1. Check if the question itself defines explicit hints
  if (question.hints && question.hints.length > 0 && question.hints[0].trim()) {
    return question.hints[0].trim();
  }

  // 2. Check curated dictionary by question id or code
  const key = question.id || question.questionId;
  if (key && CURATED_HINTS[key]) {
    return CURATED_HINTS[key];
  }
  if (question.questionId && CURATED_HINTS[question.questionId]) {
    return CURATED_HINTS[question.questionId];
  }

  // 3. Fallback: derive from explanation if available (stripping away direct option spoilers)
  if (question.explanation && question.explanation.trim()) {
    const sanitized = question.explanation
      .replace(/\(Option\s+[A-D]\)/gi, "")
      .replace(/Option\s+[A-D]/gi, "the correct answer")
      .replace(/Matches\s+[A-D]/gi, "matches the correct choice")
      .trim();
    const firstSentence = sanitized.split(/(?<=[.?!])\s+/)[0];
    if (firstSentence && firstSentence.length > 15) {
      return firstSentence;
    }
  }

  // 4. Topic and domain-specific pedagogical clues
  const topic = (question.topic || "").toLowerCase();
  const text = (question.questionText || "").toLowerCase();

  // Coding & Series patterns
  if (topic.includes("coding") || text.includes("coded as") || text.includes("in a certain code")) {
    return "Check the positional shifts of each letter in the alphabet (e.g. +1, +2, reverse alphabetical order, or symbol replacements).";
  }
  if (topic.includes("series") || topic.includes("alphanumeric") || text.includes("next in the series") || text.includes("complete the series") || text.includes("missing term")) {
    return "Find the step pattern between consecutive terms: check differences between numbers and letter rank shifts.";
  }

  // Logical Reasoning patterns
  if (topic.includes("blood") || text.includes("pointing to") || /\b(mother|father|brother|sister|daughter|son|uncle|aunt|nephew|niece|grandfather|grandmother)\b/i.test(text)) {
    return "Draw a simple family tree diagram: identify the speaker first, trace generational links step-by-step, and deduce the direct relationship.";
  }
  if (topic.includes("direction") || text.includes("walks") || text.includes("turns north") || text.includes("turns right") || text.includes("facing")) {
    return "Sketch a compass rose (North, South, East, West). Trace each movement and turn on paper to find the final direction or distance.";
  }
  if (topic.includes("embedded") || text.includes("hidden") || text.includes("embedded in")) {
    return "Look for the distinct angles and vertex intersections of the target shape inside the complex figures.";
  }
  if (topic.includes("mirror") || text.includes("mirror image") || text.includes("reflection")) {
    return "Remember that a mirror image reverses left and right while keeping top and bottom unchanged. Check the side closest to the mirror line first.";
  }
  if (topic.includes("water") || text.includes("water image")) {
    return "A water image flips the figure vertically (inverts top and bottom) while keeping left and right orientation unchanged.";
  }
  if (topic.includes("paper") || text.includes("paper folding") || text.includes("paper cut") || text.includes("punched")) {
    return "Unfold the paper in reverse order of how it was folded, reflecting all cuts and punches across each fold line.";
  }
  if (topic.includes("cube") || topic.includes("dice") || text.includes("opposite to") || text.includes("faces of a dice")) {
    return "Find common faces between two positions of the dice: the remaining visible faces will reveal adjacent vs opposite relationships.";
  }
  if (topic.includes("venn") || text.includes("venn diagram") || text.includes("represents")) {
    return "Examine subset and intersection relationships: elements completely enclosed within another represent subset categories.";
  }
  if (topic.includes("dot") || text.includes("dot situation")) {
    return "Identify the exact geometrical shapes enclosing each dot, then find the option where the same intersection regions exist.";
  }

  // Mathematics patterns
  if (topic.includes("bodmas") || topic.includes("operator") || text.includes("denotes") || text.includes("value of")) {
    return "Substitute the operator symbols according to the given key, then strictly follow BODMAS (Division/Multiplication before Addition/Subtraction).";
  }
  if (topic.includes("prime") || topic.includes("factor") || topic.includes("hcf") || topic.includes("lcm")) {
    return "Break down the numbers into their prime factorisations to find common divisors or least common multiples.";
  }
  if (topic.includes("fraction") || text.includes("fraction") || text.includes("numerator") || text.includes("denominator")) {
    return "Convert fractions to like denominators before adding/subtracting, or reduce to simplest terms by dividing by the common factor.";
  }
  if (topic.includes("decimal") || text.includes("decimal")) {
    return "Align decimal points vertically before adding or subtracting, and count decimal places carefully when multiplying.";
  }
  if (topic.includes("ratio") || topic.includes("proportion") || text.includes("ratio")) {
    return "Set up the proportion equation a/b = c/d or find the value of one ratio unit from the given total quantity.";
  }
  if (topic.includes("area") || topic.includes("perimeter") || text.includes("area") || text.includes("perimeter")) {
    return "Remember that perimeter measures total boundary length, while area measures enclosed surface units (Length × Breadth for a rectangle).";
  }
  if (topic.includes("angle") || topic.includes("clock") || text.includes("angle") || text.includes("degree")) {
    return "Each hour on a standard clock face represents 30° (360° ÷ 12). Measure the angle between the hour and minute hands.";
  }
  if (topic.includes("algebra") || text.includes("equation") || text.includes("solve for") || text.includes("expression")) {
    return "Group like terms together and isolate the variable systematically on one side of the equation.";
  }
  if (topic.includes("integer") || text.includes("negative") || text.includes("temperature")) {
    return "Keep number line rules in mind: moving right increases value, moving left decreases value, and subtracting a negative equals adding.";
  }

  // English & Grammar patterns
  if (topic.includes("synonym") || text.includes("synonym") || text.includes("nearest in meaning")) {
    return "Identify the core meaning and tone of the target word, and eliminate choices that mean the opposite or are unrelated.";
  }
  if (topic.includes("antonym") || text.includes("antonym") || text.includes("opposite in meaning")) {
    return "Find the exact opposite concept of the highlighted word rather than just a different or unrelated word.";
  }
  if (topic.includes("spelling") || text.includes("correctly spelt") || text.includes("misspelt")) {
    return "Break the word into prefixes, root syllables, and suffixes to verify double consonants and silent letters.";
  }
  if (topic.includes("preposition") || text.includes("preposition") || text.includes("fill in the blank")) {
    return "Check which preposition naturally collocates with the preceding verb, adjective, or noun in standard English usage.";
  }
  if (topic.includes("tense") || topic.includes("verb") || text.includes("tense")) {
    return "Check the time indicator in the sentence (past, present, ongoing, or future) to select the matching verb form.";
  }
  if (topic.includes("article") || text.includes("article") || text.includes("a/an/the")) {
    return "Use 'a' before consonant sounds, 'an' before vowel sounds, and 'the' when referring to a specific, unique, or previously mentioned noun.";
  }

  // Science & General Knowledge patterns
  if (topic.includes("force") || topic.includes("gravity") || topic.includes("motion") || text.includes("gravity") || text.includes("force")) {
    return "Identify the direction of the acting force: gravity pulls downwards towards the Earth's center, while buoyancy acts upwards.";
  }
  if (topic.includes("energy") || topic.includes("light") || topic.includes("sound") || topic.includes("electric") || text.includes("circuit")) {
    return "Recall fundamental conservation and transfer principles governing electrical current, light reflection, and energy states.";
  }

  // 5. Fallback based on question section or chapter
  if (question.chapter) {
    return `Apply the fundamental rules of ${question.chapter}. Read each given condition carefully and eliminate options that violate them.`;
  }

  return "Break down the problem step-by-step and test each possibility against the given question conditions.";
}
