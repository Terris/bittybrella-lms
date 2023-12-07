"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { PageContent, PageHeader } from "@/lib/layout";
import { Text } from "@/lib/ui";
import { EditArticleForm } from "../../../../lib/forms/admin/Articles/EditArticleForm";

interface AdminArticlePageProps {
  params: { id: string };
}

export default function AdminArticlePage({ params }: AdminArticlePageProps) {
  const articleData = useQuery(api.articles.findById, {
    id: params.id as Id<"articles">,
  });

  // TODO: handle loading state
  if (!articleData) return null;

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { href: "/admin", label: "Admin" },
          { href: "/admin/articles", label: "Articles" },
          {
            href: `/admin/articles/${params.id}`,
            label: articleData.title,
          },
        ]}
      />
      <PageContent>
        <div className="space-y-0.5">
          <Text className="text-2xl font-semibold">{articleData.title}</Text>
        </div>
        <hr />
        <div className="">
          <EditArticleForm id={params.id as Id<"articles">} />
        </div>
      </PageContent>
    </>
  );
}
