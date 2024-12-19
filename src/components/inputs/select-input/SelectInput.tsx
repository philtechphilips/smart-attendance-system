import React, { ChangeEventHandler } from "react";

interface Option {
  id: string | number;
  name: string;
}

interface InputProps {
  label: string;
  name?: string;
  value?: string | number;
  placeholder?: string;
  showCancelIcon?: boolean;
  options: Option[];
  disabled?: boolean;
  handleChange?: ChangeEventHandler<HTMLSelectElement>;
  handleCancelClick?: VoidFunction;
  errorMessage?: string | undefined | false;
}

const SelectInput = ({
  label,
  name,
  value,
  placeholder,
  handleChange,
  handleCancelClick,
  showCancelIcon,
  disabled,
  errorMessage,
  options,
}: InputProps) => {
  return (
    <div className="flex flex-col space-y-2 mt-6">
      <label>
        <span className="mb-8 text-sm font-medium">{label}</span>
      </label>
      <div className="relative">
        <select
          className="w-full px-4 h-14 rounded border border-gray-300 focus:outline-none focus:border-[#D69E77]"
          name={name}
          value={value ?? ""}
          onChange={handleChange}
          disabled={disabled}
        >
          {options &&
            options.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
        </select>
        {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default SelectInput;
