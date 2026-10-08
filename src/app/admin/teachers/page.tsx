"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { userRepository, examRepository } from "@/repositories";
import { UserProfile } from "@/lib/auth/rbac";
import { Exam } from "@/types/exam";
import {
  Users,
  Search,
  Plus,
  BookOpen,
  CheckCircle2,
  FileCheck2,
  ShieldCheck,
  Mail,
  Award,
  Send,
  Key,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  Sparkles,
  History,
  Lock,
} from "lucide-react";
import {
  TeacherInvitationService,
  StoredInvitation,
} from "@/services/email/TeacherInvitationService";
import type { TeacherInvitationData } from "@/lib/email/invitationTemplate";

const portalUrl = () =>
  typeof window !== "undefined" ? `${window.location.origin}/login` : "https://the-olympiad-dashboard.web.app/login";

const DELIVERY_LABEL: Record<string, { label: string; className: string }> = {
  queued: { label: "Queued", className: "bg-amber-100 text-amber-800" },
  sending: { label: "Sending", className: "bg-blue-100 text-blue-800" },
  sent: { label: "Delivered", className: "bg-emerald-100 text-emerald-800" },
  failed: { label: "Failed", className: "bg-rose-100 text-rose-800" },
};

function generateSecurePassword(): string {
  const chars = "abcdefghijkmnpqrstuvwxyz";
  const uppers = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const numbers = "23456789";
  const symbols = "!@#$%&*";
  
  const rand = (set: string) => set[Math.floor(Math.random() * set.length)];
  let pwd = "";
  pwd += rand(uppers);
  pwd += rand(chars);
  pwd += rand(numbers);
  pwd += rand(symbols);
  for (let i = 0; i < 4; i++) {
    const all = chars + uppers + numbers;
    pwd += rand(all);
  }
  return `Oly@${pwd}`;
}

