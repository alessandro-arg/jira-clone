import { getCurrent } from "@/app/features/auth/actions";
import { getWorkspace } from "@/app/features/workspaces/actions";
import { EditWorkspaceForm } from "@/app/features/workspaces/components/edit-workspace-form";
import { redirect } from "next/navigation";

interface WorkspaceIdSettingsPageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

const WorkspaceIdSettingsPage = async ({
  params,
}: WorkspaceIdSettingsPageProps) => {
  const { workspaceId } = await params;
  const user = await getCurrent();
  const initialValues = await getWorkspace({ workspaceId });
  if (!initialValues) redirect(`/workspaces/${workspaceId}`);
  if (!user) redirect("/sign-in");

  return (
    <div className="w-full lg:max-w-xl">
      <EditWorkspaceForm initialValues={initialValues} />
    </div>
  );
};

export default WorkspaceIdSettingsPage;
