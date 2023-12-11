export default function ToolPageContent({
  params,
}: {
  params: { id: string };
}) {
  return <p>Content for tool: {params.id}</p>;
}
