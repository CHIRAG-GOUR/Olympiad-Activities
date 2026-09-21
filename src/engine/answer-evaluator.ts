import { Question, QuestionAnswerPayload } from "@/types/question";

export interface EvaluationOutcome {
  isCorrect: boolean;
  isPartial: boolean;
  marksAwarded: number;
  correctAnswerSummary: string;
  debugDetails?: string;
}

/**
 * Pure Answer Evaluator
 * Decoupled from UI rendering and animation.
 * Given a Question and student's Answer Payload, calculates marks accurately.
 */
export function evaluateAnswer(question: Question, payload: QuestionAnswerPayload | null | undefined): EvaluationOutcome {
  const maxMarks = question.marks || 1;
  const negativeMarks = question.negativeMarks || 0;

  if (!payload || payload.answer === undefined || payload.answer === null) {
    return {
      isCorrect: false,
      isPartial: false,
      marksAwarded: 0,
      correctAnswerSummary: getCorrectAnswerSummary(question),
    };
  }

  const { answer } = payload;
  let isCorrect = false;
  let isPartial = false;

  switch (question.questionType) {
    case "MULTIPLE_CHOICE": {
      if (question.multipleChoiceConfig) {
        const correct = String(question.multipleChoiceConfig.correctOptionId).trim().toUpperCase();
        const userChoice = String(answer).trim().toUpperCase();
        isCorrect = userChoice === correct;
      }
      break;
    }

    case "ORDERING": {
      if (question.orderingConfig && Array.isArray(answer)) {
        const correct = question.orderingConfig.correctOrder;
        isCorrect =
          answer.length === correct.length &&
          answer.every((val, idx) => String(val).trim() === String(correct[idx]).trim());
      }
      break;
    }

    case "DRAG_DROP": {
      if (question.dragDropConfig && typeof answer === "object" && answer !== null) {
        const correctMapping = question.dragDropConfig.correctMapping;
        const keys = Object.keys(correctMapping);
        if (keys.length > 0) {
          const correctCount = keys.filter(
            (k) => String(answer[k] || "").trim() === String(correctMapping[k] || "").trim()
          ).length;
          isCorrect = correctCount === keys.length;
          if (!isCorrect && correctCount > 0) {
            isPartial = true;
          }
        }
      }
      break;
    }

    case "NUMERIC":
    case "NUMERIC_TOLERANCE": {
      if (question.numericConfig) {
        const numVal = typeof answer === "number" ? answer : parseFloat(String(answer).trim());
        if (!isNaN(numVal)) {
          const target = question.numericConfig.correctValue;
          const tolerance = question.numericConfig.tolerance || 0;
          isCorrect = Math.abs(numVal - target) <= tolerance + 0.00001;
        }
      }
      break;
    }

    case "MATCHING": {
      if (question.matchingConfig && Array.isArray(answer)) {
        // answer is array of { leftId, rightId }
        const correctPairs = question.matchingConfig.correctPairs;
        if (answer.length === correctPairs.length && correctPairs.length > 0) {
          const allMatched = correctPairs.every((cp) =>
            answer.some(
              (sa) =>
                String(sa.leftId).trim() === String(cp.leftId).trim() &&
                String(sa.rightId).trim() === String(cp.rightId).trim()
            )
          );
          isCorrect = allMatched;
        }
      }
      break;
    }

    case "CLASSIFICATION": {
      if (question.classificationConfig && typeof answer === "object" && answer !== null) {
        // answer is itemId -> categoryId
        const items = question.classificationConfig.items;
        const totalItems = items.length;
        const correctCount = items.filter(
          (item) => String(answer[item.id] || "").trim() === String(item.categoryId).trim()
        ).length;
        isCorrect = correctCount === totalItems && totalItems > 0;
        if (!isCorrect && correctCount > 0) {
          isPartial = true;
        }
      }
      break;
    }

    case "HOTSPOT": {
      if (question.hotspotConfig) {
        const correctSpots = question.hotspotConfig.correctSpotIds.map(String);
        if (Array.isArray(answer)) {
          const selectedSpots = answer.map(String);
          isCorrect =
            selectedSpots.length === correctSpots.length &&
            selectedSpots.every((s) => correctSpots.includes(s));
        } else if (typeof answer === "string") {
          isCorrect = correctSpots.includes(answer);
        }
      }
      break;
    }

    case "SEQUENCE": {
      if (question.sequenceConfig) {
        isCorrect = String(answer).trim() === String(question.sequenceConfig.correctAnswerId).trim();
      }
      break;
    }

    case "GRAPH": {
      if (question.graphConfig && Array.isArray(answer)) {
        // answer is array of {x, y}
        const targets = question.graphConfig.targetPoints;
        const tol = question.graphConfig.tolerance || 0.5;
        if (answer.length === targets.length && targets.length > 0) {
          isCorrect = targets.every((tp) =>
            answer.some(
              (pt: { x: number; y: number }) =>
                Math.abs(pt.x - tp.x) <= tol && Math.abs(pt.y - tp.y) <= tol
            )
          );
        }
      }
      break;
    }

    case "SIMULATION": {
      if (question.simulationConfig) {
        const val = typeof answer === "number" ? answer : parseFloat(String(answer));
        if (!isNaN(val)) {
          const target = question.simulationConfig.targetCondition;
          if (target.maxSuccessValue !== undefined) {
            isCorrect = val >= target.minSuccessValue && val <= target.maxSuccessValue;
          } else {
            isCorrect = val >= target.minSuccessValue;
          }
        }
      }
      break;
    }

    case "CONSTRUCTION":
    case "CUSTOM":
    default: {
      if (question.customConfig?.correctAnswer !== undefined) {
        isCorrect = JSON.stringify(answer) === JSON.stringify(question.customConfig.correctAnswer);
      } else {
        isCorrect = Boolean(answer);
      }
      break;
    }
  }

  let marksAwarded = 0;
  if (isCorrect) {
    marksAwarded = maxMarks;
  } else if (negativeMarks > 0 && answer !== undefined && answer !== null && answer !== "") {
    marksAwarded = -negativeMarks;
  }

  return {
    isCorrect,
    isPartial,
    marksAwarded,
    correctAnswerSummary: getCorrectAnswerSummary(question),
  };
}

