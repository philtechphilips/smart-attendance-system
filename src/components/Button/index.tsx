import React, { ReactNode } from "react";
import LoaderIcon from "../icons/LoaderIcon";

interface ButtonProp {
  text: any;
  type: string;
  styles?: string;
  position: string;
  disabled?: boolean;
  handleClick?: VoidFunction;
  isLoading?: boolean;
  props?: ReactNode;
  background?: string;
  children?: ReactNode;
  shadow?: string;
}

const Button = ({
  text,
  styles,
  type,
  position,
  shadow,
  disabled,
  background,
  isLoading,
  handleClick,
  ...props
}: ButtonProp) => {
  const hasChildren = props && props.children;
  return (
    <div className={position}>
      <button
        className={`${background || "bg-[#E5B611]"} py-3 px-18 w-44 rounded text-sm font-semibold leading-6 ${shadow || "shadow-xl"} ${styles} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={handleClick}
        disabled={disabled}
        {...props}
      >
        {isLoading ? (
          <LoaderIcon />
        ) : (
          <>
            {hasChildren ? (
              <>
                {text}
                {props.children}
              </>
            ) : (
              text
            )}
          </>
        )}
      </button>
    </div>
  );
};

export default Button;
