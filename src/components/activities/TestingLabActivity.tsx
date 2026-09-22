"use client";

import React from "react";
import { FlaskConical } from "lucide-react";
import { ActivityShell, Stage, ConnectPairs, useActivityEngine, ActivityComponentProps } from "./kit";

/**
 * Q49 — Truth testing lab.
 *
 * Every statement gets its own working test rig. The student runs the rig, the lab computes
 * the real result, and the verdict wires itself to T or F in Column B.
 */

interface LabState {
  divisors: number[]; // statement (i)
  primes: number[]; // statement (ii)
  x: number | null; // statement (iii)
  candidate: number | null; // statement (iv)
}

const NUMBER_I = 705830;
const PRIME_TILES = [2, 3, 5, 7, 11, 13];
const PRIME_CANDIDATES = [2, 3, 5, 7, 9];
const isPrime = (n: number) => n > 1 && Array.from({ length: n - 2 }, (_, i) => i + 2).every((d) => n % d !== 0);

export function TestingLabActivity({ question, value, activityState, onChange, readOnly }: ActivityComponentProps<LabState>) {
  const cfg = question?.matchingConfig;

  /** Each rig returns true / false / undefined (not yet run). */
  const verdicts = React.useCallback((s: LabState): Record<string, boolean | undefined> => {
    const i = s.divisors.length === 2 ? s.divisors.every((d) => NUMBER_I % d === 0) : undefined;
    const commonPrimes = PRIME_TILES.filter((p) => 150 % p === 0 && 275 % p === 0);
    const ii = s.primes.length
      ? s.primes.every((p) => commonPrimes.includes(p)) && s.primes.length === commonPrimes.length
        ? commonPrimes.length === 5
        : undefined
      : undefined;
    const iii = s.x === null ? undefined : Number(`2579${s.x}`) % 8 === 0;
    const iv = s.candidate === null ? undefined : !(isPrime(s.candidate) && s.candidate % 2 === 0);
    return { i, ii, iii, iv };
  }, []);

  const wiring = React.useCallback(
    (s: LabState) => {
      if (!cfg) return [];
      const v = verdicts(s);
      const used = new Set<string>();
      const pairs: { leftId: string; rightId: string }[] = [];
      for (const left of cfg.leftItems) {
        const verdict = v[left.id];
        if (verdict === undefined) continue;
        const want = verdict ? "T" : "F";
        const match = cfg.rightItems.find((r) => !used.has(r.id) && r.text.trim().toUpperCase().startsWith(want));
        if (match) {
          used.add(match.id);
          pairs.push({ leftId: left.id, rightId: match.id });
        }
      }
      return pairs;
    },
    [cfg, verdicts]
  );

  const engine = useActivityEngine<LabState, { leftId: string; rightId: string }[]>({
    initialState: { divisors: [], primes: [], x: null, candidate: null },
    activityState,
    value,
    onChange,
    readOnly,
    resolve: (s) => {
      const pairs = wiring(s);
      return cfg && pairs.length === cfg.leftItems.length ? pairs : undefined;
    },
  });

  const s = engine.state;
  const v = verdicts(s);

  const Chip = ({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button
      type="button"
      disabled={engine.readOnly}
      onClick={onClick}
      className={`px-2 py-1.5 min-h-[32px] rounded-lg border-2 text-[11px] font-black transition ${
        on ? "bg-emerald-600 border-emerald-700 text-white" : "bg-white border-slate-200 text-slate-700 hover:border-emerald-400"
      }`}
    >
      {children}
    </button>
  );

  const Rig = ({ id, text }: { id: string; text: string }) => {
    const verdict = v[id];
    return (
      <div className="min-w-0">
        <div className="font-bold text-[11px] text-slate-900 leading-tight mb-1">{text}</div>

        {id === "i" && (
          <div className="flex flex-wrap gap-1 items-center">
            <span className="text-[9px] font-bold text-slate-500">divide {NUMBER_I} by:</span>
            {[2, 5, 3].map((d) => (
              <Chip
                key={d}
                on={s.divisors.includes(d)}
                onClick={() =>
                  engine.update((st) => ({
                    ...st,
                    divisors: st.divisors.includes(d) ? st.divisors.filter((x) => x !== d) : [...st.divisors, d],
                  }))
                }
              >
                ÷{d} → {NUMBER_I % d === 0 ? "0 rem" : `${NUMBER_I % d} rem`}
              </Chip>
            ))}
          </div>
        )}

        {id === "ii" && (
          <div className="flex flex-wrap gap-1 items-center">
            <span className="text-[9px] font-bold text-slate-500">common primes of 150 &amp; 275:</span>
            {PRIME_TILES.map((p) => (
              <Chip
                key={p}
                on={s.primes.includes(p)}
                onClick={() =>
                  engine.update((st) => ({
                    ...st,
                    primes: st.primes.includes(p) ? st.primes.filter((x) => x !== p) : [...st.primes, p],
                  }))
                }
              >
                {p}
              </Chip>
            ))}
          </div>
        )}

        {id === "iii" && (
          <div className="flex flex-wrap gap-1 items-center">
            <span className="text-[9px] font-bold text-slate-500">set x in 2579x:</span>
            {[0, 2, 4, 6, 8].map((x) => (
              <Chip key={x} on={s.x === x} onClick={() => engine.update((st) => ({ ...st, x }))}>
                {x}
              </Chip>
            ))}
            {s.x !== null && (
              <span className="text-[10px] font-mono font-bold text-slate-600">
                2579{s.x} ÷ 8 = {(Number(`2579${s.x}`) / 8).toFixed(2)}
              </span>
            )}
          </div>
        )}

        {id === "iv" && (
          <div className="flex flex-wrap gap-1 items-center">
            <span className="text-[9px] font-bold text-slate-500">test a number for prime &amp; even:</span>
            {PRIME_CANDIDATES.map((n) => (
              <Chip key={n} on={s.candidate === n} onClick={() => engine.update((st) => ({ ...st, candidate: n }))}>
                {n}
              </Chip>
            ))}
            {s.candidate !== null && (
              <span className="text-[10px] font-mono font-bold text-slate-600">
                {s.candidate} is {isPrime(s.candidate) ? "prime" : "not prime"} and {s.candidate % 2 ? "odd" : "even"}
              </span>
            )}
          </div>
        )}

        <div className={`mt-1 text-[10px] font-black ${verdict === undefined ? "text-slate-400" : verdict ? "text-emerald-700" : "text-rose-600"}`}>
          {verdict === undefined ? "rig not run yet" : verdict ? "verdict: TRUE" : "verdict: FALSE"}
        </div>
      </div>
    );
  };

  const pairs = wiring(s);

  return (
    <ActivityShell
      icon={FlaskConical}
      title="Truth Testing Lab"
      howTo="Run each rig — divide the number, pick the common primes, set the missing digit, test a candidate. The lab computes the real result and wires the verdict to T or F."
      answerText={engine.answer ? `${pairs.length} of ${cfg?.leftItems.length} rigs run` : undefined}
      mappedTo={engine.answer ? "Wired from the tests you ran" : undefined}
      pendingHint={`Run every rig — ${pairs.length} of ${cfg?.leftItems.length ?? 4} wired.`}
      onReset={engine.reset}
      readOnly={engine.readOnly}
    >
      <Stage label={cfg?.instruction || "Run the tests, then read the wiring"}>
        <ConnectPairs
          left={(cfg?.leftItems || []).map((l) => ({ id: l.id, text: l.text, autoLinkTo: null, body: <Rig id={l.id} text={l.text} /> }))}
          right={(cfg?.rightItems || []).map((r) => ({ id: r.id, text: r.text }))}
          pairs={pairs}
          onChange={() => undefined}
          readOnly
          leftTitle="Statements — run the rig"
          rightTitle="Verdict"
        />
      </Stage>
    </ActivityShell>
  );
}
