import { Question } from "@/types/question";
import { Exam, ExamSection } from "@/types/exam";
import { IGKO_SUBJECT } from "@/data/igko_g6_scitech";

/**
 * SOF International General Knowledge Olympiad (IGKO) · Class 6
 * Chapter 2 — India and the World — Interactive Examination
 *
 * Source: IGKO/…/WORKSHEET/VI/6.2 India and World.docx, wording and options unchanged.
 * Key verified against …/ANSWER KEY/VI/6.2 India and World AK.docx (highlighted answers):
 * all fifteen agree with the verified key below.
 *
 * Every question is answered through its activity, never through option buttons.
 */

export const IGKO_G6_INDIAWORLD_KEY = "CCCCBCBCCBCCBBA";

const SECTION = "India and the World" as const;

function q(
  n: number,
  topic: string,
  questionText: string,
  options: [string, string, string, string],
  activity: { type: string; config?: Record<string, unknown> }
): Question {
  const nn = String(n).padStart(2, "0");
  return {
    id: `igko_g6_iw_q${nn}`,
    questionId: `IGKO-G6-IW-Q${nn}`,
    subjectId: IGKO_SUBJECT.id,
    subjectName: IGKO_SUBJECT.name,
    grade: 6,
    section: SECTION,
    chapter: SECTION,
    topic,
    difficulty: "MEDIUM",
    questionType: "MULTIPLE_CHOICE",
    questionText,
    marks: 1,
    negativeMarks: 0,
    version: 1,
    status: "Published",
    createdAt: "2026-10-09T00:00:00Z",
    updatedAt: "2026-10-09T00:00:00Z",
    multipleChoiceConfig: {
      options: (["A", "B", "C", "D"] as const).map((id, i) => ({ id, text: options[i] })),
      correctOptionId: IGKO_G6_INDIAWORLD_KEY[n - 1],
      layout: "list",
    },
    customConfig: {
      paper: "SOF IGKO Class 6 — India and the World (Interactive)",
      examId: "igko-class6-indiaworld-interactive",
      questionNumber: n,
      activityOnly: false,
      activityType: activity.type,
      activityConfig: activity.config ?? {},
    },
  } as Question;
}

