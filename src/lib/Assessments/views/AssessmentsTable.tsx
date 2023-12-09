import { ColumnDef } from "@tanstack/react-table";
import { Id } from "../../../../convex/_generated/dataModel";
import { QuickEditAssessmentForm } from "../forms/QuickEditAssessmentForm";
import { DeleteAssessmentButton } from "../ui/DeleteAssessmentButton";
import {
  Text,
  CopyToClipboardButton,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TextLink,
} from "@/lib/ui";
import { AdminTable } from "../../Admin/AdminTable";
import { useAllAssessments } from "../hooks";

interface AssessmentTableRow {
  _id: string;
  title: string;
  description: string;
}

const columns: ColumnDef<AssessmentTableRow>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      return (
        <TextLink href={`/admin/assessments/${row.original._id}`}>
          {row.original.title}
        </TextLink>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "_id",
    header: "ID",
    cell: ({ row }) => (
      <div className="max-w-[100px] flex items-center justify-between">
        <Text className="truncate pr-2">{row.original._id}</Text>
        <Tooltip>
          <TooltipTrigger>
            <CopyToClipboardButton
              textToCopy={row.original._id}
              variant="ghost"
              size="sm"
            />
          </TooltipTrigger>
          <TooltipContent>Copy ID to clipboard</TooltipContent>
        </Tooltip>
      </div>
    ),
  },
  {
    id: "edit",
    header: "Quick Edit",
    cell: ({ row }) => (
      <QuickEditAssessmentForm
        assessmentId={row.original._id as Id<"assessments">}
      />
    ),
  },
  {
    id: "delete",
    header: "Delete",
    cell: ({ row }) => (
      <DeleteAssessmentButton id={row.original._id as Id<"assessments">} />
    ),
  },
];

export const AssessmentsTable = () => {
  const { assessments } = useAllAssessments();
  if (!assessments) return null;
  return <AdminTable columns={columns} data={assessments} />;
};