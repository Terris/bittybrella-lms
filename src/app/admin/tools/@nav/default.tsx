import { TextLink } from "@/lib/ui";

export default function AdminToolsNavPage() {
  return (
    <nav className="flex flex-col gap-4">
      <TextLink href="/admin/tools">Admin Tools</TextLink>
      <TextLink href="/admin/tools/one">Tool one</TextLink>
      <TextLink href="/admin/tools/two">Tool two</TextLink>
      <TextLink href="/admin/tools/three">Tool three</TextLink>
    </nav>
  );
}
