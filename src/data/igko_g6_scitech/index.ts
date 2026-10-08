import { Question } from "@/types/question";
import { Exam, ExamSection } from "@/types/exam";
import { Subject } from "@/types/subject";

/**
 * SOF International General Knowledge Olympiad (IGKO) · Class 6
 * Science & Technology — Interactive Examination
 *
 * Every question is answered through its activity: the student works a simulation, the
 * simulation produces a measurable result, and that result is resolved to the printed
 * option. There is no A/B/C/D control anywhere in this paper (`activityOnly`).
 *
 * The question wording and options are the source paper's, unchanged.
 *
 * The paper is released in batches. Questions are listed here as their activities are
 * built; `IGKO_G6_SCITECH_EXAM.questionIds` only ever contains questions that have one.
 */

/**
 * Verified answer key for all 15 source questions (Q1 → Q15).
 *
 * Source: IGKO/…/6.1 S&T.docx (questions) and 6.1 S&T AK.docx (answer key). The answer-key
 * file marks Q4 as "Buoyant Force"; that is incorrect — gravity is what makes an object
 * sink, buoyancy acts against it — so Q4 is keyed B (Gravitational Force), as verified.
 */
export const IGKO_G6_SCITECH_KEY = "BACBDCBDDCBABCC";

export const IGKO_SUBJECT: Subject = {
  id: "sub_igko",
  name: "General Knowledge (IGKO)",
  code: "IGKO-06",
  description: "SOF International General Knowledge Olympiad — Science & Technology and general awareness.",
  color: "#0E9384",
  iconName: "Atom",
  gradeLevels: [6],
  questionCount: 0,
  examCount: 0,
  chapters: [
    {
      id: "ch_igko_scitech",
      name: "Science & Technology",
      topics: [
        { id: "t_igko_awards", name: "Awards & Scientists" },
        { id: "t_igko_matter", name: "States of Matter" },
        { id: "t_igko_space", name: "Space Missions" },
        { id: "t_igko_forces", name: "Forces" },
        { id: "t_igko_health", name: "Health & Medicine" },
      ],
    },
  ],
};

const SECTION = "Science & Technology" as const;

function q(
  n: number,
  topic: string,
  questionText: string,
  options: [string, string, string, string],
  activity: { type: string; config?: Record<string, unknown> }
): Question {
  const nn = String(n).padStart(2, "0");
  return {
    id: `igko_g6_st_q${nn}`,
    questionId: `IGKO-G6-ST-Q${nn}`,
    subjectId: "sub_igko",
    subjectName: "General Knowledge (IGKO)",
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
    createdAt: "2026-10-08T00:00:00Z",
    updatedAt: "2026-10-08T00:00:00Z",
    multipleChoiceConfig: {
      options: (["A", "B", "C", "D"] as const).map((id, i) => ({ id, text: options[i] })),
      correctOptionId: IGKO_G6_SCITECH_KEY[n - 1],
      layout: "list",
    },
    customConfig: {
      paper: "SOF IGKO Class 6 — Science & Technology (Interactive)",
      examId: "igko-class6-scitech-interactive",
      questionNumber: n,
      /** Answered only through the activity: the plain-options view is never offered. */
      activityOnly: true,
      activityType: activity.type,
      activityConfig: activity.config ?? {},
    },
  } as Question;
}

export const IGKO_G6_SCITECH_QUESTIONS: Question[] = [
  q(
    1,
    "Nobel Prizes",
    "This Nobel Prize is one of the five Nobel Prizes established by the will of Swedish industrialist, inventor, and armaments manufacturer Alfred Nobel. Since March 1901 it has been awarded annually to people who have \"done the most or the best work for fraternity between nations, for the abolition or reduction of standing armies and for the holding and promotion of peace congresses.\" Which is the prize and where it is awarded?",
    ["Chemistry, Sweden", "Peace, Norway", "Physics, Norway", "Peace, Sweden"],
    { type: "nobel-mission-control" }
  ),
  q(
    2,
    "States of Matter",
    "The fourth state of matter recently been discovered is",
    ["Plasma", "Steam", "Gas", "Matteroid"],
    { type: "plasma-reactor" }
  ),
  q(
    3,
    "Space Missions",
    "It is an Indian lunar probe launched by the Indian Space Research Organisation (ISRO) consisted of an orbiter and an impactor. One of the most significant findings was the detection of water molecules in the lunar soil, a discovery that significantly advanced lunar science. Which mission is being talked about in the above paragraph?",
    ["Chandrayan-2", "Chandrayan-3", "Chandrayan-1", "Mangalyan"],
    { type: "lunar-mission-reconstruction" }
  ),
  q(
    4,
    "Forces",
    "Due to which force applied on an object it sinks to the bottom of the water body?",
    ["Buoyant Force", "Gravitational Force", "Spring Force", "Air resistant force"],
    { type: "underwater-force-lab" }
  ),
  q(
    5,
    "Medical Technology",
    "It is a noninvasive medical imaging test that produces detailed images of almost every internal structure in the human body, including the organs, bones, muscles and blood vessels. No ionizing radiation is produced during this scan. Identify the test.",
    ["X-ray", "Chemotheraphy", "Sonography", "MRI"],
    { type: "medical-imaging-center" }
  ),
];

const ids = IGKO_G6_SCITECH_QUESTIONS.map((x) => x.id);

const sections: ExamSection[] = [
  {
    id: "sec_igko_scitech",
    title: "Science & Technology",
    description: `${ids.length} interactive investigations (1 mark each)`,
    questionIds: ids,
  },
];

export const IGKO_G6_SCITECH_EXAM: Exam = {
  id: "igko-class6-scitech-interactive",
  code: "IGKO-G6-SCITECH",
  title: "SOF International General Knowledge Olympiad (Class 6) — Science & Technology",
  subtitle: "Science Olympiad Foundation • Class 6 • Interactive Investigations",
  description:
    "Science & Technology section of the SOF International General Knowledge Olympiad for Class 6. Every question is an interactive investigation: run the experiment, and its result becomes your answer.",
  subjectId: "sub_igko",
  subjectName: "General Knowledge (IGKO)",
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
      `This paper has ${ids.length} Science & Technology questions, 1 mark each. There is no negative marking.`,
      "Each question is an interactive investigation. There are no option buttons: run the experiment, and the result it produces becomes your answer.",
      "When your investigation gives a result, press the activity's lock-in button to record it. Changing the experiment afterwards withdraws the answer until you lock it in again.",
      "Your work is saved continuously. If the page reloads, every activity returns exactly as you left it.",
      "You can move between questions freely using the question palette.",
    ],
  },
  status: "Published",
  createdAt: "2026-10-08T00:00:00Z",
  updatedAt: "2026-10-08T00:00:00Z",
  sections,
  questionIds: ids,
};
