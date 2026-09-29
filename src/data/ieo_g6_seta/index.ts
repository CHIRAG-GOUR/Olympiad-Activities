import { Question } from "@/types/question";
import { Exam } from "@/types/exam";

/**
 * SOF International English Olympiad (IEO) · Class 6 · Question Paper Set A
 *
 * 50 Questions across 5 Sections:
 *   - Section 1: Word & Structure Knowledge: Q1–Q24 (1 mark each)
 *   - Section 2: Vocabulary: Q25–Q30 (1 mark each)
 *   - Section 3: Reading Comprehension: Q31–Q40 (1 mark each)
 *       • Q31–Q35: Dream House Passage
 *       • Q36–Q40: Casey & Margaret Passage
 *   - Section 4: Spoken & Written Expression: Q41–Q45 (1 mark each)
 *   - Section 5: Achievers Section: Q46–Q50 (3 marks each)
 * Total: 60 Marks
 */

// Answer key. It follows "Answer key VI IEO - 2" except where that key is not good English or does
// not fit the paper's passage: Q2=B ("due to not having"), Q7=C, Q10=B, Q17=B ("jump in"),
// Q31=B ("Ideal Home"), Q43=D ("I must finish"). Q12, Q36, Q39, Q40 and Q41 follow the official key.
export const IEO_G6_SETA_KEY = [
  "A", "B", "D", "B", "A", "D", "C", "B", "C", "B", // Q01–Q10
  "A", "A", "C", "C", "A", "C", "B", "B", "C", "A", // Q11–Q20
  "D", "B", "A", "C", "A", "C", "B", "D", "A", "D", // Q21–Q30
  "B", "A", "D", "C", "A", "A", "B", "D", "C", "A", // Q31–Q40
  "C", "C", "D", "B", "A", "A", "B", "D", "A", "B", // Q41–Q50
];

export const IEO_READING_PASSAGE_DREAM_HOUSE = `
My Dream House

I often think about what my dream house might be like and where it would be. Sometimes I think I want to live somewhere warm, where the sun shines most of the time. Other times I like the seasonal variation that is currently around me. Perhaps, I would be bored if the weather was constantly nice. In whatever climate the house may be in, it should be near the sea as I'd prefer a sea view. Unfortunately, with a sea view comes a sea view price tag, and this is currently well beyond my reach.

If money were no object, I think I would like to live in a castle. However, if you have ever been in a castle, you would know that they are often drafty, with small windows, bad insulation, and a musty smell. I don't like any of these things. So, I would like my castle to be modernised. To take full advantage of the sea view it will need some large, single-pane glass windows. I am quite keen on saving the planet, so they would need to be well fitted and employ some sort of light harvesting technology so that I could use the sun's energy to give power to the building. The castle would need wind turbines, geothermal energy pipes, and/or solar panels.

I love the outdoors and would like to bring an element of that inside. I envisage creating an indoor-outdoor garden within the house with a retractable roof. This means I could enjoy the sun when it's there and close it to keep bad weather away, if I wanted to. Within this garden would be a pond feature that I could swim in. It would not be a conventional pool but perhaps a series of streams and pools as you can see in nature. There would be areas where the current increased in strength, so I could practice swimming against it, or simply be taken along by it, floating through the waves and through my garden. I am not entirely sure of the practicalities of creating such an idyll, but if I could, I would.
`.trim();

export const IEO_READING_PASSAGE_CASEY = `
Casey and Margaret

Casey lived in Baltimore, a big city in the USA. Apparently, the city is very dangerous, but Casey was only young and quite carefree and had not noticed any danger around her. She was fifteen years old and had long, platinum blonde hair. She had once dyed it black for a dare, but it looked very strange and did not suit her, so it did not last long. She had a very comfortable life in a large house in one of the suburbs on the outskirts of the city. It was a large building with a good-sized garden. The outside of the house was covered in ivy and had a swinging bench on the veranda that Casey liked to sit on during hot summer days.

Although Casey enjoyed her life in the city, she did find the summer quite tedious. Many of her friends went off to summer camp so she did not have anyone to hang around with. There was always Margaret next door, she never went anywhere, but Casey and Margaret did not always see eye-to-eye. They just had very different interests, aims and ideas. When they were young, their parents often left them to play together in the back garden and Casey hated this. Margaret was older and bossy, and always wanted to play games that Casey considered boring, like pretending to be doctors and nurses. Casey preferred going on adventures or climbing trees or collecting strange insects that could be found under old dead pieces of wood.

So, when Casey thought about her summer ahead, she decided to plan an adventure. The first step to the success of this would be to get her mother on board. Mothers can be notoriously difficult to sway when it comes to their daughters going on adventures especially if the adventure involved going abroad. Casey really wanted to explore another country, and this was a big part of her planned adventure. She knew her mother had visited many countries, particularly in South America, so Casey decided to plan a trip there and perhaps her mother would find it hard to say no.
`.trim();

