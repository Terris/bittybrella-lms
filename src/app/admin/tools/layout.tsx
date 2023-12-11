"use client";

import { Text } from "@/lib/ui";

interface AdminToolsLayoutProps {
  children: React.ReactNode;
  nav: React.ReactNode;
  content: React.ReactNode;
}
export default function AdminToolsLayout({
  children,
  nav,
  content,
}: AdminToolsLayoutProps) {
  return (
    <div className="w-full">
      <div className="border-b px-8 py-4">
        <Text className="text-3xl">Admin Tools</Text>
        {children}
      </div>
      <div className="w-full flex flex-row items-start justify-start">
        <div className="px-8 py-4 w-1/5">
          <Text className="text-2xl">The Nav</Text>
          {nav}
        </div>
        <div className="px-8 py-4 1-4/5">
          <Text className="text-2xl">The Content</Text>
          {content}
        </div>
      </div>
    </div>
  );
}
