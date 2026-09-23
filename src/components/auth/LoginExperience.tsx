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
} from "lucide-react";

/**
 * Entry experience.
 *
 * The application's root: an Olympiad workspace on the left and the sign-in panel on the
 * right, composed as one environment. Engaging with the panel — hovering it, or focusing
 * any field, which is how it works on touch and via the keyboard — lights the lamp and
 * brightens the surrounding vectors.
 */

const ROLES: { id: UserRole; label: string; hint: string; icon: typeof ShieldCheck }[] = [
  { id: "SUPER_ADMIN", label: "Super Admin", hint: "Admin ID or email", icon: ShieldCheck },
  { id: "TEACHER", label: "Teacher", hint: "Teacher ID or email", icon: Users },
  { id: "STUDENT", label: "Student", hint: "Student ID or email", icon: GraduationCap },
];

export function LoginExperience() {
  const { signIn, isAuthenticated, isReady, role: sessionRole } = useAuth();
  const router = useRouter();

  const [role, setRole] = useState<UserRole>("SUPER_ADMIN");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Hover (pointer) or focus-within (touch, keyboard) both count as engagement.
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const engaged = hovered || focused;

  // Someone already signed in has no business on the login screen.
  useEffect(() => {
    if (isReady && isAuthenticated) router.replace(homeFor(sessionRole));
  }, [isReady, isAuthenticated, sessionRole, router]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (busy) return;
      setBusy(true);
      setError(null);

      const outcome = await signIn(email, password, role);
      if (outcome.ok) {
        router.replace(homeFor(role));
        return; // keep the button in its busy state through the navigation
      }
      setError(outcome.message);
      setBusy(false);
    },
    [busy, email, password, role, signIn, router]
  );

  if (!isReady || isAuthenticated) return <AppLoading label="Opening your dashboard" />;

  const activeRole = ROLES.find((r) => r.id === role) ?? ROLES[0];

  return (
    <div className="min-h-dvh flex flex-col font-sans text-[#182338] antialiased">
      <AmbientField />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div
          className="
            w-full max-w-[1080px] grid lg:grid-cols-[1.08fr_1fr] overflow-hidden
            bg-white/55 backdrop-blur-2xl border border-white/75
            rounded-[22px] lg:rounded-[28px]
            shadow-[0_1px_0_0_rgba(255,255,255,0.75)_inset,0_24px_60px_-16px_rgba(38,45,90,0.26)]
            animate-panel-in
          "
        >
          {/* ── Olympiad environment ── */}
          <div className="relative order-1 min-h-[280px] sm:min-h-[340px] lg:min-h-[600px] overflow-hidden bg-gradient-to-br from-[#8067D9]/[0.13] via-white/35 to-[#59B6DE]/[0.16] border-b lg:border-b-0 lg:border-r border-white/70">
            <VectorEnvironment engaged={engaged} />

            <div className="relative h-full flex flex-col items-center justify-center p-6 sm:p-8">
              <OlympiadBulb
                lit={engaged}
                className={`w-[132px] sm:w-[164px] lg:w-[196px] h-auto transition-transform duration-500 ease-out ${
                  engaged ? "scale-[1.03]" : "scale-100"
                }`}
              />

              <div className="mt-5 sm:mt-7 text-center max-w-[300px]">
                <p
                  className={`text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors duration-500 ${
                    engaged ? "text-[#B4791C]" : "text-[#77839A]"
                  }`}
                >
                  {engaged ? "Ready when you are" : "Olympiad examination centre"}
                </p>
                <p className="mt-2 text-[13.5px] text-[#667085] leading-relaxed">
                  Every question here is an activity you manipulate — and the manipulation itself
                  produces the answer.
                </p>
              </div>
            </div>
          </div>

          {/* ── Sign-in panel ── */}
          <div
            className="order-2 p-6 sm:p-9 lg:p-10 flex flex-col justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocusCapture={() => setFocused(true)}
            onBlurCapture={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocused(false);
            }}
          >
            <div className="flex items-center gap-2.5">
              <span className="w-10 h-10 rounded-xl bg-[#2468B2] text-white grid place-items-center font-display font-bold text-lg shadow-subtle">
                Ω
              </span>
              <span className="leading-tight">
                <span className="block text-[15px] font-bold tracking-[-0.01em]">Olympiad</span>
                <span className="block text-[11.5px] text-[#77839A]">Examination Centre</span>
              </span>
            </div>

            <h1 className="mt-7 text-[24px] sm:text-[27px] font-bold tracking-[-0.02em] leading-tight">
              Welcome back
            </h1>
            <p className="mt-1.5 text-[13.5px] text-[#667085]">
              Sign in to continue your Olympiad.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
              {/* Role */}
              <fieldset>
                <legend className="text-[12.5px] font-semibold mb-2">Sign in as</legend>
                <div className="grid grid-cols-3 gap-1.5" role="radiogroup" aria-label="Sign in as">
                  {ROLES.map((r) => {
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
                        className={`h-[58px] rounded-xl border text-[12px] font-semibold flex flex-col items-center justify-center gap-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2468B2]/40 ${
                          selected
                            ? "bg-[#8067D9]/[0.12] border-[#8067D9]/45 text-[#4A3A93]"
                            : "bg-white/60 border-white/90 text-[#667085] hover:bg-white/90 hover:text-[#182338]"
                        }`}
                      >
                        <Icon className="w-[17px] h-[17px]" strokeWidth={2.1} />
                        {r.label}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              {/* Email */}
              <div>
                <label htmlFor="login-email" className="block text-[12.5px] font-semibold mb-1.5">
                  {activeRole.hint}
                </label>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  aria-invalid={Boolean(error)}
                  placeholder="you@example.com"
                  className={`w-full h-12 px-3.5 bg-white/85 backdrop-blur-sm border rounded-xl text-[14px] placeholder:text-[#77839A] focus:outline-none focus:ring-2 focus:ring-[#2468B2]/20 transition-shadow ${
                    error ? "border-[#E8786A]/70" : "border-white/90 focus:border-[#2468B2]"
                  }`}
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="login-password" className="block text-[12.5px] font-semibold mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(null);
                    }}
                    aria-invalid={Boolean(error)}
                    placeholder="••••••"
                    className={`w-full h-12 pl-3.5 pr-12 bg-white/85 backdrop-blur-sm border rounded-xl text-[14px] placeholder:text-[#77839A] focus:outline-none focus:ring-2 focus:ring-[#2468B2]/20 transition-shadow ${
                      error ? "border-[#E8786A]/70" : "border-white/90 focus:border-[#2468B2]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-1 top-1 w-10 h-10 grid place-items-center rounded-lg text-[#667085] hover:text-[#182338] hover:bg-white/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2468B2]/40"
                  >
                    {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                  </button>
                </div>
              </div>

              {error && (
                <p
                  role="alert"
                  className="flex items-start gap-2 text-[12.5px] font-medium text-[#B8433F] bg-[#E8786A]/10 border border-[#E8786A]/30 rounded-xl px-3 py-2.5"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-px" />
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={busy}
                className="w-full h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-[#2468B2] text-white text-[14px] font-semibold hover:bg-[#1C5190] hover:-translate-y-[1px] hover:shadow-lifted active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0 transition-[background-color,transform,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2468B2]/40 focus-visible:ring-offset-2"
              >
                {busy ? (
                  <>
                    <span
                      className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white motion-safe:animate-spin"
                      aria-hidden
                    />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="w-4 h-4" strokeWidth={2.2} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