type Section =
  | "Word and Structure Knowledge"
  | "Vocabulary"
  | "Reading"
  | "Spoken and Written Expression"
  | "Achievers Section";

const sectionOf = (n: number): Section =>
  n <= 24
    ? "Word and Structure Knowledge"
    : n <= 30
    ? "Vocabulary"
    : n <= 40
    ? "Reading"
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
  const correctOption = IEO_G6_SETA_KEY[n - 1];
  return {
    id: `ieo_g6_seta_q${nn}`,
    questionId: `IEO-G6-SETA-Q${nn}`,
    subjectId: "sub_english",
    subjectName: "English",
    grade: 6,
    section: sectionOf(n),
    chapter: sectionOf(n),
    topic,
    difficulty: n > 45 ? "ACHIEVER" : n > 24 ? "MEDIUM" : "EASY",
    questionType: "MULTIPLE_CHOICE",
    questionText,
    marks: n > 45 ? 3 : 1,
    negativeMarks: 0,
    version: 2,
    status: "Published",
    createdAt: "2026-09-28T00:00:00Z",
    updatedAt: "2026-09-29T12:00:00Z",
    multipleChoiceConfig: {
      options: (["A", "B", "C", "D"] as const).map((id, i) => ({ id, text: options[i] })),
      correctOptionId: correctOption,
      layout: "list",
    },
    customConfig: {
      paper: "SOF IEO Class 6 Set A",
      examId: "ieo-2024-25-class-6-set-a",
      questionNumber: n,
      ...customConfig,
    },
  } as Question;
}

