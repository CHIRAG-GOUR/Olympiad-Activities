import { db, isRealFirebaseConfigured } from "./config";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { Question } from "@/types/question";
import { Exam } from "@/types/exam";
import { Subject } from "@/types/subject";
import { ExamSession } from "@/types/session";
import { ExamAttempt } from "@/types/attempt";
import {
  SEED_SUBJECTS,
  SEED_QUESTIONS,
  SEED_EXAMS,
  SEED_LIVE_SESSIONS,
} from "@/lib/seedData";

const LOCAL_STORAGE_PREFIX = "olympiad_db_";

function cleanOldMockData() {
  if (typeof window === "undefined") return;
  try {
    const hasCleaned = localStorage.getItem(LOCAL_STORAGE_PREFIX + "v4_interactive_questions_all");
    if (!hasCleaned) {
      // Purge all old seed collections and load official IMO 2024-25 dataset with interactive configs
      const keysToRemove = [
        "questions",
        "exams",
        "subjects",
        "examSessions",
        "attempts",
      ];
      keysToRemove.forEach((k) => localStorage.removeItem(LOCAL_STORAGE_PREFIX + k));
      localStorage.setItem(LOCAL_STORAGE_PREFIX + "v4_interactive_questions_all", "true");
    }
  } catch (e) {
    console.error("Error cleaning old mock storage", e);
  }
}

function getLocalCollection<T>(collectionName: string, defaultData: T[] = []): T[] {
  if (typeof window === "undefined") return defaultData;
  cleanOldMockData();
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PREFIX + collectionName);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_PREFIX + collectionName, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading collection ${collectionName} from local storage`, err);
    return defaultData;
  }
}

function saveLocalCollection<T>(collectionName: string, items: T[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + collectionName, JSON.stringify(items));
  } catch (err) {
    console.error(`Error saving collection ${collectionName}`, err);
  }
}

export const OlympiadStore = {
  // Reset / Clear all data
  clearAllLocalData(): void {
    if (typeof window === "undefined") return;
    try {
      const keys = ["questions", "exams", "subjects", "examSessions", "attempts"];
      keys.forEach((k) => localStorage.removeItem(LOCAL_STORAGE_PREFIX + k));
    } catch (e) {
      console.error("Error clearing local store", e);
    }
  },

  // QUESTIONS
  async getQuestions(): Promise<Question[]> {
    if (isRealFirebaseConfigured && db) {
      try {
        const snap = await getDocs(collection(db, "questions"));
        if (!snap.empty) {
          return snap.docs.map((d) => d.data() as Question);
        }
      } catch (e) {
        console.warn("Firestore read failed, falling back to local store", e);
      }
    }
    return getLocalCollection<Question>("questions", SEED_QUESTIONS);
  },

  async getQuestionById(id: string): Promise<Question | null> {
    const questions = await this.getQuestions();
    return questions.find((q) => q.id === id || q.questionId === id) || null;
  },

  async saveQuestion(question: Question): Promise<void> {
    if (isRealFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, "questions", question.id), question);
      } catch (e) {
        console.error("Firestore save failed", e);
      }
    }
    const questions = getLocalCollection<Question>("questions", SEED_QUESTIONS);
    const index = questions.findIndex((q) => q.id === question.id);
    if (index >= 0) {
      questions[index] = question;
    } else {
      questions.unshift(question);
    }
    saveLocalCollection("questions", questions);
  },

  async deleteQuestion(id: string): Promise<void> {
    if (isRealFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, "questions", id));
      } catch (e) {
        console.error("Firestore delete failed", e);
      }
    }
    const questions = getLocalCollection<Question>("questions", SEED_QUESTIONS);
    const filtered = questions.filter((q) => q.id !== id);
    saveLocalCollection("questions", filtered);
  },

  // EXAMS
  async getExams(): Promise<Exam[]> {
    if (isRealFirebaseConfigured && db) {
      try {
        const snap = await getDocs(collection(db, "exams"));
        if (!snap.empty) {
          return snap.docs.map((d) => d.data() as Exam);
        }
      } catch (e) {
        console.warn("Firestore exam fetch fallback", e);
      }
    }
    return getLocalCollection<Exam>("exams", SEED_EXAMS);
  },

  async getExamById(id: string): Promise<Exam | null> {
    const exams = await this.getExams();
    return exams.find((e) => e.id === id || e.code === id) || null;
  },

  async saveExam(exam: Exam): Promise<void> {
    if (isRealFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, "exams", exam.id), exam);
      } catch (e) {
        console.error("Firestore saveExam failed", e);
      }
    }
    const exams = getLocalCollection<Exam>("exams", SEED_EXAMS);
    const index = exams.findIndex((e) => e.id === exam.id);
    if (index >= 0) {
      exams[index] = exam;
    } else {
      exams.unshift(exam);
    }
    saveLocalCollection("exams", exams);
  },

  // SUBJECTS
  async getSubjects(): Promise<Subject[]> {
    if (isRealFirebaseConfigured && db) {
      try {
        const snap = await getDocs(collection(db, "subjects"));
        if (!snap.empty) {
          return snap.docs.map((d) => d.data() as Subject);
        }
      } catch (e) {
        console.warn("Firestore subjects fallback", e);
      }
    }
    return getLocalCollection<Subject>("subjects", SEED_SUBJECTS);
  },

  async saveSubject(subject: Subject): Promise<void> {
    const subjects = getLocalCollection<Subject>("subjects", SEED_SUBJECTS);
    const idx = subjects.findIndex((s) => s.id === subject.id);
    if (idx >= 0) subjects[idx] = subject;
    else subjects.push(subject);
    saveLocalCollection("subjects", subjects);
  },

  // SESSIONS / LIVE MONITOR
  async getLiveSessions(): Promise<ExamSession[]> {
    return getLocalCollection<ExamSession>("examSessions", SEED_LIVE_SESSIONS);
  },

  async upsertSession(session: ExamSession): Promise<void> {
    const sessions = getLocalCollection<ExamSession>("examSessions", SEED_LIVE_SESSIONS);
    const index = sessions.findIndex((s) => s.id === session.id || s.sessionId === session.sessionId);
    if (index >= 0) {
      sessions[index] = session;
    } else {
      sessions.unshift(session);
    }
    saveLocalCollection("examSessions", sessions);
  },

  // ATTEMPTS & RESULTS
  async getAttempts(): Promise<ExamAttempt[]> {
    return getLocalCollection<ExamAttempt>("attempts", []);
  },

  async getAttemptById(attemptId: string): Promise<ExamAttempt | null> {
    const attempts = await this.getAttempts();
    return attempts.find((a) => a.id === attemptId) || null;
  },

  async saveAttempt(attempt: ExamAttempt): Promise<void> {
    const attempts = getLocalCollection<ExamAttempt>("attempts", []);
    const idx = attempts.findIndex((a) => a.id === attempt.id);
    if (idx >= 0) {
      attempts[idx] = attempt;
    } else {
      attempts.unshift(attempt);
    }
    saveLocalCollection("attempts", attempts);

    // Update exam completion statistics
    const exams = getLocalCollection<Exam>("exams", []);
    const examIndex = exams.findIndex((e) => e.id === attempt.examId);
    if (examIndex >= 0) {
      const e = exams[examIndex];
      e.completionCount = (e.completionCount || 0) + 1;
      saveLocalCollection("exams", exams);
    }
  },
};
