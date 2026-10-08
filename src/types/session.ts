export type SessionConnectionStatus = "Connected" | "Reconnecting" | "Disconnected" | "Completed";

export interface StudentMetadata {
  name: string;
  studentId: string; // e.g. STU-89210
  rollNumber?: string;
  schoolName?: string;
  grade?: string | number;
  section?: string;
}

export interface DeviceInfo {
  ip: string;
  device: string; // e.g. "Desktop (Windows)", "iPad Pro (iOS)"
  browser: string; // e.g. "Chrome 122.0"
  os: string; // e.g. "Windows 11"
  screenResolution?: string;
  userAgent?: string;
}

/** One focus event during a sitting: the candidate left the exam tab or full screen. */
export interface IntegrityEvent {
  type: "tab_hidden" | "window_blur" | "fullscreen_exit";
  at: string;
  /** Position in the candidate's own question order (0-based). */
  questionIndex?: number;
}

/** Focus record for a sitting, shown to staff in the live monitor and results. */
export interface IntegrityLog {
  tabSwitches: number;
  fullscreenExits: number;
  /** Most recent events, capped so the session document stays small. */
  events: IntegrityEvent[];
}

export interface ExamSession {
  id: string;
  sessionId: string; // friendly code like EX-20491
  examId: string;
  examTitle: string;
  student: StudentMetadata;
  device: DeviceInfo;
  currentQuestionIndex: number;
  currentQuestionId: string;
  totalQuestions: number;
  answeredCount: number;
  flaggedCount: number;
  progressPercent: number;
  startedAt: string;
  lastActiveAt: string;
  connectionStatus: SessionConnectionStatus;
  timeRemainingSeconds: number;
  isSubmitted: boolean;
  attemptId?: string;
  integrity?: IntegrityLog;
}
