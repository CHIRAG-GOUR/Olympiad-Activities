"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { OlympiadStore } from "@/services/firebase/firestore";
import { QuestionRenderer } from "@/components/questions/QuestionRenderer";
import { RawImportRow, ParsedQuestionResult, ImportErrorItem } from "@/types/import";
import { Question, QuestionType, QuestionDifficulty } from "@/types/question";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  Send,
  Download,
  Check,
  X,
  FileText,
} from "lucide-react";

export default function ImportsPage() {
  const [parsedResults, setParsedResults] = useState<ParsedQuestionResult[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [selectedPreview, setSelectedPreview] = useState<Question | null>(null);
  const [publishedCount, setPublishedCount] = useState<number | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setPublishedCount(null);

    const isCsv = file.name.endsWith(".csv");
    const reader = new FileReader();

    if (isCsv) {
      reader.onload = (evt) => {
        const text = evt.target?.result as string;
        Papa.parse<RawImportRow>(text, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            validateAndProcessRows(results.data);
          },
        });
      };
      reader.readAsText(file);
    } else {
      reader.onload = (evt) => {
        const data = new Uint8Array(evt.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json<RawImportRow>(worksheet);
        validateAndProcessRows(json);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const validateAndProcessRows = (rows: RawImportRow[]) => {
    const results: ParsedQuestionResult[] = rows.map((row, idx) => {
      const rowNum = idx + 2;
      const errors: ImportErrorItem[] = [];

      if (!row.question_text || String(row.question_text).trim().length < 3) {
        errors.push({
          rowNumber: rowNum,
          field: "question_text",
          message: "Question text is required (min 3 characters).",
          severity: "error",
        });
      }

      const qType = (row.question_type || "NUMERIC").toUpperCase() as QuestionType;
      const validTypes: QuestionType[] = [
        "ORDERING",
        "DRAG_DROP",
        "NUMERIC",
        "NUMERIC_TOLERANCE",
        "MATCHING",
        "CLASSIFICATION",
        "HOTSPOT",
        "SEQUENCE",
        "GRAPH",
        "SIMULATION",
      ];
      if (!validTypes.includes(qType)) {
        errors.push({
          rowNumber: rowNum,
          field: "question_type",
          message: `Unknown type '${row.question_type}'. Defaulting to NUMERIC.`,
          severity: "warning",
        });
      }

      const marks = parseFloat(String(row.marks || 1)) || 1;
      const negMarks = parseFloat(String(row.negative_marks || 0)) || 0;

      const qObj: Question = {
        id: `q_imp_${Date.now()}_${idx}`,
        questionId: row.question_id || `IMP-G6-${String(idx + 1).padStart(3, "0")}`,
        subjectId: (row.subject || "Mathematics").toLowerCase().includes("sci") ? "sub_science" : "sub_math",
        subjectName: row.subject || "Mathematics",
        chapter: row.chapter || "Standard Curriculum",
        topic: row.topic || "Core Problems",
        grade: row.grade || 6,
        section: (row.section as any) || "Mathematical Reasoning",
        questionText: String(row.question_text || ""),
        questionType: validTypes.includes(qType) ? qType : "NUMERIC",
        difficulty: (row.difficulty?.toUpperCase() as QuestionDifficulty) || "MEDIUM",
        marks,
        negativeMarks: negMarks,
        explanation: row.explanation || "Calculated according to standard Olympiad principles.",
        version: 1,
        status: "Published",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (qObj.questionType === "NUMERIC") {
        qObj.numericConfig = {
          correctValue: parseFloat(String(row.answer || 0)) || 0,
          tolerance: parseFloat(String(row.answer_tolerance || 0)) || 0,
          showKeypad: true,
        };
      } else if (qObj.questionType === "ORDERING") {
        qObj.orderingConfig = {
          instruction: "Drag cards into ascending sequence.",
          items: [
            { id: "1", label: "2.4" },
            { id: "2", label: "7.8" },
            { id: "3", label: "15.1" },
            { id: "4", label: "29.0" },
          ],
          correctOrder: ["1", "2", "3", "4"],
        };
      } else if (qObj.questionType === "SIMULATION") {
        qObj.simulationConfig = {
          simulationType: "rocket_altitude",
          parameterName: "Initial Velocity",
          parameterUnit: "km/h",
          defaultVal: 1500,
          minVal: 500,
          maxVal: 5000,
          step: 100,
          targetCondition: { minSuccessValue: 2800, description: "Surpasses 250 km altitude" },
        };
      }

      return {
        rowNumber: rowNum,
        raw: row,
        question: qObj,
        isValid: errors.filter((e) => e.severity === "error").length === 0,
        errors,
      };
    });

    setParsedResults(results);
  };

  const handleDownloadSample = () => {
    const sampleData = [
      {
        question_id: "MAT-G6-101",
        subject: "Mathematics",
        chapter: "Algebra & Patterns",
        topic: "Linear Equations",
        grade: 6,
        section: "Mathematical Reasoning",
        question_text: "If 4x - 12 = 36, calculate the exact value of x.",
        question_type: "NUMERIC",
        difficulty: "EASY",
        marks: 1,
        negative_marks: 0,
        answer: "12",
        answer_tolerance: "0",
        explanation: "4x = 48 -> x = 12.",
      },
      {
        question_id: "SCI-G6-102",
        subject: "Science",
        chapter: "Motion & Space",
        topic: "Velocity",
        grade: 6,
        section: "Achievers Section",
        question_text: "Adjust the rocket launch speed to cross the orbital altitude checkpoint of 250 km.",
        question_type: "SIMULATION",
        difficulty: "ACHIEVER",
        marks: 3,
        negative_marks: 0.5,
        answer: "2800",
        explanation: "Kinetic energy threshold requires at least 2800 km/h.",
      },
    ];

    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Questions_Template");
    XLSX.writeFile(wb, "olympiad_questions_sample_template.xlsx");
  };

  const handlePublishAllValid = async () => {
    const validQuestions = parsedResults.filter((r) => r.isValid && r.question).map((r) => r.question as Question);
    if (validQuestions.length === 0) {
      alert("No valid questions to publish.");
      return;
    }

    try {
      const { questionRepository } = await import("@/repositories");
      for (const q of validQuestions) {
        await questionRepository.saveQuestion(q);
      }
      setPublishedCount(validQuestions.length);
    } catch (err) {
      console.error("Failed to publish imported questions:", err);
      alert("Failed to publish questions.");
    }
  };

  const validCount = parsedResults.filter((r) => r.isValid).length;
  const warningCount = parsedResults.reduce(
    (acc, r) => acc + r.errors.filter((e) => e.severity === "warning").length,
    0
  );
  const errorCount = parsedResults.filter((r) => !r.isValid).length;

  return (
    <div className="flex-1 flex flex-col w-full min-w-0 bg-[#F4F7EE]">
      <AdminHeader
        title="Excel & CSV Spreadsheet Ingestion Studio"
        subtitle="Batch upload question sheets, validate data schemas, review student previews, and publish to Question Bank"
      />

      <div className="p-6 lg:p-8 space-y-6 w-full max-w-[1750px] min-w-0">
        {/* Upload Banner */}
        <div className="bg-white border-2 border-[#D4E0C2] rounded-2xl p-6 lg:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-xl font-black text-slate-900">Upload Examination Spreadsheet</h2>
            <p className="text-[14px] text-slate-600 leading-relaxed max-w-2xl font-medium">
              Supports standardized <code className="font-mono font-extrabold text-[#547322] bg-[#F4F7EE] px-2 py-0.5 rounded border border-[#D4E0C2]">.xlsx</code>, <code className="font-mono font-extrabold text-[#547322] bg-[#F4F7EE] px-2 py-0.5 rounded border border-[#D4E0C2]">.xls</code>, and <code className="font-mono font-extrabold text-[#547322] bg-[#F4F7EE] px-2 py-0.5 rounded border border-[#D4E0C2]">.csv</code> spreadsheets. Schema validation ensures questions conform to Olympiad data contracts before publication.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={handleDownloadSample}
              className="h-[46px] px-5 bg-[#F4F7EE] hover:bg-[#EBF1E4] border-2 border-[#D4E0C2] text-[#3E5519] text-[14px] font-extrabold rounded-xl flex items-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#547322]" /> Download Template .xlsx
            </button>

            <label className="h-[46px] px-6 bg-[#547322] hover:bg-[#435C1B] text-white text-[14px] font-extrabold rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all">
              <Upload className="w-4 h-4" /> Choose Spreadsheet File
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Diagnostics Summary */}
        {parsedResults.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white border-2 border-[#D4E0C2] rounded-2xl p-5 shadow-sm">
              <div className="text-[12px] font-extrabold text-slate-500 uppercase tracking-wider">
                Total Rows Parsed
              </div>
              <div className="text-3xl font-black font-mono text-slate-900 mt-1">
                {parsedResults.length}
              </div>
            </div>

            <div className="bg-white border-2 border-[#D4E0C2] rounded-2xl p-5 shadow-sm">
              <div className="text-[12px] font-extrabold text-[#547322] uppercase tracking-wider">
                Valid Questions
              </div>
              <div className="text-3xl font-black font-mono text-[#547322] mt-1">
                {validCount}
              </div>
            </div>

            <div className="bg-white border-2 border-[#FDE68A] rounded-2xl p-5 shadow-sm">
              <div className="text-[12px] font-extrabold text-[#92400E] uppercase tracking-wider">
                Warnings Flagged
              </div>
              <div className="text-3xl font-black font-mono text-[#D97706] mt-1">
                {warningCount}
              </div>
            </div>

            <div className="bg-white border-2 border-rose-200 rounded-2xl p-5 shadow-sm">
              <div className="text-[12px] font-extrabold text-[#C62828] uppercase tracking-wider">
                Invalid Rows
              </div>
              <div className="text-3xl font-black font-mono text-[#C62828] mt-1">
                {errorCount}
              </div>
            </div>
          </div>
        )}

        {/* Approval Action Bar */}
        {parsedResults.length > 0 && (
          <div className="bg-[#FEFDF5] border-2 border-[#FDE68A] rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3 text-[14px] text-slate-900 font-extrabold">
              <FileSpreadsheet className="w-5 h-5 text-[#547322]" />
              <span>Loaded &quot;{fileName}&quot; — {validCount} validated questions ready for verification.</span>
            </div>

            <button
              type="button"
              onClick={handlePublishAllValid}
              disabled={validCount === 0 || publishedCount !== null}
              className="h-[46px] px-6 bg-[#547322] hover:bg-[#435C1B] disabled:opacity-50 text-white rounded-xl text-[14px] font-extrabold flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              {publishedCount !== null ? (
                <>
                  <Check className="w-5 h-5" /> Published {publishedCount} Questions to Bank!
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Approve & Publish {validCount} Questions
                </>
              )}
            </button>
          </div>
        )}

        {/* Ingested Rows Table */}
        {parsedResults.length > 0 && (
          <div className="bg-white border-2 border-[#D4E0C2] rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-[#F4F7EE] border-b-2 border-[#D4E0C2]">
              <h3 className="text-base font-black text-[#3E5519]">Parsed Question Rows</h3>
              <p className="text-[13px] text-slate-500 font-semibold">
                Click Preview on any row to test student solving behavior before publishing
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[14px] border-collapse">
                <thead>
                  <tr className="bg-[#F4F7EE] border-b border-[#D4E0C2] text-slate-600 font-extrabold text-[12px] uppercase tracking-wider">
                    <th className="py-4 px-6 w-[80px]">Row</th>
                    <th className="py-4 px-6 w-[140px]">Code</th>
                    <th className="py-4 px-6 min-w-[340px]">Question Prompt</th>
                    <th className="py-4 px-6 w-[160px]">Type</th>
                    <th className="py-4 px-6 w-[160px]">Subject</th>
                    <th className="py-4 px-6 w-[200px]">Validation Status</th>
                    <th className="py-4 px-6 text-right w-[140px]">Preview</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D4E0C2]">
                  {parsedResults.map((item) => (
                    <tr key={item.rowNumber} className="hover:bg-[#F4F7EE]/60 h-[72px]">
                      <td className="py-4 px-6 font-mono font-bold text-slate-400">#{item.rowNumber}</td>
                      <td className="py-4 px-6 font-mono font-extrabold text-[#3E5519]">
                        {item.question?.questionId}
                      </td>
                      <td className="py-4 px-6 max-w-md truncate font-extrabold text-slate-900">
                        {item.question?.questionText}
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 bg-[#FEF3C7] text-[#92400E] rounded-lg font-extrabold text-[12px] border border-[#FDE68A]">
                          {item.question?.questionType}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-700 font-bold">{item.question?.subjectName}</td>
                      <td className="py-4 px-6">
                        {item.isValid ? (
                          <span className="inline-flex items-center gap-1.5 text-[#547322] font-extrabold text-[13px]">
                            <CheckCircle2 className="w-4 h-4" /> Valid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[#C62828] font-extrabold text-[13px]">
                            <XCircle className="w-4 h-4" /> Invalid
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedPreview(item.question as Question)}
                          className="h-[36px] px-3.5 bg-[#F4F7EE] hover:bg-[#EBF1E4] border border-[#D4E0C2] text-[#3E5519] rounded-xl text-[13px] font-extrabold inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#547322]" /> Preview
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Live Student Preview Modal */}
        {selectedPreview && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border-2 border-[#D4E0C2] shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 lg:p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#D4E0C2]">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Imported Question Preview: {selectedPreview.questionId}
                  </h3>
                  <p className="text-[13px] text-slate-500 font-bold">
                    {selectedPreview.subjectName} • {selectedPreview.questionType}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPreview(null)}
                  className="p-2 text-slate-400 hover:text-slate-900 hover:bg-[#F4F7EE] rounded-xl cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 bg-[#FAF7ED] rounded-xl border-2 border-[#FDE68A]">
                <QuestionRenderer
                  question={selectedPreview}
                  value={null}
                  onChange={() => {}}
                  readOnly={false}
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPreview(null)}
                  className="h-[42px] px-6 bg-[#547322] text-white text-[14px] font-extrabold rounded-xl hover:bg-[#435C1B] cursor-pointer"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

