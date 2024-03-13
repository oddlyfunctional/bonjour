import type { UserId } from "@/app/core/core";
import Image from "next/image";

type Size = "sm" | "md" | "lg";

const getSizePx = (size: Size) => {
  switch (size) {
    case "sm":
      return "h-8 w-8";
    case "md":
      return "h-16 w-16";
    case "lg":
      return "h-32 w-32";
  }
};

interface Props
  extends Omit<React.ComponentProps<typeof Image>, "src" | "alt"> {
  userId: UserId;
  src?: string;
  alt?: string;
  size?: Size;
  position?: "relative" | "absolute" | "fixed" | "static" | "sticky";
}

export const Avatar = ({
  userId,
  src = `https://avatar.iran.liara.run/public?username=${userId}`,
  alt = "avatar",
  size = "md",
  position = "relative",
  className,
  ...props
}: Props) => {
  return (
    <div
      className={`${position} ${getSizePx(size)}${className ? " " + className : ""}`}
    >
      <Image
        src={src}
        alt={alt}
        className={`rounded-full object-cover ring-1`}
        fill
        {...props}
      ></Image>
    </div>
  );
};
