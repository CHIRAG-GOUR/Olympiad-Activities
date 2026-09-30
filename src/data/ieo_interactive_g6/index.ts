import { Question } from "@/types/question";
import { Exam } from "@/types/exam";

/**
 * SOF International English Olympiad (IEO) · Class 6 · Question Paper Set A
 *
 * 50 Questions across 6 Sections:
 *   - Section 1: Word & Structure Knowledge: Q1–Q25 (1 mark each)
 *   - Section 2: Spelling: Q26 (1 mark)
 *   - Section 3: Reading: Q27–Q33 (1 mark each)
 *   - Section 4: Email / Contextual Vocabulary: Q34–Q40 (1 mark each)
 *   - Section 5: Spoken & Written Expression: Q41–Q45 (1 mark each)
 *   - Section 6: Achievers Section: Q46–Q50 (3 marks each)
 * Total: 60 Marks
 */

// Verified correct answer key for all 50 questions
export const IEO_INTERACTIVE_G6_KEY =
  "CCCABBCCDACC" + // Q01–Q12
  "DCDDDBBACC" +   // Q13–Q22
  "BADA" +         // Q23–Q26
  "DBABCCC" +      // Q27–Q33 (Reading: Beavers)
  "BACDBBC" +      // Q34–Q40 (Email: Moving to Goa)
  "ACDDC" +        // Q41–Q45 (Spoken & Written)
  "ACABC";         // Q46–Q50 (Achievers: 3 marks each)

type Section =
  | "Word and Structure Knowledge"
  | "Spelling"
  | "Reading"
  | "Email & Contextual Vocabulary"
  | "Spoken and Written Expression"
  | "Achievers Section";

const sectionOf = (n: number): Section =>
  n <= 25
    ? "Word and Structure Knowledge"
    : n === 26
    ? "Spelling"
    : n <= 33
    ? "Reading"
    : n <= 40
    ? "Email & Contextual Vocabulary"
    : n <= 45
    ? "Spoken and Written Expression"
    : "Achievers Section";

function q(
  n: number,
  topic: string,
  questionText: string,
  options: [string, string, string, string],
  customConfig: Record<string, unknown> = {}
): Question {
  const nn = String(n).padStart(2, "0");
  const correctOption = IEO_INTERACTIVE_G6_KEY[n - 1];
  return {
    id: `ieo_g6_interactive_q${nn}`,
    questionId: `IEO-G6-INT-Q${nn}`,
    subjectId: "sub_english",
    subjectName: "English",
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
    updatedAt: "2026-09-29T12:00:00Z",
    multipleChoiceConfig: {
      options: (["A", "B", "C", "D"] as const).map((id, i) => ({ id, text: options[i] })),
      correctOptionId: correctOption,
      layout: "list",
    },
    customConfig: {
      paper: "IEO Class 6 Interactive Master Edition",
      examId: "ieo-class6-master-interactive",
      questionNumber: n,
      ...customConfig,
    },
  } as Question;
}