export default function TeachersDirectoryPage() {
  const router = useRouter();
  const { user, switchRole } = useAuth();
  const [teachers, setTeachers] = useState<UserProfile[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [invitations, setInvitations] = useState<StoredInvitation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"directory" | "invitations">("directory");

  // Invitation Modal State
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteSubject, setInviteSubject] = useState("Mathematics");
  const [inviteClasses, setInviteClasses] = useState<number[]>([6, 7, 8]);
  const [invitePassword, setInvitePassword] = useState(generateSecurePassword());
  const [isSubmittingInvite, setIsSubmittingInvite] = useState(false);

  // Success Banner State
  const [successBanner, setSuccessBanner] = useState<{
    message: string;
    email: string;
    tone?: "success" | "error";
  } | null>(null);
  const [sendingEmailForId, setSendingEmailForId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [uList, exList, invList] = await Promise.all([
        userRepository.listUsers(),
        examRepository.listExams(),
        TeacherInvitationService.listInvitations(),
      ]);
      setTeachers(uList.filter((u) => u.role === "TEACHER" || u.role === "SUPER_ADMIN"));
      setExams(exList);
      setInvitations(invList);
    } catch (err) {
      console.error("Failed to load teachers and invitations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenInviteModal = (presetTeacher?: UserProfile) => {
    if (presetTeacher) {
      setInviteName(presetTeacher.name);
      setInviteEmail(presetTeacher.email || "");
      setInviteSubject((presetTeacher.metadata?.subject as string) || "Mathematics");
      setInviteClasses((presetTeacher.metadata?.assignedClasses as number[]) || [6, 7, 8]);
    } else {
      setInviteName("");
      setInviteEmail("");
      setInviteSubject("Mathematics");
      setInviteClasses([6, 7, 8]);
    }
    setInvitePassword(generateSecurePassword());
    setShowInviteModal(true);
  };

  const toggleClass = (c: number) => {
    setInviteClasses((prev) =>
      prev.includes(c) ? (prev.length > 1 ? prev.filter((x) => x !== c) : prev) : [...prev, c].sort()
    );
  };

  const handleSendInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    setIsSubmittingInvite(true);
    const teacherId = `tea_${inviteEmail.trim().split("@")[0].replace(/[^a-zA-Z0-9]/g, "_")}`;

    try {
      // The invitation goes to the address typed here — and only there.
      const res = await TeacherInvitationService.inviteTeacher({
        teacherName: inviteName.trim(),
        teacherEmail: inviteEmail.trim().toLowerCase(),
        teacherId,
        temporaryPassword: invitePassword,
        subjectName: inviteSubject,
        assignedClasses: inviteClasses,
        invitedBy: user?.name || "Super Administrator",
        portalUrl: portalUrl(),
      });

      setShowInviteModal(false);
      setSuccessBanner({ message: res.message, email: res.invitation.teacherEmail, tone: "success" });
      setActiveTab("invitations");
      await loadData();
    } catch (err) {
      setSuccessBanner({
        message: err instanceof Error ? err.message : "The invitation could not be sent. Please try again.",
        email: inviteEmail.trim(),
        tone: "error",
      });
    } finally {
      setIsSubmittingInvite(false);
    }
  };

  /** Re-sends the themed invitation to that one address. Never a password reset. */
  const handleResendInvitation = async (data: TeacherInvitationData, id: string) => {
    setSendingEmailForId(id);
    try {
      const res = await TeacherInvitationService.resendInvitation({ ...data, portalUrl: portalUrl() });
      setSuccessBanner({ message: res.message, email: data.teacherEmail, tone: "success" });
      await loadData();
    } catch (err) {
      setSuccessBanner({
        message: err instanceof Error ? err.message : "The invitation could not be sent. Please try again.",
        email: data.teacherEmail,
        tone: "error",
      });
    } finally {
      setSendingEmailForId(null);
    }
  };

  /** Invitation details for a directory row: the latest invitation, else the profile. */
  const invitationFor = (t: UserProfile): TeacherInvitationData => {
    const last = invitations.find((i) => i.teacherEmail === (t.email || "").toLowerCase());
    if (last) return last;
    return {
      teacherName: t.name,
      teacherEmail: t.email,
      teacherId: (t.metadata?.teacherCode as string) || t.id,
      temporaryPassword: "",
      subjectName: (t.metadata?.subject as string) || "Mathematics",
      assignedClasses: (t.metadata?.assignedClasses as number[]) || [6, 7, 8],
      invitedBy: user?.name || "Super Administrator",
      existingAccount: true,
    };
  };

  const filteredTeachers = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.email && t.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-rise-in font-sans text-[#182338]">
      {/* 1. Header Banner */}
      <div className="bg-white/80 backdrop-blur-sm border border-white/80 shadow-[0_1px_0_0_rgba(255,255,255,0.7)_inset,0_2px_10px_-4px_rgba(38,45,90,0.10)] rounded-2xl px-6 sm:px-7 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#2468B2]">
            <Mail className="w-3.5 h-3.5" />
            <span>Faculty Management &amp; Mail Dispatch</span>
            <span className="text-[#667085]">•</span>
            <span>Super Administrator Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#182338] mt-1">
            Faculty Roster &amp; Mail Access
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] mt-1 font-medium max-w-2xl">
            Invite teachers via themed official email directives, dispatch auto-generated credentials, and manage examiner permissions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => handleOpenInviteModal()}
            className="h-10 px-4 bg-[#2468B2] hover:bg-[#1C5190] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Invite Faculty via Email</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successBanner && (
        <div
          role={successBanner.tone === "error" ? "alert" : "status"}
          className={`border rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xs animate-rise-in ${
            successBanner.tone === "error"
              ? "bg-rose-50 border-rose-200 text-rose-950"
              : "bg-emerald-50 border-emerald-200 text-emerald-950"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-xl text-white flex items-center justify-center font-bold shrink-0 ${
                successBanner.tone === "error" ? "bg-rose-600" : "bg-emerald-600"
              }`}
            >
              {successBanner.tone === "error" ? <Mail className="w-4 h-4 text-white" /> : <Check className="w-4 h-4 text-white" />}
            </div>
            <div>
              <p className="text-xs font-bold">{successBanner.message}</p>
              {successBanner.tone !== "error" && (
                <p className="text-[11px] text-emerald-700">
                  Delivery status for {successBanner.email} is shown under Mail Invitations History.
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSuccessBanner(null)}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 transition-colors cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 2. Mode Tabs */}
      <div className="bg-white border border-[#E1E7EF] rounded-2xl p-2 shadow-xs flex items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("directory")}
          className={`h-9 px-4 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer border ${
            activeTab === "directory"
              ? "bg-[#2468B2] text-white border-[#2468B2] shadow-xs"
              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Faculty Directory ({teachers.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("invitations")}
          className={`h-9 px-4 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer border ${
            activeTab === "invitations"
              ? "bg-[#0F172A] text-white border-[#0F172A] shadow-xs"
              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Mail Invitations History ({invitations.length})</span>
        </button>
      </div>

      {/* 3. DIRECTORY TAB */}
      {activeTab === "directory" && (
        <div className="space-y-6">
          {/* Search Toolbar */}
          <div className="bg-[#FFFFFF] border border-[#E1E7EF] rounded-2xl p-4 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full min-w-[260px]">
              <Search className="w-4 h-4 text-[#667085] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search faculty by name, ID, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-9 pl-9 pr-3 text-xs bg-[#F4F7FB]/60 border border-[#E1E7EF] rounded-xl text-[#182338] font-semibold focus:outline-none focus:border-[#2468B2] focus:bg-white"
              />
            </div>

            <span className="text-xs font-bold text-[#667085] px-2">
              Showing <strong className="text-[#2468B2]">{filteredTeachers.length}</strong> faculty members
            </span>
          </div>

          {/* Teachers Table */}
          <div className="bg-[#FFFFFF] border border-[#E1E7EF] rounded-2xl shadow-subtle overflow-hidden">
            {filteredTeachers.length === 0 ? (
              <div className="py-16 px-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#EAF2FC] text-[#2468B2] flex items-center justify-center mx-auto border border-[#E1E7EF]">
                  <Users className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#182338]">No Faculty Members Found</h3>
                  <p className="text-xs text-[#667085] max-w-md mx-auto">
                    Invite faculty members to authorize examiners to compile test papers and align them to students.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => handleOpenInviteModal()}
                    className="h-9 px-4 bg-[#2468B2] hover:bg-[#1C5190] text-white rounded-xl text-xs font-bold shadow-subtle inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Invite First Teacher</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto w-full">
                <table className="w-full min-w-[980px] text-left text-xs font-semibold">
                  <thead className="bg-[#F4F7FB] text-[#667085] border-b border-[#E1E7EF] uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-3.5 w-[200px]">Faculty Member</th>
                      <th className="py-3 px-3 w-[140px]">Teacher ID</th>
                      <th className="py-3 px-3 w-[120px]">Subject</th>
                      <th className="py-3 px-3 min-w-[170px]">Official Email</th>
                      <th className="py-3 px-2 w-[100px] text-center">Classes</th>
                      <th className="py-3 px-2 w-[85px] text-center">Role</th>
                      <th className="py-3 px-3 w-[260px] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E1E7EF] text-[#182338]">
                    {filteredTeachers.map((t) => {
                      const subject = (t.metadata?.subject as string) || "Mathematics";
                      const classes = (t.metadata?.assignedClasses as number[]) || [6, 7, 8];

                      return (
                        <tr key={t.id} className="hover:bg-white/70 transition-colors">
                          <td className="py-3 px-3.5">
                            <div className="font-bold text-xs text-[#182338] truncate max-w-[190px]" title={t.name}>
                              {t.name}
                            </div>
                            <div className="text-[10px] text-[#667085]">Olympiad Dashboard Faculty</div>
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-mono font-bold text-xs text-[#2468B2] bg-[#EAF2FC] px-2 py-0.5 rounded-md border border-[#E1E7EF] inline-block">
                              {t.id}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 inline-block">
                              {subject}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-[#667085] text-xs font-mono truncate max-w-[170px]" title={t.email}>
                            {t.email || "faculty@olympiad.org"}
                          </td>
                          <td className="py-3 px-2 text-center">
                            <div className="flex items-center justify-center gap-1">
                              {classes.map((c) => (
                                <span key={c} className="px-1.5 py-0.2 rounded font-bold text-[10px] bg-slate-100 text-slate-700">
                                  {c}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-2 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9.5px] font-bold uppercase ${
                                t.role === "SUPER_ADMIN"
                                  ? "bg-purple-100 text-purple-800 border border-purple-200"
                                  : "bg-[#EAF2FC] text-[#1C5190] border border-[#E1E7EF]"
                              }`}
                            >
                              {t.role === "SUPER_ADMIN" ? "Admin" : "Teacher"}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right whitespace-nowrap">
                            <div className="inline-flex items-center justify-end gap-1.5">
                              {t.role === "TEACHER" && t.email && (
                                <button
                                  type="button"
                                  disabled={sendingEmailForId === t.id}
                                  onClick={() => handleResendInvitation(invitationFor(t), t.id)}
                                  className="h-7 px-2.5 bg-blue-50 hover:bg-blue-100 text-[#2468B2] border border-blue-200 rounded-lg text-[11px] font-bold transition-all inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                  title={`Send the faculty invitation to ${t.email}`}
                                >
                                  <Send className="w-3 h-3" />
                                  <span>{sendingEmailForId === t.id ? "Sending..." : "Resend Invitation"}</span>
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => {
                                  switchRole("TEACHER");
                                  router.push("/teacher/dashboard");
                                }}
                                className="h-7 px-2.5 bg-[#FFF4E5] hover:bg-[#FFE6C2] text-[#B54708] border border-[#FEDF89] rounded-lg text-[11px] font-bold transition-all inline-flex items-center gap-1 cursor-pointer shrink-0"
                                title="Login and view platform as Teacher"
                              >
                                <ShieldCheck className="w-3 h-3" />
                                <span>Switch</span>
                              </button>

                              <Link
                                href="/admin/exams"
                                className="h-7 px-2.5 bg-[#EAF2FC] hover:bg-[#E1E7EF] text-[#1C5190] rounded-lg text-[11px] font-bold transition-all inline-flex items-center shrink-0"
                              >
                                Papers
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. INVITATIONS HISTORY TAB */}
      {activeTab === "invitations" && (
        <div className="space-y-4">
          <div className="bg-white border border-[#E1E7EF] rounded-2xl shadow-subtle overflow-hidden">
            {invitations.length === 0 ? (
              <div className="py-16 px-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#182338]">No Invitations Sent Yet</h3>
                  <p className="text-xs text-[#667085] max-w-md mx-auto">
                    Click &ldquo;Invite Faculty via Email&rdquo; above to dispatch your first official invitation directive.
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto w-full">
                <table className="w-full min-w-[900px] text-left text-xs font-semibold">
                  <thead className="bg-[#F4F7FB] text-[#667085] border-b border-[#E1E7EF] uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-3.5">Recipient</th>
                      <th className="py-3 px-3">Subject &amp; Classes</th>
                      <th className="py-3 px-3">Password Issued</th>
                      <th className="py-3 px-3">Email Status</th>
                      <th className="py-3 px-3">Sent At</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E1E7EF]">
                    {invitations.map((inv) => (
                      <tr key={inv.invitationId} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3.5">
                          <div className="font-bold text-slate-900">{inv.teacherName}</div>
                          <div className="text-[11px] font-mono text-slate-500">{inv.teacherEmail}</div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-bold text-slate-800">{inv.subjectName}</span>
                          <span className="text-[10px] text-slate-500 block">
                            Classes: {(inv.assignedClasses || []).join(", ")}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-mono text-xs font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {inv.temporaryPassword}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          {(() => {
                            const d = DELIVERY_LABEL[inv.delivery || "queued"] || DELIVERY_LABEL.queued;
                            return (
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${d.className}`}
                                title={inv.deliveryError || undefined}
                              >
                                {inv.mailId ? d.label : "Not sent"}
                              </span>
                            );
                          })()}
                        </td>
                        <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                          {new Date(inv.createdAt).toLocaleString([], {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            disabled={sendingEmailForId === inv.invitationId}
                            onClick={() => handleResendInvitation(inv, inv.invitationId)}
                            className="h-7 px-3 bg-[#2468B2] hover:bg-[#1C5190] text-white rounded-lg text-[11px] font-bold cursor-pointer inline-flex items-center gap-1.5 transition-all disabled:opacity-50"
                            title={`Send the faculty invitation to ${inv.teacherEmail} again`}
                          >
                            <Send className="w-3 h-3" />
                            <span>{sendingEmailForId === inv.invitationId ? "Sending..." : "Resend Invitation"}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. INVITE FACULTY MODAL */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-slate-200 animate-rise-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div>
                <span className="text-[10px] font-bold text-[#2468B2] uppercase tracking-wider">Super Administrator</span>
                <h3 className="text-lg font-black text-slate-900">Invite Faculty Member via Email</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendInvitation} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Faculty Full Name *</label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Dr. Ramesh Gupta"
                  className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:border-[#2468B2] focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Official Email Address *</label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="e.g. faculty.member@olympiad.org"
                  className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:border-[#2468B2] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Primary Subject</label>
                  <select
                    value={inviteSubject}
                    onChange={(e) => setInviteSubject(e.target.value)}
                    className="w-full h-10 px-3 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#2468B2]"
                  >
                    <option value="Mathematics">Mathematics (IMO)</option>
                    <option value="English">English (IEO)</option>
                    <option value="Science">Science (NSO)</option>
                    <option value="Logical Reasoning">Logical Reasoning</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Assigned Classes</label>
                  <div className="flex items-center gap-1.5 h-10">
                    {[6, 7, 8].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleClass(c)}
                        className={`flex-1 h-9 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                          inviteClasses.includes(c)
                            ? "bg-[#2468B2] text-white border-[#2468B2]"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        Cl-{c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Password Generator Field */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">Auto-Generated Temporary Password</label>
                  <button
                    type="button"
                    onClick={() => setInvitePassword(generateSecurePassword())}
                    className="text-[11px] font-bold text-[#2468B2] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Regenerate</span>
                  </button>
                </div>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={invitePassword}
                    onChange={(e) => setInvitePassword(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 text-xs font-mono font-bold bg-slate-100 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#2468B2]"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Included in the invitation email. The teacher can change it later with &ldquo;Forgot Password&rdquo; on the sign-in page.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="h-10 px-4 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingInvite}
                  className="h-11 px-6 bg-[#2468B2] hover:bg-[#1C5190] text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-2 disabled:opacity-60"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmittingInvite ? "Sending Invitation..." : "Send Invitation Email"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
