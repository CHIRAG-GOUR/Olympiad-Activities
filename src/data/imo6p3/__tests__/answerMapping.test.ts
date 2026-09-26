import { IMO6P3_QUESTIONS, IMO6P3_EXAM } from "../index";
import { IMO6P3_ACTIVITY_MAP } from "@/components/activities/imo6p3-play/registry";

describe("IMO Class 6 Paper 3 (Set C) Answer and Activity Integrity Audit", () => {
  test("All 50 questions exist with required metadata", () => {
    expect(IMO6P3_QUESTIONS.length).toBe(50);
    expect(IMO6P3_EXAM.questionIds.length).toBe(50);

    IMO6P3_QUESTIONS.forEach((q, idx) => {
      const qNum = idx + 1;
      expect(q.id).toBe(`q_imo6p3_${String(qNum).padStart(2, "0")}`);
      expect(q.code).toBe(`IMO6P3-Q${String(qNum).padStart(2, "0")}`);
      expect(q.multipleChoiceConfig?.correctOptionId).toBeDefined();
      expect(["A", "B", "C", "D"]).toContain(q.multipleChoiceConfig?.correctOptionId);
      expect(q.multipleChoiceConfig?.options?.length).toBe(4);
    });
  });

  test("All 50 questions have registered bespoke interactive activities", () => {
    IMO6P3_QUESTIONS.forEach((q) => {
      const actById = IMO6P3_ACTIVITY_MAP[q.id];
      const actByCode = IMO6P3_ACTIVITY_MAP[q.code];
      expect(actById).toBeDefined();
      expect(actByCode).toBeDefined();
      expect(actById).toBe(actByCode);
    });
  });

  test("Specific mathematical discrepancies are rigorously audited and scored accurately", () => {
    // Q3: 254->452, 439->934, 671->176, 894->498, 958->859. Sorted: 176, 452, 498, 859, 934. Mid=498 -> Mid digit=9 (Option A)
    const q3 = IMO6P3_QUESTIONS[2];
    expect(q3.multipleChoiceConfig?.correctOptionId).toBe("A");

    // Q16: 16928->16900, 8952->9000 -> 16900 - 9000 = 7900 (Option A)
    const q16 = IMO6P3_QUESTIONS[15];
    expect(q16.multipleChoiceConfig?.correctOptionId).toBe("A");

    // Q45: (105+85) * 7 * 20 = 190 * 7 * 20 = 26600 (Option D)
    const q45 = IMO6P3_QUESTIONS[44];
    expect(q45.multipleChoiceConfig?.correctOptionId).toBe("D");
  });
});
