import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createWorkspaceSchema } from "../schemas";
import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, IMAGES_BUCKET_ID, WORKSPACES_ID } from "@/config";
import { ID } from "node-appwrite";

const app = new Hono().post(
  "/",
  zValidator("json", createWorkspaceSchema),
  sessionMiddleware,
  async (c) => {
    const tables = c.get("tables");
    const storage = c.get("storage");
    const user = c.get("user");

    const { name, image } = c.req.valid("json");

    let uploadedImageUrl: string | undefined;

    if (image instanceof File) {
      const file = await storage.createFile({
        bucketId: IMAGES_BUCKET_ID,
        fileId: ID.unique(),
        file: image,
      });

      const arrayBuffer = await storage.getFilePreview({
        bucketId: IMAGES_BUCKET_ID,
        fileId: file.$id,
      });

      uploadedImageUrl = `data:image/png;base64,${Buffer.from(
        arrayBuffer
      ).toString("base64")}`;
    }

    const workspace = await tables.createRow({
      databaseId: DATABASE_ID,
      tableId: WORKSPACES_ID,
      rowId: ID.unique(),
      data: { name, userId: user.$id, imageUrl: uploadedImageUrl },
    });

    return c.json({ data: workspace });
  }
);

export default app;
