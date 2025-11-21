"use client";

import { useGetTask } from "@/app/features/tasks/api/use-get-task";
import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { useTaskId } from "@/app/features/tasks/hooks/use-task-id";
import { TaskBreadcrumbs } from "@/app/features/tasks/components/task-breadcrumbs";

export const TaskIdClient = () => {
  const taskId = useTaskId();
  const { data, isLoading } = useGetTask({ taskId });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!data) {
    return <PageError message="Task not found" />;
  }

  return (
    <div className="flex flex-col ">
      <TaskBreadcrumbs project={data.project} task={data} />
    </div>
  );
};