export function getCorrectAnswerSummary(question: Question): string {
  if (question.multipleChoiceConfig) {
    const optId = question.multipleChoiceConfig.correctOptionId;
    const opt = question.multipleChoiceConfig.options.find((o) => o.id === optId);
    return `Option ${optId}${opt ? `: ${opt.text}` : ""}`;
  }

  switch (question.questionType) {
    case "ORDERING":
      if (question.orderingConfig) {
        const idMap = new Map(question.orderingConfig.items.map((i) => [i.id, i.label]));
        return question.orderingConfig.correctOrder.map((id) => idMap.get(id) || id).join(" → ");
      }
      return "Correct sequence";

    case "NUMERIC":
    case "NUMERIC_TOLERANCE":
      if (question.numericConfig) {
        return `${question.numericConfig.correctValue} ${question.numericConfig.unit || ""}`.trim();
      }
      return "Numerical answer";

    case "MATCHING":
      if (question.matchingConfig) {
        const leftMap = new Map(question.matchingConfig.leftItems.map((i) => [i.id, i.text]));
        const rightMap = new Map(question.matchingConfig.rightItems.map((i) => [i.id, i.text]));
        return question.matchingConfig.correctPairs
          .map((p) => `${leftMap.get(p.leftId) || p.leftId} ↔ ${rightMap.get(p.rightId) || p.rightId}`)
          .join(", ");
      }
      return "Correct matching pairs";

    case "CLASSIFICATION":
      return "Categorized into correct groups";

    case "HOTSPOT":
      return "Correct target location";

    case "SEQUENCE":
      if (question.sequenceConfig) {
        const match = question.sequenceConfig.options.find(
          (o) => o.id === question.sequenceConfig?.correctAnswerId
        );
        return match?.value || question.sequenceConfig.correctAnswerId;
      }
      return "Next item in sequence";

    case "SIMULATION":
      if (question.simulationConfig) {
        return `Value: ${question.simulationConfig.targetCondition.minSuccessValue} ${question.simulationConfig.parameterUnit}`;
      }
      return "Correct simulation parameter";

    default:
      return "Specified solution";
  }
}
