import React, { useState } from "react";
import { Question } from "@/types/question";
import { getQuestionActivity } from "@/components/activities/ActivityRegistry";
import { Sparkles, FileText } from "lucide-react";
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
}

export function QuestionRenderer({
  question,
  value,
  onChange,
  readOnly = false,
  showMetadata = true,
}: QuestionRendererProps) {
  const [activeView, setActiveView] = useState<"activity" | "standard">("activity");

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
          <div className="p-6 bg-olympiad-bg border border-olympiad-border rounded text-[14px] text-olympiad-text">
            Interactive engine renderer for {question.questionType} is active.
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Question Header & Meta Bar */}
      {showMetadata && (
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-olympiad-border">
          <div className="flex items-center gap-2.5 flex-wrap">
            {question.section && (
              <span className="px-3 py-1 bg-olympiad-deepBlue text-white font-bold text-[12px] uppercase tracking-wider rounded">
                {question.section}
              </span>
            )}
            <span
              className={`px-3 py-1 font-extrabold text-[12px] uppercase tracking-wide rounded border ${getDifficultyColor(
                question.difficulty
              )}`}
            >
              {question.difficulty}
            </span>
            <span className="text-olympiad-textMuted font-mono font-bold text-[13px]">
              #{question.questionId}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[13px] font-mono font-bold">
            <span className="px-2.5 py-0.5 bg-olympiad-blueLight text-olympiad-deepBlue rounded border border-olympiad-academicBlue/30">
              +{question.marks} {question.marks === 1 ? "Mark" : "Marks"}
            </span>
            {question.negativeMarks > 0 && (
              <span className="px-2.5 py-0.5 bg-olympiad-redLight text-olympiad-red rounded border border-olympiad-red/30">
                -{question.negativeMarks} Negative
              </span>
            )}
          </div>
        </div>
      )}

      {/* View Switcher if Bespoke Activity Exists */}
      {BespokeActivityComponent && (
        <div className="flex items-center justify-between p-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Interactive Bespoke Activity Available</span>
          </div>
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveView("activity")}
              className={`px-3 py-1 text-xs font-bold rounded transition-all flex items-center gap-1.5 ${
                activeView === "activity"
                  ? "bg-emerald-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> Interactive Activity
            </button>
            <button
              type="button"
              onClick={() => setActiveView("standard")}
              className={`px-3 py-1 text-xs font-bold rounded transition-all flex items-center gap-1.5 ${
                activeView === "standard"
                  ? "bg-slate-700 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> Standard View
            </button>
          </div>
        </div>
      )}

      {/* Prominent Question Prompt Text */}
      <div className="space-y-2">
        <h2 className="text-xl lg:text-[24px] font-extrabold text-olympiad-deepBlue leading-snug tracking-tight">
          {question.questionText}
        </h2>
      </div>

      {/* Interactive Core Body */}
      <div className="pt-2">
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
