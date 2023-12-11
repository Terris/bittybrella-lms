"use client";

import { PageContent, PageHeader } from "@/lib/layout";
import { Text } from "@/lib/ui";

export default function Home() {
  return (
    <>
      <PageHeader />
      <PageContent>
        <div className="px-8">
          <Text as="h1" className="text-3xl font-semibold">
            Home
          </Text>
        </div>
      </PageContent>
    </>
  );
}
