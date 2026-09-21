import { Question } from "./question";

export interface RawImportRow {
  question_id?: string;
  subject?: string;
  chapter?: string;
  topic?: string;
  grade?: string | number;
  section?: string;
  question_text?: string;
  question_type?: string;
  difficulty?: string;
  marks?: string | number;
  negative_marks?: string | number;
  answer?: string;
  answer_tolerance?: string | number;
  interaction_config?: string; // JSON string or shorthand
  animation_config?: string;
  explanation?: string;
  image?: string;
  [key: string]: any;
}

export type ImportErrorSeverity = "error" | "warning" | "info";

export interface ImportErrorItem {
  rowNumber: number;
  field: string;
  message: string;
  severity: ImportErrorSeverity;
}

export interface ParsedQuestionResult {
  rowNumber: number;
  raw: RawImportRow;
  question?: Partial<Question>;
  isValid: boolean;
  errors: ImportErrorItem[];
}

export interface ImportBatchSummary {
  id: string;
  fileName: string;
  fileSize: number;
  totalRows: number;
  validCount: number;
  warningCount: number;
  errorCount: number;
  results: ParsedQuestionResult[];
  status: "parsed" | "validating" | "ready_to_publish" | "published" | "discarded";
  uploadedAt: string;
}
