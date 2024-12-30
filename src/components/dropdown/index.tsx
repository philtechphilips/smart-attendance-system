import React, { useState } from "react";

interface DropdownFilterProps {
  label: string;
  options: { label: string; value: string }[];
  selectedValue: string;
  onChange: (value: string) => void;
}

const DropdownFilter: React.FC<DropdownFilterProps> = ({
  label,
  options,
  selectedValue,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      <button
        type="button"
        className="inline-flex justify-between w-40 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
        onClick={toggleDropdown}
      >
        {label}: {options.find((opt) => opt.value === selectedValue)?.label}
        <i className="ri-arrow-drop-down-line" aria-hidden="true"></i>
      </button>

      {isOpen && (
        <div className="absolute right-0 w-48 mt-2 top-12 z-[10000] bg-white border border-gray-300 divide-y divide-gray-100 rounded-md shadow-lg">
          {options.map((option) => (
            <button
              key={option.value}
              className={`block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 ${
                selectedValue === option.value
                  ? "bg-gray-200 font-semibold"
                  : ""
              }`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownFilter;
