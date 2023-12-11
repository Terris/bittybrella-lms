"use client";

import { PageContent } from "@/lib/layout";
import { Breadcrumbs, Text } from "@/lib/ui";

export default function Home() {
  return (
    <>
      <div className="w-full flex flex-row items-center justify-between py-2 px-8 border-b">
        <Breadcrumbs />
      </div>
      <PageContent>
        <div className="py-4 px-8 border-b flex flex-row items-center justify-between">
          <Text className="text-3xl font-semibold">Home</Text>
        </div>
      </PageContent>
    </>
  );
}
