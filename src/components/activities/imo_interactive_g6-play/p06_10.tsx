"use client";

import React from "react";
import { ActivityComponentProps } from "../kit/types";
import { usePlay } from "../imo6a-play/engine";
import { World3D, Board, Shell, Bay, Gauge } from "./kit";
import { Network } from "lucide-react";

// ============================================================================
// Q06 · Water Mirror Chamber (Red->Blue->Green flips to Green->Blue->Red) (B)
// ============================================================================
export function PlayQ06({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  type World = { isLowered: boolean; reflectedOrder: string[] };
  const play = usePlay<World>({
    question,
    value,
    activityState,
    onChange,
    readOnly,
    initial: { isLowered: false, reflectedOrder: ["Red", "Blue", "Green"] },
    derive(w) {
      if (!w.isLowered) return { note: "Lower flag to water reflection" };
      const order = w.reflectedOrder.join(" → ");
      let opt = "A";
      if (order === "Green → Blue → Red") opt = "B";
      else if (order === "Blue → Red → Green") opt = "C";
      else if (order === "Green → Red → Blue") opt = "D";
      return {
        value: order,
        optionId: opt,
      };
    },
  });

  const flipToWaterImage = () => {
    play.set({
      isLowered: true,
      reflectedOrder: ["Green", "Blue", "Red"],
    });
  };

  return (
    <Shell
      play={play}
      question={question}
      dim="3D"
      hints={[
        "Water reflection inverts vertically (top becomes bottom, bottom becomes top).",
        "Original top band (Red) becomes the bottom band in the reflection.",
        "Original bottom band (Green) becomes the top band in the reflection.",
        "Middle band (Blue) stays in the middle.",
        "Reflected order from top to bottom: Green → Blue → Red.",
      ]}
      title="3D Water Reflection Chamber"
      badge="Q06 · Logical Reasoning"
    >
      <Board>
        <World3D camera={{ position: [0, 3, 7], fov: 42 }}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
            <planeGeometry args={[8, 8]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.8} opacity={0.7} transparent />
          </mesh>

          <group position={[0, 1.8, 0]}>
            <mesh position={[-0.8, 0, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 2.2, 16]} />
              <meshStandardMaterial color="#64748b" metalness={0.8} />
            </mesh>
            <mesh position={[0, 0.6, 0]}>
              <boxGeometry args={[1.4, 0.4, 0.05]} />
              <meshStandardMaterial color="#ef4444" />
            </mesh>
            <mesh position={[0, 0.2, 0]}>
              <boxGeometry args={[1.4, 0.4, 0.05]} />
              <meshStandardMaterial color="#3b82f6" />
            </mesh>
            <mesh position={[0, -0.2, 0]}>
              <boxGeometry args={[1.4, 0.4, 0.05]} />
              <meshStandardMaterial color="#10b981" />
            </mesh>
          </group>

          {play.world.isLowered && (
            <group position={[0, -1.8, 0]}>
              <mesh position={[-0.8, 0, 0]}>
                <cylinderGeometry args={[0.04, 0.04, 2.2, 16]} />
                <meshStandardMaterial color="#64748b" metalness={0.8} opacity={0.6} transparent />
              </mesh>
              <mesh position={[0, 0.2, 0]}>
                <boxGeometry args={[1.4, 0.4, 0.05]} />
                <meshStandardMaterial color="#10b981" opacity={0.7} transparent />
              </mesh>
              <mesh position={[0, -0.2, 0]}>
                <boxGeometry args={[1.4, 0.4, 0.05]} />
                <meshStandardMaterial color="#3b82f6" opacity={0.7} transparent />
              </mesh>
              <mesh position={[0, -0.6, 0]}>
                <boxGeometry args={[1.4, 0.4, 0.05]} />
                <meshStandardMaterial color="#ef4444" opacity={0.7} transparent />
              </mesh>
            </group>
          )}
        </World3D>

        <Bay title="Reflection Controls">
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={flipToWaterImage}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              🌊 Lower Flag & Project Water Reflection
            </button>
          </div>
        </Bay>

        <Gauge
          label="Water Image Band Sequence (Top → Bottom)"
          value={
            play.world.isLowered
              ? `${play.world.reflectedOrder.join(" → ")} (Option ${play.derived.optionId})`
              : "Lower the flag toward the water mirror to observe reflection"
          }
          tone={play.derived.optionId === "B" ? "emerald" : "violet"}
        />
      </Board>
    </Shell>
  );
}

// ============================================================================
// Q07 · Mechanical Cipher Machine (DOG -> +1 -> EPH) (A)
// ============================================================================
export function PlayQ07({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  type World = { letters: string[] };
  const play = usePlay<World>({
    question,
    value,
    activityState,
    onChange,
    readOnly,
    initial: { letters: ["D", "O", "G"] },
    derive(w) {
      const code = w.letters.join("");
      let opt = "B";
      if (code === "EPH") opt = "A";
      else if (code === "EOG") opt = "B";
      else if (code === "FPH") opt = "C";
      else if (code === "DPH") opt = "D";

      return {
        value: code,
        optionId: opt,
      };
    },
  });

  const shiftWheel = (idx: number, delta: number) => {
    const next = [...play.world.letters];
    const code = next[idx].charCodeAt(0) - 65;
    const shifted = (code + delta + 26) % 26;
    next[idx] = String.fromCharCode(65 + shifted);
    play.set({ letters: next });
  };

  return (
    <Shell
      play={play}
      question={question}
      dim="3D"
      hints={[
        "The rule is replace each letter by the next (+1 step forward).",
        "D + 1 = E",
        "O + 1 = P",
        "G + 1 = H",
        "DOG encrypts into EPH.",
      ]}
      title="3D Mechanical Cipher Machine"
      badge="Q07 · Logical Reasoning"
    >
      <Board>
        <World3D camera={{ position: [0, 4, 7], fov: 42 }}>
          {[-2, 0, 2].map((x, i) => (
            <group key={i} position={[x, 0, 0]}>
              <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[1.2, 1.2, 0.8, 24]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.6} roughness={0.3} />
              </mesh>
              <mesh position={[0, 0, 1.25]}>
                <boxGeometry args={[0.9, 0.4, 0.1]} />
                <meshStandardMaterial color="#4f46e5" />
              </mesh>
            </group>
          ))}
        </World3D>

        <Bay title="Rotate Mechanical Wheels (+1 Shift for each letter)">
          <div className="grid grid-cols-3 gap-4">
            {["D", "O", "G"].map((baseLetter, i) => (
              <div key={i} className="flex flex-col items-center p-3 bg-white rounded-xl border border-indigo-100 shadow-xs gap-2">
                <span className="text-[11px] font-bold text-slate-500">Input: {baseLetter}</span>
                <button
                  type="button"
                  onClick={() => shiftWheel(i, 1)}
                  className="w-10 h-7 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold"
                >
                  ▲ +1
                </button>
                <div className="w-14 h-14 rounded-xl bg-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-inner">
                  {play.world.letters[i]}
                </div>
                <button
                  type="button"
                  onClick={() => shiftWheel(i, -1)}
                  className="w-10 h-7 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold"
                >
                  ▼ -1
                </button>
              </div>
            ))}
          </div>
        </Bay>

        <Gauge
          label="Encrypted Output String"
          value={`Output: ${play.world.letters.join("")} (Option ${play.derived.optionId})`}
          tone={play.derived.optionId === "A" ? "emerald" : "violet"}
        />
      </Board>
    </Shell>
  );
}

// ============================================================================
// Q08 · Family Hologram Room (P brother of Q, Q mother of R -> Maternal uncle) (B)
// ============================================================================
export function PlayQ08({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  type World = { connected: boolean };
  const play = usePlay<World>({
    question,
    value,
    activityState,
    onChange,
    readOnly,
    initial: { connected: false },
    derive(w) {
      if (!w.connected) return { note: "Synthesize kinship graph" };
      return {
        value: "Maternal uncle",
        optionId: "B",
      };
    },
  });

  return (
    <Shell
      play={play}
      question={question}
      dim="3D"
      hints={[
        "Q is the mother of R (Q is female).",
        "P is the brother of Q (P is male).",
        "The brother of one's mother is their Maternal Uncle.",
        "Therefore, P is the maternal uncle of R.",
      ]}
      title="3D Family Tree Hologram"
      badge="Q08 · Logical Reasoning"
    >
      <Board>
        <World3D camera={{ position: [0, 4, 7], fov: 42 }}>
          <group position={[-2, 1, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.5, 24, 24]} />
              <meshStandardMaterial color="#3b82f6" emissive="#1d4ed8" emissiveIntensity={0.3} />
            </mesh>
          </group>

          <group position={[2, 1, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.5, 24, 24]} />
              <meshStandardMaterial color="#ec4899" emissive="#be185d" emissiveIntensity={0.3} />
            </mesh>
          </group>

          <group position={[2, -1, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.45, 24, 24]} />
              <meshStandardMaterial color="#10b981" emissive="#047857" emissiveIntensity={0.3} />
            </mesh>
          </group>
        </World3D>

        <Bay title="Holographic Relationship Nodes">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <span className="text-xl font-black text-blue-900">Node P (Male)</span>
              <div className="text-xs font-bold text-blue-700 mt-1">Brother of Q</div>
            </div>
            <div className="p-3 bg-pink-50 border border-pink-200 rounded-xl">
              <span className="text-xl font-black text-pink-900">Node Q (Female)</span>
              <div className="text-xs font-bold text-pink-700 mt-1">Mother of R</div>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <span className="text-xl font-black text-emerald-900">Node R</span>
              <div className="text-xs font-bold text-emerald-700 mt-1">Child of Q</div>
            </div>
          </div>
          <div className="mt-3 flex justify-center">
            <button
              type="button"
              onClick={() => play.set({ connected: true })}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Network className="w-4 h-4" /> Synthesize Kinship Graph
            </button>
          </div>
        </Bay>

        <Gauge
          label="P's Relationship to R"
          value={
            play.derived.value
              ? `Maternal Uncle (Mother's Brother) → Option ${play.derived.optionId}`
              : "Synthesize the kinship graph to derive relationship"
          }
          tone={play.derived.optionId === "B" ? "emerald" : "violet"}
        />
      </Board>
    </Shell>
  );
}

// ============================================================================
// Q09 · Time Portal Calendar (1st Wed -> 15th = Wed) (C)
// ============================================================================
export function PlayQ09({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  type World = { currentDay: number };
  const daysOfWeek = ["Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Monday", "Tuesday"];

  const play = usePlay<World>({
    question,
    value,
    activityState,
    onChange,
    readOnly,
    initial: { currentDay: 1 },
    derive(w) {
      if (w.currentDay !== 15) return { note: "Navigate to 15th day" };
      const dayName = daysOfWeek[(w.currentDay - 1) % 7];
      let opt = "C";
      if (dayName === "Monday") opt = "A";
      else if (dayName === "Tuesday") opt = "B";
      else if (dayName === "Wednesday") opt = "C";
      else if (dayName === "Thursday") opt = "D";

      return {
        value: dayName,
        optionId: opt,
      };
    },
  });

  const advanceDays = (d: number) => {
    play.set({ currentDay: Math.max(1, Math.min(31, play.world.currentDay + d)) });
  };

  const currentWeekday = daysOfWeek[(play.world.currentDay - 1) % 7];

  return (
    <Shell
      play={play}
      question={question}
      dim="3D"
      hints={[
        "The days of the week repeat every 7 days.",
        "Day 1 = Wednesday",
        "Day 8 (1 + 7) = Wednesday",
        "Day 15 (8 + 7) = Wednesday",
        "Therefore, the 15th is also Wednesday.",
      ]}
      title="3D Time Portal Calendar"
      badge="Q09 · Logical Reasoning"
    >
      <Board>
        <World3D camera={{ position: [0, 4, 7], fov: 42 }}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2.5, 3.2, 31]} />
            <meshStandardMaterial color="#818cf8" emissive="#4f46e5" emissiveIntensity={0.4} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[1.2, 1.2, 0.4, 32]} />
            <meshStandardMaterial color="#ffffff" roughness={0.1} />
          </mesh>
        </World3D>

        <Bay title="Calendar Dial Controls">
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="px-5 py-3 rounded-2xl bg-indigo-50 border-2 border-indigo-200 text-center">
                <span className="text-[10px] font-extrabold uppercase text-slate-500">Selected Date</span>
                <div className="text-3xl font-black text-indigo-950 font-mono">{play.world.currentDay}th</div>
              </div>
              <div className="px-5 py-3 rounded-2xl bg-indigo-600 text-white text-center shadow-md">
                <span className="text-[10px] font-extrabold uppercase opacity-80">Weekday</span>
                <div className="text-2xl font-black">{currentWeekday}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => advanceDays(-7)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                − 7 Days
              </button>
              <button
                type="button"
                onClick={() => advanceDays(-1)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                − 1 Day
              </button>
              <button
                type="button"
                onClick={() => advanceDays(1)}
                className="px-3 py-1.5 rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-800 text-xs font-bold"
              >
                + 1 Day
              </button>
              <button
                type="button"
                onClick={() => advanceDays(7)}
                className="px-3 py-1.5 rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-800 text-xs font-bold"
              >
                + 7 Days
              </button>
              <button
                type="button"
                onClick={() => play.set({ currentDay: 15 })}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs"
              >
                Jump to 15th
              </button>
            </div>
          </div>
        </Bay>

        <Gauge
          label="Weekday of 15th Day"
          value={
            play.world.currentDay === 15
              ? `15th is a ${currentWeekday} (Option ${play.derived.optionId})`
              : `Currently on Day ${play.world.currentDay}. Navigate to Day 15.`
          }
          tone={play.derived.optionId === "C" ? "emerald" : "violet"}
        />
      </Board>
    </Shell>
  );
}

// ============================================================================
// Q10 · Sorting Dome / Venn Challenge (30 - (18+15-7) = 4) (B)
// ============================================================================
export function PlayQ10({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  type World = { placedNeither: number };
  const play = usePlay<World>({
    question,
    value,
    activityState,
    onChange,
    readOnly,
    initial: { placedNeither: 0 },
    derive(w) {
      if (w.placedNeither !== 4) return { note: "Set tokens in neither zone" };
      return {
        value: "4",
        optionId: "B",
      };
    },
  });

  return (
    <Shell
      play={play}
      question={question}
      dim="3D"
      hints={[
        "Total students in class = 30.",
        "Students who like cricket only = 18 − 7 = 11.",
        "Students who like football only = 15 − 7 = 8.",
        "Students who like both = 7.",
        "Total students who like at least one = 11 + 8 + 7 = 26.",
        "Students who like neither = 30 − 26 = 4.",
      ]}
      title="3D Venn Sorting Dome"
      badge="Q10 · Logical Reasoning"
    >
      <Board>
        <World3D camera={{ position: [0, 5, 8], fov: 42 }}>
          <group position={[-1.4, 0, 0]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[1.8, 2.0, 32]} />
              <meshStandardMaterial color="#3b82f6" emissive="#1d4ed8" emissiveIntensity={0.5} />
            </mesh>
          </group>

          <group position={[1.4, 0, 0]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[1.8, 2.0, 32]} />
              <meshStandardMaterial color="#10b981" emissive="#047857" emissiveIntensity={0.5} />
            </mesh>
          </group>
        </World3D>

        <Bay title="Venn Set Breakdown">
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl">
              <span className="font-extrabold text-blue-900 block">Cricket Only</span>
              <span className="text-lg font-black text-blue-700">18 − 7 = 11</span>
            </div>
            <div className="p-2.5 bg-purple-50 border border-purple-200 rounded-xl">
              <span className="font-extrabold text-purple-900 block">Both Sports</span>
              <span className="text-lg font-black text-purple-700">7</span>
            </div>
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
              <span className="font-extrabold text-emerald-900 block">Football Only</span>
              <span className="text-lg font-black text-emerald-700">15 − 7 = 8</span>
            </div>
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl">
              <span className="font-extrabold text-rose-900 block">Neither Zone</span>
              <span className="text-lg font-black text-rose-700">30 − 26 = 4</span>
            </div>
          </div>

          <div className="mt-4 flex flex-col items-center gap-2">
            <span className="text-xs font-bold text-slate-600">
              Set tokens outside both circles (Neither zone):
            </span>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => play.set({ placedNeither: num })}
                  className={`w-10 h-10 rounded-xl font-black text-sm transition-all ${
                    play.world.placedNeither === num
                      ? "bg-indigo-600 text-white shadow-md scale-105"
                      : "bg-slate-100 text-slate-700 hover:bg-indigo-50"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </Bay>

        <Gauge
          label="Unsorted / Neither Zone Count"
          value={
            play.world.placedNeither === 4
              ? `4 students like neither (Option ${play.derived.optionId})`
              : `${play.world.placedNeither} tokens placed. Need exactly 30 − 26 = 4.`
          }
          tone={play.derived.optionId === "B" ? "emerald" : "violet"}
        />
      </Board>
    </Shell>
  );
}
