import { Result, error, ok } from "@/app/lib/result";
import { forwardRef, type ForwardedRef } from "react";

export type Error = "FileTooLarge";

interface Props
  extends Omit<React.ComponentProps<"input">, "onChange" | "type"> {
  maxSize?: number;
  onChange: (file: Result<File, Error>) => void;
}

export const FilePicker = forwardRef(
  (
    { maxSize, onChange, ...props }: Props,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    return (
      <input
        ref={ref}
        type="file"
        onChange={(ev) => {
          if (ev.currentTarget.files && ev.currentTarget.files.length > 0) {
            const file = ev.currentTarget.files[0];
            if (maxSize !== undefined && file.size > maxSize) {
              onChange(error("FileTooLarge"));
            } else {
              onChange(ok(file));
            }
          }
        }}
        {...props}
      />
    );
  },
);
