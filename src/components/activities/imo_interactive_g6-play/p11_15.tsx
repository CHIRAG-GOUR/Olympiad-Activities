"use client";

import React from "react";
import { ActivityComponentProps } from "../kit/types";
import { usePlay } from "../imo6a-play/engine";
import { World3D, Board, Shell, Bay, Gauge } from "./kit";

// ============================================================================
// Q11 · Origami Vault (Fold twice -> 4 layers -> 1 hole = 4 holes) (C)
// ============================================================================
export function PlayQ11({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  type World = { folds: number; punched: boolean; unfolded: boolean };
  const play = usePlay<World>({
    question,
    value,
    activityState,
    onChange,
    readOnly,
    initial: { folds: 0, punched: false, unfolded: false },
    derive(w) {
      if (!w.unfolded || !w.punched || w.folds < 2) return { note: "Fold twice, punch hole, and unfold" };
      return {
        value: "4",
        optionId: "C",
      };
    },
  });

  const foldOnce = () => play.set({ ...play.world, folds: Math.min(2, play.world.folds + 1) });
  const punchHole = () => play.set({ ...play.world, punched: true });
  const unfoldSheet = () => play.set({ ...play.world, unfolded: true });

  return (
    <Shell
      play={play}
      question={question}
      dim="3D"
      hints={[
        "Fold 1: Sheet doubles to 2 layers.",
        "Fold 2: Sheet doubles again to 4 layers.",
        "Punching 1 hole through all 4 layers creates 4 holes in total.",
        "When completely unfolded, 4 distinct holes appear on the sheet.",
      ]}
      title="3D Origami Folding Laboratory"
      badge="Q11 · Logical Reasoning"
    >
      <Board>
        <World3D camera={{ position: [0, 4, 6], fov: 42 }}>
          <group position={[0, 0, 0]}>
            <mesh castShadow>
              <boxGeometry
                args={[
                  play.world.unfolded ? 3 : play.world.folds === 0 ? 3 : play.world.folds === 1 ? 1.5 : 1.5,
                  0.04,
                  play.world.unfolded ? 3 : play.world.folds === 0 ? 3 : play.world.folds === 1 ? 3 : 1.5,
                ]}
              />
              <meshStandardMaterial color="#f8fafc" roughness={0.4} />
            </mesh>
            {play.world.unfolded && play.world.punched && (
              <>
                {[-0.75, 0.75].map((x, i) =>
                  [-0.75, 0.75].map((z, j) => (
                    <mesh key={`${i}-${j}`} position={[x, 0.03, z]}>
                      <cylinderGeometry args={[0.15, 0.15, 0.05, 16]} />
                      <meshStandardMaterial color="#ef4444" />
                    </mesh>
                  ))
                )}
              </>
            )}
          </group>
        </World3D>

        <Bay title="Folding & Hole-Punch Workflow">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={foldOnce}
              disabled={play.world.folds >= 2 || play.world.punched}
              className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl border border-indigo-200 disabled:opacity-40"
            >
              📄 Fold in Half ({play.world.folds}/2)
            </button>
            <button
              type="button"
              onClick={punchHole}
              disabled={play.world.folds < 2 || play.world.punched}
              className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl border border-rose-200 disabled:opacity-40"
            >
              🎯 Punch Hole Through Layers
            </button>
            <button
              type="button"
              onClick={unfoldSheet}
              disabled={!play.world.punched || play.world.unfolded}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md disabled:opacity-40"
            >
              ✨ Completely Unfold Sheet
            </button>
          </div>
        </Bay>

        <Gauge
          label="Total Holes Count"
          value={
            play.world.unfolded && play.world.punched
              ? "4 Holes Detected (Option C)"
              : `Status: ${play.world.folds} folds, ${play.world.punched ? "punched" : "not punched"}`
          }
          tone={play.derived.optionId === "C" ? "emerald" : "violet"}
        />
      </Board>
    </Shell>
  );
}

// ============================================================================
// Q12 · Rotating Symbol Reactor (↓ dot-right -> ← dot-bottom) (A)
// ============================================================================
export function PlayQ12({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  type World = { arrowRot: number; dotPos: "top" | "right" | "bottom" | "left" };
  const play = usePlay<World>({
    question,
    value,
    activityState,
    onChange,
    readOnly,
    initial: { arrowRot: 180, dotPos: "right" },
    derive(w) {
      if (w.arrowRot === 270 && w.dotPos === "bottom") {
        return {
          value: "← with dot at bottom",
          optionId: "A",
        };
      }
      return { note: "Rotate arrow 90° CW and advance dot CW" };
    },
  });

  const rotate90 = () => {
    play.set({ ...play.world, arrowRot: (play.world.arrowRot + 90) % 360 });
  };

  const advanceDotCW = () => {
    const order: ("top" | "right" | "bottom" | "left")[] = ["top", "right", "bottom", "left"];
    const nextIdx = (order.indexOf(play.world.dotPos) + 1) % 4;
    play.set({ ...play.world, dotPos: order[nextIdx] });
  };

  return (
    <Shell
      play={play}
      question={question}
      dim="3D"
      hints={[
        "Arrow rotation: Step 3 is ↓ (pointing down, 180°).",
        "90° clockwise rotation from ↓ points Left (←, 270°).",
        "Dot movement: Step 3 dot is on the Right.",
        "One step clockwise from Right is Bottom.",
        "Final Stage 4 state: ← with dot at bottom.",
      ]}
      title="Rotating Symbol Reactor"
      badge="Q12 · Logical Reasoning"
    >
      <Board>
        <World3D camera={{ position: [0, 3, 6], fov: 42 }}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[2.2, 2.2, 0.2, 32]} />
            <meshStandardMaterial color="#f1f5f9" metalness={0.2} roughness={0.4} />
          </mesh>
        </World3D>

        <Bay title="Stage 4 Transformation Controls">
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-36 h-36 rounded-full border-4 border-indigo-200 bg-white flex items-center justify-center shadow-inner">
              <div
                style={{ transform: `rotate(${play.world.arrowRot}deg)` }}
                className="text-4xl font-black text-indigo-900 transition-transform duration-300 select-none"
              >
                ↑
              </div>
              <div
                className={`absolute w-5 h-5 rounded-full bg-rose-500 shadow-md ${
                  play.world.dotPos === "top"
                    ? "top-2 left-1/2 -translate-x-1/2"
                    : play.world.dotPos === "right"
                    ? "right-2 top-1/2 -translate-y-1/2"
                    : play.world.dotPos === "bottom"
                    ? "bottom-2 left-1/2 -translate-x-1/2"
                    : "left-2 top-1/2 -translate-y-1/2"
                }`}
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={rotate90}
                className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl border border-indigo-200"
              >
                🔄 Rotate Arrow 90° CW
              </button>
              <button
                type="button"
                onClick={advanceDotCW}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl border border-rose-200"
              >
                🔴 Move Dot CW
              </button>
            </div>
          </div>
        </Bay>

        <Gauge
          label="Reactor Stage 4 State"
          value={
            play.derived.value
              ? `← with dot at bottom (Option ${play.derived.optionId})`
              : `Current: Arrow ${play.world.arrowRot}°, Dot at ${play.world.dotPos}`
          }
          tone={play.derived.optionId === "A" ? "emerald" : "violet"}
        />
      </Board>
    </Shell>
  );
}

// ============================================================================
// Q13 · Clock Tower (4:30 -> Smaller Angle = 45°) (B)
// ============================================================================
export function PlayQ13({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  type World = { hour: number; minute: number };
  const play = usePlay<World>({
    question,
    value,
    activityState,
    onChange,
    readOnly,
    initial: { hour: 4, minute: 0 },
    derive(w) {
      if (w.hour !== 4 || w.minute !== 30) return { note: "Set hands to 4:30" };
      return {
        value: "45°",
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
        "At 4:30, the minute hand points directly at 6 (180°).",
        "The hour hand is halfway between 4 and 5.",
        "Hour hand angle = 4 × 30° + 30 × 0.5° = 120° + 15° = 135°.",
        "Smaller angle between hands = 180° − 135° = 45°.",
      ]}
      title="3D Clock Tower Mechanism"
      badge="Q13 · Logical Reasoning"
    >
      <Board>
        <World3D camera={{ position: [0, 0, 7], fov: 42 }}>
          <mesh>
            <cylinderGeometry args={[2.5, 2.5, 0.2, 32]} />
            <meshStandardMaterial color="#ffffff" roughness={0.1} />
          </mesh>
          <mesh rotation={[0, 0, 0]} position={[0, 0, 0.12]}>
            <ringGeometry args={[2.3, 2.45, 32]} />
            <meshStandardMaterial color="#4f46e5" />
          </mesh>
        </World3D>

        <Bay title="Set Clock Hands to 4:30">
          <div className="flex flex-col items-center gap-3">
            <div className="text-3xl font-black text-indigo-950 font-mono bg-indigo-50 px-6 py-2 rounded-2xl border-2 border-indigo-200">
              {play.world.hour}:{play.world.minute === 0 ? "00" : play.world.minute}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => play.set({ hour: 4, minute: 30 })}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl shadow-md"
              >
                ⏰ Set to 4:30
              </button>
            </div>
          </div>
        </Bay>

        <Gauge
          label="Angle Between Clock Hands"
          value={
            play.world.hour === 4 && play.world.minute === 30
              ? "Calculated Angle = 45° (Option B)"
              : "Adjust clock time to exactly 4:30"
          }
          tone={play.derived.optionId === "B" ? "emerald" : "violet"}
        />
      </Board>
    </Shell>
  );
}

// ============================================================================
// Q14 · Number Forge (Digits 2, 0, 5, 7 -> Smallest 4-digit even = 2570) (C)
// ============================================================================
export function PlayQ14({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  type World = { digits: (number | null)[] };
  const play = usePlay<World>({
    question,
    value,
    activityState,
    onChange,
    readOnly,
    initial: { digits: [null, null, null, null] },
    derive(w) {
      const d = w.digits;
      if (d.some((x) => x === null)) return { note: "Fill all 4 digit slots" };
      if (d[0] === 0) return { note: "First digit cannot be 0" };
      const num = Number(d.join(""));
      const isEven = d[3]! % 2 === 0;
      if (!isEven) return { note: "Number must be even" };

      let opt = "A";
      if (num === 2057) opt = "A";
      else if (num === 2507) opt = "B";
      else if (num === 2570) opt = "C";
      else if (num === 5072) opt = "D";

      return {
        value: String(num),
        optionId: opt,
      };
    },
  });

  const available = [2, 0, 5, 7];

  const setSlot = (slotIdx: number, val: number) => {
    const next = [...play.world.digits];
    const prevIdx = next.indexOf(val);
    if (prevIdx !== -1) next[prevIdx] = null;
    next[slotIdx] = val;
    play.set({ digits: next });
  };

  return (
    <Shell
      play={play}
      question={question}
      dim="3D"
      hints={[
        "Four-digit number cannot begin with 0.",
        "To make it even, the units digit must be 0 or 2.",
        "To make it as small as possible, start with the smallest non-zero digit: 2.",
        "Next smallest available digit for hundreds place is 5 (since 0 must be units place for even).",
        "Arrangement: Thousands=2, Hundreds=5, Tens=7, Units=0 -> 2570.",
      ]}
      title="3D Number Forge"
      badge="Q14 · Logical Reasoning"
    >
      <Board>
        <World3D camera={{ position: [0, 3, 6], fov: 42 }}>
          {[-2.1, -0.7, 0.7, 2.1].map((x, i) => {
            const digit = play.world.digits[i];
            return (
              <group key={i} position={[x, 0, 0]}>
                <mesh position={[0, -0.3, 0]}>
                  <boxGeometry args={[1.1, 0.2, 1.1]} />
                  <meshStandardMaterial color="#cbd5e1" metalness={0.5} roughness={0.3} />
                </mesh>
                {digit !== null && (
                  <mesh position={[0, 0.4, 0]} castShadow>
                    <boxGeometry args={[0.9, 0.9, 0.9]} />
                    <meshStandardMaterial color="#4f46e5" metalness={0.2} roughness={0.1} />
                  </mesh>
                )}
              </group>
            );
          })}
        </World3D>

        <Bay title="Forge Slots [Thousands, Hundreds, Tens, Units]">
          <div className="grid grid-cols-4 gap-3">
            {["Thousands", "Hundreds", "Tens", "Units (Even)"].map((label, i) => (
              <div key={i} className="p-3 bg-white border-2 border-indigo-100 rounded-xl text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase">{label}</span>
                <div className="text-3xl font-black text-indigo-950 my-2 font-mono">
                  {play.world.digits[i] !== null ? play.world.digits[i] : "—"}
                </div>
              </div>
            ))}
          </div>
        </Bay>

        <Bay title="Available Magnetic Blocks (2, 0, 5, 7)">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {available.map((digit) => (
              <div key={digit} className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200">
                <span className="w-9 h-9 rounded-lg bg-indigo-600 text-white font-black text-lg flex items-center justify-center">
                  {digit}
                </span>
                <div className="flex items-center gap-1">
                  {[0, 1, 2, 3].map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSlot(slot, digit)}
                      className={`w-7 h-7 rounded text-xs font-bold ${
                        play.world.digits[slot] === digit ? "bg-indigo-600 text-white" : "bg-white text-slate-700 border"
                      }`}
                    >
                      S{slot + 1}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => play.set({ digits: [2, 5, 7, 0] })}
              className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-xs"
            >
              Forge 2570
            </button>
          </div>
        </Bay>

        <Gauge
          label="Constructed Four-Digit Number"
          value={
            play.derived.value
              ? `Constructed: ${play.world.digits.join("")} (Option ${play.derived.optionId})`
              : "Form the smallest 4-digit even number using 2, 0, 5, 7"
          }
          tone={play.derived.optionId === "C" ? "emerald" : "violet"}
        />
      </Board>
    </Shell>
  );
}

// ============================================================================
// Q15 · Shape Construction (2 congruent right triangles on hypotenuse = Rectangle) (A)
// ============================================================================
export function PlayQ15({ question, value, activityState, onChange, readOnly }: ActivityComponentProps) {
  type World = { joined: boolean };
  const play = usePlay<World>({
    question,
    value,
    activityState,
    onChange,
    readOnly,
    initial: { joined: false },
    derive(w) {
      if (!w.joined) return { note: "Snap triangles together" };
      return {
        value: "Rectangle",
        optionId: "A",
      };
    },
  });

  return (
    <Shell
      play={play}
      question={question}
      dim="3D"
      hints={[
        "Two congruent right-angled triangles joined along their equal hypotenuses form a 4-sided polygon.",
        "Opposite angles sum to 90° + 90° = 180°, and all four corner angles equal 90°.",
        "The resulting composite polygon is a Rectangle.",
      ]}
      title="3D Geometry Construction Workshop"
      badge="Q15 · Logical Reasoning"
    >
      <Board>
        <World3D camera={{ position: [0, 4, 6], fov: 42 }}>
          <group position={[play.world.joined ? -0.7 : -1.8, 0, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[1.2, 1.2, 0.2, 3]} />
              <meshStandardMaterial color="#4f46e5" roughness={0.3} />
            </mesh>
          </group>

          <group position={[play.world.joined ? 0.7 : 1.8, 0, 0]} rotation={[0, Math.PI, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[1.2, 1.2, 0.2, 3]} />
              <meshStandardMaterial color="#06b6d4" roughness={0.3} />
            </mesh>
          </group>
        </World3D>

        <Bay title="Join Along Hypotenuse">
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => play.set({ joined: true })}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              📐 Snap Triangles Together Along Hypotenuse
            </button>
          </div>
        </Bay>

        <Gauge
          label="Resulting Composite Shape"
          value={
            play.derived.value
              ? "Rectangle formed (Option A)"
              : "Snap the two triangles together along their longest sides"
          }
          tone={play.derived.optionId === "A" ? "emerald" : "violet"}
        />
      </Board>
    </Shell>
  );
}
