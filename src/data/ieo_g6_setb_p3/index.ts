import { Question } from "@/types/question";
import { Exam } from "@/types/exam";

/**
 * SOF International English Olympiad 2019-20 · Class 6 · Question Paper Set B ("Paper 3").
 *
 * Transcribed from "Question Paper VI IEO - 3.pdf"; the key is "Answer key VI IEO - 3.pdf".
 *
 *   Word and Structure Knowledge  Q1–Q30  (1 mark each)
 *   Reading                       Q31–Q40 (1 mark each; two passages)
 *   Spoken and Written Expression Q41–Q45 (1 mark each)
 *   Achievers Section             Q46–Q50 (3 marks each)
 *   Total: 60 marks, 1 hour.
 */

export const IEO_G6_SETB_P3_KEY = [
  "B", "A", "C", "D", "C", "A", "B", "C", "A", "A", // Q01–Q10
  "A", "A", "A", "C", "C", "A", "C", "B", "B", "A", // Q11–Q20
  "C", "B", "C", "C", "D", "C", "D", "D", "B", "D", // Q21–Q30
  "C", "B", "A", "D", "C", "B", "D", "B", "A", "D", // Q31–Q40
  "C", "A", "A", "D", "B", "D", "A", "C", "B", "D", // Q41–Q50
];

/**
 * Where the official key and the question need a second look. The key is kept exactly as
 * printed (it is what the exam scores); these notes travel with the question so the
 * question bank, the reports and the review screens can show them.
 */
export type AnswerAudit = {
  sourceAnswer: string;
  semanticValidation: "VALID" | "VALID_WITH_NOTE" | "REVIEW_REQUIRED";
  reason: string;
};

const AUDIT: Record<number, Omit<AnswerAudit, "sourceAnswer">> = {
  11: {
    semanticValidation: "REVIEW_REQUIRED",
    reason:
      "The key gives A \"have\", but \"I have take the car to work\" is not grammatical; the natural completion is \"have to\" / \"will have to\", which is not printed. Kept as A because that is the official key.",
  },
  23: {
    semanticValidation: "VALID",
    reason:
      "The error is in part C, \"the tiniest mouses'\" — the plural of mouse is mice. The official key says C (an earlier brief said D; the printed key is followed).",
  },
  28: {
    semanticValidation: "VALID_WITH_NOTE",
    reason:
      "Q28 is in the antonym section. \"Mesh\" as a verb means to fit together or get on well; \"spat\" is a petty quarrel, so D works as an antonym, though the pairing is loose. None of the options is a synonym.",
  },
  42: {
    semanticValidation: "REVIEW_REQUIRED",
    reason:
      "The key gives A \"should have\", but after \"I wish I …\" standard English uses the past perfect: \"I wish I had eaten breakfast\" (option C). Kept as A because that is the official key.",
  },
  44: {
    semanticValidation: "VALID",
    reason: "\"I wouldn't think so. It looks small\" — the official key D fits the reply (an earlier brief said C \"will\"; the printed key is followed).",
  },
  47: {
    semanticValidation: "VALID",
    reason: "\"Come the summer, I'll have had a lot to work on\" (future perfect) — the official key A (an earlier brief said D; the printed key is followed).",
  },
};

/** The paper prints both passages without a title (a title would give away Q31 and Q36). */
export const IEO_SETB_P3_PASSAGE_WORRY = `
This is how every brain works. It thinks over worst-case scenarios, like an anxious new parent. It's just trying to keep us safe and usually does a great job at it. That same vigilant hardwiring also makes it too easy to worry about the wrong things. It clouds our thinking with fear of outcomes that will never come to pass. Learning how to better separate the good worry, which protects us, from the useless worry, which harms us, is a vital life skill.

Consider the following simple exercise to increase your insight into how much you worry needlessly. It's an experiment I did for years with the goal of better identifying and reducing my "rocking chair" fretting while better harnessing the useful kind of worry.

Begin by writing down all the major things you're currently worried about. It's not pleasant to ruminate on them, but the fact is that your brain is constantly thinking about them anyway. Just because a worry is subconscious doesn't shield you from its negative effects.

I suggest two rules for making the list. First, try to make the time frame for whether they will happen within just six months. That limits you to concrete and quantifiable worries. Limit your worries to those outcomes resolved in the next 180 days.

Second, keep the number at 10. If you have more than that, pick the biggest ones. If you have fewer than 10, good for you, but challenge yourself to go deeper and find other worries of which you may be less aware.

Some of your 10 worries will be big, others small or even trivial. Some you may feel you have no control over while some you do. Don't worry about their seriousness or ranking them; just capture what's causing you any anticipatory fear. By clearing your mind of needless worry, you can home in on the real concerns you might be able to stop. And even if you can't stop them, there's value in occupying your mind with action over fear.
`.trim();

