import type { UserId } from "@/app/core/core";
import Image from "next/image";

type Size = "sm" | "md" | "lg";

const getSizeProps = (
  size: Size,
): [`${number}px`, `h-${number} w-${number}`] => {
  switch (size) {
    case "sm":
      return ["32px", "h-8 w-8"];
    case "md":
      return ["64px", "h-16 w-16"];
    case "lg":
      return ["128px", "h-32 w-32"];
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
  const [sizes, containerSizeClassName] = getSizeProps(size);
  return (
    <div
      className={`${position} ${containerSizeClassName}${className ? " " + className : ""}`}
    >
      <Image
        src={src}
        alt={alt}
        className={`rounded-full object-cover ring-1`}
        fill
        sizes={sizes}
        {...props}
      ></Image>
    </div>
  );
};
