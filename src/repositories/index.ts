/**
 * Repository Registry for Olympiad Digital Examination
 * Provides centralized dependency-inversion access to storage repositories.
 * Currently backed by Local (IndexedDB + Storage) repositories.
 * When Firebase is integrated in the future, Firebase...Repository can be swapped here
 * without altering a single UI component or business service.
 */

import { IExamRepository } from "./interfaces/IExamRepository";
import { IQuestionRepository } from "./interfaces/IQuestionRepository";
import { IAttemptRepository } from "./interfaces/IAttemptRepository";
import { IReportRepository } from "./interfaces/IReportRepository";
import { IUserRepository } from "./interfaces/IUserRepository";

import { LocalExamRepository } from "./local/LocalExamRepository";
import { LocalQuestionRepository } from "./local/LocalQuestionRepository";
import { LocalAttemptRepository } from "./local/LocalAttemptRepository";
import { LocalReportRepository } from "./local/LocalReportRepository";
import { LocalUserRepository } from "./local/LocalUserRepository";

export const examRepository: IExamRepository = new LocalExamRepository();
export const questionRepository: IQuestionRepository = new LocalQuestionRepository();
export const attemptRepository: IAttemptRepository = new LocalAttemptRepository();
export const reportRepository: IReportRepository = new LocalReportRepository();
export const userRepository: IUserRepository = new LocalUserRepository();

export * from "./interfaces/IExamRepository";
export * from "./interfaces/IQuestionRepository";
export * from "./interfaces/IAttemptRepository";
export * from "./interfaces/IReportRepository";
export * from "./interfaces/IUserRepository";