export const IEO_SETB_P3_PASSAGE_SUGAR = `
If you've read about the latest health trends, you may know that sugar is being listed as a major contributor to how overweight and unhealthy some people are. If you know people who have considered juicing, fasting or cleansing in an effort to lose weight or improve their well-being, you're probably aware that cutting out foods is not effective as a long-term lifestyle approach to healthy eating.

There is one kind of diet that is worthwhile, according to some experts, reducing sugar in your diet can help you drop pounds, improve your health and even give you more beautiful, radiant skin.

"Early on in my practice, when I would notice that people had real addiction to sugar, we'd start trying to wean them of sugar or limit their intake or eat in moderation, but the word 'moderation' it never worked," food expert Alpert said.

"What was so successful in getting my clients to kick their sugar habit was to go cold turkey which means to totally cut out sugars. When they did, I wasn't their favourite person, but the number one positive effect was that it recalibrated their palate," she said.

For the duration of the three day sugar detox, Alpert recommends no added sugars, but also no fruits, no starchy vegetables (such as corn, peas, sweet potatoes and butternut squash), no dairy, no grains and no alcohol. "You're basically eating protein, vegetables and healthy fats."

For example, breakfast can include three eggs, any style; lunch can include up to 6 ounces of poultry, fish or tofu and a green salad, and dinner is basically a larger version of lunch, though steamed vegetables, such as broccoli, kale and spinach can be eaten in place of salad. Snacks include a handful of nuts and sliced peppers with hummus. Beverages include water, unsweetened tea and black coffee.

Though they don't contribute calories, artificial sweeteners are not allowed on the plan, either. "These little pretty colored packets pack such a punch of sweetness, and that's how our palates get dulled and immune and less reactive to what sweetness really is," Alpert said. It now seems that consuming artificial sweeteners causes people not only to store more fat, they also end up overeating later on to compensate for the increased energy storage.
`.trim();

type Section = "Word and Structure Knowledge" | "Reading" | "Spoken and Written Expression" | "Achievers Section";

const sectionOf = (n: number): Section =>
  n <= 30 ? "Word and Structure Knowledge" : n <= 40 ? "Reading" : n <= 45 ? "Spoken and Written Expression" : "Achievers Section";

/** The activity engine each question is built on (see ieo_g6_setb_p3-play/lab.tsx). */
export type LabEngine =
  | "WordAssemblyEngine"
  | "GrammarSimulationEngine"
  | "PunctuationEngine"
  | "ErrorRepairEngine"
  | "SpellingEngine"
  | "TimelineEngine"
  | "ReadingInvestigationEngine"
  | "VocabularyEngine"
  | "ConnectorEngine"
  | "AchieverPuzzleEngine";

function q(
  n: number,
  topic: string,
  engine: LabEngine,
  questionText: string,
  options: [string, string, string, string],
  extra: Record<string, unknown> = {}
): Question {
  const nn = String(n).padStart(2, "0");
  const correctOption = IEO_G6_SETB_P3_KEY[n - 1];
  const audit = AUDIT[n];
  return {
    id: `ieo_g6_setb_p3_q${nn}`,
    questionId: `IEO-G6-SETB-P3-Q${nn}`,
    subjectId: "sub_english",
    subjectName: "English",
    grade: 6,
    section: sectionOf(n),
    chapter: sectionOf(n),
    topic,
    difficulty: n > 45 ? "ACHIEVER" : n > 30 ? "MEDIUM" : "EASY",
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
      correctOptionId: correctOption,
      layout: "list",
    },
    customConfig: {
      paper: "SOF IEO 2019-20 Class 6 Set B",
      examId: IEO_G6_SETB_P3_EXAM_ID,
      questionNumber: n,
      engine,
      ...(audit ? { answerAudit: { sourceAnswer: correctOption, ...audit } satisfies AnswerAudit } : {}),
      ...extra,
    },
  } as Question;
}

export const IEO_G6_SETB_P3_EXAM_ID = "ieo-2019-20-class-6-set-b";

const FILL = "Choose the correct option to fill in the blank.";
const ERR = "Choose the part of the sentence that has an error.";
const SYN = "Choose the correct synonym of the given word.";
const ANT = "Choose the correct antonym of the given word.";
const SPELL = "Choose the option with correct spelling.";
const CONV = "Choose the most suitable option to complete the conversation.";

