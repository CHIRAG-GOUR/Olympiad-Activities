"use client";

import React, { useState } from "react";
import { RotateCw, CheckCircle2, Eye } from "lucide-react";

interface DiceLabActivityProps {
  questionId: string;
  value?: any;
  onChange: (val: any) => void;
  readOnly?: boolean;
}

export function DiceLabActivity({
  value,
  onChange,
  readOnly = false }: DiceLabActivityProps) {
  // Rotational angles for 3D examination
  const [rotX, setRotX] = useState(-25);
  const [rotY, setRotY] = useState(45);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const options = [
    {
      id: "A",
      val: "3",
      label: "Face 3",
      rotX: 0,
      rotY: -90,
      desc: "Adjacent face on right" },
    {
      id: "B",
      val: "2",
      label: "Face 2",
      rotX: -90,
      rotY: 0,
      desc: "Adjacent face on bottom" },
    {
      id: "C",
      val: "4",
      label: "Face 4",
      rotX: 0,
      rotY: 90,
      desc: "Adjacent face on left" },
    {
      id: "D",
      val: "5",
      label: "Face 5 (Opposite to 6)",
      rotX: 20,
      rotY: 0,
      desc: "Opposite to Bottom Face 6",
      isCorrect: true },
  ];

  const initialOpt = options.find((o) => o.id === value || o.val === value) || options[3];
  const [selectedId, setSelectedId] = useState<string>(initialOpt.id);

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

  const handleOptionSelect = (opt: typeof options[0]) => {
    if (readOnly) return;
    setSelectedId(opt.id);
    setRotX(opt.rotX);
    setRotY(opt.rotY);
    onChange(opt.id);
  };

  const setPreset = (preset: "pos1" | "pos2" | "top") => {
    if (readOnly) return;
    if (preset === "pos1") {
      setRotX(-25);
      setRotY(45);
    } else if (preset === "pos2") {
      setRotX(25);
      setRotY(-45);
    } else if (preset === "top") {
      setRotX(-90);
      setRotY(0);
    }
  };

  const handleFaceClick = (faceVal: string) => {
    if (readOnly) return;
    const targetOpt = options.find((o) => o.val === faceVal);
    if (targetOpt) {
      handleOptionSelect(targetOpt);
    }
  };

  const handleDragRelease = () => {
    setIsDragging(false);
    // Find closest matching option angle
    let closestOpt = options[0];
    let minDiff = 999999;
    options.forEach((opt) => {
      const diff = Math.hypot(opt.rotX - rotX, opt.rotY - (rotY % 360));
      if (diff < minDiff) {
        minDiff = diff;
        closestOpt = opt;
      }
    });
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 text-slate-900 shadow-sm space-y-3.5">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700">
            <RotateCw className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 tracking-wide flex items-center gap-2">
              Rotating 3D Dice Laboratory
            </h3>
            <p className="text-xs text-slate-600">
              Click any face on the 3D die or use the controls below to orient the die and submit your answer directly.
            </p>
          </div>
        </div>

        {/* Camera Preset Quick Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPreset("pos1")}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 transition cursor-pointer"
          >
            Position 1 (3,2,5)
          </button>
          <button
            type="button"
            onClick={() => setPreset("pos2")}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 transition cursor-pointer"
          >
            Position 2 (1,4,5)
          </button>
          <button
            type="button"
            onClick={() => setPreset("top")}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 transition cursor-pointer"
          >
            Top View
          </button>
        </div>
      </div>

      {/* 3D Interactive Turntable Area */}
      <div
        className="relative h-64 bg-slate-50 border-2 border-slate-200 rounded-2xl flex items-center justify-center cursor-grab active:cursor-grabbing select-none overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleDragRelease}
        onMouseLeave={handleDragRelease}
        style={{ perspective: "900px" }}
      >
        {/* Ambient Grid Table */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at center, #0B4F8A 1px, transparent 1px)",
            backgroundSize: "20px 20px" }}
        />

        {/* On-Stage Quick Interactive Face Buttons */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-auto">
          <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-xs p-1 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase px-1.5">Turn to:</span>
            {options.map((opt) => (
              <button
                key={opt.val}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOptionSelect(opt);
                }}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  selectedId === opt.id
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Face {opt.val} ({opt.id})
              </button>
            ))}
          </div>
        </div>

        {/* 3D Die Container with smooth transition */}
        <div
          className="relative w-28 h-28 transition-transform duration-300 ease-out cursor-pointer"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)` }}
        >
          {/* Face 5 - Front */}
          <div
            onClick={(e) => { e.stopPropagation(); handleFaceClick("5"); }}
            className={`absolute inset-0 bg-white border-2 rounded-xl shadow-md flex items-center justify-center select-none transition-all hover:border-emerald-500 ${
              selectedId === "D" ? "border-emerald-600 ring-4 ring-emerald-400/40" : "border-slate-400"
            }`}
            style={{ transform: "translateZ(56px)" }}
            title="Click to select Face 5"
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
            className="absolute inset-0 bg-white border-2 border-slate-400 rounded-xl shadow-md flex items-center justify-center select-none"
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
            onClick={(e) => { e.stopPropagation(); handleFaceClick("3"); }}
            className={`absolute inset-0 bg-white border-2 rounded-xl shadow-md flex items-center justify-center select-none transition-all hover:border-emerald-500 ${
              selectedId === "A" ? "border-emerald-600 ring-4 ring-emerald-400/40" : "border-slate-400"
            }`}
            style={{ transform: "rotateY(90deg) translateZ(56px)" }}
            title="Click to select Face 3"
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
            onClick={(e) => { e.stopPropagation(); handleFaceClick("4"); }}
            className={`absolute inset-0 bg-white border-2 rounded-xl shadow-md flex items-center justify-center select-none transition-all hover:border-emerald-500 ${
              selectedId === "C" ? "border-emerald-600 ring-4 ring-emerald-400/40" : "border-slate-400"
            }`}
            style={{ transform: "rotateY(-90deg) translateZ(56px)" }}
            title="Click to select Face 4"
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
            onClick={(e) => { e.stopPropagation(); handleFaceClick("2"); }}
            className={`absolute inset-0 bg-white border-2 rounded-xl shadow-md flex items-center justify-center select-none transition-all hover:border-emerald-500 ${
              selectedId === "B" ? "border-emerald-600 ring-4 ring-emerald-400/40" : "border-slate-400"
            }`}
            style={{ transform: "rotateX(90deg) translateZ(56px)" }}
            title="Click to select Face 2"
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
            className="absolute inset-0 bg-white border-2 border-slate-400 rounded-xl shadow-md flex items-center justify-center select-none"
            style={{ transform: "rotateX(-90deg) translateZ(56px)" }}
          >
            <div className="grid grid-cols-3 grid-rows-3 gap-2 p-3 w-full h-full">
              <span />
              <span />
              <span />
              <span />
              <span className="w-4 h-4 bg-red-600 rounded-full place-self-center scale-150" />
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>

        {/* Dynamic Rotation Info Badge */}
        <div className="absolute bottom-3 left-3 bg-white border border-slate-200 px-3 py-1 rounded-lg text-[11px] font-mono text-slate-600 shadow-xs flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-emerald-600" />
          <span>Angles: Pitch {Math.round(rotX)}° | Yaw {Math.round(rotY)}°</span>
        </div>
      </div>

      {/* Answer Options Grid (Connected directly to die orientation) */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Select What Face is Opposite to Face 6 (or click to inspect that face):
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {options.map((opt) => {
            const isSelected = selectedId === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={readOnly}
                onClick={() => handleOptionSelect(opt)}
                className={`p-4 rounded-xl border-2 font-bold transition-all text-left flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? "bg-emerald-50 border-emerald-600 text-emerald-950 shadow-md shadow-emerald-600/10 scale-[1.02]"
                    : "bg-white border-2 border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-slate-100 border border-slate-300 flex items-center justify-center text-xs font-black text-slate-700">
                      {opt.id}
                    </span>
                    <span className="text-base font-black font-mono">{opt.label}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                </div>
                <span className="text-[11px] text-slate-500 mt-2 font-medium">{opt.desc}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
