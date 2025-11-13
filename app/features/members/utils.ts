import { Query, type TablesDB } from "node-appwrite";
import { DATABASE_ID, MEMBERS_ID } from "@/config";

interface GetMemberParams {
  tables: TablesDB;
  userId: string;
  workspaceId: string;
}

export const getMember = async ({
  tables,
  workspaceId,
  userId,
}: GetMemberParams) => {
  const members = await tables.listRows({
    databaseId: DATABASE_ID,
    tableId: MEMBERS_ID,
    queries: [
      Query.equal("userId", userId),
      Query.equal("workspaceId", workspaceId),
    ],
  });

  return members.rows[0];
};
