import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Doc, Id } from "../../../convex/_generated/dataModel";
import {
  Button,
  FlexColumn,
  FlexRow,
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
import { useAssessment } from "./providers/AssessmentProvider";
import { Plus } from "lucide-react";

export function AssessmentQuestionsNav() {
  const {
    assessment,
    selectedQuestionId,
    setSelectedQuestionId,
    createBlankAssessmentQuestion,
  } = useAssessment();

  const assessmentQuestions = assessment?.questions ?? [];
  const sortableListItems = assessmentQuestions.map((question) => question._id);

  const updateAssessmentQuestionsOrder = useMutation(
    api.assessmentQuestions.updateOrder
  ).withOptimisticUpdate((localStore, args) => {
    if (!assessment || !assessmentQuestions) return;
    const { idsInOrder } = args;
    const updatedAssessmentQuestions = assessmentQuestions
      .map((question) => ({
        ...question,
        order: idsInOrder.indexOf(question._id) + 1,
      }))
      .sort((a, b) => a.order - b.order);
    const currentValue = localStore.getQuery(
      api.assessmentQuestions.findByAssessmentId,
      {
        assessmentId: assessment._id,
      }
    );
    if (currentValue !== undefined) {
      localStore.setQuery(
        api.assessments.findById,
        {
          id: assessment._id,
        },
        {
          ...assessment,
          questions: updatedAssessmentQuestions,
        }
      );
    }
  });

  function handleOnUpdate(updatedItems: string[]) {
    updateAssessmentQuestionsOrder({
      idsInOrder: updatedItems as Id<"assessmentQuestions">[],
    });
  }

  // TODO: Add a visual loading state
  if (!assessment) return null;

  return (
    <>
      <FlexRow className="justify-between pb-4">
        <Text className="font-bold">Assessment Questions</Text>
      </FlexRow>
      <div className="hidden lg:block">
        <SortableList items={sortableListItems} onUpdate={handleOnUpdate}>
          <FlexColumn className="gap-2">
            {assessmentQuestions.map((question) => (
              <SortableListItem key={question._id} id={question._id}>
                <FlexColumn className="flex-1 truncate">
                  <Button
                    key={question._id}
                    variant="ghost"
                    onClick={() => setSelectedQuestionId(question?._id)}
                    className={cn(
                      "flex-1 truncate transition-all",
                      selectedQuestionId === question?._id && "font-bold pl-5"
                    )}
                  >
                    <div className="w-full text-left truncate">
                      {question.question}
                    </div>
                  </Button>
                </FlexColumn>
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
          </FlexColumn>
        </SortableList>
      </div>
      <div className="block lg:hidden pb-6">
        <AssessmentQuestionsNavSelect
          assessmentQuestions={assessmentQuestions}
          selectedQuestionId={selectedQuestionId}
          setSelectedQuestionId={setSelectedQuestionId}
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
  selectedQuestionId: Id<"assessmentQuestions"> | null;
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