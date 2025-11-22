import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createWorkspaceSchema, updateWorkspaceSchema } from "../schemas";
import { sessionMiddleware } from "@/lib/session-middleware";
import {
  DATABASE_ID,
  IMAGES_BUCKET_ID,
  MEMBERS_ID,
  WORKSPACES_ID,
} from "@/config";
import { ID, Permission, Query, Role } from "node-appwrite";
import { MemberRole } from "../../members/types";
import { generateInviteCode } from "@/lib/utils";
import { getMember } from "../../members/utils";
import z from "zod";
import { Workspace } from "../types";

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const tables = c.get("tables");

    const members = await tables.listRows({
      databaseId: DATABASE_ID,
      tableId: MEMBERS_ID,
      queries: [Query.equal("userId", user.$id)],
    });

    if (members.total === 0) {
      return c.json({ data: { rows: [], total: 0 } });
    }

    const workspaceIds = members.rows.map((m) => m.workspaceId);

    const workspaces = await tables.listRows({
      databaseId: DATABASE_ID,
      tableId: WORKSPACES_ID,
      queries: [
        Query.contains("$id", workspaceIds),
        Query.orderDesc("$createdAt"),
      ],
    });

    return c.json({ data: workspaces });
  })
  .get("/:workspaceId", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const tables = c.get("tables");
    const { workspaceId } = c.req.param();

    const member = getMember({
      tables,
      workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 403);
    }

    const workspace = await tables.getRow<Workspace>({
      databaseId: DATABASE_ID,
      tableId: WORKSPACES_ID,
      rowId: workspaceId,
    });

    return c.json({ data: workspace });
  })
  .post(
    "/",
    zValidator("form", createWorkspaceSchema),
    sessionMiddleware,
    async (c) => {
      const tables = c.get("tables");
      const storage = c.get("storage");
      const user = c.get("user");

      const { name, image } = c.req.valid("form");

      let uploadedImageUrl: string | undefined;

      if (image instanceof File) {
        const file = await storage.createFile({
          bucketId: IMAGES_BUCKET_ID,
          fileId: ID.unique(),
          file: image,
          permissions: [Permission.read(Role.any())],
        });

        {
          /* Free version, no paid transforms here — just point to our proxy view route */
        }
        uploadedImageUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${IMAGES_BUCKET_ID}/files/${file.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`;

        {
          /* Unluckly, the getFilePreview function is now only available on the paid version, so no transformation. */
        }
        // const arrayBuffer = await storage.getFilePreview({
        //   bucketId: IMAGES_BUCKET_ID,
        //   fileId: file.$id,
        // });

        // uploadedImageUrl = `data:image/png;base64,${Buffer.from(
        //   arrayBuffer
        // ).toString("base64")}`;
      } else if (typeof image === "string") {
        uploadedImageUrl = image;
      }

      const workspace = await tables.createRow({
        databaseId: DATABASE_ID,
        tableId: WORKSPACES_ID,
        rowId: ID.unique(),
        data: {
          name,
          userId: user.$id,
          imageUrl: uploadedImageUrl,
          inviteCode: generateInviteCode(8),
        },
      });

      await tables.createRow({
        databaseId: DATABASE_ID,
        tableId: MEMBERS_ID,
        rowId: ID.unique(),
        data: {
          workspaceId: workspace.$id,
          userId: user.$id,
          role: MemberRole.ADMIN,
        },
      });

      return c.json({ data: workspace });
    }
  )
  .patch(
    "/:workspaceId",
    sessionMiddleware,
    zValidator("form", updateWorkspaceSchema),
    async (c) => {
      const tables = c.get("tables");
      const storage = c.get("storage");
      const user = c.get("user");

      const { workspaceId } = c.req.param();
      const { name, image } = c.req.valid("form");

      const member = await getMember({
        tables,
        userId: user.$id,
        workspaceId,
      });

      if (!member || member.role !== MemberRole.ADMIN) {
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
      }

      const workspace = await tables.updateRow({
        databaseId: DATABASE_ID,
        tableId: WORKSPACES_ID,
        rowId: workspaceId,
        data: {
          name,
          imageUrl: uploadedImageUrl,
        },
      });

      return c.json({ data: workspace });
    }
  )
  .delete("/:workspaceId", sessionMiddleware, async (c) => {
    const tables = c.get("tables");
    const user = c.get("user");

    const { workspaceId } = c.req.param();

    const member = await getMember({
      tables,
      userId: user.$id,
      workspaceId,
    });

    if (!member || member.role !== MemberRole.ADMIN) {
      return c.json({ error: "Unauthorized" }, 403);
    }

    await tables.deleteRow({
      databaseId: DATABASE_ID,
      tableId: WORKSPACES_ID,
      rowId: workspaceId,
    });

    return c.json({ data: { $id: workspaceId } });
  })
  .post("/:workspaceId/reset-invite-code", sessionMiddleware, async (c) => {
    const tables = c.get("tables");
    const user = c.get("user");

    const { workspaceId } = c.req.param();

    const member = await getMember({
      tables,
      userId: user.$id,
      workspaceId,
    });

    if (!member || member.role !== MemberRole.ADMIN) {
      return c.json({ error: "Unauthorized" }, 403);
    }

    const workspace = await tables.updateRow({
      databaseId: DATABASE_ID,
      tableId: WORKSPACES_ID,
      rowId: workspaceId,
      data: {
        inviteCode: generateInviteCode(8),
      },
    });

    return c.json({ data: workspace });
  })
  .post(
    "/:workspaceId/join",
    sessionMiddleware,
    zValidator("json", z.object({ inviteCode: z.string() })),
    async (c) => {
      const tables = c.get("tables");
      const user = c.get("user");

      const { workspaceId } = c.req.param();
      const { inviteCode } = c.req.valid("json");

      const member = await getMember({
        tables,
        userId: user.$id,
        workspaceId,
      });

      if (member) {
        return c.json({ error: "Already a member" }, 400);
      }

      const workspace = await tables.getRow<Workspace>({
        databaseId: DATABASE_ID,
        tableId: WORKSPACES_ID,
        rowId: workspaceId,
      });

      if (workspace.inviteCode !== inviteCode) {
        return c.json({ error: "Invalid invite code" }, 400);
      }

      await tables.createRow({
        databaseId: DATABASE_ID,
        tableId: MEMBERS_ID,
        rowId: ID.unique(),
        data: {
          workspaceId,
          userId: user.$id,
          role: MemberRole.MEMBER,
        },
      });

      return c.json({ data: workspace });
    }
  );

export default app;
