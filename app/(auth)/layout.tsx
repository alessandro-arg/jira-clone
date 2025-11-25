"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const pathname = usePathname();
  const { theme, systemTheme } = useTheme();

  const currentTheme = theme === "system" ? systemTheme : theme;

  const logoSrc = currentTheme === "dark" ? "/logo-dark.svg" : "/logo.svg";

  return (
    <main className="bg-neutral-100 dark:bg-background min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex justify-between items-center">
          <Image
            src={logoSrc}
            alt="logo"
            width={152}
            height={56}
            loading="eager"
            className="h-14 w-[152px]"
          />
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button asChild variant="secondary">
              <Link href={pathname === "/sign-in" ? "/sign-up" : "/sign-in"}>
                {pathname === "/sign-in" ? "Sign up" : "Login"}
              </Link>
            </Button>
          </div>
        </nav>
        <div className="flex flex-col items-center justify-center pt-4 md:pt-14">
          {children}
        </div>
      </div>
    </main>
  );
}
