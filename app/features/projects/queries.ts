import { createSessionClient } from "@/lib/appwrite";
import { getMember } from "../members/utils";
import { DATABASE_ID, PROJECTS_ID } from "@/config";
import { Project } from "./types";

interface GetProjectProps {
  projectId: string;
}

export const getProject = async ({ projectId }: GetProjectProps) => {
  const { tables, account } = await createSessionClient();
  const user = await account.get();

  const project = await tables.getRow<Project>({
    databaseId: DATABASE_ID,
    tableId: PROJECTS_ID,
    rowId: projectId,
  });

  const member = await getMember({
    tables,
    userId: user.$id,
    workspaceId: project.workspaceId,
  });

  if (!member) {
    throw new Error("Unauthorized");
  }

  return project;
};
