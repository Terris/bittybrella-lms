import { ColumnDef } from "@tanstack/react-table";
import { useQuery } from "convex/react";
import { QuickEditArticleForm } from "../../../forms/admin/Articles/QuickEditArticleForm";
import { Id } from "../../../../../convex/_generated/dataModel";
import { api } from "../../../../../convex/_generated/api";
import { Text, CopyToClipboardButton } from "@/lib/ui";
import { AdminTable } from "../AdminTable";
import Link from "next/link";
import { DeleteArticleButton } from "../../../forms/admin/Articles/DeleteArticleButton";

interface ArticleRow {
  _id: string;
  title: string;
}

const columns: ColumnDef<ArticleRow>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      return (
        <Link href={`/admin/articles/${row.original._id}`}>
          {row.original.title}
        </Link>
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
    header: "Quick Edit",
    cell: ({ row }) => (
      <QuickEditArticleForm articleId={row.original._id as Id<"articles">} />
    ),
  },
  {
    id: "delete",
    header: "Delete",
    cell: ({ row }) => (
      <DeleteArticleButton articleId={row.original._id as Id<"articles">} />
    ),
  },
];

export const ArticlesTable = () => {
  const articlesData = useQuery(api.articles.all);
  if (!articlesData) return null;
  return <AdminTable columns={columns} data={articlesData} />;
};