export const IEO_G6_SETA_QUESTIONS: Question[] = [
  // ── Word & Structure Knowledge (Q1–Q24) ──
  q(
    1,
    "Noun Predicates",
    "It's a ______ that there aren't any good pizzerias in this town.",
    ["shame", "shaming", "shamed", "shameful"],
    { answerWord: "shame", category: "Grammar Construction" }
  ),
  q(
    2,
    "Prepositional Phrase & Negation",
    "I couldn't stay any longer due ______ having enough money to pay for the hotel.",
    ["to", "to not", "not to", "not"],
    { answerWord: "to not", category: "Prepositions" }
  ),
  q(
    3,
    "Subject-Verb Agreement",
    "Either Frank or Jane ______ handball really well, but I can never remember who though.",
    ["was played", "play", "playing", "plays"],
    { answerWord: "plays", category: "Subject Verb Agreement" }
  ),
  q(
    4,
    "Present Perfect Experience",
    "Being from a warm southern climate, I ______ snow before, so it is quite a shock.",
    ["was seen", "haven't seen", "saw", "was seeing"],
    { answerWord: "haven't seen", category: "Verb Tenses" }
  ),
  q(
    5,
    "Adverbs of Manner",
    "He ______ put the flowers back in the vase after knocking them over.",
    ["delicately", "delicate", "more delicate", "delicates"],
    { answerWord: "delicately", category: "Adverbs" }
  ),
  q(
    6,
    "Size Descriptors",
    "The ______ size of the insect makes it very difficult to see without a magnifying glass.",
    ["nanometre", "deliberating", "platitude", "minuscule"],
    { answerWord: "minuscule", category: "Vocabulary in Context" }
  ),
  q(
    7,
    "Prepositional Collocations",
    "It will be very difficult to persuade them to do anything ______ the information in this report.",
    ["across", "in", "with", "on"],
    { answerWord: "with", category: "Collocations" }
  ),
  q(
    8,
    "Time Conjunctions",
    "I will be glad ______ this walk is finally over.",
    ["so", "when", "and", "but"],
    { answerWord: "when", category: "Conjunctions" }
  ),
  q(
    9,
    "Present Perfect Aspect",
    "Edward ______ a lot of Italian food, hasn't he?",
    ["will have eaten", "eats", "has eaten", "will eat"],
    { answerWord: "has eaten", category: "Question Tags & Tenses" }
  ),
  q(
    10,
    "Direct Speech Punctuation",
    "“I want to go swimming ______ said Jenny.",
    ["“", ",”", ".”", ":”"],
    { answerWord: ",”", category: "Punctuation" }
  ),
  q(
    11,
    "Degree Adverbs",
    "I don't think that the water is ______ hot for you to swim in today.",
    ["too", "much", "such", "just"],
    { answerWord: "too", category: "Degree Modifiers" }
  ),
  q(
    12,
    "Conditional Clauses",
    "If the bus fare costs more than I thought, I ______ have to walk to the shops.",
    ["will", "would", "will be", "won't"],
    { answerWord: "would", category: "Conditionals" }
  ),
  q(
    13,
    "Relative Pronouns",
    "She's the lady I met yesterday and ______ number I was trying to call just now.",
    ["whom", "who", "whose", "who is"],
    { answerWord: "whose", category: "Pronouns" }
  ),
  q(
    14,
    "Definite Articles",
    "Every time I go to the sales, I forget to take ______ money.",
    ["a", "an", "the", "no article"],
    { answerWord: "the", category: "Articles" }
  ),
  q(
    15,
    "Participles & Aspect",
    "As the wind blew, the clouds started ______, making the sky turn grey.",
    ["gathering", "gathered", "to be gathered", "were gathering"],
    { answerWord: "gathering", category: "Participles" }
  ),
  q(
    16,
    "Past Continuous in Progress",
    "Before the electricity went out, she ______ me a lamp with my homework.",
    ["gives", "has given", "was giving", "is giving"],
    { answerWord: "was giving", category: "Past Continuous" }
  ),
  q(
    17,
    "Idiomatic Phrasal Verbs",
    "I always jump ______ with both feet on tasks that I enjoy.",
    ["on", "in", "up", "at"],
    { answerWord: "in", category: "Idioms & Phrasal Verbs" }
  ),
  q(
    18,
    "Phrasal Prepositions",
    "I have to study all weekend, so I can catch up ______ the work I missed last week.",
    ["to", "on", "at", "around"],
    { answerWord: "on", category: "Phrasal Verbs" }
  ),
  q(
    19,
    "Historical Nouns",
    "I agree that the ______ of some old traditions makes sense today.",
    ["hanging", "brink", "abolition", "shower"],
    { answerWord: "abolition", category: "Vocabulary" }
  ),
  q(
    20,
    "Verb Collocations",
    "It is really difficult to ______ and create something new.",
    ["innovate", "nudge", "simple", "unable"],
    { answerWord: "innovate", category: "Vocabulary" }
  ),
  q(
    21,
    "Evaluative Adjectives",
    "The road up that mountain is ______ because of the dangerous holes in it.",
    ["innocuous", "intrepid", "brave", "notorious"],
    { answerWord: "notorious", category: "Adjectives" }
  ),
  q(
    22,
    "Demographic Nouns",
    "I am not from here originally; my family are ______.",
    ["absurd", "immigrants", "forfeit", "bribed"],
    { answerWord: "immigrants", category: "Nouns" }
  ),
  q(
    23,
    "Error Detection: Possessive",
    "The shops doors closed, and the owner left through the small back door. Choose the part containing the error.",
    ["The shops doors", "closed, and the owner", "left through the small", "back door."],
    { answerWord: "The shops doors", errorPart: "A", category: "Proofreading" }
  ),
  q(
    24,
    "Error Detection: Redundancy",
    "It's taken me a long time to find out for definite exact whose house this is. Choose the part containing the error.",
    ["It's taken me a long time", "to find out", "for definite exact", "whose house this is."],
    { answerWord: "for definite exact", errorPart: "C", category: "Proofreading" }
  ),

  // ── Vocabulary (Q25–Q30) ──
  q(
    25,
    "Synonyms",
    "Choose the correct synonym of Despise.",
    ["Hate", "Like", "Crave", "Devour"],
    { answerWord: "Hate", category: "Synonyms" }
  ),
  q(
    26,
    "Synonyms",
    "Choose the correct synonym of Sanitary.",
    ["Expensive", "Pretty", "Clean", "New"],
    { answerWord: "Clean", category: "Synonyms" }
  ),
  q(
    27,
    "Antonyms",
    "Choose the correct antonym of Peril.",
    ["Beautiful", "Safety", "Upside-down", "Ecstasy"],
    { answerWord: "Safety", category: "Antonyms" }
  ),
  q(
    28,
    "Antonyms",
    "Choose the correct antonym of Lush.",
    ["Ancient", "Fancy", "Enclosed", "Barren"],
    { answerWord: "Barren", category: "Antonyms" }
  ),
  q(
    29,
    "Spelling",
    "What is the spelling of this word that means ‘to be afraid of small spaces’?",
    ["Claustrophobia", "Clostraphobia", "Clostrefobia", "Claustrephobia"],
    { answerWord: "Claustrophobia", category: "Spelling" }
  ),
  q(
    30,
    "Spelling",
    "What is the spelling of the word that means ‘to make things worse’?",
    ["Exsasarbate", "Exceserbate", "Excaserbate", "Exacerbate"],
    { answerWord: "Exacerbate", category: "Spelling" }
  ),

  // ── Reading Comprehension: Dream House (Q31–Q35) ──
  q(
    31,
    "Passage Title",
    "Choose the best title or heading for the passage.\n\n" + IEO_READING_PASSAGE_DREAM_HOUSE,
    ["The House I Live In", "Ideal Home", "A Castle for a King", "Watery Living"],
    { answerWord: "Ideal Home", passageKey: "DREAM_HOUSE" }
  ),
  q(
    32,
    "Passage Detail: Sea View",
    "What is the problem of buying a house with a sea view?\n\n" + IEO_READING_PASSAGE_DREAM_HOUSE,
    ["The cost", "The wind", "The smell", "The windows"],
    { answerWord: "The cost", passageKey: "DREAM_HOUSE" }
  ),
  q(
    33,
    "Passage Detail: Turbines",
    "The writer wants wind turbines for the house to ______.\n\n" + IEO_READING_PASSAGE_DREAM_HOUSE,
    ["save the wind", "make a nice noise", "look like Holland", "protect nature"],
    { answerWord: "protect nature", passageKey: "DREAM_HOUSE" }
  ),
  q(
    34,
    "Passage Detail: Garden",
    "What will the special feature of the garden be?\n\n" + IEO_READING_PASSAGE_DREAM_HOUSE,
    ["The flowers", "The rocks", "The water body", "The trees"],
    { answerWord: "The water body", passageKey: "DREAM_HOUSE" }
  ),
  q(
    35,
    "Vocabulary in Context: Retractable",
    "What does the word ‘retractable’ mean in the third paragraph?\n\n" + IEO_READING_PASSAGE_DREAM_HOUSE,
    ["Something that moves", "Something that is beautiful", "Something that is very expensive", "Something that shines"],
    { answerWord: "Something that moves", passageKey: "DREAM_HOUSE" }
  ),

  // ── Reading Comprehension: Casey & Margaret (Q36–Q40) ──
  q(
    36,
    "Passage Title",
    "Choose the best title or heading for the passage.\n\n" + IEO_READING_PASSAGE_CASEY,
    ["Summer Holidays", "The Biggest House", "My Friend Next Door", "Camping on Holiday"],
    { answerWord: "My Friend Next Door", passageKey: "CASEY" }
  ),
  q(
    37,
    "Passage Detail: Location",
    "Where was Casey's house?\n\n" + IEO_READING_PASSAGE_CASEY,
    ["In the middle of a city", "On the periphery of a city", "In the countryside", "Near a campsite"],
    { answerWord: "On the periphery of a city", passageKey: "CASEY" }
  ),
  q(
    38,
    "Passage Inference: Relationship",
    "Why did Casey not like her next-door neighbour?\n\n" + IEO_READING_PASSAGE_CASEY,
    ["They played difficult games.", "Margaret was too young.", "She always went away.", "They disagreed with each other."],
    { answerWord: "They disagreed with each other.", passageKey: "CASEY" }
  ),
  q(
    39,
    "Passage Detail: Mother",
    "Casey's mother would be difficult to ______.\n\n" + IEO_READING_PASSAGE_CASEY,
    ["ask for the money to travel", "force to South America", "convince about the holiday", "go abroad with"],
    { answerWord: "go abroad with", passageKey: "CASEY" }
  ),
  q(
    40,
    "Vocabulary in Context: Notoriously",
    "What is the meaning of the word ‘notoriously’ in the third paragraph?\n\n" + IEO_READING_PASSAGE_CASEY,
    ["Especially", "Quickly", "Reservedly", "Dangerously"],
    { answerWord: "Dangerously", passageKey: "CASEY" }
  ),

  // ── Spoken & Written Expression (Q41–Q45) ──
  q(
    41,
    "Idiomatic Dialogue",
    "Henry: Can I go to the match with the guys?\nMother: No chance, not a ______ of Sundays.",
    ["week", "year", "month", "millennium"],
    { answerWord: "week", category: "Conversational Idioms" }
  ),
  q(
    42,
    "Expressing Regret",
    "Dimitri: I wish I ______ home earlier last night, I'm so tired today.",
    ["was going", "had been going", "had gone", "have gone"],
    { answerWord: "had gone", category: "Past Regret" }
  ),
  q(
    43,
    "Modal Obligation",
    "Aunty: Can you take this through to the living room?\nNephew: Can I do it in a second? I ______ finish this page first.",
    ["could", "will to", "may be", "must"],
    { answerWord: "must", category: "Modal Verbs" }
  ),
  q(
    44,
    "Conversational Responses",
    "Amanda: How is this possible?\nJune: ______ ask me, I've no idea what you are talking about.",
    ["Please", "Don't", "Can't", "Won't"],
    { answerWord: "Don't", category: "Idiomatic Discourse" }
  ),
  q(
    45,
    "Third Conditional",
    "Eugene: Don't worry about those guys. If they wanted our help they ______ asked.",
    ["would've", "might", "may have", "must"],
    { answerWord: "would've", category: "Counterfactuals" }
  ),

  // ── Achievers Section (Q46–Q50) — 3 Marks Each ──
  q(
    46,
    "Social Discourse Markers",
    "No offence meant to you ______ I don't think you've quite understood what I want.",
    ["but", "so", "when", "because"],
    { answerWord: "but", category: "Achievers Discourse" }
  ),
  q(
    47,
    "Future Continuous Action",
    "This time next week I won't be in class, ______ on a beach relaxing.",
    ["I'd lie", "I'll be lying", "I'll lie", "I'm lying"],
    { answerWord: "I'll be lying", category: "Achievers Future Continuous" }
  ),
  q(
    48,
    "Advanced Antonyms",
    "Choose the correct antonym of the given word: Sinister",
    ["Threatening", "Evil", "Ominous", "Auspicious"],
    { answerWord: "Auspicious", category: "Achievers Vocabulary" }
  ),
  q(
    49,
    "Advanced Synonyms",
    "Choose the correct synonym of the given word: Unilateral",
    ["One-sided", "Open-ended", "Quick-witted", "Down-trodden"],
    { answerWord: "One-sided", category: "Achievers Vocabulary" }
  ),
  q(
    50,
    "Contextual Phrasal Verbs",
    "Felix: I've lost my shoe, so I am having to ______ with bare feet.",
    ["push over", "get by", "have it", "show around"],
    { answerWord: "get by", category: "Achievers Phrasal Verbs" }
  ),
];

