import React from "react";
import { BaseButtonProps } from "./BaseButton.types";
import { COLOURS } from "@/constants/colors";

export default function BaseButton(props: BaseButtonProps) {
  const { fit, outlined, className, disabled, ...restProps } = props;

  const backgroundColor = disabled
    ? COLOURS?.primary
    : outlined
      ? "transparent"
      : COLOURS?.primary;
  const textColor = outlined ? COLOURS?.primary : "white";
  const hasBoxShadow = backgroundColor === COLOURS?.primary;

  const buttonStyle = {
    backgroundColor: backgroundColor,
    color: textColor,
    boxShadow: hasBoxShadow ? "0px 1px 1px #4253F0" : "none",
  };

  return (
    <button
      {...restProps}
      className={`flex items-center justify-center gap-5 py-[14px] rounded-lg text-sm font-bold
      ${fit ? "w-[241px]" : "w-full"}
     ${outlined ? "border" : ""} ${className}`}
      style={buttonStyle}
      disabled={disabled}
    >
      {props.children}
    </button>
  );
}
