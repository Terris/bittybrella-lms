import { ColumnDef } from "@tanstack/react-table";
import { Check, X } from "lucide-react";
import { useQuery } from "convex/react";
import { EditCourseForm } from "./EditCourseForm";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import { Text, CopyToClipboardButton } from "@/lib/ui";
import { AdminTable } from "../AdminTable";

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
            <Check className="h-4 w-4 text-primary" />
          ) : (
            <X className="h-4 w-4 text-destructive" />
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

export const CoursesForm = () => {
  const coursesData = useQuery(api.courses.getAll);
  if (!coursesData) return null;
  return <AdminTable columns={columns} data={coursesData} />;
};
