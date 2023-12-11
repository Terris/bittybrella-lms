import { Breadcrumbs, PageContent } from "@/lib/layout";
import { Text } from "@/lib/ui";

export default function MyCoursesPage() {
  return (
    <>
      <div className="w-full flex flex-row items-center justify-between py-2 px-8 border-b">
        <Breadcrumbs
          breadcrumbs={[{ href: "/my-courses", label: "My Courses" }]}
        />
      </div>
      <PageContent>
        <div className="py-4 px-8 border-b flex flex-row items-center justify-between">
          <Text className="text-3xl font-bold">My Courses</Text>
        </div>
      </PageContent>
    </>
  );
}
