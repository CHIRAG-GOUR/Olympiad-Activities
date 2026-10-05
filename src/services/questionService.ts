import { questionRepository, QuestionFilters } from "@/repositories";
import { Question } from "@/types/question";

export class QuestionService {
  async getQuestion(id: string): Promise<Question | null> {
    return questionRepository.getQuestion(id);
  }

  async listQuestions(filters?: QuestionFilters): Promise<Question[]> {
    return questionRepository.listQuestions(filters);
  }

  async getQuestionsByIds(ids: string[]): Promise<Question[]> {
    return questionRepository.getQuestionsByIds(ids);
  }

  async saveQuestion(question: Question): Promise<void> {
    return questionRepository.saveQuestion(question);
  }

  async deleteQuestion(id: string): Promise<void> {
    return questionRepository.deleteQuestion(id);
  }

  async countQuestions(): Promise<number> {
    return questionRepository.countQuestions();
  }

  async importQuestions(questions: Question[]): Promise<{ imported: number; errors: string[] }> {
    const errors: string[] = [];
    const validQuestions: Question[] = [];

    for (const q of questions) {
      if (!q.id || !q.questionText) {
        errors.push(`Question missing required fields (ID or text): ${JSON.stringify(q).slice(0, 50)}...`);
        continue;
      }
      validQuestions.push(q);
    }

    if (validQuestions.length > 0) {
      try {
        if (typeof questionRepository.saveQuestions === "function") {
          await questionRepository.saveQuestions(validQuestions);
        } else {
          for (const q of validQuestions) {
            await questionRepository.saveQuestion(q);
          }
        }
      } catch (err: any) {
        errors.push(`Batch import error: ${err?.message || err}`);
      }
    }

    return { imported: validQuestions.length, errors };
  }
}

export const questionService = new QuestionService();
