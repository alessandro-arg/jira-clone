import { getCurrent } from "@/app/features/auth/queries";
import { EditProjectForm } from "@/app/features/projects/components/edit-project-form";
import { getProject } from "@/app/features/projects/queries";
import { redirect } from "next/navigation";

interface ProjectIdSettingsPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

const ProjectIdSettingsPage = async ({
  params,
}: ProjectIdSettingsPageProps) => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  const initialValues = await getProject({
    projectId: (await params).projectId,
  });

  return (
    <div className="w-full lg:max-w-xl">
      <EditProjectForm initialValues={initialValues} />
    </div>
  );
};

export default ProjectIdSettingsPage;
