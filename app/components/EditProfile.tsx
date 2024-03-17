"use client";
import { getPresignedPost } from "@/app/actions/upload";
import { Avatar } from "@/app/components/Avatar";
import * as Icons from "@/app/components/Icons";
import type { Profile } from "@/app/core/contexts/account/profile";
import type { UserId } from "@/app/core/core";
import { upload } from "@/app/lib/s3";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";

export const EditProfile = ({
  action,
  profile,
  onSaved,
  currentUserId,
}: {
  action: (f: FormData) => Promise<undefined>;
  profile?: Profile | undefined;
  onSaved: () => void;
  currentUserId: UserId;
}) => {
  const avatarRef = useRef<HTMLInputElement>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl);
  const t = useTranslations("PROFILE");
  const { pending } = useFormStatus();

  return (
    <div>
      <input
        ref={avatarRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={(ev) => {
          if (ev.currentTarget.files && ev.currentTarget.files.length > 0) {
            setAvatarUrl(URL.createObjectURL(ev.currentTarget.files[0]));
            setAvatarFile(ev.currentTarget.files[0]);
          }
        }}
      />

      <form
        action={async (formData) => {
          if (avatarFile) {
            const config = await getPresignedPost("avatars");
            const avatarUrl = await upload(config, avatarFile);
            formData.append("avatarUrl", avatarUrl);
          }
          await action(formData);
          onSaved();
        }}
        className="mt-4 flex flex-col items-center p-4"
      >
        <div className="relative">
          <div
            className="absolute left-0 top-0 z-10 flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-full bg-gray-700/75 text-white opacity-0 hover:opacity-100"
            onClick={() => {
              avatarRef.current?.click();
            }}
          >
            <Icons.Camera />
            <div className="mt-2 text-xs">{t("AVATAR_LABEL")}</div>
          </div>
          <Avatar userId={currentUserId} src={avatarUrl} size="lg" />
        </div>
        <div className="mt-8 flex w-full flex-col">
          <input
            className="w-full rounded p-2 outline"
            defaultValue={profile?.name}
            name="name"
            type="text"
            placeholder={t("NAME_PLACEHOLDER")}
            required
          />
          <button
            className="mt-4 rounded border border-black bg-blue-600 p-2 text-white"
            type="submit"
            disabled={pending}
          >
            {t(profile ? "SAVE_BUTTON" : "CREATE_BUTTON")}
          </button>
        </div>
      </form>
    </div>
  );
};
