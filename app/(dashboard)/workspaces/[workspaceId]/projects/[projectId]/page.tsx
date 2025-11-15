import { getCurrent } from "@/app/features/auth/queries";
import { redirect } from "next/navigation";

interface ProjectIdPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

const ProjectIdPage = async ({ params }: ProjectIdPageProps) => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  const projectId = (await params).projectId;

  return <div>ProjectId: {projectId}</div>;
};

export default ProjectIdPage;
