import { db, isRealFirebaseConfigured } from "./config";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
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
  reconcileWithSeed,
} from "@/lib/seedData";

const LOCAL_STORAGE_PREFIX = "olympiad_db_";

function cleanOldMockData() {
  if (typeof window === "undefined") return;
  try {
    const hasCleaned = localStorage.getItem(LOCAL_STORAGE_PREFIX + "v5_two_ieo_exams_all");
    if (!hasCleaned) {
      // Purge all old seed collections and load both English and IMO datasets
      const keysToRemove = [
        "questions",
        "exams",
        "subjects",
        "examSessions",
        "attempts",
      ];
      keysToRemove.forEach((k) => localStorage.removeItem(LOCAL_STORAGE_PREFIX + k));
      localStorage.setItem(LOCAL_STORAGE_PREFIX + "v5_two_ieo_exams_all", "true");
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

function sanitizeFirestoreData<T extends object>(data: T): T {
  const clean: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data)) {
    if (v !== undefined && typeof v !== "function" && typeof v !== "symbol") {
      clean[k] = v;
    }
  }
  return clean as T;
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
          return reconcileWithSeed(snap.docs.map((d) => d.data() as Question), SEED_QUESTIONS);
        }
      } catch (e) {
        console.warn("Firestore read failed, falling back to local store", e);
      }
    }
    return reconcileWithSeed(getLocalCollection<Question>("questions", SEED_QUESTIONS), SEED_QUESTIONS);
  },

  async getQuestionById(id: string): Promise<Question | null> {
    const questions = await this.getQuestions();
    return questions.find((q) => q.id === id || q.questionId === id) || null;
  },

  async saveQuestion(question: Question): Promise<void> {
    if (isRealFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, "questions", question.id), sanitizeFirestoreData(question));
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
          return reconcileWithSeed(snap.docs.map((d) => d.data() as Exam), SEED_EXAMS);
        }
      } catch (e) {
        console.warn("Firestore exam fetch fallback", e);
      }
    }
    return reconcileWithSeed(getLocalCollection<Exam>("exams", SEED_EXAMS), SEED_EXAMS);
  },

  async getExamById(id: string): Promise<Exam | null> {
    const exams = await this.getExams();
    return exams.find((e) => e.id === id || e.code === id) || null;
  },

  async saveExam(exam: Exam): Promise<void> {
    if (isRealFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, "exams", exam.id), sanitizeFirestoreData(exam));
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

  async deleteExam(id: string): Promise<void> {
    if (isRealFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, "exams", id));
      } catch (e) {
        console.error("Firestore deleteExam failed", e);
      }
    }
    const exams = getLocalCollection<Exam>("exams", SEED_EXAMS);
    const filtered = exams.filter((e) => e.id !== id);
    saveLocalCollection("exams", filtered);
  },

  // SUBJECTS
  async getSubjects(): Promise<Subject[]> {
    if (isRealFirebaseConfigured && db) {
      try {
        const snap = await getDocs(collection(db, "subjects"));
        if (!snap.empty) {
          return reconcileWithSeed(snap.docs.map((d) => d.data() as Subject), SEED_SUBJECTS);
        }
      } catch (e) {
        console.warn("Firestore subjects fallback", e);
      }
    }
    return reconcileWithSeed(getLocalCollection<Subject>("subjects", SEED_SUBJECTS), SEED_SUBJECTS);
  },

  async saveSubject(subject: Subject): Promise<void> {
    if (isRealFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, "subjects", subject.id), sanitizeFirestoreData(subject));
      } catch (e) {
        console.error("Firestore saveSubject failed", e);
      }
    }
    const subjects = getLocalCollection<Subject>("subjects", SEED_SUBJECTS);
    const idx = subjects.findIndex((s) => s.id === subject.id);
    if (idx >= 0) subjects[idx] = subject;
    else subjects.push(subject);
    saveLocalCollection("subjects", subjects);
  },

  async deleteSubject(id: string): Promise<void> {
    if (isRealFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, "subjects", id));
      } catch (e) {
        console.error("Firestore deleteSubject failed", e);
      }
    }
    const subjects = getLocalCollection<Subject>("subjects", SEED_SUBJECTS);
    const filtered = subjects.filter((s) => s.id !== id);
    saveLocalCollection("subjects", filtered);
  },

  // SESSIONS / LIVE MONITOR
  async getLiveSessions(): Promise<ExamSession[]> {
    const local = getLocalCollection<ExamSession>("examSessions", SEED_LIVE_SESSIONS);
    if (isRealFirebaseConfigured && db) {
      try {
        const q = query(collection(db, "examSessions"), orderBy("lastSavedAt", "desc"), limit(100));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const remoteSessions: ExamSession[] = snap.docs.map((d) => {
            const raw = d.data() as any;
            if (raw.student && raw.sessionId) {
              return raw as ExamSession;
            }
            const answeredCount = Object.keys(raw.answers || {}).length;
            const totalQuestions = raw.totalQuestions || 50;
            const progress = Math.min(100, Math.round((answeredCount / (totalQuestions || 1)) * 100));
            return {
              id: raw.sessionId || d.id,
              sessionId: raw.sessionId || d.id,
              examId: raw.examId || "",
              examTitle: raw.examTitle || "Olympiad Examination",
              student: {
                name: raw.studentName || raw.student?.name || "Candidate",
                studentId: raw.studentId || raw.student?.studentId || "",
                schoolName: raw.schoolName || raw.student?.schoolName || "",
                grade: raw.grade || raw.student?.grade || 6,
              },
              device: raw.device || {
                ip: "—",
                browser: "Desktop Browser",
                os: "Windows / macOS",
                device: "Desktop",
              },
              currentQuestionIndex: raw.currentQuestionIndex || 0,
              currentQuestionId: raw.currentQuestionId || "",
              totalQuestions,
              answeredCount,
              flaggedCount: (raw.markedForReview || []).length,
              progressPercent: progress,
              startedAt: raw.startedAt ? new Date(raw.startedAt).toLocaleTimeString() : "—",
              lastActiveAt: raw.lastSavedAt ? new Date(raw.lastSavedAt).toLocaleTimeString() : "—",
              connectionStatus: raw.status === "submitted" ? "Completed" : "Connected",
              timeRemainingSeconds: raw.timeRemainingSeconds ?? 3600,
              isSubmitted: raw.status === "submitted",
            };
          });

          // Merge by sessionId
          const map = new Map<string, ExamSession>();
          local.forEach((s) => map.set(s.sessionId || s.id, s));
          remoteSessions.forEach((s) => map.set(s.sessionId || s.id, s));
          return Array.from(map.values());
        }
      } catch (e) {
        console.warn("Firestore liveSessions query failed, using local sessions", e);
      }
    }
    return local;
  },

  async upsertSession(session: ExamSession): Promise<void> {
    if (isRealFirebaseConfigured && db) {
      try {
        const id = session.sessionId || session.id;
        if (id) {
          await setDoc(doc(db, "examSessions", id), sanitizeFirestoreData(session), { merge: true });
        }
      } catch (e) {
        console.warn("Firestore upsertSession failed", e);
      }
    }
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
    const local = getLocalCollection<ExamAttempt>("attempts", []);
    if (isRealFirebaseConfigured && db) {
      try {
        const q = query(collection(db, "attempts"), orderBy("submittedAt", "desc"), limit(200));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const remote = snap.docs.map((d) => d.data() as ExamAttempt);
          const map = new Map<string, ExamAttempt>();
          local.forEach((a) => map.set(a.id, a));
          remote.forEach((a) => map.set(a.id, a));
          return Array.from(map.values());
        }
      } catch (e) {
        console.warn("Firestore getAttempts failed, using local attempts", e);
      }
    }
    return local;
  },

  async getAttemptById(attemptId: string): Promise<ExamAttempt | null> {
    if (isRealFirebaseConfigured && db) {
      try {
        const snap = await getDoc(doc(db, "attempts", attemptId));
        if (snap.exists()) {
          return snap.data() as ExamAttempt;
        }
      } catch (e) {
        console.warn("Firestore getAttemptById failed", e);
      }
    }
    const attempts = await this.getAttempts();
    return attempts.find((a) => a.id === attemptId) || null;
  },

  async saveAttempt(attempt: ExamAttempt): Promise<void> {
    if (isRealFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, "attempts", attempt.id), sanitizeFirestoreData(attempt));
      } catch (e) {
        console.error("Firestore saveAttempt failed", e);
      }
    }
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
      if (isRealFirebaseConfigured && db) {
        try {
          await updateDoc(doc(db, "exams", e.id), { completionCount: e.completionCount });
        } catch {}
      }
    }
  },
};