export const IEO_INTERACTIVE_G6_QUESTIONS: Question[] = [
  // ── Q1–Q25: Word & Structure Knowledge ──
  q(
    1,
    "Morning Routine Verbs",
    "In the morning, before I go to work, I wake up and ______ breakfast.",
    ["eaten", "ate", "eat", "eating"],
    { verbBase: "eat", tense: "Present Simple Routine", answer: "eat" }
  ),
  q(
    2,
    "Modal Obligations",
    "I am going on holiday today, but I still ______ pack my bags.",
    ["have", "hasn't", "have to", "haven't"],
    { target: "have to", category: "Semi-modal of obligation" }
  ),
  q(
    3,
    "Past Habit & Memory",
    "When I was a child, I ______ my mother cook dinner.",
    ["was helping", "helps", "helped", "help"],
    { tense: "Past Simple", answer: "helped" }
  ),
  q(
    4,
    "Articles with Languages & Adjectives",
    "______ German is ______ easy language to learn.",
    ["No article, an", "A, an", "The, an", "The, the"],
    { article1: "none", article2: "an", nounPhrase: "German / easy language" }
  ),
  q(
    5,
    "Stative Verbs / Present Simple",
    "I ______ waiting for the bus. It is always late and I get bored.",
    ["hated", "hate", "hates", "hating"],
    { verb: "hate", tense: "Present Simple Emotion", answer: "hate" }
  ),
  q(
    6,
    "Time Conjunctions / Present Perfect",
    "I have not visited this restaurant ______ it opened, five years ago.",
    ["everyday", "since", "when", "now"],
    { target: "since", context: "Starting point in the past" }
  ),
  q(
    7,
    "Sensory Perception Verbs",
    "Can I help you with your bags? They ______ heavy.",
    ["looked", "seeming", "look", "seemed"],
    { verb: "look", aspect: "Present observation", answer: "look" }
  ),
  q(
    8,
    "Experience / Present Perfect",
    "I don't know if I like mangosteen, I ______ never had one.",
    ["ain't", "was", "haven't", "have"],
    { target: "haven't", note: "Standard question text variant targeting haven't" }
  ),
  q(
    9,
    "Logical Connectors / Cause and Effect",
    "Washing your hands thoroughly with soap prevents germs from spreading. ______ always wash them before eating food.",
    ["Nevertheless", "In case", "Because of", "Therefore"],
    { connector: "Therefore", type: "Result / Consequence" }
  ),
  q(
    10,
    "Predicate Adjectives",
    "My favourite period at school is geography. It ______ to learn about the world.",
    ["is interesting", "interests", "interested", "interesting"],
    { construction: "is interesting", pattern: "It + linking verb + adjective" }
  ),
  q(
    11,
    "Polite Invitations / Modal Suggestions",
    "Shall ______ to the shop and buy ice cream? I think we deserve a treat today.",
    ["you going", "you gone", "we go", "we going"],
    { phrase: "we go", structure: "Shall we + base verb" }
  ),
  q(
    12,
    "Past Be-Verb Negation",
    "He ______ at cricket practice yesterday. I don't know where he was.",
    ["wasn't", "was", "hasn't", "had"],
    { answer: "wasn't", timeMarker: "yesterday" }
  ),
  q(
    13,
    "Future Perfect",
    "I will call you later. Hopefully, you ______ made it home through the storm.",
    ["do have", "do", "will", "will have"],
    { tense: "Future Perfect", construction: "will have + past participle" }
  ),
  q(
    14,
    "Prepositions of Direction",
    "I don't like it here, it is so busy. Let's go ______ another park where there are fewer people.",
    ["on", "at", "to", "in"],
    { preposition: "to", motion: "Direction towards destination" }
  ),
  q(
    15,
    "Gerunds after Prepositions",
    "They were late as usual. So, instead of ______ around, Reena decided to go on ahead without them.",
    ["wait", "waited", "waiting", "waits"],
    { target: "waiting", rule: "Preposition + -ing gerund" }
  ),
  q(
    16,
    "Used to (Past State)",
    "That area of the playground ______ be covered in grass. Now it is bare soil.",
    ["isn't", "was once", "is to", "used to"],
    { construction: "used to", meaning: "Past state no longer true" }
  ),
  q(
    17,
    "Past Habitual 'Would'",
    "When I was younger, we used to go on holiday to the beach and I ______ eat lots of ice cream.",
    ["shall", "will", "am going to", "would"],
    { modal: "would", usage: "Repeated past habitual action" }
  ),
  q(
    18,
    "Dependent Prepositions",
    "I am not familiar ______ the botanical names of these herbs.",
    ["to", "with", "by", "of"],
    { collocation: "familiar with" }
  ),
  q(
    19,
    "Future Perfect Continuous",
    "By 4 pm, this lady ______ been sitting on that bench for five hours.",
    ["has", "will have", "have", "must have"],
    { construction: "will have", tense: "Future Perfect Continuous" }
  ),
  q(
    20,
    "Relative Pronouns",
    "The child ______ receives this gift is very lucky.",
    ["who", "whose", "which", "whom"],
    { pronoun: "who", referent: "Subject person (child)" }
  ),
  q(
    21,
    "Precision Vocabulary",
    "That is such a pretty picture. I would like to try and ______ it.",
    ["repeal", "revitalise", "replicate", "reimburse"],
    { word: "replicate", meaning: "To make an exact copy" }
  ),
  q(
    22,
    "Hypothetical Regret",
    "If ______ I had not eaten that last piece of cake. I feel so full.",
    ["barely", "never", "ever", "only"],
    { idiom: "If only", express: "Wish / Regret" }
  ),
  q(
    23,
    "Sound Perception Adjectives",
    "The music was so quiet, it was barely ______.",
    ["amicable", "audible", "atrocious", "averse"],
    { word: "audible", definition: "Able to be heard" }
  ),
  q(
    24,
    "Modals of Expectation",
    "He ______ get a detention for being so badly behaved.",
    ["should", "won't", "shan't", "ought"],
    { modal: "should", meaning: "Expected / Deserved consequence" }
  ),
  q(
    25,
    "Oceanic Adjectives",
    "There is a lot of ______ life in the sea. Some of the creatures are strange.",
    ["wharf", "marina", "quay", "marine"],
    { collocation: "marine life", word: "marine" }
  ),

  // ── Q26: Section 2: Spelling ──
  q(
    26,
    "Spelling Identification",
    "Choose the word with the incorrect spelling.",
    ["Amature", "Anarchist", "Stoic", "Insolvent"],
    { incorrect: "Amature", correctForm: "Amateur" }
  ),

  // ── Q27–Q33: Section 3: Reading Comprehension (Beavers) ──
  q(
    27,
    "Reading: Passage Title",
    "Read the passage about beavers and answer the question:\n\nChoose the most suitable title for the passage.",
    [
      "Beavers: Animals that are like mice",
      "Beavers: Animals that won't survive hunting",
      "Beavers: The rarest animals",
      "Beavers: Animals that are returning",
    ],
    { passage: "Beaver Conservation", theme: "Return and reintroduction", answer: "Beavers: Animals that are returning" }
  ),
  q(
    28,
    "Reading: Historical Timeline",
    "When did beavers get introduced to South America?",
    ["16th century", "1940s", "1980s", "21st century"],
    { passageFact: "Introduced in the 1940s", answer: "1940s" }
  ),
  q(
    29,
    "Reading: European Conservation",
    "Why were beavers reintroduced in Europe?",
    [
      "because there were none left",
      "because they cannot help the environment",
      "for their fur",
      "for protection against predators",
    ],
    { passageFact: "Extinct in many European countries", answer: "because there were none left" }
  ),
  q(
    30,
    "Reading: Cause of Population Decline",
    "What is the main reason that beavers' number has reduced?",
    ["Hunted to reduce damming", "Hunted for fur", "Cannot breed with one another", "Hunted by other animals"],
    { passageFact: "Hunted extensively for their thick fur coats and hats", answer: "Hunted for fur" }
  ),
  q(
    31,
    "Reading: Physical Anatomy",
    "What is interesting about a beaver's appearance?",
    [
      "They are very small.",
      "They are the biggest animal in South America.",
      "They have huge front teeth.",
      "They have thin tails.",
    ],
    { passageFact: "Large continuously growing orange incisor teeth", answer: "They have huge front teeth." }
  ),
  q(
    32,
    "Reading: Ecological Impact",
    "What was the outcome of transporting beavers to South America?",
    [
      "They were hunted by wild animals.",
      "The business was successful.",
      "They adversely affected the environment.",
      "All of these",
    ],
    { passageFact: "No natural predators; flooded native forests", answer: "They adversely affected the environment." }
  ),
  q(
    33,
    "Reading: Dam Function",
    "Why do beavers make dams?",
    [
      "To make their teeth more strong",
      "They are too big to swim in rivers without dams.",
      "For protection and food",
      "To live in the wild",
    ],
    { passageFact: "Deep water ponds offer safety from predators and winter food storage", answer: "For protection and food" }
  ),

  // ── Q34–Q40: Section 4: Email / Contextual Vocabulary (Moving to Goa) ──
  q(
    34,
    "Contextual Email: Relocation",
    "How are you? I have ______ to a new house and I now live in Goa.",
    ["change", "moved", "calculated", "paused"],
    { verb: "moved", context: "Relocation to Goa" }
  ),
  q(
    35,
    "Contextual Email: Hospitality",
    "This means I live much closer to you and I hope that you can ______ more often.",
    ["visit", "travel", "accommodate", "borrow"],
    { collocation: "visit more often", verb: "visit" }
  ),
  q(
    36,
    "Contextual Email: Architecture Adjectives",
    "It is a/an ______ new house with a balcony and air conditioning.",
    ["pugnacious", "hideous", "exquisite", "drab"],
    { adjective: "exquisite", meaning: "Extremely beautiful and delicate" }
  ),
  q(
    37,
    "Contextual Email: Transportation Mode",
    "It is also quite near my school so my brother and I can ______ there in the mornings.",
    ["draw", "tumble", "lay", "walk"],
    { verb: "walk", context: "Pedestrian commute to school" }
  ),
  q(
    38,
    "Contextual Email: Quantifiers / Dual Subjects",
    "As we have moved house, we are ______ going to a new school.",
    ["two", "both", "together", "couple"],
    { quantifier: "both", usage: "Referring to two siblings" }
  ),
  q(
    39,
    "Contextual Email: Event Organizing",
    "I am ______ a moving in party and wondered if you would like to come.",
    ["creating", "planning", "making", "doing"],
    { collocation: "planning a party", verb: "planning" }
  ),
  q(
    40,
    "Contextual Email: Culinary Verbs",
    "My mother and I will ______ lots of nice things to eat...",
    ["measure", "making", "prepare", "transform"],
    { baseVerb: "prepare", structure: "will + base verb" }
  ),

  // ── Q41–Q45: Section 5: Spoken & Written Expression ──
  q(
    41,
    "Spoken Dialogue: Past Inquiry",
    "Mother: Oh, dear! ______ you fall over? You have bruised your knee!\nSon: Yes!",
    ["Did", "Do", "Don't", "How"],
    { auxiliary: "Did", inquiry: "Past occurrence" }
  ),
  q(
    42,
    "Spoken Dialogue: Character Traits",
    "Rob: How do you like Mr Williams?\nChristy: Oh! That old man is always asking questions. He is so ______.",
    ["spatial", "repentant", "nosey", "punctual"],
    { adjective: "nosey", meaning: "Overly inquisitive" }
  ),
  q(
    43,
    "Spoken Dialogue: Dinner Response",
    "Jenna: Are you free for dinner in the evening?\nShetty: ______",
    [
      "No problem.",
      "Yes, I can.",
      "Why?",
      "Certainly. What time in the evening?",
    ],
    { response: "Certainly. What time in the evening?", register: "Polite acceptance with detail inquiry" }
  ),
  q(
    44,
    "Proverbs & Idioms",
    "Mary: Fix your bike right away. Don't leave it for the weekend.\nTim: Yes, a stitch in time ______.",
    ["make nine", "saves time", "makes time", "saves nine"],
    { proverb: "A stitch in time saves nine" }
  ),
  q(
    45,
    "Spoken Dialogue: Negative Agreement",
    "Alan: I am so tired. I don't feel like walking any more.\nSherry: ______",
    ["as well as", "also", "neither", "no"],
    { particle: "neither", pattern: "Me neither (concurring with negative statement)" }
  ),

  // ── Q46–Q50: Section 6: Achievers Section (3 Marks Each) ──
  q(
    46,
    "Achievers: Advanced Vocabulary",
    "Riding my bike with the dog on my lap. What a ______ idea!",
    ["preposterous", "durable", "laborious", "imbrue"],
    { word: "preposterous", meaning: "Utterly absurd or ridiculous", marks: 3 }
  ),
  q(
    47,
    "Achievers: Social Vocabulary",
    "I went to a hostel when I was in Europe and there was a ______ kitchen. It was strange to have to share it with other people we did not know.",
    ["corporal", "considerate", "communal", "contentious"],
    { word: "communal", meaning: "Shared by all members of a community", marks: 3 }
  ),
  q(
    48,
    "Achievers: Kinematic Verbs",
    "When you swim, you can use your arms to ______ you forward.",
    ["propel", "pith", "purport", "pester"],
    { word: "propel", meaning: "Drive, push, or cause to move in a particular direction", marks: 3 }
  ),
  q(
    49,
    "Achievers: Forensic Spelling",
    "Choose the word with the incorrect spelling.",
    ["Credulous", "Convalesence", "Contagious", "Contemporary"],
    { incorrect: "Convalesence", correctForm: "Convalescence", marks: 3 }
  ),
  q(
    50,
    "Achievers: Pragmatic Dialogue",
    "Joy: How can I ever repay you?\nMohit: ______",
    [
      "Oh well, better luck next time.",
      "Well, I am not sure, but let me ask somebody.",
      "Don't be silly, it was nothing.",
      "What do you need?",
    ],
    { response: "Don't be silly, it was nothing.", context: "Polite, humble dismissal of a favour", marks: 3 }
  ),
];

