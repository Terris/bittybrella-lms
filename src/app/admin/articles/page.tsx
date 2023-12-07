"use client";

import { PageContent, PageHeader } from "@/lib/layout";
import { CreateArticleForm } from "../../../lib/forms/admin/Articles/QuickCreateArticleForm";
import { ArticlesTable } from "../../../lib/views/admin/Articles/ArticlesTable";
import { Text } from "@/lib/ui";

export default function AdminArticlesPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { href: "/admin", label: "Admin" },
          { href: "/admin/articles", label: "Articles" },
        ]}
        renderActions={<CreateArticleForm />}
      />
      <PageContent>
        <Text className="text-2xl font-semibold">Articles</Text>
        <hr />
        <ArticlesTable />
      </PageContent>
    </>
  );
}
