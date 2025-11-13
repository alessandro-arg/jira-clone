import { cookies } from "next/headers";
import { Account, Client, Query, TablesDB } from "node-appwrite";
import { AUTH_COOKIE } from "../auth/constants";
import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";
import { getMember } from "../members/utils";
import { Workspace } from "./types";

export const getWorkspaces = async () => {
  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const session = (await cookies()).get(AUTH_COOKIE);

    if (!session) return { rows: [], total: 0 };

    client.setSession(session.value);
    const tables = new TablesDB(client);
    const account = new Account(client);
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
  } catch {
    return { rows: [], total: 0 };
  }
};

interface GetWorkspaceParams {
  workspaceId: string;
}

export const getWorkspace = async ({ workspaceId }: GetWorkspaceParams) => {
  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const session = (await cookies()).get(AUTH_COOKIE);

    if (!session) return null;

    client.setSession(session.value);
    const tables = new TablesDB(client);
    const account = new Account(client);
    const user = await account.get();

    const member = await getMember({
      tables,
      userId: user.$id,
      workspaceId,
    });

    if (!member) return null;

    const workspace = await tables.getRow<Workspace>({
      databaseId: DATABASE_ID,
      tableId: WORKSPACES_ID,
      rowId: workspaceId,
    });

    return workspace;
  } catch {
    return null;
  }
};
