"use client";

import { useGetProjects } from "@/app/features/projects/api/use-get-projects";
import { ProjectAvatar } from "@/app/features/projects/components/project-avatar";
import { useCreateProjectModal } from "@/app/features/projects/hooks/use-create-project-modal";
import { useWorkspaceId } from "@/app/features/workspaces/hooks/use-workspace-id";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiAddCircleFill } from "react-icons/ri";

export const Projects = () => {
  const pathname = usePathname();
  const { open } = useCreateProjectModal();
  const workspaceId = useWorkspaceId();
  const { data } = useGetProjects({
    workspaceId,
  });

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium uppercase text-muted-foreground">
          Projects
        </p>
        <RiAddCircleFill
          onClick={open}
          className="size-5 text-muted-foreground cursor-pointer hover:opacity-75 transition"
        />
      </div>
      {data?.rows.map((project) => {
        const href = `/workspaces/${workspaceId}/projects/${project.$id}`;
        const isActive = pathname === href;

        return (
          <Link href={href} key={project.$id}>
            <div
              className={cn(
                "flex items-center gap-2.5 p-2.5 rounded-md hover:opacity-75 transition cursor-pointer",
                isActive && "bg-muted shadow-sm hover:opacity-100 text-primary"
              )}
            >
              <ProjectAvatar image={project.imageUrl} name={project.name} />
              <span className="truncate">{project.name}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
