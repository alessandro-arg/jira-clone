"use client";

import { useGetTask } from "@/app/features/tasks/api/use-get-task";
import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { useTaskId } from "@/app/features/tasks/hooks/use-task-id";
import { TaskBreadcrumbs } from "@/app/features/tasks/components/task-breadcrumbs";
import { Task } from "@/app/features/tasks/types";
import { Project } from "@/app/features/projects/types";

export const TaskIdClient = () => {
  const taskId = useTaskId();
  const { data, isLoading } = useGetTask({ taskId });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!data) {
    return <PageError message="Task not found" />;
  }

  const task = data as Task & { project?: Project };

  if (!task.project) {
    return <PageError message="Project not found for this task" />;
  }

  return (
    <div className="flex flex-col ">
      <TaskBreadcrumbs project={task.project} task={task} />
    </div>
  );
};