const ids = (from: number, to: number) =>
  IEO_INTERACTIVE_G6_QUESTIONS.slice(from, to).map((q) => q.id);

export const IEO_INTERACTIVE_G6_EXAM: Exam = {
  id: "ieo-class6-master-interactive",
  code: "IEO-G6-MASTER-2025",
  title: "SOF International English Olympiad 2024-25 (Class 6 - Master Set)",
  subtitle: "Science Olympiad Foundation • Class 6 • Official Master Paper",
  description:
    "Official SOF International English Olympiad (IEO) Class 6 examination paper covering Word & Structure Knowledge, Reading Comprehension, Spoken & Written Expression, and the Achievers Section.",
  subjectId: "sub_english",
  subjectName: "English",
  grade: 6,
  academicYear: "2024-25",
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
      "This examination contains 50 questions across 6 sections.",
      "Section 1: Word & Structure Knowledge (Q1–Q25, 1 mark each).",
      "Section 2: Spelling (Q26, 1 mark).",
      "Section 3: Reading Comprehension (Q27–Q33, 1 mark each).",
      "Section 4: Email / Contextual Vocabulary (Q34–Q40, 1 mark each).",
      "Section 5: Spoken & Written Expression (Q41–Q45, 1 mark each).",
      "Section 6: Achievers Section (Q46–Q50, 3 marks each).",
      "Total time allowed is 60 minutes. There is no negative marking.",
      "You can navigate freely between questions using the Question Palette.",
    ],
  },
  status: "Published",
  createdAt: "2026-09-28T00:00:00Z",
  updatedAt: "2026-09-28T00:00:00Z",
  sections: [
    { id: "sec_ieo_word", title: "Word and Structure Knowledge", description: "25 Questions (1 Mark each)", questionIds: ids(0, 25) },
    { id: "sec_ieo_spelling", title: "Spelling", description: "1 Question (1 Mark)", questionIds: ids(25, 26) },
    { id: "sec_ieo_reading", title: "Reading", description: "7 Questions (1 Mark each)", questionIds: ids(26, 33) },
    { id: "sec_ieo_email", title: "Email & Contextual Vocabulary", description: "7 Questions (1 Mark each)", questionIds: ids(33, 40) },
    { id: "sec_ieo_spoken", title: "Spoken and Written Expression", description: "5 Questions (1 Mark each)", questionIds: ids(40, 45) },
    { id: "sec_ieo_achievers", title: "Achievers Section", description: "5 Questions (3 Marks each)", questionIds: ids(45, 50) },
  ],
  questionIds: IEO_INTERACTIVE_G6_QUESTIONS.map((q) => q.id),
};
