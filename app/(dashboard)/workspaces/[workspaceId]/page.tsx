import { getCurrent } from "@/app/features/auth/actions";
import { redirect } from "next/navigation";

const WorkspacePage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  return <div>Workspace id</div>;
};

export default WorkspacePage;
