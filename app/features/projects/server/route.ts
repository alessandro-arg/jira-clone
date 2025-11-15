import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z, { json } from "zod";
import { getMember } from "../../members/utils";
import {
  DATABASE_ID,
  IMAGES_BUCKET_ID,
  PROJECTS_ID,
  WORKSPACES_ID,
} from "@/config";
import { ID, Permission, Query, Role } from "node-appwrite";
import { createProjectSchema } from "../schemas";

const app = new Hono()
  .get(
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
  )
  .post(
    "/",
    sessionMiddleware,
    zValidator("form", createProjectSchema),
    async (c) => {
      const tables = c.get("tables");
      const storage = c.get("storage");
      const user = c.get("user");

      const { name, image, workspaceId } = c.req.valid("form");

      const member = await getMember({
        tables,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 403);
      }

      let uploadedImageUrl: string | undefined;

      if (image instanceof File) {
        const file = await storage.createFile({
          bucketId: IMAGES_BUCKET_ID,
          fileId: ID.unique(),
          file: image,
          permissions: [Permission.read(Role.any())],
        });

        uploadedImageUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${IMAGES_BUCKET_ID}/files/${file.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`;
      } else if (typeof image === "string") {
        uploadedImageUrl = image;
      }

      const project = await tables.createRow({
        databaseId: DATABASE_ID,
        tableId: PROJECTS_ID,
        rowId: ID.unique(),
        data: {
          name,
          imageUrl: uploadedImageUrl,
          workspaceId,
        },
      });

      return c.json({ data: project });
    }
  );

export default app;