export const IGKO_G6_INDIAWORLD_QUESTIONS: Question[] = [
  q(
    1,
    "Global Initiatives",
    "The \"Belt and Road Initiative\" (BRI) is a global development strategy adopted by the Chinese government involving infrastructure development and investments in various countries. Which of the following is NOT a stated objective of the BRI?",
    ["To enhance regional connectivity and economic cooperation.", "To promote cultural exchange and understanding.", "To establish a military alliance with participating countries.", "To facilitate trade and investment flows."],
    { type: "infrastructure-command-center" }
  ),
  q(
    2,
    "United Nations",
    "Identify the country that is NOT a permanent member of the United Nations Security Council (UNSC).",
    ["France", "United Kingdom", "Germany", "China"],
    { type: "un-security-council-chamber" }
  ),
  q(
    3,
    "Ancient Civilisations",
    "The ancient civilization of Mesopotamia, often called the \"Cradle of Civilization,\" developed between which two rivers?",
    ["Nile and Congo", "Indus and Ganges", "Tigris and Euphrates", "Yangtze and Yellow"],
    { type: "mesopotamia-expedition" }
  ),
  q(
    4,
    "United Nations",
    "The United Nations Sustainable Development Goals (SDGs) are a collection of 17 global goals set by the United Nations General Assembly in 2015 for the year 2030. Which of the following is NOT one of the broad themes addressed by the SDGs?",
    ["Poverty and Hunger", "Peace and Justice", "Military Expansion", "Climate Action and Environmental Protection"],
    { type: "sdg-city-builder" }
  ),
  q(
    5,
    "Physical Geography",
    "The \"Ring of Fire\" is a major area in the basin of the Pacific Ocean where a large number of earthquakes and volcanic eruptions occur. What is the primary geological reason for the occurrence of these phenomena in this region?",
    ["The presence of a very cold ocean current that causes tectonic instability.", "The subduction zones where oceanic plates are diving beneath continental plates.", "The high concentration of active volcanoes on the ocean floor.", "The rapid melting of glaciers leading to land subsidence."],
    { type: "tectonic-plate-simulator" }
  ),
  q(
    6,
    "World Geography",
    "If you were to trace the journey of a ship travelling from Mumbai (India) to London (UK) via the shortest sea route, which major global landmark would it most likely pass through?",
    ["Panama Canal", "Strait of Malacca", "Suez Canal", "Strait of Gibraltar"],
    { type: "shipping-navigator" }
  ),
  q(
    7,
    "India's Contributions",
    "The concept of \"zero\" and the decimal system are considered significant contributions of ancient India to the world. Why was the invention of zero particularly revolutionary for mathematics?",
    ["It allowed for the development of negative numbers.", "It represented the absence of value, enabling place-value notation.", "It was essential for calculating prime numbers.", "It simplified the process of addition and subtraction."],
    { type: "zero-place-value-machine" }
  ),
  q(
    8,
    "India's Foreign Policy",
    "India's 'Look East Policy' (now 'Act East Policy') aims to strengthen economic and strategic relations with Southeast Asian and East Asian countries. Which of the following is a primary driver behind this policy?",
    ["To counter the influence of Western powers in the region.", "To find new markets for Indian agricultural products.", "To enhance India's role as a regional power and secure its economic interests.", "To encourage migration of skilled labor from these countries to India."],
    { type: "act-east-strategy-map" }
  ),
  q(
    9,
    "World Geography",
    "Which of the following is the most significant reason for the construction of the Suez Canal?",
    ["To create a new freshwater source for the surrounding desert regions.", "To connect the Atlantic Ocean directly to the Indian Ocean.", "To shorten the maritime trade route between Europe and Asia.", "To facilitate the movement of military fleets during times of war."],
    { type: "suez-canal-engineering" }
  ),
  q(
    10,
    "International Organisations",
    "Which of the following international organizations primarily focuses on promoting global financial stability and monetary cooperation?",
    ["World Health Organization (WHO)", "International Monetary Fund (IMF)", "United Nations Children's Fund (UNICEF)", "World Trade Organization (WTO)"],
    { type: "finance-crisis-room" }
  ),
  q(
    11,
    "International Organisations",
    "Many international organizations have their headquarters in specific cities. If you wanted to visit the headquarters of the International Court of Justice (ICJ), where would you travel?",
    ["New York City, USA", "Geneva, Switzerland", "The Hague, Netherlands", "Paris, France"],
    { type: "world-headquarters-flight" }
  ),
  q(
    12,
    "World Affairs",
    "The term \"Brexit\" refers to the United Kingdom's withdrawal from which international body?",
    ["North Atlantic Treaty Organization (NATO)", "World Trade Organization (WTO)", "European Union (EU)", "G7"],
    { type: "brexit-timeline" }
  ),
  q(
    13,
    "Indian Heritage",
    "Which Veda is related to music?",
    ["Rig Veda", "Sama Veda", "Yajur Veda", "Atharva Veda"],
    { type: "vedic-music-studio" }
  ),
  q(
    14,
    "World Geography",
    "Which continent is known as the \"Dark Continent\"?",
    ["Asia", "Africa", "South America", "Europe"],
    { type: "continents-expedition", config: { termNote: "The phrase in this question is a 19th-century label; it is not an appropriate description of any continent today." } }
  ),
  q(
    15,
    "Weather & Climate",
    "Willy Willy is the cyclone of:",
    ["Australia", "USA", "China", "India"],
    { type: "cyclone-tracker" }
  ),
];

const ids = IGKO_G6_INDIAWORLD_QUESTIONS.map((x) => x.id);

const sections: ExamSection[] = [
  { id: "sec_igko_indiaworld", title: "India and the World", description: `${ids.length} interactive investigations (1 mark each)`, questionIds: ids },
];

export const IGKO_G6_INDIAWORLD_EXAM: Exam = {
  id: "igko-class6-indiaworld-interactive",
  code: "IGKO-G6-INDIAWORLD",
  title: "SOF International General Knowledge Olympiad (Class 6) — India and the World",
  subtitle: "Science Olympiad Foundation • Class 6 • Interactive Investigations",
  description:
    "Chapter 2 of the SOF International General Knowledge Olympiad for Class 6. Every question is an interactive investigation: explore the world, then give your answer by acting in it.",
  subjectId: IGKO_SUBJECT.id,
  subjectName: IGKO_SUBJECT.name,
  grade: 6,
  academicYear: "2025-26",
  durationMinutes: 2 * ids.length + 10,
  totalMarks: ids.length,
  passingMarks: Math.ceil(ids.length * 0.4),
  totalQuestions: ids.length,
  rules: {
    allowBacktrack: true,
    shuffleQuestions: true,
    showTimer: true,
    autoSubmitOnTimeUp: true,
    passPercentage: 40,
    negativeMarkingEnabled: false,
    instructions: [
      "Only 4 hints can be used: 1-mark questions will only get 1/2 mark, and 3-mark questions cut 1 & half mark for taking a hint",
      `This paper has ${ids.length} questions on India and the World, 1 mark each. There is no negative marking.`,
      "Each question is an interactive investigation. You can explore and answer through the activity or choose options directly below.",
      "Press the activity's lock-in button to record your answer. Changing your answer afterwards withdraws it until you lock it in again.",
      "Your work is saved continuously. If the page reloads, every activity returns exactly as you left it.",
    ],
  },
  status: "Published",
  createdAt: "2026-10-09T00:00:00Z",
  updatedAt: "2026-10-09T00:00:00Z",
  sections,
  questionIds: ids,
};