export const IEO_G6_SETA_EXAM: Exam = {
  id: "ieo-2024-25-class-6-set-a",
  code: "IEO-G6-2024-SETA",
  title: "SOF IEO Class 6 Set A (2024-25)",
  description:
    "Official International English Olympiad for Class 6 (Set A). 50 immersive interactive 3D activities spanning Word & Structure Knowledge, Vocabulary, Reading Comprehension, Spoken Expression, and the high-yield Achievers Section.",
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
      "This examination contains 50 questions across 5 sections totaling 60 marks.",
      "Section 1–4 questions carry 1 mark each; Achievers Section (Q46–Q50) questions carry 3 marks each.",
      "Every question is solved through interactive 3D manipulation, puzzle assembly, or contextual deduction.",
      "Your interactions directly derive your answer and map it automatically to the official options.",
      "You may review and change your responses anytime before final submission.",
    ],
  },
  status: "Published",
  createdAt: "2026-09-28T00:00:00Z",
  updatedAt: "2026-09-29T12:00:00Z",
  sections: [
    { id: "sec_ieo_word", title: "Word and Structure Knowledge", description: "24 Questions (1 Mark each)", questionIds: IEO_G6_SETA_QUESTIONS.slice(0, 24).map((q) => q.id) },
    { id: "sec_ieo_vocab", title: "Vocabulary", description: "6 Questions (1 Mark each)", questionIds: IEO_G6_SETA_QUESTIONS.slice(24, 30).map((q) => q.id) },
    { id: "sec_ieo_reading", title: "Reading", description: "10 Questions (1 Mark each)", questionIds: IEO_G6_SETA_QUESTIONS.slice(30, 40).map((q) => q.id) },
    { id: "sec_ieo_spoken", title: "Spoken and Written Expression", description: "5 Questions (1 Mark each)", questionIds: IEO_G6_SETA_QUESTIONS.slice(40, 45).map((q) => q.id) },
    { id: "sec_ieo_achievers", title: "Achievers Section", description: "5 Questions (3 Marks each)", questionIds: IEO_G6_SETA_QUESTIONS.slice(45, 50).map((q) => q.id) },
  ],
  questionIds: IEO_G6_SETA_QUESTIONS.map((q) => q.id),
};
