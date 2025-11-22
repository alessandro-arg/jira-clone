import { getCurrent } from "@/app/features/auth/queries";
import { redirect } from "next/navigation";
import { WorkspaceIdClient } from "./client";

const WorkspacePage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  return <WorkspaceIdClient />;
};

export default WorkspacePage;
