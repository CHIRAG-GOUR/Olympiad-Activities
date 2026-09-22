"use client";

import React, { useState } from "react";
import { RotateCw, CheckCircle2, Eye, Sparkles } from "lucide-react";

interface DiceLabActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function DiceLabActivity({
  value,
  onChange,
  readOnly = false,
}: DiceLabActivityProps) {
  // Rotational angles for 3D examination
  const [rotX, setRotX] = useState(-25);
  const [rotY, setRotY] = useState(45);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedAnswer, setSelectedAnswer] = useState<string>(value ? String(value) : "");

  // Options for what is at the top if 6 is at the bottom
  const options = [
    { id: "A", val: "3", label: "Face 3" },
    { id: "B", val: "2", label: "Face 2" },
    { id: "C", val: "4", label: "Face 4" },
    { id: "D", val: "5", label: "Face 5 (Opposite to 6)" },
  ];

  const handleMouseDown = (e: React.MouseEvent) => {
    if (readOnly) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || readOnly) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setRotY((prev) => prev + dx * 0.8);
    setRotX((prev) => Math.max(-80, Math.min(80, prev - dy * 0.8)));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSelect = (val: string) => {
    if (readOnly) return;
    setSelectedAnswer(val);
    onChange(val);
  };

  const setPreset = (view: "pos1" | "pos2" | "top") => {
    if (view === "pos1") {
      setRotX(-20);
      setRotY(45); // Shows 3, 2, 5
    } else if (view === "pos2") {
      setRotX(-20);
      setRotY(-135); // Shows 1, 4, 5
    } else {
      setRotX(-85);
      setRotY(0); // Top down view
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-xl p-6 text-white shadow-2xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/20 border border-emerald-400/40 rounded-lg text-emerald-400">
            <RotateCw className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-emerald-300 tracking-wide flex items-center gap-2">
              Rotating Dice Laboratory <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-400">
              Drag to rotate the 3D die or switch presets to inspect adjacent faces.
            </p>
          </div>
        </div>

        {/* Camera Preset Quick Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPreset("pos1")}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded text-xs font-semibold text-slate-200 transition"
          >
            Position 1 (3,2,5)
          </button>
          <button
            type="button"
            onClick={() => setPreset("pos2")}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded text-xs font-semibold text-slate-200 transition"
          >
            Position 2 (1,4,5)
          </button>
          <button
            type="button"
            onClick={() => setPreset("top")}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded text-xs font-semibold text-slate-200 transition"
          >
            Top View
          </button>
        </div>
      </div>

      {/* 3D Interactive Turntable Area */}
      <div
        className="relative h-64 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-center cursor-grab active:cursor-grabbing select-none overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ perspective: "800px" }}
      >
        {/* Ambient Grid Table */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at center, #10b981 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* 3D Die Container */}
        <div
          className="relative w-28 h-28 transition-transform duration-75"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          }}
        >
          {/* Face 5 - Front */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-white to-slate-200 border-2 border-slate-400 rounded-xl shadow-inner flex items-center justify-center font-black text-3xl text-slate-900 select-none"
            style={{ transform: "translateZ(56px)" }}
          >
            <div className="grid grid-cols-3 grid-rows-3 gap-2 p-3 w-full h-full">
              <span className="w-3.5 h-3.5 bg-slate-900 rounded-full place-self-start" />
              <span />
              <span className="w-3.5 h-3.5 bg-slate-900 rounded-full place-self-end" />
              <span />
              <span className="w-3.5 h-3.5 bg-red-600 rounded-full place-self-center scale-125" />
              <span />
              <span className="w-3.5 h-3.5 bg-slate-900 rounded-full place-self-start" />
              <span />
              <span className="w-3.5 h-3.5 bg-slate-900 rounded-full place-self-end" />
            </div>
          </div>

          {/* Face 6 - Back */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-white to-slate-200 border-2 border-slate-400 rounded-xl shadow-inner flex items-center justify-center font-black text-3xl text-slate-900 select-none"
            style={{ transform: "rotateY(180deg) translateZ(56px)" }}
          >
            <div className="grid grid-cols-3 grid-rows-3 gap-2 p-3 w-full h-full">
              <span className="w-3.5 h-3.5 bg-slate-900 rounded-full place-self-start" />
              <span />
              <span className="w-3.5 h-3.5 bg-slate-900 rounded-full place-self-end" />
              <span className="w-3.5 h-3.5 bg-slate-900 rounded-full place-self-start" />
              <span />
              <span className="w-3.5 h-3.5 bg-slate-900 rounded-full place-self-end" />
              <span className="w-3.5 h-3.5 bg-slate-900 rounded-full place-self-start" />
              <span />
              <span className="w-3.5 h-3.5 bg-slate-900 rounded-full place-self-end" />
            </div>
          </div>

          {/* Face 3 - Right */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-white to-slate-200 border-2 border-slate-400 rounded-xl shadow-inner flex items-center justify-center font-black text-3xl text-slate-900 select-none"
            style={{ transform: "rotateY(90deg) translateZ(56px)" }}
          >
            <div className="grid grid-cols-3 grid-rows-3 gap-2 p-3 w-full h-full">
              <span className="w-3.5 h-3.5 bg-slate-900 rounded-full place-self-start" />
              <span />
              <span />
              <span />
              <span className="w-3.5 h-3.5 bg-slate-900 rounded-full place-self-center" />
              <span />
              <span />
              <span />
              <span className="w-3.5 h-3.5 bg-slate-900 rounded-full place-self-end" />
            </div>
          </div>

          {/* Face 4 - Left */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-white to-slate-200 border-2 border-slate-400 rounded-xl shadow-inner flex items-center justify-center font-black text-3xl text-slate-900 select-none"
            style={{ transform: "rotateY(-90deg) translateZ(56px)" }}
          >
            <div className="grid grid-cols-3 grid-rows-3 gap-2 p-3 w-full h-full">
              <span className="w-3.5 h-3.5 bg-slate-900 rounded-full place-self-start" />
              <span />
              <span className="w-3.5 h-3.5 bg-slate-900 rounded-full place-self-end" />
              <span />
              <span />
              <span />
              <span className="w-3.5 h-3.5 bg-slate-900 rounded-full place-self-start" />
              <span />
              <span className="w-3.5 h-3.5 bg-slate-900 rounded-full place-self-end" />
            </div>
          </div>

          {/* Face 2 - Top */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-white to-slate-200 border-2 border-slate-400 rounded-xl shadow-inner flex items-center justify-center font-black text-3xl text-slate-900 select-none"
            style={{ transform: "rotateX(90deg) translateZ(56px)" }}
          >
            <div className="grid grid-cols-3 grid-rows-3 gap-2 p-3 w-full h-full">
              <span className="w-3.5 h-3.5 bg-slate-900 rounded-full place-self-start" />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span className="w-3.5 h-3.5 bg-slate-900 rounded-full place-self-end" />
            </div>
          </div>

          {/* Face 1 - Bottom */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-white to-slate-200 border-2 border-slate-400 rounded-xl shadow-inner flex items-center justify-center font-black text-3xl text-slate-900 select-none"
            style={{ transform: "rotateX(-90deg) translateZ(56px)" }}
          >
            <div className="flex items-center justify-center w-full h-full">
              <span className="w-5 h-5 bg-red-600 rounded-full shadow" />
            </div>
          </div>
        </div>

        {/* Live Spatial Telemetry Badge */}
        <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-700/80 px-3 py-1 rounded-md text-[11px] font-mono text-slate-300 flex items-center gap-2 pointer-events-none">
          <Eye className="w-3.5 h-3.5 text-emerald-400" />
          <span>Euler: X={Math.round(rotX)}° Y={Math.round(rotY)}°</span>
        </div>
      </div>

      {/* Decision Selection Grid */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
          Select the number that must be at the TOP (opposite to 6):
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {options.map((opt) => {
            const isSelected = selectedAnswer === opt.val || selectedAnswer === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={readOnly}
                onClick={() => handleSelect(opt.val)}
                className={`p-3.5 rounded-xl border-2 font-bold transition-all flex flex-col items-center justify-center gap-1.5 ${
                  isSelected
                    ? "bg-emerald-600/30 border-emerald-400 text-emerald-200 shadow-lg shadow-emerald-500/20 scale-[1.02]"
                    : "bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-700/60 hover:border-slate-500"
                }`}
              >
                <span className="text-2xl font-black">{opt.val}</span>
                <span className="text-[11px] font-mono text-slate-400">{opt.label}</span>
                {isSelected && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
