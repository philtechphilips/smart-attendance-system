import React, {  ChangeEventHandler, useState } from "react";
import Image from "next/image";
import EyeIcon from "@/components/icons/EyeIcon";
import CancelIcon from "@/components/icons/CancelIcon";

interface InputProps  {
  label: string;
  type: string;
  name?: string;
  value?: string;
  placeholder?: string;
  showCancelIcon?: boolean;
  disabled?: boolean;
  min?: string | number;
  max?: string | number;
  handleChange?: ChangeEventHandler<HTMLInputElement>;
  handleCancelClick?: VoidFunction;
}

const TextInput = ({
  label,
  type,
  name,
  value,
  placeholder,
  handleChange,
  handleCancelClick,
  showCancelIcon,
  disabled,
  min,
  max,
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col space-y-2">
      <label>
        <span className="mb-8 text-xs font-medium">{label}</span>
      </label>
      <div className="relative">
        <input
          className="w-full px-4 h-14 rounded border border-gray-300 focus:outline-none focus:border-[#D69E77]"
          type={showPassword ? "text" : type}
          name={name}
          value={value ?? ''}
          placeholder={placeholder}
          onChange={handleChange}
          disabled={disabled}
          min={min}
          max={max}
        />
        {type === "password" && (
          <div
            className="absolute inset-y-0 right-0 flex items-center pr-4"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeIcon visible /> : <EyeIcon />}
          </div>
        )}
        {showCancelIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 cursor-pointer" onClick={handleCancelClick}>
            <CancelIcon />
          </div>
        )}
      </div>
    </div>
  );
};

export default TextInput;
