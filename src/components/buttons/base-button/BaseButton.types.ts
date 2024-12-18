import { HTMLAttributes } from "react";

export type BaseButtonProps = Omit<
  HTMLAttributes<HTMLButtonElement>,
  "className" | "type"
> & {
  type?: "button" | "submit" | "reset";
  fit?: boolean;
  outlined?: boolean;
  disabled?: boolean;
  className?: string;
};
