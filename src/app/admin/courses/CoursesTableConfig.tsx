import { ColumnDef } from "@tanstack/react-table";
import { Check, X } from "lucide-react";
import { Text } from "@/lib/ui";
import { EditCourseForm } from "./EditCourseForm";
import { Id } from "../../../../convex/_generated/dataModel";
import { CopyToClipboardButton } from "@/lib/ui/CopyToClipboardButton";

export type CourseRow = {
  _id: string;
  title: string;
  description: string;
  isPublished: boolean;
};

export const columns: ColumnDef<CourseRow>[] = [
  {
    accessorKey: "title",
    header: "Title",
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
        <div className="">
          {isPublished ? (
            <Check className="h-4 w-4" color="green" />
          ) : (
            <X className="h-4 w-4" color="red" />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "_id",
    header: "ID",
    cell: ({ row }) => (
      <div className="max-w-[100px] flex items-center justify-between">
        <Text className="truncate pr-2">{row.original._id}</Text>
        <CopyToClipboardButton
          textToCopy={row.original._id}
          variant="ghost"
          size="sm"
        />
      </div>
    ),
  },
  {
    id: "edit",
    header: "Edit",
    cell: ({ row }) => (
      <EditCourseForm courseId={row.original._id as Id<"courses">} />
    ),
  },
];
