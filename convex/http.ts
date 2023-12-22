import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/tiptap_webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const headers = request.headers;
    if (!headers.get("x-hocuspocus-signature-256"))
      throw new Error("Unauthorized");
    const body = await request.json();
    const res = await ctx.runMutation(api.internal.updateLessonSection, {
      id: body.name,
      content: JSON.stringify(body.tiptapJson),
    });
    if (!res) throw new Error("Failed to update lesson section");
    return new Response("true");
  }),
});

export default http;
