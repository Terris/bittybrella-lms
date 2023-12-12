import { ColumnDef } from "@tanstack/react-table";
import { useQuery } from "convex/react";
import { Check, X } from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import {
  AdminTable,
  Text,
  CopyToClipboardButton,
  TextLink,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  AdminTableBooleanCell,
} from "@/lib/ui";
import { QuickEditLessonForm } from "../forms";
import { DeleteLessonButton } from "../components";

interface LessonRow {
  _id: string;
  title: string;
  description: string;
}

const columns: ColumnDef<LessonRow>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      return (
        <TextLink href={`/admin/lessons/${row.original._id}`} arrow>
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
    accessorKey: "isPublished",
    header: "Published?",
    cell: ({ row }) => {
      const isPublished: boolean = row.getValue("isPublished");
      return (
        <Tooltip>
          <TooltipTrigger>
            <AdminTableBooleanCell value={isPublished} />
          </TooltipTrigger>
          <TooltipContent>
            {isPublished ? "Published" : "Not published"}
          </TooltipContent>
        </Tooltip>
      );
    },
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
      <QuickEditLessonForm lessonId={row.original._id as Id<"lessons">} />
    ),
  },
  {
    id: "delete",
    header: "Delete",
    cell: ({ row }) => (
      <DeleteLessonButton id={row.original._id as Id<"lessons">} />
    ),
  },
];

export const LessonsTable = () => {
  const lessonsData = useQuery(api.lessons.all);
  if (!lessonsData) return null;
  return <AdminTable columns={columns} data={lessonsData} />;
};
