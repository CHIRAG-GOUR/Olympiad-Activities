"use client";

import React, { useRef, useState } from "react";
import { Upload, FileSpreadsheet, Download, Printer, CheckCircle2, AlertTriangle, X, Users } from "lucide-react";
import { parseRoster, studentCode, ROSTER_TEMPLATE_ROWS, type ParsedRoster } from "@/lib/students/roster";
import { provisionStudents, type ProvisionResult } from "@/services/students/StudentProvisioningService";
import { openLoginCards, type LoginCard } from "@/lib/students/loginCards";

type Step = "choose" | "review" | "creating" | "done";

const portalUrl = () =>
  typeof window !== "undefined" ? `${window.location.origin}/login` : "https://the-olympiad-dashboard.web.app/login";

const STATUS_STYLE: Record<ProvisionResult["status"], string> = {
  created: "bg-emerald-100 text-emerald-800",
  updated: "bg-blue-100 text-blue-800",
  failed: "bg-rose-100 text-rose-800",
  skipped: "bg-amber-100 text-amber-800",
};

/**
 * Upload a class list (CSV or Excel: name, email, class, section) and create every
 * student's account in one go, then print their login cards.
 */
export function BulkStudentUpload({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [step, setStep] = useState<Step>("choose");
  const [fileName, setFileName] = useState("");
  const [roster, setRoster] = useState<ParsedRoster | null>(null);
  const [schoolName, setSchoolName] = useState("");
  const [readError, setReadError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ProvisionResult[]>([]);
  const [runError, setRunError] = useState<string | null>(null);
  const [popupBlocked, setPopupBlocked] = useState(false);
  const rawRows = useRef<Record<string, unknown>[]>([]);

  const readFile = async (file: File) => {
    setReadError(null);
    setFileName(file.name);
    try {
      const XLSX = await import("xlsx");
      const wb = XLSX.read(await file.arrayBuffer(), { type: "array" });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "", raw: false });
      if (rows.length === 0) {
        setReadError("That file has no rows under the heading row.");
        return;
      }
      rawRows.current = rows;
      setRoster(parseRoster(rows, { schoolName }));
      setStep("review");
    } catch {
      setReadError("That file could not be read. Use a .csv or .xlsx file with a heading row.");
    }
  };

  const downloadTemplate = async () => {
    const XLSX = await import("xlsx");
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(ROSTER_TEMPLATE_ROWS);
    ws["!cols"] = [{ wch: 24 }, { wch: 30 }, { wch: 7 }, { wch: 9 }];
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, "Student_Upload_Template.xlsx");
  };

  const create = async () => {
    if (!roster || roster.entries.length === 0) return;
    setStep("creating");
    setProgress(0);
    setRunError(null);
    const entries = roster.entries.map((e) => ({ ...e, schoolName: e.schoolName || schoolName.trim() || undefined }));
    try {
      const out = await provisionStudents(entries, (done) => setProgress(done));
      setResults(out);
      onCreated();
    } catch (err) {
      setRunError(err instanceof Error ? err.message : "Accounts could not be created.");
    }
    setStep("done");
  };

  const cards: LoginCard[] = results
    .filter((r) => r.status === "created" && r.password && r.uid)
    .map((r) => ({
      name: r.entry.name,
      email: r.entry.email,
      password: r.password!,
      grade: r.entry.grade,
      section: r.entry.section,
      studentCode: studentCode({ id: r.uid!, grade: r.entry.grade, section: r.entry.section }),
      schoolName: r.entry.schoolName,
    }));

  const downloadCredentials = async () => {
    const XLSX = await import("xlsx");
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(
      results.map((r) => ({
        Name: r.entry.name,
        Email: r.entry.email,
        Class: r.entry.grade,
        Section: r.entry.section,
        "Student ID": r.uid ? studentCode({ id: r.uid, grade: r.entry.grade, section: r.entry.section }) : "",
        Password: r.password || (r.status === "updated" ? "(existing password)" : ""),
        Status: r.status,
        Note: r.message || "",
      }))
    );
    ws["!cols"] = [{ wch: 24 }, { wch: 30 }, { wch: 7 }, { wch: 8 }, { wch: 16 }, { wch: 16 }, { wch: 9 }, { wch: 50 }];
    XLSX.utils.book_append_sheet(wb, ws, "Accounts");
    XLSX.writeFile(wb, `Student_Accounts_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const counts = {
    created: results.filter((r) => r.status === "created").length,
    updated: results.filter((r) => r.status === "updated").length,
    failed: results.filter((r) => r.status === "failed").length,
    skipped: results.filter((r) => r.status === "skipped").length,
  };

  return (
    <div className="fixed inset-0 bg-black/55 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-5">
      <div role="dialog" aria-modal="true" aria-labelledby="bulk-title" className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EAF2FC] text-[#2468B2] flex items-center justify-center border border-blue-200">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#2468B2] uppercase tracking-wider">Bulk upload</span>
              <h3 id="bulk-title" className="text-base sm:text-lg font-black text-slate-900 leading-tight">Add students from a class list</h3>
            </div>
          </div>
          {step !== "creating" && (
            <button type="button" onClick={onClose} aria-label="Close" className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {step === "choose" && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Upload a <strong>CSV or Excel</strong> file with the columns <strong>Name, Email, Class, Section</strong>. An optional
              <strong> Password</strong> column is used if present; otherwise a password is generated for each student.
            </p>
            <label className="block border-2 border-dashed border-slate-300 hover:border-[#2468B2] rounded-2xl p-8 text-center cursor-pointer transition-colors">
              <Upload className="w-8 h-8 text-[#2468B2] mx-auto" />
              <span className="block mt-2 text-sm font-bold text-slate-800">Choose a .csv or .xlsx file</span>
              <span className="block text-xs text-slate-500">{fileName || "The first sheet is read; the first row must be headings."}</span>
              <input
                type="file"
                accept=".csv,.xlsx,.xls,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void readFile(f);
                  e.target.value = "";
                }}
              />
            </label>
            {readError && <p role="alert" className="text-xs font-semibold text-rose-700">{readError}</p>}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button type="button" onClick={downloadTemplate} className="h-9 px-3.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1.5 cursor-pointer">
                <Download className="w-3.5 h-3.5" /> Download template
              </button>
              <div className="flex items-center gap-2">
                <label htmlFor="bulk-school" className="text-xs font-bold text-slate-600">School (optional)</label>
                <input
                  id="bulk-school"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="Used when the file has no School column"
                  className="h-9 w-64 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#2468B2]"
                />
              </div>
            </div>
          </div>
        )}

        {step === "review" && roster && (
          <div className="flex-1 min-h-0 flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">{roster.entries.length} ready</span>
              {roster.problems.length > 0 && (
                <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200">{roster.problems.length} rows need fixing</span>
              )}
              <span className="text-slate-500 font-medium">from {fileName}</span>
            </div>
            {roster.problems.length > 0 && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 max-h-32 overflow-y-auto">
                <p className="text-xs font-bold text-rose-800 mb-1 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> These rows will be skipped. Fix them in the file and upload again to include them.
                </p>
                <ul className="text-[11.5px] text-rose-900 space-y-0.5">
                  {roster.problems.map((p) => (
                    <li key={p.row}>Row {p.row}: {p.message}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex-1 min-h-0 overflow-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider sticky top-0">
                  <tr>
                    <th className="py-2 px-3">Row</th>
                    <th className="py-2 px-3">Name</th>
                    <th className="py-2 px-3">Email</th>
                    <th className="py-2 px-3">Class</th>
                    <th className="py-2 px-3">Password</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {roster.entries.map((e) => (
                    <tr key={e.row}>
                      <td className="py-1.5 px-3 font-mono text-slate-400">{e.row}</td>
                      <td className="py-1.5 px-3 font-bold text-slate-900">{e.name}</td>
                      <td className="py-1.5 px-3 font-mono">{e.email}</td>
                      <td className="py-1.5 px-3 font-bold">{e.grade}{e.section ? `-${e.section}` : ""}</td>
                      <td className="py-1.5 px-3 text-slate-500">{e.password ? "from file" : "generated"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between gap-2 pt-1">
              <button type="button" onClick={() => setStep("choose")} className="h-10 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 cursor-pointer">
                Choose another file
              </button>
              <button
                type="button"
                disabled={roster.entries.length === 0}
                onClick={create}
                className="h-10 px-5 rounded-xl bg-[#2468B2] hover:bg-[#1C5190] text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Create {roster.entries.length} student account{roster.entries.length === 1 ? "" : "s"}
              </button>
            </div>
          </div>
        )}

        {step === "creating" && roster && (
          <div className="py-8 text-center space-y-3" role="status">
            <p className="text-sm font-bold text-slate-800">
              Creating accounts… {progress} of {roster.entries.length}
            </p>
            <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden max-w-md mx-auto">
              <div className="h-full bg-[#2468B2] transition-all" style={{ width: `${(progress / Math.max(1, roster.entries.length)) * 100}%` }} />
            </div>
            <p className="text-xs text-slate-500">Keep this window open until it finishes.</p>
          </div>
        )}

        {step === "done" && (
          <div className="flex-1 min-h-0 flex flex-col gap-3">
            {runError ? (
              <p role="alert" className="text-sm font-semibold text-rose-700">{runError}</p>
            ) : (
              <div className="flex flex-wrap gap-2 text-xs font-bold">
                <span className={`px-2.5 py-1 rounded-lg ${STATUS_STYLE.created}`}>{counts.created} created</span>
                {counts.updated > 0 && <span className={`px-2.5 py-1 rounded-lg ${STATUS_STYLE.updated}`}>{counts.updated} already registered (updated)</span>}
                {counts.failed > 0 && <span className={`px-2.5 py-1 rounded-lg ${STATUS_STYLE.failed}`}>{counts.failed} failed</span>}
                {counts.skipped > 0 && <span className={`px-2.5 py-1 rounded-lg ${STATUS_STYLE.skipped}`}>{counts.skipped} not attempted</span>}
              </div>
            )}
            {cards.length > 0 && (
              <p className="text-xs font-semibold text-amber-900 bg-amber-50 border border-amber-200 rounded-xl p-2.5">
                Passwords are shown only now and are not stored. Print the login cards or download the Excel file before closing.
              </p>
            )}
            <div className="flex-1 min-h-0 overflow-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider sticky top-0">
                  <tr>
                    <th className="py-2 px-3">Name</th>
                    <th className="py-2 px-3">Class</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3">Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {results.map((r) => (
                    <tr key={r.entry.row}>
                      <td className="py-1.5 px-3">
                        <span className="font-bold text-slate-900 block">{r.entry.name}</span>
                        <span className="font-mono text-[10.5px] text-slate-500">{r.entry.email}</span>
                      </td>
                      <td className="py-1.5 px-3 font-bold">{r.entry.grade}{r.entry.section ? `-${r.entry.section}` : ""}</td>
                      <td className="py-1.5 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${STATUS_STYLE[r.status]}`}>{r.status}</span>
                      </td>
                      <td className="py-1.5 px-3 text-slate-600">{r.message || ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {popupBlocked && (
              <p role="alert" className="text-xs font-semibold text-rose-700">
                Your browser blocked the cards tab. Allow pop-ups for this site, then try again.
              </p>
            )}
            <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
              {results.length > 0 && (
                <button type="button" onClick={downloadCredentials} className="h-10 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1.5 cursor-pointer">
                  <FileSpreadsheet className="w-4 h-4" /> Download accounts (Excel)
                </button>
              )}
              {cards.length > 0 && (
                <button
                  type="button"
                  onClick={() => setPopupBlocked(!openLoginCards(cards, portalUrl()))}
                  className="h-10 px-4 rounded-xl bg-[#2468B2] hover:bg-[#1C5190] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" /> Print {cards.length} login card{cards.length === 1 ? "" : "s"}
                </button>
              )}
              <button type="button" onClick={onClose} className="h-10 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 cursor-pointer">
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
