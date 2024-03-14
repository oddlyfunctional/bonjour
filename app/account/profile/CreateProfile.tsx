"use client";

import { createProfile } from "@/app/actions/profile";
import { EditProfile } from "@/app/components/EditProfile";
import type { UserId } from "@/app/core/core";
import { redirect } from "next/navigation";

export const CreateProfile = ({ currentUserId }: { currentUserId: UserId }) => {
  return (
    <EditProfile
      currentUserId={currentUserId}
      action={createProfile}
      onSaved={() => {
        redirect("/chat");
      }}
    />
  );
};
