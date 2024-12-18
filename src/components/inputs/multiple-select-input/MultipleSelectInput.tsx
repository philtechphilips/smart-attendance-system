import React, { useState } from "react";
import { SelectInputProps } from "./SelectInput.types";
import styles from "../text-input/style.module.scss";

const MultipleSelectInput: React.FC<SelectInputProps> = ({
  label,
  options,
  labelColor,
  onChange = () => {},
  ...rest
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (value: string) => {
    if (selectedOptions.includes(value)) {
      setSelectedOptions(selectedOptions.filter((option) => option !== value));
    } else {
      setSelectedOptions([...selectedOptions, value]);
    }
  };

  return (
    <div className={styles.text_input_container}>
      <label
        className={styles.text_input_container_label}
        style={{ color: labelColor ? "#239fac" : "000" }}
      >
        {label}
      </label>
      <div className={styles.custom_select_container} onClick={toggleDropdown}>
        <div
          className={`${styles.select_button} ${isOpen ? styles.active : ""}`}
        >
          {selectedOptions.length === 0 ? "Select" : selectedOptions.join(", ")}
        </div>
        {isOpen && (
          <div className={styles.dropdown}>
            {options.map((option, index) => (
              <div key={index} className={styles.option}>
                <input
                  type="checkbox"
                  value={option.value}
                  checked={selectedOptions.includes(option.value)}
                  onChange={() => handleOptionClick(option.value)}
                />
                <label>{option.label}</label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultipleSelectInput;
