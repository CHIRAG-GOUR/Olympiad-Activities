export type SessionConnectionStatus = "Connected" | "Reconnecting" | "Disconnected" | "Completed";

export interface StudentMetadata {
  name: string;
  studentId: string; // e.g. STU-89210
  rollNumber?: string;
  schoolName?: string;
  grade?: string | number;
}

export interface DeviceInfo {
  ip: string;
  device: string; // e.g. "Desktop (Windows)", "iPad Pro (iOS)"
  browser: string; // e.g. "Chrome 122.0"
  os: string; // e.g. "Windows 11"
  screenResolution?: string;
  userAgent?: string;
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
}
