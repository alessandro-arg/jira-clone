import { Query } from "node-appwrite";
import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";
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
