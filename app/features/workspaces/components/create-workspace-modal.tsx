"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { CreateWorkspaceForm } from "../components/create-workspace-form";

export const CreateWorkspaceModal = () => {
  return (
    <ResponsiveModal open onOpenChange={() => {}}>
      <CreateWorkspaceForm />
    </ResponsiveModal>
  );
};
