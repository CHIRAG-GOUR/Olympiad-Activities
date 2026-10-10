import React, { useState } from "react";
import { Question } from "@/types/question";
import { getQuestionActivity } from "@/components/activities/ActivityRegistry";
import { ActivityErrorBoundary } from "@/components/activities/ActivityErrorBoundary";
import { FileText, Layers, Lightbulb } from "lucide-react";
import { MultipleChoiceQuestion } from "./MultipleChoiceQuestion";
import { OrderingQuestion } from "./OrderingQuestion";
import { DragDropQuestion } from "./DragDropQuestion";
import { NumericQuestion } from "./NumericQuestion";
import { MatchingQuestion } from "./MatchingQuestion";
import { ClassificationQuestion } from "./ClassificationQuestion";
import { HotspotQuestion } from "./HotspotQuestion";
import { SequenceQuestion } from "./SequenceQuestion";
import { GraphQuestion } from "./GraphQuestion";
import { SimulationQuestion } from "./SimulationQuestion";

interface QuestionRendererProps {
  question: Question;
  value?: any;
  /** Serialized microworld state for the bespoke activity, restored when revisiting */
  activityState?: any;
  onChange: (val: any, activityState?: any) => void;
  readOnly?: boolean;
  showMetadata?: boolean;
  activeView?: "activity" | "standard";
  onToggleView?: (view: "activity" | "standard") => void;
  hintUnlocked?: boolean;
  hintText?: string;
}

