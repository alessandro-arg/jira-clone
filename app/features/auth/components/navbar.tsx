"use client";

import { usePathname } from "next/navigation";
import { MobileSidebar } from "./mobile-sidebar";
import { UserButton } from "./user-button";
import { ThemeToggle } from "@/components/theme-toggle";

const pathnameMap = {
  tasks: {
    title: "My tasks",
    description: "View all of your tasks here",
  },
  projects: {
    title: "My project",
    description: "View the tasks of your project here",
  },
};

const defaultMap = {
  title: "Home",
  description: "Monitor all of your projects and tasks",
};

export const Navbar = () => {
  const pathname = usePathname();
  const pathnameParts = pathname.split("/");
  const pathnameKey = pathnameParts[3] as keyof typeof pathnameMap;

  const { title, description } = pathnameMap[pathnameKey] || defaultMap;

  return (
    <nav className="pt-4 px-6 flex items-center justify-between">
      <div className="flex-col hidden lg:flex">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <MobileSidebar />
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <UserButton />
      </div>
    </nav>
  );
};
