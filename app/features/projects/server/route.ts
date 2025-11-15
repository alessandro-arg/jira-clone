import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z, { json } from "zod";
import { getMember } from "../../members/utils";
import { DATABASE_ID, PROJECTS_ID } from "@/config";
import { Query } from "node-appwrite";

const app = new Hono().get(
  "/",
  sessionMiddleware,
  zValidator("query", z.object({ workspaceId: z.string() })),
  async (c) => {
    const user = c.get("user");
    const tables = c.get("tables");

    const { workspaceId } = c.req.valid("query");

    if (!workspaceId) {
      return c.json({ error: "Missing workspaceId" }, 400);
    }

    const member = await getMember({
      tables,
      workspaceId,
      userId: user.$id,
    });

    if (!member) return c.json({ error: "Unauthorized" }, 403);

    const projects = await tables.listRows({
      databaseId: DATABASE_ID,
      tableId: PROJECTS_ID,
      queries: [
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("$createdAt"),
      ],
    });

    return c.json({ data: projects });
  }
);

export default app;
