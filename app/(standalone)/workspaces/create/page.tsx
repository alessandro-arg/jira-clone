import { getCurrent } from "@/app/features/auth/queries";
import { CreateWorkspaceForm } from "@/app/features/workspaces/components/create-workspace-form";
import { redirect } from "next/navigation";

const WorkspacesCreatePage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");
  return (
    <div className="w-full lg:max-w-xl">
      <CreateWorkspaceForm />
    </div>
  );
};

export default WorkspacesCreatePage;
