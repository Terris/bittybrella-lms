import { ColumnDef } from "@tanstack/react-table";
import { useQuery } from "convex/react";
import { QuickEditModuleForm } from "./QuickEditModuleForm";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import { Text, CopyToClipboardButton } from "@/lib/ui";
import { AdminTable } from "../AdminTable";
import Link from "next/link";

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
        <Link href={`/admin/modules/${row.original._id}`}>
          {row.original.title}
        </Link>
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
    header: "Quick Edit",
    cell: ({ row }) => (
      <QuickEditModuleForm moduleId={row.original._id as Id<"modules">} />
    ),
  },
];

export const ModulesForm = () => {
  const modulesData = useQuery(api.modules.getAll);
  if (!modulesData) return null;
  return <AdminTable columns={columns} data={modulesData} />;
};
