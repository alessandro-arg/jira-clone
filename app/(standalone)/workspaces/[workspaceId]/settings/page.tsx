import { getCurrent } from "@/app/features/auth/actions";
import { redirect } from "next/navigation";

interface WorkspaceIdSettingsPageProps {
  params: {
    workspaceId: string;
  };
}

const WorkspaceIdSettingsPage = async ({
  params,
}: WorkspaceIdSettingsPageProps) => {
  const user = await getCurrent();
  const param = await params;

  if (!user) redirect("/sign-in");

  return <div>Workspace Settings Page: {param.workspaceId}</div>;
};

export default WorkspaceIdSettingsPage;
