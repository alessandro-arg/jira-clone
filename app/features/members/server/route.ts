import { createAdminClient } from "@/lib/appwrite";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";
import { getMember } from "../utils";
import { DATABASE_ID, MEMBERS_ID } from "@/config";
import { Query } from "node-appwrite";
import { ta } from "date-fns/locale";
import { Member, MemberRole } from "../types";

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", z.object({ workspaceId: z.string() })),
    async (c) => {
      const { users } = await createAdminClient();
      const tables = c.get("tables");
      const user = c.get("user");

      const { workspaceId } = c.req.valid("query");

      const member = await getMember({
        tables,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json(
          { error: "You are not a member of this workspace." },
          403
        );
      }

      const members = await tables.listRows<Member>({
        databaseId: DATABASE_ID,
        tableId: MEMBERS_ID,
        queries: [Query.equal("workspaceId", workspaceId)],
      });

      const populatedMembers = await Promise.all(
        members.rows.map(async (member) => {
          const user = await users.get(member.userId);
          return {
            ...member,
            name: user.name,
            email: user.email,
          };
        })
      );

      return c.json({ data: { ...members, rows: populatedMembers } });
    }
  )
  .delete("/:memberId", sessionMiddleware, async (c) => {
    const { memberId } = c.req.param();
    const tables = c.get("tables");
    const user = c.get("user");

    const memberToDelete = await tables.getRow({
      databaseId: DATABASE_ID,
      tableId: MEMBERS_ID,
      rowId: memberId,
    });

    const allMembersInWorkspace = await tables.listRows({
      databaseId: DATABASE_ID,
      tableId: MEMBERS_ID,
      queries: [Query.equal("workspaceId", memberToDelete.workspaceId)],
    });

    const member = await getMember({
      tables,
      workspaceId: memberToDelete.workspaceId,
      userId: user.$id,
    });

    if (!member)
      return c.json({ error: "You are not a member of this workspace." }, 403);

    if (member.$id !== memberToDelete.$id && member.role !== MemberRole.ADMIN) {
      return c.json(
        { error: "You don't have permission to remove this member." },
        403
      );
    }

    if (allMembersInWorkspace.total === 1) {
      return c.json(
        { error: "You cannot remove the last member of the workspace." },
        400
      );
    }

    await tables.deleteRow({
      databaseId: DATABASE_ID,
      tableId: MEMBERS_ID,
      rowId: memberId,
    });

    return c.json({ data: { $id: memberToDelete.$id } });
  })
  .patch(
    "/:memberId",
    sessionMiddleware,
    zValidator("json", z.object({ role: z.enum(MemberRole) })),
    async (c) => {
      const { memberId } = c.req.param();
      const { role } = c.req.valid("json");
      const tables = c.get("tables");
      const user = c.get("user");

      const memberToUpdate = await tables.getRow({
        databaseId: DATABASE_ID,
        tableId: MEMBERS_ID,
        rowId: memberId,
      });

      const allMembersInWorkspace = await tables.listRows({
        databaseId: DATABASE_ID,
        tableId: MEMBERS_ID,
        queries: [Query.equal("workspaceId", memberToUpdate.workspaceId)],
      });

      const member = await getMember({
        tables,
        workspaceId: memberToUpdate.workspaceId,
        userId: user.$id,
      });

      if (!member)
        return c.json(
          { error: "You are not a member of this workspace." },
          403
        );

      if (member.role !== MemberRole.ADMIN) {
        return c.json(
          { error: "You don't have permission to remove this member." },
          403
        );
      }

      if (allMembersInWorkspace.total === 1) {
        return c.json({ error: "You cannot downgrade the last member" }, 400);
      }

      await tables.updateRow({
        databaseId: DATABASE_ID,
        tableId: MEMBERS_ID,
        rowId: memberId,
        data: { role },
      });

      return c.json({ data: { $id: memberToUpdate.$id } });
    }
  );

export default app;
