import { ColumnDef } from "@tanstack/react-table";
import { useQuery } from "convex/react";
import { QuickEditModuleForm } from "./QuickEditModuleForm";
import { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";
import {
  Text,
  CopyToClipboardButton,
  TextLink,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/lib/ui";
import { AdminTable } from "../Admin/AdminTable";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { DeleteModuleButton } from "./DeleteModuleButton";

interface ModuleRow {
  _id: string;
  title: string;
  description: string;
}

const columns: ColumnDef<ModuleRow>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      return (
        <TextLink href={`/admin/modules/${row.original._id}`}>
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
            {isPublished ? (
              <Check className="h-4 w-4 text-primary" />
            ) : (
              <X className="h-4 w-4 text-destructive" />
            )}
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
      <QuickEditModuleForm moduleId={row.original._id as Id<"modules">} />
    ),
  },
  {
    id: "delete",
    header: "Delete",
    cell: ({ row }) => (
      <DeleteModuleButton id={row.original._id as Id<"modules">} />
    ),
  },
];

export const ModulesTable = () => {
  const modulesData = useQuery(api.modules.all);
  if (!modulesData) return null;
  return <AdminTable columns={columns} data={modulesData} />;
};
