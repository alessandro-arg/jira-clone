"use client";

import { useEffect } from "react";
import { useCurrent } from "./features/auth/api/use-current";
import { useRouter } from "next/navigation";
import { useLogout } from "./features/auth/api/use-logout";
import { Button } from "@/components/ui/button";
import { UserButton } from "./features/auth/components/user-button";

export default function Home() {
  const router = useRouter();
  const { data, isLoading } = useCurrent();
  const { mutate } = useLogout();

  useEffect(() => {
    if (!data && !isLoading) {
      router.push("/sign-in");
    }
  }, [data]);

  return (
    <div>
      <UserButton />
    </div>
  );
}
