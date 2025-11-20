import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createTaskSchema } from "../schemas";
import { getMember } from "../../members/utils";
import { DATABASE_ID, MEMBERS_ID, PROJECTS_ID, TASKS_ID } from "@/config";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
import { Task, TaskStatus } from "../types";
import { createAdminClient } from "@/lib/appwrite";
import { Project } from "../../projects/types";
import { useWorkspaceId } from "../../workspaces/hooks/use-workspace-id";

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator(
      "query",
      z.object({
        workspaceId: z.string(),
        projectId: z.string().nullish(),
        assigneeId: z.string().nullish(),
        status: z.enum(TaskStatus).nullish(),
        search: z.string().nullish(),
        dueDate: z.string().nullish(),
      })
    ),
    async (c) => {
      const { users } = await createAdminClient();
      const tables = c.get("tables");
      const user = c.get("user");

      const { workspaceId, projectId, status, search, assigneeId, dueDate } =
        c.req.valid("query");

      const member = await getMember({
        tables,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 403);
      }

      const query = [
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("$createdAt"),
      ];

      if (projectId) {
        console.log("projectId: ", projectId);
        query.push(Query.equal("projectId", projectId));
      }

      if (status) {
        console.log("status: ", status);
        query.push(Query.equal("status", status));
      }

      if (assigneeId) {
        console.log("assigneeId: ", assigneeId);
        query.push(Query.equal("assigneeId", assigneeId));
      }

      if (dueDate) {
        console.log("dueDate: ", dueDate);
        query.push(Query.equal("dueDate", dueDate));
      }

      if (search) {
        console.log("search: ", search);
        query.push(Query.search("name", search));
      }

      const tasks = await tables.listRows<Task>({
        databaseId: DATABASE_ID,
        tableId: TASKS_ID,
        queries: query,
      });

      const projectIds = tasks.rows.map((task) => task.projectId);
      const assigneeIds = tasks.rows.map((task) => task.assigneeId);

      const projects = await tables.listRows<Project>({
        databaseId: DATABASE_ID,
        tableId: PROJECTS_ID,
        queries:
          projectIds.length > 0 ? [Query.contains("$id", projectIds)] : [],
      });

      const members = await tables.listRows({
        databaseId: DATABASE_ID,
        tableId: MEMBERS_ID,
        queries:
          assigneeIds.length > 0 ? [Query.contains("$id", assigneeIds)] : [],
      });

      const assignees = await Promise.all(
        members.rows.map(async (member) => {
          const user = await users.get(member.userId);
          return {
            ...member,
            name: user.name,
            email: user.email,
          };
        })
      );

      const populatedTasks = tasks.rows.map((task) => {
        const project = projects.rows.find(
          (project) => project.$id === task.projectId
        );
        const assignee = assignees.find(
          (assignee) => assignee.$id === task.assigneeId
        );

        return {
          ...task,
          project,
          assignee,
        };
      });

      return c.json({
        data: {
          ...tasks,
          rows: populatedTasks,
        },
      });
    }
  )
  .post(
    "/",
    sessionMiddleware,
    zValidator("json", createTaskSchema),
    async (c) => {
      const user = c.get("user");
      const tables = c.get("tables");
      const { name, status, workspaceId, projectId, dueDate, assigneeId } =
        c.req.valid("json");

      const member = await getMember({
        tables,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 403);
      }

      const highestPositionTask = await tables.listRows({
        databaseId: DATABASE_ID,
        tableId: TASKS_ID,
        queries: [
          Query.equal("status", status),
          Query.equal("workspaceId", workspaceId),
          Query.orderAsc("position"),
          Query.limit(1),
        ],
      });

      const newPosition =
        highestPositionTask.rows.length > 0
          ? highestPositionTask.rows[0].position + 1000
          : 1000;

      const task = await tables.createRow({
        databaseId: DATABASE_ID,
        tableId: TASKS_ID,
        rowId: ID.unique(),
        data: {
          name,
          status,
          workspaceId,
          projectId,
          dueDate,
          assigneeId,
          position: newPosition,
        },
      });

      return c.json({ data: task });
    }
  )
  .delete("/:taskId", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const tables = c.get("tables");
    const { taskId } = c.req.param();

    const task = await tables.getRow<Task>({
      databaseId: DATABASE_ID,
      tableId: TASKS_ID,
      rowId: taskId,
    });

    const member = await getMember({
      tables,
      workspaceId: task.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 403);
    }

    await tables.deleteRow({
      databaseId: DATABASE_ID,
      tableId: TASKS_ID,
      rowId: taskId,
    });

    return c.json({ data: { $id: task.$id } });
  })
  .patch(
    "/:taskId",
    sessionMiddleware,
    zValidator("json", createTaskSchema.partial()),
    async (c) => {
      const user = c.get("user");
      const tables = c.get("tables");
      const { name, status, description, projectId, dueDate, assigneeId } =
        c.req.valid("json");
      const { taskId } = c.req.param();

      const existingTask = await tables.getRow<Task>({
        databaseId: DATABASE_ID,
        tableId: TASKS_ID,
        rowId: taskId,
      });

      const member = await getMember({
        tables,
        workspaceId: existingTask.workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 403);
      }

      const task = await tables.updateRow<Task>({
        databaseId: DATABASE_ID,
        tableId: TASKS_ID,
        rowId: taskId,
        data: {
          name,
          status,
          projectId,
          assigneeId,
          ...(dueDate && { dueDate: dueDate.toISOString() }),
          description,
        },
      });

      return c.json({ data: task });
    }
  )
  .get("/:taskId", sessionMiddleware, async (c) => {
    const currentUser = c.get("user");
    const tables = c.get("tables");
    const { users } = await createAdminClient();
    const { taskId } = c.req.param();

    const task = await tables.getRow<Task>({
      databaseId: DATABASE_ID,
      tableId: TASKS_ID,
      rowId: taskId,
    });

    const currentMember = await getMember({
      tables,
      workspaceId: task.workspaceId,
      userId: currentUser.$id,
    });

    if (!currentMember) {
      return c.json({ error: "Unauthorized" }, 403);
    }

    const project = await tables.getRow({
      databaseId: DATABASE_ID,
      tableId: PROJECTS_ID,
      rowId: task.projectId,
    });

    const member = await tables.getRow({
      databaseId: DATABASE_ID,
      tableId: MEMBERS_ID,
      rowId: task.assigneeId,
    });

    const user = await users.get(member.userId);

    const assignee = {
      ...member,
      name: user.name,
      email: user.email,
    };

    return c.json({
      data: {
        ...task,
        project,
        assignee,
      },
    });
  })
  .post(
    "/bulk-update",
    sessionMiddleware,
    zValidator(
      "json",
      z.object({
        tasks: z.array(
          z.object({
            $id: z.string(),
            status: z.enum(TaskStatus),
            position: z.number().int().positive().min(1000).max(1_000_000),
          })
        ),
      })
    ),
    async (c) => {
      const tables = c.get("tables");
      const user = c.get("user");
      const { tasks } = await c.req.valid("json");

      const tasksToUpdate = await tables.listRows<Task>({
        databaseId: DATABASE_ID,
        tableId: TASKS_ID,
        queries: [
          Query.contains(
            "$id",
            tasks.map((task) => task.$id)
          ),
        ],
      });

      const workspaceIds = new Set(
        tasksToUpdate.rows.map((task) => task.workspaceId)
      );

      if (workspaceIds.size !== 1) {
        return c.json({ error: "All tasks must belong to the same workspace" });
      }

      const workspaceId = workspaceIds.values().next().value;

      const member = await getMember({
        tables,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 403);
      }

      const updatedTasks = await Promise.all(
        tasks.map(async (task) => {
          const { $id, status, position } = task;
          return tables.updateRow<Task>({
            databaseId: DATABASE_ID,
            tableId: TASKS_ID,
            rowId: $id,
            data: { status, position },
          });
        })
      );

      return c.json({ data: updatedTasks });
    }
  );

export default app;
