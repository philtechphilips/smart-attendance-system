import Link from "../../../../node_modules/next/link";
import { LinkButtonProps } from "./LinkButton.types";

export default function LinkButton({
  href,
  external,
  children,
  ...anchorProps
}: LinkButtonProps) {
  if (external) {
    return (
      <a href={href} {...anchorProps}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} {...anchorProps}>
      {" "}
      {children}{" "}
    </Link>
  );
}
