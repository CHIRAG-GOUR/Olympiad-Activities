import { Question } from "@/types/question";

/**
 * SOF IMO 2018-19 · Class 6 · Set A — Section 3: Everyday Mathematics (Q36–Q45, 1 mark each).
 *
 * Text and options transcribed verbatim from the official paper; correct option ids come
 * from the official answer key.
 */

const base = {
  subjectId: "sub_mathematics",
  subjectName: "Mathematics",
  grade: 6 as const,
  section: "Everyday Mathematics" as const,
  chapter: "Everyday Mathematics",
  questionType: "MULTIPLE_CHOICE" as const,
  marks: 1,
  negativeMarks: 0,
  version: 1,
  status: "Published" as const,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};

export const IMO6A_EVERYDAY_MATHEMATICS: Question[] = [
  {
    ...base,
    id: "q_imo6a_36",
    questionId: "IMO6A-Q36",
    topic: "Word Problems",
    difficulty: "EASY",
    questionText:
      "A retailer bought 12000 strawberries. He threw 144 strawberries that were rotten. He packed the remaining strawberries equally in 76 boxes. How many strawberries were there in each box?",
    multipleChoiceConfig: {
      options: [
        { id: "A", text: "156" },
        { id: "B", text: "149" },
        { id: "C", text: "160" },
        { id: "D", text: "250" },
      ],
      correctOptionId: "A",
      layout: "list",
    },
    customConfig: {
      activity: "packing-line",
      total: 12000,
      discard: 144,
      boxes: 76,
      itemLabel: "strawberries",
      stages: ["discard", "distribute"],
    },
    explanation:
      "Run the packing line: tip the rotten fruit into the bin, then set the conveyor to share the rest equally between the 76 boxes.",
  },
  {
    ...base,
    id: "q_imo6a_37",
    questionId: "IMO6A-Q37",
    topic: "LCM in Context",
    difficulty: "MEDIUM",
    questionText:
      "Ruhanika is organising a party for 480 people and needs disposable glasses and straws. There are 40 glasses in a pack and 160 straws in a pack. She needs exactly the same number of glasses and straws. What is the minimum number of each pack she must buy?",
    multipleChoiceConfig: {
      options: [
        { id: "A", text: "14 packs of glasses and 12 packs of straws" },
        { id: "B", text: "15 packs of glasses and 3 packs of straws" },
        { id: "C", text: "14 packs of glasses and 11 packs of straws" },
        { id: "D", text: "12 packs of glasses and 3 packs of straws" },
      ],
      correctOptionId: "D",
      layout: "list",
    },
    customConfig: {
      activity: "party-stocker",
      guests: 480,
      items: [
        { id: "glasses", label: "Glasses", perPack: 40, max: 20 },
        { id: "straws", label: "Straws", perPack: 160, max: 20 },
      ],
      // Both totals must reach the guest count and match each other exactly.
      constraints: { equalTotals: true, atLeast: 480 },
    },
    explanation:
      "Stack packs onto the trolley. The counters show how many glasses and straws you have; both must reach 480 and match exactly, using as few packs as possible.",
  },
  {
    ...base,
    id: "q_imo6a_38",
    questionId: "IMO6A-Q38",
    topic: "Perimeter & Area",
    difficulty: "MEDIUM",
    questionText:
      "Five square flower beds each of side 1.2 m are dug on a piece of land 4.8 m long and 4.2 m wide. What is the area of the remaining part of land?",
    multipleChoiceConfig: {
      options: [
        { id: "A", text: "12.69 sq. m" },
        { id: "B", text: "12.96 sq. m" },
        { id: "C", text: "11.96 sq. m" },
        { id: "D", text: "144 sq. m" },
      ],
      correctOptionId: "B",
      layout: "list",
    },
    customConfig: {
      activity: "garden-planner",
      land: { length: 4.8, width: 4.2 },
      bed: { side: 1.2, count: 5 },
      unit: "sq. m",
      decimals: 2,
    },
    explanation:
      "Drag each flower bed onto the plot. The ledger keeps the land area, the dug area and the grass that is left.",
  },
  {
    ...base,
    id: "q_imo6a_39",
    questionId: "IMO6A-Q39",
    topic: "Ratio & Proportion",
    difficulty: "MEDIUM",
    questionText:
      "At present, Kirti is 12 years old and her mother Kamlesh is 42 years old. Find the ratio of the Kamlesh's age two years ago to Kirti's age two years hence.",
    multipleChoiceConfig: {
      options: [
        { id: "A", text: "7 : 20" },
        { id: "B", text: "20 : 7" },
        { id: "C", text: "10 : 3" },
        { id: "D", text: "3 : 10" },
      ],
      correctOptionId: "B",
      layout: "list",
    },
    customConfig: {
      activity: "age-timeline",
      people: [
        { id: "kamlesh", label: "Kamlesh", ageNow: 42, offset: -2, offsetLabel: "two years ago" },
        { id: "kirti", label: "Kirti", ageNow: 12, offset: 2, offsetLabel: "two years hence" },
      ],
      ratioOrder: ["kamlesh", "kirti"],
      yearRange: { min: -6, max: 6 },
    },
    explanation:
      "Slide each person's marker along their own timeline to the year the question asks about. The ratio bar updates and reduces to lowest terms as you move.",
  },
  {
    ...base,
    id: "q_imo6a_40",
    questionId: "IMO6A-Q40",
    topic: "Algebra",
    difficulty: "MEDIUM",
    questionText:
      "The breadth of a rectangular bed sheet is 5 m more than half the length of the bed sheet. What is the perimeter of the bed sheet, if the length is x m?",
    multipleChoiceConfig: {
      options: [
        { id: "A", text: "(3x + 12) m" },
        { id: "B", text: "2(x + 5) m" },
        { id: "C", text: "(3x + 10) m" },
        { id: "D", text: "(4x + 12) m" },
      ],
      correctOptionId: "C",
      layout: "list",
    },
    customConfig: {
      activity: "algebra-sheet",
      // Breadth expressed in terms of x, built by the student from blocks.
      lengthSymbol: "x",
      breadthBlocks: [
        { id: "halfX", label: "½ x", xCoef: 0.5, constant: 0 },
        { id: "five", label: "+ 5", xCoef: 0, constant: 5 },
        { id: "x", label: "x", xCoef: 1, constant: 0 },
        { id: "ten", label: "+ 10", xCoef: 0, constant: 10 },
        { id: "twoX", label: "2x", xCoef: 2, constant: 0 },
      ],
      targetBreadth: { xCoef: 0.5, constant: 5 },
      unit: "m",
    },
    explanation:
      "Build the breadth from algebra blocks along the sheet's edge. The perimeter strip adds two lengths and two breadths and collects like terms for you.",
  },
  {
    ...base,
    id: "q_imo6a_41",
    questionId: "IMO6A-Q41",
    topic: "Integers & Signs",
    difficulty: "EASY",
    questionText:
      "On one day, the temperature on a hill at 8 p.m. was 2°C but at mid-night, it fell down to −3°C. By how much did the temperature fall?",
    multipleChoiceConfig: {
      options: [
        { id: "A", text: "5°C" },
        { id: "B", text: "6°C" },
        { id: "C", text: "7°C" },
        { id: "D", text: "8°C" },
      ],
      // Official SOF key records B. See `keyNote` — the arithmetic gives 5°C (option A).
      correctOptionId: "B",
      layout: "list",
    },
    customConfig: {
      activity: "hill-thermometer",
      readings: [
        { id: "evening", label: "8 p.m.", value: 2 },
        { id: "midnight", label: "Mid-night", value: -3 },
      ],
      scale: { min: -10, max: 10, step: 1 },
      unit: "°C",
      keyNote:
        "The official SOF answer key records option B (6°C) for this question. Dragging the mercury from 2°C down to −3°C spans 5°C, which is option A. The discrepancy is in the published key, not in this activity.",
    },
    explanation:
      "Drag the mercury from the 8 p.m. reading down to the midnight reading. The gauge counts every degree the column passes through.",
  },
  {
    ...base,
    id: "q_imo6a_42",
    questionId: "IMO6A-Q42",
    topic: "Money & Measurement",
    difficulty: "HARD",
    questionText:
      "Chinmay purchased 10 kg rice at the rate of ₹ 15 per kg, 15 kg 40 g sugar at the rate of ₹ 20 per kg and 5 kg 60 g salt at the rate of ₹ 9 per kg. He gave ₹ 1000 to the shopkeeper. How much money did he get back?",
    multipleChoiceConfig: {
      options: [
        { id: "A", text: "₹ 234.94" },
        { id: "B", text: "₹ 503.66" },
        { id: "C", text: "₹ 496.34" },
        { id: "D", text: "₹ 743.99" },
      ],
      correctOptionId: "B",
      layout: "list",
    },
    customConfig: {
      activity: "shop-counter",
      items: [
        { id: "rice", label: "Rice", kg: 10, g: 0, ratePerKg: 15 },
        { id: "sugar", label: "Sugar", kg: 15, g: 40, ratePerKg: 20 },
        { id: "salt", label: "Salt", kg: 5, g: 60, ratePerKg: 9 },
      ],
      tendered: 1000,
      currency: "₹",
      decimals: 2,
    },
    explanation:
      "Weigh each item on the shop scale and place it in the basket. The till totals the bill and works out the change from ₹ 1000.",
  },
  {
    ...base,
    id: "q_imo6a_43",
    questionId: "IMO6A-Q43",
    topic: "Fractions in Context",
    difficulty: "HARD",
    questionText:
      "Swati ate 1/2 of the candies she had and gave rest to Jeny. Jeny kept 8 of the candies and gave rest of the 10 candies to Sakshi. How many candies did Swati eat?",
    multipleChoiceConfig: {
      options: [
        { id: "A", text: "18" },
        { id: "B", text: "24" },
        { id: "C", text: "72" },
        { id: "D", text: "36" },
      ],
      correctOptionId: "A",
      layout: "list",
    },
    customConfig: {
      activity: "candy-flow",
      // Worked backwards: Jeny kept 8 and passed 10 on, so Jeny received 18, which is the
      // half Swati did not eat.
      steps: [
        { id: "swati", label: "Swati eats", fraction: [1, 2], of: "start" },
        { id: "jeny", label: "Jeny receives", remainderOf: "swati" },
        { id: "kept", label: "Jeny keeps", fixed: 8 },
        { id: "sakshi", label: "Sakshi receives", fixed: 10 },
      ],
      startRange: { min: 2, max: 80, step: 2 },
      readAt: "swati",
    },
    explanation:
      "Set the size of the starting jar and watch the candies flow down the chain. Every stage must match the story before the jar is right.",
  },
  {
    ...base,
    id: "q_imo6a_44",
    questionId: "IMO6A-Q44",
    topic: "Playing with Numbers & LCM/HCF",
    difficulty: "MEDIUM",
    questionText:
      "Three farmers have 165 kg, 190 kg and 210 kg of wheat respectively. Find the maximum capacity of a bag such that the quantity of wheat can be packed in exact number of bags.",
    multipleChoiceConfig: {
      options: [
        { id: "A", text: "15 kg" },
        { id: "B", text: "50 kg" },
        { id: "C", text: "45 kg" },
        { id: "D", text: "5 kg" },
      ],
      correctOptionId: "D",
      layout: "list",
    },
    customConfig: {
      activity: "grain-bagger",
      silos: [
        { id: "s1", label: "Farmer 1", kg: 165 },
        { id: "s2", label: "Farmer 2", kg: 190 },
        { id: "s3", label: "Farmer 3", kg: 210 },
      ],
      bagRange: { min: 1, max: 60, step: 1 },
      unit: "kg",
      goal: "maximise-exact-divisor",
    },
    explanation:
      "Dial the bag size. Each silo empties into whole bags; when a silo cannot be emptied exactly, the leftover is shown. Find the largest size that leaves nothing behind anywhere.",
  },
  {
    ...base,
    id: "q_imo6a_45",
    questionId: "IMO6A-Q45",
    topic: "Knowing Our Numbers",
    difficulty: "MEDIUM",
    questionText:
      "Vishu writes the smallest 6-digit number and Ridhi writes the greatest 7-digit number on the blackboard. Their Maths teacher finds the difference between the smallest 4-digit number and the sum of the two numbers written on the board. What would be the answer?",
    multipleChoiceConfig: {
      options: [
        { id: "A", text: "10099999" },
        { id: "B", text: "10098999" },
        { id: "C", text: "19999890" },
        { id: "D", text: "10069998" },
      ],
      correctOptionId: "B",
      layout: "list",
    },
    customConfig: {
      activity: "blackboard-builder",
      writers: [
        { id: "vishu", label: "Vishu", digits: 6, extreme: "smallest" },
        { id: "ridhi", label: "Ridhi", digits: 7, extreme: "greatest" },
      ],
      teacher: { subtrahend: { digits: 4, extreme: "smallest" }, operation: "sum-minus" },
    },
    explanation:
      "Build each number on the blackboard by setting its digit count and choosing the smallest or greatest value. The teacher's panel then does the arithmetic.",
  },
];