export const IEO_G6_SETB_P3_QUESTIONS: Question[] = [
  // ── Word and Structure Knowledge: fill in the blank (Q1–Q22) ──
  q(1, "Verb Phrases", "WordAssemblyEngine", "The referee seemed to ______, but she did eventually make a decision.", ["have surety", "be unsure", "have not", "create it"], { instruction: FILL }),
  q(2, "Present Simple (general truths)", "GrammarSimulationEngine", "Remember, rain always ______ from the sky downwards, not the other way around.", ["falls", "fell", "felled", "falling"], { instruction: FILL }),
  q(3, "Present Perfect", "WordAssemblyEngine", "Although I was born in Italy, ______ tasted pasta this good in my life.", ["never", "I will never", "I've never", "never did"], { instruction: FILL }),
  q(4, "Word Formation", "WordAssemblyEngine", "This is not really ______ of how we usually perform, I'm sorry.", ["indicate", "indicatively", "indications", "indicative"], { instruction: FILL }),
  q(5, "Adjectives", "VocabularyEngine", "As the whale is so ______, it is clearly visible without binoculars.", ["magnetic", "multiple", "massive", "disgruntled"], { instruction: FILL }),
  q(6, "Prefixes", "GrammarSimulationEngine", "The employees did not receive a bonus because they were all ______ performing.", ["under", "over", "within", "inside"], { instruction: FILL }),
  q(7, "Prepositional Phrases", "ConnectorEngine", "I think this trouble is ______ account of the problems with graffiti at school.", ["in", "on", "at", "with"], { instruction: FILL }),
  q(8, "Past Simple", "WordAssemblyEngine", "I bet it's my little sister who ______ all my cold water from the fridge.", ["finishing", "will have drink", "finished", "drink"], { instruction: FILL }),
  q(9, "Punctuation in Speech", "PunctuationEngine", "\"Do you know the answer ______ asked the teacher.", ["?\"", "!\"", "?.", "\"."], { instruction: FILL }),
  q(10, "Adverbial Phrases", "WordAssemblyEngine", "If you and Katy are going to the party, I'm going ______.", ["as well", "as if", "into", "through"], { instruction: FILL }),
  q(11, "Modal Verbs", "GrammarSimulationEngine", "If the train is cancelled in the morning, I ______ take the car to work.", ["have", "won't to", "will have", "could"], { instruction: FILL }),
  q(12, "Linking Words", "ConnectorEngine", "The house named 'The Old Mill' used to be a working mill, ______ the name.", ["hence", "too", "although", "there is"], { instruction: FILL }),
  q(13, "Determiners", "GrammarSimulationEngine", "I always cry at weddings and I never have ______ tissue on hand.", ["some", "a", "the", "an"], { instruction: FILL }),
  q(14, "Gerunds", "WordAssemblyEngine", "The picnic was lovely, however, we couldn't help ______ crumbs all over the grass.", ["scattered", "were scattered", "scattering", "to be scatter"], { instruction: FILL }),
  q(15, "Past Simple", "WordAssemblyEngine", "Prior to attending nursery yesterday, he ______ in his room with his toy train.", ["was played", "plays", "played", "to play"], { instruction: FILL }),
  q(16, "Idioms", "ConnectorEngine", "When I met my new puppy, I fell head ______ heels because he is just so cute.", ["over", "under", "down", "in"], { instruction: FILL }),
  q(17, "Idioms", "TimelineEngine", "I will be working ______ the clock to cram all my revision in.", ["over", "about", "around", "on"], { instruction: FILL }),
  q(18, "Nouns", "VocabularyEngine", "I hope that I never get to see the ______ of elephants during my lifetime.", ["destroy", "extinction", "reality", "flavour"], { instruction: FILL }),
  q(19, "Reflexive Verb Phrases", "WordAssemblyEngine", "When moving to the city, I had to make a real effort to ______ myself.", ["put up", "establish", "ask", "allow"], { instruction: FILL }),
  q(20, "Adjectives", "VocabularyEngine", "The way the children behaved was ______, especially in front of the visitors.", ["despicable", "shrivelled", "shallows", "particular"], { instruction: FILL }),
  q(21, "Verbs", "VocabularyEngine", "In the summer, the swallow ______ from Africa to Europe.", ["dissipates", "move", "migrates", "reapproves"], { instruction: FILL }),
  q(22, "Adverbs", "WordAssemblyEngine", "These papers need to be taken ______ to the headmaster's office.", ["security", "securely", "secure", "secured"], { instruction: FILL }),

  // ── Spot the error (Q23–Q24) ──
  q(23, "Plural Nouns", "ErrorRepairEngine", "The house is so quiet that even the tiniest mouses' can be heard.", ["The house is so", "quiet that even", "the tiniest mouses'", "can be heard."], { instruction: ERR }),
  q(24, "Possessive Nouns", "ErrorRepairEngine", "There is absolutely no way of differentiating one of my friend twin of the other one.", ["There is absolutely", "no way of differentiating", "one of my friend twin of", "the other one."], { instruction: ERR }),

  // ── Synonyms, antonyms, spelling (Q25–Q30) ──
  q(25, "Synonyms", "VocabularyEngine", "Fledgling", ["Employee", "Manager", "Supervisor", "Apprentice"], { instruction: SYN, givenWord: "Fledgling", relation: "synonym" }),
  q(26, "Synonyms", "VocabularyEngine", "Increment", ["Deduction", "Cessation", "Accrual", "Drive"], { instruction: SYN, givenWord: "Increment", relation: "synonym" }),
  q(27, "Antonyms", "VocabularyEngine", "Parochial", ["Sinusoidal", "Elementary", "Reformed", "Liberal"], { instruction: ANT, givenWord: "Parochial", relation: "antonym" }),
  q(28, "Antonyms", "VocabularyEngine", "Mesh", ["Line", "Court", "Ball", "Spat"], { instruction: ANT, givenWord: "Mesh", relation: "antonym" }),
  q(29, "Spelling", "SpellingEngine", "What is the spelling of this adjective that means mistake?", ["Mesmaner", "Misnomer", "Mosmimer", "Monsimer"], { instruction: SPELL }),
  q(30, "Spelling", "SpellingEngine", "What is the spelling of the word that means enduring?", ["Priannual", "Periannual", "Peranneal", "Perennial"], { instruction: SPELL }),

  // ── Reading: needless worry (Q31–Q35) ──
  q(31, "Main Idea", "ReadingInvestigationEngine", "Choose the best title or heading for the passage.", ["Worrying Makes Me Feel Alive", "Worrying is Always Good", "No Need to Worry", "Why No Worry At All?"], { passage: IEO_SETB_P3_PASSAGE_WORRY }),
  q(32, "Inference", "ReadingInvestigationEngine", "Why do people worry about things?", ["They feel they must not worry.", "It's part of nature.", "Worrying gets things done.", "They have a lot of skills."], { passage: IEO_SETB_P3_PASSAGE_WORRY }),
  q(33, "Detail", "ReadingInvestigationEngine", "The writer wants people to ______.", ["list their worries", "stop worrying", "ignore their worries", "make changes to their lives"], { passage: IEO_SETB_P3_PASSAGE_WORRY }),
  q(34, "Detail", "TimelineEngine", "How long should people look ahead?", ["10 days", "180 weeks", "1 day", "6 months"], { passage: IEO_SETB_P3_PASSAGE_WORRY }),
  q(35, "Vocabulary in Context", "ReadingInvestigationEngine", "What does the phrase 'home in on' mean in the last paragraph?", ["Ignore", "Revise", "Focus", "Fear"], { passage: IEO_SETB_P3_PASSAGE_WORRY }),

  // ── Reading: cutting out sugar (Q36–Q40) ──
  q(36, "Main Idea", "ReadingInvestigationEngine", "Choose the best title or heading for the passage.", ["Fruit is the Answer", "No More Sweets", "Some Sugar is Good for You", "How to Eat Sugar Well"], { passage: IEO_SETB_P3_PASSAGE_SUGAR }),
  q(37, "Detail", "ReadingInvestigationEngine", "What benefit is there from not eating sugar?", ["Less money waste", "Better breathing", "Better teeth", "Better skin"], { passage: IEO_SETB_P3_PASSAGE_SUGAR }),
  q(38, "Detail", "TimelineEngine", "How long does the 'detox' last?", ["Whole life", "3 days", "Breakfast, lunch and dinner", "A week"], { passage: IEO_SETB_P3_PASSAGE_SUGAR }),
  q(39, "Cause and Effect", "ReadingInvestigationEngine", "Artificial sweeteners are generally bad because they ______.", ["make people hungrier", "add a bad taste", "don't taste very nice", "can only be used in hot drinks"], { passage: IEO_SETB_P3_PASSAGE_SUGAR }),
  q(40, "Vocabulary in Context", "ReadingInvestigationEngine", "What is the meaning of the word 'compensate' in the last paragraph?", ["To reinvent something", "Move away from doing something", "Help with balancing a diet", "Make up for"], { passage: IEO_SETB_P3_PASSAGE_SUGAR }),

  // ── Spoken and Written Expression (Q41–Q45) ──
  q(41, "Idioms in Conversation", "VocabularyEngine", "Mike: Did you get a quote from Jimmy for the building works?\nBill: Yeah, but I've heard he's really bad for cutting ______.", ["paper", "hair", "corners", "nails"], { instruction: CONV }),
  q(42, "Wishes and Regrets", "WordAssemblyEngine", "Bella: I wish I ______ eaten breakfast this morning, I'm so hungry now.", ["should have", "have", "had", "will have"], { instruction: CONV }),
  q(43, "Adverbs in Conversation", "GrammarSimulationEngine", "Mother: Have you tidied your room yet?\nDaughter: I have started, I ______ have the hoovering to do then I'm finished.", ["just", "must", "could", "please"], { instruction: CONV }),
  q(44, "Responses", "GrammarSimulationEngine", "Alice: Do you think this baking tin is big enough for our cake?\nSuzi: I ______ think so. It looks small and it has to feed 12 people.", ["will have", "haven't", "will", "wouldn't"], { instruction: CONV }),
  q(45, "Modal Perfect", "WordAssemblyEngine", "Sally: If you needed to know my name then you ______ asked me yesterday, when you had the chance.", ["will", "should've", "should", "maybe"], { instruction: CONV }),

  // ── Achievers Section (Q46–Q50) ──
  q(46, "Concessive Prepositions", "AchieverPuzzleEngine", "There is something we can do ______ all the difficulties.", ["have", "within", "because", "despite"], { instruction: FILL }),
  q(47, "Future Perfect", "AchieverPuzzleEngine", "Come the summer, ______ a lot to work on, so will need a break.", ["I'll have had", "I'd had", "I'm being had", "I'm having to"], { instruction: FILL }),
  q(48, "Synonyms", "AchieverPuzzleEngine", "Subdue", ["Evoke", "Rewind", "Conquer", "Bemoan"], { instruction: SYN, givenWord: "Subdue", relation: "synonym" }),
  q(49, "Antonyms", "AchieverPuzzleEngine", "Porous", ["Redistributed", "Impermeable", "Bumbling", "Threatening"], { instruction: ANT, givenWord: "Porous", relation: "antonym" }),
  q(50, "Idioms in Conversation", "AchieverPuzzleEngine", "Felix: I just need to check that we're all on the ______ about the rules before we start playing.", ["best place", "easiest lines", "different course", "same page"], { instruction: CONV }),
];

