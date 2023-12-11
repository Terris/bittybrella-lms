import { PageContent } from "@/lib/layout";
import { Breadcrumbs, Text } from "@/lib/ui";

export default function AdminCoursesPage() {
  return (
    <>
      <div className="w-full flex flex-row items-center justify-between py-2 px-8 border-b">
        <Breadcrumbs breadcrumbs={[{ href: "/admin", label: "Admin" }]} />
      </div>
      <PageContent>
        <div className="py-4 px-8 border-b flex flex-row items-center justify-between">
          <Text className="text-3xl font-bold">Admin</Text>
        </div>
      </PageContent>
    </>
  );
}
