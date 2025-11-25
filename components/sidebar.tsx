import Image from "next/image";
import Link from "next/link";
import DottedSeparator from "./dotted-separator";
import { Navigation } from "./navigation";
import { WorkspaceSwithcer } from "./workspace-switcher";
import { Projects } from "./projects";

export const Sidebar = () => {
  return (
    <aside className="h-full bg-card p-4 w-full">
      <Link href="/">
        <Image
          src="/logo.svg"
          alt="logo"
          width={164}
          height={48}
          loading="eager"
          className="w-41 h-12 dark:hidden"
        />
        <Image
          src="/logo-dark.svg"
          alt="logo"
          width={164}
          height={48}
          loading="eager"
          className="w-41 h-12 hidden dark:block"
        />
      </Link>
      <DottedSeparator className="my-4" />
      <WorkspaceSwithcer />
      <DottedSeparator className="my-4" />
      <Navigation />
      <DottedSeparator className="my-4" />
      <Projects />
    </aside>
  );
};
