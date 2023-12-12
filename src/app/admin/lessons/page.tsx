"use client";

import { PageContent } from "@/lib/layout";
import { QuickCreateLessonForm, LessonsTable } from "@/lib/Lessons";
import { Breadcrumbs, Text } from "@/lib/ui";

export default function AdminLessonsPage() {
  return (
    <>
      <div className="w-full flex flex-row items-center justify-between py-2 px-8 border-b">
        <Breadcrumbs
          breadcrumbs={[
            { href: "/admin", label: "Admin" },
            { href: "/admin/lessons", label: "Lessons" },
          ]}
        />
      </div>
      <PageContent>
        <div className="py-4 px-8 border-b flex flex-row items-center justify-between">
          <Text className="text-3xl font-bold">Lessons</Text>
          <QuickCreateLessonForm />
        </div>
        <div className="px-4 w-full max-w-screen-2xl mx-auto">
          <LessonsTable />
        </div>
      </PageContent>
    </>
  );
}
