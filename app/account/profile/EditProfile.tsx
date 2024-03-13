"use client";
import { Avatar } from "@/app/components/Avatar";
import * as Icons from "@/app/components/Icons";
import type { Profile } from "@/app/core/contexts/account/profile";
import type { UserId } from "@/app/core/core";
import { useRef, useState } from "react";

export const EditProfile = ({
  action,
  profile,
  onSaved,
  currentUserId,
}: {
  action: (f: FormData) => Promise<undefined>;
  profile: Profile | undefined;
  onSaved: () => void;
  currentUserId: UserId;
}) => {
  const avatarRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl);

  return (
    <form
      action={async (formData) => {
        await action(formData);
        onSaved();
      }}
      className="mt-4 flex flex-col items-center p-4"
    >
      <input
        ref={avatarRef}
        name="avatarUrl"
        type="file"
        className="hidden"
        accept="image/*"
        onChange={(ev) => {
          if (ev.currentTarget.files && ev.currentTarget.files.length > 0) {
            setAvatarUrl(URL.createObjectURL(ev.currentTarget.files[0]));
          }
        }}
      />
      <div className="relative">
        <div
          className="absolute left-0 top-0 z-10 flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-full bg-gray-700/75 text-white opacity-0 hover:opacity-100"
          onClick={() => {
            avatarRef.current?.click();
          }}
        >
          <Icons.Camera />
          <div className="mt-2 text-xs">Change avatar</div>
        </div>
        <Avatar userId={currentUserId} src={avatarUrl} size="lg" />
      </div>
      <div className="ml-4 flex w-full flex-col">
        <label className="flex w-full flex-col">
          <span className="font-semibold">Name:</span>
          <input
            className="w-full rounded p-2 outline"
            defaultValue={profile?.name}
            name="name"
            type="text"
            required
          />
        </label>
        <button
          className="mt-4 rounded border border-black bg-blue-600 p-2 text-white"
          type="submit"
        >
          {profile ? "Save" : "Finish"}
        </button>
      </div>
    </form>
  );
};
