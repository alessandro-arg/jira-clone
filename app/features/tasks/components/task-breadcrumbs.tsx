import Link from "next/link";
import { ProjectAvatar } from "../../projects/components/project-avatar";
import { Project } from "../../projects/types";
import { Task } from "../types";
import { useWorkspaceId } from "../../workspaces/hooks/use-workspace-id";
import { ChevronRight, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TaskBreadcrumbsProps {
  project: Project;
  task: Task;
}

export const TaskBreadcrumbs = ({ project, task }: TaskBreadcrumbsProps) => {
  const workspaceId = useWorkspaceId();

  return (
    <div className="flex items-center gap-x-2 ">
      <ProjectAvatar
        name={project.name}
        image={project.imageUrl}
        className="size-6 lg:size-8"
      />
      <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
        <p className="text-sm lg:text-lg font-semibold text-muted-foreground hover:opacity-75 transition">
          {project.name}
        </p>
      </Link>
      <ChevronRight className="size-4 lg:size-5 text-muted-foreground" />
      <p className="text-sm lg:text-lg font-semibold">{task.name}</p>
      <Button className="ml-auto" variant="destructive" size="sm">
        <TrashIcon className="size-4 lg:mr-2" />
        <span className="hidden lg:block">Delete task</span>
      </Button>
    </div>
  );
};
