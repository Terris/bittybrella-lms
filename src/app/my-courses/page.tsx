import { PageContent, PageHeader } from "@/lib/layout";

export default function MyCoursesPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ href: "/my-courses", label: "My Courses" }]}
      />
      <PageContent>
        <h1>My Courses</h1>
      </PageContent>
    </>
  );
}
