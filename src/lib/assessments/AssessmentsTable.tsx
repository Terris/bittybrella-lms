import { ColumnDef } from "@tanstack/react-table";
import { useQuery } from "convex/react";
import { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";
import { QuickEditAssessmentForm } from "./QuickEditAssessmentForm";
import { DeleteAssessmentButton } from "./DeleteAssessmentButton";
import {
  Text,
  CopyToClipboardButton,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TextLink,
} from "@/lib/ui";
import { AdminTable } from "../../app/admin/AdminTable";

interface AssessmentRow {
  _id: string;
  title: string;
  description: string;
}

const columns: ColumnDef<AssessmentRow>[] = [
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
  const assessments = useQuery(api.assessments.all);
  if (!assessments) return null;
  return <AdminTable columns={columns} data={assessments} />;
};
