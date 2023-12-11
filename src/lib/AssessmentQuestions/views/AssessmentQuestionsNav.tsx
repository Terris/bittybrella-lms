import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Text,
} from "@/lib/ui";
import {
  SortableList,
  SortableListItem,
} from "@/lib/providers/SortableListProvider";
import { cn } from "@/lib/utils";
import { AssessmentId, useAssessment } from "@/lib/Assessments";
import {
  useAssessmentQuestions,
  useCreateAssessmentQuestion,
  useUpdateAssessmentQuestionsOrder,
} from "../hooks";
import { useToast } from "@/lib/hooks";
import { AssessmentQuestionId } from "../types";

interface AssessmentQuestionsNavProps {
  assessmentId: AssessmentId;
  questionId?: AssessmentQuestionId | null;
}

export function AssessmentQuestionsNav({
  assessmentId,
  questionId,
}: AssessmentQuestionsNavProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { isLoading, assessment } = useAssessment({ id: assessmentId });
  const selectedQuestionId = questionId;

  const { assessmentQuestions } = useAssessmentQuestions({
    assessmentId,
  });

  const { createBlankAssessmentQuestion } = useCreateAssessmentQuestion({
    assessmentId,
  });

  const sortableListItems = assessmentQuestions?.map(
    (question) => question._id
  );

  const { updateAssessmentQuestionsOrder } = useUpdateAssessmentQuestionsOrder({
    assessmentId,
  });

  async function handleOnUpdate(updatedItems: string[]) {
    const res = await updateAssessmentQuestionsOrder({
      idsInOrder: updatedItems as Id<"assessmentQuestions">[],
    });
    if (res) {
      toast({
        title: "Success!",
        description: "Updated assessment questions order.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error!",
        description:
          "Something went wrong trying to update assessment questions order.",
      });
    }
  }

  // TODO: Add a visual loading state and handle error state
  if (isLoading || !assessment || !assessmentQuestions || !sortableListItems)
    return null;

  return (
    <>
      <div className="flex flex-row items-center justify-between pb-4">
        <Text className="font-bold">Assessment Questions</Text>
      </div>
      <div className="hidden lg:block">
        <SortableList items={sortableListItems} onUpdate={handleOnUpdate}>
          <div className="flex flex-col gap-2">
            {assessmentQuestions.map((question) => (
              <SortableListItem key={question._id} id={question._id}>
                <div className="w-full flex flex-col truncate">
                  <Button
                    key={question._id}
                    variant="ghost"
                    onClick={() =>
                      router.push(
                        `/admin/assessments/${assessmentId}/questions/${question?._id}`
                      )
                    }
                    className={cn(
                      "w-full truncate transition-all",
                      selectedQuestionId === question?._id && "font-bold pl-5"
                    )}
                  >
                    <div className="w-full text-left truncate">
                      {question.question}
                    </div>
                  </Button>
                </div>
              </SortableListItem>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={createBlankAssessmentQuestion}
              className=" justify-start italic"
            >
              <Plus className="h-3 w-3 mr-1" /> Add assessment question
            </Button>
          </div>
        </SortableList>
      </div>
      <div className="block lg:hidden pb-6">
        <AssessmentQuestionsNavSelect
          assessmentQuestions={assessmentQuestions}
          selectedQuestionId={selectedQuestionId}
          setSelectedQuestionId={(questionId) =>
            router.push(
              `/admin/assessments/${assessmentId}/questions/${questionId}`
            )
          }
        />
      </div>
    </>
  );
}

function AssessmentQuestionsNavSelect({
  assessmentQuestions,
  selectedQuestionId,
  setSelectedQuestionId,
}: {
  assessmentQuestions: Doc<"assessmentQuestions">[];
  selectedQuestionId: Id<"assessmentQuestions"> | null | undefined;
  setSelectedQuestionId: (id: Id<"assessmentQuestions"> | null) => void;
}) {
  return (
    <Select
      onValueChange={(val) =>
        setSelectedQuestionId(val as Id<"assessmentQuestions">)
      }
      value={selectedQuestionId as string}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a question" />
      </SelectTrigger>
      <SelectContent>
        {assessmentQuestions.map((question) => (
          <SelectItem value={question._id} key={question._id}>
            {question.question}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