export function QuestionRenderer({
  question,
  value,
  activityState,
  onChange,
  readOnly = false,
  showMetadata = true,
  activeView: controlledActiveView,
  onToggleView,
  hintUnlocked = false,
  hintText,
}: QuestionRendererProps) {
  const [internalActiveView, setInternalActiveView] = useState<"activity" | "standard">("activity");
  const handleToggle = onToggleView || setInternalActiveView;
  const [activityKey, setActivityKey] = useState(0);

  const BespokeActivityComponent =
    getQuestionActivity(question.id) ||
    getQuestionActivity(question.questionId);

  /**
   * Activity-only questions are answered through their investigation alone: the plain
   * options view is never offered, so the answer can only come from the experiment.
   */
  const activityOnly = Boolean(question.customConfig?.activityOnly) && !!BespokeActivityComponent;
  const requestedView = controlledActiveView !== undefined ? controlledActiveView : internalActiveView;
  const activeView = activityOnly ? "activity" : requestedView;

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "EASY":
        return "bg-emerald-50 text-emerald-800 border-emerald-200/60";
      case "MEDIUM":
        return "bg-sky-50 text-sky-800 border-sky-200/60";
      case "HARD":
        return "bg-amber-50 text-amber-800 border-amber-200/60";
      case "ACHIEVER":
        return "bg-purple-50 text-purple-700 border-purple-200/60";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const renderInteractionBody = () => {
    switch (question.questionType) {
      case "ORDERING":
        return (
          <OrderingQuestion
            question={question}
            value={value}
            onChange={onChange}
            readOnly={readOnly}
          />
        );

      case "DRAG_DROP":
        return (
          <DragDropQuestion
            question={question}
            value={value}
            onChange={onChange}
            readOnly={readOnly}
          />
        );

      case "NUMERIC":
      case "NUMERIC_TOLERANCE":
        return (
          <NumericQuestion
            question={question}
            value={value}
            onChange={onChange}
            readOnly={readOnly}
          />
        );

      case "MATCHING":
        return (
          <MatchingQuestion
            question={question}
            value={value}
            onChange={onChange}
            readOnly={readOnly}
          />
        );

      case "CLASSIFICATION":
        return (
          <ClassificationQuestion
            question={question}
            value={value}
            onChange={onChange}
            readOnly={readOnly}
          />
        );

      case "HOTSPOT":
        return (
          <HotspotQuestion
            question={question}
            value={value}
            onChange={onChange}
            readOnly={readOnly}
          />
        );

      case "SEQUENCE":
        return (
          <SequenceQuestion
            question={question}
            value={value}
            onChange={onChange}
            readOnly={readOnly}
          />
        );

      case "GRAPH":
        return (
          <GraphQuestion
            question={question}
            value={value}
            onChange={onChange}
            readOnly={readOnly}
          />
        );

      case "SIMULATION":
        return (
          <SimulationQuestion
            question={question}
            value={value}
            onChange={onChange}
            readOnly={readOnly}
          />
        );

      case "MULTIPLE_CHOICE":
        return (
          <MultipleChoiceQuestion
            question={question}
            value={value}
            onChange={onChange}
            readOnly={readOnly}
          />
        );

      default:
        if (question.multipleChoiceConfig) {
          return (
            <MultipleChoiceQuestion
              question={question}
              value={value}
              onChange={onChange}
              readOnly={readOnly}
            />
          );
        }
        return (
          <div className="p-4 bg-[#F4F7FB] border border-[#E1E7EF] rounded-xl text-xs text-[#182338]">
            Interactive engine renderer for {question.questionType} is active.
          </div>
        );
    }
  };

  return (
    <div className="space-y-3.5">
      {/* Optional Top Meta Bar (when showMetadata is enabled) */}
      {showMetadata && (
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E1E7EF]">
          <div className="flex items-center gap-2 flex-wrap">
            {question.section && (
              <span className="px-2.5 py-0.5 bg-[#2468B2] text-white font-bold text-[11px] uppercase tracking-wider rounded-md">
                {question.section}
              </span>
            )}
            <span
              className={`px-2.5 py-0.5 font-extrabold text-[11px] uppercase tracking-wide rounded-md border ${getDifficultyColor(
                question.difficulty
              )}`}
            >
              {question.difficulty}
            </span>
            <span className="text-[#667085] font-mono font-bold text-xs">
              #{question.questionId}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono font-bold">
            <span className="px-2 py-0.5 bg-[#EAF2FC] text-[#1C5190] rounded-md border border-[#E1E7EF]">
              +{question.marks} {question.marks === 1 ? "Mark" : "Marks"}
            </span>
            {question.negativeMarks > 0 && (
              <span className="px-2 py-0.5 bg-rose-50 text-rose-700 rounded-md border border-rose-200">
                -{question.negativeMarks} Negative
              </span>
            )}

            {/* Compact view toggle placed near right & negative */}
            {BespokeActivityComponent && !activityOnly && (
              <div className="flex items-center gap-0.5 bg-[#F4F7FB] p-0.5 rounded-lg border border-[#E1E7EF] font-sans">
                <button
                  type="button"
                  onClick={() => handleToggle("activity")}
                  className={`px-2 py-0.5 text-[11px] font-bold rounded transition-all ${
                    activeView === "activity"
                      ? "bg-[#2468B2] text-white shadow-subtle"
                      : "text-[#667085] hover:text-[#182338]"
                  }`}
                >
                  Interactive
                </button>
                <button
                  type="button"
                  onClick={() => handleToggle("standard")}
                  className={`px-2 py-0.5 text-[11px] font-bold rounded transition-all ${
                    activeView === "standard"
                      ? "bg-slate-700 text-white shadow-subtle"
                      : "text-[#667085] hover:text-[#182338]"
                  }`}
                >
                  Standard
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Prominent Question Prompt Text */}
      <div className="space-y-1">
        <h2 className="text-lg sm:text-xl font-extrabold text-[#182338] leading-snug tracking-tight">
          {question.questionText}
        </h2>
      </div>

      {/* Unlocked Hint Clue Banner */}
      {hintUnlocked && hintText && (
        <div className="bg-amber-50/95 border-2 border-amber-300 rounded-xl p-3 sm:p-3.5 text-amber-950 flex items-start gap-3 shadow-sm animate-in fade-in slide-in-from-top-1">
          <div className="p-1.5 bg-amber-200/90 rounded-lg text-amber-800 shrink-0 mt-0.5">
            <Lightbulb className="w-4 h-4 fill-amber-500 text-amber-700" />
          </div>
          <div className="flex-1 space-y-0.5">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-[11.5px] font-black uppercase tracking-wider text-amber-900">
                Question Clue / Hint
              </span>
              <span className="text-[10.5px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                -{(question.marks || 1) >= 3 ? "1.5" : "0.5"} Mark{(question.marks || 1) >= 3 ? "s" : ""} Applied
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-800 leading-relaxed">
              {hintText}
            </p>
          </div>
        </div>
      )}

      {/* Interactive Core Body */}
      <div className="pt-1">
        {BespokeActivityComponent && activeView === "activity" ? (
          <div className="space-y-3">
            <ActivityErrorBoundary
              key={`${question.id || question.questionId}:${activityKey}`}
              questionId={question.id || question.questionId}
              fallback={
                activityOnly ? (
                  <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-xl text-sm text-amber-900 space-y-2">
                    <p className="font-bold">This investigation stopped unexpectedly. Your saved work is safe.</p>
                    <button
                      type="button"
                      onClick={() => setActivityKey((k) => k + 1)}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs transition-colors"
                    >
                      Reload the investigation
                    </button>
                  </div>
                ) : (
                <div className="space-y-3">
                  <div className="p-3.5 bg-amber-50 border-2 border-amber-200 rounded-xl text-xs text-amber-900 flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold">
                      Interactive simulation switched to standard question view for stability.
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggle("standard")}
                      className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold text-[11px] transition-colors"
                    >
                      View Standard Format
                    </button>
                  </div>
                  {renderInteractionBody()}
                </div>
                )
              }
            >
              <BespokeActivityComponent
                questionId={question.id || question.questionId}
                question={question}
                value={value}
                activityState={activityState}
                onChange={onChange}
                readOnly={readOnly}
              />
            </ActivityErrorBoundary>

            {/* Options of all questions available and clearly visible directly below the activity */}
            {question.multipleChoiceConfig && (
              <div className="pt-2 border-t border-slate-200">
                <MultipleChoiceQuestion
                  question={question}
                  value={value}
                  onChange={onChange}
                  readOnly={readOnly}
                  isBelowActivity={true}
                />
              </div>
            )}
          </div>
        ) : (
          renderInteractionBody()
        )}
      </div>
    </div>
  );
}
