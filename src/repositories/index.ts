/**
 * Unified Repository Layer for Olympiad Digital Examination
 * 
 * Provides dependency inversion access to storage repositories.
 * 
 * Provider selection:
 * - 'local'    : Local repository implementation (IndexedDB + localStorage backup, Vercel ready)
 * - 'firebase' : Cloud Firestore repository implementation (Activated via NEXT_PUBLIC_DATA_PROVIDER=firebase)
 * 
 * The UI layer and Domain Services interact exclusively with repository interfaces.
 */

import { appConfig } from "@/lib/config/env";
import { IExamRepository } from "./interfaces/IExamRepository";
import { IQuestionRepository } from "./interfaces/IQuestionRepository";
import { IAttemptRepository } from "./interfaces/IAttemptRepository";
import { IReportRepository } from "./interfaces/IReportRepository";
import { IUserRepository } from "./interfaces/IUserRepository";
import { ISubjectRepository } from "./interfaces/ISubjectRepository";

import { LocalExamRepository } from "./local/LocalExamRepository";
import { LocalQuestionRepository } from "./local/LocalQuestionRepository";
import { LocalAttemptRepository } from "./local/LocalAttemptRepository";
import { LocalReportRepository } from "./local/LocalReportRepository";
import { LocalUserRepository } from "./local/LocalUserRepository";
import { LocalSubjectRepository } from "./local/LocalSubjectRepository";

import { FirestoreExamRepository } from "./firebase/FirestoreExamRepository";
import { FirestoreQuestionRepository } from "./firebase/FirestoreQuestionRepository";
import { FirestoreAttemptRepository } from "./firebase/FirestoreAttemptRepository";
import { FirestoreReportRepository } from "./firebase/FirestoreReportRepository";
import { FirestoreUserRepository } from "./firebase/FirestoreUserRepository";
import { FirestoreSubjectRepository } from "./firebase/FirestoreSubjectRepository";

const isFirebase = appConfig.dataProvider === "firebase";

export const examRepository: IExamRepository = isFirebase
  ? new FirestoreExamRepository()
  : new LocalExamRepository();

export const questionRepository: IQuestionRepository = isFirebase
  ? new FirestoreQuestionRepository()
  : new LocalQuestionRepository();

export const attemptRepository: IAttemptRepository = isFirebase
  ? new FirestoreAttemptRepository()
  : new LocalAttemptRepository();

export const reportRepository: IReportRepository = isFirebase
  ? new FirestoreReportRepository()
  : new LocalReportRepository();

export const userRepository: IUserRepository = isFirebase
  ? new FirestoreUserRepository()
  : new LocalUserRepository();

export const subjectRepository: ISubjectRepository = isFirebase
  ? new FirestoreSubjectRepository()
  : new LocalSubjectRepository();

export * from "./interfaces/IExamRepository";
export * from "./interfaces/IQuestionRepository";
export * from "./interfaces/IAttemptRepository";
export * from "./interfaces/IReportRepository";
export * from "./interfaces/IUserRepository";
export * from "./interfaces/ISubjectRepository";
