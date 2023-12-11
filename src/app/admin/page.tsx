import { PageContent } from "@/lib/layout";
import { Breadcrumbs, Text } from "@/lib/ui";

export default function AdminCoursesPage() {
  return (
    <>
      <div className="w-full flex flex-row items-center justify-between py-2 px-8 border-b">
        <Breadcrumbs breadcrumbs={[{ href: "/admin", label: "Admin" }]} />
      </div>
      <PageContent>
        <div className="px-8">
          <Text className="text-3xl font-semibold">Admin</Text>
        </div>
      </PageContent>
    </>
  );
}
