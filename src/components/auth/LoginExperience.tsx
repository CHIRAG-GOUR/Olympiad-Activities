"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/lib/auth/rbac";
import { homeFor } from "@/lib/auth/roleRoutes";
import { AmbientField } from "@/components/ui/AmbientField";
import { OlympiadBulb } from "@/components/auth/OlympiadBulb";
import { VectorEnvironment } from "@/components/auth/VectorEnvironment";
import { AppLoading } from "@/components/auth/AppLoading";
import {
  ShieldCheck,
  GraduationCap,
  Users,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  Mail,
  CheckCircle2,
  KeyRound,
  ArrowLeft,
  Sparkles,
  School,
  BookOpen,
} from "lucide-react";

type AuthMode = "SIGN_IN" | "SIGN_UP" | "FORGOT_PASSWORD";

const SIGN_IN_ROLES: { id: UserRole; label: string; hint: string; icon: typeof ShieldCheck }[] = [
  { id: "SUPER_ADMIN", label: "Super Admin", hint: "Admin ID or email", icon: ShieldCheck },
  { id: "TEACHER", label: "Teacher", hint: "Teacher email", icon: Users },
  { id: "STUDENT", label: "Student", hint: "Student email", icon: GraduationCap },
];

const SIGN_UP_ROLES: { id: "STUDENT" | "TEACHER"; label: string; desc: string; icon: typeof GraduationCap }[] = [
  { id: "STUDENT", label: "Student / Candidate", desc: "Sit examinations & view instant reports", icon: GraduationCap },
  { id: "TEACHER", label: "Teacher / Educator", desc: "Monitor student records & examination performance", icon: Users },
];

