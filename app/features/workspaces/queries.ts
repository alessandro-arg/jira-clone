import { Query } from "node-appwrite";
import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";
import { getMember } from "../members/utils";
import { Workspace } from "./types";
import { createSessionClient } from "@/lib/appwrite";

export const getWorkspaces = async () => {
  const { tables, account } = await createSessionClient();
  const user = await account.get();

  const members = await tables.listRows({
    databaseId: DATABASE_ID,
    tableId: MEMBERS_ID,
    queries: [Query.equal("userId", user.$id)],
  });

  if (members.total === 0) {
    return { rows: [], total: 0 };
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

  return workspaces;
};

interface GetWorkspaceProps {
  workspaceId: string;
}

export const getWorkspace = async ({ workspaceId }: GetWorkspaceProps) => {
  const { tables, account } = await createSessionClient();
  const user = await account.get();

  const member = await getMember({
    tables,
    userId: user.$id,
    workspaceId,
  });

  if (!member) {
    throw new Error("Unauthorized");
  }

  const workspace = await tables.getRow<Workspace>({
    databaseId: DATABASE_ID,
    tableId: WORKSPACES_ID,
    rowId: workspaceId,
  });

  return workspace;
};

interface GetWorkspaceInfoProps {
  workspaceId: string;
}

export const getWorkspaceInfo = async ({
  workspaceId,
}: GetWorkspaceInfoProps) => {
  const { tables } = await createSessionClient();

  const workspace = await tables.getRow<Workspace>({
    databaseId: DATABASE_ID,
    tableId: WORKSPACES_ID,
    rowId: workspaceId,
  });

  return {
    name: workspace.name,
  };
};
