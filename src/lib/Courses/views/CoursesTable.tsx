import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpRight, Check, X } from "lucide-react";
import { useQuery } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import {
  AdminTable,
  Text,
  CopyToClipboardButton,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TextLink,
  AdminTableBooleanCell,
} from "@/lib/ui";
import { QuickEditCourseForm } from "../forms";
import { DeleteCourseButton } from "../components/DeleteCourseButton";

interface CourseRow {
  _id: string;
  title: string;
  description: string;
  isPublished: boolean;
}

const columns: ColumnDef<CourseRow>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      return (
        <TextLink href={`/admin/courses/${row.original._id}`} arrow>
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
      <QuickEditCourseForm courseId={row.original._id as Id<"courses">} />
    ),
  },
  {
    id: "delete",
    header: "Delete",
    cell: ({ row }) => (
      <DeleteCourseButton id={row.original._id as Id<"courses">} />
    ),
  },
];

export const CoursesTable = () => {
  const coursesData = useQuery(api.courses.all);
  if (!coursesData) return null;
  return <AdminTable columns={columns} data={coursesData} />;
};
