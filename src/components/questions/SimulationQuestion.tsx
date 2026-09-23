"use client";

import React, { useState, useEffect } from "react";
import { Question } from "@/types/question";
import { Play, RotateCcw, Activity, Rocket, Scale } from "lucide-react";

interface SimulationQuestionProps {
  question: Question;
  value?: number;
  onChange: (val: number) => void;
  readOnly?: boolean;
}

export function SimulationQuestion({ question, value, onChange, readOnly = false }: SimulationQuestionProps) {
  const config = question.simulationConfig;
  const minVal = config?.minVal ?? 0;
  const maxVal = config?.maxVal ?? 5000;
  const step = config?.step ?? 50;
  const defaultVal = config?.defaultVal ?? 1500;

  const [currentVal, setCurrentVal] = useState<number>(() => {
    if (value !== undefined && typeof value === "number") return value;
    return defaultVal;
  });

  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);

  useEffect(() => {
    if (value !== undefined && typeof value === "number") {
      setCurrentVal(value);
    }
  }, [value]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return;
    const v = parseFloat(e.target.value);
    setCurrentVal(v);
    onChange(v);
    setIsSimulating(false);
    setSimulationProgress(0);
  };

  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return;
    const v = parseFloat(e.target.value);
    if (!isNaN(v)) {
      setCurrentVal(v);
      onChange(v);
      setIsSimulating(false);
      setSimulationProgress(0);
    }
  };

  const runSimulation = () => {
    setIsSimulating(true);
    setSimulationProgress(0);
    let p = 0;
    const interval = setInterval(() => {
      p += 0.04;
      if (p >= 1) {
        p = 1;
        clearInterval(interval);
      }
      setSimulationProgress(p);
    }, 35);
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    setSimulationProgress(0);
  };

  const simType = config?.simulationType || "rocket_altitude";
  const achievedAltitude = Math.round((currentVal / 3000) * 270);
  const targetAlt = 250;
  const rocketHeightPercent = Math.min(
    95,
    Math.max(6, (achievedAltitude / 350) * 100 * (isSimulating ? simulationProgress : 1))
  );

  const leftTorque = 36;
  const rightTorque = currentVal * 3;
  const torqueDiff = rightTorque - leftTorque;
  const tiltAngleDeg = Math.max(-25, Math.min(25, (torqueDiff / 18) * 15));

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Parameter Control Bar */}
      <div className="bg-[#FFFDF5] p-6 rounded-2xl border-2 border-[#FDE68A] shadow-md space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[12px] font-extrabold uppercase tracking-wider text-[#92400E]">
              Educational Parameter Adjustment
            </div>
            <div className="text-xl font-extrabold text-slate-900 flex items-center gap-2 mt-0.5">
              {simType === "rocket_altitude" ? (
                <Rocket className="w-6 h-6 text-[#D97706]" />
              ) : (
                <Scale className="w-6 h-6 text-[#2563A8]" />
              )}
              {config?.parameterName || "Control Value"}
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <input
              type="number"
              min={minVal}
              max={maxVal}
              step={step}
              value={currentVal}
              onChange={handleNumericChange}
              disabled={readOnly}
              className="w-36 h-[48px] text-center text-2xl font-mono font-extrabold text-slate-900 px-3 bg-white border-2 border-[#F59E0B] rounded-xl shadow-inner focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FEF08A]"
            />
            <span className="h-[48px] px-4 bg-[#FEF3C7] border-2 border-[#FDE68A] text-[#92400E] font-extrabold text-[14px] rounded-xl flex items-center font-mono">
              {config?.parameterUnit}
            </span>
          </div>
        </div>

        {/* Range Slider */}
        <div className="space-y-1.5">
          <input
            type="range"
            min={minVal}
            max={maxVal}
            step={step}
            value={currentVal}
            onChange={handleSliderChange}
            disabled={readOnly}
            className="w-full h-3 bg-[#FDE68A] rounded-lg appearance-none cursor-pointer accent-[#F59E0B]"
          />
          <div className="flex justify-between text-[13px] text-slate-600 font-mono font-bold">
            <span>{minVal} {config?.parameterUnit}</span>
            <span className="text-[#92400E] font-extrabold">Current Selected: {currentVal} {config?.parameterUnit}</span>
            <span>{maxVal} {config?.parameterUnit}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-3 border-t-2 border-[#FDE68A]">
          <button
            type="button"
            onClick={runSimulation}
            className="h-[44px] px-6 bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 rounded-xl text-[14px] font-extrabold flex items-center gap-2.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-slate-950 text-slate-950" /> Run Educational Simulation
          </button>
          <button
            type="button"
            onClick={resetSimulation}
            className="h-[44px] px-4 bg-white border-2 border-[#FDE68A] hover:bg-[#FEF3C7] text-slate-800 rounded-xl text-[13px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-[#D97706]" /> Reset Simulation
          </button>
        </div>
      </div>

      {/* Trajectory Simulation Canvas */}
      {simType === "rocket_altitude" ? (
        <div className="bg-[#FFFDF5] border-2 border-[#FDE68A] rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b-2 border-[#FDE68A] text-[14px] font-extrabold text-slate-900">
            <span className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#D97706]" />
              Atmospheric Trajectory Visualization
            </span>
            <span className="text-rose-600 font-extrabold font-mono">
              Target Altitude Barrier: {targetAlt} km
            </span>
          </div>

          <div className="relative h-80 bg-gradient-to-t from-amber-100 via-amber-50 to-slate-900/10 rounded-xl overflow-hidden border-2 border-[#FDE68A]">
            {/* Target 250km Line */}
            <div
              className="absolute left-0 right-0 border-t-2 border-dashed border-rose-500 z-10 flex items-center justify-between px-4"
              style={{ bottom: `${(targetAlt / 350) * 100}%` }}
            >
              <span className="text-[12px] font-extrabold text-rose-700 bg-white/95 px-2.5 py-1 rounded-lg shadow-subtle border border-rose-200">
                Target Threshold ({targetAlt} km)
              </span>
              <span className="text-[12px] text-rose-700 font-mono font-extrabold bg-white/95 px-2 py-0.5 rounded-lg shadow-subtle">
                Orbital Checkpoint Line
              </span>
            </div>

            {/* Altitude Markers */}
            <div className="absolute left-3 top-3 text-[12px] text-slate-900 font-mono font-bold bg-white/80 px-2 py-0.5 rounded-lg border border-[#FDE68A]">
              350 km (Exosphere)
            </div>
            <div className="absolute left-3 bottom-3 text-[12px] text-slate-900 font-mono font-bold bg-white/80 px-2 py-0.5 rounded-lg border border-[#FDE68A]">
              0 km (Launchpad)
            </div>

            {/* Rocket Object */}
            <div
              className="absolute left-1/2 -translate-x-1/2 transition-all duration-300 flex flex-col items-center z-20"
              style={{ bottom: `${rocketHeightPercent}%` }}
            >
              <div className="p-3 bg-white border-2 border-[#F59E0B] rounded-full shadow-lg text-[#D97706]">
                <Rocket className="w-8 h-8 -rotate-45" />
              </div>
              {isSimulating && (
                <div className="w-2.5 h-8 bg-gradient-to-b from-orange-500 via-amber-400 to-transparent animate-pulse rounded" />
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-[14px] text-slate-900 bg-[#FEF3C7] p-4 rounded-xl border-2 border-[#FDE68A]">
            <span>
              Achieved Flight Altitude: <strong className="text-xl font-mono text-slate-900">{achievedAltitude} km</strong>
            </span>
            <span
              className={`font-extrabold text-[15px] ${
                achievedAltitude >= targetAlt ? "text-emerald-700" : "text-rose-600"
              }`}
            >
              {achievedAltitude >= targetAlt
                ? "✓ Passes Target Altitude (Success)"
                : "✕ Falls Short of Target (Velocity Insufficient)"}
            </span>
          </div>
        </div>
      ) : (
        /* Balance Scale Canvas */
        <div className="bg-[#FFFDF5] border-2 border-[#FDE68A] rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b-2 border-[#FDE68A] text-[14px] font-extrabold text-slate-900">
            <span className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#D97706]" />
              Fulcrum Torque Equilibrium
            </span>
            <span className="font-mono text-[#92400E] font-bold">Left Pan Specimen: 18 kg @ 2m (36 N·m)</span>
          </div>

          <div className="py-12 flex flex-col items-center justify-center">
            <div
              className="relative w-96 h-4 bg-[#2563A8] rounded transition-transform duration-300 shadow-md"
              style={{ transform: `rotate(${tiltAngleDeg}deg)` }}
            >
              <div className="absolute -left-4 top-4 flex flex-col items-center">
                <div className="w-1 h-14 bg-slate-400" />
                <div className="px-4 py-2 bg-white border-2 border-[#2563A8] rounded-xl text-[14px] font-extrabold text-[#2563A8] shadow-md">
                  18 kg
                </div>
              </div>

              <div className="absolute -right-4 top-4 flex flex-col items-center">
                <div className="w-1 h-14 bg-slate-400" />
                <div className="px-4 py-2 bg-[#FEF3C7] border-2 border-[#F59E0B] rounded-xl text-[14px] font-extrabold text-[#92400E] shadow-md">
                  {currentVal} kg
                </div>
              </div>
            </div>

            <div className="w-0 h-0 border-l-[22px] border-l-transparent border-r-[22px] border-r-transparent border-b-[36px] border-b-[#2563A8] mt-2" />
            <div className="w-32 h-3 bg-slate-700 rounded" />
          </div>

          <div className="flex items-center justify-between text-[14px] text-slate-900 bg-[#FEF3C7] p-4 rounded-xl border-2 border-[#FDE68A]">
            <span>
              Right Fulcrum Torque: <strong className="text-xl font-mono text-slate-900">{rightTorque} N·m</strong>
            </span>
            <span
              className={`font-extrabold text-[15px] ${
                torqueDiff === 0 ? "text-emerald-700" : "text-rose-600"
              }`}
            >
              {torqueDiff === 0
                ? "✓ Exact Torque Equilibrium (Balanced)"
                : torqueDiff < 0
                ? "✕ Left Heavy"
                : "✕ Right Heavy"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