const ids = (a: number, b: number) => IEO_G6_SETB_P3_QUESTIONS.slice(a, b).map((x) => x.id);

export const IEO_G6_SETB_P3_EXAM: Exam = {
  id: IEO_G6_SETB_P3_EXAM_ID,
  code: "IEO-G6-2019-SETB-P3",
  title: "SOF IEO Class 6 Set B — Paper 3 (2019-20)",
  description:
    "International English Olympiad 2019-20, Class 6, Question Paper Set B. Every question is a hands-on language lab: build the phrase, spin the verb drum, fit the punctuation, repair the faulty sentence, spell from syllable blocks, set the timeline, or collect evidence from the passage.",
  subjectId: "sub_english",
  subjectName: "English",
  grade: 6,
  academicYear: "2019-20",
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
      "The paper has four sections: Word and Structure Knowledge, Reading, Spoken and Written Expression, and the Achievers Section.",
      "Each question in the Achievers Section carries 3 marks; all other questions carry 1 mark each. There is no negative marking.",
      "Every question is an activity: what you build in it is your answer. Press the activity's submit control to record it.",
      "You may come back and change an answer at any time before you finish the paper.",
    ],
  },
  status: "Published",
  createdAt: "2026-09-30T00:00:00Z",
  updatedAt: "2026-09-30T00:00:00Z",
  sections: [
    { id: "sec_ieo_p3_word", title: "Word and Structure Knowledge", description: "30 Questions (1 Mark each)", questionIds: ids(0, 30) },
    { id: "sec_ieo_p3_reading", title: "Reading", description: "10 Questions (1 Mark each)", questionIds: ids(30, 40) },
    { id: "sec_ieo_p3_spoken", title: "Spoken and Written Expression", description: "5 Questions (1 Mark each)", questionIds: ids(40, 45) },
    { id: "sec_ieo_p3_achievers", title: "Achievers Section", description: "5 Questions (3 Marks each)", questionIds: ids(45, 50) },
  ],
  questionIds: IEO_G6_SETB_P3_QUESTIONS.map((x) => x.id),
};
