import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical } from "lucide-react";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Text,
} from "@/lib/ui";
import { cn } from "@/lib/utils";
import { SortableAdminNavList } from "@/lib/Admin";
import { AssessmentId, useAssessment } from "@/lib/Assessments";
import { useToast } from "@/lib/hooks";
import {
  useAssessmentQuestions,
  useCreateAssessmentQuestion,
  useUpdateAssessmentQuestionsOrder,
} from "../hooks";
import { AssessmentQuestionDoc, AssessmentQuestionId } from "../types";

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
  const [isEditingContentOrder, setIsEditingContentOrder] =
    useState<boolean>(false);

  const { assessmentQuestions } = useAssessmentQuestions({
    assessmentId,
  });

  const sortableListItems = assessmentQuestions?.map(
    (question) => question._id
  );

  const { createBlankAssessmentQuestion } = useCreateAssessmentQuestion({
    assessmentId,
  });

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
  if (isLoading || !assessment || !assessmentQuestions || !sortableListItems) {
    return null;
  }

  return (
    <>
      <div className="flex flex-row items-center justify-between pb-2">
        <Text className="font-bold">Assessment Questions</Text>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={createBlankAssessmentQuestion}>
              Add question
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => setIsEditingContentOrder((i) => !i)}
            >
              {isEditingContentOrder
                ? "Done editing content order"
                : "Edit content order"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="hidden lg:flex lg:flex-col lg:gap-1">
        {isEditingContentOrder ? (
          <SortableAdminNavList<AssessmentQuestionDoc, "_id">
            data={assessmentQuestions}
            keyExtractor="_id"
            sortableItemIds={sortableListItems}
            onUpdate={handleOnUpdate}
            renderItem={(question) => (
              <Button
                key={question._id}
                variant="ghost"
                size="sm"
                onClick={() =>
                  router.push(
                    `/admin/assessments/${assessmentId}/questions/${question?._id}`
                  )
                }
                className={cn("w-full truncate")}
              >
                <div className="w-full text-left truncate">
                  {question.question}
                </div>
              </Button>
            )}
          />
        ) : (
          <>
            {assessmentQuestions.map((question) => (
              <Button
                key={question._id}
                variant="ghost"
                size="sm"
                onClick={() =>
                  router.push(
                    `/admin/assessments/${assessmentId}/questions/${question?._id}`
                  )
                }
                className={cn("w-full truncate")}
              >
                <div className="w-full text-left truncate">
                  {question.question}
                </div>
              </Button>
            ))}
          </>
        )}
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
