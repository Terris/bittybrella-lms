import {
  AssessmentQuestionId,
  AssessmentQuestionsNav,
} from "@/lib/AssessmentQuestions";
import { AssessmentId } from "@/lib/Assessments";

interface AdminAssessmentQuestionLayoutProps {
  params: { id: string; questionId: string };
  children: React.ReactNode;
}

export default function AdminAssessmentQuestionLayout({
  params,
  children,
}: AdminAssessmentQuestionLayoutProps) {
  return (
    <div className="w-full py-8 lg:flex lg:flex-row lg:h-full lg:gap-4">
      <aside className="px-4 lg:w-1/5 lg:pl-8">
        <div className="sticky top-0">
          <AssessmentQuestionsNav
            assessmentId={params.id as AssessmentId}
            questionId={params.questionId as AssessmentQuestionId}
          />
        </div>
      </aside>
      <div className="px-4 lg:w-4/5 lg:pr-8">
        <div className="flex flex-col gap-4 max-w-4xl">{children}</div>
      </div>
    </div>
  );
}
