import { getCurrent } from "@/app/features/auth/queries";
import TaskViewSwitcher from "@/app/features/tasks/components/task-view-switcher";
import { redirect } from "next/navigation";

const TasksPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  return (
    <div className="h-full flex flex-col">
      <TaskViewSwitcher />
    </div>
  );
};

export default TasksPage;
