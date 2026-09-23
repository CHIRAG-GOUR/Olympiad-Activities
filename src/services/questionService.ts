import { questionRepository, QuestionFilters } from "@/repositories";
import { Question } from "@/types/question";

export class QuestionService {
  async getQuestion(id: string): Promise<Question | null> {
    return questionRepository.getQuestion(id);
  }

  async listQuestions(filters?: QuestionFilters): Promise<Question[]> {
    return questionRepository.listQuestions(filters);
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
    let imported = 0;

    for (const q of questions) {
      try {
        if (!q.id || !q.questionText) {
          errors.push(`Question missing required fields (ID or text): ${JSON.stringify(q).slice(0, 50)}...`);
          continue;
        }
        await questionRepository.saveQuestion(q);
        imported++;
      } catch (err: any) {
        errors.push(`Error saving question ${q.id}: ${err?.message || err}`);
      }
    }

    return { imported, errors };
  }
}

export const questionService = new QuestionService();
