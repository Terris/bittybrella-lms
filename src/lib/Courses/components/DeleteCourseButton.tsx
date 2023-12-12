import { useMutation } from "convex/react";
import { Trash2 } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import {
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/lib/ui";
import { CourseId } from "../types";
import { useDeleteCourse } from "../hooks";

export function DeleteCourseButton({ id }: { id: CourseId }) {
  const { deleteCourse } = useDeleteCourse();

  return (
    <AlertDialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            <Button variant="ghost">
              <Trash2 className="h-4 w-4" /> adf
            </Button>
          </AlertDialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Delete course</TooltipContent>
      </Tooltip>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will permanently delete this course.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="destructive" onClick={() => deleteCourse({ id })}>
              Yes, I&lsquo;m sure.
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
