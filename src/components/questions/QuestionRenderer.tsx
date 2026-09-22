import React, { useState } from "react";
import { Question } from "@/types/question";
import { getQuestionActivity } from "@/components/activities/ActivityRegistry";
import { FileText, Layers } from "lucide-react";
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
  onChange: (val: any) => void;
  readOnly?: boolean;
  showMetadata?: boolean;
  activeView?: "activity" | "standard";
  onToggleView?: (view: "activity" | "standard") => void;
}

export function QuestionRenderer({
  question,
  value,
  onChange,
  readOnly = false,
  showMetadata = true,
  activeView: controlledActiveView,
  onToggleView,
}: QuestionRendererProps) {
  const [internalActiveView, setInternalActiveView] = useState<"activity" | "standard">("activity");
  const activeView = controlledActiveView !== undefined ? controlledActiveView : internalActiveView;
  const handleToggle = onToggleView || setInternalActiveView;

  const BespokeActivityComponent =
    getQuestionActivity(question.id) ||
    getQuestionActivity(question.questionId);

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
          <div className="p-4 bg-[#F6F9F1] border border-[#DDE4D7] rounded-xl text-xs text-[#172033]">
            Interactive engine renderer for {question.questionType} is active.
          </div>
        );
    }
  };

  return (
    <div className="space-y-3.5">
      {/* Optional Top Meta Bar (when showMetadata is enabled) */}
      {showMetadata && (
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#DDE4D7]">
          <div className="flex items-center gap-2 flex-wrap">
            {question.section && (
              <span className="px-2.5 py-0.5 bg-[#4D741F] text-white font-bold text-[11px] uppercase tracking-wider rounded-md">
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
            <span className="px-2 py-0.5 bg-[#EEF5E7] text-[#355415] rounded-md border border-[#DDE4D7]">
              +{question.marks} {question.marks === 1 ? "Mark" : "Marks"}
            </span>
            {question.negativeMarks > 0 && (
              <span className="px-2 py-0.5 bg-rose-50 text-rose-700 rounded-md border border-rose-200">
                -{question.negativeMarks} Negative
              </span>
            )}

            {/* Compact view toggle placed near right & negative */}
            {BespokeActivityComponent && (
              <div className="flex items-center gap-0.5 bg-[#F6F9F1] p-0.5 rounded-lg border border-[#DDE4D7] font-sans">
                <button
                  type="button"
                  onClick={() => handleToggle("activity")}
                  className={`px-2 py-0.5 text-[11px] font-bold rounded transition-all ${
                    activeView === "activity"
                      ? "bg-[#4D741F] text-white shadow-xs"
                      : "text-[#667085] hover:text-[#172033]"
                  }`}
                >
                  Interactive
                </button>
                <button
                  type="button"
                  onClick={() => handleToggle("standard")}
                  className={`px-2 py-0.5 text-[11px] font-bold rounded transition-all ${
                    activeView === "standard"
                      ? "bg-slate-700 text-white shadow-xs"
                      : "text-[#667085] hover:text-[#172033]"
                  }`}
                >
                  Standard
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Prominent, Large Question Prompt Text */}
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl lg:text-[26px] font-extrabold text-[#172033] leading-snug tracking-tight">
          {question.questionText}
        </h2>
      </div>

      {/* Interactive Core Body */}
      <div className="pt-1">
        {BespokeActivityComponent && activeView === "activity" ? (
          <BespokeActivityComponent
            questionId={question.id || question.questionId}
            question={question}
            value={value}
            onChange={onChange}
            readOnly={readOnly}
          />
        ) : (
          renderInteractionBody()
        )}
      </div>
    </div>
  );
}
