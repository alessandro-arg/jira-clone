import Image from "next/image";
import Link from "next/link";
import { UserButton } from "../features/auth/components/user-button";
import { ThemeToggle } from "@/components/theme-toggle";

interface StandaloneLayoutProps {
  children: React.ReactNode;
}

const StandaloneLayout = ({ children }: StandaloneLayoutProps) => {
  return (
    <main className="bg-neutral-100 dark:bg-background min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex justify-between items-center h-[73px]">
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
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <UserButton />
          </div>
        </nav>
        <div className="flex flex-col items-center justify-center py-4">
          {children}
        </div>
      </div>
    </main>
  );
};

export default StandaloneLayout;