export function LoginExperience() {
  const { signIn, signUp, sendPasswordReset, isAuthenticated, isReady, role: sessionRole } = useAuth();
  const router = useRouter();

  const [mode, setMode] = useState<AuthMode>("SIGN_IN");

  // Sign In State
  const [role, setRole] = useState<UserRole>("SUPER_ADMIN");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Sign Up State
  const [signUpRole, setSignUpRole] = useState<"STUDENT" | "TEACHER">("STUDENT");
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("");
  const [signUpGrade, setSignUpGrade] = useState("6");
  const [signUpSubject, setSignUpSubject] = useState("Mathematics");
  const [signUpSchool, setSignUpSchool] = useState("");

  // Forgot Password State
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [resetMessage, setResetMessage] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Hover & Focus Engagement for Ambient Lighting
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const engaged = hovered || focused;

  useEffect(() => {
    if (isReady && isAuthenticated) router.replace(homeFor(sessionRole));
  }, [isReady, isAuthenticated, sessionRole, router]);

  // Handle Sign In Submit
  const handleSignInSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (busy) return;
      setBusy(true);
      setError(null);

      const outcome = await signIn(email, password, role);
      if (outcome.ok) {
        router.replace(homeFor(role));
        return;
      }
      setError(outcome.message);
      setBusy(false);
    },
    [busy, email, password, role, signIn, router]
  );

  // Handle Sign Up Submit
  const handleSignUpSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (busy) return;
      setError(null);

      if (!signUpName.trim() || !signUpEmail.trim() || !signUpPassword) {
        setError("Please fill in all required fields.");
        return;
      }

      if (signUpPassword.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
      }

      if (signUpPassword !== signUpConfirmPassword) {
        setError("Passwords do not match. Please verify both password entries.");
        return;
      }

      setBusy(true);

      const outcome = await signUp({
        name: signUpName.trim(),
        email: signUpEmail.trim(),
        password: signUpPassword,
        role: signUpRole,
        grade: signUpRole === "STUDENT" ? Number(signUpGrade) || 6 : undefined,
        subject: signUpRole === "TEACHER" ? signUpSubject : undefined,
        schoolName: signUpSchool.trim() || undefined,
      });

      if (outcome.ok) {
        router.replace(homeFor(signUpRole));
        return;
      }

      setError(outcome.message);
      setBusy(false);
    },
    [busy, signUpName, signUpEmail, signUpPassword, signUpConfirmPassword, signUpRole, signUpGrade, signUpSubject, signUpSchool, signUp, router]
  );

  // Handle Forgot Password Submit
  const handleForgotPasswordSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (busy) return;
      if (!resetEmail.trim()) {
        setError("Please enter your registered email address.");
        return;
      }

      setBusy(true);
      setError(null);

      const result = await sendPasswordReset(resetEmail.trim());
      setBusy(false);

      if (result.ok) {
        setResetSent(true);
        setResetMessage(result.message);
      } else {
        setError(result.message);
      }
    },
    [busy, resetEmail, sendPasswordReset]
  );

  if (!isReady || isAuthenticated) return <AppLoading label="Opening your dashboard" />;

  const activeSignInRole = SIGN_IN_ROLES.find((r) => r.id === role) ?? SIGN_IN_ROLES[0];

  return (
    <div className="min-h-dvh flex flex-col font-sans text-[#182338] antialiased">
      <AmbientField />

      <div className="flex-1 flex items-center justify-center p-3 sm:p-6 my-auto">
        <div
          className="
            w-full max-w-[1120px] grid lg:grid-cols-[1fr_1.1fr] overflow-hidden
            bg-white/60 backdrop-blur-2xl border border-white/75
            rounded-[24px] lg:rounded-[32px]
            shadow-[0_1px_0_0_rgba(255,255,255,0.75)_inset,0_24px_60px_-16px_rgba(38,45,90,0.26)]
            animate-panel-in my-4
          "
        >
          {/* ── Olympiad environment illustration ── */}
          <div className="relative order-2 lg:order-1 min-h-[260px] sm:min-h-[320px] lg:min-h-[640px] overflow-hidden bg-gradient-to-br from-[#8067D9]/[0.14] via-white/35 to-[#59B6DE]/[0.18] border-t lg:border-t-0 lg:border-r border-white/70">
            <VectorEnvironment engaged={engaged} />

            <div className="relative h-full flex flex-col items-center justify-center p-6 sm:p-8 text-center">
              <OlympiadBulb
                lit={engaged}
                className={`w-[130px] sm:w-[160px] lg:w-[190px] h-auto transition-transform duration-500 ease-out ${
                  engaged ? "scale-[1.03]" : "scale-100"
                }`}
              />

              <div className="mt-5 sm:mt-7 max-w-[320px]">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 border border-white/90 shadow-2xs text-[11px] font-bold uppercase tracking-wider text-[#2468B2] mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Grade 6 Digital Olympiad
                </div>
                <p
                  className={`text-[12px] font-bold uppercase tracking-[0.14em] transition-colors duration-500 ${
                    engaged ? "text-[#B4791C]" : "text-[#77839A]"
                  }`}
                >
                  {engaged ? "Interactive & Live Evaluated" : "Official Examination Hall"}
                </p>
                <p className="mt-2 text-[13px] text-[#667085] leading-relaxed">
                  Interactive problem environments, 3D simulations, and instant classwise diagnostic score reports.
                </p>
              </div>
            </div>
          </div>

          {/* ── Form panel ── */}
          <div
            className="order-1 lg:order-2 p-6 sm:p-9 lg:p-10 flex flex-col justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocusCapture={() => setFocused(true)}
            onBlurCapture={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocused(false);
            }}
          >
            {/* Brand Logo & Mode Switcher */}
            <div className="flex items-center justify-between gap-3 pb-2">
              <div className="flex items-center gap-2.5">
                <span className="w-10 h-10 rounded-xl bg-[#2468B2] text-white grid place-items-center font-display font-black text-lg shadow-subtle">
                  &Omega;
                </span>
                <span className="leading-tight">
                  <span className="block text-[15px] font-black tracking-[-0.01em]">Olympiad</span>
                  <span className="block text-[11px] font-bold text-[#77839A]">Examination Portal</span>
                </span>
              </div>

              {/* Mode Toggle Pills */}
              {mode !== "FORGOT_PASSWORD" && (
                <div className="flex items-center bg-[#F1F5F9] p-1 rounded-xl border border-[#E2E8F0]">
                  <button
                    type="button"
                    onClick={() => {
                      setMode("SIGN_IN");
                      setError(null);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      mode === "SIGN_IN"
                        ? "bg-white text-[#2468B2] shadow-2xs"
                        : "text-[#64748B] hover:text-[#182338]"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("SIGN_UP");
                      setError(null);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      mode === "SIGN_UP"
                        ? "bg-white text-[#2468B2] shadow-2xs"
                        : "text-[#64748B] hover:text-[#182338]"
                    }`}
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            {/* MODE 1: SIGN IN */}
            {mode === "SIGN_IN" && (
              <>
                <div className="mt-5">
                  <h1 className="text-[24px] sm:text-[26px] font-black tracking-[-0.02em] leading-tight text-[#182338]">
                    Welcome Back
                  </h1>
                  <p className="mt-1 text-[13px] text-[#667085] font-medium">
                    Sign in to access your examinations, reports, or surveillance desk.
                  </p>
                </div>

                <form onSubmit={handleSignInSubmit} className="mt-5 space-y-4" noValidate>
                  {/* Role Selector */}
                  <fieldset>
                    <legend className="text-[12px] font-bold text-[#475569] mb-1.5 uppercase tracking-wider">
                      Operating Role
                    </legend>
                    <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Sign in as">
                      {SIGN_IN_ROLES.map((r) => {
                        const Icon = r.icon;
                        const selected = role === r.id;
                        return (
                          <button
                            key={r.id}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            onClick={() => {
                              setRole(r.id);
                              setError(null);
                            }}
                            className={`h-[56px] rounded-xl border text-[11.5px] font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer focus-visible:outline-none ${
                              selected
                                ? "bg-[#2468B2] border-[#1C5190] text-white shadow-sm ring-2 ring-[#2468B2]/20"
                                : "bg-white/80 border-slate-200 text-[#667085] hover:bg-white hover:text-[#182338]"
                            }`}
                          >
                            <Icon className="w-4 h-4 stroke-[2.2]" />
                            <span>{r.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>

                  {/* Email */}
                  <div>
                    <label htmlFor="login-email" className="block text-[12px] font-bold text-[#475569] mb-1 uppercase tracking-wider">
                      {activeSignInRole.hint}
                    </label>
                    <input
                      id="login-email"
                      type="email"
                      autoComplete="username"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError(null);
                      }}
                      placeholder="e.g. rahul@example.com"
                      className="w-full h-11 px-3.5 bg-white/90 border border-slate-300 rounded-xl text-sm font-semibold text-[#182338] placeholder:text-slate-400 focus:outline-none focus:border-[#2468B2] focus:ring-2 focus:ring-[#2468B2]/20 transition-all"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label htmlFor="login-password" className="text-[12px] font-bold text-[#475569] uppercase tracking-wider">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setMode("FORGOT_PASSWORD");
                          setResetEmail(email);
                          setError(null);
                        }}
                        className="text-[11.5px] font-bold text-[#2468B2] hover:text-[#1C5190] hover:underline cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setError(null);
                        }}
                        placeholder="••••••••"
                        className="w-full h-11 pl-3.5 pr-11 bg-white/90 border border-slate-300 rounded-xl text-sm font-semibold text-[#182338] placeholder:text-slate-400 focus:outline-none focus:border-[#2468B2] focus:ring-2 focus:ring-[#2468B2]/20 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="absolute right-1 top-1 w-9 h-9 grid place-items-center rounded-lg text-slate-500 hover:text-slate-900 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div
                      role="alert"
                      className="flex items-start gap-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl p-3"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={busy}
                    className="w-full h-11 bg-[#2468B2] hover:bg-[#1C5190] active:bg-[#153E6F] text-white text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider disabled:opacity-60"
                  >
                    {busy ? (
                      <>
                        <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                        <span>Verifying Credentials…</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In as {activeSignInRole.label}</span>
                        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-4 pt-3 border-t border-slate-200/80 text-center text-xs font-semibold text-slate-600">
                  New to the Olympiad platform?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("SIGN_UP");
                      setError(null);
                    }}
                    className="font-bold text-[#2468B2] hover:underline cursor-pointer"
                  >
                    Create student or teacher account
                  </button>
                </div>
              </>
            )}

            {/* MODE 2: SIGN UP */}
            {mode === "SIGN_UP" && (
              <>
                <div className="mt-3">
                  <h1 className="text-[22px] sm:text-[25px] font-black tracking-[-0.02em] leading-tight text-[#182338]">
                    Create New Account
                  </h1>
                  <p className="mt-0.5 text-xs text-[#667085] font-medium">
                    Register as a candidate or teacher to get your personalized dashboard.
                  </p>
                </div>

                <form onSubmit={handleSignUpSubmit} className="mt-4 space-y-3.5" noValidate>
                  {/* Choose Role */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#475569] uppercase tracking-wider mb-1">
                      Registering As <span className="text-rose-600">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {SIGN_UP_ROLES.map((r) => {
                        const Icon = r.icon;
                        const isSelected = signUpRole === r.id;
                        return (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => {
                              setSignUpRole(r.id);
                              setError(null);
                            }}
                            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                              isSelected
                                ? "bg-blue-50/80 border-[#2468B2] ring-2 ring-[#2468B2]/20"
                                : "bg-white border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              <Icon className={`w-4 h-4 ${isSelected ? "text-[#2468B2]" : "text-slate-500"}`} />
                              <span className={`text-xs font-bold ${isSelected ? "text-[#2468B2]" : "text-slate-800"}`}>
                                {r.label}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{r.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Name & Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="reg-name" className="block text-[11px] font-bold text-[#475569] uppercase tracking-wider mb-1">
                        Full Name <span className="text-rose-600">*</span>
                      </label>
                      <input
                        id="reg-name"
                        type="text"
                        required
                        value={signUpName}
                        onChange={(e) => setSignUpName(e.target.value)}
                        placeholder="e.g. Ananya Sen"
                        className="w-full h-10 px-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-[#182338] focus:outline-none focus:border-[#2468B2]"
                      />
                    </div>

                    <div>
                      <label htmlFor="reg-email" className="block text-[11px] font-bold text-[#475569] uppercase tracking-wider mb-1">
                        Email Address <span className="text-rose-600">*</span>
                      </label>
                      <input
                        id="reg-email"
                        type="email"
                        required
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        placeholder="name@school.edu"
                        className="w-full h-10 px-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-[#182338] focus:outline-none focus:border-[#2468B2]"
                      />
                    </div>
                  </div>

                  {/* Role Specific Details: Class/Grade or Subject */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {signUpRole === "STUDENT" ? (
                      <div>
                        <label htmlFor="reg-grade" className="block text-[11px] font-bold text-[#475569] uppercase tracking-wider mb-1">
                          Class / Grade <span className="text-rose-600">*</span>
                        </label>
                        <select
                          id="reg-grade"
                          value={signUpGrade}
                          onChange={(e) => setSignUpGrade(e.target.value)}
                          className="w-full h-10 px-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-[#182338] focus:outline-none focus:border-[#2468B2] cursor-pointer"
                        >
                          <option value="6">Class 6 (Olympiad Level 1)</option>
                          <option value="7">Class 7</option>
                          <option value="8">Class 8</option>
                          <option value="9">Class 9</option>
                          <option value="10">Class 10</option>
                        </select>
                      </div>
                    ) : (
                      <div>
                        <label htmlFor="reg-subj" className="block text-[11px] font-bold text-[#475569] uppercase tracking-wider mb-1">
                          Department Subject <span className="text-rose-600">*</span>
                        </label>
                        <select
                          id="reg-subj"
                          value={signUpSubject}
                          onChange={(e) => setSignUpSubject(e.target.value)}
                          className="w-full h-10 px-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-[#182338] focus:outline-none focus:border-[#2468B2] cursor-pointer"
                        >
                          <option value="Mathematics">Mathematics (IMO)</option>
                          <option value="English">English (IEO)</option>
                          <option value="Science">Science (NSO)</option>
                          <option value="General">General / All Subjects</option>
                        </select>
                      </div>
                    )}

                    <div>
                      <label htmlFor="reg-school" className="block text-[11px] font-bold text-[#475569] uppercase tracking-wider mb-1">
                        School / Institution
                      </label>
                      <input
                        id="reg-school"
                        type="text"
                        value={signUpSchool}
                        onChange={(e) => setSignUpSchool(e.target.value)}
                        placeholder="e.g. Cambridge Court"
                        className="w-full h-10 px-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-[#182338] focus:outline-none focus:border-[#2468B2]"
                      />
                    </div>
                  </div>

                  {/* Password & Confirm */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="reg-pass" className="block text-[11px] font-bold text-[#475569] uppercase tracking-wider mb-1">
                        Password (min. 6 chars) <span className="text-rose-600">*</span>
                      </label>
                      <input
                        id="reg-pass"
                        type="password"
                        required
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full h-10 px-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-[#182338] focus:outline-none focus:border-[#2468B2]"
                      />
                    </div>

                    <div>
                      <label htmlFor="reg-confirm" className="block text-[11px] font-bold text-[#475569] uppercase tracking-wider mb-1">
                        Confirm Password <span className="text-rose-600">*</span>
                      </label>
                      <input
                        id="reg-confirm"
                        type="password"
                        required
                        value={signUpConfirmPassword}
                        onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full h-10 px-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-[#182338] focus:outline-none focus:border-[#2468B2]"
                      />
                    </div>
                  </div>

                  {error && (
                    <div
                      role="alert"
                      className="flex items-start gap-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl p-2.5"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={busy}
                    className="w-full h-11 bg-[#55B987] hover:bg-[#3E9E6F] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider disabled:opacity-60"
                  >
                    {busy ? (
                      <>
                        <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                        <span>Registering Account…</span>
                      </>
                    ) : (
                      <>
                        <span>Complete Sign Up as {signUpRole === "STUDENT" ? "Student" : "Teacher"}</span>
                        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-3 text-center text-xs font-semibold text-slate-600">
                  Already registered?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("SIGN_IN");
                      setError(null);
                    }}
                    className="font-bold text-[#2468B2] hover:underline cursor-pointer"
                  >
                    Sign in to your account
                  </button>
                </div>
              </>
            )}

            {/* MODE 3: FORGOT PASSWORD */}
            {mode === "FORGOT_PASSWORD" && (
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => {
                    setMode("SIGN_IN");
                    setError(null);
                    setResetSent(false);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2468B2] hover:text-[#1C5190] cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </button>

                {!resetSent ? (
                  <>
                    <div>
                      <h1 className="text-[22px] sm:text-[25px] font-black tracking-[-0.02em] leading-tight text-[#182338]">
                        Reset Account Password
                      </h1>
                      <p className="mt-1 text-xs text-[#667085] leading-relaxed">
                        Enter your registered email address below. We will send you an official password reset email containing a secure link button.
                      </p>
                    </div>

                    <form onSubmit={handleForgotPasswordSubmit} className="space-y-4" noValidate>
                      <div>
                        <label htmlFor="reset-email" className="block text-[11px] font-bold text-[#475569] uppercase tracking-wider mb-1">
                          Registered Email Address <span className="text-rose-600">*</span>
                        </label>
                        <div className="relative">
                          <input
                            id="reset-email"
                            type="email"
                            required
                            value={resetEmail}
                            onChange={(e) => {
                              setResetEmail(e.target.value);
                              setError(null);
                            }}
                            placeholder="e.g. candidate@example.com"
                            className="w-full h-11 pl-9 pr-3.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-[#182338] placeholder:text-slate-400 focus:outline-none focus:border-[#2468B2]"
                          />
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>

                      {error && (
                        <div
                          role="alert"
                          className="flex items-start gap-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl p-3"
                        >
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                          <span>{error}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={busy}
                        className="w-full h-11 bg-[#2468B2] hover:bg-[#1C5190] text-white text-xs font-black rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider disabled:opacity-60"
                      >
                        {busy ? (
                          <>
                            <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                            <span>Dispatching Reset Email…</span>
                          </>
                        ) : (
                          <>
                            <KeyRound className="w-4 h-4" />
                            <span>Send Password Reset Email</span>
                          </>
                        )}
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Password Reset Email Dispatched!
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-sm mx-auto">
                        We have dispatched an official password reset email to{" "}
                        <strong className="text-slate-900 font-mono font-bold">{resetEmail}</strong>.
                      </p>
                    </div>

                    <div className="bg-white/80 p-3 rounded-xl border border-emerald-100 text-left text-xs text-slate-700 space-y-1">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-emerald-700" /> What to do next:
                      </div>
                      <ol className="list-decimal pl-4 space-y-0.5 text-[11px] text-slate-600">
                        <li>Check your email inbox (and spam or updates folder).</li>
                        <li>Click the formatted <strong>&quot;Reset Password&quot;</strong> button inside the email.</li>
                        <li>Type your new password and submit to instantly update credentials.</li>
                      </ol>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setMode("SIGN_IN");
                        setError(null);
                        setResetSent(false);
                      }}
                      className="w-full h-10 bg-[#2468B2] hover:bg-[#1C5190] text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Return to Sign In
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
