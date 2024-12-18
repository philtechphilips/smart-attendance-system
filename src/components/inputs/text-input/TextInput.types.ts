import { FormInputPayload } from "@/utils/types/global.types";
import { InputHTMLAttributes } from "react";

export type TextInputProps = {
  label?: string;
  labelColor?: boolean;
  onChange?: (payload: FormInputPayload) => void;
  validation?: any;
  validationTrigger?: string | null;
  type?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "onChange">;
