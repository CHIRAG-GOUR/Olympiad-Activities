/**
 * Unified Domain Services for Olympiad Digital Examination
 * 
 * Provides centralized business domain logic decoupled from UI components and hosting provider.
 */

export { authService } from "./authService";
export type { AuthService, SignInRequest, SignInOutcome, StoredSession } from "./authService";

export { examService, ExamService } from "./examService";
export { questionService, QuestionService } from "./questionService";
export { attemptService, resultService, AttemptService } from "./attemptService";
export { userService, studentService, UserService } from "./userService";
export { reportService, ReportService } from "./reportService";
export { storageService, LocalStorageService, FirebaseStorageService } from "./storageService";
export type { IStorageService, StorageUploadResult } from "./storageService";

export { ExamPersistenceService } from "./persistence/ExamPersistenceService";
export type { ExamSessionState, AnswerState } from "./persistence/ExamPersistenceService";
