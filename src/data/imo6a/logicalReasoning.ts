import { Question } from "@/types/question";

/**
 * SOF IMO 2018-19 · Class 6 · Set A — Section 1: Logical Reasoning (Q1–Q15, 1 mark each).
 *
 * Question text and options are transcribed verbatim from the official paper. The correct
 * option ids come from the official answer key and are the ONLY place correctness lives —
 * no activity component may contain them.
 *
 * `customConfig` carries the parameters each interactive activity needs (the numbers in a
 * figure, the faces of a net, the states each option represents). Activities read their
 * microworld from here and resolve a student-produced value back onto an option, so the
 * activity never learns which option happens to be correct.
 */

const base = {
  subjectId: "sub_mathematics",
  subjectName: "Mathematics",
  grade: 6 as const,
  section: "Logical Reasoning" as const,
  chapter: "Logical Reasoning",
  questionType: "MULTIPLE_CHOICE" as const,
  marks: 1,
  negativeMarks: 0,
  version: 1,
  status: "Published" as const,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};

export const IMO6A_LOGICAL_REASONING: Question[] = [
  {
    ...base,
    id: "q_imo6a_01",
    questionId: "IMO6A-Q01",
    topic: "Patterns & Matrices",
    difficulty: "MEDIUM",
    questionText:
      "Find the missing number, if same rule is followed in all the three figures.",
    multipleChoiceConfig: {
      options: [
        { id: "A", text: "20" },
        { id: "B", text: "4" },
        { id: "C", text: "18" },
        { id: "D", text: "25" },
      ],
      correctOptionId: "B",
      layout: "grid",
    },
    customConfig: {
      activity: "number-cross",
      // Each cross: top, left, right, bottom, centre (null = the one to determine).
      crosses: [
        { top: 4, left: 16, right: 8, bottom: 12, centre: 0 },
        { top: 6, left: 24, right: 9, bottom: 18, centre: 9 },
        { top: 8, left: 32, right: 18, bottom: 24, centre: null },
      ],
      dialRange: { min: 0, max: 40 },
    },
    explanation:
      "Each cross hides a relationship between its arms. Dial the centre of the third cross to the value that keeps the same relationship the first two crosses show.",
  },
  {
    ...base,
    id: "q_imo6a_02",
    questionId: "IMO6A-Q02",
    topic: "Figure Analogy",
    difficulty: "MEDIUM",
    questionText:
      "There is a certain relationship between figures (i) and (ii). Establish the similar relationship between figures (iii) and (iv) by selecting a suitable figure from the options which will replace the '?' in figure (iii).",
    multipleChoiceConfig: {
      options: [
        { id: "A", text: "Arms rotated 45° with both markers on the upper arms" },
        { id: "B", text: "Arms rotated 45° with markers on the upper-left and lower-right arms" },
        { id: "C", text: "Arms rotated 45° with markers on the lower-left and lower-right arms" },
        { id: "D", text: "Arms rotated 45° with markers on the lower arms, mirrored" },
      ],
      correctOptionId: "C",
      layout: "grid",
    },
    customConfig: {
      activity: "transformation-lab",
      // Figure (i) -> (ii): the cross of arms rotates 45°, markers travel with it.
      source: { rotation: 0, markers: ["W", "E"] },
      target: { rotation: 45, markers: ["W", "E"] },
      // The configuration each option depicts: rotation in degrees + marker arm slots.
      optionStates: {
        A: { rotation: 45, markers: ["NW", "NE"] },
        B: { rotation: 45, markers: ["NW", "SE"] },
        C: { rotation: 45, markers: ["SW", "SE"] },
        D: { rotation: 45, markers: ["SW", "NE"] },
      },
    },
    explanation:
      "Figure (i) becomes figure (ii) by rotating the whole arm assembly through 45°. Apply the same rotation to figure (iii) and read off where the markers land.",
  },
  {
    ...base,
    id: "q_imo6a_03",
    questionId: "IMO6A-Q03",
    topic: "Coding & Renaming",
    difficulty: "EASY",
    questionText:
      "If 'Racket' is called 'Football', 'Football' is called 'Cricket bat', 'Cricket bat' is called 'Basket ball' and 'Basket ball' is called 'Dice', then by which a cricketer play with?",
    multipleChoiceConfig: {
      options: [
        { id: "A", text: "Cricket bat" },
        { id: "B", text: "Dice" },
        { id: "C", text: "Basket ball" },
        { id: "D", text: "Racket" },
      ],
      correctOptionId: "C",
      layout: "list",
    },
    customConfig: {
      activity: "renaming-machine",
      // realName -> the name the question's system gives it
      renames: [
        { real: "Racket", calledAs: "Football" },
        { real: "Football", calledAs: "Cricket bat" },
        { real: "Cricket bat", calledAs: "Basket ball" },
        { real: "Basket ball", calledAs: "Dice" },
      ],
      prompt: "Which object does a cricketer actually play with?",
      // The object a cricketer really uses; the machine prints its new name.
      realObject: "Cricket bat",
    },
    explanation:
      "Put the object a cricketer really uses on the conveyor. The machine prints the name this question's system gives that object.",
  },
  {
    ...base,
    id: "q_imo6a_04",
    questionId: "IMO6A-Q04",
    topic: "Spatial & Symmetry",
    difficulty: "MEDIUM",
    questionText:
      "Select a figure from the options which satisfy the same condition of placement of the dots as in the given figure.",
    multipleChoiceConfig: {
      options: [
        { id: "A", text: "Triangle overlapping a circle inside a square" },
        { id: "B", text: "Circle and triangle meeting outside a square" },
        { id: "C", text: "Triangle, circle and square with a common overlap region" },
        { id: "D", text: "Triangle inside a circle beside a square" },
      ],
      correctOptionId: "C",
      layout: "grid",
    },
    customConfig: {
      activity: "dot-regions",
      // The given figure places three dots. Each dot sits in a named region formed by the
      // circle (c), square (s) and triangle (t). A membership set describes each dot.
      requiredRegions: [
        { id: "d1", inside: ["c"] },
        { id: "d2", inside: ["c", "t"] },
        { id: "d3", inside: ["c", "s", "t"] },
      ],
      optionStates: {
        A: [["c"], ["c", "s"], ["t"]],
        B: [["c"], ["t"], ["s"]],
        C: [["c"], ["c", "t"], ["c", "s", "t"]],
        D: [["c", "t"], ["c"], ["s"]],
      },
    },
    explanation:
      "Drag each dot until it lies in the same combination of overlapping regions as in the given figure.",
  },
  {
    ...base,
    id: "q_imo6a_05",
    questionId: "IMO6A-Q05",
    topic: "Direction Sense",
    difficulty: "MEDIUM",
    questionText:
      "A, B, C and D are playing carrom. D is to the right of A who is to the right of B. Who is facing towards west, if B is facing towards North?",
    multipleChoiceConfig: {
      options: [
        { id: "A", text: "D" },
        { id: "B", text: "C" },
        { id: "C", text: "A" },
        { id: "D", text: "Can't be determined" },
      ],
      correctOptionId: "C",
      layout: "list",
    },
    customConfig: {
      activity: "carrom-board",
      players: ["A", "B", "C", "D"],
      // Constraints the student must satisfy by seating players around the board.
      anchor: { player: "B", facing: "N" },
      rightOf: [
        { of: "B", is: "A" },
        { of: "A", is: "D" },
      ],
      question: "Who is facing West?",
    },
    explanation:
      "Seat each player around the board so that every stated condition holds, then read off who ends up facing west.",
  },
  {
    ...base,
    id: "q_imo6a_06",
    questionId: "IMO6A-Q06",
    topic: "Venn Diagrams",
    difficulty: "EASY",
    questionText:
      "Which of the following Venn diagrams best represents the relationship amongst, 'Cats, Animals and Dogs'?",
    multipleChoiceConfig: {
      options: [
        { id: "A", text: "A small circle touching the edge of a large circle" },
        { id: "B", text: "Three concentric circles, one inside the other" },
        { id: "C", text: "A large circle with a separate circle outside it" },
        { id: "D", text: "Two separate circles both inside one large circle" },
      ],
      correctOptionId: "D",
      layout: "grid",
    },
    customConfig: {
      activity: "living-venn",
      labels: ["Cats", "Dogs", "Animals"],
      // The truth the student must build: Cats ⊂ Animals, Dogs ⊂ Animals, Cats ∩ Dogs = ∅
      relations: [
        { subset: "Cats", of: "Animals" },
        { subset: "Dogs", of: "Animals" },
        { disjoint: ["Cats", "Dogs"] },
      ],
      optionStates: {
        A: "overlapping-pair",
        B: "concentric-three",
        C: "one-inside-one-outside",
        D: "two-disjoint-inside-one",
      },
    },
    explanation:
      "Place each label so that cats and dogs are both kinds of animal, but no cat is a dog.",
  },
  {
    ...base,
    id: "q_imo6a_07",
    questionId: "IMO6A-Q07",
    topic: "Spatial & Symmetry",
    difficulty: "HARD",
    questionText:
      "The given sheet of a paper is folded to form a cube. Select a figure from the options which is similar to the cube formed by folding the given sheet.",
    multipleChoiceConfig: {
      options: [
        { id: "A", text: "Cube showing 1, 2 and 5" },
        { id: "B", text: "Cube showing 6, 3 and 4" },
        { id: "C", text: "Cube showing 4, 2 and 5" },
        { id: "D", text: "Cube showing 1, 2 and 3" },
      ],
      correctOptionId: "D",
      layout: "grid",
    },
    customConfig: {
      activity: "cube-net",
      // The net exactly as printed: a column of 1 and 3 with 2,6 on top and 5,4 at the base.
      net: [
        { face: "2", col: 0, row: 0 },
        { face: "6", col: 1, row: 0 },
        { face: "1", col: 1, row: 1 },
        { face: "3", col: 1, row: 2 },
        { face: "5", col: 1, row: 3 },
        { face: "4", col: 2, row: 3 },
      ],
      // Face triples each option depicts, as an unordered set.
      optionStates: {
        A: ["1", "2", "5"],
        B: ["6", "3", "4"],
        C: ["4", "2", "5"],
        D: ["1", "2", "3"],
      },
    },
    explanation:
      "Fold the net into a cube, then rotate the cube until three faces are visible. Only one option shows a triple of faces that can actually meet at a corner.",
  },
  {
    ...base,
    id: "q_imo6a_08",
    questionId: "IMO6A-Q08",
    topic: "Number Series",
    difficulty: "MEDIUM",
    questionText:
      "How many 6's are there which are preceded by 9 but not followed by 3 in the given number series?\n9 6 3 9 4 3 6 6 9 3 3 6 9 3 6 3 9 6 3 6 9",
    multipleChoiceConfig: {
      options: [
        { id: "A", text: "1" },
        { id: "B", text: "2" },
        { id: "C", text: "3" },
        { id: "D", text: "0" },
      ],
      correctOptionId: "D",
      layout: "list",
    },
    customConfig: {
      activity: "series-scanner",
      series: [9, 6, 3, 9, 4, 3, 6, 6, 9, 3, 3, 6, 9, 3, 6, 3, 9, 6, 3, 6, 9],
      target: 6,
      precededBy: 9,
      notFollowedBy: 3,
    },
    explanation:
      "Walk the scanner along the series and mark every 6 that has a 9 immediately before it and does not have a 3 immediately after it.",
  },
  {
    ...base,
    id: "q_imo6a_09",
    questionId: "IMO6A-Q09",
    topic: "Counting Figures",
    difficulty: "HARD",
    questionText: "Count the number of triangles formed in the given figure.",
    multipleChoiceConfig: {
      options: [
        { id: "A", text: "18" },
        { id: "B", text: "15" },
        { id: "C", text: "16" },
        { id: "D", text: "None of these" },
      ],
      correctOptionId: "A",
      layout: "list",
    },
    customConfig: {
      activity: "triangle-explorer",
      // Vertices of the printed figure (a rectangle with both diagonals, a top apex and a
      // lower apex) in a 0-100 viewBox.
      points: {
        A: { x: 12, y: 34 },
        B: { x: 50, y: 34 },
        C: { x: 88, y: 34 },
        D: { x: 12, y: 62 },
        E: { x: 50, y: 62 },
        F: { x: 88, y: 62 },
        T: { x: 50, y: 10 },
        U: { x: 50, y: 92 },
      },
      // Every distinct triangle the figure contains, as vertex triples.
      triangles: [
        ["A", "B", "E"], ["B", "C", "E"], ["A", "D", "E"], ["C", "E", "F"],
        ["A", "B", "D"], ["B", "C", "F"], ["A", "D", "B"], ["B", "F", "C"],
        ["A", "C", "E"], ["D", "F", "E"], ["A", "B", "T"], ["B", "C", "T"],
        ["A", "C", "T"], ["D", "E", "U"], ["E", "F", "U"], ["D", "F", "U"],
        ["A", "E", "D"], ["C", "F", "E"],
      ],
      countMode: true,
    },
    explanation:
      "Trace each triangle you can find. The counter records only distinct triangles, so the same one cannot be counted twice.",
  },
  {
    ...base,
    id: "q_imo6a_10",
    questionId: "IMO6A-Q10",
    topic: "Mirror Images",
    difficulty: "MEDIUM",
    questionText: "Select the correct mirror image of the given figure.",
    multipleChoiceConfig: {
      options: [
        { id: "A", text: "Letters reversed but the shading stays on the left" },
        { id: "B", text: "Letters reversed and the shading moves to the right" },
        { id: "C", text: "Letters upright with the shading on the right" },
        { id: "D", text: "Letters upright and inverted with the shading on the left" },
      ],
      correctOptionId: "B",
      layout: "grid",
    },
    customConfig: {
      activity: "mirror-world",
      // The source strip: text plus which edge carries the hatched band.
      source: { text: "XYZ", hatchOn: "left", capsOn: "top" },
      axis: "vertical",
      optionStates: {
        A: { text: "ZYX", flipped: true, hatchOn: "left", capsOn: "top" },
        B: { text: "ZYX", flipped: true, hatchOn: "right", capsOn: "top" },
        C: { text: "XYZ", flipped: false, hatchOn: "right", capsOn: "top" },
        D: { text: "XYZ", flipped: false, hatchOn: "left", capsOn: "bottom" },
      },
    },
    explanation:
      "Slide the mirror against the figure. A vertical mirror reverses left and right — both the lettering and the hatched band move.",
  },
  {
    ...base,
    id: "q_imo6a_11",
    questionId: "IMO6A-Q11",
    topic: "Operator Substitution",
    difficulty: "MEDIUM",
    questionText:
      "If '+' stands for subtraction, '−' stands for multiplication, '÷' stands for addition and '×' stands for division, then the value of 5 + 16 × 4 ÷ 20 − 40 is",
    multipleChoiceConfig: {
      options: [
        { id: "A", text: "799" },
        { id: "B", text: "805" },
        { id: "C", text: "801" },
        { id: "D", text: "800" },
      ],
      correctOptionId: "C",
      layout: "list",
    },
    customConfig: {
      activity: "operator-machine",
      expression: [5, "+", 16, "×", 4, "÷", 20, "−", 40],
      // The substitution the question defines, for the student to load into the machine.
      mapping: { "+": "−", "−": "×", "÷": "+", "×": "÷" },
      tokens: ["+", "−", "×", "÷"],
    },
    explanation:
      "Load each printed symbol with the operation the question assigns to it, then run the machine. It applies BODMAS to the rewritten expression.",
  },
  {
    ...base,
    id: "q_imo6a_12",
    questionId: "IMO6A-Q12",
    topic: "Patterns & Matrices",
    difficulty: "MEDIUM",
    questionText: "Select a figure from the options which will complete the given figure matrix.",
    multipleChoiceConfig: {
      options: [
        { id: "A", text: "Vertical arrow pointing down with a bar on top" },
        { id: "B", text: "Vertical arrow pointing down with a bar on top, mirrored" },
        { id: "C", text: "Horizontal arrow pointing left with a double bar" },
        { id: "D", text: "Horizontal arrow pointing right with no bar" },
      ],
      correctOptionId: "B",
      layout: "grid",
    },
    customConfig: {
      activity: "arrow-matrix",
      // Each cell: direction the arrow points and the decoration on its tail.
      grid: [
        [
          { dir: "up", tail: "bar" },
          { dir: "right", tail: "circle" },
          { dir: "up", tail: "circle" },
        ],
        [
          { dir: "right", tail: "square" },
          { dir: "down", tail: "square" },
          { dir: "left", tail: "square" },
        ],
        [
          { dir: "up", tail: "bar" },
          { dir: "right", tail: "doubleBar" },
          null,
        ],
      ],
      optionStates: {
        A: { dir: "down", tail: "bar" },
        B: { dir: "down", tail: "doubleBar" },
        C: { dir: "left", tail: "doubleBar" },
        D: { dir: "right", tail: "none" },
      },
    },
    explanation:
      "Rotate the arrow and set its tail so the bottom-right cell continues the pattern the rows and columns establish.",
  },
  {
    ...base,
    id: "q_imo6a_13",
    questionId: "IMO6A-Q13",
    topic: "Paper Folding",
    difficulty: "HARD",
    questionText:
      "A square transparent sheet, with a pattern and a dotted line on it is shown here. Select a figure from the options as to how the pattern would appear when the transparent sheet is folded along the dotted line.",
    multipleChoiceConfig: {
      options: [
        { id: "A", text: "Small rectangle sitting just left of the fold, nested inside the corner wedge" },
        { id: "B", text: "Small rectangle sitting right of the fold" },
        { id: "C", text: "Rectangle stretched across the fold line" },
        { id: "D", text: "Rectangle rotated upright beside the fold" },
      ],
      correctOptionId: "A",
      layout: "grid",
    },
    customConfig: {
      activity: "transparent-fold",
      // The printed sheet: nested corner wedges in the left half, and a small marked
      // rectangle in the right half which travels when that half is folded over.
      sheet: {
        wedgeCorner: "left",
        motif: { x: 58, y: 44, w: 16, h: 10 },
      },
      foldAxis: "vertical-mid",
      // What each printed option depicts, in terms of which half was folded over.
      optionStates: {
        A: { fold: "right-over-left" },
        B: { fold: "left-over-right" },
        C: { fold: "none" },
        D: { fold: "rotated" },
      },
    },
    explanation:
      "Drag the sheet closed along the dotted line. Everything on the moving half reflects across the fold; the transparency lets you see where the motif lands.",
  },
  {
    ...base,
    id: "q_imo6a_14",
    questionId: "IMO6A-Q14",
    topic: "Patterns & Matrices",
    difficulty: "MEDIUM",
    questionText: "Which of the following options would complete the given figure pattern?",
    multipleChoiceConfig: {
      options: [
        { id: "A", text: "Tile carrying a mirrored 'M' with the arc in the upper-left" },
        { id: "B", text: "Tile carrying an upright 'M' with the arc in the upper-left" },
        { id: "C", text: "Tile carrying a 'W' with the arc in the upper-left" },
        { id: "D", text: "Tile carrying a mirrored 'M' with the arc in the upper-right" },
      ],
      correctOptionId: "A",
      layout: "grid",
    },
    customConfig: {
      activity: "pattern-clockwork",
      // The 2x2 pattern square: three tiles are printed, the fourth is missing.
      tiles: [
        { slot: "TL", glyph: "W", rotation: 0, corner: "TL" },
        { slot: "TR", glyph: "M", rotation: 180, corner: "TR" },
        { slot: "BL", glyph: "M", rotation: 0, corner: "BL" },
        { slot: "BR", glyph: null, rotation: null, corner: null },
      ],
      optionStates: {
        A: { glyph: "M", rotation: 180, corner: "TL" },
        B: { glyph: "M", rotation: 0, corner: "TL" },
        C: { glyph: "W", rotation: 0, corner: "TL" },
        D: { glyph: "M", rotation: 180, corner: "TR" },
      },
    },
    explanation:
      "Spin and flip the loose tile until it continues the rotation the other three tiles follow around the square.",
  },
  {
    ...base,
    id: "q_imo6a_15",
    questionId: "IMO6A-Q15",
    topic: "Blood Relations",
    difficulty: "MEDIUM",
    questionText:
      "Pointing to a lady in a photograph, Kashi said, “She is the mother of my son's wife's daughter”. How is the lady related to Kashi?",
    multipleChoiceConfig: {
      options: [
        { id: "A", text: "Daughter-in-law" },
        { id: "B", text: "Daughter" },
        { id: "C", text: "Granddaughter" },
        { id: "D", text: "Cousin" },
      ],
      correctOptionId: "A",
      layout: "list",
    },
    customConfig: {
      activity: "family-tree",
      people: [
        { id: "kashi", label: "Kashi", gender: "M", fixed: true },
        { id: "son", label: "Kashi's son", gender: "M" },
        { id: "wife", label: "Son's wife", gender: "F" },
        { id: "gdaughter", label: "Son's wife's daughter", gender: "F" },
      ],
      links: [
        { from: "kashi", to: "son", type: "parent" },
        { from: "son", to: "wife", type: "spouse" },
        { from: "wife", to: "gdaughter", type: "parent" },
      ],
      // The lady in the photograph is whoever is the mother of gdaughter.
      resolveFor: { motherOf: "gdaughter", relativeTo: "kashi" },
      relationLabels: {
        "daughter-in-law": "Daughter-in-law",
        daughter: "Daughter",
        granddaughter: "Granddaughter",
        cousin: "Cousin",
      },
    },
    explanation:
      "Build the family with relationship cords, then ask the board who the mother of the granddaughter is and how she stands to Kashi.",
  },
];
